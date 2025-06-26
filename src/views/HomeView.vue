<template>
  <h1>War Card Game</h1>
  <div id="game"></div>
  <div id="playerOne"></div>
  <h1>{{ gameOver }}</h1>
  <h1>cardOne</h1>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
let gameOver = ref(true);
let cardOne = ref({});
let cardTwo = ref({});
let deckID = ref(null);
let playerOne = ref(0);
let playerTwo = ref(0);

</script>
