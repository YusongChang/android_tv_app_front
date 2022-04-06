<template>
  <!--看課頁面-->
  <v-container fluid>
    <v-row class="justify-center">
      <v-col>
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
                      type="date"
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
            {{ courseName }}
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
              <v-card color="black" flat height="100%" tile>
                <div class="myplayer">
                  <div id="player-content" @click="play()">
                    <video
                      id="myVideo"
                      autoplay="true"
                      width="100%"
                      height="100%"
                      @timeupdate="getNow()"
                      @ended="finished()"
                    ></video>
                    <div id="darkScreenCover">
                      <v-btn fab dark>
                        <v-icon color="green darken-2">mdi-play </v-icon>
                      </v-btn>
                    </div>
                    <div id="userHid">{{ userHid }}</div>
                    <div id="leftTime">{{ timeMark }}</div>
                    <!-- <div class="playpause" v-show="show">
                  <v-icon color="dark">mdi-pause</v-icon>
                </div> -->
                    <div id="control-bar" class="controls">
                      <v-slider
                        v-on:input="gogogo"
                        v-model="progress"
                        :max="duration"
                        step="step"
                      >
                      </v-slider>
                      <div class="white--text ml-2 mt-n5">
                        {{ formatSecond(progress) }} /
                        {{ formatSecond(duration) }}
                      </div>
                      <v-btn text dark tile @click.stop="play()"
                        ><v-icon>{{ playBtn }}</v-icon></v-btn
                      >

                      <v-btn
                        v-if="isPlay"
                        class="prev-second-btn"
                        text
                        dark
                        tile
                        @click.stop="addTime(-10)"
                        ><v-icon>mdi-skip-previous </v-icon></v-btn
                      >

                      <v-btn
                        v-if="isPlay"
                        class="next-second-btn"
                        text
                        dark
                        tile
                        @click.stop="addTime(10)"
                        ><v-icon>mdi-skip-next </v-icon></v-btn
                      >

                      <v-menu v-if="isPlay" top offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            id="clock-btn"
                            text
                            dark
                            tile
                            v-bind="attrs"
                            v-on="on"
                            ><v-icon>mdi-clock</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <!-- <v-list-item>
                            <v-btn text tile @click.stop="ratechange(0.25)"
                              >0.25x</v-btn
                            >
                          </v-list-item> -->
                          <!-- <v-list-item>
                            <v-btn text tile @click.stop="ratechange(0.5)"
                              >0.5x</v-btn
                            >
                          </v-list-item> -->
                          <v-list-item>
                            <v-btn text tile @click.stop="ratechange(0.75)"
                              >0.75x</v-btn
                            >
                          </v-list-item>
                          <v-list-item>
                            <v-btn text tile @click.stop="ratechange(1)"
                              >1x</v-btn
                            >
                          </v-list-item>
                          <v-list-item>
                            <v-btn text tile @click.stop="ratechange(1.25)"
                              >1.25x</v-btn
                            >
                          </v-list-item>
                          <v-list-item>
                            <v-btn text tile @click.stop="ratechange(1.5)"
                              >1.5x</v-btn
                            >
                          </v-list-item>
                          <v-list-item>
                            <v-btn text tile @click.stop="ratechange(1.75)"
                              >1.75x</v-btn
                            >
                          </v-list-item>
                          <v-list-item>
                            <v-btn text tile @click.stop="ratechange(2)"
                              >2x</v-btn
                            >
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <v-btn
                        v-if="isPlay"
                        id="note-btn"
                        text
                        dark
                        @click.stop="
                          addDialog({
                            date: new Date().toISOString().substring(0, 10),
                            time: videoTime(),
                            note: '',
                          })
                        "
                        ><v-icon>mdi-pen</v-icon>
                      </v-btn>

                      <v-menu top offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            text
                            dark
                            tile
                            v-bind="attrs"
                            v-on="on"
                            id="volume-btn"
                            ><v-icon>mdi-volume-source</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <div class="text-center">
                            {{ Math.floor(sound * 100) }}
                          </div>
                          <v-slider
                            v-on:input="volume"
                            v-model="sound"
                            max="1"
                            min="0"
                            step="0.01"
                            vertical
                          >
                          </v-slider>
                        </v-list>
                      </v-menu>

                      <v-btn
                        v-if="isPlay"
                        id="fullscreen-btn"
                        text
                        dark
                        tile
                        @click.stop="fullScreen()"
                      >
                        <v-icon>{{ fullScreenIcon }}</v-icon>
                      </v-btn>
                    </div>
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
                        :key="idx"
                        color="primary"
                      >
                        <v-list-item-content
                          @click="playViaStamp(code.timecode)"
                        >
                          <v-list-item-title>
                            {{ code.description }}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content
                          @click="playViaStamp(code.timecode)"
                        >
                          <v-list-item-title>
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
            <v-tab>
              <v-icon left small>mdi-notebook-multiple</v-icon> 筆記
            </v-tab>
            <v-tab> <v-icon left small>mdi-note-edit</v-icon> 測驗 </v-tab>
            <v-tab> <v-icon left small>mdi-book</v-icon> 課程評價 </v-tab>
            <v-tab> <v-icon left small>mdi-star</v-icon> 理解度評分 </v-tab>
            <v-tab-item class="my-12">
              <v-card flat>
                <v-card-title>關於本片</v-card-title>
                <v-card-text>{{ summary }}</v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item class="my-12">
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
            </v-tab-item>
            <v-tab-item class="my-12">
              <v-card flat>
                <v-container>
                  <v-row
                    v-for="(qz, idx) in quizzes"
                    :key="idx"
                    justify="start"
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
                      <div>測驗時間: {{ qz.time }}</div>
                      <div>測驗方式: {{ qz.type }}</div>
                      <div>測驗限時: {{ qz.time_limit }} 分鐘</div>
                      <div>測驗分數: {{ qz.score }}/ 100</div>
                      <v-divider class="mt-1 mb-2"></v-divider>
                      <v-btn color="success ml-sm-auto mr-sm-auto" dark
                        >進行測驗</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item class="my-12">
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
                        @click="addRating(evaluation, 'rating')"
                        ><v-icon>check</v-icon>送出</v-btn
                      >
                    </v-row>
                  </v-card-text>
                </v-card-title>
              </v-card>
            </v-tab-item>
            <v-tab-item class="my-12">
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
                        @click="addRating(rating, 'evaluation')"
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
import Hls from "hls.js";
import CryptoJS from "crypto-js/";

export default {
  components: {
    // VideoPlayer
  },
  props: [
    // "lesson_hid",
    "name",
    "videoFile",
    "playTimecode",
    "subjString",
    "courseseq",
  ], //* router props

  data: () => ({
    fullScreenIcon: "mdi-fullscreen",
    user: JSON.parse(sessionStorage.getItem("user")),
    userHid: sessionStorage.getItem("userHid"),
    videoOptions: {
      loop: true,
      width: "600",
      height: "400px",
      sources: [
        {
          src: "",
          type: "",
        },
      ],
    },
    timeout: null,
    id: null,
    sideBar: false, // 影片戳記 右手邊使用
    message: "", // 提示訊息
    sound: 0.8, // 聲音預設 80%
    progress: 0, // 播放紀錄
    index: 0,
    duration: 0,
    step: 0.000000000001, //
    show: false,
    isPlay: true,
    date: null,
    videoname: null, // 影片名稱
    playBtn: "mdi-play", // 播放鍵
    noteList: [], //
    quizzes: [],
    addItem: {},
    editItem: {},
    defaultItem: {},
    addWindows: false,
    editWindows: false,
    dialogDelete: false,
    darkcover: "",
    vid: "",
    courseName: "",
    mediaName: "",
    secretString: "",
    playUrlHeader: "",
    requestPath: "",
    email: "",
    emailTail: "@lod.com",
    summary: "",
    timecode: "",
    value: 0,
    interval: "",
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
    category: "高考(三級)",
    class: "總複習班",
    subject: "人事行政", // 考試類科
    course: "", // 科目
    lesson: "", // 單元
    section: "", // 堂數
    rating: 0,
    evaluation: 0,
    favorList: JSON.parse(window.sessionStorage.getItem("favors")),
    point: 0,
    vpoint: 0,
    timeMark: "",
    autoPlay: false,
    addingNote: true,
  }),
  computed: {
    ...mapGetters({
      getChtCourse: "class/getChtCourse",
      getCourseNotes: "class/getCourseNotes",
      getCRUDCourseNote: "class/getCRUDCourseNote",
      getCourseQuizzes: "class/getCourseQuizzes",
      getCourseQuiz: "class/getCourseQuiz",
      getUpdateTimeCode: "class/getUpdateTimeCode",
      getAddFavour: "class/getAddFavour",
      getUnFavour: "class/getUnFavour",
      getRatingRes: "class/getRatingRes",
      getWatchRes: "class/getWatchRes",
      getValidated: "user/getValidated",
      getCourseList: "class/getCourseList",
      getPoint: "user/getPoint",
      getCourseAndDeduct: "user/getCourseAndDeduct",
      getCourseDeductRecord: "user/getCourseDeductRecord",
      getDeductPoint: "user/getDeductPoint",
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
    getCourseQuiz(data) {
      this.handleQuiz(data);
    },
    getAddFavour(data) {
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
  },
  methods: {
    init() {
      // 取得頁面開始時間 start_time
      let nowdate = new Date();
      this.startTime =
        DateFormat.localDate(nowdate) +
        " " +
        DateFormat.timeFormat(nowdate, "h:i:s");

      this.mediaName = this.videoFile;

      // this.courseName = sessionStorage.getItem("courseName");

      this.email = this.user.email + this.emailTail;
      this.courseName = this.name;
      this.playTime = this.playTimecode || 0;

      const settingData = JSON.parse(Cookie.readCookie("setting") || null);
      this.stb_ip = settingData.stb_ip;

      this.darkcover = document.getElementById("darkScreenCover");
      this.vid = document.getElementById("myVideo");

      this.vpoint = 1; //* 目前一個時段扣 1 點

      this.autoPlayNext();
    },
    getChtCourseData() {
      this.mediaName = "B0B001C001D161E137F01A01000"; //* 法學緒論測試

      this.$store.dispatch("class/chtCourse", {
        //* test
        code: this.mediaName,
        quality: "720",
      });
    },
    handleChtCourse(data) {
      this.summary = data.lessons[0].summary;

      if (data.lessons[0].timecode)
        this.timecode = data.lessons[0].timecode[0].subs;

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
        this.isFavor(this.lesson_hid);
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
      //* 網址測試中
      let playUrlHeader =
        "https://cekvod-ott2b.cdn.hinet.net/vod_cek-ae/_definst_/smil:cek/0071160115305002/hd-hls-ae-tv-ma.smil/playlist.m3u8";
      let request_path =
        "/vod_cek-ae/_definst_/smil:cek/0071160115305002/hd-hls-ae-tv-ma.smil/";

      let timestamp = new Date("2023-12-31 23:59:59").getTime();
      let secure_link_expires = timestamp / 1000;

      let token = CryptoJS.MD5(
        request_path + secure_link_expires + this.secretString
      ).toString(CryptoJS.enc.Base64);

      // token = token
      //   .replaceAll("+", "-")
      //   .replaceAll("/", "_")
      //   .replaceAll("=", ""); //*** android 9 ，Chrome 低於 ver.85 不支援

      console.log(token);

      token = token
        .split("+")
        .join("-")
        .split("/")
        .join("_")
        .split("=")
        .join("");

      // console.log(token);

      // 修正影片未載完太早按播放造成暫停
      const playerContent = document.getElementById("player-content");
      playerContent.style.pointerEvents = "none";

      let timer = setTimeout(() => {
        playerContent.style.pointerEvents = "auto";
        this.vid.pause(); // 初始先暫停
        clearTimeout(timer);
      }, 500);

      // hls 技術支援

      const videoSrc = `${playUrlHeader}?token=${token}&expires=${secure_link_expires}`;
      console.log(videoSrc);

      if (this.vid.canPlayType("application/vnd.apple.mpegurl")) {
        this.vid.src = videoSrc;
        console.log("Yes Support Hls.");
      } else if (Hls.isSupported()) {
        console.log("No Support Hls!");
        const hls = new Hls();
        hls.attachMedia(this.vid);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          console.log("video and hls.js are now bound together !");
          hls.loadSource(videoSrc);
        });
      }

      if (this.playTime) {
        this.vid.currentTime = this.playTime;
      }
    },
    favour() {
      const payload = {
        lesson_hid: this.lesson_hid,
        data: {
          code: this.mediaName,
        },
      };

      if (this.lesson_hid) {
        if (this.favourIcon === "-outline") {
          this.$store.dispatch("class/addFavour", payload);
        } else {
          this.$store.dispatch("class/unFavour", payload);
        }
      }
    },
    handleFavour(data) {
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
        this.getQuiz(data.data[0].hid);
      }
    },
    getQuiz(hid) {
      this.$store.dispatch("class/courseQuizContent", hid);
    },
    handleQuiz(data) {
      console.log(data);
      // this.quiz = data.data;
    },
    addDialog(item) {
      this.vid = document.getElementById("myVideo");
      this.vid.pause();
      this.addItem = Object.assign({}, item);
      this.addWindows = true;
      this.exitFullScreen();
    },
    editDialog(item) {
      this.vid = document.getElementById("myVideo");
      this.vid.pause();
      const date = new Date(item.time);
      this.editItem = item;
      this.editItem.date =
        date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      this.editWindows = true;
    },
    deleteDialog(item) {
      this.vid = document.getElementById("myVideo");
      this.vid.pause();
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
      this.$swal({ icon: "success", timer: 1500, showConfirmButton: false });
    },
    addRating(rating, type) {
      const payload = {
        courseHid: this.course_hid,
        lessonHid: this.lesson_hid,
        rating: rating,
        userHid: this.userHid,
        type: type,
        code: this.mediaName,
      };
      this.$store.dispatch("class/rating", payload);
    },
    handleRating(data) {
      this.$swal({
        text: data.message,
        icon: data.status,
        timer: 1500,
        showConfirmButton: false,
      });
    },
    addWatchRecords() {
      let nowdate = new Date();
      let endtime =
        DateFormat.localDate(nowdate) +
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
    gogogo(e) {
      this.vid = document.getElementById("myVideo");
      // 影片戳記:目前時間
      this.vid.currentTime = e;
    },
    volume(e) {
      this.vid = document.getElementById("myVideo");
      // 影片播放:音量
      this.vid.volume = e;
      if (e.cancelable) {
        e.preventDefault();
      }
    },
    getNow() {
      //
      this.vid = document.getElementById("myVideo");
      if (this.vid !== undefined && this.vid !== "") {
        this.progress = this.vid.currentTime;
        this.duration = this.vid.duration;
        this.step = 1 / this.vid.duration;
      }
    },
    addTime(time) {
      this.vid = document.getElementById("myVideo");
      // 影片播放:目前觀看時間點往前跳(加10秒)
      this.vid.currentTime += time;
    },
    playViaStamp(timecode) {
      this.vid = document.getElementById("myVideo");

      // 由影片戳記處觀看
      let idx = JSON.stringify(timecode).indexOf(":");
      if (idx > 0) {
        let time = timecode.split(":");
        let stamp =
          parseInt(time[0]) / 3600 + parseInt(time[1]) / 60 + parseInt(time[2]); // secs
        this.vid.currentTime = stamp;
      } else {
        this.vid.currentTime = timecode;
      }
    },
    play() {
      // 影片播放狀態
      this.darkcover.style.display = "none"; // 關閉遮罩
      this.isPlay = true; // 已按過播放鈕

      console.log("init is paused: ", this.vid.paused);

      if (this.vid.paused) {
        //已暫停則播放
        this.vid.play();
        this.updateTimecode();
        this.playBtn = "mdi-pause";
        this.show = false;
      } else {
        this.vid.pause();
        this.stopUpTimecode();
        this.playBtn = "mdi-play";
        this.show = true;
      }
    },
    updateTimecode() {
      //記錄 timecode 預設每 30秒 更新一次

      this.interval = setInterval(() => {
        const payload = {
          videoinfo_hid: this.videoinfo_hid,
          data: {
            timecode: this.vid.currentTime,
          },
        };
        if (this.vid.currentTime)
          this.$store.dispatch("class/updateTimecode", payload);
      }, 30000);
    },
    stopUpTimecode() {
      if (this.interval) clearInterval(this.interval);
      console.log("clear Interval.");
    },
    finished() {
      // 影片播放:結束時，播放按鈕轉為顯示
      this.vid.pause();
      this.playBtn = "mdi-play";
      this.show = true;
    },
    fullScreen() {
      // 影片播放:全螢幕
      let vid = document.getElementById("player-content");
      let clockBtn = document.getElementById("clock-btn");
      let volumeBtn = document.getElementById("volume-btn");
      if (
        !document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        // current working methods
        if (vid.requestFullscreen) {
          vid.requestFullscreen();
        } else if (vid.msRequestFullscreen) {
          vid.msRequestFullscreen();
        } else if (vid.mozRequestFullScreen) {
          vid.mozRequestFullScreen();
        } else if (vid.webkitRequestFullscreen) {
          vid.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        clockBtn.style.display = "none";
        volumeBtn.style.display = "none";
      } else {
        this.exitFullScreen();
      }
    },
    exitFullScreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    ratechange(time) {
      // 影片播放:播數倍速
      this.vid.playbackRate = time;
    },
    videoTime() {
      // 影片播放: 目前時間
      return this.vid.currentTime;
    },
    leftTimeWaterMark(time) {
      // 時段剩餘時間浮水印
      this.timeMark = time;
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
      if (data.VldSub === "Y") {
        console.log("Course: 有預約喔! :)");
        this.userPoint();
      } else {
        this.exitFullScreen();
        // 登出學員
        this.$swal({
          title: "您尚未預約本時段",
          icon: "warning",
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            this.$emit("pageEvent", { loginData: "logout" }); //* 登出
          }
        });
      }
    },
    userPoint() {
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDVLSVP.Execute xmlns="CEK">
      <Studentpid>${this.user.email}</Studentpid>
      <Courseseq>${this.courseseq}</Courseseq>
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
        console.log("在 Course check point");
        this.exitFullScreen();
        this.$swal({
          text: `很抱歉您的點數不足， 剩餘${this.point}點`,
          icon: "warning",
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
      let bDate = DateFormat.localDate(new Date());
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
      </soapenv:Envelope>`;
      this.$store.dispatch("user/courseAndDeduct", xmls); // tc
    },
    deductRecord(data) {
      if (
        data.Envelope.Body["PMBSTDLOD07.ExecuteResponse"].Bdate !== undefined
      ) {
        this.getRecord();
      } else {
        this.exitFullScreen();

        this.$swal({
          text: "發生錯誤，無法查詢看課紀錄及扣點紀錄",
          icon: "error",
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
      console.log(data.ScribelogView.Viewdata);

      if (data.ScribelogView.Viewdata !== undefined) {
        // 取最後扣點時間
        let lastTime = lastDeduct(data.ScribelogView.Viewdata);
        let lastDate = new Date(lastTime);
        let lastHours = DateFormat.timeFormat(lastDate, "h");

        let nowDate = new Date();
        let hours = DateFormat.timeFormat(nowDate, "h");
        let mins = DateFormat.timeFormat(nowDate, "i");

        if (hours > lastHours) {
          if (mins >= 10) {
            //已進入 XX時10分
            console.log("已進入新時段");
            this.deduct();
          } else {
            console.log("COS 無須扣點");
          }
        } else {
          console.log("COS 無須扣點");
        }
      } else {
        console.log("查無今日無看課及扣點紀錄直接進行扣點處理.");
        this.deduct();
      }
    },
    deduct() {
      this.exitFullScreen();
      // 扣點處理;
      this.$swal({
        text: `您目前點數為:${this.point},本時段將使用${this.vpoint}點`,
        icon: "warning",
        timer: 0,
        showDenyButton: true,
        reverseButtons: true,
      }).then((res) => {
        if (res.isConfirmed) {
          let nowdate = new Date();
          let vlsdate = DateFormat.localDate(nowdate);
          let vlstime = DateFormat.timeFormat(nowdate, "h:i:s");
          let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
          <soapenv:header/>
          <soapenv:Body>
          <PBNSTDVLSSUB.Execute xmlns="CEK">
          <Studentpid>${this.user.email}</Studentpid>
          <Courseseq>${this.courseseq}</Courseseq>
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
      if (
        data.Envelope.Body["PBNSTDVLSSUB.ExecuteResponse"].Rtncode.__text ===
        "ok"
      ) {
        this.$swal({
          text: `已使用${this.vpoint}點`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        this.goNextVideo();
      } else {
        this.$swal({
          text: `發生錯誤，扣點失敗`,
          icon: "error",
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
      var hr = Math.floor(secs / 3600);
      var min = Math.floor((secs - hr * 3600) / 60);
      var sec = parseInt(secs - hr * 3600 - min * 60);

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
    spaceToStop() {},
    goback() {
      // 回上一頁
      this.$router.go(-1);
    },
    mouseMove() {
      let controls = document.getElementById("control-bar");
      controls.style.bottom = "0";
      controls.style.zIndex = "1";
      if (this.timeout === null) {
        this.timeout = setTimeout(() => {
          controls.style.bottom = "-100%";
          controls.style.zIndex = "-9999";
          clearTimeout(this.timeout);
          this.timeout = null;
        }, 4500);
      }
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

    // video full screen state
    document.addEventListener("fullscreenchange", () => {
      let controls = document.getElementById("control-bar");
      let video = document.getElementById("myVideo");

      if (document.fullscreenElement) {
        this.fullScreenIcon = "mdi-fullscreen-exit";

        video.addEventListener("mousemove", this.mouseMove);

        controls.addEventListener("mouseover", function () {
          controls.style.bottom = "0";
          controls.style.zIndex = "1";
          clearTimeout(this.timeout);
          this.timeout = null;
        });
      } else {
        video.removeEventListener("mousemove", this.mouseMove);
        controls.removeEventListener("mouseover", function () {});

        let clockBtn = document.getElementById("clock-btn");
        let volumeBtn = document.getElementById("volume-btn");

        clockBtn.style.display = "inline-flex";
        volumeBtn.style.display = "inline-flex";
        this.fullScreenIcon = "mdi-fullscreen";

        controls.style.bottom = "0";
        controls.style.zIndex = "1";
        clearTimeout(this.timeout);
        this.timeout = null;
      }
    });
  },
  beforeDestroy() {
    // removing eventBus listener
    this.$eventBus.$off("leftTime");
  },
  beforeRouteLeave(to, from, next) {
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
