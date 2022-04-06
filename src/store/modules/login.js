import { x2j } from '../../plugins'; //xml to js
import {
    apiPostLogin,
    apiPostInforLogin,
    apiPostInforBranch,
    apiPostBranchLogout,
    apiPostBranchCode,
    apiPostSchoolCode
} from "../../api";

const moduleLogin = {
    namespaced: true,

    state: {
        email: '',
        loginItem: {
            username: '',
            auth: '',
        },
        inforLogin: {},
        inforBranch: {},
        outBranch: '',
        branchCodeRetval: '',
        schoolCode: '',
    },
    actions: {
        async login({ commit }, xmls) {
            try {
                const res = await apiPostLogin(xmls);
                commit('login', res.data)
            } catch (error) {
                console.log(error);
            }
        },
        async inforLogin({ commit }, userData) {
            try {
                const res = await apiPostInforLogin(userData);
                commit('inforLogin', res.data)
            } catch (error) {
                console.log(error);
            }
        },
        async inforBranch({ commit }, userData) {
            // 通知分校有會員登入
            try {
                const res = await apiPostInforBranch(userData);
                commit('inforBranch', res.data)
            } catch (error) {
                console.log(error);
            }
        },
        async branchLogout({ commit }, data) {
            // 通知分校有會員登出
            try {
                const res = await apiPostBranchLogout(data);
                commit('branchLogout', res.data)
            } catch (error) {
                console.log(error);
            }
        },
        async branchCodeRetval({ commit }, data) {
            // 通知產生智基分校碼 xml
            try {
                const res = await apiPostBranchCode(data);
                commit('branchCodeRetval', res.data)
            } catch (error) {
                console.log(error);
            }
        },
        async schoolCode({ commit }, data) {
            // 取得智基分校碼
            try {
                const res = await apiPostSchoolCode(data);
                commit('schoolCode', res.data)
            } catch (error) {
                console.log(error);
            }
        },
        logout({ commit }, isHome = false) {
            try {
                commit('logout', isHome)
            }
            catch (error) {
                console.log(error);
            }
        },
    },
    mutations: {
        login(state, payload) {
            let data = x2j(payload);
            state.loginItem = { username: '', auth: '', };
            data = data.Envelope.Body["PMBSTDLOD01.ExecuteResponse"];
            state.loginItem.username = data.Studentname.__text;
            state.loginItem.auth = data.Rtncode.__text;
        },
        inforLogin(state, payload) {
            state.inforLogin = {};
            state.inforLogin = payload;
        },
        inforBranch(state, payload) {
            state.inforBranch = {};
            state.inforBranch = payload;
        },
        branchLogout(state, payload) {
            state.outBranch = '';
            state.outBranch = payload;
        },
        branchCodeRetval(state, payload) {
            let data = x2j(payload);
            state.branchCodeRetval = '';
            data = data.Envelope.Body["PMBSTDBULT02.ExecuteResponse"];
            state.branchCodeRetval = data;
        },
        schoolCode(state, payload) {
            let data = x2j(payload);
            state.schoolCode = '';
            state.schoolCode = data;
        },
        logout(state, isHome = false) {
            // 登出並清空登入數值
            if (!isHome) {
                // 頁面非首頁
                state.loginItem = { username: '', auth: '', };
                state.inforLogin = {};
                state.inforBranch = {};
                console.log(state);
            }

        },
    },

    getters: {
        getLoginAuth(state) {
            return state.loginItem
        },
        getInforLogin(state) {
            return state.inforLogin;
        },
        getInforBranch(state) {
            return state.inforBranch;
        },
        getBranchLogout(state) {
            return state.outBranch;
        },
        getBranchCodeRetval(state) {
            return state.branchCodeRetval;
        },
        getSchoolCode(state) {
            return state.schoolCode;
        }
    }
}

export default moduleLogin;