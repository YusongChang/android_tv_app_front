<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="1"> </v-col>
      <v-col cols="12" lg="10">
        <div class="display-1 mb-2">{{ getUser.Name }}，歡迎回來</div>
        <v-tabs>
          <v-tab> 110雲端體驗課程體驗班 </v-tab>
          <v-tab-item>
            <v-row>
              <v-col
                cols="12"
                lg="3"
                md="6"
                sm="6"
                v-for="(item, index) in getClass"
                :key="index"
              >
                <v-card class="text-center mx-4 mt-2 mb-2" @click="view(item)">
                  <v-card-subtitle class="display-1">{{
                    item.Course.CourseName
                  }}</v-card-subtitle>
                  <v-card-text>觀看期限：{{ item.DATE }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs>
      </v-col>
      <v-col cols="12" lg="1"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({}),
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters({
      getClass: "class/getClass",
      getUser: "user/getUser",
    }),
  },
  methods: {
    view(item) {
      this.setClass(item);
      this.$router.push({
        name: "ClassDetail",
        params: { id: item.Course.CourseSeq },
      }); // -> /user/123
    },
    ...mapActions({
      setClass: "class/setClass",
    }),
    async getData() {
      var courseData;
      await this.$ajax
        .get("api/xml/" + this.getUser.Email + ".xml", {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/xml; charset=UTF8",
          },
        })
        .then((res) => {
          courseData = this.$x2js.xml2js(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      this.$store.dispatch("class/getDB", courseData);
    },
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
.border {
  border: 2px solid yellow !important;
}
</style>