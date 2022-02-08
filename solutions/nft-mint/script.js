const data = require('./data/nfts.json')
const fs = require('fs')

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

const script = () => {
  shuffleArray(data)
  fs.writeFileSync('./data/nfts.json', JSON.stringify(data))
}

script()
