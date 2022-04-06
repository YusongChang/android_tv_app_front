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
        // console.log(error.response);
        return Promise.reject(error);
    }
);
msgRequest.interceptors.response.use(
    (response) => {
        // console.log("請求發起後 : ", response);
        return response;
    },
    (error) => {
        // console.log("請求發起後 : ", error.response);
        return Promise.reject(error);
    }
);
export const getLodMsg = (payload) => msgRequest.get(`api/lod_get_msg.php`, { params: { stb_ip: payload.stb_ip, stb_mac: payload.stb_mac} });