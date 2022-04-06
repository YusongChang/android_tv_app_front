import axios from "axios";
import { chtURL } from "./config/baseURL";

//Cht 中華電信

const loginChtRequest = axios.create({
    baseURL: `${chtURL}/`,
});
loginChtRequest.interceptors.request.use(
    (config) => {
        // console.log("請求發起前" + JSON.stringify(config));
        return config;
    },
    (error) => {
        // console.log("請求發起前" + + JSON.stringify(error));
        return Promise.reject(error);
    }
);
loginChtRequest.interceptors.response.use(
    (response) => {
        console.log("請求發起後:" + JSON.stringify(response));
        return response;
    },
    (error) => {
        console.log('連不上 Cht 伺服器');
        return Promise.reject(error);
    }
);
export const postInforLogin = (userData) => loginChtRequest.post('api/lod/login', userData)