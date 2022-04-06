<template>
  <v-container fluid>
    <v-row class="justify-center">
      <v-col cols="12" xl="10">
        <div class="display-1 mb-2">{{ username }}，歡迎回來</div>
        <v-tabs v-if="classData" v-model="tab" show-arrows>
          <v-tab
            v-for="(name, idx) in classData"
            :key="idx"
            class="font-weight-bold"
          >
            {{ name }}
          </v-tab>
          <!-- <v-tabs-slider color="orange"></v-tabs-slider> -->
        </v-tabs>
        <v-divider></v-divider>
        <v-tabs-items v-if="classData" v-model="tab" class="pt-3">
          <v-tab-item
            transition=""
            v-for="(cours, idx) in classData"
            :key="idx"
          >
            <v-container>
              <v-row>
                <v-container>
                  <v-row v-for="(cours, idex) in pageData" :key="idex">
                    <v-col cols="1"></v-col>
                    <v-col
                      v-for="(item, idx) in cours"
                      :key="idx"
                      cols="12"
                      xl="2"
                      lg="2"
                      md="12"
                      sm="12"
                      class="px-0 py-0"
                    >
                      <v-card
                        class="course-card text-center mx-2 my-2"
                        color="indigo lighten-4"
                        @click="
                          goSubject(item.SubjectSName, item.SubjectString)
                        "
                      >
                        <v-card-subtitle
                          class="
                            text-xl-h5 text-lg-h6 text-md-h6 text-sm-h6
                            black--text
                            px-0
                            py-2
                          "
                          style="word-break: break-all"
                          >{{ subjectName(item.SubjectSName) }}</v-card-subtitle
                        >
                        <!-- <v-card-text class="black--text px-0 py-0">
                          觀看期限：{{ selectLimitDate }}
                        </v-card-text> -->
                      </v-card>
                    </v-col>
                    <v-col cols="1"></v-col>
                    <!-- <v-col
                        v-for="(item, index) in cours.SubjectS.Subject"
                        :key="index"
                        cols="12"
                        xl="2"
                        lg="3"
                        md="3"
                        sm="3"
                        class="px-0 py-0"
                      >
                        <v-card
                          class="course-card text-center mx-2 mt-2 mb-2"
                          color="indigo lighten-4"
                          @click="
                            goSubject(item.SubjectSName, item.SubjectString)
                          "
                        >
                          <v-card-subtitle
                            class="
                              text-xl-h5 text-lg-h6 text-md-h6 text-sm-h6
                              black--text
                              px-0
                              py-2
                            "
                            style="word-break: break-all"
                            >{{
                              subjectName(item.SubjectSName)
                            }}</v-card-subtitle
                          >
                          <v-card-text class="black--text px-0 py-0"
                            >觀看期限：{{ limitDate }}</v-card-text
                          >
                        </v-card>
                      </v-col> -->
                  </v-row>
                </v-container>
              </v-row>
              <v-row class="justify-center">
                <v-col cols="4">
                  <v-pagination
                    v-model="pagination"
                    :length="pageLength"
                    :total-visible="7"
                  ></v-pagination>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// 班級與科目列表
import { mapGetters } from "vuex";
import { Cookie } from "../composition_api";

export default {
  data: () => ({
    tab: 0,
    loginItem: JSON.parse(window.sessionStorage.getItem("user")),
    username: "",
    email: "",
    pwd: "",
    classData: [],
    courseList: [],
    courseSeq: [],
    distrList: [],
    pagination: 1,
    paginationTemp: 1,
    pageLength: 0,
    pageStart: 0,
    pageEnd: 0,
    pageData: [],
    autoCheck: false,
    subjStringArr: [],
    selectCourseSeq: null,
    selectSubString: null,
    listData: [],
    limitDate: [],
    selectLimitDate: "",
    stb_ip: null,
  }),

  computed: {
    ...mapGetters({
      getCourseList: "class/getCourseList", // src/store/modules/class.js
      getValidated: "user/getValidated",
      getPoint: "user/getPoint",
      getCourseAndDeduct: "user/getCourseAndDeduct",
      getCourseDeductRecord: "user/getCourseDeductRecord",
      getDeductPoint: "user/getDeductPoint",
    }),
  },
  watch: {
    getCourseList(data) {
      this.handleReserved(data.Courses);
    },
    tab: function (tab) {
      this.tab = tab;
      this.handleTabPage();
    },
    getValidated(data) {
      this.validated(data);
    },
    pagination: function (page) {
      this.distrPage(page);
    },
  },
  methods: {
    init() {
      const settingData = JSON.parse(Cookie.readCookie("setting") || null);
      this.stb_ip = settingData.stb_ip;

      this.username = this.loginItem.name;
      this.email = this.loginItem.email;
      this.pwd = this.loginItem.pwd;

      this.tab = window.sessionStorage.getItem("tabs")
        ? parseInt(window.sessionStorage.getItem("tabs"))
        : 0;

      this.userValidate();
    },
    checkReserved() {
      this.$eventBus.$emit("checkReservedApp", {
        stop: false,
        email: this.email,
      }); // 通知串檢查預約 API

      this.$store.dispatch("class/courseList", `${this.email}`); // 包含課程資料
    },
    handleReserved(data) {
      this.$eventBus.$emit("checkReservedApp", {
        stop: true,
        email: this.email,
      }); // 通知停止重串檢查預約 API

      this.closeLoading();
      if (
        data.VldSub !== undefined &&
        data.VldSub === "Y" &&
        data.OnBranch !== "N"
      ) {
        console.log("ClassList: 有預約喔! :)");
      } else {
        // 登出學員
        this.$swal({
          title: "您尚未預約本時段",
          icon: "warning",
          animation: false,
          timer: 0,
          showConfirmButton: true,
          allowOutsideClick: false,
        }).then((res) => {
          if (res.isConfirmed) {
            this.$emit("pageEvent", { loginData: "logout" }); //* 登出，正式時需秀出來
          }
        });
      }

      if (this.autoCheck) return; // 自動檢查不須再儲存資料

      this.classData = [];
      this.courseSeq = [];
      this.subjStringArr = [];
      this.courseList = [];
      this.limitDate = [];

      if (Array.from(data.Course).length > 0) {
        // 儲存資料
        for (let i = 0; i < data.Course.length; i++) {
          // let endDate = data.Course[i].VDate.split(";")[1]; //* 需移除
          // this.limitDate.push(endDate);  //* 需移除
          this.classData.push(data.Course[i].CourseName);
          this.courseSeq.push(data.Course[i].CourseSeq);
          this.subjStringArr.push(
            data.Course[i].SubjectS.Subject[0].SubjString
          ); // 編碼取第一個即可
        }

        this.courseList = data.Course;
      } else {
        this.limitDate.push(data.Course.VDate);
        this.classData.push(data.Course.CourseName);
        this.courseSeq.push(data.Course.CourseSeq);
        this.courseList.push(data.Course);
        this.subjStringArr.push(data.Course.SubjectS.Subject[0].SubjString);
      }

      let list = JSON.stringify({
        courseSeq: this.courseSeq,
        list: this.courseList,
      });
      window.sessionStorage.setItem("courseList", list);

      this.distrColumn(this.courseList); // 分配欄位、分頁
      this.selectCourseSeq = this.courseSeq[this.tab]; // 第一個班選課序列
      // this.selectLimitDate = this.limitDate[0]; //* 第一個看課期限 -- 需移除
    },
    distrColumn(listArr) {
      // 分配一列 5 欄
      let distArr = []; // 1維
      let distArrTwo = []; // 2維
      let distList = []; // 3 維
      listArr.forEach((element) => {
        for (let i = 1; i <= element.SubjectS.Subject.length; i++) {
          if (distArr.length < 5) {
            distArr.push(element.SubjectS.Subject[i - 1]);
          } else {
            distArrTwo.push(distArr); //  push array in if its length = 5
            distArr = []; // empty array
            distArr.push(element.SubjectS.Subject[i - 1]); // repush new element
          }
        }

        if (distArr.length > 0) distArrTwo.push(distArr); //push array of not fill 5 element
        distArr = [];

        distList.push(distArrTwo);
        distArrTwo = [];
      });
      this.distrList = distList;
      this.distrPage();
    },
    distrPage() {
      if (Array.from(this.distrList) < 1) return;

      // 分配分頁資料 6列一頁
      let rows =
        this.distrList[this.tab].length >= 6
          ? 6
          : this.distrList[this.tab].length;

      let minusRes = this.pagination - this.paginationTemp; // 當前頁碼減上次頁碼
      let times = Math.abs(minusRes); // 索引起始與結束位置乘倍計算

      if (minusRes > 0) {
        this.pageStart += rows * times;
        this.pageEnd += rows * times;
      } else if (minusRes < 0) {
        this.pageStart -= rows * times;
        this.pageEnd -= rows * times;
      } else {
        this.pageStart = 0;
        this.pageEnd = rows;
      }

      // page 1: array 0~6 、 page 2: array 7~13
      this.pageData = this.distrList[this.tab].slice(
        this.pageStart,
        this.pageEnd
      );

      this.pageLength = Math.ceil(this.distrList[this.tab].length / rows);

      this.paginationTemp = this.pagination;

      this.closeLoading();
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
    userValidate() {
      this.loading();
      // 驗證、通知產生預約課程資料 xml
      console.log("ClassList user validating.");
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
        console.log("ClassList user validated.");
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
    handleTabPage() {
      // 選考試別
      this.selectCourseSeq = null;
      this.selectSubString = null;

      this.selectCourseSeq = this.courseSeq[this.tab];
      this.selectSubString = this.subjStringArr[this.tab];
      this.pagination = 1; // 頁碼復原
      this.distrPage();
      window.sessionStorage.setItem("tabs", this.tab);
    },
    subjectName(subjectName) {
      if (subjectName.length > 6) {
        subjectName = subjectName.substring(0, 6) + "...";
      }

      return subjectName;
    },
    goSubject(subjectName, subjectString) {
      console.log(subjectName + ",CourseSeq:", this.selectCourseSeq);
      this.$router.push({
        name: "CourseEpisode", // 轉至看課程單元
        params: {
          name: subjectName,
          subjectString: subjectString,
          courseSeq: this.selectCourseSeq,
        },
      });
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
      this.autoCheck = true;
      this.userValidate();
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

<style scoped>
.borderLeft {
  border-radius: 50px 0px 50px 0px !important;
}
.borderRight {
  border-radius: 0px 50px 0px 50px !important;
}
.border {
  border: 2px solid yellow !important;
}
</style>
