<template>
  <div id="wrapper">
    <!-- js 時間，未來須抓到 android ntp 時間 -->
    <div id="dateTime">{{ dateTime }}</div>
    <img
      src="../assets/img/enterBtn_unhover.png"
      alt=""
      id="enter-btn"
      @click="showLogin"
    />

    <v-btn
      id="volume-btn"
      class="trans-background"
      fab
      x-large
      @click="mediaSetting"
    >
      <v-icon id="volume-icon" color="grey lighten-2"
        >mdi-music-note-bluetooth</v-icon
      >
    </v-btn>

    <v-btn
      id="setting-btn"
      class="trans-background"
      fab
      small
      @click="showSetting"
    >
    </v-btn>

    <span id="apk-ver" class="white--text">APP 版本: {{ appVersion }}</span>

    <div id="web-link-block">
      <v-row>
        <v-col cols="6">
          <v-col class="pb-0">
            <v-btn
              @click="openApp('superCourse')"
              id="super-course-btn"
              class="px-0"
              small
            ></v-btn>
          </v-col>
          <v-col>
            <v-btn
              @click="openApp('gold')"
              id="gold-course-btn"
              class="px-0"
              small
            ></v-btn>
          </v-col>
        </v-col>
        <v-col cols="6">
          <v-col class="pb-0">
            <v-btn
              @click="openApp('high')"
              id="hight-course-btn"
              class="px-0"
              small
            ></v-btn>
          </v-col>
          <v-col>
            <v-btn
              @click="linkUrl('superTest')"
              id="super-test-btn"
              class="px-0"
              small
            ></v-btn>
          </v-col>
        </v-col>
      </v-row>
    </div>
    <v-banner stage-line class="stab-infor text-center white--text text-h6">
      <span class="mr-2">IP: {{ static_ip_str }}</span>
    </v-banner>
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <v-toolbar color="warning" dark>
          <v-btn dark small color="secondary" @click="reloadApp">
            重整鍵盤
          </v-btn>
          <v-toolbar-title class="ml-auto mr-auto">
            <v-icon> mdi-account </v-icon>
            學員登入
          </v-toolbar-title>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title></v-card-title>
        <v-card-text>
          <v-text-field
            v-model="email"
            :rules="[rules.required]"
            label="Account帳號"
            prepend-inner-icon="person"
            filled
            rounded
            color="success"
            type="text"
            autofocus
          />
          <v-text-field
            :rules="[rules.required]"
            v-model="password"
            label="Password密碼"
            prepend-inner-icon="lock"
            filled
            rounded
            color="success"
            type="password"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="warning" @click="login()"> 登入 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="setting" persistent max-width="600">
      <v-card>
        <v-toolbar color="#46b8b6" dark class="mb-3">
          <v-btn small dark color="secondary" @click="reloadApp">
            重整鍵盤
          </v-btn>
          <v-toolbar-title class="ml-auto mr-auto"> 輸入密碼 </v-toolbar-title>
          <v-btn icon dark @click="setting = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            :rules="[rules.required]"
            v-model="settingPwd"
            label="Password密碼"
            prepend-inner-icon="lock"
            filled
            rounded
            color="success"
            type="password"
            autofocus
          />
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn depressed dark color="#46b8b6" @click="confirm"> 確認 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="settingPanel" fullscreen persistent max-width="600">
      <v-card>
        <v-toolbar color="#46b8b6" dark class="mb-3">
          <v-toolbar-title class="ml-auto mr-auto">
            <v-icon> mdi-cog-outline </v-icon>
            設定
          </v-toolbar-title>
          <v-btn icon dark @click="closeSettings">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-subtitle class="font-weight-bold black--text">
          MAC: {{ stb_mac }}
        </v-card-subtitle>
        <v-card-subtitle class="font-weight-bold black--text">
          Public IP: {{ stb_ip }}
        </v-card-subtitle>
        <v-card-subtitle class="font-weight-bold black--text">
          <span class="mr-2">本機 IP: {{ static_ip }}</span>
        </v-card-subtitle>
        <v-card-subtitle
          v-if="isReloadBtn"
          class="font-weight-bold black--text"
        >
          <v-row>
            <v-col cols="12" xl="3" lg="12" md="12" sm="12">
              <v-alert
                dense
                outlined
                border="left"
                type="warning"
                class="text-center"
              >
                網路設置已變更請刷新頁面
                <v-icon
                  id="settings-reload-btn"
                  color="success"
                  @click="refreshApp"
                >
                  mdi-refresh
                </v-icon>
              </v-alert>
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-card-subtitle class="d-flex justify-center">
          <v-card
            color="#46b8b6"
            max-width="344"
            class="mr-8 setting-panel-btn"
            link
            @click="ethernetSettings"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  網路設定
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card
            color="#46b8b6"
            max-width="344"
            class="mr-8 setting-panel-btn"
            link
            @click="openWifiSettings"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  Wi-Fi 設定
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card
            color="#46b8b6"
            max-width="344"
            class="mr-8 setting-panel-btn"
            link
            @click="screenSettings"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  螢幕縮放
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card
            color="#46b8b6"
            max-width="344"
            class="mr-8 setting-panel-btn"
            link
            @click="resolutionSettings"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  螢幕解析
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card
            color="#46b8b6"
            max-width="344"
            class="mr-8 setting-panel-btn"
            link
            @click="generalSettings"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  一般設定
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card
            color="#46b8b6"
            max-width="344"
            class="mr-8 setting-panel-btn"
            link
            @click="mainSettings"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  系統設定
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card
            color="#46b8b6"
            max-width="344"
            class="mr-8 setting-panel-btn"
            link
            @click="checkUpdate"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  APK 更新
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card
            color="#46b8b6"
            max-width="344"
            class="setting-panel-btn"
            link
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  OTA 更新
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-card-subtitle>
        <v-card-subtitle class="my-12 font-weight-bold black--text text-center">
          APK ver: {{ appVersion }}
        </v-card-subtitle>
        <v-card-subtitle class="my-12 font-weight-bold">
          <div id="web-link-block" style="left: 0">
            <v-row>
              <v-col cols="2">
                <v-col class="pb-0">
                  <v-btn
                    @click="linkUrl('youtube')"
                    id="youtub-link"
                    class="px-0"
                    normal
                  />
                </v-col>
                <!-- <v-col>
                  <v-btn
                    @click="linkUrl('gold')"
                    id="gold-course-btn"
                    class="px-0"
                    small
                  ></v-btn>
                </v-col> -->
              </v-col>
              <!-- <v-col cols="2">
                <v-col class="pb-0">
                  <v-btn
                    @click="linkUrl('high')"
                    id="hight-course-btn"
                    class="px-0"
                    small
                  ></v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    @click="linkUrl('superTest')"
                    id="super-test-btn"
                    class="px-0"
                    small
                  ></v-btn>
                </v-col> 
               </v-col> -->
            </v-row>
          </div>
        </v-card-subtitle>
      </v-card>
      <!-- <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title class="ml-auto mr-auto">
            <v-icon> mdi-cog-outline </v-icon>
            網路設定
          </v-toolbar-title>
          <v-btn icon dark @click="setting = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title></v-card-title>
        <v-card-subtitle class="font-weight-bold black--text">
          MAC: {{ stb_mac }}
        </v-card-subtitle>
        <v-card-subtitle class="font-weight-bold black--text">
          Public IP: {{ stb_ip }}
        </v-card-subtitle>
        <v-card-subtitle class="black--text">
          <v-tabs v-model="tabs">
            <v-radio-group v-model="netChecked" row>
              <v-tab
                ><v-radio label="DHCP" value="dhcp" class="mx-0"></v-radio
              ></v-tab>
              <v-tab
                ><v-radio label="Static" value="static" class="mx-0"></v-radio
              ></v-tab>
            </v-radio-group>
          </v-tabs>
        </v-card-subtitle>
        <v-card-subtitle>
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-card-text class="text-xl-subtitle-1 black--text"
                >IP 位址 : {{ static_ip }}
              </v-card-text>
              <v-card-text class="text-xl-subtitle-1 black--text"
                >子網路遮罩: {{ subnet_mask }}
              </v-card-text>
              <v-card-text class="text-xl-subtitle-1 black--text"
                >預設閘道: {{ gateway }}
              </v-card-text>
              <v-card-text class="text-xl-subtitle-1 black--text"
                >主要DNS: {{ main_dns }}
              </v-card-text>
              <v-card-text class="text-xl-subtitle-1 black--text"
                >次要DNS: {{ sec_dns }}
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text>
                <v-text-field
                  v-model="static_ip"
                  :rules="[rules.required]"
                  label="固定 IP"
                  color="success"
                  type="text"
                  autofocus
                />
                <v-text-field
                  v-model="subnet_mask"
                  :rules="[rules.required]"
                  label="子網路遮罩"
                  color="success"
                  type="text"
                />
                <v-text-field
                  v-model="gateway"
                  :rules="[rules.required]"
                  label="預設閘道"
                  color="success"
                  type="text"
                />
                <v-text-field
                  v-model="main_dns"
                  :rules="[rules.required]"
                  label="主要DNS"
                  color="success"
                  type="text"
                />
                <v-text-field
                  v-model="sec_dns"
                  :rules="[rules.required]"
                  label="次要DNS"
                  color="success"
                  type="text"
                />
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed dark color="primary darken-1" @click="save()">
              儲存
            </v-btn>
          </v-card-actions>
        </v-card-subtitle>
      </v-card> -->
    </v-dialog>

    <!-- rwd left side menu -->
    <v-navigation-drawer class="d-lg-flex" v-model="sideBar" app temporary>
      <v-list dense nav>
        <v-list-item color="orange" link @click="volumeControl">
          <v-list-item-icon>
            <v-icon>mdi-volume-high</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="">音量控制</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item color="orange" link @click="bluetoothOnOff">
          <v-list-item-icon>
            <v-icon> {{ bluetoothIcon }} </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="">
              {{ buletoothStatus }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          color="orange"
          link
          @click="seekBluetooth"
          v-if="disBluetooth"
        >
          <v-list-item-icon>
            <v-icon>mdi-bluetooth-settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class=""> 搜尋藍牙 </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Cookie, DateFormat } from "../composition_api";

export default {
  data: () => ({
    appVersion: "",
    dateTime: null,
    tabs: 0,
    netChecked: "dhcp",
    dialog: false,
    settingPwd: "",
    setting: false,
    settingPanel: false,
    school: "",
    stb_ip: null, // external ip
    stb_mac: "", //* 80-C1-6E-F3-E7-6A 測試用
    static_ip: "192.168.10.",
    static_ip_str: "",
    photo: "",
    courseDep: "",
    courseYear: "",
    testCategory: "",
    class: "",
    course: "",
    pointsText: "",
    reservationTime: "",
    isCrossReservation: "",
    isPaid: "",
    isAppliedBook: "",
    studentId: "0",
    createXmlCount: 0,
    subnet_mask: "",
    gateway: "",
    main_dns: "",
    sec_dns: "",
    email: "", //* B180809170 is dead ， J105401560/00000、Z12148313/0000 sign in temp use and
    password: "",
    username: "",
    token: "",
    hid: "",
    favors: [],
    rules: {
      required: (value) => !!value || "欄位必填.",
      MacRequired: (value) => !!value || "無法辨認 MAC address",
      counter: (value) => value.length >= 5 || "須至少 5 碼",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "e-mail 格式錯誤.";
      },
    },
    openSettingPanel: false,
    settingData: null,
    sideBar: false,
    volume: 0,
    VolumeHandler: null,
    disBluetooth: false,
    BluetoothHandler: null,
    bluetoothOn: null,
    bluetoothIcon: "",
    buletoothStatus: "",
    isReloadBtn: false,
    schoolCode: "",
  }),
  computed: {
    ...mapGetters({
      getLoginAuth: "login/getLoginAuth",
      getValidated: "user/getValidated",
      getCourseList: "class/getCourseList",
      getCourseEpisode: "class/getCourseEpisode",
      getCourseSubject: "class/getCourseSubject",
      getReserveCross: "user/getReserveCross",
      getReserveDetail: "user/getReserveDetail",
      getReserveDetailXML: "user/getReserveDetailXML",
      getPoint: "user/getPoint",
      getStudentPhoto: "user/getStudentPhoto",
      getInforLogin: "login/getInforLogin",
      getInforBranch: "login/getInforBranch",
      getBranchCodeRetval: "login/getBranchCodeRetval",
      getSchoolCode: "login/getSchoolCode",
    }),
  },
  watch: {
    getLoginAuth: {
      handler: function (data) {
        console.log("Watch getter: ", JSON.stringify(data));
        this.handleLogin(data);
      },
      deep: true,
    },
    getValidated(data) {
      this.validated(data);
    },
    getCourseList(data) {
      this.handleReserved(data.Courses);
    },
    getCourseEpisode(data) {
      this.handleCode(data);
    },
    getCourseSubject(data) {
      this.handletList(data);
    },
    getReserveCross(data) {
      this.handleReserveCross(data);
    },
    getReserveDetail(data) {
      this.handleReserveDetail(data);
    },
    getReserveDetailXML(data) {
      this.handleReserveDetailXML(data);
    },
    getPoint(data) {
      this.handlePoint(data);
    },
    getInforLogin(data) {
      this.handleInfor(data);
    },
    getInforBranch(data) {
      this.handleBranch(data);
    },
    getStudentPhoto(data) {
      this.handleStudPhoto(data);
    },
    tabs: function () {
      this.selectNetSet();
    },
    getBranchCodeRetval(data) {
      this.handleCodeRetval(data);
    },
    getSchoolCode(data) {
      this.handleDepCode(data);
    },
  },
  methods: {
    init() {
      this.openSettingPanel = window.sessionStorage.getItem("openSettings")
        ? true
        : false;
      if (this.openSettingPanel) this.showSettingPanel();
    },
    clock() {
      let today = new Date();
      let Localdate = DateFormat.localDate(today, true);
      this.dateTime = Localdate + " " + DateFormat.timeFormat(today, "h:i:s");
      setTimeout(this.clock, 500);
    },
    getAppVersion() {
      if (window.AppUpdate !== undefined) {
        this.appVersion = window.AppUpdate.getLocalVersion();
      }
    },
    selectNetSet() {
      if (this.tabs === 0) {
        this.netChecked = "dhcp";
      } else {
        this.netChecked = "static";
      }
    },
    getMacAddress() {
      // 網卡 MAC -- 載入 APP 抓取
      if (window.MacAddress !== undefined) {
        let mac = window.MacAddress.getMacAddress();
        mac = mac.replace(/:/g, "-"); //In older browser
        this.stb_mac = mac;
        if (this.stb_mac) {
          this.getIPAddress();
        }
      } else {
        this.$swal({
          text: "無法取得乙太網路實體位址",
          icon: "error",
          animation: false,
          timer: 1500,
          showConfirmButton: true,
        });
      }
    },
    getExternalIP(ip) {
      // 外網公開 IP -- 載入 APP 抓取
      this.stb_ip = ip;
      this.save(); // 儲存 IP 資料
    },
    getIPAddress() {
      //機上盒 IP
      if (window.IPAddress !== undefined) {
        this.static_ip = window.IPAddress.getIPAddress(true);
        this.static_ip_str = this.static_ip;
      }

      if (this.static_ip === "無法取得") {
        this.isReloadBtn = true;
      }
    },
    getNetmask() {
      if (window.IPAddress !== undefined) {
        this.subnet_mask = window.IPAddress.getNetmask();
      }
    },
    getGateway() {
      //機上盒 Gateway
      if (window.IPAddress !== undefined) {
        this.gateway = window.IPAddress.getGateway();
      }
    },
    getMainDNS() {
      //機上盒 Main DNS
      if (window.IPAddress !== undefined) {
        this.main_dns = window.IPAddress.getMainDNS();
      }
    },
    getSecDNS() {
      //機上盒 Secondary DNS
      if (window.IPAddress !== undefined) {
        this.sec_dns = window.IPAddress.getSecDNS();
      }
    },
    mediaSetting() {
      // 媒體設定
      this.sideBar = !this.sideBar;
    },
    volumeHandler() {
      if (window.VolumeHandler !== undefined) {
        this.VolumeHandler = window.VolumeHandler;
        this.VolumeHandler.resetVolume();
      }
    },
    volumeControl() {
      this.VolumeHandler.volumeControl();
    },
    getVolume() {
      //* 取得系統媒體音量
      this.volume = this.VolumeHandler.getVolume();
    },
    bluetoothHandler() {
      if (window.BluetoothHandler !== undefined) {
        this.BluetoothHandler = window.BluetoothHandler;
        this.BluetoothHandler.unpairDevice(); // 清除上次配對
        this.bluetoothOn = "true" === this.BluetoothHandler.getOnOff(); // 藍牙開關狀態
        this.disBluetooth = this.bluetoothOn; // 藍牙關閉時暫停使用
        this.buletoothState();
      }
    },
    bluetoothOnOff() {
      this.loading();
      this.BluetoothHandler.onOff(); //調用 Android
    },
    bluetoothOnOffReceiver(onOff) {
      // 接收藍牙開關狀態回傳
      this.bluetoothOn = "true" === onOff; // 藍牙開關狀態
      this.buletoothState();
      this.disBluetooth = this.bluetoothOn; // 解除
      this.closeLoading(); // 發出關閉 loading
    },
    buletoothState() {
      this.buletoothStatus = this.bluetoothOn ? "關閉藍牙" : "開啟藍牙";
      this.bluetoothIcon = this.bluetoothOn
        ? "mdi-bluetooth"
        : "mdi-bluetooth-off";
    },
    seekBluetooth() {
      if (window.SettingsCall !== undefined) {
        window.SettingsCall.settings("bluetooth");
      }
    },
    checkUpdate() {
      if (window.AppUpdate !== undefined) {
        window.AppUpdate.CheckUpdate(true);
      }
    },
    windowFunction(funcArr) {
      // 將函式註冊至 window 類別中供 android 調用
      if (Array.isArray(funcArr)) {
        funcArr.forEach((func) => {
          window[func.name] = func.func;
        });
      } else {
        console.log("Window function added error, none Array expected.");
      }
    },
    showSetting() {
      this.setting = true;
    },
    showSettingPanel() {
      this.settingPanel = true;
    },
    confirm() {
      if (this.settingPwd === "6837") {
        this.setting = false;
        this.settingPanel = true;
        this.settingPwd = null;
        window.sessionStorage.setItem("openSettings", true);
      } else {
        this.$swal({
          text: "密碼錯誤",
          icon: "error",
          animation: false,
          timer: 1500,
        });
      }
    },
    closeSettings() {
      // android 右鍵可觸發關閉
      this.settingPanel = false;
      window.sessionStorage.removeItem("openSettings");
      this.save(); // 關閉重新儲存設定
    },
    save() {
      // 儲存設定
      // 溪湖分校 59.120.78.34 斗六 220.134.127.146 彰化雷爵 114.42.217.54
      // this.stb_ip = "220.134.127.146"; //* */
      // this.stb_mac = "80-C1-6E-F3-E7-6A";
      // this.static_ip = "192.168.2.137";

      if (this.stb_ip) {
        this.settingData = JSON.stringify({
          stb_ip: this.stb_ip,
          stb_mac: this.stb_mac,
          static_ip: this.static_ip,
        });
        // console.log(this.settingData);
        Cookie.setCookie(this.settingData);
      }
    },
    showLogin() {
      this.dialog = !this.dialog; //* 正式時開放
    },
    login() {
      this.$emit("pageEvent", { loginData: "logout", isHome: true }); // 先清除遺留的登入資料

      this.email = this.email.trim();
      this.email = this.email.toUpperCase();
      this.password = this.password.trim();
      this.username = this.email;
      this.loading(); // 發出 loading 需求
      this.userValidate();

      // tekom API login
      // if (this.email && this.password) {
      //   let xmls =
      //     '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">' +
      //     "<soapenv:Header/>" +
      //     "<soapenv:Body>" +
      //     "<PMBSTDLOD01.Execute xmlns='CEK'>" +
      //     "<Studentpid>" +
      //     this.email +
      //     "</Studentpid>" +
      //     "<Studentpwd>" +
      //     this.password +
      //     "</Studentpwd>" +
      //     "</PMBSTDLOD01.Execute>" +
      //     "</soapenv:Body>" +
      //     "</soapenv:Envelope>";

      //   this.$store.dispatch("login/login", xmls);

      //   this.loading(); // 發出 loading 需求
      // } else {
      //   this.$swal({
      //     text: "有欄位未填寫，請檢查",
      //     icon: "error",
      //     animation: false,
      //     timer: 1500,
      //     showConfirmButton: true,
      //   });
      // }
    },
    handleLogin(data) {
      let success = false;
      let text = "";
      // tc 提供
      if (data.username === undefined) {
        text = "無此帳號!";
      } else if (data.auth !== "Y") {
        text = "帳密有誤，請檢查!";
      } else {
        if (data.username) {
          success = !success;
          this.username = data.username;
          this.userValidate();
        }
      }

      if (!success) {
        this.loginFailed(text);
      }
    },
    userValidate() {
      // if (this.stb_ip === null) this.stb_ip = "59.120.78.34"; //* 測試 斗六 220.134.127.146、124.10.224.95 & 118.163.172.103(志光)  溪湖 59.120.78.34
      // this.stb_ip = "220.134.127.146"; //* */
      if (this.stb_ip !== null) {
        console.log("user validating.");
        let xmls = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
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
      } else {
        this.loginFailed("無法連線，請檢查網路!");
      }
    },
    validated(data) {
      if (
        data.Envelope.Body["PBNSTDData.ExecuteResponse"].Studentpwd.__text ===
        this.password
      ) {
        console.log("user validated.");
        this.checkReserved();
      } else {
        // IP 位址未被認證
        this.loginFailed("無訪問權限");
      }
    },
    checkReserved() {
      // 查看是否預約
      this.$store.dispatch("class/courseList", `${this.email}`); // 課程資料
    },
    handleReserved(data) {
      if (
        data.VldSub !== undefined &&
        data.VldSub === "Y" &&
        data.OnBranch !== "N"
      ) {
        //* Y 有預約 N 沒預約
        //取分校名: N = 沒分校
        this.school = data.OnBranch.replace("Y", "");
        this.branchCodeRetval();
      } else {
        this.loginFailed("您尚未預約本時段");
      }
    },
    branchCodeRetval() {
      // 通知產生分校碼
      let bDate = DateFormat.localDate(new Date(), true);
      let eDate = bDate;
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
      <soapenv:header/>
      <soapenv:Body>
      <PMBSTDBULT02.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Bdate>${bDate}</Bdate>
      <Edate>${eDate}</Edate>
      </PMBSTDBULT02.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;

      this.$store.dispatch("login/branchCodeRetval", xmls);
    },
    handleCodeRetval(data) {
      if (data.retval !== undefined) {
        this.schoolCodeRetval();
      }
    },
    schoolCodeRetval() {
      this.$store.dispatch("login/schoolCode", this.email);
    },
    handleDepCode(data) {
      if (data.Bulletin !== undefined && data.Bulletin.Bultdata !== undefined) {
        this.schoolCode = data.Bulletin.Bultdata.BODepCode;
      } else {
        this.loginFailed("無法取得分校代碼，請洽櫃台!");
      }

      this.reserveCrossDetail(); //* 有錯誤暫時先放行
    },
    reserveCrossDetail() {
      // 學員跨區預約/學員未繳清/申領教材
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
      <soapenv:header/>
      <soapenv:Body>
      <tem:PMBSTD21.Execute>
      <tem:Studentpid>${this.email}</tem:Studentpid>
      <tem:Depcode>${this.schoolCode}</tem:Depcode>
      </tem:PMBSTD21.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;

      this.$store.dispatch("user/reserveCrossDetail", xmls);
    },
    handleReserveCross(data) {
      let rtncode =
        data.Envelope.Body["PMBSTD21.ExecuteResponse"].Rtncode.__text;
      let noneLocal =
        data.Envelope.Body["PMBSTD21.ExecuteResponse"].Nonelocal.__text;
      let nonePayeall =
        data.Envelope.Body["PMBSTD21.ExecuteResponse"].Nonepayeall.__text;
      let gotBookToday =
        data.Envelope.Body["PMBSTD21.ExecuteResponse"].Gotbooktoday.__text;

      if (rtncode === "Y") {
        // Y 帳號存在
        this.isCrossReservation = noneLocal === "Y" ? true : false;
        this.isPaid = nonePayeall === "Y" ? false : true;
        this.isAppliedBook = gotBookToday === "Y" ? true : false; //
        this.reserveDetail();
      } else if (rtncode === "X") {
        //  X 試聽帳號
        this.closeLoading();
        // Login 流程 OK 通知父層轉至課程列表頁
        window.sessionStorage.setItem(
          "user",
          JSON.stringify({
            email: this.email,
            name: this.email,
            pwd: this.password,
          })
        );
        window.sessionStorage.setItem("token", this.email);
        window.sessionStorage.setItem("userHid", this.email);
        this.$emit("pageEvent", { loginData: this.email });
      } else {
        this.loginFailed("無此帳號");
      }
    },
    reserveDetail() {
      // 學員代碼/教材申領相關/預約時段/考試別相關，產生 XML
      // this.stb_ip = "220.134.127.146"; //* */
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PMBSTD22.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Depcode>${this.schoolCode}</Depcode>
      </PMBSTD22.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      this.$store.dispatch("user/reserveDetail", xmls);
    },
    handleReserveDetail(data) {
      let retval = data.Envelope.Body["PMBSTD22.ExecuteResponse"].retval;

      if (retval !== undefined) {
        this.reserveDetailXML();
      }
    },
    reserveDetailXML() {
      // 取 XML
      this.$store.dispatch("user/reserveDetailXML", this.email);
    },
    handleReserveDetailXML(data) {
      if (data.Courses.Course !== undefined) {
        let courses = data.Courses;
        let courseData = courses.Course;

        this.studentId = courses.STUDENTID;
        this.reservationTime =
          courses.STUDENTAB !== "無預約" ? courses.STUDENTAB : "-";

        this.classStore = courseData.Class;
        this.courseStore = courseData.Course;
        this.CategoryStore = courseData.testCategory;

        if (Array.isArray(courseData.Class)) {
          this.class = courseData.Class.join(",");
          this.course = courseData.Course.join(",");
          this.testCategory = courseData.testCategory.join(",");
          this.courseYear = courseData.CourseYear.join(",");

          for (let i = 0; i < courseData.VDPoint.length; i++) {
            this.pointsText +=
              courseData.testCategory[i] + ":" + courseData.VDPoint[i] + ",";
          }

          this.pointsText = this.pointsText.substring(
            0,
            this.pointsText.length - 1
          );
        } else {
          this.class = courseData.Class;
          this.course = courseData.Course;
          this.testCategory = courseData.testCategory;
          this.courseYear = courseData.CourseYear;
          this.pointsText = courseData.VDPoint;
        }
      }
      if (this.studentId !== "") {
        this.studentPhoto();
      }
    },
    studentPhoto() {
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
          <soapenv:header/>
          <soapenv:Body>
          <PBNSTDPIC.Execute xmlns="CEK">
          <Studentid>${this.studentId}</Studentid>
          </PBNSTDPIC.Execute>
          </soapenv:Body>
          </soapenv:Envelope>
          `;
      this.$store.dispatch("user/studentPhoto", xmls);
    },
    handleStudPhoto(data) {
      let url =
        data.Envelope.Body["PBNSTDPIC.ExecuteResponse"].Rtnurl.toString(); // .__text 也可
      if (url !== undefined) {
        this.photo = url;
        this.inforLogin();
      }
    },
    inforLogin() {
      const user = {
        account: this.email,
        tenant_secret: "3kzJrOvDIJz5PfJnALvaj6IxxW775rNv", //* test machine : L4Flw7HFIKq0vFHpHDw7hucvWy78I5fQ 未來智基提供
      };
      this.$store.dispatch("login/inforLogin", user);
    },
    handleInfor(data) {
      console.log("inforLogin: ", data);
      if (data.user_token) {
        this.token = data.user_token;
        this.hid = data.user_hid;
        this.favors = JSON.stringify(data.my_favorites);
        this.inforBranch();
      } else {
        if (data.error === undefined) {
          data = { error: { message: "登入時發生錯誤" } };
          console.log(data);
        }
        this.loginFailed(data.error.message);
      }
    },
    inforBranch() {
      // if (this.stb_ip === null) this.stb_ip = "59.120.78.34"; //*  斗六 "220.134.127.146" 溪湖 59.120.78.34
      // this.stb_ip = "220.134.127.146"; //* */
      // this.stb_mac = "80-C1-6E-F3-E7-6A";
      // this.static_ip = "192.168.2.137";

      const userData = {
        stb_ip: this.static_ip,
        stb_mac: this.stb_mac, // 抓取機上盒網卡
        name: this.username,
        avatar_url: this.photo,
        barcode: this.studentId,
        school: this.school,
        year: this.courseYear, //*
        category: this.testCategory, //*
        subject: this.course, //*
        class: this.class, //*
        reservation_time: this.reservationTime, //* 若未用到可傳 "-"；改英文字母，智基未提供多個時段預約查詢； 格式: A,B,C,D
        points: this.pointsText, //* 多個考試別格式: "考試別1:20,考試別2:50"
        is_cross_reservation: this.isCrossReservation, //*
        is_paid: this.isPaid, //*
        is_applied_textbook: this.isAppliedBook, //*
      };
      this.$store.dispatch("login/inforBranch", userData);
    },
    handleBranch(data) {
      if (data.message) {
        window.sessionStorage.setItem(
          "user",
          JSON.stringify({
            email: this.email,
            name: this.username,
            pwd: this.password,
          })
        );
        window.sessionStorage.setItem("token", this.token);
        window.sessionStorage.setItem("userHid", this.hid);
        window.sessionStorage.setItem("favors", this.favors);

        this.$swal({
          text: "登入成功",
          icon: "success",
          animation: false,
          timer: 1500,
          showConfirmButton: false,
        });

        this.closeLoading();
        // Login 流程 OK 通知父層轉至課程列表頁
        this.$emit("pageEvent", { loginData: this.username });
      } else {
        if (data.error === undefined) {
          data = { error: { message: "登入時發生錯誤" } };
          console.log(data);
        }
        this.loginFailed(data.error.message);
      }
    },
    loginFailed(text) {
      this.closeLoading();
      this.$swal({
        text: text,
        icon: "error",
        animation: false,
        timer: 0,
        allowOutsideClick: false,
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          // this.reloadApp();
        }
      });
    },
    openApp(appName) {
      let url = "";
      if (window.LinkUrl !== undefined) {
        switch (appName) {
          case "superCourse":
            url = "com.cek.superbox";
            break;
          case "gold":
            url = "com.cek.easylearn";
            break;
          case "high":
            url = "com.cek.highstudy";
            break;
          default:
            break;
        }

        window.LinkUrl.openApp(url);
      } else {
        this.$swal({
          text: "很抱歉無法開啟",
          icon: "error",
          animation: false,
          timer: 0,
          showConfirmButton: false,
        });
      }
    },
    linkUrl(url) {
      let isWebView = true;
      if (window.LinkUrl !== undefined) {
        switch (url) {
          case "youtube":
            url = "https://www.youtube.com";
            isWebView = false;
            break;
          case "superCourse":
            url = "https://cek.ott2b.hinet.net/learning/dist/#/home";
            break;
          case "gold":
            url = "https://easylearn.ott2b.hinet.net/learning/dist/#/home";
            break;
          case "high":
            url = "https://highstudy.ott2b.hinet.net/learning/dist/#/home";
            break;
          case "superTest":
            url = "https://www.superstudy.com.tw/";
            break;
          default:
            break;
        }
        window.LinkUrl.open(url, isWebView);
      }
    },
    ethernetSettings() {
      if (window.SettingsCall !== undefined) {
        window.SettingsCall.ethernetSettings();
      }
    },
    screenSettings() {
      if (window.SettingsCall !== undefined) {
        window.SettingsCall.screenSettings();
      }
    },
    resolutionSettings() {
      if (window.SettingsCall !== undefined) {
        window.SettingsCall.resolutionSettings();
      }
    },
    openWifiSettings() {
      if (window.SettingsCall !== undefined) {
        window.SettingsCall.settings("wifi");
      }
    },
    generalSettings() {
      if (window.SettingsCall !== undefined) {
        window.SettingsCall.settings("");
      }
    },
    mainSettings() {
      if (window.SettingsCall !== undefined) {
        window.SettingsCall.settings("main");
      }
    },
    refreshApp() {
      // location.reload();
      if (window.ReloadApp !== undefined) {
        window.ReloadApp.refresh();
      }
    },
    reloadApp() {
      // location.reload();
      if (window.ReloadApp !== undefined) {
        window.ReloadApp.reload();
      }
    },
    showReloadBtn() {
      this.isReloadBtn = true;
    },
    loading() {
      this.$eventBus.$emit("loading"); // 發出 loading 需求
    },
    closeLoading() {
      this.$eventBus.$emit("loadClose"); // 發出關閉 loading
    },
  },
  created() {
    this.windowFunction([
      { name: "getExternalIP", func: this.getExternalIP },
      { name: "bluetoothOnOffReceiver", func: this.bluetoothOnOffReceiver },
      { name: "getIPAddress", func: this.getIPAddress },
      { name: "closeSettings", func: this.closeSettings },
      { name: "showReloadBtn", func: this.showReloadBtn },
    ]);
    this.$eventBus.$on("internetStatus", (str) => {
      if (str !== "") this.static_ip_str = str;
    });
  },
  mounted() {
    this.init();
    this.volumeHandler();
    this.bluetoothHandler();
    this.getAppVersion();
    this.getMacAddress();
    this.clock();
  },
};
</script>