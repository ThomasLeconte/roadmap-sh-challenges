<template>
  <div class="movie">
    <h2>{{movie.movie.title}}</h2>
    <p>{{movie.movie.description}}</p>
    <p>Duration: {{durationFormat(movie.movie.duration)}}</p>
    <h3>Sessions</h3>
    <input type="date" v-model="dateChoosen" @change="fetchSessions">
    <div class="sessions">
      <div v-for="session in sessions" :key="session.id" style="margin: 10px">
        <span>{{formatDate(session.startDate)}} {{session.time}}</span>
        <button @click="reserve(session.id)">Reserve</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .movie {
    border: 1px solid black;
    padding: 10px;
    margin: 10px;
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
      dateChoosen: new Date(),
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
    durationFormat(duration: number) {
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = duration % (1000 * 60 * 60) / (1000 * 60);

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