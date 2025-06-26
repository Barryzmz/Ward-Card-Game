<template>
  <div class="container-fluid min-vh-100 p-0 bg-dark">
    <div class="d-flex justify-content-center align-items-start ">
      <h1 class="text-white">War Card Game</h1>
    </div>
    <div class="d-flex justify-content-center align-items-start gap-4 my-5">
      <div class="text-white" id="playerOne">
        <p class="fs-3">PlayerOne : {{ playerOneScore }}</p>
        <div class="card">
          <img :src="cardOne?.images?.png" />
        </div>
        <div class="d-flex justify-content-center align-items-start mt-4">
          <button type="button" class="btn btn-primary" @click="getCards()">Draw
            Cards</button>
        </div>
      </div>
      <div class="text-white" id="playerTwo">
        <p class="fs-3">PlayerTwo : {{ playerTwoScore }}</p>
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
let playerOneScore = ref(0);
let playerTwoScore = ref(0);

function translateCardsValue(value) {
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
  const result = await axios.get("https://www.deckofcardsapi.com/api/deck/" + deckID.value + "/draw/?count=2");
  const remaining = result.data.cards;
  const cards = result.data.cards;
  cardOne.value = result.data.cards[0];
  cardTwo.value = result.data.cards[1];
  RefereeMatch(cardOne.value, cardTwo.value);
}

function RefereeMatch(cardOneValue: object, cardTwoValue: object) {
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
