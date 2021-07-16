<template>
  <v-container fluid v-if="!['Login'].includes($route.name)">
    <v-app-bar app color="orange" d-none d-xl-flex>
      <v-toolbar color="orange" flat dark>
        <router-link
          to="/"
          class="display-1 font-weight-black"
          style="text-decoration: none; color: white"
        >
          <v-img src="../assets/logo.png" height="30%" width="30%"></v-img>
        </router-link>
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
        <v-text-field label="Search" prepend-icon="search" rounded class="mt-6">
        </v-text-field>
        <v-spacer></v-spacer>
        <div v-if="getUser">
          <v-avatar class="ml-2 border" size="45">
            <v-img src="../assets/logo.png"></v-img>
          </v-avatar>
          {{ getUser.Name }}
          <v-btn rounded text small @click="signout()"
            ><v-icon left>lock</v-icon>登出</v-btn
          >
        </div>
        <div v-else>
          <v-avatar class="ml-2 border" size="45">
            <v-img src="../assets/logo.png"></v-img>
          </v-avatar>
          noLogin
          <v-btn rounded text small to="/user/login"
            ><v-icon left>lock_open</v-icon>登入</v-btn
          >
        </div>
      </v-toolbar>
    </v-app-bar>
    <v-navigation-drawer
      class="d-xl-none d-lg-flex"
      v-model="sideBar"
      app
      temporary
    >
      <v-card color="orange" flat tile>
        <v-list>
          <v-text-field label="Search" prepend-icon="search" rounded>
          </v-text-field>
          <v-list-item>
            <div class="display-1 font-weight-black white--text">超級函授</div>
          </v-list-item>
          <v-list-item dark>
            <v-list-item-content>
              <v-list-item-title>
                <div v-if="getUser">
                  <v-avatar class="mr-2 border" size="60">
                    <v-img src="../assets/logo.png"></v-img>
                  </v-avatar>
                  {{ getUser.Name }}
                  <v-btn rounded text small @click="signout()"
                    ><v-icon left>lock</v-icon>登出</v-btn
                  >
                </div>
                <div v-else>
                  <v-avatar class="mr-2 border" size="60">
                    <v-img src="../assets/logo.png"></v-img>
                  </v-avatar>
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
      </v-list>
    </v-navigation-drawer>
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
                  <router-link to="/">
                    <v-img
                      src="../assets/logo.png"
                      height="45"
                      width="60"
                    ></v-img>
                  </router-link>
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </v-card>
          </v-col>
        </v-row>
      </v-app-bar>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    menuItems: [
      { title: "我的課程", path: "/classlist", icon: "mdi-book" },
      { title: "看課專區", path: "/user", icon: "mdi-home" },
    ],
    backTopShow: false,
    sideBar: false,
  }),
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    if (localStorage.getItem("user")) {
      var user = localStorage.getItem("user");
      this.login(JSON.parse(user));
    }
  },
  computed: {
    ...mapGetters({
      getUser: "user/getUser",
    }),
  },
  methods: {
    handleScroll() {
      if (document.documentElement.scrollTop + document.body.scrollTop > 0) {
        this.backTopShow = true;
      } else {
        this.backTopShow = false;
      }
    },
    signout() {
      localStorage.removeItem("user");
      this.$swal({
        text: "已登出",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      }).then(function () {
        // 確定要做的事
      });
      this.$router.push("/");
      this.logout();
    },
    ...mapActions({
      logout: "user/logout",
      login: "user/login",
    }),
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