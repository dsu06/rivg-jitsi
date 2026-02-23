<script setup lang="ts">
import { onMounted, ref } from 'vue';

import AppView from './views/AppView.vue';

import 'reset-css';
import './types/jitsi.declare';

const canTheAppBeLoaded = ref(false);

onMounted(() => {
    const localStorageToken = localStorage.getItem(import.meta.env.RIVG_JOB_TOKEN_KEY);
    if (localStorageToken && localStorageToken === import.meta.env.RIVG_JOB_TOKEN_VALUE) canTheAppBeLoaded.value = true;
});
</script>

<template>
    <AppView v-if="canTheAppBeLoaded" />
    <div v-else>Oops! You don't have permissions to watch the demo project!</div>
</template>

<style>
@import url(https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic);

* {
  font: 400;
  font-family: 'Montserrat', sans-serif !important;

  box-sizing: border-box;
}

#app {
  width: 100dvw;
  height: 100dvh;
}
</style>
