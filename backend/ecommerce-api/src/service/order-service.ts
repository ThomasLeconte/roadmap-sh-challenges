import StripeApiClient from "../client/stripe-api-client";
import Cart from "../data/models/cart";
import CartProduct from "../data/models/cart-product";
import Order from "../data/models/order";
import OrderItem from "../data/models/order-item";
import OrderItemRepository from "../data/repository/order-item-repository";
import OrderRepository from "../data/repository/order-repository";
import ProductRepository from "../data/repository/product-repository";
import UserRepository from "../data/repository/user-repository";

export default class OrderService {
    private stripeApiClient: StripeApiClient;
    private orderRepository: OrderRepository;
    private orderItemRepository: OrderItemRepository;
    private productRepository: ProductRepository;
    private userRepository: UserRepository;

    constructor(){
        this.stripeApiClient = new StripeApiClient();
        this.orderRepository = new OrderRepository();
        this.orderItemRepository = new OrderItemRepository();
        this.productRepository = new ProductRepository();
        this.userRepository = new UserRepository();
    }

    async createOrderFromCart(paymentIntentId: string, cart: Cart, cartProducts: CartProduct[]) {
        const order = await this.orderRepository.create(new Order(0, cart.userId, paymentIntentId, 'CREATED', new Date(), new Date()));
        for(const cartProduct of cartProducts) {
            const product = await this.productRepository.findById(cartProduct.productId);
            if(!product) {
                throw new Error('Product not found');
            }
            await this.orderItemRepository.create(new OrderItem(0, order.id, cartProduct.productId, cartProduct.quantity, product.price, new Date(), new Date()));
        }
        return order;
    }

    async payOrder(paymentId: string){

        return this.stripeApiClient.getPaymentIntent(paymentId).then(paymentIntent => {
            if(!paymentIntent) {
                throw new Error('Payment intent not found');
            }

            return this.userRepository.findOneBy({stripeId: paymentIntent.customer}).then(user => {
                if(!user) {
                    throw new Error('User not found');
                }
    
                return this.orderRepository.findOneBy({paymentIntentId: paymentId, userId: user.id}).then(order => {
                    if(!order) {
                        throw new Error('Order not found');
                    }

                    order.status = 'PAID';

                    return this.orderRepository.update(order).then((order) => {
                        return user;
                        // return this.stripeApiClient.capturePayment(paymentId).then((paymentIntent) => {
                        //     order.status = 'PAID';
                        //     return this.orderRepository.update(order).then(() => {
                        //         return user;
                        //     })
                        // });
                    });
                });
            });
        });
    }
}