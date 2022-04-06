import axios from "axios";
import { juruiURL } from "./config/baseURL";

// 評價、評分共用 API Get

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
export const postLodQuiz = (payload) => request.post(`api/course/quizzes_record.php`, payload);