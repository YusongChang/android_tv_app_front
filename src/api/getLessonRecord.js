import axios from "axios";
import { chtURL } from "./config/baseURL";

// cht 中華電信

const chtRequest = axios.create({
    baseURL: `${chtURL}/`,
});
chtRequest.interceptors.request.use(
    (config) => {
        // console.log("請求發起前", config);
        if (sessionStorage.getItem('token')) {
            config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`;
        }
        return config;
    },
    (error) => {
        // console.log(error.response);
        return Promise.reject(error);
    }
);
chtRequest.interceptors.response.use(
    (response) => {
        // console.log("請求發起後");
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const getLessonRecord = (code) => chtRequest.get(`api/learning/lesson-record`, { params: { code: code } });