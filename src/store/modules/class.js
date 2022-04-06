import { x2j } from '../../plugins'; //xml to js
import {
    apiGetClass,
    apiGetCourseList,
    apiPostCourseEpisode,
    apiGetCourseSubject,
    apiPostChtCourse,
    apiPostCourseNote,
    apiGetCourseNotes,
    apiPostEditCourseNote,
    apiPostDeleteCourseNote,
    apiPostCourseQuizzes,
    apiPostUpdateTimecode,
    apiGetCourseQuizContent,
    apiPostAddFavour,
    apiPostUnFavour,
    apiGetRecords,
    apiGetFavours,
    apiGetUserNotes,
    apiPostRating,
    apiPostWatchRecords,
    apiGetUserRating,
    apiGetUserQuizzes,
    apiGetLessonRecord,
    apiPostQuiz,
    apiGetLodRecord,
    apiPostLodRecord,
    apiGetLodIsFavour,
    apiPostLodFavour,
    apiGetLodFavours,
    apiGetVideoProgress,
    apiPostLodRating,
    apiGetLodRating,
    apiPostLodQuiz,
    apiGetLodQuiz,
} from "../../api";

const moduleClass = {
    namespaced: true,

    state: {
        classList: {},
        courseEpisode: 0,
        courseList: {},
        subject: {},
        courseAndPoint: '',
        chtCourse: '',
        chooseClass: '',
        crudNoteRes: '',
        courseNotes: {},
        courseQuizzes: {},
        courseQuiz: {},
        quizAnswer: {},
        uptimeRes: '',
        recordList: {},
        addWatchRes: '',
        favourList: {},
        lodFavs: {},
        addFavRes: '',
        unFavRes: '',
        lodIsFav: '',
        lodFavRes: '',
        lodunFavRes: '',
        userNotes: {},
        ratingRes: '',
        quizzesList: '',
        ratingList: {},
        evalList: {},
        lessonRecords: [null],
        receiveRecord: [],
        postRecord: '',
        lessonProgress: {},
        postRating: '',
        lodRating: {},
        postQuiz:'',
        lodQuizList:'',
    },

    actions: {
        async classData({ commit }, xml) {
            // 取得班級列表
            try {
                const res = await apiGetClass(xml);
                commit('classData', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async courseList({ commit }, xml) {
            // 取得科目列表
            try {
                const res = await apiGetCourseList(xml);
                commit('courseList', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async courseEpisode({ commit }, xml) {
            // 通知產生課程單元資料 xml
            try {
                const res = await apiPostCourseEpisode(xml);
                commit('courseEpisode', res.data);
            } catch (error) {
                console.log(error.response.status);
            }
        },
        async courseSubject({ commit }, xml) {
            // 取得課程單元列表
            try {
                const res = await apiGetCourseSubject(xml);
                commit('courseSubject', res.data);
            } catch (error) {
                console.log(error.response.status);
            }
        },
        async lessonRecords({ commit }, payload) {
            // 中華電信課程單元列表進度、評價相關資料
            try {
                const res = await apiGetLessonRecord(payload);
                commit('lessonRecords', res.data);
            } catch (error) {
                console.log(error.response.status);
            }
        },
        async chtCourse({ commit }, payload) {
            // 中華電信課程 infor
            try {
                const res = await apiPostChtCourse(payload);
                commit('chtCourse', res.data);
            } catch (error) {
                console.log(error.response.status);
            }
        },
        async courseQuizzes({ commit }, payload) {
            // 中華電信課程單元所有測驗
            try {
                const res = await apiPostCourseQuizzes(payload);
                commit('courseQuizzes', res.data);
            } catch (error) {
                console.log(error.response.status);
            }
        },
        async courseNotes({ commit }, payload) {
            //* 中華電信課程 Note
            try {
                const res = await apiGetCourseNotes(payload);
                commit('courseNotes', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async addCourseNote({ commit }, payload) {
            //* 中華電信課程 Note
            try {
                const res = await apiPostCourseNote(payload);
                commit('crudCourseNote', res.data);
            } catch (error) {
                console.log(error.response.status);
            }
        },
        async editCourseNote({ commit }, payload) {
            //* 中華電信課程 Note 更新
            try {
                const res = await apiPostEditCourseNote(payload);
                commit('crudCourseNote', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCourseNote({ commit }, payload) {
            //* 中華電信課程 Note 刪除
            try {
                const res = await apiPostDeleteCourseNote(payload);
                commit('crudCourseNote', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async updateTimecode({ commit }, payload) {
            // 繼續觀看紀錄更新
            try {
                const res = await apiPostUpdateTimecode(payload);
                console.log(payload);
                commit('updateTimecode', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async courseQuizContent({ commit }, payload) {
            //* 取得中華電信課程 quiz 題目
            try {
                const res = await apiGetCourseQuizContent(payload);
                commit('courseQuizContent', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async submitQuiz({ commit }, payload) {
            //* 提交中華電信課程測驗卷
            try {
                const res = await apiPostQuiz(payload);
                commit('submitQuiz', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async addFavour({ commit }, payload) {
            try {
                const res = await apiPostAddFavour(payload);
                commit('addFavour', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async unFavour({ commit }, payload) {
            try {
                const res = await apiPostUnFavour(payload);
                commit('unFavour', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodIsFavour({ commit }, payload) {
            try {
                const res = await apiGetLodIsFavour(payload);
                commit('lodIsFavour', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodFavour({ commit }, payload) {
            // 加入收藏
            try {
                const res = await apiPostLodFavour(payload);
                commit('lodFavour', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async rating({ commit }, payload) {
            // 新增課程評分或理解度
            try {
                const res = await apiPostRating(payload);
                commit('rating', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async userQuizzes({ commit }, payload) {
            // 取得測驗紀錄
            try {
                const res = await apiGetUserQuizzes(payload);
                commit('userQuizzes', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async userRating({ commit }, payload) {
            // 取得課程評分
            try {
                const res = await apiGetUserRating(payload);
                commit('userRating', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async userEval({ commit }, payload) {
            // 取得理解度
            try {
                const res = await apiGetUserRating(payload);
                commit('userEval', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async watchRecords({ commit }, payload) {
            // 新增收視紀錄、頁面停留
            try {
                const res = await apiPostWatchRecords(payload);
                commit('watchRecords', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async records({ commit }, payload) {
            // 觀看紀錄
            try {
                const res = await apiGetRecords(payload);
                commit('records', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async favours({ commit }) {
            try {
                const res = await apiGetFavours();
                commit('favours', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async userNotes({ commit }, payload) {
            //* 中華電信課程 Note
            try {
                const res = await apiGetUserNotes(payload);
                commit('userNotes', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodGetRecord({ commit }, payload) {
            // 取得播放紀錄
            try {
                const res = await apiGetLodRecord(payload);
                commit('lodGetRecord', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodPostRecord({ commit }, payload) {
            // 更新播放紀錄
            try {
                const res = await apiPostLodRecord(payload);
                commit('lodPostRecord', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodFavours({ commit }, payload) {
            // 取得所有收藏
            try {
                const res = await apiGetLodFavours(payload);
                commit('lodFavours', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async videoProgress({ commit }, payload) {
            // 取得播放紀錄
            try {
                const res = await apiGetVideoProgress(payload);
                commit('videoProgress', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodPostRating({ commit }, payload) {
            // 評價與評分共用
            try {
                const res = await apiPostLodRating(payload);
                commit('lodPostRating', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async userLodRating({ commit }, payload) {
            // 取得 lod 課程評價與評分
            try {
                const res = await apiGetLodRating(payload);
                commit('userLodRating', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodPostQuiz({ commit }, payload) {
            // 更新測驗紀錄
            try {
                const res = await apiPostLodQuiz(payload);
                commit('lodPostQuiz', res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async lodQuiz({ commit }, payload) {
            // 取得測驗紀錄
            try {
                const res = await apiGetLodQuiz(payload);
                commit('lodQuiz', res.data);
            } catch (error) {
                console.log(error);
            }
        },
    },

    mutations: {
        classData(state, payload) {
            let data = x2j(payload);
            state.classList = {};
            state.classList = data;
        },
        courseList(state, payload) {
            let data = x2j(payload);
            state.courseList = {};
            state.courseList = data;
        },
        courseEpisode(state, payload) {
            let data = x2j(payload);
            state.courseEpisode = 0;
            state.courseEpisode = data;
        },
        courseSubject(state, payload) {
            let data = x2j(payload);
            state.subject = {};
            state.subject = data;
        },
        lessonRecords(state, payload) {
            state.lessonRecords = [];
            state.lessonRecords = payload;
        },
        chtCourse(state, payload) {
            state.chtCourse = '';
            state.chtCourse = payload;
        },
        courseQuizzes(state, payload) {
            state.courseQuizzes = {};
            state.courseQuizzes = payload;
        },
        courseNotes(state, payload) {
            state.courseNotes = {};
            state.courseNotes = payload;
        },
        crudCourseNote(state, payload) {
            state.crudNoteRes = '';
            state.crudNoteRes = payload;
        },
        courseQuizContent(state, payload) {
            state.courseQuiz = {};
            state.courseQuiz = payload;
        },
        submitQuiz(state, payload) {
            state.quizAnswer = {};
            state.quizAnswer = payload
        },
        updateTimecode(state, payload) {
            state.uptimeRes = '';
            state.uptimeRes = payload;
        },
        records(state, payload) {
            state.recordList = {};
            state.recordList = payload;
        },
        addFavour(state, payload) {
            state.addFavRes = '';
            state.addFavRes = payload;
        },
        unFavour(state, payload) {
            state.unFavRes = '';
            state.unFavRes = payload;
        },
        lodIsFavour(state, payload) {
            state.lodIsFav = '';
            state.lodIsFav = payload;
        },
        lodFavour(state, payload) {
            state.lodFavRes = '';
            state.lodFavRes = payload;
        },
        userQuizzes(state, payload) {
            state.quizzesList = '';
            state.quizzesList = payload;
        },
        rating(state, payload) {
            state.ratingRes = '';
            state.ratingRes = payload;
        },
        userRating(state, payload) {
            state.ratingList = {};
            state.ratingList = payload;
        },
        userEval(state, payload) {
            state.evalList = {};
            state.evalList = payload;
        },
        watchRecords(state, payload) {
            state.addWatchRes = {};
            state.addWatchRes = payload;
        },
        favours(state, payload) {
            state.favourList = {};
            state.favourList = payload;
        },
        userNotes(state, payload) {
            state.userNotes = {};
            state.userNotes = payload;
        },
        lodGetRecord(state, payload) {
            state.receiveRecord = [];
            state.receiveRecord = payload;
        },
        lodPostRecord(state, payload) {
            state.postRecord = '';
            state.postRecord = payload;
        },
        lodFavours(state, payload) {
            state.lodFavs = {};
            state.lodFavs = payload;
        },
        videoProgress(state, payload) {
            state.lessonProgress = {};
            state.lessonProgress = payload;
        },
        lodPostRating(state,payload){
            state.postRating = '';
            state.postRating = payload;
        },
        userLodRating(state,payload){
            state.lodRating = '';
            state.lodRating = payload;
        },
        lodPostQuiz(state,payload){
            state.postQuiz = '';
            state.postQuiz = payload;
        },
        lodQuiz(state,payload){
            state.lodQuizList = '';
            state.lodQuizList = payload;
        }
    },

    getters: {
        getClassData(state) {
            return state.classList
        },
        getCourseList(state) {
            return state.courseList
        },
        getCourseEpisode(state) {
            return state.courseEpisode
        },
        getCourseSubject(state) {
            return state.subject
        },
        getLessonRecords(state) {
            return state.lessonRecords;
        },
        getChtCourse(state) {
            return state.chtCourse
        },
        getCourseQuizzes(state) {
            return state.courseQuizzes
        },
        getCourseQuiz(state) {
            return state.courseQuiz
        },
        getQuizAnswer(state) {
            return state.quizAnswer;
        },
        getCourseNotes(state) {
            return state.courseNotes
        },
        getCRUDCourseNote(state) {
            return state.crudNoteRes
        },
        getUpdateTimeCode(state) {
            return state.uptimeRes
        },
        getRecords(state) {
            return state.recordList;
        },
        getAddFavour(state) {
            return state.addFavRes;
        },
        getUnFavour(state) {
            return state.unFavRes;
        },
        getUserQuizzes(state) {
            return state.quizzesList;
        },
        getRatingRes(state) {
            return state.ratingRes;
        },
        getUserRating(state) {
            return state.ratingList;
        },
        getUserEval(state) {
            return state.evalList;
        },
        getWatchRes(state) {
            return state.addWatchRes;
        },
        getFavours(state) {
            return state.favourList;
        },
        getUserNotes(state) {
            return state.userNotes;
        },
        getAClass(state, id) {
            return state.class[id - 1]
        },
        getClassById: (state) => (id) => {
            return state.class[id - 1]
        },
        getLodRecord(state) {
            return state.receiveRecord
        },
        getLodPostRecord(state) {
            return state.postRecord
        },
        getLodIsFavour(state) {
            return state.lodIsFav;
        },
        getLodFavour(state) {
            return state.lodFavRes;
        },
        getLodFavours(state) {
            return state.lodFavs;
        },
        getVideoProgress(state) {
            return state.lessonProgress;
        },
        getLodRating(state) {
            return state.postRating
        },
        getUserLodRating(state){
            return state.lodRating
        },
        getLodQuiz(state){
            return state.postQuiz;
        },
        getLodQuizList(state){
            return state.lodQuizList;
        },
    }
}

export default moduleClass;
