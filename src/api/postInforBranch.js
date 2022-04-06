import axios from "axios";
import { chtURL } from "./config/baseURL";

//Cht 中華電信

const inforBranchRequest = axios.create({
    baseURL: `${chtURL}/`,
});
inforBranchRequest.interceptors.request.use(
    (config) => {
        // console.log("請求發起前", config);
        return config;
    },
    (error) => {
        // console.log(error.response);
        return Promise.reject(error);
    }
);
inforBranchRequest.interceptors.response.use(
    (response) => {
        // console.log("請求發起後");
        console.log("請求發起後:" + JSON.stringify(response));
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const postInforBranch = (userData) => inforBranchRequest.post('api/branchschool/login', userData)
export const postBranchLogout = (data) => inforBranchRequest.post('api/branchschool/logout', data)