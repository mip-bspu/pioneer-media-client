import axios from "axios";

export const KEY_TOKEN = "pioneer-token"
export const API_BASE_URL = location.origin + "/api"

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60 * 1000,
});

client.interceptors.request.use(function (config) {
  const token = localStorage.getItem(KEY_TOKEN)
  config.headers.set(KEY_TOKEN, token)

  return config;
})

export default client;
