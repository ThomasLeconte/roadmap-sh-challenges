<template>
  <div class="cart">
    <h3 class="text-3xl font-bold dark:text-white">My cart</h3>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mx-10">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Movie
          </th>
          <th scope="col" class="px-6 py-3">
            Session hour
          </th>
          <th scope="col" class="px-6 py-3">
            Seats
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="([session, seats]) in mappedSeatsBySession" :key="session.id" class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{session.movie.title}}
          </th>
          <td class="px-6 py-4">
            {{formatDate(session.startDate)}}
          </td>
          <td class="px-6 py-4">
            {{seats.join(", ")}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div style="display: flex; flex-direction: row-reverse">
      <button @click="checkout">Checkout</button>
    </div>
  </div>

</template>

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
    Array.from(this.seatsBySession.map(i => i.sessionId))
        .forEach((sessionId) => {
          console.log('fetch session', sessionId);
          MovieSessionsApi.getSessionById(sessionId)
              .then((res) => {
                console.log('seat', this.seatsBySession.find(s => s.sessionId === sessionId)?.seats);
                this.mappedSeatsBySession.set(res.data, this.seatsBySession.find(s => s.sessionId === sessionId)?.seats || []);
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
            OrderApi.createOrder(sessionId, this.seatsBySession.find(s => s.sessionId === sessionId)?.seats || [])
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