import { reactive } from "vue";
import { formatError } from "@/utils/format.util.js"

export function useAsync(cb, opts = {messageSuccess: ""}) {
  const state = reactive({
    isLoading: false,
    isError: false,
    errorMessage: null,
    messageSuccess: null
  })

  const exec = async (...args) => {
    try {
      state.isError = false
      state.errorMessage = null
      state.isLoading = true
      state.messageSuccess = null

      const res = await cb(...args)

      if(opts.messageSuccess.length > 0){
        state.messageSuccess = opts["messageSuccess"]
      }

      return res;
    } catch(e) {
      state.isError = true
      state.errorMessage = formatError(e)
      state.messageSuccess = null
    }finally{
      state.isLoading = false
    }
  }

  return {
    state,
    exec
  }
}