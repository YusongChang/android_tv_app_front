import { postLogin } from './postLogin';
import { postUserValidate } from './postUserValidate';
import { postInforLogin } from './postInforLogin';
import { postInforBranch, postBranchLogout } from './postInforBranch';
import { postDeductPoint } from './postDeductPoint';
import { getClass } from './getClass';
import { getCourseList } from './getCourseList';
import { postCourseEpisode } from './postCourseEpisode';
import { getCourseSubject } from './getCourseSubject';
import { getUserPoint } from './getUserPoint';
import { getCourseAndDeduct } from './getCourseAndDeduct';
import { getCourseDeductRecord } from './getCourseDeductRecord';
import { getStudentPhoto } from './getStudentPhoto';
import { postChtCourse } from './postChtCourse';
import { postCourseQuizzes } from './postCourseQuizzes';
import { postCourseNote } from './postCourseNote';
import { getCourseNotes } from './getCourseNotes';
import { postEditCourseNote } from './postEditCourseNote';
import { postDeleteCourseNote } from './postDeleteCourseNote';
import { postUpdateTimecode } from './postUpdateTimecode';
import { getCourseQuizContent } from './getCourseQuizContent';
import { postAddFavour } from './postAddFavour';
import { postUnFavour } from './postUnFavour';
import { getRecords } from './getRecords';
import { getFavours } from './getFavours';
import { getUserNotes } from './getUserNotes';
import { postWatchRecords } from './postWatchRecords';
import { getUserQuizzes } from './getUserQuizzes';
import { postRating } from './postRating';
import { getUserRating } from './getUserRating';
import { getReserveCrossDetail } from './getReserveCrossDetail';
import { getReserveDetail } from './getReserveDetail';
import { getReserveDetailXML } from './getReserveDetailXML';
import { getLessonRecord } from './getLessonRecord';
import { postQuiz } from './postQuiz';
import { getLodMsg } from './getLodMsg';
import { postLodMsg } from './postLodMsg';
import { getLodRecord } from './getLodRecord';
import { postLodRecord } from './postLodRecord';
import { postBranchCode } from './postBranchCode';
import { getSchoolCode } from './getSchoolCode';
import { postLodFavour } from './postLodFavour';
import { getLodIsFavour } from './getLodIsFavour';
import { getLodFavours } from './getLodFavours';
import { getVideoProgress } from './getVideoProgress';
import { postLodRating } from './postLodRating';
import { getLodRating } from './getLodRating';
import { postLodQuiz } from './postLodQuiz';
import { getLodQuiz } from './getLodQuiz';

// 智基 API
export const apiPostLogin = postLogin;
export const apiPostUserValidate = postUserValidate;
export const apiPostInforLogin = postInforLogin;
export const apiPostInforBranch = postInforBranch;
export const apiPostBranchLogout = postBranchLogout;
export const apiGetClass = getClass;
export const apiGetCourseList = getCourseList;
export const apiGetCourseSubject = getCourseSubject;
export const apiGetUserPoint = getUserPoint;
export const apiGetCourseAndDeduct = getCourseAndDeduct;
export const apiGetCourseDeductRecord = getCourseDeductRecord;
export const apiPostDeductPoint = postDeductPoint;
export const apiGetStudentPhoto = getStudentPhoto;
export const apiGetReserveCrossDetail = getReserveCrossDetail;
export const apiGetReserveDetail = getReserveDetail;
export const apiGetReserveDetailXML = getReserveDetailXML;
export const apiPostBranchCode = postBranchCode;
export const apiPostSchoolCode = getSchoolCode;

// 中華電信 API
export const apiPostChtCourse = postChtCourse;
export const apiPostCourseQuizzes = postCourseQuizzes;
export const apiPostCourseNote = postCourseNote;
export const apiGetCourseNotes = getCourseNotes;
export const apiPostUpdateTimecode = postUpdateTimecode;
export const apiPostEditCourseNote = postEditCourseNote;
export const apiPostDeleteCourseNote = postDeleteCourseNote;
export const apiGetCourseQuizContent = getCourseQuizContent;
export const apiPostAddFavour = postAddFavour;
export const apiPostUnFavour = postUnFavour;
export const apiGetRecords = getRecords;
export const apiGetFavours = getFavours;
export const apiGetUserNotes = getUserNotes;
export const apiPostWatchRecords = postWatchRecords;
export const apiGetUserQuizzes = getUserQuizzes;
export const apiPostRating = postRating;
export const apiGetUserRating = getUserRating;
export const apiPostCourseEpisode = postCourseEpisode
export const apiGetLessonRecord = getLessonRecord
export const apiPostQuiz = postQuiz;

// 鉅瑞 API
export const apiGetLodMsg = getLodMsg;
export const apiPostLodMsg = postLodMsg;

// 鉅瑞 API
export const apiGetLodRecord = getLodRecord;
export const apiPostLodRecord = postLodRecord;
export const apiGetLodIsFavour = getLodIsFavour;
export const apiPostLodFavour = postLodFavour;
export const apiGetLodFavours = getLodFavours;
export const apiGetVideoProgress = getVideoProgress;
export const apiPostLodRating = postLodRating;
export const apiGetLodRating = getLodRating;
export const apiPostLodQuiz = postLodQuiz;
export const apiGetLodQuiz = getLodQuiz