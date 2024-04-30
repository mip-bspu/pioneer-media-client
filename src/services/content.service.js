import client from "@/client";


export function initialize(token){
  return client.get("/client", {
    params: {
      token: token
    }
  })
}

export function getSchedule() {
  return client.get("/client/schedule")
}

export function test(){
  return client.get("/test", {
    params: {
      uuid: "14561efe-d542-47e6-b0a1-4dc9c92c645b"
    }
  })
}
