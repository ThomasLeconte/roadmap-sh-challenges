import { randomUUID } from "crypto";
import Order from "../data/models/order";
import SeatReservation from "../data/models/seat-reservation";
import MovieRepository from "../data/repository/movie-repository";
import MovieSessionRepository from "../data/repository/movie-session-repository";
import OrderRepository from "../data/repository/order-repository";
import SeatRepository from "../data/repository/seat-repository";
import SeatReservationRepository from "../data/repository/seat-reservation-repository";
import FunctionnalError from "../exceptions/functionnal-error";
import NotFoundError from "../exceptions/not-found-error";
import ForbiddenError from "../exceptions/forbidden-error";
import PaypalApiClient from "../../client/paypal-api-client";

export default class OrderService {
    orderRepository: OrderRepository;
    seatRepository: SeatRepository;
    seatReservationRepository: SeatReservationRepository;
    movieSessionRepository: MovieSessionRepository;
    movieRepository: MovieRepository;
    paypalApiClient: PaypalApiClient;

    constructor() {
        this.orderRepository = new OrderRepository();
        this.seatRepository = new SeatRepository();
        this.seatReservationRepository = new SeatReservationRepository();
        this.movieSessionRepository = new MovieSessionRepository();
        this.movieRepository = new MovieRepository();
        this.paypalApiClient = new PaypalApiClient();
    }

    async getOrders() {
        return await this.orderRepository.findAll();
    }

    async getOrderById(id: number) {
        return await this.orderRepository.findById(id);
    }

    async getOrdersByMovieSessionId(movieSessionId: number) {
        return await this.orderRepository.findBy({movieSessionId});
    }

    async getOrdersByUserId(userId: number) {
        return await this.orderRepository.findBy({userId});
    }

    async createOrder(movieSessionId: number, userId: number, seats: string[]) {
        const movieSession = await this.movieSessionRepository.findById(movieSessionId);
        if(!movieSession) {
            throw new NotFoundError('Movie session not found');
        }
    
        //CHECK SEATS AVAILABILITY
        for(const seatCode of seats) {

            const seat = await this.seatRepository.findOneBy({movieRoomId: movieSession.movieRoomId, code: seatCode});
            if(!seat) {
                throw new NotFoundError('Seat not found');
            }

            const seatReservation = await this.seatReservationRepository.findOneBy({seatId: seat.id, movieSessionId});
            if(seatReservation) {
                throw new FunctionnalError('Seat already taken');
            }
        }

        // CREATE ORDER
        const pricePerSeat = 10
        const order = await this.orderRepository.save(new Order(0, randomUUID(), movieSessionId, userId, pricePerSeat * seats.length, new Date()));

        // CREATE SEAT RESERVATIONS
        let reservations = [];
        for(const seatCode of seats) {
            const seat = await this.seatRepository.findOneBy({movieRoomId: movieSession.movieRoomId, code: seatCode});
            if(!seat) {
                throw new NotFoundError('Seat not found');
            }
            reservations.push(await this.seatReservationRepository.save(new SeatReservation(0, seat.id, movieSessionId, order.id, new Date())));
        }

        const paypalOrder = await this.paypalApiClient.createOrder(order, reservations);

        return {order, reservations, paypalLink: paypalOrder.links.find((link: any) => link.rel === 'payer-action').href};
    }

    async deleteOrder(orderId: number, userId: number) {
        this.orderRepository.findById(orderId)
        .then((order) => {
            if(!order) {
                throw new NotFoundError('Order not found');
            }

            if(order.userId != userId) {
                throw new ForbiddenError('Cannot delete order from another user');
            }

            this.seatReservationRepository.deleteBy({orderId}).then(() => {
                this.orderRepository.delete(orderId);
            });
        });
    }
}