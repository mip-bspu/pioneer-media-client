<script setup>
import Navbar from '@/components/Navbar.vue'
import VideoOrImageContent from '@/components/VideoOrImageContent.vue'

import SvgIcon from '@jamescoyle/vue-icon'
import { mdiFaceMan } from '@mdi/js'

import { reactive, ref, watch } from 'vue'
import { KEY_TOKEN } from "@/client"
import { initialize, getSchedule } from '@/services/content.service.js'
import { useAsync } from '@/composables/useAsync'
import { useSetup } from '@/composables/useSetup'
import { useWorker } from '@/composables/useWorker'

const { onGetSetup } = useSetup()

const {
  state: stateInitialize,
  exec: execInitialize
} = useAsync(initialize, { messageSuccess: "Инициализация прошла успешно" })

const TIME_TRANSITION = +__APP_ENV__.VITE_TIME_TRANSITION
const TIME_DELAY_CHANGE = +__APP_ENV__.VITE_TIME_DELAY_CHANGE
const TIME_INTERVAL_SCHEDULE = +__APP_ENV__.VITE_TIME_INTERVAL_SCHEDULE

let token = ref(localStorage.getItem(KEY_TOKEN) || "")

let schedule = reactive({
  content: [],
  lastFile: null,
  file: null,
})

let player = reactive({
  isTransitionEnded: true,
  isLoadEnded: false,
  play: false,

  trigger: false
})

const {
  close: closeSchedule, 
  worker: workerSchedule 
} = useWorker(async () => {
  schedule.content.length !== 0 ? 
    closeSchedule() : 
    onGetSchedule()
}, TIME_INTERVAL_SCHEDULE) // warning: the worker duplicated after hmr update if the file has been changed

watch(
  ()=>[player.isTransitionEnded, player.isLoadEnded],
  ([isTransitionEnded, isLoadEnded]) => {
    if( isPlay() ) { 
      player.play = true
    }
  },
  { deep: true }
)

const triggerPlayer = () => player.trigger = !player.trigger

const onTransitionEnded = () => player.isTransitionEnded = true
const onLoadEnded = () => player.isLoadEnded = true

const equalLastFile = (file) => schedule.lastFile?.uuid && schedule.lastFile.uuid === file.uuid

const isPlay = () => 
  player.isTransitionEnded && player.isLoadEnded || 
  player.isTransitionEnded && equalLastFile(schedule.file)


function onStart(){
  if(typeof token.value === "string" && token.value.length == 0) return; 

  execInitialize(token.value)
    .then(()=>onGetSetup()) 
    .then(()=>onGetSchedule())
}
onStart()

async function onGetSchedule(){
  const response = await getSchedule()

  if( response?.status === 200 ){
    schedule.content = response.data

    if(schedule.content.length === 0){
      workerSchedule()
    }
  } else {
    workerSchedule()
  }
}

function onNextFile(oldFile) {
  if(schedule.content.length <= 1){
    onGetSchedule()
    return;
  }

  schedule.content = schedule.content.slice(1)
}

function playTransition() {
  player.isTransitionEnded = false
  player.isLoadEnded = false

  player.play = false

  setTimeout(onTransitionEnded, TIME_TRANSITION)
}

watch(
  ()=>schedule.content,
  ()=>{
    if(schedule.content.length == 0) return;
    
    schedule.lastFile = schedule.file    
    let file = schedule.content[0]

    if( !equalLastFile(file) ){
      playTransition()

      setTimeout(()=>schedule.file = schedule.content[0], TIME_DELAY_CHANGE)
    }else{
      triggerPlayer()
    }
  },
  { deep: true }
)
</script>

<template>
<div class="h-full flex items-center justify-center">
  <navbar @update:schedule="onGetSchedule"/>

  <div v-if="schedule.file && schedule.content.length" class="content">
    <video-or-image-content 
        :file="schedule.file"
        :play="player.play"
        :trigger="player.trigger"
        @update:next="onNextFile"
        @update:onload="onLoadEnded"
    />

    <div :class="['content__transition', !player.play ? 'active' : '']">
      <svg-icon type="mdi" :path="mdiFaceMan" class="content__icon"/>
    </div>
  </div>

  <form v-else-if="token.length == 0" @submit.prevent="onStart" class="mx-600 p-md">
    <div class="flex-col">
      <span class="text-xl">Введите токен:</span>

      <div class="flex-row gap-2 mt-md">
        <input class="px-md py-sm border border-gray-500 rounded-md outline-none" v-model="token"/>
        <button class="py-sm px-md ml-sm text-white bg-green-700 rounded-md">Отправить</button>
      </div>
    </div>

    <div class="text-sm h-1">
      <div class="mt-sm text-sm text-red-500">
        {{ stateInitialize.errorMessage }}
      </div>
      <div class="text-green-600">{{ stateInitialize.messageSuccess }}</div>
    </div>
  </form>

  <div v-else class="w-full flex flex-col items-center justify-center">
    <div class="bg-slate-200 p-md w-2/5 rounded-md text-center">
      <span class="text-zinc-600 text-2xl">Контент не задан</span>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.content{
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  
  width: 100%;
  height: 100%;

  max-width: 100vw;
  max-height: 100vh;

  background-color: black;

  &__transition{
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    z-index: 4;
    top: 0; bottom: 0;
    left: 0; right: 0;

    background-color: rgb(34, 87, 152);

    transition: all 0.2s ease-in-out;
    opacity: 0;

    &.active{
      opacity: 1;
    }
  }

  &__icon{
    color: rgba(255, 255, 255, 0.576);

    width: 200px;
    height: 200px;
  }
}
</style>