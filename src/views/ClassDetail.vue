<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="1"> </v-col>
      <v-col cols="12" lg="10">
        <v-card>
          <v-card-subtitle class="display-1">
            <v-btn @click="goback()" text rounded
              ><v-icon>mdi-arrow-left</v-icon></v-btn
            >{{ this.name }}</v-card-subtitle
          >
          <v-card-text>觀看期限：{{ this.date }}</v-card-text>
          <v-card-title>課程單元內容：</v-card-title>
          <v-card-actions>
            <v-list width="100%">
              <v-list-group
                v-for="(item, index) in this.video"
                :key="index"
                no-action
                prepend-icon="mdi-folder"
                @click="getSubject(item.SubjectString)"
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.SubjectSName"
                    ></v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item
                  v-for="(a, i) in Course.VLS.StudentPID.VideoS.Video"
                  :key="i"
                  @click="view(a)"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ a.CourName.replace(/;/g, "") }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      耗點：{{ a.VideoPoints }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  {{ a.VideoLength }}分鐘
                  <v-icon>mdi-play</v-icon>
                </v-list-item>
              </v-list-group>
            </v-list>
            <!--<v-expansion-panels>
              <v-expansion-panel
                v-for="(item, index) in this.video"
                :key="index"
              >
                <v-expansion-panel-header>
                  {{ item.videoname }}
                </v-expansion-panel-header>
                <v-expansion-panel-content
                  v-for="(a, i) in item.chapter"
                  :key="i"
                >
                  <v-toolbar flat>
                    <v-card @click="view(a)" flat width="100%">
                      {{ a.chaptername }}
                      {{ a.description }}
                      {{ a.time }}
                      <v-btn rounded small text
                        ><v-icon>mdi-play</v-icon></v-btn
                      >
                    </v-card>
                  </v-toolbar>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels> -->
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="1"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    id: null,
    name: null,
    date: null,
    video: [],
    Course: { VLS: { StudentPID: { VideoS: { CourString: "" } } } },
  }),
  mounted() {
    if (this.getChooseClass == "") {
      this.$router.go(-1);
    } else {
      this.getData();
    }
  },
  computed: {
    ...mapGetters({
      getChooseClass: "class/getChooseClass",
      getUser: "user/getUser",
    }),
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getData() {
      var data = this.getChooseClass;
      console.log(data);
      this.id = data.Course.CourString;
      this.name = data.Course.CourseName;
      this.date = data.DATE;
      for (var i = 0; i < data.Course.SubjectS.Subject.length; i++) {
        this.video.push(data.Course.SubjectS.Subject[i]);
      }
    },
    view(item) {
      console.log(item)
      this.$router.push({
        name: "Class",
        params: { id: item.CourID, video: item.VideoFile },
      }); // -> /user/123
    },
    async getSubject(string) {
      this.Course = { VLS: { StudentPID: { VideoS: { CourString: "" } } } };
      await this.$ajax
        .get("/api/xml/" + this.getUser.Email + string + ".xml", {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/xml; charset=UTF8",
          },
        })
        .then((res) => {
          this.Course = this.$x2js.xml2js(res.data);
        });
    },
    ...mapActions({}),
  },
};
</script>