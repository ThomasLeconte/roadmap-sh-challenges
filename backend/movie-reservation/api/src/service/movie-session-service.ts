import MovieSession from "../data/models/movie-session";
import MovieRepository from "../data/repository/movie-repository";
import MovieRoomRepository from "../data/repository/movie-room-repository";
import MovieSessionRepository from "../data/repository/movie-session-repository";
import SeatRepository from "../data/repository/seat-repository";
import SeatReservationRepository from "../data/repository/seat-reservation-repository";
import NotFoundError from "../exceptions/not-found-error";

export default class MovieSessionService {
    movieSessionRepository: MovieSessionRepository;
    movieRepository: MovieRepository;
    movieRoomRepository: MovieRoomRepository;
    seatRepository: SeatRepository;
    seatReservationRepository: SeatReservationRepository;

    constructor() {
        this.movieSessionRepository = new MovieSessionRepository();
        this.movieRepository = new MovieRepository();
        this.movieRoomRepository = new MovieRoomRepository();
        this.seatRepository = new SeatRepository();
        this.seatReservationRepository = new SeatReservationRepository();
    }

    async getMovieSessions() {
        return await this.movieSessionRepository.findAll()
            .then(async (movieSessions) => {
                // @ts-ignore
                return await Promise.all(movieSessions.map(async (movieSession) => {
                    return await this.toDto(movieSession);
                }));
            });
    }

    async getMovieSessionById(id: number) {
        return await this.movieSessionRepository.findById(id)
            .then(async (movieSession) => {
                if(!movieSession)
                    throw new NotFoundError('Movie session not found');

                return await this.toDto(movieSession);
            });
    }

    async getMovieSessionsByMovieId(movieId: number) {
        return await this.movieSessionRepository.findBy({movieId})
            .then(async (movieSessions) => {
                // @ts-ignore
                return await Promise.all(movieSessions.map(async (movieSession) => {
                    return await this.toDto(movieSession);
                }));
            });
    }

    async createMovieSession(movieId: number, movieRoomId: number, startDate: Date, endDate: Date) {
        const movie = await this.movieRepository.findById(movieId);
        if(!movie)
            throw new NotFoundError('Movie not found');

        const movieRoom = await this.movieRoomRepository.findById(movieRoomId);
        if(!movieRoom)
            throw new NotFoundError('Movie room not found');

        const movieSession = new MovieSession(0, movieId, movieRoomId, startDate, endDate, new Date());

        return await this.movieSessionRepository.save(movieSession);
    }

    async updateMovieSession(id: number, movieId: number, movieRoomId: number, date: Date) {
        const movieSession = await this.movieSessionRepository.findById(id);
        if(!movieSession)
            throw new NotFoundError('Movie session not found');

        const movie = await this.movieRepository.findById(movieId);
        if(!movie)
            throw new NotFoundError('Movie not found');

        const movieRoom = await this.movieRoomRepository.findById(movieRoomId);
        if(!movieRoom)
            throw new NotFoundError('Movie room not found');

        movieSession.movieId = movieId;
        movieSession.movieRoomId = movieRoomId;
        movieSession.startDate = date;
        movieSession.updatedAt = new Date();

        return await this.movieSessionRepository.update(movieSession);
    }

    async initMovieSessions(movieId: number, startInterval: number, endInterval: number) {
        const movie = await this.movieRepository.findById(movieId);
        if(!movie)
            throw new NotFoundError('Movie not found');

        const movieRooms = await this.movieRoomRepository.findAll();
        if(movieRooms.length === 0)
            throw new NotFoundError('Movie rooms not found');

        const movieSessions = [];

        const startHour = 10;
        const endHour = 20;
        const startDate = new Date(startInterval);
        startDate.setHours(startHour, 0, 0)
        const endDate = new Date(endInterval);
        endDate.setHours(endHour, 0, 0);

        console.log('start interval date', startDate);
        console.log('end interval date', endDate);

        const pauseBetweenSessions = 15;

        let nextDate = new Date(startDate);

        while(nextDate < endDate) {

            console.log('next session date', nextDate);

            let lastMovieRoomId = null;

            while(nextDate.getHours() < endHour) {

                // set start date of session
                let sessionStartDate = new Date(nextDate.getTime() + (1000 * 60 * pauseBetweenSessions));
                let sessionEndDate = new Date(sessionStartDate.getTime() + movie.duration);

                // console.log('session start date', sessionStartDate);
                // console.log('session end date', sessionEndDate);

                // search for available room
                let availableRoom = null;
                for(let movieRoom of movieRooms) {
                    if(lastMovieRoomId === movieRoom.id)
                        continue;

                    const roomSessions = (await this.getMovieSessionsByRoom(movieRoom.id)).filter(session => {
                        const existingSessionStartDate = new Date(session.startDate);
                        // console.log('existing session start date', session.startDate);
                        return existingSessionStartDate.getDate() === sessionStartDate.getDate()
                        && existingSessionStartDate.getMonth() === sessionStartDate.getMonth()
                        && existingSessionStartDate.getFullYear() === sessionStartDate.getFullYear()
                    })

                    if(roomSessions.length === 0) {
                        availableRoom = movieRoom;
                        break;
                    } else {
                        let isAvailable = true;
                        for(let session of roomSessions) {
                            if(new Date(session.startDate).getHours() === sessionStartDate.getHours()) {
                                isAvailable = false;
                                break;
                            }
                        }

                        if(isAvailable) {
                            availableRoom = movieRoom;
                            break;
                        }
                    }
                }

                if(availableRoom) {
                    lastMovieRoomId = availableRoom.id;
                    const movieSession = new MovieSession(0, movieId, availableRoom.id, sessionStartDate, sessionEndDate, new Date());
                    movieSessions.push(await this.movieSessionRepository.save(movieSession));
                }

                nextDate = new Date(sessionEndDate);
            }


            // increment date by 1 day (if it's friday, increment by 3 days)
            nextDate.getDay() === 5
            ? nextDate.setDate(nextDate.getDate() + 3) 
            : nextDate.setDate(nextDate.getDate() + 1);

            nextDate.setHours(startHour, 0, 0);
        }

        return movieSessions.map(async (movieSession) => {
            return await this.toDto(movieSession);
        });
    }

    async getMovieSessionsByRoom(movieRoomId: number) {
        return await this.movieSessionRepository.findBy({movieRoomId})
            .then(async (movieSessions) => {
                // @ts-ignore
                return await Promise.all(movieSessions.map(async (movieSession) => {
                    return await this.toDto(movieSession);
                }));
            });
    }

    async getSeatsAvailability(movieSessionId: number) {
        const movieSession = await this.movieSessionRepository.findById(movieSessionId);
        if(!movieSession)
            throw new NotFoundError('Movie session not found');
        
        const seats = await this.seatRepository.findBy({movieRoomId: movieSession.movieRoomId});

        const reservations = await this.seatReservationRepository.findBy({movieSessionId});

        return seats.map((seat) => {
            const reservation = reservations.find((reservation) => reservation.seatId === seat.id);
            return {
                seat,
                isReserved: !!reservation
            }
        });
    }

    async getMovieSessionsByDate(movieId: number, date: Date) {
        console.log(movieId, date)
        return await this.movieSessionRepository.findByMovieAndDate(movieId, date)
            .then(async (movieSessions) => {
                // @ts-ignore
                return await Promise.all(movieSessions.map(async (movieSession) => {
                    return await this.toDto(movieSession);
                }));
            });
    }

    async toDto(movieSession: MovieSession) {
        const movieRoom = await this.movieRoomRepository.findById(movieSession.movieRoomId);
        const movie = await this.movieRepository.findById(movieSession.movieId);

        return {
            id: movieSession.id,
            movie,
            movieRoom,
            startDate: movieSession.startDate,
            endDate: movieSession.endDate
        }
    }
}