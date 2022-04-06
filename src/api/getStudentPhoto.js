import axios from "axios";
import { tcPhotoUrl } from "./config/baseURL";

// Tc 智基

const tcRequest = axios.create({
    baseURL: `${tcPhotoUrl}/`,
});
tcRequest.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        // console.log("請求發起前" + + JSON.stringify(error));
        return Promise.reject(error);
    }
);
tcRequest.interceptors.response.use(
    (response) => {
        // console.log("請求發起後:" + JSON.stringify(response));
        return response;
    },
    (error) => {
        // console.log('連不上 tc 伺服器');
        return Promise.reject(error);
    }
);
export const getStudentPhoto = (xmls) => tcRequest.post('aPBNSTDPIC.aspx?wsdl', xmls)