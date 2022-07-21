const result = document.getElementById('result')

async function getData() {
  const response = await fetch('/data')
  result.innerText = await response.text()
}

getData().catch(console.error)
