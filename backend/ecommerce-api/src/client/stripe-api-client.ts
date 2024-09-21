import AbstractApiClient from "./abstract-api-client";

export default class StripeApiClient extends AbstractApiClient {
    private apiKey: string;

    constructor() {
        super();
        if(!process.env.STRIPE_API_KEY) {
            throw new Error('STRIPE_API_KEY env variable is not set!');
        }
        this.apiKey = process.env.STRIPE_API_KEY;
        console.debug('Stripe API Key:', this.apiKey);
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
}