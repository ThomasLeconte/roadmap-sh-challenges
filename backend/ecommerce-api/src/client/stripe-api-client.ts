import AbstractApiClient from "./abstract-api-client";

export default class StripeApiClient extends AbstractApiClient {
    private apiKey: string;

    constructor() {
        super();
        if(!process.env.STRIPE_API_KEY) {
            throw new Error('STRIPE_API_KEY env variable is not set!');
        }
        this.apiKey = process.env.STRIPE_API_KEY;
        // console.debug('Stripe API Key:', this.apiKey);
    }

    createProduct(name: string, description: string, price: number) {
        console.debug('Creating product:', name, description, price);

        return fetch('https://api.stripe.com/v1/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: new URLSearchParams({
                name,
                description
            }).toString()
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to create product');
            }
            return res.json();
        }).then(product => {
            console.debug('Product created successfully:', product);
            this.createPrice(product.id, price);
            return product;
        }).catch(err => {
            console.error('Failed to create product:', err);
        });
    }

    createPrice(productId: string, price: number) {
        console.debug('Creating price:', productId, price);

        fetch('https://api.stripe.com/v1/prices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: new URLSearchParams({
                product: productId,
                unit_amount: price.toString(),
                currency: 'usd'
            }).toString()
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to create price');
            }
            return res.json();
        }).then(price => {
            console.debug('Price created successfully:', price);
            this.invalidateCache('https://api.stripe.com/v1/products');
        }).catch(err => {
            console.error('Failed to create price:', err);
        });
    }

    getProducts() {
        console.debug('Getting products');

        return this.get('https://api.stripe.com/v1/products', {authToken: this.apiKey});
    }

    getProduct(id: string) {
        console.debug('Getting product:', id);

        return this.get(`https://api.stripe.com/v1/products/${id}`, {authToken: this.apiKey});
    }

    getPaymentIntent(id: string) {
        console.debug('Getting payment intent:', id);

        return this.get(`https://api.stripe.com/v1/payment_intents/${id}`, {authToken: this.apiKey, refreshCache: true});
    }

    createPaymentIntent(paymentMethodId: string, customerId: string, amount: number, currency: string) {
        console.debug('Creating payment intent:', amount, currency);

        return fetch(`https://api.stripe.com/v1/payment_intents?amount=${amount}&currency=${currency}&customer=${customerId}&payment_method=${paymentMethodId}&payment_method_types[]=paypal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.apiKey}`
            }
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to create payment intent');
            }
            return res.json();
        }).then(paymentIntent => {
            console.debug('Payment intent created successfully:', paymentIntent);
            return paymentIntent;
        }).catch(err => {
            console.error('Failed to create payment intent:', err);
            throw err;
        });
    }

    confirmPaymentIntent(paymentIntentId: string, redirect_uri: string) {
        console.debug('Creating payment link:', paymentIntentId);

        return fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}/confirm?return_url=${redirect_uri}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.apiKey}`
            }
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to create payment link');
            }
            return res.json();
        }).then(paymentLink => {
            console.debug('Payment link created successfully:', paymentLink);
            return paymentLink;
        }).catch(err => {
            console.error('Failed to create payment link:' + err.message, err);
            throw err;
        });
    }

    createCustomer(email: string) {
        console.debug('Creating customer:', email);

        return fetch('https://api.stripe.com/v1/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: new URLSearchParams({
                email
            }).toString()
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to create customer');
            }
            return res.json();
        }).then(customer => {
            console.debug('Customer created successfully:', customer);
            return customer;
        }).catch(err => {
            console.error('Failed to create customer:', err);
            throw err;
        });
    }

    getPaymentMethods(stripeCustomerId: string) {
        console.debug('Getting payment method:', stripeCustomerId);

        return fetch(`https://api.stripe.com/v1/payment_methods?customer=${stripeCustomerId}`, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to get payment method');
            }
            return res.json();
        }).then(paymentMethod => {
            console.debug('Payment method:', paymentMethod);
            return paymentMethod;
        }).catch(err => {
            console.error('Failed to get payment method:', err);
            throw err;
        });
    }

    createPaypalPaymentMethod(stripeId: string) {
        console.debug('Creating paypal payment method:', stripeId);

        return fetch(`https://api.stripe.com/v1/payment_methods`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: new URLSearchParams({
                type: 'paypal'
            }).toString()
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to create paypal payment method');
            }
            return res.json();
        }).then(paymentMethod => {
            console.debug('Paypal payment method:', paymentMethod);
            return this.attachPaymentMethod(paymentMethod.id, stripeId);;
        }).catch(err => {
            console.error('Failed to create paypal payment method:', err);
            throw err;
        });
    }

    attachPaymentMethod(paymentMethodId: string, customerId: string) {
        console.debug('Attaching payment method:', paymentMethodId, customerId);

        return fetch(`https://api.stripe.com/v1/payment_methods/${paymentMethodId}/attach?customer=${customerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.apiKey}`
            }
        }).then(res => {
            if(!res.ok) {
                throw new Error('Failed to attach payment method');
            }
            return res.json();
        }).then(attachment => {
            console.debug('Payment method attached:', attachment);
            return attachment;
        }).catch(err => {
            console.error('Failed to attach payment method:', err);
            throw err;
        });
    }

    capturePayment(paymentId: string) {
        console.debug('Capturing payment:', paymentId);

        return fetch(`https://api.stripe.com/v1/payment_intents/${paymentId}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.apiKey}`
            }
        }).then(res => {
            console.log(res);
            if(!res.ok) {
                if(res.status === 400) {
                    return res.json().then(body => {
                        console.error('Failed to capture payment:', body.error);
                        throw new Error(body.error.message);
                    });
                } else {
                    throw new Error('Failed to capture payment');
                }
            }
            return res.json();
        }).then(payment => {
            console.debug('Payment captured:', payment);
            return payment;
        }).catch(err => {
            console.error('Failed to capture payment:', err);
            throw err;
        });
    }
}