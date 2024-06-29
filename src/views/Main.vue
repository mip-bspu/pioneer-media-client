<script setup>
import Navbar from '@/components/Navbar.vue'
import SvgIcon from '@jamescoyle/vue-icon'
import VideoOrImageContent from '@/components/VideoOrImageContent.vue';

import { mdiFaceMan } from '@mdi/js'

import { KEY_TOKEN } from "@/client"
import { ref, watch } from 'vue'
import { initialize, getSchedule } from '@/services/content.service.js'
import { useAsync } from '@/composables/useAsync';
import { log } from '@/utils/log.util.js'
import { useSetup } from '@/composables/useSetup'

const { onGetSetup } = useSetup()

const {
  state: stateInitialize,
  exec: execInitialize
} = useAsync(initialize, {messageSuccess: "Инициализация прошла успешно"})

const TIME_TRANSITION = 1000

let token = ref(localStorage.getItem(KEY_TOKEN) || "")
let lastFile = ref(null)
let file = ref(null)
let content = ref([])

async function onStart(){
  if(typeof token.value === "string" && token.value.length == 0) return; 
  
  onGetSetup()
    .then(()=>execInitialize(token.value)) 
    .then(()=>onGetSchedule())
}

onStart()

async function onGetSchedule(){
  const response = await getSchedule()

  if( response?.status === 200 ){
    content.value = response.data
  }
}

watch(
  ()=>content.value,
  (files)=>{
    file.value = files[0]
  },
  {deep: true}
)

let transitionActive = ref(false)

function updateFiles(){
  log("update")
  transitionActive.value = true;

  setTimeout(()=>{
    if(content.value.length > 1){
      content.value = content.value.slice(1)
    }else{
      onGetSchedule()
    }
  }, TIME_TRANSITION)
}
</script>

<template>
<div class="h-full flex items-center justify-center">
  <Navbar @update:schedule="onGetSchedule"/>

  <div v-if="file" class="content">
    <video-or-image-content 
        :file="file" 
        @update:next="updateFiles"
        @update:onload="()=>transitionActive = false"
    />

    <div :class="['content__transition', transitionActive ? 'active' : '']">
      <svg-icon type="mdi" :path="mdiFaceMan" class="content__icon"/>
    </div>
  </div>

  <form @submit.prevent="onStart" class="mx-600 p-md" v-else>
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
</div>
</template>

<style lang="scss">
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