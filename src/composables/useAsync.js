import { reactive } from "vue";
import { formatError } from "@/utils/format.util.js"

export function useAsync(cb) {
  const state = reactive({
    isLoading: false,
    isError: false,
    errorMessage: null,
  })

  const exec = async (...args) => {
    try {
      state.isError = false
      state.errorMessage = null
      state.isLoading = true

      return await cb(...args)
    } catch(e) {
      state.isError = true
      state.errorMessage = formatError(e)
    }finally{
      state.isLoading = false
    }
  }

  return {
    state,
    exec
  }
}