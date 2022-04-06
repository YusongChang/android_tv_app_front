<template>
  <!--看課頁面-->
  <v-container>
    <v-row class="justify-center">
      <v-col cols="10">
        <v-dialog v-model="addWindows" persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">筆記</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="addItem.date"
                      label="日期"
                      disabled
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="addItem.time"
                      label="時間(秒)"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="addItem.note"
                      label="筆記"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDialog"> 取消 </v-btn>
              <v-btn color="success" text @click="addNote"> 儲存 </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="editWindows" persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">筆記</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editItem.date"
                      label="日期"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editItem.timecode"
                      label="時間(秒)"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="editItem.note"
                      label="筆記"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDialog"> 取消 </v-btn>
              <v-btn color="success" text @click="editNote"> 儲存 </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" persistent max-width="500px">
          <v-card>
            <v-card-title class="headline">要刪除這個筆記嗎?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" text @click="closeDialog">取消</v-btn>
              <v-btn color="error" text @click="deleteNote">刪除</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-toolbar flat color="green">
          <v-btn @click="goback()" text rounded>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ lessonName }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-app-bar-nav-icon @click="sideBar = !sideBar"> </v-app-bar-nav-icon>
          <v-btn icon color="red" @click="favour"
            ><v-icon dark>mdi-heart{{ favourIcon }}</v-icon></v-btn
          >
        </v-toolbar>
        <v-alert v-text="message" v-if="message != ''" color="info"></v-alert>
        <v-card flat>
          <v-row no-gutters>
            <v-col cols="12" lg="12">
              <v-card flat height="100%" tile>
                <div class="myplayer">
                  <div id="player-content">
                    <div id="darkScreenCover" v-if="darkcover">
                      <div id="floatingCirclesG">
                        <div class="f_circleG" id="frotateG_01"></div>
                        <div class="f_circleG" id="frotateG_02"></div>
                        <div class="f_circleG" id="frotateG_03"></div>
                        <div class="f_circleG" id="frotateG_04"></div>
                        <div class="f_circleG" id="frotateG_05"></div>
                        <div class="f_circleG" id="frotateG_06"></div>
                        <div class="f_circleG" id="frotateG_07"></div>
                        <div class="f_circleG" id="frotateG_08"></div>
                      </div>
                    </div>
                    <video
                      id="videoPlayer"
                      class="video-js vjs-default-skin vjs-big-play-centered"
                      ref="videoPlayer"
                    ></video>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-navigation-drawer
              v-if="isPlay"
              v-model="sideBar"
              app
              temporary
              right
              id="sidebar-video-stamp"
              width="500"
            >
              <v-card color="orange" flat height="100%" tile>
                <v-card-subtitle class="display-1 font-weight-bold">
                  影片戳記
                </v-card-subtitle>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-list dense nav width="100%" color="orange">
                    <v-list-item-group>
                      <v-list-item
                        v-for="(code, idx) in timecode"
                        @click="playViaStamp(code.timecode)"
                        :key="idx"
                        color="primary"
                      >
                        <v-list-item-content>
                          <v-list-item-title class="col-9">
                            {{ code.description }}
                          </v-list-item-title>
                          <v-list-item-title class="col-3 text-center">
                            {{ code.timecode }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card-actions>
              </v-card>
            </v-navigation-drawer>
          </v-row>
        </v-card>
        <v-card flat>
          <v-tabs>
            <v-tab> <v-icon left small>mdi-pen</v-icon> 備註 </v-tab>
            <!-- <v-tab>
              <v-icon left small>mdi-notebook-multiple</v-icon> 筆記
            </v-tab> -->
            <v-tab v-if="isQuiz">
              <v-icon left small>mdi-note-edit</v-icon> 測驗
            </v-tab>
            <v-tab> <v-icon left small>mdi-book</v-icon> 課程評價 </v-tab>
            <v-tab> <v-icon left small>mdi-star</v-icon> 理解度評分 </v-tab>
            <v-tab-item transition="" class="my-12">
              <v-card flat>
                <v-card-title>關於本片</v-card-title>
                <v-card-text>{{ summary }}</v-card-text>
              </v-card>
            </v-tab-item>
            <!-- <v-tab-item transition="" class="my-12">
              <v-card flat>
                <v-list class="ma-8">
                  <v-list-item v-for="(item, index) in noteList" :key="index">
                    <v-row>
                      <v-col cols="12" @click="playViaStamp(item.timecode)">
                        <v-list>
                          <v-list-item-group>
                            <v-list-item>
                              <v-list-item-content>
                                <v-col cols="4" xl="2" class="px-lg-3">
                                  <v-list-item-title class="text-h6 my-1">
                                    {{ formatSecond(item.timecode) }}
                                  </v-list-item-title>
                                  <v-list-item-subtitle class="subtitle-2">
                                    {{ item.time }}
                                  </v-list-item-subtitle>
                                </v-col>
                                <v-col cols="7" xl="9" class="pl-0">
                                  <v-list-item-title
                                    v-text="item.note"
                                  ></v-list-item-title>
                                </v-col>
                              </v-list-item-content>
                              <v-menu>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    color="orange"
                                    dark
                                    v-bind="attrs"
                                    v-on="on"
                                    text
                                    rounded
                                  >
                                    <v-icon>mdi-dots-vertical</v-icon>
                                  </v-btn>
                                </template>
                                <v-list>
                                  <v-list-item>
                                    <v-btn
                                      text
                                      small
                                      color="orange"
                                      @click="editDialog(item)"
                                      ><v-icon>edit</v-icon></v-btn
                                    >
                                  </v-list-item>
                                  <v-list-item>
                                    <v-btn
                                      text
                                      small
                                      color="error"
                                      @click="deleteDialog(item)"
                                      ><v-icon>delete</v-icon></v-btn
                                    >
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-tab-item> -->
            <v-tab-item transition="" v-if="isQuiz" class="my-12">
              <v-card flat>
                <v-container>
                  <v-row
                    v-for="(qz, idx) in quizzes"
                    :key="idx"
                    justify="center"
                    align="center"
                  >
                    <v-col cols="12" xl="3" class="text-center">
                      <v-progress-circular
                        :rotate="-90"
                        :size="200"
                        :width="10"
                        :value="qz.score"
                        color="success"
                        id="score-circle"
                      >
                        <h1>{{ qz.score }} 分</h1>
                      </v-progress-circular>
                    </v-col>
                    <v-col class="font-weight-bold" cols="12" xl="3">
                      <div>
                        測驗名稱:
                        <span style="word-break: all">{{ qz.title }}</span>
                      </div>
                      <div>測驗時間: {{ qz.time ? qz.time : "尚未測驗" }}</div>
                      <div>測驗方式: {{ qz.type }}</div>
                      <div>測驗限時: {{ qz.time_limit }} 分鐘</div>
                      <div>測驗分數: {{ qz.score }}/ 100</div>
                      <v-divider class="mt-1 mb-2"></v-divider>
                      <p v-if="nexQuizTime(qz.time)" class="red--text">
                        下次測驗時間:{{ nexQuizTime(qz.time) }}
                      </p>
                      <v-btn
                        v-if="!nexQuizTime(qz.time)"
                        color="success"
                        dark
                        @click="takeQuiz(qz.hid)"
                        >進行測驗</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item transition="" class="my-12">
              <v-card flat>
                <v-card-title
                  >課程評價
                  <v-card-text>
                    <v-row>
                      <v-rating v-model="evaluation" length="5" large>
                      </v-rating>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        text
                        color="info"
                        @click="addRating(evaluation, 'evaluation')"
                        ><v-icon>check</v-icon>送出</v-btn
                      >
                    </v-row>
                  </v-card-text>
                </v-card-title>
              </v-card>
            </v-tab-item>
            <v-tab-item transition="" class="my-12">
              <v-card flat>
                <v-card-title
                  >理解度評分
                  <v-card-text>
                    <v-row>
                      <v-slider v-model="rating" thumb-label="always">
                      </v-slider>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        text
                        color="info"
                        @click="addRating(rating, 'rating')"
                        ><v-icon>check</v-icon>送出</v-btn
                      >
                    </v-row>
                  </v-card-text>
                </v-card-title>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Cookie, DateFormat, lastDeduct } from "../composition_api";
import CryptoJS from "crypto-js/";
import videojs from "video.js";
import "videojs-contrib-quality-levels";
import "videojs-http-source-selector";
import "../plugins/watermark";
import "../plugins/controlButton";

export default {
  components: {},
  props: [
    // "lesson_hid",
    "name",
    "fullName",
    "videoFile",
    "playTimecode",
    "subjString",
    "courseSeq",
    "courseId",
    "fromEpisode",
  ], // router props

  data: () => ({
    fullScreenIcon: "mdi-fullscreen",
    user: JSON.parse(sessionStorage.getItem("user")),
    userHid: sessionStorage.getItem("userHid"),
    player: null,
    sideBar: false, // 影片戳記
    message: "", // 提示訊息
    sound: 0.8, // 聲音預設 80%
    progress: 0, // 播放紀錄
    duration: 0,
    step: 0.000000000001, //
    show: false,
    isPlay: true,
    date: null,
    videoname: null, // 影片名稱
    playBtn: "mdi-play", // 播放鍵
    isPlaying: false,
    isQuiz: true,
    locateIdx: 0,
    movingInterval: null, // 移動浮水印 interval
    removeTimeout: null, // 移除浮水印 timeout
    noteList: [], //
    quizzes: [],
    addItem: {},
    editItem: {},
    defaultItem: {},
    addWindows: false,
    editWindows: false,
    dialogDelete: false,
    darkcover: true,
    vid: "",
    lessonName: "",
    mediaName: "",
    secretString: "",
    playUrlHeader: "",
    requestPath: "",
    email: "",
    emailTail: "@lod.com",
    summary: "",
    timecode: "",
    value: 0,
    updateInterval: null,
    videoinfo_hid: "",
    favourIcon: "-outline",
    course_hid: "",
    lesson_hid: "",
    playTime: "",
    startTime: "",
    endTime: "",
    userAgent: "行動裝置",
    os: "-", //* android 沒法使用 navigator 物件
    browser: "-", //* android 沒法使用 navigator 物件
    lesson_duration: 0,
    custom_permit_id: "-", //* 課程權限智基未定
    category: "-", //* 暫時無法取得 高考(三級)
    class: "-", //* 暫時無法取得 總複習班
    subject: "-", //* 暫時無法取得考試類科 人事行政
    course: "", // 科目
    lesson: "", // 單元
    section: "", // 堂數
    rating: 0,
    evaluation: 0,
    favorList: JSON.parse(window.sessionStorage.getItem("favors")),
    point: 0,
    vpoint: 0,
    timeMark: "",
    firstPlay: true, // 首次播放
    addingNote: true,
    firstime: true,
    isLog: true, // 看課紀錄
  }),
  computed: {
    ...mapGetters({
      getChtCourse: "class/getChtCourse",
      getCourseNotes: "class/getCourseNotes",
      getCRUDCourseNote: "class/getCRUDCourseNote",
      getCourseQuizzes: "class/getCourseQuizzes",
      getCourseQuiz: "class/getCourseQuiz",
      getUpdateTimeCode: "class/getUpdateTimeCode",
      getLodPostRecord: "class/getLodPostRecord",
      getAddFavour: "class/getAddFavour",
      getUnFavour: "class/getUnFavour",
      getLodIsFavour: "class/getLodIsFavour",
      getLodFavour: "class/getLodFavour",
      getRatingRes: "class/getRatingRes",
      getWatchRes: "class/getWatchRes",
      getValidated: "user/getValidated",
      getCourseList: "class/getCourseList",
      getPoint: "user/getPoint",
      getCourseAndDeduct: "user/getCourseAndDeduct",
      getCourseDeductRecord: "user/getCourseDeductRecord",
      getDeductPoint: "user/getDeductPoint",
      getLodRating: "class/getLodRating",
    }),
  },
  watch: {
    getChtCourse(data) {
      this.handleChtCourse(data);
    },
    getCourseNotes(data) {
      this.handleNotes(data);
    },
    getCRUDCourseNote(data) {
      this.reLoadNotes(data);
    },
    getCourseQuizzes(data) {
      this.handleQuizzes(data);
    },
    getUpdateTimeCode(data) {
      console.log(data.message);
    },
    getLodPostRecord(data) {
      console.log(data.message);
    },
    getLodIsFavour(data) {
      this.handleIsFavour(data);
    },
    getAddFavour(data) {
      this.handleFavour(data);
    },
    getLodFavour(data) {
      this.handleFavour(data);
    },
    getUnFavour(data) {
      this.handleFavour(data);
    },
    getWatchRes(data) {
      this.handleWatchRes(data);
    },
    getRatingRes(data) {
      this.handleRating(data);
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
    isPlaying: function () {
      this.anime();
      this.updateTimecode();
    },
    getLodRating(data) {
      this.handleRating(data);
    },
  },
  methods: {
    init() {
      // 取得頁面開始時間 start_time
      let nowdate = new Date();
      this.startTime =
        DateFormat.localDate(nowdate, true) +
        " " +
        DateFormat.timeFormat(nowdate, "h:i:s");

      this.email = this.user.email + this.emailTail;

      this.lessonName = this.name;
      this.mediaName = this.videoFile;

      const settingData = JSON.parse(Cookie.readCookie("setting") || null);
      this.stb_ip = settingData.stb_ip;

      this.vpoint = 1; // 目前一個時段扣 1 點

      if (!this.fromEpisode) this.userValidate(); // 若是從看課專區而來須檢查預約

      this.isFavour();

      // this.autoPlayNext(); //*
    },
    getChtCourseData() {
      this.$store.dispatch("class/chtCourse", {
        code: this.mediaName,
        quality: "1080",
      });
    },
    handleChtCourse(data) {
      this.summary = data.lessons[0].summary;

      this.timecode = data.lessons[0].timecode.length
        ? data.lessons[0].timecode[0].subs
        : 0;

      this.course_hid = data.course_hid;
      this.lesson_hid = data.lessons[0].lesson_hid;
      this.videoinfo_hid = data.lessons[0].videoinfo_hid;
      this.lesson_duration = data.lessons[0].lesson_duration;
      this.course = data.title;
      this.lesson = data.lessons[0].title;
      this.section = data.lessons.length;
      this.secretString = data.lessons[0].secret;
      this.playUrlHeader = data.lessons[0].endpoint_set;
      this.requestPath = data.lessons[0].request_path;

      if (this.lesson_hid) {
        // this.isFavor(this.lesson_hid);
        this.handleVideo();
        this.getNotes();
        this.getQuizzes();
      }
    },
    isFavor(lesson_hid) {
      let favor = this.favorList.filter((id) => {
        return id === lesson_hid;
      });
      if (favor.length === 1) {
        this.favourIcon = "";
      }
    },
    handleVideo() {
      let playUrlHeader = this.playUrlHeader;
      let request_path = this.requestPath;

      let newDate = new Date();
      let deadLine =
        newDate.getFullYear() +
        2 + // 往後加兩年
        "-" +
        (newDate.getMonth() + 1) +
        "-" +
        newDate.getDate() +
        " 23:59:59";
      // let deadLine = "2023-12-31 23:59:59";  //* 測時時可以用固定時間

      let timestamp = new Date(deadLine).getTime();
      let secure_link_expires = timestamp / 1000;

      // let secretString = "UGzu3ehFrba4TEJ0reDe"; //* 從 API 取得秘密字串, 需對應 domain: https://cekvod-ott2b.cdn.hinet.net 或 https://lodvod-ott2b.cdn.hinet.net

      let token = CryptoJS.MD5(
        request_path + secure_link_expires + this.secretString //*
      ).toString(CryptoJS.enc.Base64);

      // token = token
      //   .replaceAll("+", "-")
      //   .replaceAll("/", "_")
      //   .replaceAll("=", ""); //*** android 9 ，Chrome 低於 ver.85 不支援

      console.log(token);

      // android 7.1.2
      token = token.replace(/\+/g, "-");
      token = token.replace(/\//g, "_");
      token = token.replace(/=/g, "");

      console.log(token);

      // token = token
      //   .split("+")
      //   .join("-")
      //   .split("/")
      //   .join("_")
      //   .split("=")
      //   .join("");

      // console.log(token);

      const videoSrc = `${playUrlHeader}?token=${token}&expires=${secure_link_expires}`;
      // video.js hls 技術支援
      const videoOptions = {
        // loop: true,
        controls: true,
        autoplay: false,
        preload: true,
        poster: "../assets/img/poster.png",
        fluid: true,
        sources: [
          {
            src: videoSrc,
            type: "",
          },
        ],
        playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
        httpSourceSelector: {
          default: "hight",
        },
        controlBar: {
          playToggle: {
            replay: true,
          },
        },
        Watermark: {
          content: { text: this.userHid, time: "" },
        },

        ControlButton: {},
      };

      this.player = videojs(
        this.$refs.videoPlayer,
        videoOptions,
        function onPlayerReady() {
          console.log(this.isFullscreen_);
        }
      );
      this.player.httpSourceSelector();
      this.player.currentTime(this.playTimecode);
      this.player.on("play", () => {
        this.isPlaying = true;
      });
      this.player.on("pause", () => {
        this.isPlaying = false;
      });
      this.player.on("click", (e) => this.buttonClick(e));
      this.player.on(
        "loadedmetadata",
        () =>
          // 移出黑色遮布
          (this.darkcover = false)
      );
    },
    anime() {
      let locate = [0, 10, 20, 30, 45, 50, 66];
      let display = "";
      let setTime = 10 * 60 * 1000; // 10 分鐘就觸發

      if (this.isPlaying) {
        this.firstime = false;

        this.movingInterval = setInterval(() => {
          display = this.firstPlay ? "none" : "block";

          this.firstPlay = false;

          this.player.Watermark.el().children[0].style.display = display;

          // 出現三分鐘，消失
          this.removeTimeout = setTimeout(() => {
            this.player.Watermark.el().children[0].style.display = "none";
          }, 3 * 60 * 1000);

          if (this.locateIdx > locate.length - 1) this.locateIdx = 0;

          this.player.Watermark.el().children[0].style.top =
            locate[this.locateIdx] + "%";

          this.player.Watermark.el().children[0].style.left =
            locate[this.locateIdx] + "%";
          this.locateIdx++;
        }, setTime);
      } else {
        if (this.movingInterval) clearInterval(this.movingInterval);
        if (this.removeTimeout) clearTimeout(this.removeTimeout);
      }
    },
    buttonClick(e) {
      // video control buttons click events
      let label = e.target.getAttribute("aria-label");

      switch (label) {
        case "prevSec":
          this.prevSecond();
          break;
        case "nextSec":
          this.nextSecond();
          break;
        case "note":
          this.addDialog();
          break;
        default:
          break;
      }
    },
    prevSecond() {
      let current = this.player.currentTime() - 10;
      this.player.currentTime(current);
    },
    nextSecond() {
      let current = this.player.currentTime() + 10;
      this.player.currentTime(current);
    },
    playingPaused() {
      if (this.player && !this.player.paused()) {
        this.player.pause();
      }
    },
    spacePlayPause() {
      if (this.player && !this.player.paused()) {
        this.player.pause();
      } else {
        this.player.play();
      }
    },
    exitFullScreen() {
      if (this.player && this.player.isFullscreen()) {
        this.player.exitFullscreen();
      }
    },
    isFavour() {
      // 是否收藏
      const payload = {
        syntax: 4,
        account: this.user.email,
        courId: this.courseId,
      };
      this.$store.dispatch("class/lodIsFavour", payload);
    },
    handleIsFavour(data) {
      if (data.favour === "Y") {
        this.favourIcon = "";
      }
    },
    favour() {
      let syntax = null;
      if (this.favourIcon === "-outline") {
        // 收藏
        console.log(this.player.currentTime());
        if (this.player.currentTime() < 10) {
          this.$swal({
            text: "觀看10秒後才能收藏",
            icon: "warning",
            animation: false,
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          syntax = 1;
        }
      } else {
        // 取消
        syntax = 3;
      }
      if (syntax) {
        const payload = {
          syntax: syntax,
          account: this.user.email,
          courId: this.courseId,
        };
        this.$store.dispatch("class/lodFavour", payload);
      }

      // const payload = {
      //   lesson_hid: this.lesson_hid,
      //   data: {
      //     code: this.mediaName,
      //   },
      // };
      // if (this.lesson_hid) {
      //   if (this.favourIcon === "-outline") {
      //     this.$store.dispatch("class/addFavour", payload);
      //   } else {
      //     this.$store.dispatch("class/unFavour", payload);
      //   }
      // }
    },
    handleFavour(data) {
      console.log(data);
      const conf = {
        name: "msg", // this is give you ability to use removeByName method
        title: data.message, // Toast Title
        msg: "", // Toast Message
        clickClose: false, // Click Close Disable
        position: "toast-top-center", // Toast Position.
        type: "success", // Toast type,
      };
      this.$toastr.Add(conf);

      let newFavor = [];

      if (this.favourIcon === "-outline") {
        // 新增本課程id
        this.favorList.push(this.lesson_hid);
        newFavor = this.favorList;
        this.favourIcon = "";
      } else {
        // 排除本課程id
        newFavor = this.favorList.filter((id) => {
          return id !== this.lesson_hid;
        });
        this.favourIcon = "-outline";
      }
      window.sessionStorage.setItem("favors", JSON.stringify(newFavor));
    },
    getNotes() {
      const payload = {
        lesson_hid: this.lesson_hid,
        code: this.mediaName,
      };
      this.$store.dispatch("class/courseNotes", payload);
    },
    handleNotes(data) {
      this.noteList = data;
      this.closeDialog();
    },
    getQuizzes() {
      // 測驗記錄
      const payload = {
        lesson_hid: this.lesson_hid,
        data: {
          userHid: this.userHid,
          code: this.mediaName,
        },
      };
      this.$store.dispatch("class/courseQuizzes", payload);
    },
    handleQuizzes(data) {
      if (data.data.length > 0) {
        this.quizzes = data.data;
      } else {
        // 無測驗則隱藏按鈕
        this.isQuiz = false;
      }
    },
    nexQuizTime(time) {
      let lastDate = new Date(time);
      let nowDate = new Date();
      let tomorrow = null;
      let lastTime = 0;
      let nowTime = 0;

      if (time) {
        tomorrow = new Date(time);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = `
          ${tomorrow.getFullYear()}-${
          tomorrow.getMonth() + 1
        }-${tomorrow.getDate()} 
          ${tomorrow.getHours()}:${tomorrow.getMinutes()}:${tomorrow.getSeconds()}
        `;
      }

      lastTime = lastDate.getTime();
      nowTime = nowDate.getTime();

      let tomorrowHrs = Math.floor((nowTime - lastTime) / 3600000);

      if (tomorrowHrs >= 24) {
        // 24 hr 則不顯示下次時間
        tomorrow = null;
      }

      return tomorrow;
    },
    takeQuiz(hid) {
      this.$router.push({
        name: "Quiz",
        params: {
          lesson_name: this.lessonName,
          fullName: this.fullName,
          courseId: this.courseId,
          videoFile: this.videoFile,
          lesson_hid: hid,
        },
      });
    },
    addDialog() {
      let localDate = DateFormat.localDate(new Date(), true);
      let ISODate = DateFormat.localtoISOdate(localDate);
      console.log(ISODate);
      this.addItem = {
        date: ISODate,
        time: this.player.currentTime(),
        note: "",
      };
      this.addWindows = true;

      this.playingPaused();
      this.exitFullScreen();
    },
    editDialog(item) {
      this.playingPaused();
      const date = new Date(item.time);

      this.editItem = item;
      this.editItem.date = DateFormat.localDate(date, true);

      this.editWindows = true;
    },
    deleteDialog(item) {
      this.playingPaused();
      this.editItem = item;
      this.dialogDelete = true;
    },
    closeDialog() {
      // 筆記:關閉
      if (this.addingNote) this.addWindows = false;
      this.editWindows = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.addItem = {};
        this.editItem = {};
      });
    },
    addNote() {
      // 筆記:新增
      const data = {
        lesson_hid: this.lesson_hid,
        note: {
          author_email: this.email,
          content: this.addItem.note,
          timecode: this.addItem.time,
          code: this.mediaName,
        },
      };
      console.log("addNote");
      this.$store.dispatch("class/addCourseNote", data);
    },
    editNote() {
      // 筆記:編輯
      const data = {
        data: {
          hid: this.editItem.hid,
          content: this.editItem.note,
        },
      };
      this.$store.dispatch("class/editCourseNote", data);
    },
    deleteNote() {
      // 筆記:刪除
      const data = {
        data: {
          hid: this.editItem.hid,
        },
      };
      this.$store.dispatch("class/deleteCourseNote", data);
    },
    reLoadNotes() {
      this.getNotes();
      this.$swal({
        icon: "success",
        animation: false,
        timer: 1500,
        showConfirmButton: false,
      });
    },
    addRating(rating, type) {
      const payload = {
        syntax: 1,
        account: this.user.email,
        courId: this.courseId,
        code: this.videoFile,
        courName: unescape(this.fullName),
        rating: rating,
        type: type,
      };
      console.log(payload);
      this.$store.dispatch("class/lodPostRating", payload);
      // this.$store.dispatch("class/rating", payload);
    },
    handleRating(data) {
      this.$swal({
        text: data.message,
        icon: data.status,
        animation: false,
        timer: 1500,
        showConfirmButton: false,
      });
    },
    addWatchRecords() {
      let nowdate = new Date();
      let endtime =
        DateFormat.localDate(nowdate, true) +
        " " +
        DateFormat.timeFormat(nowdate, "h:i:s");

      const payload = {
        videoinfo_hid: this.videoinfo_hid,
        data: {
          lesson_duration: this.lesson_duration,
          course_hid: this.course_hid,
          start_time: this.startTime,
          end_time: endtime,
          device: this.userAgent,
          os: this.os,
          browser: this.browser,
          custom_permit_id: this.custom_permit_id,
          category: this.category,
          class: this.class,
          subject: this.subject,
          course: this.course,
          lesson: this.lesson,
          section: this.section,
          rating: this.rating,
          evaluation: this.evaluation,
        },
      };
      this.$store.dispatch("class/watchRecords", payload);
    },
    handleWatchRes(data) {
      console.log("收視紀錄:" + data);
    },
    playViaStamp(timecode) {
      // 由影片戳記處觀看
      console.log(timecode);

      let idx = JSON.stringify(timecode).indexOf(":");
      if (idx > 0) {
        let time = timecode.split(":");
        let stamp =
          parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]); // secs

        this.player.currentTime(stamp);
      } else {
        this.player.currentTime(timecode);
      }
      this.playingPaused();
    },
    updateTimecode() {
      //記錄 timecode 預設每 10秒 更新一次
      if (this.isPlaying) {
        this.updateInterval = setInterval(() => {
          // const payload = {
          //   videoinfo_hid: this.videoinfo_hid,
          //   data: {
          //     timecode: this.player.currentTime(),
          //   },
          // };
          const payload = {
            syntax: 1,
            account: this.user.email,
            courseSeq: this.courseSeq,
            subjectString: this.subjString,
            courId: this.courseId,
            code: this.videoFile,
            courName: unescape(this.fullName),
            timeCode: this.player.currentTime(),
            duration: this.lesson_duration,
          };

          // if (this.isLog) {
          //   // 第一次需記錄到智基扣點 API
          //   this.deduct(0);
          //   this.isLog = false;
          // }

          if (this.player.currentTime()) {
            // this.$store.dispatch("class/updateTimecode", payload);
            this.$store.dispatch("class/lodPostRecord", payload);
          }
        }, 10 * 1000);
      } else {
        if (this.updateInterval) clearInterval(this.updateInterval);
      }
    },
    leftTimeWaterMark(time) {
      // 時段剩餘時間浮水印
      this.timeMark = time;
      if (this.player) {
        if (this.player.Watermark !== undefined) {
          this.player.Watermark.el().children[1].innerHTML = time;
        }
      }
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
      this.$store.dispatch("user/userValidate", xmls);
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
      this.$eventBus.$emit("checkReservedApp", {
        stop: false,
        email: this.user.email,
      }); // 通知串檢查預約 API

      // 查看是否預約
      this.$store.dispatch("class/courseList", `${this.user.email}`);
    },
    handleReserved(data) {
      this.$eventBus.$emit("checkReservedApp", {
        stop: true,
        email: this.user.email,
      }); // 通知停止重串檢查預約 API

      if (
        data.VldSub !== undefined &&
        data.VldSub === "Y" &&
        data.OnBranch !== "N"
      ) {
        console.log("Course: 有預約喔! :)");
        this.$eventBus.$emit("loadClose"); // 發出關閉 loading 需求
        this.userPoint(); // 網頁版若刷新(機上盒無法刷新)會重新檢查點數餘額，若早已扣完全部餘額則會被登出
      } else {
        this.playingPaused();
        this.exitFullScreen();

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
    userPoint() {
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDVLSVP.Execute xmlns="CEK">
      <Studentpid>${this.user.email}</Studentpid>
      <Courseseq>${this.courseSeq}</Courseseq>
      <Subjectstring>${this.subjString}</Subjectstring>
      <V01001>${this.videoFile}</V01001>
      </PBNSTDVLSVP.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      console.log(this.videoFile);
      this.$store.dispatch("user/userPoint", xmls); // tc
    },
    handlePoint(data) {
      this.point = parseInt(
        data.Envelope.Body["PBNSTDVLSVP.ExecuteResponse"].Vpoint.__text
      );

      if (this.point <= 0) {
        console.log("在 Course check point");

        this.playingPaused();
        this.exitFullScreen();

        this.$swal({
          text: `很抱歉您的點數不足， 剩餘${this.point}點`,
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
      <Studentpid>${this.user.email}</Studentpid>
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
          showConfirmButton: true,
        });
      }
    },
    getRecord() {
      //查詢今天看課紀錄及扣點紀錄
      this.$store.dispatch("user/courseDeductRecord", this.user.email);
    },
    handleRecord(data) {
      // console.log(data.ScribelogView.Viewdata);

      if (data.ScribelogView.Viewdata !== undefined) {
        // 取最後扣點時間
        let lastTime = lastDeduct(data.ScribelogView.Viewdata, this.courseSeq);
        let lastDate = new Date(lastTime);
        let lastHours = DateFormat.timeFormat(lastDate, "h");

        let nowDate = new Date();
        let hours = DateFormat.timeFormat(nowDate, "h");
        let mins = DateFormat.timeFormat(nowDate, "i");

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
            }
          }
        }
      } else {
        console.log("查無今日無看課及扣點紀錄直接進行扣點處理.");
        this.deduct();
      }
    },
    deduct(vpoint = 1) {
      vpoint = vpoint ? 1 : 0;
      //* 扣點處理;
      let nowdate = new Date();
      let vlsdate = DateFormat.localDate(nowdate, true);
      let vlstime = DateFormat.timeFormat(nowdate, "h:i:s");
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
          <soapenv:header/>
          <soapenv:Body>
          <PBNSTDVLSSUB.Execute xmlns="CEK">
          <Studentpid>${this.user.email}</Studentpid>
          <Courseseq>${this.courseSeq}</Courseseq>
          <Depofip>${this.stb_ip}</Depofip>
          <Subjectstring>${this.subjString}</Subjectstring>
          <V01101>${this.courseId}</V01101>
          <V01001>${this.videoFile}</V01001>
          <Vlssubpoint>${vpoint}</Vlssubpoint>
          <Vlsdate>${vlsdate}</Vlsdate>
          <Vlstime>${vlstime}</Vlstime>
          </PBNSTDVLSSUB.Execute>
          </soapenv:Body>
          </soapenv:Envelope>
          `;
      this.$eventBus.$emit("deductPoint"); // 告知已串扣點API
      this.$store.dispatch("user/deductPoint", xmls);
    },
    handleDeduct(data) {
      if (!this.isLog) return; // 已紀錄至智基

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
        // this.goNextVideo();
      } else {
        this.$swal({
          text: `發生錯誤，使用點數失敗`,
          icon: "error",
          animation: false,
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: true,
        });
      }
    },
    autoPlayNext() {
      // 自動播放下部影片
    },
    formatSecond(secs) {
      // 秒數格式處理
      let hr = Math.floor(secs / 3600);
      let min = Math.floor((secs - hr * 3600) / 60);
      let sec = parseInt(secs - hr * 3600 - min * 60);

      if (hr < 10) {
        hr = "0" + hr;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }

      return hr + ":" + min + ":" + sec;
    },
    windowFunction(funcArr) {
      // 將函式註冊至 window 類別中
      if (Array.isArray(funcArr)) {
        funcArr.forEach((func) => {
          window[func.name] = func.func;
        });
      } else {
        console.log("Window function added error, none Array expected.");
      }
    },
    goback() {
      // 回上一頁
      this.$router.go(-1);
    },
    ...mapActions({}),
  },
  mounted() {
    this.init();
    this.getChtCourseData();
  },
  created() {
    // adding eventBus listener
    this.$eventBus.$on("checkReserved", () => {
      this.userValidate();
    });
    this.$eventBus.$on("leftTime", (data) => {
      this.leftTimeWaterMark(data);
    });
    this.$eventBus.$on("exitFullScreen", () => {
      this.playingPaused();
      this.exitFullScreen();
    });
    this.windowFunction([
      { name: "spacePlayPause", func: this.spacePlayPause },
    ]);
  },
  beforeDestroy() {
    // removing eventBus listener
    this.$eventBus.$off("checkReserved");
    this.$eventBus.$off("leftTime");
    this.$eventBus.$off("exitFullScreen");
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.movingInterval);
    clearTimeout(this.removeTimeout);
    clearInterval(this.updateInterval);
    this.locateIdx = 0; //浮水印位置復原 0
    this.addWatchRecords();
    next();
    console.log(from, to);
  },
};
</script>

<style scoped>
.hidden {
  display: none;
  visibility: hidden;
}
</style>
