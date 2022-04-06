import axios from "axios";
import { tcURL } from "./config/baseURL";

// Tc 智基

const tcRequest = axios.create({
    baseURL: `${tcURL}/`,
    // headers: {
    //     "Content-Type": "text/xml",
    // },
});
tcRequest.interceptors.request.use(
    (config) => {
        // console.log("請求發起前", config);
        return config;
    },
    (error) => {
        // console.log(error.response);
        return Promise.reject(error);
    }
);
tcRequest.interceptors.response.use(
    (response) => {
        // console.log("請求發起後");
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export const postUserValidate = (xmls) => tcRequest.post('apbnstddata.aspx?wsdl', xmls)