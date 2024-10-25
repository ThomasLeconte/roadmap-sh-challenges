<template>
  <div class="m-10">

    <div class="py-6 px-10 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My cart</h5>
      </a>

      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg border border-separate border-gray-300 dark:border-gray-700">
        <thead class="text-xs text-gray-700 uppercase rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
            <th scope="row" class="px-6 py-4 font-bold text-lg text-gray-900 whitespace-nowrap dark:text-white">
              {{session.movie.title}}
            </th>
            <td class="px-6 py-4 text-base">
              {{formatDate(session.startDate)}}
            </td>
            <td class="py-4">
              <span v-for="(seat, index) in seats" :key="index" class="hover:cursor-pointer bg-purple-100 text-purple-800 text-base font-bold m-2 p-2 rounded-xl dark:bg-purple-900 dark:text-purple-300">
                {{seat}}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-end">
        <button @click="checkout" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Checkout</button>
      </div>
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
