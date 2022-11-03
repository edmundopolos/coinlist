import axios from "axios";

const to = "https://staging-biz.coinprofile.co/v3/currency/rate";
const coinlist = axios.create({
  baseURL: to,
  timeout: 5000,
  headers: { "content-type": "application/json" },
});

export { coinlist, to };
