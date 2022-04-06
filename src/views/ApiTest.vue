<template>
  <v-container>
    <v-row class="justify-center"
      ><h1 class="red--text mt-2">Android is sucks!</h1></v-row
    >
    <v-row class="justify-center"> 點數:{{ point }} </v-row>
    <v-row class="justify-center mb-2">
      <v-btn color="primary" @click="login">Login</v-btn>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="6">
        <v-list>
          <v-list-item-content>
            <v-list-item-title>觀看期限: {{ limitDate }}</v-list-item-title>
          </v-list-item-content>
          <v-list-group v-for="(item, idx) in selectCourse" :key="idx">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.SubjectSName"
                  @click="showEpisode(item.SubjectString)"
                ></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item-group v-show="courseEpisode">
              <v-list-item
                v-for="episode in courseEpisode"
                :key="episode.CourName"
              >
                <v-list-item-content>
                  <v-list-item-title
                    v-text="episode.CourName"
                    @click="view(episode)"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list-group>
        </v-list>
      </v-col>
      <v-col cols="6"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    loginItem: JSON.parse(sessionStorage.getItem("user")),
    email: "",
    pwd: "",
    ip: "",
    point: 0,
    classList: {},
    courseList: [],
    selectCourse: {},
    courseEpisode: [],
    courseId: "",
    courseSeq: "",
    subjString: "",
    videoFile: "",
    vpoint: 0,
    limitDate: "",
    nowdate: "",
  }),
  computed: {
    ...mapGetters({
      getLoginAuth: "login/getLoginAuth",
      getValidated: "user/getValidated",
      getClassData: "class/getClassData",
      getCourseList: "class/getCourseList",
      getCourseEpisode: "class/getCourseEpisode",
      getCourseSubject: "class/getCourseSubject",
      getCourseAndDeduct: "user/getCourseAndDeduct",
      getCourseDeductRecord: "user/getCourseDeductRecord",
      getPoint: "user/getPoint",
      getDeductPoint: "user/getDeductPoint",
    }),
  },
  watch: {
    getLoginAuth: {
      handler: function (data) {
        this.handleLogin(data);
      },
      deep: true,
    },
    getValidated(data) {
      this.validated(data);
    },
    getClassData(data) {
      this.handleList(data);
    },
    getCourseList(data) {
      this.limitDate = data.Courses.DATE;
      this.handleCourseList(data.Courses);
    },
    getCourseEpisode(data) {
      this.handleEpisode(data);
    },
    getCourseSubject(data) {
      this.handleSubjectList(data);
    },
    getCourseAndDeduct(data) {
      this.deductRecord(data);
    },
    getCourseDeductRecord(data) {
      this.handleRecord(data);
    },
    getPoint(data) {
      this.handlePoint(data);
    },
    getDeductPoint(data) {
      this.handleDeduct(data);
    },
  },
  methods: {
    init() {
      this.email = "B180809170";
      this.password = "0000";
      this.ip = "59.120.78.34"; //* 測試用機上盒固定 IP - 台中溪湖營業所 // 斗六鉅銳- 220.134.127.146
      this.nowdate = new Date();
    },
    login() {
      // tekom API login
      if (this.email && this.password) {
        let xmls =
          '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">' +
          "<soapenv:Header/>" +
          "<soapenv:Body>" +
          "<tem:PMBSTDLOD01A.Execute>" +
          "<tem:Studentpid>" +
          this.email +
          "</tem:Studentpid>" +
          "<tem:Studentpwd>" +
          this.password +
          "</tem:Studentpwd>" +
          "</tem:PMBSTDLOD01A.Execute>" +
          "</soapenv:Body>" +
          "</soapenv:Envelope>";

        this.$store.dispatch("login/login", xmls);
      } else {
        this.$swal({
          text: "有欄位未填寫，請檢查",
          icon: "error",
          animation: false,
          timer: 1500,
          showConfirmButton: true,
        });
      }
    },
    handleLogin(data) {
      // tc 提供

      if (data.auth !== "Y") {
        this.$swal({
          text: "帳密有誤，請再檢查一次",
          icon: "error",
          animation: false,
          timer: 1500,
          showConfirmButton: true,
        });
      } else {
        if (data.username) {
          this.username = data.username;
          this.userValidte();
        }
      }
    },
    userValidte() {
      console.log("user validating.");
      let xmls = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDData.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Depofip>${this.ip}</Depofip>
      </PBNSTDData.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `; // Depofip 暫時寫死
      this.$store.dispatch("user/userValidate", xmls);
    },
    validated(data) {
      let text = "登入成功";
      let icon = "success";
      if (
        data.Envelope.Body["PBNSTDData.ExecuteResponse"].Studentpwd.__text ===
        this.password
      ) {
        console.log("user validated.");
        this.getClassListData();
      } else {
        text = "您無登入權限"; // IP 位址未被認證
        icon = "error";
      }

      this.$swal({
        text: text,
        icon: icon,
        animation: false,
        timer: 1500,
        showConfirmButton: true,
      });
    },
    getClassListData() {
      // 取得班級資料
      this.$store.dispatch("class/classData", this.email);
    },
    handleList(data) {
      if (data) {
        this.classList = data;
        this.courseListData();
      }
    },
    courseListData() {
      //* 取得科目
      this.$store.dispatch("class/courseList", `${this.email}`);
    },
    handleCourseList(data) {
      for (let i = 0; i < data.Course.length; i++) {
        this.courseList.push(data.Course[i].SubjectS.Subject);
      }
      // console.log(this.courseList);
      this.selectCourse = this.courseList[1];
      this.courseSeq = data.Course[1].CourseSeq; //* 第一班選課序列
    },
    showEpisode(subjString) {
      this.subjString = subjString;

      // 通知產生課程單元列表
      let xmls = `    
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDVLS.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Courseseq>${this.courseSeq}</Courseseq>
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
      }
    },
    subjectList() {
      // 取得單元列表
      this.$store.dispatch(
        "class/courseSubject",
        `${this.email + this.subjString}`
      ); // tc
    },
    handleSubjectList(data) {
      this.courseEpisode = [];
      if (Array.from(data.VLS.StudentPID.VideoS.Video).length) {
        this.courseEpisode = data.VLS.StudentPID.VideoS.Video;
      } else {
        this.courseEpisode.push(data.VLS.StudentPID.VideoS.Video);
      }
    },
    view(data) {
      this.courseId = data.CourID;
      this.videoFile = data.VideoFile;
      this.vpoint = data.VideoPoints;
      if (data) {
        this.userPoint();
      }
    },
    userPoint() {
      let xmls = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDVLSVP.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Courseseq>${this.courseSeq}</Courseseq>
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
      this.checkDeduct();
    },
    checkDeduct() {
      // 查詢最後一次看課紀錄及扣點紀錄
      let bDate =
        this.nowdate.getFullYear() +
        "/" +
        (this.nowdate.getMonth() + 1) +
        "/" +
        this.nowdate.getDate();
      let eDate =
        this.nowdate.getFullYear() +
        "/" +
        (this.nowdate.getMonth() + 1) +
        "/" +
        this.nowdate.getDate();
      let xmls = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
      <soapenv:header/>
      <soapenv:Body>
      <tem:PMBSTDLOD07.Execute>
      <tem:Studentpid>${this.email}</tem:Studentpid>
      <tem:Bdate>${bDate}</tem:Bdate>
      <tem:Edate>${eDate}</tem:Edate>
      </tem:PMBSTDLOD07.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      this.$store.dispatch("user/courseAndDeduct", xmls); // tc
    },
    deductRecord(data) {
      if (data.Envelope.Body["PMBSTDLOD07.ExecuteResponse"].Bdate !== undefined)
        this.getRecord();
      else
        this.$swal({
          text: "無法查詢看課紀錄及扣點紀錄",
          icon: "error",
          animation: false,
          timer: 1500,
          showConfirmButton: false,
        });
    },
    getRecord() {
      this.$store.dispatch("user/courseDeductRecord", this.email);
    },
    handleRecord(data) {
      if (data.ScribelogView.Viewdata !== undefined) {
        let dateTime = null;
        let vData = null;
        let vDate = null;
        let vTime = null;

        if (data.ScribelogView.Viewdata.length > 0) {
          // 取最後扣點紀錄
          vData = data.ScribelogView.Viewdata[0];
        } else {
          vData = data.ScribelogView.Viewdata;
        }

        vDate = vData.VDate;
        vTime = vData.VTime;

        dateTime = vDate.split("/").join("-") + " " + vTime;

        let time = new Date(dateTime).getTime();
        let nowTime = new Date().getTime();

        //檢查時段是否預約、已扣點、超 1 小時再扣點

        console.log("看課及扣點紀錄:", time, nowTime);

        this.$swal({
          text: "無須扣點",
          icon: "success",
          animation: false,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        console.log("無看課及扣點紀錄進行扣點處理.");
        this.deduct();
      }
    },
    deduct() {
      // 扣點處理;
      this.$swal({
        text: `您目前點數為:${this.point},本時段將使用1點`,
        icon: "warning",
        animation: false,
        timer: 0,
        showDenyButton: true,
        reverseButtons: true,
      }).then((res) => {
        if (res.isConfirmed) {
          let vlsdate =
            this.nowdate.getFullYear() +
            "/" +
            (this.nowdate.getMonth() + 1) +
            "/" +
            this.nowdate.getDate();
          let vlstime =
            this.nowdate.getHours() +
            ":" +
            this.nowdate.getMinutes() +
            ":" +
            this.nowdate.getSeconds();
          let xmls = `
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
                <soapenv:header/>
                <soapenv:Body>
                <PBNSTDVLSSUB.Execute xmlns="CEK">
                <Studentpid>${this.email}</Studentpid>
                <Courseseq>${this.courseSeq}</Courseseq>
                <Depofip>${this.ip}</Depofip>
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
      } else {
        this.$swal({
          text: `扣點失敗`,
          icon: "error",
          animation: false,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>