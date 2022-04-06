import axios from "axios";
import { tcURL } from "./config/baseURL";

// 脫離 proxy 之後，必須補上完整 URL 直接串API
// Tc 智基
const tcRequest = axios.create({
    baseURL: `${tcURL}/`,
});
tcRequest.interceptors.request.use(
    (config) => {
        // console.log("請求發起前", config);
        return config;
    },
    (error) => {
        console.log(error.response);
        return Promise.reject(error);
    }
);
// xml/<<Email>>.xml
export const postCourseEpisode = (xmls) => tcRequest.post(`apbnstdvls.aspx?wsdl`, xmls);