import client from "@/client"

export function getSetup() {
  return client.get("/setup")
}