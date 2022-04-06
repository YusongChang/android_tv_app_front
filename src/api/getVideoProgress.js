import axios from "axios";
import { juruiURL } from "./config/baseURL";

// API Get

const request = axios.create({
    baseURL: `${juruiURL}/`,
});
request.interceptors.request.use(
    (config) => {
        // console.log("請求發起前", config);

        return config;
    },
    (error) => {
        // console.log(error.response);
        return Promise.reject(error);
    }
);
request.interceptors.response.use(
    (response) => {
        // console.log("請求發起後 : ", JSON.stringify(response));
        return response;
    },
    (error) => {
        // console.log("請求發起後 : ", JSON.stringify(error));
        return Promise.reject(error);
    }
);
export const getVideoProgress = (payload) => request.get(`api/course/play_record.php`, { params: { syntax: payload.syntax, account: payload.account, courId: payload.courId } });