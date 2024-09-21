import Cart from "../data/models/cart";
import CartProduct from "../data/models/cart-product";
import CartProductRepository from "../data/repository/cart-product-repository";
import CartRepository from "../data/repository/cart-repository";
import ProductRepository from "../data/repository/product-repository";

export default class CartService {
    private cartRepository: CartRepository;
    private cartProductRepository: CartProductRepository;
    private productRepository: ProductRepository;

    constructor(){
        this.cartRepository = new CartRepository();
        this.cartProductRepository = new CartProductRepository();
        this.productRepository = new ProductRepository();
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
}