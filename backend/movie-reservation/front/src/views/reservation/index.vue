<template>
  <div>
    <h1>Reservation</h1>
    <div v-for="row in rows" :key="row.letter" class="row">
      <div v-for="seat in row.seats" :key="seat.id">
        <Seat :reserved="getSeatReservationState(seat)" :name="seat.code" @reserveSeat="onUpdateSeatReservation" />
      </div>
    </div>
  </div>
</template>

<style>
  .row {
    display: flex;
    justify-content: center;
  }
</style>

<script lang="ts">
import Seat from "@/views/reservation/components/seat.vue";
import {MovieSessionsApi} from "../../../api/movie-sessions-api";
import {mapActions, mapState} from "pinia";
import {cartStore} from "@/stores/cart-store";
import {defineComponent} from "vue";

export default defineComponent({
  name: `reservation`,
  components: {Seat},
  props: {
    sessionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      rows: [] as {letter: string, seats: {id: number, code: string, isReserved: boolean}[]}[],
    }
  },
  created() {
    MovieSessionsApi.getSeatsAvailability(this.sessionId)
        .then((res) => {

          for(const seat of res.data) {
            let row = this.rows.find(r => r.letter === seat.seat.code[0]);
            if(!row) {
              const newRow = {letter: seat.seat.code[0], seats: []};
              this.rows.push(newRow);
            } else {
              row.seats.push({...seat.seat, isReserved: seat.isReserved});
            }
          }
        }).catch((e) => {
      console.error(e);
    })
  },
  computed: {
    ...mapState(cartStore, ["seatsBySession"])
  },
  methods: {
    ...mapActions(cartStore, ['addOrDeleteSeatReservation']),
    onUpdateSeatReservation(event: any) {
      this.addOrDeleteSeatReservation(event.name, this.sessionId);
    },
    getSeatReservationState(seat: any){
      return (seat.isReserved && seat.isReserved === true)
          || this.seatsBySession.find(s => s.sessionId === this.sessionId)?.seats.find(s => s === seat.code) !== undefined
          || false;
    }
  }
});
</script>
