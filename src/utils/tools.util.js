const delay = (delay) => 
  new Promise((resolve, reject) => setTimeout(resolve, delay))

export {
  delay
}