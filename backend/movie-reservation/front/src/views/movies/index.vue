<template>
  <h1>Movies</h1>
  <div class="movies">
    <div v-for="movie in moviesWithSessions" :key="movie.id">
      <MovieCard :movie="movie" />
    </div>
  </div>
</template>

<style scoped>
  .movies {
    display: flex;
    justify-content: center;
  }
</style>

<script lang="ts">
import {defineComponent} from "vue";
import {MoviesApi} from "../../../api/movies-api";
import MovieCard from "@/views/movies/components/movie-card.vue";

export default defineComponent({
  name: `Movies`,
  components: {MovieCard},
  created() {
    this.fetchMovies();
  },
  data() {
    return {
      moviesWithSessions: [] as { movie: any, sessions: any[]}[]
    }
  },
  methods: {
    fetchMovies() {
      console.log('fetch movies');
      MoviesApi.getMovies()
          .then((res) => {
            console.log('movies', res.data);

            for(const movie of res.data) {
              if(this.moviesWithSessions.filter((m) => m.movie.id === movie.id).length === 0) {
                this.moviesWithSessions.push({movie, sessions: []});
              }

              const movieWithSessions = this.moviesWithSessions.find((m) => m.movie.id === movie.id);
              if(!movieWithSessions) {
                continue;
              }
              MoviesApi.getMovieSessions(movie.id)
                  .then((res) => {
                    console.log('sessions', res.data);
                    movieWithSessions.sessions = res.data;
                  }).catch((e) => {
                console.error(e);
              })
            }

          }).catch((e) => {
        console.error(e);
      })
    }
  }
})
</script>