<template>
  <span class="relative" @mouseover="hover = true" @mouseleave="hover = false">
    <slot></slot>
    <span v-show="hover" class="absolute top-12 right-0 max-w-fit">
      <slot name="hover"></slot>
    </span>

  </span>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: `ShowOnHover`,
  data() {
    return {
      hover: false
    }
  }
})
</script>
