<template>
  <v-footer id="footer" color="orange" v-if="show">
    <v-row justify="center" alig="center" no-gutters>
      <v-col cols="12" class="text-center white--text">
        <div>IP {{ ipAddr }}</div>
        <div>ver. {{ ver }}</div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import { Cookie } from "../composition_api";

export default {
  data: () => ({
    loginItem: JSON.parse(sessionStorage.getItem("user")),
    settingData: JSON.parse(Cookie.readCookie("setting") || null),
    show: false,
    ipAddr: null,
    ver: "1.0",
  }),
  methods: {
    init() {
      if (this.loginItem) {
        this.show = sessionStorage.getItem("footerShow");
      }
      
      if (this.settingData) this.ipAddr = this.settingData.stb_ip;

      console.log("JS 調用安卓 getIpCookie", this.ipAddr);
    },
    loginData(username) {
      // 父組件傳入登入事件
      if (username) {
        this.show = true;
        window.sessionStorage.setItem("footerShow", this.show);
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
