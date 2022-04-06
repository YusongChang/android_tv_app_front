
import { x2j } from '../../plugins'; //xml to js
import {
    apiPostUserValidate,
    apiGetUserPoint,
    apiGetCourseAndDeduct,
    apiGetCourseDeductRecord,
    apiPostDeductPoint,
    apiGetStudentPhoto,
    apiGetReserveCrossDetail,
    apiGetReserveDetail,
    apiGetReserveDetailXML,
    apiGetLodMsg,
    apiPostLodMsg,
} from "../../api";
const moduleUser = {
    namespaced: true,
    state: {
        validated: '',
        courseAndDeduct: {},
        courseDeductRecord: {},
        deductPoint: '',
        point: '',
        studPhoto: {},
        reserveCross: {},
        reserveDetail: {},
        reserveDetailXML: {},
        receiveMsg: '',
        postMsg: '',
    },
    actions: {
        async userValidate({ commit }, xmls) {
            // 使用者登入 IP 位址驗證、通知產生預約課程資料 xml
            const res = await apiPostUserValidate(xmls);
            commit('userValidate', res.data)
        },
        async userPoint({ commit }, xmls) {
            // 可用點數查詢
            const res = await apiGetUserPoint(xmls);
            commit('userPoint', res.data)
        },
        async courseAndDeduct({ commit }, xml) {
            // 通知產生看課紀錄及扣點紀錄 xml
            try {
                const res = await apiGetCourseAndDeduct(xml);
                commit('courseAndDeduct', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async courseDeductRecord({ commit }, xml) {
            // 取得看課紀錄及扣點紀錄 xml
            try {
                const res = await apiGetCourseDeductRecord(xml);
                commit('courseDeductRecord', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async deductPoint({ commit }, xml) {
            // 扣點處理
            try {
                const res = await apiPostDeductPoint(xml);
                commit('deductPoint', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async studentPhoto({ commit }, xml) {
            // 學生頭貼
            try {
                const res = await apiGetStudentPhoto(xml);
                commit('studentPhoto', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async reserveCrossDetail({ commit }, xml) {
            // 學員跨區預約/學員未繳清/申領教材,內容處理
            try {
                const res = await apiGetReserveCrossDetail(xml);
                commit('reserveCrossDetail', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async reserveDetail({ commit }, xml) {
            // 學員代碼/教材申領相關/預約時段/考試別相關,內容處理
            try {
                const res = await apiGetReserveDetail(xml);
                commit('reserveDetail', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async reserveDetailXML({ commit }, xml) {
            // 學員代碼/教材申領相關/預約時段/考試別相關,XML
            try {
                const res = await apiGetReserveDetailXML(xml);
                commit('reserveDetailXML', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodGetMsg({ commit }, payload) {
            // 取得傳訊
            try {
                const res = await apiGetLodMsg(payload);
                commit('lodGetMsg', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodPostMsg({ commit }, payload) {
            // 確認傳訊
            try {
                const res = await apiPostLodMsg(payload);
                commit('lodPostMsg', res.data);
            } catch (error) {
                console.log(error);
            }
        }
    },
    mutations: {
        userValidate(state, payload) {
            let data = x2j(payload);
            state.validated = '';
            state.validated = data;
        },
        userPoint(state, payload) {
            let data = x2j(payload);
            state.point = '';
            state.point = data;
        },
        courseAndDeduct(state, payload) {
            let data = x2j(payload);
            state.courseAndDeduct = {};
            state.courseAndDeduct = data;
        },
        courseDeductRecord(state, payload) {
            let data = x2j(payload);
            state.courseDeductRecord = {};
            state.courseDeductRecord = data;
        },
        deductPoint(state, payload) {
            let data = x2j(payload);
            state.deductPoint = '',
                state.deductPoint = data;
        },
        studentPhoto(state, payload) {
            let data = x2j(payload);
            
            state.studPhoto = {};
            state.studPhoto = data;
        },
        reserveCrossDetail(state, payload) {
            let data = x2j(payload);
            state.reserveCross = {};
            state.reserveCross = data;
        },
        reserveDetail(state, payload) {
            let data = x2j(payload);
            state.reserveDetail = {};
            state.reserveDetail = data;
        },
        reserveDetailXML(state, payload) {
            let data = x2j(payload);
            state.reserveDetailXML = {};
            state.reserveDetailXML = data;
        },
        lodGetMsg(state, payload) {
            state.receiveMsg = '';
            state.receiveMsg = payload;
        },
        lodPostMsg(state, payload) {
            state.postMsg = '';
            state.postMsg = payload;
        }
    },
    getters: {
        getValidated(state) {
            return state.validated;
        },
        getPoint(state) {
            return state.point;
        },
        getCourseAndDeduct(state) {
            return state.courseAndDeduct
        },
        getCourseDeductRecord(state) {
            return state.courseDeductRecord
        },
        getDeductPoint(state) {
            return state.deductPoint;
        },
        getStudentPhoto(state) {
            return state.studPhoto;
        },
        getReserveCross(state) {
            return state.reserveCross;
        },
        getReserveDetail(state) {
            return state.reserveDetail;
        },
        getReserveDetailXML(state) {
            return state.reserveDetailXML;
        },
        getLodMsg(state) {
            return state.receiveMsg
        },
        getLodPostMsg(state) {
            return state.postMsg
        }
    }
}
export default moduleUser;
