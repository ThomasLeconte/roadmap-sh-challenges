import StripeApiClient from "../client/stripe-api-client";
import Product from "../data/models/product";
import ProductRepository from "../data/repository/product-repository";
import QueryBuilder from "../data/repository/query-builder";

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

    searchProducts(query: string | undefined) {
        if(!query) {
            return this.getProducts();
        } else {
            const request = new QueryBuilder('product')
            .whereLike('name', query)
            .orderBy('name', 'ASC')
            .build();
            return this.productRepository.query(request, [], Product);
        }
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