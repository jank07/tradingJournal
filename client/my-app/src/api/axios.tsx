import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Zmień jeśli Twój backend ma inną lokalizację
  withCredentials: true, // ⬅️ dzięki temu ciasteczka (cookies) są dołączane automatycznie
});

export default api;