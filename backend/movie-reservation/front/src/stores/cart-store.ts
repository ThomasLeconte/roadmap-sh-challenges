import {defineStore} from "pinia";

export const cartStore = defineStore('cart', {
    state: () => ({
        seatsBySession: new Map<number, string[]>(),
        extras: []
    }),
    actions: {
        addOrDeleteSeatReservation(seatName: string, sessionId: number) {
            if(!this.seatsBySession.has(sessionId)) {
                this.seatsBySession.set(sessionId, [seatName]);
            } else {
                let actualSeats = this.seatsBySession.get(sessionId) || []
                if(actualSeats.find(s => s === seatName)){
                    actualSeats = actualSeats.filter(s => s !== seatName);
                } else {
                    actualSeats = [...actualSeats, seatName];
                }

                if(actualSeats.length > 0) {
                    this.seatsBySession.set(sessionId, actualSeats);
                } else {
                    this.seatsBySession.delete(sessionId);
                }
            }
        },
    }
})