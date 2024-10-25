<template>
  <div class="seat bg-white border-gray-200 dark:bg-gray-900 transition-shadow shadow-lg hover:shadow-2xl hover:transition-shadow" :class="[ isReserved ? 'reserved' : null ]" @click="reserve">
    {{ name }}
  </div>
</template>

<style>
.seat {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 2px solid black;
  border-radius: 10px;
  margin: 5px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
}

.seat.reserved {
  border: 2px solid rgba(29 78 216 / 0.5);
}
</style>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: `seat`,
  props: {
    name: {
      type: String,
      required: true
    },
    reserved: {
      type: Boolean,
      required: true
    }
  },
  data(){
    return {
      isReserved: false
    }
  },
  created() {
    this.isReserved = this.$props.reserved
  },
  methods: {
    reserve(){
      this.isReserved = !this.isReserved;
      this.$emit('reserveSeat', {name: this.$props.name})
    }
  }
});
</script>
