import {defineStore} from "pinia";

export const userStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    actions: {
        setUser(user) {
            this.user = user;
        }
    },
    getters: {
        isLoggedIn: (state) => {
            return state.user !== null || localStorage.getItem('token') !== null;
        }
    },
    persist: {
        storage: sessionStorage
    }
})