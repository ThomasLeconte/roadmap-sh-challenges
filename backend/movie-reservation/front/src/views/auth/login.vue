<template>
  <h1>Login</h1>
  <form @submit.prevent="login">
    <input type="text" v-model="username" placeholder="username" />
    <input type="password" v-model="password" placeholder="Password" />
    <button type="submit">Login</button>
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
      password: ''
    }
  },
  methods: {
    login() {
      console.log(this.username, this.password)
      AuthApi.login(this.username, this.password)
          .then((res) => {
            console.log('logged in', res.data)
            localStorage.setItem('token', res.data.token)
            this.$router.push({name: 'home'})
          }).catch((e) => {
        console.error(e)
      })
    }
  }
})
</script>