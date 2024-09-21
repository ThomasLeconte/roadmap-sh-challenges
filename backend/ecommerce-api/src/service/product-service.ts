import StripeApiClient from "../client/stripe-api-client";
import Product from "../data/models/product";
import ProductRepository from "../data/repository/product-repository";

export default class ProductService {
    private stripeApiClient: StripeApiClient;
    private productRepository: ProductRepository;

    constructor(){
        this.stripeApiClient = new StripeApiClient();
        this.productRepository = new ProductRepository();
    }

    getProducts() {
        return this.stripeApiClient.getProducts();
    }

    getProduct(id: string) {
        return this.stripeApiClient.getProduct(id);
    }

    createProduct(name: string, description: string, price: number) {
        return this.stripeApiClient.createProduct(name, description, price).then((stripeProduct) => {
            return this.productRepository.create(new Product(
                0,
                stripeProduct.id,
                name,
                price,
                description,
                '',
                new Date()
            ));
        })
    }
}