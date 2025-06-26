<template>
  <div class="container-fluid min-vh-100 p-0 bg-dark">
    <h1 class="text-white">War Card Game</h1>
    <div id="game"></div>
    <div class="d-flex justify-content-center align-items-start gap-4">
      <div class="text-white" id="playerOne">
        <h4>Player One</h4>
        <div class="card">
          <img :src="cardOne?.images?.png" />
        </div>
        <div class="d-flex justify-content-center align-items-start gap-4 mt-4">
          <button @click="getCards()">Draw Cards</button>
        </div>
      </div>
      <div class="text-white" id="playerTwo">
        <h4>Player Two</h4>
        <div class="card">
          <img :src="cardTwo?.images?.png" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
let gameOver = ref(true);
let cardOne = ref({});
let cardTwo = ref({});
let deckID = ref(null);
let playerOne = ref(0);
let playerTwo = ref(0);

async function getDeck() {
  gameOver.value = false;
  if (deckID.value == null) {
    const result = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    deckID.value = result.data.deck_id;
  }
}

async function getCards() {
  const result = await axios.get("https://www.deckofcardsapi.com/api/deck/" + deckID.value + "/draw/?count=2");
  const remaining = result.data.cards;
  const cards = result.data.cards;
  cardOne.value = cards[0];
  cardTwo.value = cards[1];
  const valueOne = pareInt(translateCards(cardOne.value));
  const valueTwo = pareInt(translateCards(cardTwo.value));
}

onMounted(async () => {
  try {
    await getDeck();
  } catch (e: any) {
    throw new Error(e);
  }
})
</script>
