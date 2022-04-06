<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.background }">
    <Navbar ref="navEvent" />
    <v-main>
      <router-view @pageEvent="handleEvent"></router-view>
    </v-main>
    <!-- <Footer ref="footerEvent" /> -->
  </v-app>
</template>
``
<script>
import Navbar from "./components/Navbar";
import { mapGetters } from "vuex";
import { Cookie } from "./composition_api";
// import Footer from "./components/Footer";
export default {
  name: "App",
  components: {
    Navbar,
    // Footer,
  },
  data: () => ({
    disabledList: ["Home", "ClassList"], // 不能上一頁的頁面
    sec: 1, // 初始 1 sec
    stb_mac: null,
    static_ip: null,
    fullPage: true,
    loadingEl: null,
    timeOut: null,
    inter: null,
    email: null,
    reInterval: null,
    reInterSec: 120,
  }),
  computed: {
    ...mapGetters({
      getLodPostMsg: "user/getLodPostMsg",
    }),
    routerName() {
      return this.$route.name;
    },
  },
  watch: {
    getLodPostMsg(data) {
      this.handlePost(data);
    },
  },
  methods: {
    getMsg() {
      this.inter = setInterval(() => {
        let settingData = JSON.parse(Cookie.readCookie("setting") || null);
        this.stb_mac = settingData.stb_mac;
        this.static_ip = settingData.static_ip;
        let message = null;

        if (this.stb_mac) {
          message = window.Messaging.getMessage(this.stb_mac);
        }

        console.log("有來自JAVA的訊息: ", message);

        let msg = message.replace(new RegExp(/\/\/\/+/, "gi"), " "); //取代 /// 為空格
        let msgTxt = "";

        if (msg !== "N" && msg !== "") {
          this.$eventBus.$emit("exitFullScreen"); // 發出結束全螢幕需求
          clearInterval(this.inter);
          msgTxt = msg.split("_"); // 多個訊息分割再組合

          this.$swal({
            html: msgTxt[3],
            icon: "warning",
            animation: false,
            timer: 0,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> 確認',
          }).then((res) => {
            if (res.isConfirmed) {
              console.log(msgTxt[3]);
              this.postMsg(msgTxt[3]);
              this.getMsg(); // 繼續取得 message
            }
          });
        } else if (msg === "N") {
          clearInterval(this.inter);
          // this.$swal({
          //   text: "無法與中控 API 連線!",
          //   icon: "error",
          //   timer: 0,
          //   allowOutsideClick: true,
          //   showConfirmButton: true,
          //   confirmButtonText: "確認",
          // });
        }
      }, 3 * 1000);
    },
    postMsg(msg) {
      // msg = msg.replace(new RegExp(/\s+/, "gi"), "///");
      let payload = {
        stb_ip: this.static_ip,
        stb_mac: this.stb_mac,
        msg: msg,
      };
      console.log("回傳訊息 JSON: ", JSON.stringify(payload));
      this.$store.dispatch("user/lodPostMsg", payload);
    },
    handlePost(data) {
      console.log(JSON.stringify(data));

      if (data.msg !== "Msg be submit") {
        clearInterval(this.inter);

        this.$swal({
          text: "回覆失敗!",
          icon: "error",
          animation: false,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
    handleEvent(eventSource) {
      let evData = eventSource.loginData;
      let isHome = eventSource.isHome;
      if (evData !== "logout") {
        this.$refs.navEvent.loginData(evData);
        // this.$refs.footerEvent.loginData(evData);
      } else if (evData === "logout") {
        this.$refs.navEvent.signout(evData, isHome);
      }
    },
    loading() {
      // 建議做成 componet 不依賴 Event Bus
      this.loadingEl = this.$loading.show({
        isFullPage: this.fullPage,
        canCancel: false,
        loader: "dots",
        color: "orange",
        opacity: 0.3,
      });
      this.ApiDelay();
    },
    loadClose() {
      this.loadingEl.hide(); // 關閉 loading
      clearTimeout(this.timeOut);
    },
    ApiDelay() {
      this.timeOut = setTimeout(() => {
        this.loadingEl.hide(); // 關閉 loading
        this.$swal({
          text: "很抱歉，伺服器連線逾時...",
          icon: "error",
          animation: false,
          timer: 1500,
          showConfirmButton: false,
        });
        clearTimeout(this.timeOut);
      }, 80 * 60 * 1000);
      // 串 API 延遲 80 分鐘 後處理
    },
    interRunner() {
      this.sec = 15; //改 15s ping 一次
      this.pingIpCommand();
    },
    pingIpCommand() {
      let inter = null;
      inter = setInterval(() => {
        clearInterval(inter);
        this.interRunner();
        this.ping();
      }, this.sec * 1000);
    },
    ping() {
      if (window.IpExecute !== undefined) {
        let str = "";
        str = window.IpExecute.pingIpCommand();
        if (str != "") {
          this.$eventBus.$emit("internetStatus", str);
        }
      }
    },
    extraTime() {
      this.reInterSec += 60; // 每次增加 60s
    },
    checkReservedApp(email) {
      // timeout 故重複串接預約 API
      let times = 1;
      this.reInterval = setInterval(() => {
        console.log("Do re check! Check times", times);
        this.$store.dispatch("class/courseList", `${email}`); // 課程資料
        if (times === 10) {
          // 10 次後則停止串接
          console.log("Stop re check reserve. Check times", times);
          this.loadClose();
          clearInterval(this.reInterval);
        } else {
          times++;
        }
      }, this.reInterSec * 1000);
    },
    rightCickBack() {
      if (this.disabledList.includes(this.$route.name)) return;
      this.loadClose();
      this.$router.go(-1);
    },
  },
  created() {
    window["rightCickBack"] = this.rightCickBack;
    this.$eventBus.$on("loading", () => {
      this.loading();
    });
    this.$eventBus.$on("loadClose", () => {
      this.loadClose();
    });
    this.$eventBus.$on("checkReservedApp", (payload) => {
      if (payload.stop) {
        console.log("Stop Re Check Reserve.");
        clearInterval(this.reInterval);
      } else if (!payload.stop) {
        // 重串
        console.log("Re Check Reserve.");
        this.checkReservedApp(payload.email);
      }
    });
  },
  mounted() {
    this.getMsg(); //* 3 秒需觀察是否有負擔?
    this.pingIpCommand();
  },
  beforeDestroy() {
    this.$eventBus.$off("checkReservedApp");
  },
};
</script>