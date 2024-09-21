import StripeApiClient from "../client/stripe-api-client";

export default class ProductService {
    private stripeApiClient: StripeApiClient;

    constructor(){
        this.stripeApiClient = new StripeApiClient();
    }

    getProducts() {
        return this.stripeApiClient.getProducts();
    }

    getProduct(id: string) {
        return this.stripeApiClient.getProduct(id);
    }

    createProduct(name: string, description: string, price: number) {
        return this.stripeApiClient.createProduct(name, description, price)
    }
}