<template>
<!--  <CartBanner />-->
  <navbar />
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

body {
  background: #e6f2fb;
}

@media (prefers-color-scheme: dark) {
  body {
    background: #1a202c;
  }
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script setup lang="ts">
import CartBanner from "@/views/components/cart-banner.vue";
import Navbar from "@/components/navbar.vue";
</script>
