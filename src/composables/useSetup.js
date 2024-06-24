import { reactive } from "vue"
import { getSetup } from "@/services/server.service.js"

let setup = reactive({
  content: {
    video_formats: [],
    image_formats: []
  }
})

export function useSetup() {
  async function onGetSetup() {
    let res = await getSetup()

    if( res?.status === 200 ) {
      Object.assign(setup, res.data)
    }
  }
  
  onGetSetup()

  const getAvailableImageFormats = () => setup.content.image_formats || []
  const getAvailableVideoFormats = () => setup.content.video_formats || []

  const isImageByExt = (ext) => getAvailableImageFormats().find(e => e.localeCompare(ext) ) !== undefined
  const isVideoByExt = (ext) => getAvailableVideoFormats().find(e => e.localeCompare(ext) ) !== undefined

  return {
    setup,

    getAvailableImageFormats,
    getAvailableVideoFormats,

    isImageByExt,
    isVideoByExt
  }
}