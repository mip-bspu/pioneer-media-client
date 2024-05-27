<script setup>
import { ref, watch } from 'vue'
import { initialize, getSchedule } from '@/services/content.service.js'
import { useAsync } from '@/composables/useAsync';


const {
  state: stateInitialize,
  exec: execInitialize
} = useAsync(initialize)

let token = ref("")
let success = ref("")

function onExecInitialize() { 
  return new Promise(async (res, rej)=>{
    await execInitialize(token.value || localStorage.getItem("__pioneer-token"))

    if(!stateInitialize.isError){
      localStorage.setItem("__pioneer-token", token.value)
      success.value = "Initialize is successful"
      res()
    }

    rej()
  })
}

let schedule = ref([])

async function onGetSchedule() {
  const res = await getSchedule()
  schedule.value = res.data
}

function onStart(){
  onExecInitialize().then(res=>{
    onGetSchedule()
  })
}


onStart()

let videoRef = ref(null)
let index = ref(0);
let currentFile = ref(null)

let timeoutId = ref(null);

watch(
  ()=>[schedule.value, index.value],
  ([s, t])=>{
    if(s.length){
      currentFile.value = schedule.value[index.value]

      if(currentFile.value == undefined){
        onGetSchedule()
        index.value = 0;
      }
    }
  }
)

let next = ()=>{
  index.value++;
  clearInterval(timeoutId.value)
  timeoutId.value = null
}

watch(
  ()=>currentFile.value,
  (file)=>{
    if(file && file.ext == ".png" ){
      console.log(file.time)
      timeoutId.value = setTimeout(()=>{
        next()
      }, file.time*1000)
    }
  }
)

watch(
  ()=>videoRef.value,
  (video)=>{
    if(video){
      video.addEventListener("ended", function(event){
        next()
      })
    }
  }
)

</script>

<template>
<div style="max-width: 600px" class="mx-auto">
  <div class="mt-10 video" v-if="currentFile">
    <img class="video__item" :src="`http://localhost:3333/client/content?uuid=${currentFile?.uuid}&type=${currentFile.ext}`" v-if="currentFile?.ext == '.png'"/>

    <video v-else ref="videoRef" class="video__item" height="300" :src="`http://localhost:3333/client/content?uuid=${currentFile?.uuid}&type=${currentFile.ext}`" 
      type="video/mp4" muted autoplay autobuffer preload="auto"
    ></video>
  </div>

  <form @submit.prevent="onStart" class="mt-20">
    <div class="mt-md flex gap-x-md items-center">
      <span class="text-xl">Введите токен:</span>
      <input class="px-md py-sm border border-gray-500 rounded-md outline-none" v-model="token"/>
    </div>

    <div class="mt-lg flex gap-md">
      <button class="transition ease-in-out duration-150 bg-gray-600 hover:bg-gray-300 hover:text-gray-600 py-sm px-lg rounded-md text-white tracking-wider">Initialize</button>
      <button @click.prevent="onGetSchedule" class="transition ease-in-out duration-150 bg-gray-600 hover:bg-gray-300 hover:text-gray-600 py-sm px-lg rounded-md text-white tracking-wider">Get schedule</button>
      <button @click="()=>next()"  class="transition ease-in-out duration-150 bg-gray-600 hover:bg-gray-300 hover:text-gray-600 py-sm px-lg rounded-md text-white tracking-wider">skip</button>
    </div>

    <div class="mt-lg text-sm">
      <div class="mt-lg text-sm text-red-500">
        {{ stateInitialize.errorMessage }}
      </div>
      <div class="text-green-600">{{ success }}</div>
    </div>
  </form>
</div>
</template>

<style>
.video{
  position: relative;

  height: 400px;

  background-color: black;
}
.video__item{
  height: 100%;
  width: 100%;
  object-fit: cover;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>