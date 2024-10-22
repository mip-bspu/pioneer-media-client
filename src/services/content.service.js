import {default as client, KEY_TOKEN, API_BASE_URL} from "@/client";
import axios from "axios"


export async function initialize(token){
  const response = await axios.get("/client", {
    headers: {
      [KEY_TOKEN]: token
    }
  }, {  
    baseURL: API_BASE_URL,
    timeout: 60 * 1000
  })

  if(response?.status === 200){
    localStorage.setItem(KEY_TOKEN, token)
  }

  return response;
}

export function getSchedule() {
  return client.get("/client/schedule", {
    params: {
      to: (new Date()).toISOString().split("T")[0]
    }
  })
}

export function test(){
  return client.get("/", {
    params: {
      uuid: "14561efe-d542-47e6-b0a1-4dc9c92c645b"
    }
  })
}
