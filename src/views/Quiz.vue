<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" xl="10">
        <v-card>
          <v-toolbar flat color="white">
            <v-btn @click="goback()" text rounded>
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-title class="justify-center">
            <div class="text-h4 py-0">{{ quizTitle }}</div>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="4" class="text-right">
                  <div class="text-h4 red--text text-left">{{ timeLimit }}</div>
                </v-col>
                <v-col cols="4">
                  <div class="text-h4 text-center">{{ score }}</div>
                </v-col>
                <v-col cols="4" class="text-right">
                  <v-btn
                    color="success"
                    large
                    type="submit"
                    :disabled="isDisabled"
                    @click="submit"
                  >
                    交卷
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-container v-if="Object.keys(trueAndFalse).length">
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col
                          cols="12"
                          class="text-xl-h5 font-weight-bold black--text"
                          >是非題( 共
                          {{ Object.keys(trueAndFalse).length }}
                          題)</v-col
                        >
                      </v-row>
                      <v-row v-for="(tf, index) in trueAndFalse" :key="index">
                        <v-col cols="12">
                          <div class="text-xl-body-1 black--text">
                            <p class="mb-8">{{ index + ". " + tf.question }}</p>
                            <p
                              class="corret-msg green--text font-weight-bold"
                              v-if="tfCorrect.text.length"
                            >
                              {{ tfCorrect.text[index] }}
                            </p>
                            <v-radio-group
                              row
                              v-model="payload.ans.tfAnswers[index]"
                            >
                              <v-radio
                                :color="tfCorrect.color[index]"
                                value="是"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8"> 是 </strong>
                                </template>
                              </v-radio>
                              <v-radio
                                :color="tfCorrect.color[index]"
                                value="否"
                              >
                                <template v-slot:label>
                                  <strong class="black--text"> 否 </strong>
                                </template>
                              </v-radio>
                            </v-radio-group>
                            <v-divider
                              v-if="
                                parseInt(index) <
                                Object.keys(trueAndFalse).length
                              "
                            ></v-divider>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-container>
                <v-container v-if="Object.keys(multipleChoice).length">
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col
                          cols="12"
                          class="text-xl-h5 font-weight-bold black--text"
                          >單選題( 共
                          {{ Object.keys(multipleChoice).length }}
                          題)</v-col
                        >
                      </v-row>
                      <v-row v-for="(mc, index) in multipleChoice" :key="index">
                        <v-col cols="12">
                          <div class="text-xl-body-1 black--text">
                            <p class="mb-8">{{ index + ". " + mc.question }}</p>
                            <p
                              class="corret-msg green--text font-weight-bold"
                              v-if="choiceCorrect.text.length"
                            >
                              {{ choiceCorrect.text[index] }}
                            </p>
                            <v-radio-group
                              column
                              v-model="payload.ans.choiceAnswers[index]"
                            >
                              <v-radio
                                v-if="mc.option_a"
                                :color="choiceCorrect.color[index]"
                                value="A"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8">
                                    {{ "A. " + mc.option_a }}
                                  </strong>
                                </template>
                              </v-radio>
                              <v-radio
                                v-if="mc.option_b"
                                :color="choiceCorrect.color[index]"
                                value="B"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8">
                                    {{ "B. " + mc.option_b }}
                                  </strong>
                                </template>
                              </v-radio>
                              <v-radio
                                v-if="mc.option_c"
                                :color="choiceCorrect.color[index]"
                                value="C"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8">
                                    {{ "C. " + mc.option_c }}
                                  </strong>
                                </template>
                              </v-radio>
                              <v-radio
                                v-if="mc.option_d"
                                :color="choiceCorrect.color[index]"
                                value="D"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8">
                                    {{ "D. " + mc.option_d }}
                                  </strong>
                                </template>
                              </v-radio>
                            </v-radio-group>
                            <v-divider
                              v-if="
                                parseInt(index) <
                                Object.keys(multipleChoice).length
                              "
                            ></v-divider>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-container>
                <v-container v-if="Object.keys(multipleSelection).length">
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col
                          cols="12"
                          class="text-xl-h5 font-weight-bold black--text"
                          >複選題( 共
                          {{ Object.keys(multipleSelection).length }}
                          題)</v-col
                        >
                      </v-row>
                      <v-row
                        v-for="(ms, index) in multipleSelection"
                        :key="index"
                      >
                        <v-col cols="12">
                          <div class="text-xl-body-1 black--text">
                            <p class="mb-8">{{ index + ". " + ms.question }}</p>
                            <p
                              class="corret-msg green--text font-weight-bold"
                              v-if="selectCorrect.text.length"
                            >
                              {{ selectCorrect.text[index] }}
                            </p>
                            <v-radio-group
                              column
                              multiple
                              v-model="payload.ans.selectAnswers[index]"
                            >
                              <v-radio
                                @click="multipleSelect('A', index)"
                                v-if="ms.option_a"
                                :color="selectCorrect.color[index]"
                                value="A"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8">
                                    {{ "A. " + ms.option_a }}
                                  </strong>
                                </template>
                              </v-radio>
                              <v-radio
                                @click="multipleSelect('B', index)"
                                v-if="ms.option_b"
                                :color="selectCorrect.color[index]"
                                value="B"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8">
                                    {{ "B. " + ms.option_b }}
                                  </strong>
                                </template>
                              </v-radio>
                              <v-radio
                                @click="multipleSelect('C', index)"
                                v-if="ms.option_c"
                                :color="selectCorrect.color[index]"
                                value="C"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8">
                                    {{ "C. " + ms.option_c }}
                                  </strong>
                                </template>
                              </v-radio>
                              <v-radio
                                @click="multipleSelect('D', index)"
                                v-if="ms.option_d"
                                :color="selectCorrect.color[index]"
                                value="D"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8">
                                    {{ "D. " + ms.option_d }}
                                  </strong>
                                </template>
                              </v-radio>
                              <v-radio
                                @click="multipleSelect('E', index)"
                                v-if="ms.option_e"
                                :color="selectCorrect.color[index]"
                                value="E"
                              >
                                <template v-slot:label>
                                  <strong class="black--text mr-8">
                                    {{ "E. " + ms.option_e }}
                                  </strong>
                                </template>
                              </v-radio>
                            </v-radio-group>
                            <v-divider
                              v-if="
                                parseInt(index) <
                                Object.keys(multipleSelection).length
                              "
                            ></v-divider>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-container>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-right">
                  <v-btn
                    color="success"
                    large
                    type="submit"
                    :disabled="isDisabled"
                    @click="submit"
                  >
                    交卷
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { Cookie } from "../composition_api";

export default {
  props: ["lesson_name", "fullName", "courseId", "videoFile", "lesson_hid"], // router props

  data: () => ({
    user: JSON.parse(sessionStorage.getItem("user")),
    quizTitle: "",
    timeRunner: null,
    score: "",
    timeLimit: "",
    trueAndFalse: {},
    multipleChoice: {},
    multipleSelection: {},
    selectTemp: [],
    isDisabled: false,
    payload: {
      quiz_hid: "",
      ans: {
        tfAnswers: [null],
        choiceAnswers: [null],
        selectAnswers: [null],
        questionCount: 0,
        spendTime: 0,
      },
    },
    tfCorrect: { text: [null], color: [] },
    choiceCorrect: { text: [null], color: [] },
    selectCorrect: { text: [null], color: [] },
  }),

  computed: {
    ...mapGetters({
      getCourseQuiz: "class/getCourseQuiz",
      getValidated: "user/getValidated",
      getCourseList: "class/getCourseList",
      getQuizAnswer: "class/getQuizAnswer",
    }),
  },

  watch: {
    getCourseQuiz(data) {
      this.handleQuiz(data);
    },
    getValidated(data) {
      this.validated(data);
    },
    getCourseList(data) {
      this.handleReserved(data.Courses);
    },
    getQuizAnswer(data) {
      this.handleAnswer(data);
    },
  },

  methods: {
    init() {
      this.email = this.user.email;
      const settingData = JSON.parse(Cookie.readCookie("setting") || null);
      this.stb_ip = settingData.stb_ip;
      this.userValidate(); //*
    },
    userValidate() {
      // 驗證、通知產生預約課程資料 xml
      console.log("Course user validating.");
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDData.Execute xmlns="CEK">
      <Studentpid>${this.user.email}</Studentpid>
      <Depofip>${this.stb_ip}</Depofip>
      </PBNSTDData.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      console.log(xmls);
      // this.$store.dispatch("user/userValidate", xmls); //*
    },
    validated(data) {
      if (
        data.Envelope.Body["PBNSTDData.ExecuteResponse"].Studentpwd.__text ===
        this.user.pwd
      ) {
        console.log("Course user validated.");
        this.checkReserved();
      } else {
        // 帳號密碼錯誤或 IP 位址未被認證，登出學員
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
      // 查看是否預約
      this.$store.dispatch("class/courseList", `${this.user.email}`);
    },
    handleReserved(data) {
      if (
        data.VldSub !== undefined &&
        data.VldSub === "Y" &&
        data.OnBranch !== "N"
      ) {
        console.log("Course: 有預約喔! :)");
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
            this.$emit("pageEvent", { loginData: "logout" }); //* 登出
          }
        });
      }
      this.$eventBus.$emit("loadClose"); // 發出關閉 loading 需求
    },
    getQuiz() {
      if (this.lesson_hid) {
        this.$store.dispatch("class/courseQuizContent", this.lesson_hid);
      }
    },
    handleQuiz(data) {
      if (Object.keys(data.data).length) {
        let quizData = data.data;

        this.payload.quiz_hid = quizData.hid;
        this.payload.ans.questionCount = quizData.questionCount;
        this.sandglass(quizData.time_limit);
        this.quizTitle = quizData.title;
        this.trueAndFalse = quizData.true_false;
        this.multipleChoice = quizData.multiple_choice;
        this.multipleSelection = quizData.multiple_selection;
      } else {
        this.$swal({
          text: "沒有此測驗",
          icon: "error",
          showConfirmButton: false,
          animation: false,
          timer: 1500,
        });
        this.$router.go(-1);
      }
    },
    multipleSelect(val, index) {
      // 複選題，取消功能
      if (this.selectTemp[index] && this.selectTemp[index].includes(val)) {
        let key = this.selectTemp[index].indexOf(val);
        this.selectTemp[index].splice(key, 1);
        this.payload.ans.selectAnswers[index] = this.selectTemp[index];
      } else {
        this.selectTemp[index] = this.payload.ans.selectAnswers[index];
      }
    },
    submit() {
      // 時間到未能作答完畢可能強制交卷
      if (!this.timeRunner) {
        this.stopQuiz();
        this.$swal({
          text: "測驗時間結束，自動交卷",
          icon: "warning",
          animation: false,
          timer: 0,
          showConfirmButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            this.$store.dispatch("class/submitQuiz", this.payload);
          }
        });
      } else {
        let msg = [];

        if (
          Object.keys(this.trueAndFalse).length > 0 &&
          this.payload.ans.tfAnswers.length === 1
        ) {
          msg.push("是非題");
        }
        if (
          Object.keys(this.multipleChoice).length > 0 &&
          this.payload.ans.choiceAnswers.length === 1
        ) {
          msg.push("單選題");
        }
        if (
          Object.keys(this.multipleSelection).length > 0 &&
          this.payload.ans.selectAnswers.length === 1
        ) {
          msg.push("複選題");
        }
        if (msg.length >= 1) {
          msg = msg.join("、") + "尚未填寫!";
          console.log(msg);
          this.$swal({
            text: msg,
            icon: "error",
            animation: false,
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          this.stopQuiz();
          this.$store.dispatch("class/submitQuiz", this.payload);
        }
      }
    },
    handleAnswer(data) {
      this.score = `分數 : ${data.score}`;
      let result = data.result;

      // 是非題
      if (result.true_false !== undefined) {
        Object.keys(result.true_false).forEach((tf) => {
          if (
            result.true_false[tf].userAnswer !==
            result.true_false[tf].correctAnswer
          ) {
            this.tfCorrect.text[
              tf
            ] = `正確答案: ${result.true_false[tf].correctAnswer}`;

            this.tfCorrect.color[tf] = "red";
          }
        });
      }

      // 多選題
      if (result.multiple_choice !== undefined) {
        Object.keys(result.multiple_choice).forEach((mc) => {
          if (
            result.multiple_choice[mc].userAnswer !==
            result.multiple_choice[mc].correctAnswer
          ) {
            this.choiceCorrect.text[
              mc
            ] = `正確答案: ${result.multiple_choice[mc].correctAnswer}`;

            this.choiceCorrect.color[mc] = "red";
          }
        });
      }

      // 複選題
      if (result.multiple_selection !== undefined) {
        Object.keys(result.multiple_selection).forEach((ms) => {
          let correct = result.multiple_selection[ms].correctAnswer.join(",");
          let userAns = result.multiple_selection[ms].userAnswer.join(",");

          if (userAns !== correct) {
            this.selectCorrect.text[
              ms
            ] = `正確答案: ${result.multiple_selection[ms].correctAnswer.join(
              ", "
            )}`;

            this.selectCorrect.color[ms] = "red";
          }
        });
      }

      // 紀錄至鉅銳資料庫
      const payload = {
        syntax: 1,
        account: this.email,
        courId: this.courseId,
        code: this.videoFile,
        courName: this.fullName,
        score: data.score,
      };
      this.$store.dispatch("class/lodPostQuiz", payload);
    },
    sandglass(mins) {
      // 倒數用
      // mins = 1; //* 測試

      let spendTime = 0;
      if (mins) {
        console.log(mins);
        let time = this.formatTime(mins);
        let hrs = time[0] ? time[0] : 0;
        mins = time[1] ? time[1] : 0;
        let secs = time[2] ? time[2] : 0;

        let zero = this.timeSetZero(hrs, mins, secs);
        this.timeLimit = `${zero[0]}${hrs}:${zero[1]}${mins}:${zero[2]}${secs}`;

        this.timeRunner = setInterval(() => {
          if (hrs > 0) {
            if (mins == 0 && secs == 0) {
              hrs--;
              mins = 59;
              secs = 60;
            }
          }

          if (mins > 0) {
            if (secs == 0) {
              mins--;
              secs = 60;
            }
          }

          if (secs > 0) secs--;

          spendTime++;

          zero = this.timeSetZero(hrs, mins, secs);
          this.timeLimit = `${zero[0]}${hrs}:${zero[1]}${mins}:${zero[2]}${secs}`;

          this.payload.ans.spendTime = spendTime; //** */ 要累計才對

          if (hrs === 0 && mins === 0 && secs === 0) {
            this.stopQuiz();
            this.submit(); // 自動交卷
          }
        }, 1000);
      }
    },
    formatTime(mins) {
      // 格式處理
      let time = [];
      let secs = mins * 60;
      time[0] = Math.floor(secs / 3600); // hr;
      time[1] = Math.floor((secs - time[0] * 3600) / 60); // min
      time[2] = parseInt(secs - time[0] * 3600 - time[1] * 60); // sec

      return time;
    },
    toSecs(hrs, mins, secs) {
      return hrs * 3600 + mins * 60 + secs;
    },
    timeSetZero(hrs, mins, secs) {
      // 時間格式補零
      let zero = [];
      if (hrs < 10) zero[0] = 0;
      else zero[0] = "";
      if (mins < 10) zero[1] = 0;
      else zero[1] = "";
      if (secs < 10) zero[2] = 0;
      else zero[2] = "";
      return zero;
    },
    stopQuiz() {
      clearInterval(this.timeRunner);
      this.timeRunner = null;
      this.isDisabled = true;
      this.timeLimit = "已交卷";
    },
    goback() {
      // 回上一頁
      this.$router.go(-1);
    },
  },

  mounted() {
    this.init();
    this.getQuiz();
  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.timeRunner);
    next();
    console.log(from, to);
  },
};
</script>

<style>
</style>