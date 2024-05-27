<script setup>
import { ref, watch } from 'vue'
import { initialize } from '@/services/content.service.js'
import { useAsync } from '@/composables/useAsync';
import { log } from '@/utils/log.util.js'

const emit = defineEmits(['update:schedule'])

const {
  state: stateInitialize,
  exec: execInitialize
} = useAsync(initialize, {messageSuccess: "Инициализация прошла успешно"})

let token = ref("")

async function onSubmit(){
  await execInitialize(token.value)
  emit('update:schedule')
}
</script>

<template>
<div class="navbar">
  <div class="navbar__wrapper">
    <input class="navbar__input" v-model="token"/>
    <button class="navbar__btn" @click="onSubmit">отправить</button>
  </div>
</div>
</template>

<style lang="scss" scoped>
.navbar{
  display: flex;

  position: fixed;
  z-index: 10;
  top: 0;
  left: 0; right: 0;

  width: 100%;

  &__wrapper{
    width: 100%;
    height: 80px;

    display: flex;
    align-items: center;
    justify-content: right;
    gap: 1.5rem;

    padding: 0 1rem;

    background-color: rgb(3, 40, 99);
    color: white;
    
    transition: all 0.4s ease;
    transform: translateY(-100%);
  }

  &:hover .navbar__wrapper{
    transform: translateY(0);
  }

  &__input{
    padding: 0.4rem 1rem;
    border-radius: 0.2rem;
    color: black;
    outline: none;
  }

  &__btn{
    border: 1px solid white;
    padding: 0.4rem 1rem;

    border-radius: 0.2rem;
  }
}
</style>