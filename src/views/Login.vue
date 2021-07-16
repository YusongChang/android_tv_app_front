<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="12" sm="12" lg="3"></v-col>
      <v-col cols="12" md="12" sm="12" lg="6">
        <v-card tile>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                  xl="4"
                  style="background-color: orange"
                >
                  <v-img
                    class="d-none d-xl-flex"
                    src="../assets/logo.png"
                  ></v-img>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12" xl="8">
                  <v-card-text>
                    <h1
                      class="text-center display-2 orange--text text--accent-3"
                    >
                      <v-icon large left color="orange">person</v-icon>登入
                    </h1>
                    <h2
                      class="text-center mt-4 mb-4 orange--text text--accent-3"
                    >
                      歡迎使用，請輸入帳號密碼以登入
                    </h2>
                    <v-form>
                      <v-text-field
                        v-model="Email"
                        label="Account帳號"
                        prepend-inner-icon="person"
                        filled
                        rounded
                        color="orange"
                        type="text"
                      />
                      <v-text-field
                        v-model="Password"
                        label="Password密碼"
                        prepend-inner-icon="lock"
                        filled
                        rounded
                        color="orange"
                        type="password"
                      />
                    </v-form>
                    <v-row justify="center">
                      <v-toolbar flat>
                        <v-btn outlined rounded color="error" @click="step++"
                          >註冊</v-btn
                        >
                        <v-spacer></v-spacer>

                        <v-btn outlined rounded color="success" @click="signin2"
                          >登入→</v-btn
                        >
                      </v-toolbar>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12" xl="8">
                  <v-card-text>
                    <h1
                      class="text-center display-2 orange--text text--accent-3"
                    >
                      註冊
                    </h1>
                    <h2
                      class="text-center mt-4 mb-4 orange--text text--accent-3"
                    >
                      歡迎使用，請輸入信箱密碼以登入
                    </h2>
                    <v-form>
                      <v-text-field
                        v-model="Email2"
                        label="Account帳號"
                        prepend-inner-icon="person"
                        filled
                        rounded
                        color="orange"
                        type="text"
                      />
                      <v-text-field
                        v-model="Password2"
                        label="Password密碼"
                        prepend-inner-icon="lock"
                        filled
                        rounded
                        color="orange"
                        type="password"
                      />
                    </v-form>
                    <v-row justify="center">
                      <v-toolbar flat>
                        <v-btn outlined rounded color="error" @click="step--"
                          >←返回</v-btn
                        >
                        <v-spacer></v-spacer>

                        <v-btn
                          outlined
                          rounded
                          color="success"
                          @click="register"
                          >完成</v-btn
                        >
                      </v-toolbar>
                    </v-row>
                  </v-card-text>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                  xl="4"
                  style="background-color: orange"
                >
                  <v-img
                    class="d-none d-xl-flex"
                    src="../assets/logo.png"
                  ></v-img>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
      <v-col cols="12" md="12" sm="12" lg="3"></v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    step: 1,
    Email: "B180809170",
    Password: "0000",
    Email2: "",
    Password2: "",
    admin: {
      Email: "admin",
      Password: "admin",
    },
  }),
  props: {
    source: String,
  },
  methods: {
    async signin2() {
      var auth = "";
      var name = "";
      var xmls =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">' +
        "<soapenv:Header/>" +
        "<soapenv:Body>" +
        "<tem:PMBSTDLOD01A.Execute>" +
        "<tem:Studentpid>" +
        this.Email +
        "</tem:Studentpid>" +
        "<tem:Studentpwd>" +
        this.Password +
        "</tem:Studentpwd>" +
        "</tem:PMBSTDLOD01A.Execute>" +
        "</soapenv:Body>" +
        "</soapenv:Envelope>";
      await this.$ajax
        .post("api/aPMBSTDLOD01A.aspx?wsdl", xmls, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/xml; charset=UTF8",
          },
        })
        .then((res) => {
          var data = this.$x2js.xml2js(res.data);
          console.log(data);
          data = data.Envelope.Body["PMBSTDLOD01A.ExecuteResponse"];
          auth = data.Rtncode.__text;
          name = data.Studentname.__text;
        })
        .catch((err) => {
          console.log(err);
        });
      if (auth == "Y") {
        var data = { Email: this.Email, Name: name };
        var courseData="";
        localStorage.setItem("user", JSON.stringify(data));
        var info = localStorage.getItem("user");
        console.log("info: ", JSON.parse(info));
        this.login(data);
        await this.$ajax
          .get("api/soap/" + this.Email +".xml", {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "text/xml; charset=UTF8",
            },
          })
          .then((res) => {
            courseData = this.$x2js.xml2js(res.data);
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
        this.setDB(courseData);
        this.$swal({
          text: "成功登入",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
        this.$router.push("/classlist");
      } else {
        this.$swal({
          text: "帳密有錯",
          icon: "error",
          timer: 1000,
          showConfirmButton: false,
        }).then(function () {
          // 確定要做的事
        });
      }
    },
    signin() {
      if (
        this.Email == this.admin.Email &&
        this.Password == this.admin.Password
      ) {
        var data = { Email: this.Email };
        localStorage.setItem("user", JSON.stringify(data));
        var info = localStorage.getItem("user");
        console.log("info: ", JSON.parse(info));
        this.login(data);
        this.$swal({
          text: "成功登入",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
        this.$router.push("/classlist");
      } else {
        this.$swal({
          text: "帳密有錯",
          icon: "error",
          timer: 1000,
          showConfirmButton: false,
        }).then(function () {
          // 確定要做的事
        });
      }
    },
    register() {
      if ((this.Email2 && this.Password2) != "") {
        this.$swal({
          text: "註冊成功 帳號為" + this.Email2 + "密碼為" + this.Password2,
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
        this.step--;
      } else {
        this.$swal({
          text: "資料有缺",
          icon: "error",
          timer: 1000,
          showConfirmButton: false,
        });
      }
    },
    ...mapActions({
      login: "user/login",
      setDB: "class/getDB"
    }),
  },
  created() {},
};
</script>

<style>
.borderAll {
  border-radius: 50px 50px 50px 50px !important;
}
</style>