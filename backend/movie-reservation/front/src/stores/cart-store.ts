import {defineStore} from "pinia";

export const cartStore = defineStore('cart', {
    state: () => ({
        seatsBySession: [] as { sessionId: number, seats: string[] }[],
        extras: []
    }),
    actions: {
        addOrDeleteSeatReservation(seatName: string, sessionId: number) {
            const seatsOfSession = this.seatsBySession.find(s => s.sessionId === sessionId);
            if(!seatsOfSession){
                this.seatsBySession.push({sessionId, seats:[seatName]});
            } else {
                let actualSeats = seatsOfSession.seats;
                if(actualSeats.find(s => s === seatName)){
                    actualSeats = actualSeats.filter(s => s !== seatName);
                } else {
                    actualSeats = [...actualSeats, seatName];
                }

                if(actualSeats.length > 0) {
                    seatsOfSession.seats = actualSeats;
                } else {
                    this.seatsBySession = this.seatsBySession.filter(s => s.sessionId !== sessionId);
                }
            }
        },
    },
    getters: {
        seatsCount: (state) => {
            return state.seatsBySession.map(i => i.seats.length).reduce((a, b) => a + b, 0);
        }
    },
    persist: {
        storage: sessionStorage
    }
})