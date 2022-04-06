import axios from "axios";
import { tcURL } from "./config/baseURL";

// Tc 智基

const request = axios.create({
    baseURL: `${tcURL}/`,
    // headers: { // 前端加上 header 會發生 cors 錯誤
    //     "Content-Type": "text/xml",
    // },
});
request.interceptors.request.use(
    (config) => {
        // console.log("請求發起前" + JSON.stringify(config));
        return config;
    },
    (error) => {
        // console.log("請求發起前" + + JSON.stringify(error));
        return Promise.reject(error);
    }
);
request.interceptors.response.use(
    (response) => {
        // console.log("請求發起後:" + JSON.stringify(response));
        return response;
    },
    (error) => {
        alert('連結 TEKOM 伺服器失敗 :(');
        return Promise.reject(error);
    }
);

export const postLogin = (xmls) => request.post('aPMBSTDLOD01.aspx?wsdl', xmls)