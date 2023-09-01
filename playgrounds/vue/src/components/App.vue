<template>
  <div class="pux-App">
    <MainView />
  </div>
</template>

<script lang="ts" setup>
import { a } from '@src/index';
import MainView from '@src/views/MainView.vue';

console.log(a);
</script>

<style lang="scss">
.pux-App {
}
</style>
