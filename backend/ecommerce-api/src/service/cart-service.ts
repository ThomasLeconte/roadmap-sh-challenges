import StripeApiClient from "../client/stripe-api-client";
import Cart from "../data/models/cart";
import CartProduct from "../data/models/cart-product";
import CartProductRepository from "../data/repository/cart-product-repository";
import CartRepository from "../data/repository/cart-repository";
import ProductRepository from "../data/repository/product-repository";
import UserRepository from "../data/repository/user-repository";
import OrderService from "./order-service";

export default class CartService {
    private stripeApiClient: StripeApiClient;
    private userRepository: UserRepository;
    private cartRepository: CartRepository;
    private cartProductRepository: CartProductRepository;
    private productRepository: ProductRepository;
    private orderService: OrderService;

    constructor(){
        this.stripeApiClient = new StripeApiClient();
        this.userRepository = new UserRepository();
        this.cartRepository = new CartRepository();
        this.cartProductRepository = new CartProductRepository();
        this.productRepository = new ProductRepository();
        this.orderService = new OrderService();
    }

    async addToCart(productId: string, userId: number, quantity: number) {

        const product = await this.productRepository.findOneBy({stripeId: productId});
        if(!product) {
            throw new Error('Product not found');
        }

        let cart = await this.cartRepository.findOneBy({userId});
        if(!cart) {
            cart = await this.cartRepository.create(new Cart(0, userId, new Date()));
        }

        const potentialCartProduct = await this.cartProductRepository.findOneBy({cartId: cart.id, productId: product.id});
        if(potentialCartProduct) {
            potentialCartProduct.quantity += quantity;
            return this.cartProductRepository.update(potentialCartProduct);
        } else {
            return this.cartProductRepository.create(new CartProduct(0, cart.id, product.id, quantity, new Date()));
        }
    }

    removeFromCart(productId: string, userId: number) {
        return this.productRepository.findOneBy({stripeId: productId}).then(product => {
            if(!product) {
                throw new Error('Product not found');
            }

            return this.cartRepository.findOneBy({userId}).then(cart => {
                if(!cart) {
                    throw new Error('Cart not found');
                }

                return this.cartProductRepository.findOneBy({cartId: cart.id, productId: product.id}).then(cartProduct => {
                    if(!cartProduct) {
                        throw new Error('Product not in cart');
                    }

                    return this.cartProductRepository.delete(cartProduct.id);
                });
            });
        });
    }

    getCart(userId: number) {
        return this.cartRepository.findOneBy({userId}).then(cart => {
            if(!cart) {
                return [];
            }

            return this.cartProductRepository.findBy({cartId: cart.id}).then(cartProducts => {
                return Promise.all(cartProducts.map(cartProduct => {
                    return this.productRepository.findById(cartProduct.productId).then(product => {
                        return {
                            product,
                            quantity: cartProduct.quantity
                        }
                    });
                }));
            });
        });
    }

    checkout(userId: number) {

        const host = 'localhost:3000';
        const redirect_uri = `${host}/order/pay`;

        return this.userRepository.findById(userId).then(async (user) => {
            if(!user) {
                throw new Error('User not found');
            } else if(!user.stripeId) {
                const stripeUser = await this.stripeApiClient.createCustomer(user.email);
                if(!stripeUser) {
                    throw new Error('Failed to create stripe user');
                }
                user.stripeId = stripeUser.id;
                await this.userRepository.update(user);
            }
            return user;
        }).then(async (user) => {

            const paymentMethods = await this.stripeApiClient.getPaymentMethods(user.stripeId);
            let paypalMethod = paymentMethods.data.find((pm: any) => pm.type === 'paypal');
            if(!paypalMethod) {
                paypalMethod = await this.stripeApiClient.createPaypalPaymentMethod(user.stripeId);
            }

            return this.cartRepository.findOneBy({userId})
                .then(cart => {
                    if(!cart) {
                        throw new Error('Cart not found');
                    }

                    return this.cartProductRepository.findBy({cartId: cart.id})
                        .then(cartProducts => {
                            if(cartProducts.length === 0) {
                                throw new Error('Cart is empty');
                            }

                            return Promise.all(cartProducts.map(cartProduct => {
                                return this.productRepository.findById(cartProduct.productId).then(product => {
                                    if(!product) {
                                        throw new Error('Product not found');
                                    }

                                    return product;
                                });
                            })).then(products => {
                                const amount = products.reduce((total, product) => total + product.price * (cartProducts.find(cp => cp.productId === product.id)?.quantity!) || 1, 0);
                                
                                return this.stripeApiClient.createPaymentIntent(paypalMethod.id, user.stripeId, amount, 'eur').then((intent) => {
                                    return this.orderService.createOrderFromCart(intent.id, cart, cartProducts).then(() => {
                                        return this.stripeApiClient.confirmPaymentIntent(intent.id, redirect_uri).then((confirmation) => {
                                            return confirmation.next_action.redirect_to_url.url;
                                        });
                                    });
                                });
                            });
                        });
                });
        });    
    }

    clearCart(userId: number) {
        return this.cartRepository.findOneBy({userId}).then(cart => {
            if(!cart) {
                throw new Error('Cart not found');
            }

            return this.cartProductRepository.findBy({cartId: cart.id}).then(cartProducts => {
                return Promise.all(cartProducts.map(cartProduct => {
                    return this.cartProductRepository.delete(cartProduct.id);
                }));
            });
        });
    }
}