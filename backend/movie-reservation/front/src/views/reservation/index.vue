<template>
  <div>
    <h1>Reservation</h1>
    <div v-for="row in rows" :key="row.letter" class="row">
      <div v-for="seat in row.seats" :key="seat.id">
        <Seat :reserved="seat.isReserved" :name="seat.code" @reserveSeat="onUpdateSeatReservation" />
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
import {mapActions} from "pinia";
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
    console.log('fetch reservation', this.sessionId);
    MovieSessionsApi.getSeatsAvailability(this.sessionId)
        .then((res) => {
          console.log('seats', res.data);

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
  methods: {
    ...mapActions(cartStore, ['addOrDeleteSeatReservation']),
    onUpdateSeatReservation(event: any) {
      console.log(event);
      this.addOrDeleteSeatReservation(event.name, this.sessionId);
    }
  }
});
</script>