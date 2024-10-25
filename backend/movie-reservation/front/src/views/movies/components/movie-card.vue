<template>
  <div class="movie max-w-sm p-6 mx-3 bg-white border border-gray-200 rounded-xl shadow-2xl dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{movie.movie.title}}</h5>
      <span class="bg-blue-100 text-blue-800 font-medium inline-flex items-center px-2.5 py-0.5 rounded-lg dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
        <svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
        </svg>
        {{durationFormat(movie.movie.duration)}}
      </span>
    </div>
    <p class="mb-10 text-left font-normal text-gray-700 dark:text-gray-400">{{movie.movie.description}}</p>


    <div class="flex items-center justify-between mb-2">
      <h5 class="text-left font-bold tracking-tight text-gray-900 dark:text-white">Sessions</h5>
      <input type="date" v-model="dateChoosen" @change="fetchSessions" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
    </div>

    <div class="flex flex-wrap items-center">
      <span v-if="sessions.length === 0" class="text-gray-700 dark:text-gray-400">No sessions available...</span>
      <span v-else v-for="session in sessions" :key="session.id" @click="reserve(session.id)" class="hover:cursor-pointer bg-purple-100 text-purple-800 text-lg font-bold m-2 p-2 rounded-xl dark:bg-purple-900 dark:text-purple-300">
        {{formatTime(session.startDate)}}
      </span>
    </div>

    <a href="#" class="mt-10 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Read more
      <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </a>
  </div>
</template>

<style scoped>
  .movie {
    width: 30rem;
  }
</style>

<script lang="ts">
import {defineComponent} from "vue";
import {MovieSessionsApi} from "../../../../api/movie-sessions-api";

export default defineComponent({
  name: `MovieCard`,
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      dateChoosen: new Date().toISOString().split('T')[0],
      sessions: [] as any[]
    }
  },
  created() {
    this.fetchSessions();
  },
  methods: {
    fetchSessions() {
      console.log('fetch sessions', this.movie.movie.id, this.dateChoosen);
      MovieSessionsApi.getMovieSessionsByMovieIdAndDate(this.movie.movie.id, this.dateChoosen.toString())
          .then((res) => {
            console.log('sessions', res.data);
            this.sessions = res.data;
          }).catch((e) => {
        console.error(e);
      })
    },
    formatDate(date: number) {
      return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    },
    formatTime(date: number) {
      return new Date(date).toLocaleTimeString();
    },
    durationFormat(duration: number) {
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor(duration % (1000 * 60 * 60) / (1000 * 60));

      if(minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${minutes}m`;
      }
    },
    reserve(sessionId: number) {
      console.log('reserve', sessionId);
      this.$router.push({name: 'reservation', params: {sessionId}});
    }
  }
});
</script>
