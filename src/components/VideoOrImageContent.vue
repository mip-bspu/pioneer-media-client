<script setup>
import { ref, watch } from 'vue'
import { useSetup } from "@/composables/useSetup"
import { log } from '@/utils/log.util.js'

const props = defineProps({
  file: {type: Object}
})
const emit = defineEmits(['update:next', 'update:onload'])

const { isImageByExt, isVideoByExt } = useSetup()

const origin = location.origin

let videoRef = ref(null)
let imageId = ref(null)

watch(
  ()=>[props.file, videoRef.value],
  ([file, video])=>{
    if( isImageByExt(file.ext) && imageId.value === null ){
      log("image", file.uuid)

      imageId.value = setTimeout(()=>{
        emit('update:next', file)

        clearTimeout(imageId.value)
        imageId.value = null
      }, file.time*1000)
    }else if( isVideoByExt(file.ext) ){
      if(!video) return;

      log("video", file.uuid)
      video.play()
      video.addEventListener("ended", ()=>emit('update:next', file))
    }else{
      log("unknown", file.uuid)

      emit('update:next', file)
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <img 
      v-if="isImageByExt(file.ext)"
      :src="`${origin}/api/client/content?uuid=${file.uuid}&type=${file.ext}`"
      @load="$emit('update:onload', true)"
      class="content__item"
  />

  <video 
      v-else-if="isVideoByExt(file.ext)" ref="videoRef"
      :src="`${origin}/api/client/content?uuid=${file.uuid}&type=${file.ext}`"
      type="video/mp4" muted autoplay autobuffer preload="auto"
      @play="$emit('update:onload', true)"
      class="content__item"
  ></video>

  <div v-else>
    Не допустимый формат файла
  </div>
</template>

<style lang="scss" scoped>
.content__item{
  height: auto;
  width: 100vw;

  max-height: 100vh;
  max-width: 100vw;
}
</style>