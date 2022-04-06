import axios from "axios";
import { chtURL } from "./config/baseURL";

// cht 中華電信

const chtNoteRequest = axios.create({
    baseURL: `${chtURL}/`,
});
chtNoteRequest.interceptors.request.use(
    (config) => {
        // console.log("請求發起前", config);
        if(sessionStorage.getItem('token')){
            config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`;
        }
        return config;
    },
    (error) => {
        // console.log(error.response);
        return Promise.reject(error);
    }
);
chtNoteRequest.interceptors.response.use(
    (response) => {
        // console.log("請求發起後 : ", response);
        return response;
    },
    (error) => {
        // console.log("請求發起後 : ",error.response);
        return Promise.reject(error);
    }
);

export const postEditCourseNote = (payload) => chtNoteRequest.put(`api/learning/note`,payload);