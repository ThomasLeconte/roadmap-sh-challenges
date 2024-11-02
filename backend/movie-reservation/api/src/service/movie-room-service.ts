import MovieRoom from "../data/models/movie-room";
import Seat from "../data/models/seat";
import MovieRoomRepository from "../data/repository/movie-room-repository";
import SeatRepository from "../data/repository/seat-repository";

export default class MovieRoomService {
    movieRoomRepository: MovieRoomRepository;
    seatRepository: SeatRepository;

    constructor() {
        this.movieRoomRepository = new MovieRoomRepository();
        this.seatRepository = new SeatRepository();
    }

    async getMovieRooms() {
        return await this.movieRoomRepository.findAll();
    }

    async getMovieRoomById(id: number) {
        return await this.movieRoomRepository.findById(id);
    }

    async createMovieRoom(name: string, capacity: number, rows: number = 10, is3d: boolean = false, is4dx: boolean = false, isImax: boolean = false, isDbox: boolean = false) {
        if(!name) {
            throw new Error('Name is required');
        }

        if(capacity <= 0 || rows <= 0) {
            throw new Error('Capacity and rows must be greater than 0');
        }
        
        if(capacity < rows) {
            throw new Error('Capacity must be greater or equal to rows');
        }

        if(capacity % rows !== 0) {
            throw new Error('Capacity must be divisible by rows');
        }

        if(rows > 26) {
            throw new Error('Rows must be less than 26');
        }

        const movieRoom = await this.movieRoomRepository.save(new MovieRoom(0, name, capacity, is3d, is4dx, isImax, isDbox, new Date()));

        const rowNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const seatsPerRow = Math.floor(capacity / rows);

        let seats = [];

        for (let i = 1; i <= rows; i++) {
            let rowName = rowNames[i - 1];
            for (let j = 1; j <= seatsPerRow; j++) {
                const code = `${rowName}${j}`;
                seats.push(await this.seatRepository.save(new Seat(0, code, i, movieRoom.id, new Date())));
            }
        }

        return { movieRoom, seats };
    }

    async updateMovieRoom(id: number, name: string, capacity: number) {
        // const movieRoom = new MovieRoom(id, name, capacity, new Date());
        // return await this.movieRoomRepository.update(movieRoom);
    }

    async deleteMovieRoom(id: number) {
        return await this.movieRoomRepository.delete(id);
    }
}