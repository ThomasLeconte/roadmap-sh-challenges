<template>
  <div class="cart" v-if="seatsBySession.size > 0">
    <span>{{seatsCount()}} seats reserved</span>&emsp;
    <span @click="seeMore = !seeMore">⬇️</span>

    <div v-if="seeMore" class="details">
      <div v-for="([sessionId, seats], index) in seatsBySession" :key="sessionId">
        <p>Session {{sessionId}}:</p>
        <span>{{seats.join(", ")}}</span>
        <hr v-if="index < seatsBySession.size" />
      </div>
      <button class="pay-button" @click="pay">💵&emsp;Buy it!</button>
    </div>
  </div>
</template>

<style scoped>
  .cart {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #2c3e50;
    color: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  }

  .pay-button {
    background: #27ae60;
    color: white;
    margin-top: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>

<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {cartStore} from "@/stores/cart-store";

export default defineComponent({
  name: `CartBanner`,
  data() {
    return {
      seeMore: false
    }
  },
  computed: {
    ...mapState(cartStore, ['seatsBySession']),
  },
  methods: {
    pay() {
      this.$router.push({name: 'cart'});
    },
    seatsCount() {
      return Array.from(this.seatsBySession.values()).reduce((acc, val) => acc + val.length, 0);
    }
  }
})
</script>