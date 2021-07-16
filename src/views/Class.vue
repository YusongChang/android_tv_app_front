<template>
  <v-container fluid>
    <v-dialog v-model="editWindows" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">筆記</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="editedItem.date"
                  label="日期"
                  disabled
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="editedItem.time"
                  label="時間(秒)"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea v-model="editedItem.note" label="筆記"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="close"> 取消 </v-btn>
          <v-btn color="success" text @click="save"> 儲存 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">要刪除這個筆記嗎?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="closeDelete">取消</v-btn>
          <v-btn color="error" text @click="deleteItemConfirm">刪除</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-toolbar flat color="green">
      <v-toolbar-title>
        <v-btn @click="goback()" text rounded
          ><v-icon>mdi-arrow-left</v-icon></v-btn
        >
        {{ this.name }} {{ this.videoname }} {{ this.video.chaptername }}
        {{ this.video.description }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="sideBar = !sideBar"> </v-app-bar-nav-icon>
      <v-rating
        full-icon="mdi-heart"
        empty-icon="mdi-heart-outline"
        color="red"
        background-color="red"
        length="1"
      ></v-rating>
    </v-toolbar>
    <v-alert v-text="message" v-if="message!=''" color="info"></v-alert>
    <v-card flat>
      <v-row no-gutters>
        <v-col cols="12" lg="12">
          <v-card color="black" flat height="100%" tile>
            <div class="myplayer">
              <div @click="play()">
                <video
                  id="myVideo"
                  src="http://220.134.127.146/video/taida/DEMO/1200.mp4"
                  autoplay="true"
                  width="100%"
                  height="100%"
                  @timeupdate="getNow()"
                  @ended="finished()"
                ></video>
                <div class="playpause" v-show="show"></div>
              </div>
              <div id="controls" class="controls">
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
                <v-btn text dark tile @click="play()"
                  ><v-icon>{{ playBtn }}</v-icon></v-btn
                >
                <v-btn text dark tile @click="addTime(-10)"
                  ><v-icon>mdi-skip-previous </v-icon></v-btn
                >
                <v-btn text dark tile @click="addTime(10)"
                  ><v-icon>mdi-skip-next </v-icon></v-btn
                >
                <v-menu top offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text dark tile v-bind="attrs" v-on="on"
                      ><v-icon>mdi-clock</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-btn text tile @click="ratechange(0.5)">0.5x</v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn text tile @click="ratechange(1)">1x</v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn text tile @click="ratechange(1.5)">1.5x</v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn text tile @click="ratechange(2)">2x</v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-btn
                  text
                  dark
                  @click="
                    editItem({
                      date: new Date().toISOString().substring(0, 10),
                      time: videoTime(),
                      note: '',
                    })
                  "
                  ><v-icon>mdi-pen</v-icon>
                </v-btn>
                <v-menu top offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text dark tile v-bind="attrs" v-on="on"
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
                <v-btn text dark tile @click="fullScreen"
                  ><v-icon>mdi-fullscreen </v-icon></v-btn
                >
              </div>
            </div>
          </v-card>
        </v-col>
        <v-navigation-drawer v-model="sideBar" app temporary right>
          <v-card color="orange" flat height="100%" tile>
            <v-card-subtitle class="display-1"> 影片戳記 </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-actions>
              <v-list flat width="100%" color="orange">
                <v-list-item @click="gogo(10)">
                  <v-list-item-title>開頭十秒</v-list-item-title> 00:00:10
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="gogo(20)">
                  <v-list-item-title>開頭二十秒</v-list-item-title> 00:00:20
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="gogo(47)">
                  <v-list-item-title>結尾前五秒</v-list-item-title> 00:00:47
                </v-list-item>
              </v-list>
            </v-card-actions>
          </v-card>
        </v-navigation-drawer>
      </v-row>
    </v-card>
    <v-card flat>
      <v-tabs>
        <v-tab> <v-icon left small>mdi-pen</v-icon> 備註 </v-tab>
        <v-tab> <v-icon left small>mdi-note</v-icon> 筆記 </v-tab>
        <v-tab> <v-icon left small>mdi-book</v-icon> 評價 </v-tab>
        <v-tab> <v-icon left small>mdi-star</v-icon> 評分 </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-title>關於本片</v-card-title>
            <v-card-text>配合教材：課本123</v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-list class="ma-8">
              <v-list-item v-for="(item, index) in noteList" :key="index">
                <v-row>
                  <v-col
                    cols="4"
                    lg="4"
                    md="4"
                    sm="4"
                    xs="4"
                    @click="gogo(item.time)"
                  >
                    <v-list-item-title>
                      {{ formatSecond(item.time) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.date }}
                    </v-list-item-subtitle>
                  </v-col>
                  <v-col
                    cols="6"
                    lg="6"
                    md="6"
                    sm="6"
                    xs="6"
                    @click="gogo(item.time)"
                  >
                    <v-list-item-content>
                      <v-textarea
                        v-model="item.note"
                        height="30px"
                        dense
                        readonly
                        solo
                        flat
                      >
                      </v-textarea>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="2" lg="2" md="2" sm="2" xs="2">
                    <v-menu bottom left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="orange"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          text
                          rounded
                        >
                          <v-icon>menu</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item>
                          <v-btn
                            text
                            small
                            color="orange"
                            @click="editItem(item)"
                            ><v-icon>edit</v-icon></v-btn
                          >
                        </v-list-item>
                        <v-list-item>
                          <v-btn
                            text
                            small
                            color="error"
                            @click="deleteItem(item)"
                            ><v-icon>delete</v-icon></v-btn
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-title
              >課程評價
              <v-card-text>
                <v-row>
                  <v-rating length="5" large> </v-rating>
                  <v-spacer></v-spacer>
                  <v-btn small text color="info" @click="subrating()"
                    ><v-icon>check</v-icon>送出</v-btn
                  >
                </v-row>
              </v-card-text>
            </v-card-title>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-title
              >理解度評分
              <v-card-text>
                <v-row>
                  <v-slider thumb-label="always"> </v-slider>
                  <v-spacer></v-spacer>
                  <v-btn small text color="info" @click="subrating()"
                    ><v-icon>check</v-icon>送出</v-btn
                  >
                </v-row>
              </v-card-text>
            </v-card-title>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    id: null,
    sideBar: false,
    sound: 0.8,
    progress: 0,
    index: 0,
    duration: 0,
    step: 0.000000000001,
    show: false,
    message:'123456',
    name: null,
    date: null,
    videoname: null,
    video: [],
    playBtn: "mdi-pause",
    noteList: [],
    editedItem: {
      date: "",
      time: "",
      note: "",
    },
    defaultItem: {
      date: "",
      time: "",
      note: "",
    },
    editedIndex: -1,
    editWindows: false,
    dialogDelete: false,
  }),
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters({
      getClass: "class/getClass",
    }),
  },
  methods: {
    subrating() {
      this.$swal({
        text: "已送出",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    },
    gogogo(e) {
      var vid = document.getElementById("myVideo");
      vid.currentTime = e;
    },
    volume(e) {
      var vid = document.getElementById("myVideo");
      vid.volume = e;
      if (e.cancelable) {
        e.preventDefault();
      }
    },
    getData() {
      var data = this.getClass;
      var index2 = this.$route.params.video.substring(0, 1) - 1;
      var index = this.$route.params.video.substring(3, 2) - 1;
      this.id = data.id;
      this.name = data.name;
      this.date = data.date;
      this.videoname = data.video[index2].videoname;
      this.video = data.video[index2].chapter[index];
    },
    getNow() {
      var vid = document.getElementById("myVideo");
      this.progress = vid.currentTime;
      this.duration = vid.duration;
      this.step = 1 / vid.duration;
    },
    addTime(time) {
      var vid = document.getElementById("myVideo");
      vid.currentTime += time;
    },
    gogo(time) {
      var vid = document.getElementById("myVideo");
      vid.currentTime = time;
    },
    play() {
      var vid = document.getElementById("myVideo");
      if (this.index < 1) {
        this.index = this.index + 1;
      } else {
        vid.webkitExitFullscreen();
        this.index = 0;
      }
      if (vid.paused) {
        vid.play();
        this.playBtn = "mdi-pause";
        this.show = false;
      } else {
        vid.pause();
        this.playBtn = "mdi-play";
        this.show = true;
      }
    },
    finished() {
      var vid = document.getElementById("myVideo");
      vid.pause();
      this.playBtn = "mdi-play";
      this.show = true;
    },
    fullScreen() {
      var vid = document.getElementById("myVideo");
      if (!vid.webkitFullscreenElement) {
        vid.requestFullscreen();
      } else {
        vid.webkitExitFullscreen();
      }
    },
    ratechange(time) {
      var vid = document.getElementById("myVideo");
      vid.playbackRate = time;
    },
    videoTime() {
      var vid = document.getElementById("myVideo");
      return vid.currentTime;
    },
    goback() {
      this.$router.go(-1);
    },
    editItem(item) {
      this.editedIndex = this.noteList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editWindows = true;
      var vid = document.getElementById("myVideo");
      vid.pause();
    },

    deleteItem(item) {
      this.editedIndex = this.noteList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
      var vid = document.getElementById("myVideo");
      vid.pause();
    },
    deleteItemConfirm() {
      this.noteList.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.editWindows = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      var vid = document.getElementById("myVideo");
      vid.play();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      var vid = document.getElementById("myVideo");
      vid.play();
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.noteList[this.editedIndex], this.editedItem);
      } else {
        this.noteList.push(this.editedItem);
        console.log(this.noteList);
      }
      this.close();
    },
    formatSecond(secs) {
      var hr = Math.floor(secs / 3600);
      var min = Math.floor((secs - hr * 3600) / 60);
      var sec = parseInt(secs - hr * 3600 - min * 60);

      while (min.length < 2) {
        min = "0" + min;
      }
      while (sec.length < 2) {
        sec = "0" + sec;
      }
      if (hr);
      return hr + ":" + min + ":" + sec;
    },
    ...mapActions({}),
  },
};
</script>

<style>
.playpause {
  background-image: url("http://png-4.findicons.com/files/icons/2315/default_icon/256/media_play_pause_resume.png");
  background-repeat: no-repeat;
  width: 50%;
  height: 50%;
  position: absolute;
  left: 0%;
  right: 0%;
  top: 0%;
  bottom: 0%;
  margin: auto;
  background-size: contain;
  background-position: center;
}

video::-webkit-media-controls {
  display: none !important;
}
video::-webkit-media-controls-enclosure {
  display: none !important;
}
</style>