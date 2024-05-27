import axios from "axios";

export const KEY_TOKEN = "__pioneer-token"

const client = axios.create({
  baseURL: location.origin + "/api",
  timeout: 60 * 1000,
});

client.interceptors.request.use(function (config) {
  const token = localStorage.getItem(KEY_TOKEN)
  config.headers.set(KEY_TOKEN, token)

  return config;
})

export default client;
