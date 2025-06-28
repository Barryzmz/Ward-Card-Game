<template>
  <div class="container-fluid min-vh-100 p-0 bg-dark">
    <div class="d-flex justify-content-center align-items-start pt-2">
      <h1 class="text-white">War Card Game</h1>
    </div>
    <div class="d-flex justify-content-center align-items-start gap-4 mt-5 pb-4">
      <div class="text-white" id="playerOne">
        <p class="fs-3"
          :class="{ 'text-warning': PlayerGetScore === 'playerOne', 'text-white': PlayerGetScore !== 'playerOne' }">
          PlayerOne : {{ playerOneScore }}</p>
        <div class="card-flip-wrapper">
          <div class="card-flip" :class="{ flipped: cardOneFlipped }">
            <!-- 背面 -->
            <img :src="backCard.images.png" class="card-face card-back" />
            <!-- 正面 -->
            <img :src="cardOne?.images?.png" class="card-face card-front" />
          </div>
        </div>
        <div class="d-flex justify-content-center align-items-start mt-4">
          <button type="button" class="btn btn-primary" :disabled="!getCardsDone" @click="getCards()">Draw
            Cards</button>
        </div>
      </div>
      <div class="text-white" id="playerTwo">
        <p class="fs-3"
          :class="{ 'text-warning': PlayerGetScore === 'playerTwo', 'text-white': PlayerGetScore !== 'playerTwo' }">
          Computer : {{ playerTwoScore }}</p>
        <div class="card-flip-wrapper">
          <div class="card-flip" :class="{ flipped: cardTwoFlipped }">
            <!-- 背面 -->
            <img :src="backCard.images.png" class="card-face card-back" />
            <!-- 正面 -->
            <img :src="cardTwo?.images?.png" class="card-face card-front" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade show d-block" tabindex="-1" v-if="showModal" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center">
        <div class="modal-header">
          <h5 class="modal-title">🎉 Game Over</h5>
        </div>
        <div class="modal-body">
          <p class="fs-4">{{ winner }} wins!</p>
        </div>
        <div class="modal-footer justify-content-center">
          <button class="btn btn-primary" @click="resetGame">Play Again</button>
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
const cardOneFlipped = ref(false);
const cardTwoFlipped = ref(false);
let deckID = ref(null);
let playerOneScore = ref(0);
let playerTwoScore = ref(0);
let getCardsDone = ref(true);
let PlayerGetScore = ref("");
const winner = ref('');
const winTimes = 10;
const showModal = ref(false);

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
    cardOneFlipped.value = false;
    cardTwoFlipped.value = false;
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = await axios.get("https://www.deckofcardsapi.com/api/deck/" + deckID.value + "/draw/?count=2");
    const cards = result.data.cards;
    // 1. 先設 cardOne，cardTwo 清空
    await nextTick();
    // 2. 延遲 500ms

    cardOne.value = cards[0];
    cardTwo.value = cards[1];
    await nextTick();
    setTimeout(() => {
      cardOneFlipped.value = true;
      cardTwoFlipped.value = true;
    }, 100);
    if (result.data.remaining < 2) {
      alert("The cards have been used up, please reshuffle");
      getCardsDone.value = false;
      return;
    }
    setTimeout(() => {
      RefereeMatch(cardOne.value, cardTwo.value);
      getCardsDone.value = true;
    }, 500);

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
    PlayerGetScore.value = "playerOne";
  }
  else if (valueOne < valueTwo) {
    playerTwoScore.value++;
    PlayerGetScore.value = "playerTwo";
  }
  else {
    const suitOne = translateCardsSuit(cardOneValue?.suit);
    const suitTwo = translateCardsSuit(cardTwoValue?.suit);
    if (suitOne > suitTwo) {
      playerOneScore.value++;
      PlayerGetScore.value = "playerOne";
    }
    else {
      playerTwoScore.value++;
      PlayerGetScore.value = "playerTwo";
    }
  }

  checkGameOver()
}

function checkGameOver() {
  if (playerOneScore.value >= winTimes) {
    winner.value = 'PlayerOne'
    showModal.value = true
  }
  else if (playerTwoScore.value >= winTimes) {
    winner.value = 'Computer'
    showModal.value = true
  }
  else {
    return
  }
}

function resetGame() {
  playerOneScore.value = 0
  playerTwoScore.value = 0
  cardOne.value = { ...BackCard }
  cardTwo.value = { ...BackCard }
  PlayerGetScore.value = ''
  showModal.value = false
  deckID.value = null
  getDeck()
}

onMounted(async () => {
  try {
    await getDeck();
  } catch (e: any) {
    throw new Error(e);
  }
})
</script>
<style scoped>
.card-flip-wrapper {
  width: 226px;
  height: 314px;
  perspective: 1000px;
}

.card-flip {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-flip.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  object-fit: cover;
}

.card-front {
  transform: rotateY(180deg);
}
</style>
