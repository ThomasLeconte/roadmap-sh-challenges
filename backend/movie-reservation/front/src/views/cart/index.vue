<template>
  <div v-if="loading" role="status">
    <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
  </div>

  <div v-else class="m-10 flex items-start">

    <div class="w-3/4 py-6 px-10 mx-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My cart</h5>
      </a>

      <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg border border-separate border-gray-300 dark:border-gray-700">
        <thead class="text-xs text-gray-700 uppercase rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Movie
          </th>
          <th scope="col" class="px-6 py-3">
            Session hour
          </th>
          <th scope="col" class="px-6 py-3">
            Room
          </th>
          <th scope="col" class="px-6 py-3">
            Seats
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="([session, seats]) in mappedSeatsBySession" :key="session.id"
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
          <th scope="row" class="px-6 py-4 font-bold text-lg text-gray-900 whitespace-nowrap dark:text-white">
            {{ session.movie.title }}
          </th>
          <td class="px-6 py-4 text-base">
            {{ formatDate(session.startDate) }}
          </td>
          <td>
              <span
                  class="hover:cursor-pointer bg-red-400 text-red-800 text-base font-bold m-2 p-2 rounded-xl dark:bg-red-800 dark:text-red-400">
                {{ session.movieRoom.name }}
              </span>
          </td>
          <td class="py-4">
              <span v-for="(seat, index) in seats" :key="index"
                    class="hover:cursor-pointer bg-purple-100 text-purple-800 text-base font-bold m-2 p-2 rounded-xl dark:bg-purple-900 dark:text-purple-300">
                {{ seat }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>



    <div class="w-1/4 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Resume</h5>
      <template v-if="computedOrder">
        <div v-for="(session, index) in computedOrder.pricesPerSession" :key="index">
          <p class="text-lg text-left font-bold text-gray-900 dark:text-white">{{getSessionTitle(session.sessionId)}}</p>
          <div v-for="(line, _index) in session.lines" :key="_index" class="ml-5">
            <div v-if="line.type == 'SEAT'" class="flex items-center justify-between">
              <span class="text-base text-gray-900 dark:text-white">{{ line.name }}</span>
              <span class="text-base font-bold text-gray-900 dark:text-white">{{ line.price }} $</span>
            </div>
          </div>
        </div>

        <div class="mt-2 flex items-center justify-between">
          <span class="text-lg font-bold text-gray-900 dark:text-white">Total</span>
          <span class="text-lg font-bold text-gray-900 dark:text-white">{{computedOrder ? computedOrder.totalPrice : 0}} $</span>
        </div>
      </template>

      <template v-if="taxesLines.length > 0">
        <hr class="my-5" />

        <p class="text-lg text-left font-bold text-gray-900 dark:text-white">Taxes</p>
        <div v-for="(line, _index) in taxesLines()" :key="_index" class="ml-5">
          <div class="flex items-center justify-between">
            <span class="text-base text-gray-900 dark:text-white">{{ line.name }}</span>
            <span class="text-base font-bold text-gray-900 dark:text-white">{{ line.price }} $</span>
          </div>
        </div>
      </template>

      <hr class="mt-10 mb-5" />

      <div class="flex items-center justify-between">
        <div>
          <input type="text" id="discount_code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Discount code" required />
        </div>
        <a href="#" class="inline-flex items-center px-3 py-2 mx-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Apply
          <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </a>
      </div>

      <hr class="my-5" />

      <p class="text-left font-bold text-lg text-gray-900 whitespace-nowrap dark:text-white">
        Taxes
      </p>
      <div v-for="(line, index) in taxesLines()" :key="index" class="ml-5">
        <div class="flex items-center justify-between">
          <span class="text-base text-gray-900 dark:text-white">{{ line.name }}</span>
          <span class="text-base font-bold text-gray-900 dark:text-white">{{ line.price }} $</span>
        </div>
      </div>

      <div class="flex items-center justify-between mt-5">
        <span class="text-lg font-bold text-gray-900 dark:text-white">Total</span>
        <span class="text-lg font-bold text-gray-900 dark:text-white">{{computedOrder ? computedOrder.totalPrice + computedOrder.totalTaxes : 0}} $</span>
      </div>

      <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Checkout
        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </a>
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
      mappedSeatsBySession: new Map<any, string[]>(),
      computedOrder: null as any | null,
      loading: false
    }
  },
  created() {
    this.loading = true;

    const sessionsIds = Array.from(this.seatsBySession.map(i => i.sessionId))
    let body = {
      sessions: this.seatsBySession.map(s => {
        return {id: s.sessionId, seats: s.seats}
      })
    }

    Promise.all([
        Promise.all(sessionsIds.map((sessionId) => MovieSessionsApi.getSessionById(sessionId))),
        OrderApi.computeOrder(body)
    ]).then(([sessions, order]) => {
      sessions.forEach((session) => {
        this.mappedSeatsBySession.set(session.data, this.seatsBySession.find(s => parseInt(s.sessionId.toString()) === session.data.id)?.seats || []);
      })
      this.computedOrder = order.data;
    }).catch((e) => {
      console.error(e);
    }).finally(() => {
      this.loading = false;
    });

    // Array.from(this.seatsBySession.map(i => i.sessionId))
    //     .forEach((sessionId) => {
    //       MovieSessionsApi.getSessionById(sessionId)
    //           .then((res) => {
    //             this.mappedSeatsBySession.set(res.data, this.seatsBySession.find(s => s.sessionId === sessionId)?.seats || []);
    //           }).catch((e) => {
    //         console.error(e);
    //       })
    //     })
    //
    // this.computeOrder();
  },
  computed: {
    ...mapState(cartStore, ['seatsBySession'])
  },
  methods: {
    computeOrder() {
      let body = {
        sessions: this.seatsBySession.map(s => {
          return {id: s.sessionId, seats: s.seats}
        })
      }

      OrderApi.computeOrder(body)
          .then((res) => {
            console.log('order computed', res.data);
            this.computedOrder = res.data;
          }).catch((e) => {
        console.error(e);
      })
    },
    taxesLines() {
      return this.computedOrder
          ? this.computedOrder.pricesPerSession.flatMap(l => l.lines).filter(l => l.type === 'TAX')
          : [];
    },
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
    getSessionTitle(sessionId: number) {
      return Array.from(this.mappedSeatsBySession.keys())
          .find(s => s.id === sessionId)?.movie.title || '';
    },
    formatDate(date: number) {
      return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    }
  }
})
</script>
