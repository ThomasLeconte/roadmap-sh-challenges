import Order from "../src/data/models/order";
import SeatReservation from "../src/data/models/seat-reservation";
import AbstractApiClient from "./abstract-api-client";

export default class PaypalApiClient extends AbstractApiClient {
    private clientId: string;
    private secretKey: string;
    private token?: string;

    constructor() {
        super();
        if(!process.env.PAYPAL_API_KEY) {
            throw new Error('PAYPAL_API_KEY env variable is not set!');
        }
        if(!process.env.PAYPAL_CLIENT_ID) {
            throw new Error('PAYPAL_CLIENT_ID env variable is not set!');
        }
        this.clientId = process.env.PAYPAL_CLIENT_ID;
        this.secretKey = process.env.PAYPAL_API_KEY;
    }

    getToken() {
        if(!this.token) {
            return this.login();
        }

        return Promise.resolve(this.token);
    }

    login() {
        console.log('Logging in to PayPal:', this.clientId, this.secretKey);

        return fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.secretKey}`).toString('base64')}`
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials'
            }).toString()
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to login to PayPal');
            }
            return res.json();
        }).then(data => {
            console.log('Logged in to PayPal:', data);
            this.token = data.access_token;
            return data.access_token;
        }).catch(err => {
            console.error('Failed to login to PayPal:', err);
        })
    }

    createOrder(order: Order, reservations: SeatReservation[]) {
        return this.getToken().then(token => {

            const host = process.env.HOST || 'http://localhost:3000';
            const successUrl = `${host}/order/success`;
            const cancelUrl = `${host}/order/cancel`;

            return fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: 'USD',
                                value: order.total.toFixed(2)
                            }
                        }
                    ],
                    payment_source: {
                        paypal: {
                            experience_context: {
                                brand_name: 'Movie Reservation',
                                locale_code: 'fr-FR',
                                user_action: 'PAY_NOW',
                                payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                                return_url: successUrl,
                                cancel_url: cancelUrl
                            }
                        }
                    }
                })
            }).then(res => {
                if(!res.ok) {
                    throw new Error('Failed to create order');
                }
                return res.json();
            }).then(data => {
                console.log('Order created:', data);
                return data;
            }).catch(err => {
                console.error('Failed to create order:', err);
            })
        });
    }

    confirmOrder(paypalOrderId: string) {
        return this.getToken().then(token => {
            return fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                if(!res.ok) {
                    throw new Error('Failed to confirm order');
                }
                return res.json();
            }).then(data => {
                console.log('Order confirmed:', data);
                return data;
            }).catch(err => {
                console.error('Failed to confirm order:', err);
            })
        });
    }
}