<template>
  <div class="cart">
    <h3>My cart</h3>

    <table>
      <thead>
        <tr>
          <th>Movie</th>
          <th>Session</th>
          <th>Seats</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="([session, seats]) in mappedSeatsBySession" :key="session.id">
          <td>{{session.movie.title}}</td>
          <td>{{formatDate(session.startDate)}}</td>
          <td>{{seats.join(", ")}}</td>
        </tr>
      </tbody>
    </table>

    <div style="display: flex; flex-direction: row-reverse">
      <button @click="checkout">Checkout</button>
    </div>
  </div>
</template>

<style scoped>
  .cart {
    padding: 10px;
    border-radius: 10px;
  }

  table {
    margin: 10px;
    width: 100%;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid white;
    padding: 5px;
    text-align: left;
  }
</style>

<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {cartStore} from "@/stores/cart-store";
import {MovieSessionsApi} from "../../../api/movie-sessions-api";
import OrderApi from "../../../api/order-api";

export default defineComponent({
  name: `Cart`,
  data() {
    return {
      seeMore: false,
      mappedSeatsBySession: new Map<any, string[]>()
    }
  },
  created() {
    Array.from(this.seatsBySession.keys())
        .forEach((sessionId) => {
          console.log('fetch session', sessionId);
          MovieSessionsApi.getSessionById(sessionId)
              .then((res) => {
                console.log('seat', this.seatsBySession.get(sessionId));
                this.mappedSeatsBySession.set(res.data, this.seatsBySession.get(sessionId) || []);
              }).catch((e) => {
                console.error(e);
              })
        })
  },
  computed: {
    ...mapState(cartStore, ['seatsBySession'])
  },
  methods: {
    checkout() {
      Array.from(this.seatsBySession.keys())
          .forEach((sessionId) => {
            OrderApi.createOrder(sessionId, this.seatsBySession.get(sessionId) || [])
                .then((res) => {
                  console.log('order created', res.data);
                  window.location.href = res.data.paypalLink;
                }).catch((e) => {
              console.error(e);
            })
          })
    },
    formatDate(date: number) {
      return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    }
  }
})
</script>