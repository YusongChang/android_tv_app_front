<template>
  <v-container id="navBar" fluid v-if="show">
    <v-app-bar app color="orange">
      <v-toolbar color="orange" flat dark>
        <!-- <router-link
          to="/classlist"
          class="display-1 font-weight-black"
          style="text-decoration: none; color: white"
        >
         <v-img src="../assets/logo.png" height="30%" width="30%"></v-img>
          <v-img src="../assets/img/logo.png"></v-img>
       </router-link>
         -->
        <v-spacer></v-spacer>
        <v-btn
          text
          rounded
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
        >
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <!-- <v-text-field label="Search" prepend-icon="search" rounded class="mt-6">
        </v-text-field>
        <v-spacer></v-spacer>
         -->
        <div v-if="username">
          <!-- <v-avatar class="ml-2 border" size="45">
            <v-img src="../assets/logo.png"></v-img>
          </v-avatar> -->
          <v-avatar class="ml-2 border" size="45">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          <!-- material-design-icon font use, modify src/plugins/vuetify.js setting update: 2021/9/3 -->
          {{ username }}
          <v-btn rounded text small @click="signout()"
            ><v-icon left>lock</v-icon>登出</v-btn
          >
        </div>
        <div v-else>
          <!-- <v-avatar class="ml-2 border" size="45">
            <v-img src="../assets/img/logo.png"></v-img>
          </v-avatar> -->
          noLogin
          <v-btn rounded text small to="/user/login"
            ><v-icon left>lock_open</v-icon>登入</v-btn
          >
        </div>
      </v-toolbar>
    </v-app-bar>

    <!-- rwd left side menu -->
    <v-navigation-drawer
      class="d-xl-none d-lg-flex"
      v-model="sideBar"
      app
      temporary
    >
      <v-card color="orange" flat tile>
        <v-list>
          <!-- <v-text-field label="Search" prepend-icon="search" rounded>
          </v-text-field>
           <v-list-item>
            <div class="display-1 font-weight-black white--text">超級函授</div>
          </v-list-item> -->
          <v-list-item dark>
            <v-list-item-content>
              <v-list-item-title>
                <div v-if="username">
                  <!-- <v-avatar class="mr-2 border" size="60">
                    <v-img src="../assets/logo.png"></v-img>
                  </v-avatar> -->
                  <v-avatar class="ml-2 border" size="45">
                    <v-icon>mdi-account-circle</v-icon>
                  </v-avatar>
                  <!-- material-design-icon font use, modify src/plugins/vuetify.js setting update: 2021/9/3 -->
                  {{ username.substring(0, 4) + "..." }}
                  <v-btn rounded text small @click="signout()"
                    ><v-icon left>lock</v-icon>登出</v-btn
                  >
                </div>
                <div v-else>
                  <!-- <v-avatar class="mr-2 border" size="60">
                    <v-img src="../assets/img/logo.png"></v-img>
                  </v-avatar> -->
                  noLogin
                  <v-btn rounded text small to="/user/login"
                    ><v-icon left>lock_open</v-icon>登入</v-btn
                  >
                </div>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-list dense nav>
        <v-list-item
          color="orange"
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="volumeControl">
          <v-list-item-icon>
            <v-icon>mdi-volume-high</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> 音量控制 </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- rwd top navbar header -->
    <div class="d-xl-none d-lg-flex">
      <v-app-bar app color="orange">
        <v-row>
          <v-col cols="12" lg="12">
            <v-card color="orange" flat>
              <v-toolbar color="orange" flat dark>
                <v-app-bar-nav-icon @click="sideBar = !sideBar">
                </v-app-bar-nav-icon>
                <v-spacer></v-spacer>
                <v-toolbar-title>
                  <!--  <router-link to="/">
                  <v-img src="../assets/img/logo.png"></v-img>
                  </router-link>-->
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </v-card>
          </v-col>
        </v-row>
      </v-app-bar>
    </div>

    <v-dialog v-model="goBackDialog" max-width="290">
      <v-card>
        <v-card-title class="justify-end pt-1 pr-1">
          <v-btn
            color="red"
            text
            fab
            small
            @click="goBackDialog = !goBackDialog"
          >
            <i class="mdi mdi-close red--text" style="font-size: 2em"></i>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="text-h5 text-center">要返回上一頁嗎?</div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="green darken-1" class="white--text" @click="goBack">
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Cookie, DateFormat } from "../composition_api";

export default {
  data: () => ({
    goBackDialog: false,
    menuItems: [
      { title: "我的課程", path: "/classlist", icon: "mdi-book" },
      { title: "看課專區", path: "/user", icon: "mdi-home" },
    ],
    backTopShow: false,
    sideBar: false,
    loginItem: JSON.parse(sessionStorage.getItem("user")),
    username: null,
    timeRunner: false,
    randomCheckTimer: null,
    show: false,
    hasWaterMark: true,
    isChecked: true,
    isDeduct: true,
    autoPlay: false,
    settingData: {},
    stb_ip: null,
    static_ip: null,
    stb_mac: null,
    fullPage: true,
    loadingEl: null,
  }),
  computed: {
    ...mapGetters({
      getBranchLogout: "login/getBranchLogout",
    }),
  },
  watch: {
    getBranchLogout(data) {
      this.handleLogout(data);
    },
  },
  methods: {
    ...mapActions({
      logout: "login/logout",
    }),
    init() {
      window.backDialog = this.backDialog;
      this.settingData = JSON.parse(Cookie.readCookie("setting") || null);
      this.stb_ip = this.settingData.stb_ip;
      this.static_ip = this.settingData.static_ip;
      this.stb_mac = this.settingData.stb_mac;
      if (this.loginItem) {
        this.username = this.loginItem.name;
        this.show = sessionStorage.getItem("navShow");
        this.loginData(null);
      }
    },
    loginData(username) {
      // 父組件傳入登入事件
      this.loginState(username);
    },
    loginState(username = null) {
      console.log(username);
      //修正登入後頁面被刷新才能拿到 sessionStorage 之問題
      if (username) {
        this.username = username;
        this.show = true;
        window.sessionStorage.setItem("navShow", this.show);
        this.$router.push({ name: "ClassList" });
      }
      this.autoCheckLeftTime(); // 登入後、頁面重整檢查時段
    },
    autoCheckLeftTime() {
      // 檢查時段剩餘時間 Ex: 9時10分 ~ 10時10分 一小時一個時段

      console.log("~檢查時段~!");

      let mins = DateFormat.timeFormat(new Date(), "i");
      let secs = DateFormat.timeFormat(new Date(), "s");

      this.hasWaterMark = true;
      this.isChecked = true;

      if (70 - mins <= 20) {
        //目前 XX 時 50 分 距離下個時段剩 20 分
        mins = 70 - mins;
      } else if (10 - mins > 0) {
        //目前距離下個時段 XX 時 10 分剩餘時間
        mins = 10 - mins;
      } else {
        mins = 50 - mins; // 超過  XX 時 10 分，給 <= 50 分鐘不需檢查、浮水印
        this.hasWaterMark = false;
        this.isChecked = false;
      }

      //* 測試
      // this.isChecked = true;
      // this.hasWaterMark = true;
      // mins = 0;
      // secs = 30;

      this.sandglass(mins, secs);
    },
    sandglass(mins, secs) {
      // 倒數用
      let time = "";
      secs = 60 - secs;

      console.log("倒數計時開始: " + mins + ":" + secs);

      this.timeRunner = setInterval(() => {
        // 時間補0
        let minZero = 0;
        let secZero = 0;

        if (mins > 0) {
          if (secs === 0) {
            // 過了 1 分鐘
            secs = 60;
            mins--;
          }
        }

        if (secs > 0) {
          secs--;
        }

        if (mins < 10) minZero = 0;
        else minZero = "";
        if (secs < 10) secZero = 0;
        else secZero = "";

        time = `${minZero}${mins} : ${secZero}${secs}`;

        console.log(time);

        if (this.hasWaterMark) this.$eventBus.$emit("leftTime", time); // 傳遞浮水印

        if (mins === 0 && secs === 0) {
          clearInterval(this.timeRunner);
          this.$eventBus.$emit("leftTime", null);
          this.timeRunner = false;
          //若需檢查則補幾分鐘再檢查預約
          if (this.isChecked) this.randomCheck();
          else this.autoCheckLeftTime();
        }
      }, 1000);
    },
    randomCheck() {
      // 10~15 分鐘任一時間點後再檢查
      let time = "";
      let randMins = Math.floor(Math.random() * 5) + 10;
      let secs = 60;

      // randMins = 0; //* 測試
      // secs = 10; //* 測試

      this.randomCheckTimer = setInterval(() => {
        let minZero = 0;
        let secZero = 0; // 時間補0

        if (randMins > 0) {
          if (secs === 0) {
            // 過了 1 分鐘
            secs = 60;
            randMins--;
          }
        }
        if (secs > 0) {
          secs--;
        }
        if (randMins < 10) minZero = 0;
        else minZero = "";
        if (secs < 10) secZero = 0;
        else secZero = "";

        time = `${minZero}${randMins} : ${secZero}${secs} 後扣點`;
        console.log(time);

        // if (this.hasWaterMark) this.$eventBus.$emit("leftTime", time); // 傳遞浮水印

        if (randMins === 0 && secs === 0) {
          this.$eventBus.$emit("leftTime", null);
          this.$eventBus.$emit("checkReserved");
          clearInterval(this.randomCheckTimer);
          this.autoCheckLeftTime(); // 重設計時器
        }
      }, 1000);
    },
    signout(isHome = false) {
      this.username = null;
      this.show = false;
      sessionStorage.clear();
      clearInterval(this.timeRunner);
      clearInterval(this.randomCheckTimer);
      this.logout(isHome);
      const data = {
        stb_ip: this.stb_ip,
        stb_mac: this.stb_mac,
      };
      this.$store.dispatch("login/branchLogout", data);
      if (this.$route.name !== "Home") this.$router.push({ path: "/" });
    },
    handleLogout() {
      console.log("已從中華電信成功登出!");
      // this.$swal({
      //   text: "成功登出",
      //   icon: "success",
      //   timer: 1200,
      //   showConfirmButton: false,
      //   allowOutsideClick: false,
      // });
      // this.$router.push({ path: "/" });
    },
    volumeControl() {
      if (window.VolumeHandler !== undefined) {
        window.VolumeHandler.volumeControl();
      }
    },
    rightClick() {
      // android 左鍵或右鍵長按一秒會觸發此功能
      window.oncontextmenu = function () {
        this.backDialog();
      };
    },
    backDialog() {
      if (!this.disabledList.includes(this.$route.name))
        this.goBackDialog = true;
    },
    loading() {
      this.$eventBus.$emit("loading"); // 發出 loading 需求
    },
    closeLoading() {
      this.$eventBus.$emit("loadClose"); // 發出關閉 loading
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.borderLeft {
  border-radius: 50px 0px 50px 0px !important;
}
.borderRight {
  border-radius: 0px 50px 0px 50px !important;
}
.borderSide {
  border-radius: 0px 50px 50px 0px !important;
}
.borderMiniCart {
  border-radius: 50px 0px 0px 50px !important;
}
.borderAll {
  border-radius: 50px 50px 50px 50px !important;
}
.borderBottom {
  border-radius: 0px 0px 50px 50px !important;
}
.border {
  border: 2px solid white !important;
}
</style>
