<script setup>
import { inAnyExtImages } from '@/utils/extension.util.js'
import { ref, watch } from 'vue'
import { log } from '@/utils/log.util.js'

const props = defineProps({
  file: {type: Object}
})
const emit = defineEmits(['update:next', 'update:onload'])

const origin = location.origin

let videoRef = ref(null)
let imageId = ref(null)

watch(
  ()=>[props.file, videoRef.value],
  ([file, video])=>{
    if( inAnyExtImages(file.ext) && imageId.value === null ){
      log("image", file.uuid)

      imageId.value = setTimeout(()=>{
        emit('update:next', file)

        clearTimeout(imageId.value)
        imageId.value = null
      }, file.time*1000)
    }else{
      if(!video) return;

      log("video", file.uuid)
      video.play()
      video.addEventListener("ended", ()=>emit('update:next', file))
    }
  },
  {deep: true, immediate: true}
)
</script>

<template>
  <img 
      v-if="inAnyExtImages(file.ext)"
      :src="`${origin}/api/client/content?uuid=${file.uuid}&type=${file.ext}`" 
      class="content__item"
      @load="$emit('update:onload', true)"
  />

  <video 
      v-else ref="videoRef"
      :src="`${origin}/api/client/content?uuid=${file.uuid}&type=${file.ext}`"
      type="video/mp4" muted autoplay autobuffer preload="auto"
      class="content__item"
      @play="$emit('update:onload', true)"
  ></video>
</template>

<style lang="scss" scoped>
.content__item{
  height: auto;
  width: 100vw;

  max-height: 100vh;
  max-width: 100vw;
}
</style>