<script setup>
import { ref, watch } from 'vue'
import { useSetup } from "@/composables/useSetup"

const props = defineProps({
  file: {type: Object},
  play: {type: Boolean},
  trigger: {type: Boolean}
})

const emit = defineEmits(['update:onload', 'update:next'])

const { isImageByExt, isVideoByExt } = useSetup()

let videoRef = ref(null)

const origin = location.origin

const getFileTimeSeconds = (file) => {
  return (file.time && 0 < file.time && file.time <=  3600 ? file.time : 10) * 1000
}

const updateFile = () => {
  emit('update:next', props.file)
}

watch(
  ()=>[props.play, props.trigger],
  ()=>{
    let {play, file} = props

    if(play){
      if( isImageByExt(file.ext) ){
        setTimeout(updateFile, getFileTimeSeconds(file))
        
        return;
      }
      
      if(isVideoByExt(file.ext)){
        if(!videoRef.value) return;
    
        videoRef.value.play()

        return;
      }
      
      console.log("unknown")
      updateFile()
    }
  },
  {
    deep: true
  }
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
      type="video/mp4" autoplay autobuffer preload="auto"
      @play="$emit('update:onload', true)"
      @ended="updateFile"
      class="content__item"
  ></video>

  <div v-else>
    Не допустимый формат файла
  </div>
</template>

<style lang="scss" scoped>
.content__item{
  height: 100%;
  width: 100%;
  object-fit: contain;

  max-height: 100vh;
  max-width: 100vw;
}
</style>