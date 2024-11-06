<template>
  <div class="home">
    <div class="movies">
      <img v-for="movie in movies" :key="movie.id" :ref="'movie_' + movie.id" :src="movie.image" alt="movie poster" class="transition-all duration-300 filter grayscale blur-sm hover:blur-none hover:grayscale-0">
    </div>
  </div>
</template>

<style scoped>
  .movies {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .movies img {
    width: 33dvw;
    height: calc(calc(100dvh - 142px) / 3);
    object-fit: cover;
  }
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';
import {MoviesApi} from "../../api/movies-api"; // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      refsAvailable: false,
      movies: null as [] | null,
      interval : null as number | null
    }
  },
  beforeRouteLeave(to, from, next) {
    if(this.interval) clearInterval(this.interval);
    next();
  },
  watch: {
    'refsAvailable': function() {
      const imagesSize = Object.keys(this.$refs).length;

      let lastRef = null as HTMLImageElement | null;
      this.interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * imagesSize);
        const randomRef = (this.$refs[Object.keys(this.$refs)[randomIndex]] as any)[0] as HTMLImageElement;
        if(lastRef) {
          lastRef.classList.add('blur-sm', 'grayscale');
        }
        randomRef.classList.remove('blur-sm', 'grayscale');
        lastRef = randomRef;
      }, 1000);
    }
  },
  created() {
    this.fetchMovies();
    const interval = setInterval(() => {
      if((Object.keys(this.$refs).length > 0)) {
        this.refsAvailable = true;
        clearInterval(interval);
      }
    }, 10);
  },
  methods: {
    fetchMovies() {
      MoviesApi.getMovies()
          .then((res) => {
            this.movies = res.data;
          }).catch((e) => {
        console.error(e);
      })
    }
  }
});
</script>
