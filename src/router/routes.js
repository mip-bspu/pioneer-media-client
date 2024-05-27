import Main from '@/views/Main.vue';
import Debug from '@/views/Debug.vue';

export const routes = [
  {
    name: "main",
    path: "/",
    component: Main
  },
  {
    name: "debug",
    path: "/debug",
    component: Debug
  }
]
