<template>
  <div class="container-fluid min-vh-100 p-0 bg-dark">
    <div class="d-flex justify-content-center align-items-start py-5">
      <h1 class="text-white">War Card Game</h1>
    </div>
    <div class="d-flex justify-content-center align-items-start gap-4 my-5">
      <div class="text-white" id="playerOne">
        <p class="fs-3">PlayerOne : {{ playerOneScore }}</p>
        <div style="border-radius: 10px; overflow: hidden;">
          <img :src="cardOne?.images?.png" style="object-fit: cover;" />
        </div>
        <div class="d-flex justify-content-center align-items-start mt-4">
          <button type="button" class="btn btn-primary" :disabled="!getCardsDone" @click="getCards()">Draw
            Cards</button>
        </div>
      </div>
      <div class="text-white" id="playerTwo">
        <p class="fs-3">Computer : {{ playerTwoScore }}</p>
        <div style="border-radius: 10px; overflow: hidden;">
          <img :src="cardTwo?.images?.png" style="object-fit: cover;" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import axios from 'axios'
import { type Card, BackCard } from '@/types/baseType'
let gameOver = ref(true);
const backCard = BackCard;
let cardOne = ref<Card>(BackCard);
let cardTwo = ref<Card>(BackCard);
let deckID = ref(null);
let playerOneScore = ref(0);
let playerTwoScore = ref(0);
let getCardsDone = ref(true);

function translateCardsValue(value: any) {
  switch (value) {
    case "JACK":
      value = "11";
      break;
    case "QUEEN":
      value = "12";
      break;
    case "KING":
      value = "13";
      break;
    case "ACE":
      value = "14";
      break;
    default:
      break;
  }
  return value;
}

function translateCardsSuit(suit: string): number {
  switch (suit) {
    case "CLUBS": return 1;
    case "DIAMONDS": return 2;
    case "HEARTS": return 3;
    case "SPADES": return 4;
    default: return 0;
  }
}
async function getDeck() {
  gameOver.value = false;
  if (deckID.value == null) {
    const result = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    deckID.value = result.data.deck_id;
  }
}

async function getCards() {
  try {
    getCardsDone.value = false
    const result = await axios.get("https://www.deckofcardsapi.com/api/deck/" + deckID.value + "/draw/?count=2");
    const remaining = result.data.cards;
    const cards = result.data.cards;
    // 1. 先設 cardOne，cardTwo 清空
    cardOne.value = backCard;
    cardTwo.value = backCard; // 顯示背面
    await nextTick();
    // 2. 延遲 500ms
    await new Promise(resolve => setTimeout(resolve, 500));
    cardOne.value = cards[0];
    cardTwo.value = cards[1];
    await nextTick();
    if (result.data.remaining < 2) {
      alert("The cards have been used up, please reshuffle");
      getCardsDone.value = false;
      return;
    }
    if (cardOne?.value && cardTwo?.value) {
      RefereeMatch(cardOne.value, cardTwo.value);
      getCardsDone.value = true
    }
  } catch (error) {
    console.error('getCards error:', error);
  }
}

function RefereeMatch(cardOneValue: Card, cardTwoValue: Card) {
  if (!cardOneValue || !cardTwoValue || !cardOneValue?.value || !cardTwoValue?.value) {
    cardOne.value = { ...BackCard };
    cardTwo.value = { ...BackCard };
    return;
  }
  const valueOne = parseInt(translateCardsValue(cardOneValue.value));
  const valueTwo = parseInt(translateCardsValue(cardTwoValue.value));
  if (valueOne > valueTwo) {
    playerOneScore.value++;
  }
  else if (valueOne < valueTwo) {
    playerTwoScore.value++;
  }
  else {
    const suitOne = translateCardsSuit(cardOneValue?.suit);
    const suitTwo = translateCardsSuit(cardTwoValue?.suit);
    if (suitOne > suitTwo) {
      playerOneScore.value++;
    }
    else {
      playerTwoScore.value++;
    }
  }
}

onMounted(async () => {
  try {
    await getDeck();
  } catch (e: any) {
    throw new Error(e);
  }
})
</script>
