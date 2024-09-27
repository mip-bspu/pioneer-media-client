import { reactive } from "vue";


function useWorker(cb, timeInterval) {
  let state = reactive({
      isStarting: false,
      isComplete: false
    })

  const close = () => state.isComplete = true

  async function worker(...args) {
    if(state.isStarting) return;
   
    state.isStarting = true

    const timeId = setInterval(() => {
      if(state.isComplete || !state.isStarting){
        state.isComplete = false
        state.isStarting = false

        return clearInterval(timeId)
      }
      
      cb(...args)
    }, timeInterval)
  }

  return {
    close,
    worker
  }
}


export { useWorker}