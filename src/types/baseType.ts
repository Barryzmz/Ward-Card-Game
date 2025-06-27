export interface Account {
  avatar: string
  accountId: string
  accountName: string
  name: string
  type: string
  introduction: string
}

export interface Card {
  code: string,
  image: string,
  images: {
    svg: string, png: string
  },
  suit: string,
  value: string
}

export const BackCard: Card = {
    code: "", 
    image: "https://deckofcardsapi.com/static/img/back.png", 
    images: {
                    "svg": "", 
                    "png": "https://deckofcardsapi.com/static/img/back.png"
                }, 
    value: "", 
    suit: ""
}