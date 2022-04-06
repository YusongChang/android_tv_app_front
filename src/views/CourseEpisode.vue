<template>
  <v-container fluid>
    <v-row class="align-center">
      <v-col cols="12" lg="1"> </v-col>
      <v-col cols="12" lg="10">
        <v-card>
          <v-card-subtitle class="display-1">
            <v-btn @click="goback()" text rounded>
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ subjectName }}
          </v-card-subtitle>
          <v-card-title>課程單元內容：</v-card-title>
          <v-card-actions>
            <v-list width="100%" v-if="subject.length">
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="(subj, idx) in subject"
                  :key="idx"
                  @click="view(subj, subj.CourName)"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-row class="align-center">
                        <v-col cols="12" lg="4">
                          {{ handleNameSplit(subj.CourName) }}
                        </v-col>
                        <v-col
                          cols="12"
                          lg="7"
                          class="d-flex justify-end align-center"
                        >
                          <span class="" style="width: 100px">
                            <span>進度:</span>
                            <span>{{ subj.progress }}</span>
                            %
                          </span>
                          <span class="" style="width: 150px">
                            影片評價:
                            <span>{{ subj.evaluation }}</span>
                          </span>
                          <span class="" style="width: 130px">
                            理解度:
                            <span>{{ subj.rating }}</span>
                          </span>
                          <span class="" style="width: 135px">
                            測驗分數:
                            <span>{{ subj.quiz_score }}</span>
                          </span>
                        </v-col>
                        <v-col
                          cols="12"
                          lg="1"
                          class="d-flex justify-start align-center"
                        >
                          <span> {{ subj.VideoLength }}分鐘 </span>
                          <!-- <v-icon>mdi-play</v-icon> -->
                        </v-col>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="1"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { Cookie, lastDeduct, DateFormat } from "../composition_api";

export default {
  props: ["name", "subjectString", "courseSeq"], // router props

  data: () => ({
    loginItem: JSON.parse(sessionStorage.getItem("user")),
    email: null,
    pwd: null,
    subjInedx: 0,
    subjectTemp: [], // 暫存處理過的課程單元列表
    subject: [], // 課程單元列表
    subjectName: null,
    courseName: null,
    fullName: null,
    limitDate: null, //* 收看期限 -- 需移除
    subjString: null,
    saveCourseSeq: null,
    courseId: null,
    courId: null,
    videoFile: null,
    lessonHid: null,
    vpoint: 0,
    timeCode: 0,
    autoCheck: false,
    // recordData: { process: 0, stars: 0, understand: 0, score: 0 }, // 課程紀錄資料
  }),
  computed: {
    ...mapGetters({
      getCourseEpisode: "class/getCourseEpisode",
      getCourseSubject: "class/getCourseSubject",
      getLessonRecords: "class/getLessonRecords",
      getValidated: "user/getValidated",
      getCourseList: "class/getCourseList",
      getPoint: "user/getPoint",
      getCourseAndDeduct: "user/getCourseAndDeduct",
      getCourseDeductRecord: "user/getCourseDeductRecord",
      getDeductPoint: "user/getDeductPoint",
      getVideoProgress: "class/getVideoProgress",
      getLodQuizList: "class/getLodQuizList",
      getUserEval: "class/getUserEval",
      getUserLodRating: "class/getUserLodRating",
    }),
  },
  watch: {
    getCourseEpisode(data) {
      this.handleEpisode(data);
    },
    getCourseSubject(data) {
      this.handletList(data);
    },
    getLessonRecords(data) {
      this.handleRecords(data);
    },
    getValidated(data) {
      this.validated(data);
    },
    getCourseList(data) {
      this.handleReserved(data.Courses);
    },
    getPoint(data) {
      this.handlePoint(data);
    },
    getCourseAndDeduct(data) {
      this.deductRecord(data);
    },
    getCourseDeductRecord(data) {
      this.handleRecord(data);
    },
    getDeductPoint(data) {
      this.handleDeduct(data);
    },
    getVideoProgress(data) {
      this.handleProgress(data);
    },
    getUserEval(data) {
      this.handleEval(data);
    },
    getUserLodRating(data) {
      this.handleEvalRating(data);
    },
    getLodQuizList(data) {
      this.handleQuizzes(data);
    },
  },
  methods: {
    init() {
      const settingData = JSON.parse(Cookie.readCookie("setting") || null);
      this.stb_ip = settingData.stb_ip;
      this.subjectName = this.name;
      this.email = this.loginItem.email;
      this.pwd = this.loginItem.pwd;
      this.vpoint = 1; //目前固定 1 個時段扣 1 點
      this.saveCourseSeq = this.courseSeq;

      // if (this.courseSeq !== undefined) {
      //   this.saveCourseSeq = this.courseSeq;
      //   sessionStorage.setItem("courseSeq", this.courseSeq);
      // } else if (sessionStorage.getItem("courseSeq") !== null) {
      //   this.saveCourseSeq = sessionStorage.getItem("courseSeq");
      // }

      this.showEpisode(this.subjectString);
    },
    showEpisode(subjString) {
      this.loading();

      // 通知產生課程單元列表
      this.subjString = subjString;

      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDVLS.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Courseseq>${this.saveCourseSeq}</Courseseq>
      <Subjectstring>${subjString}</Subjectstring>
      </PBNSTDVLS.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      this.$store.dispatch("class/courseEpisode", xmls); // tc
    },
    handleEpisode(data) {
      let eps = data.Envelope.Body["PBNSTDVLS.ExecuteResponse"].Rtncode.__text;
      eps = parseInt(eps);
      if (eps > 0) {
        this.subjectList();
      } else {
        this.closeLoading();
        this.$swal({
          text: "本課程無提供影片",
          icon: "warning",
          animation: false,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
    subjectList() {
      // 取得單元列表
      this.$store.dispatch(
        "class/courseSubject",
        `${this.email + this.subjString}`
      ); // tc
    },
    handletList(data) {
      // console.log("data.VLS: " + JSON.stringify(data));
      if (data.VLS.StudentPID !== undefined) {
        this.lesssonRecords(data.VLS.StudentPID.VideoS.Video);
      } else {
        // 無影片
        this.$swal({
          text: "本課程未提供影片，請洽櫃台!",
          icon: "warining",
          animation: false,
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: true,
        });
      }
      // this.closeLoading();
    },
    lesssonRecords(data) {
      // 暫存待處理資料
      if (Array.from(data).length) {
        this.subjectTemp = data;
      } else {
        this.subjectTemp.push(data);
      }
      // 影片評價相關資料 API
      for (let i = 0; i < this.subjectTemp.length; i++) {
        this.courId = this.subjectTemp[i].CourID;
        this.$store.dispatch(
          "class/lessonRecords",
          this.subjectTemp[i].VideoFile
        );
      }
    },
    handleRecords(data) {
      // API 回傳次數+1
      this.subjInedx += 1;

      // if (Array.from(data).length < 1) {
      //   return;
      // }

      if (data.length) {
        // 單元資料更改
        for (let i = 0; i < this.subjectTemp.length; i++) {
          data[0].timecode = 0;
          data[0].progress = 0;
          data[0].rating = "尚未評分";
          data[0].evaluation = "尚未評價";
          if (data[0].has_quiz) {
            data[0].quiz_score = "尚未測驗";
          } else {
            data[0].quiz_score = "無測驗題";
          }
          if (data[0].code === this.subjectTemp[i].VideoFile) {
            this.defineProperty(this.subjectTemp[i], data[0]);
          }
        }
      }
      // 次數與陣列長度相符則賦值
      if (this.subjInedx === this.subjectTemp.length) {
        if (this.courId) {
          this.videoProgress(); // 進度等等的相關資料一步一步改寫
        }
      }
    },
    defineProperty(obj, value) {
      // 物件陣列新增屬性與值
      Object.keys(value).forEach((key) => {
        Object.defineProperty(obj, key, {
          value: value[key],
          writable: true,
        });
      });
    },
    videoProgress() {
      const payload = {
        syntax: 3,
        account: this.email,
        courId: this.courId,
      };
      this.$store.dispatch("class/videoProgress", payload);
    },
    handleProgress(data) {
      data = data.list;
      for (let i = 0; i < this.subjectTemp.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (
            data[j].timeCode !== undefined &&
            data[j].progress !== undefined &&
            data[j].code === this.subjectTemp[i].VideoFile
          ) {
            this.subjectTemp[i].timecode = data[j].timeCode;
            this.subjectTemp[i].progress = data[j].progress;
          }
        }
      }
      this.getEvalRatingList();
    },
    getEvalRatingList() {
      const payload = {
        syntax: 3,
        account: this.email,
        courId: this.courId,
      };
      this.$store.dispatch("class/userLodRating", payload);
    },
    handleEvalRating(data) {
      data = data.list;
      for (let i = 0; i < this.subjectTemp.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (data[j].code === this.subjectTemp[i].VideoFile) {
            if (data[j].evaluation !== undefined && data[j].evaluation)
              this.subjectTemp[i].evaluation = data[j].evaluation + " 顆星";
            if (data[j].rating !== undefined && data[j].rating)
              this.subjectTemp[i].rating = data[j].rating + " %";
          }
        }
      }
      this.getUserQuizzesList();
    },
    getUserQuizzesList() {
      const payload = {
        syntax: 3,
        account: this.email,
        courId: this.courId,
      };
      this.$store.dispatch("class/lodQuiz", payload);
    },
    handleQuizzes(data) {
      data = data.list;
      for (let i = 0; i < this.subjectTemp.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (data[j].code === this.subjectTemp[i].VideoFile) {
            if (data[j].score !== undefined && data[j].score)
              this.subjectTemp[i].quiz_score = data[j].score + " 分";
          }
        }
      }
      this.subject = this.subjectTemp; // 在最後一次串接時才賦予資料
      this.closeLoading();
    },

    handleNameSplit(name) {
      name = name.substring(1, name.length);
      name = name.split(";");
      this.subjectName = this.name + " " + name[4];
      return name[3] + " " + name[6];
    },
    view(data, courseName) {
      window.sessionStorage.setItem(
        // 記住真實單元名
        "courseName",
        data.CourName.replace(/;/g, "")
      );
      this.courseName = this.handleNameSplit(courseName);
      this.courseId = data.CourID;
      this.videoFile = data.VideoFile;
      this.lessonHid = data.lesson_hid;
      this.timeCode = data.timecode;
      this.fullName = data.CourName.substring(1);
      console.log(this.fullName);
      if (data) {
        this.autoCheck = false;
        this.userValidate();
      }
    },
    userValidate() {
      // 驗證、通知產生預約課程資料 xml
      console.log("CourseEpisode user validating.");
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDData.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Depofip>${this.stb_ip}</Depofip>
      </PBNSTDData.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      this.$store.dispatch("user/userValidate", xmls);
    },
    validated(data) {
      if (
        data.Envelope.Body["PBNSTDData.ExecuteResponse"].Studentpwd.__text ===
        this.pwd
      ) {
        console.log("CourseEpisode user validated.");
        this.checkReserved();
      } else {
        // IP 位址未被認證
        this.$swal({
          title: "您無權限",
          icon: "error",
          animation: false,
          timer: 1500,
          allowOutsideClick: false,
          showConfirmButton: true,
        });
        this.$emit("pageEvent", { loginData: "logout" }); //* 登出
      }
    },
    checkReserved() {
      this.$eventBus.$emit("checkReservedApp", {
        stop: false,
        email: this.email,
      }); // 通知串檢查預約 API

      // 查看是否預約
      this.$store.dispatch("class/courseList", `${this.email}`);
    },
    handleReserved(data) {
      this.$eventBus.$emit("checkReservedApp", {
        stop: true,
        email: this.email,
      }); // 通知停止重串檢查預約 API

      if (
        data.VldSub !== undefined &&
        data.VldSub === "Y" &&
        data.OnBranch !== "N"
      ) {
        console.log("CourseEpisode: 有預約喔! :)");
        console.log("this.autoCheck:", this.autoCheck);
        if (!this.autoCheck) this.userPoint(); // 是使用者想看課，非自動檢查才進扣點流程
      } else {
        // 登出學員
        this.$swal({
          title: "您尚未預約本時段",
          icon: "warning",
          animation: false,
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            this.$emit("pageEvent", { loginData: "logout" }); //* 登出，正式時需秀出來
          }
        });
        // this.userPoint(); //* 測試
      }

      // this.closeLoading();
    },
    userPoint() {
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDVLSVP.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Courseseq>${this.saveCourseSeq}</Courseseq>
      <Subjectstring>${this.subjString}</Subjectstring>
      <V01001>${this.videoFile}</V01001>
      </PBNSTDVLSVP.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      this.$store.dispatch("user/userPoint", xmls); // tc
    },
    handlePoint(data) {
      this.point = parseInt(
        data.Envelope.Body["PBNSTDVLSVP.ExecuteResponse"].Vpoint.__text
      );

      if (this.point <= 0) {
        console.log("在 CourseEpisode check point");
        this.$swal({
          text: `很抱歉您的點數不足， 剩餘${this.point}點`,
          icon: "warning",
          animation: false,
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            this.$emit("pageEvent", { loginData: "logout" }); //* 登出，正式時需秀出來
          }
        });
      } else {
        this.checkDeduct();
      }
    },
    checkDeduct() {
      // 產生今天看課紀錄及扣點紀錄 xml
      let bDate = DateFormat.localDate(new Date(), true);
      let eDate = bDate;
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PMBSTDLOD07.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Bdate>${bDate}</Bdate>
      <Edate>${eDate}</Edate>
      </PMBSTDLOD07.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      this.$store.dispatch("user/courseAndDeduct", xmls); // tc
    },
    deductRecord(data) {
      if (
        data.Envelope.Body["PMBSTDLOD07.ExecuteResponse"].Bdate !== undefined
      ) {
        this.getRecord();
      } else {
        this.$swal({
          text: "發生錯誤，無法查詢看課紀錄及扣點紀錄",
          icon: "error",
          animation: false,
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: false,
        });
      }
    },
    getRecord() {
      //查詢今天看課紀錄及扣點紀錄
      this.$store.dispatch("user/courseDeductRecord", this.email);
    },
    handleRecord(data) {
      // 檢查是否已扣點、進入下個時段
      console.log(JSON.stringify(data));

      if (data.ScribelogView.Viewdata !== undefined) {
        // 取最後扣點時間
        let lastTime = lastDeduct(data.ScribelogView.Viewdata, this.courseSeq);
        let lastDate = new Date(lastTime);
        let lastHours = DateFormat.timeFormat(lastDate, "h");

        let nowDate = new Date();
        let hours = DateFormat.timeFormat(nowDate, "h");
        let mins = DateFormat.timeFormat(nowDate, "i");
        console.log(lastHours, hours);
        if (!lastTime) {
          // 有紀錄但沒扣點則扣點
          this.deduct();
        } else {
          if (hours - lastHours > 1) {
            // 表示間隔時段
            console.log("跳過幾個時段後進入的");
            this.deduct();
          } else if (hours > lastHours) {
            if (mins >= 10) {
              //已進入 XX時10分
              console.log("已進入新時段");
              this.deduct();
            } else {
              this.goVideo();
            }
          } else {
            this.goVideo();
          }
        }
      } else {
        console.log("查無今日無看課及扣點紀錄直接進行扣點處理.");
        this.deduct();
      }
    },
    deduct() {
      // 扣點處理;
      this.$swal({
        text: `您目前點數為:${this.point},本時段將使用${this.vpoint}點`,
        icon: "warning",
        animation: false,
        timer: 0,
        showDenyButton: true,
        reverseButtons: true,
      }).then((res) => {
        if (res.isConfirmed) {
          let nowdate = new Date();
          let vlsdate = DateFormat.localDate(nowdate, true);
          let vlstime = DateFormat.timeFormat(nowdate, "h:i:s");
          let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
            <soapenv:header/>
            <soapenv:Body>
            <PBNSTDVLSSUB.Execute xmlns="CEK">
            <Studentpid>${this.email}</Studentpid>
            <Courseseq>${this.saveCourseSeq}</Courseseq>
            <Depofip>${this.stb_ip}</Depofip>
            <Subjectstring>${this.subjString}</Subjectstring>
            <V01101>${this.courseId}</V01101>
            <V01001>${this.videoFile}</V01001>
            <Vlssubpoint>${this.vpoint}</Vlssubpoint>
            <Vlsdate>${vlsdate}</Vlsdate>
            <Vlstime>${vlstime}</Vlstime>
            </PBNSTDVLSSUB.Execute>
            </soapenv:Body>
            </soapenv:Envelope>
                `;

          this.$store.dispatch("user/deductPoint", xmls);
        }
      });
    },
    handleDeduct(data) {
      console.log(data);
      if (
        data.Envelope.Body["PBNSTDVLSSUB.ExecuteResponse"].Rtncode.__text ===
        "ok"
      ) {
        this.$swal({
          text: `已使用${this.vpoint}點`,
          icon: "success",
          animation: false,
          timer: 1500,
          showConfirmButton: false,
        });

        this.goVideo();
      } else {
        this.$swal({
          text: `發生錯誤，扣點失敗`,
          icon: "error",
          animation: false,
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: true,
        });
      }
    },
    goVideo() {
      this.$router.push({
        name: "Course",
        params: {
          name: this.courseName,
          fullName: this.fullName,
          videoFile: this.videoFile,
          playTimecode: this.timeCode,
          lesson_hid: this.lessonHid,
          subjString: this.subjString,
          courseSeq: this.courseSeq,
          courseId: this.courseId,
          fromEpisode: true,
        },
      });
    },
    goback() {
      this.$router.push({ name: "ClassList" });
    },
    loading() {
      this.$eventBus.$emit("loading"); // 發出 loading 需求
    },
    closeLoading() {
      this.$eventBus.$emit("loadClose"); // 發出關閉 loading
    },
  },
  created() {
    this.$eventBus.$on("checkReserved", () => {
      this.autoCheck = true; // 自動檢查
      this.userValidate();
      console.log("CourseEpisode: ", this.autoCheck);
    });
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // removing eventBus listener
    this.$eventBus.$off("checkReserved");
  },
};
</script>

<style>
</style>