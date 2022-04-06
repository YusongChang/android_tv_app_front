import axios from "axios";
import { msgURL } from "./config/baseURL";

// 傳訊 API Get

const msgRequest = axios.create({
    baseURL: `${msgURL}/`,
});
msgRequest.interceptors.request.use(
    (config) => {
        // console.log("請求發起前", config);

        return config;
    },
    (error) => {
        console.log(error.response);
        return Promise.reject(error);
    }
);
msgRequest.interceptors.response.use(
    (response) => {
        console.log("回覆請求發起後 : ", JSON.stringify(response));
        return response;
    },
    (error) => {
        console.log("回覆 請求發起後 : ", JSON.stringify(error));
        return Promise.reject(error);
    }
);
export const postLodMsg = (payload) => msgRequest.get(`api/lod_done_msg.php`, { params: { stb_ip: payload.stb_ip, stb_mac: payload.stb_mac, msg: payload.msg } });