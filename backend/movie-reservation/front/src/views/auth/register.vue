<template>
  <h1>Register</h1>
  <form @submit.prevent="register">
    <input type="text" v-model="username" placeholder="username"/>
    <input type="email" v-model="email" placeholder="email"/>
    <input type="password" v-model="password" placeholder="Password"/>
    <button type="submit">Register</button>
  </form>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {AuthApi} from "../../../api/auth-api";

export default defineComponent({
  name: `Login`,
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    register() {
      console.log(this.username, this.email, this.password)
      AuthApi.register(this.username, this.email, this.password)
          .then(() => {
            console.log('registered')
            this.$router.push({name: 'login'})
          }).catch((e) => {
        console.error(e)
      })
    }
  }
})
</script>