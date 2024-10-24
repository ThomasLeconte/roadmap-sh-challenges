import {defineStore} from "pinia";

export const userStore = defineStore('user', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token')
    }),
    actions: {
        setUser(user) {
            this.user = user;
        },
        setToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
        },
        invalidateToken() {
            localStorage.removeItem('token');
            this.token = null;
        }
    },
    getters: {
        isLoggedIn: (state) => {
            return state.user !== null || state.token !== null;
        }
    },
})