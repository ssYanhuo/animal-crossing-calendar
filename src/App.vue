<template>
  <v-app class="app">
    <v-main>
      <Main ref="main"/>
    </v-main>

  </v-app>
</template>

<script lang="ts" setup>
  //
import Main from "@/pages/Main.vue";
</script>

<style scoped>
.app {
  background-image: url("/src/assets/background.svg") !important;
  background-repeat: repeat !important;
  background-size: 100% !important;
}
</style>
