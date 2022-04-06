import axios from "axios";
import { chtURL } from "./config/baseURL";

// cht 中華電信

const chtNoteRequest = axios.create({
    baseURL: `${chtURL}/`,
});
chtNoteRequest.interceptors.request.use(
    (config) => {
        // console.log("Course notes 請求發起前", JSON.stringify(config));
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
        // console.log("Course notes 請求發起後 : ", JSON.stringify(response));
        return response;
    },
    (error) => {
        // console.log("請求發起後 : ", error.response);
        return Promise.reject(error);
    }
);

export const getCourseNotes = (payload) => chtNoteRequest.get(`api/learning/notes/lesson/${payload.lesson_hid}/learning?code=${payload.code}`);