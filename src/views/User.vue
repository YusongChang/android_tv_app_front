<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="1"> </v-col>
      <v-col cols="12" lg="10">
        <v-tabs>
          <v-tab> 看課紀錄 </v-tab>
          <v-tab> 收藏課程 </v-tab>
          <v-tab> 我的筆記 </v-tab>
          <v-tab> 系統公告 </v-tab>
          <v-tab> 測驗紀錄 </v-tab>
          <v-tab> 課程評價 </v-tab>
          <v-tab> 理解度評分 </v-tab>
          <v-tab-item>
            <v-card-title>收視過的影片</v-card-title>
            <v-row>
              <v-col
                cols="12"
                lg="3"
                md="6"
                sm="6"
                v-for="(item, index) in record"
                :key="index"
              >
                <v-card
                  class="text-center mx-4 mt-2 mb-2"
                  to="/classlist/1/1-1"
                >
                  <v-card-subtitle class="display-1">{{
                    item.name +
                    item.video[index].videoname +
                    item.video[index].chapter[0].chaptername
                  }}</v-card-subtitle>
                  進度：92%
                  <v-progress-linear value="92"> </v-progress-linear>
                  <v-card-text>
                    觀看進度：{{ item.video[index].chapter[0].viewtime }} <br />
                    最後觀看：{{ item.video[index].chapter[0].viewdate }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-card-title>收藏的影片</v-card-title>
            <v-row>
              <v-col
                cols="12"
                lg="3"
                md="6"
                sm="6"
                v-for="(item, index) in record"
                :key="index"
              >
                <v-card
                  class="text-center mx-4 mt-2 mb-2"
                  to="/classlist/1/1-1"
                >
                  <v-card-subtitle class="display-1">{{
                    item.name +
                    item.video[index].videoname +
                    item.video[index].chapter[0].chaptername
                  }}</v-card-subtitle>
                  <v-card-subtitle>
                    {{
                      item.video[index].chapter[0].description
                    }}</v-card-subtitle
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-rating
                      full-icon="mdi-heart"
                      empty-icon="mdi-heart-outline"
                      color="red"
                      background-color="red"
                      length="1"
                      :value="1"
                    ></v-rating>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row>
                    <v-col
                      cols="12"
                      lg="12"
                      md="12"
                      sm="12"
                      v-for="(item, index) in record"
                      :key="index"
                    >
                      <v-card class="text-center mx-4 mt-2 mb-2">
                        <v-card-subtitle class="display-1">{{
                          item.name +
                          item.video[index].videoname +
                          item.video[index].chapter[0].chaptername
                        }}</v-card-subtitle>
                        <v-card-subtitle>
                          {{
                            item.video[index].chapter[0].description
                          }}</v-card-subtitle
                        >
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card flat>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in noteList"
                        :key="index"
                      >
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
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-tab-item>
          <v-tab-item>
            <div class="grey--text text-center display-1">目前沒有公告</div>
          </v-tab-item>
          <v-tab-item>
            <div class="grey--text text-center display-1">沒有測驗紀錄</div>
          </v-tab-item>
          <v-tab-item>
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-toolbar flat dense>
                    {{ rating.name }}
                  </v-toolbar>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list-item-subtitle class="text-left font-weight-black">
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th>單元</th>
                          <th>分數</th>
                          <th>日期</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ rating.name }} {{ rating.chapter }}</td>
                          <td>{{ rating.score }}</td>
                          <td>{{ rating.date }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-list-item-subtitle>
                </v-expansion-panel-content>
                <v-divider></v-divider>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-tab-item>
          <v-tab-item>
            <v-expansion-panels flat>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-toolbar flat dense>
                    {{ rating.name }}
                  </v-toolbar>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list-item-subtitle class="text-left font-weight-black">
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th>單元</th>
                          <th>理解程度</th>
                          <th>日期</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ rating.name }} {{ rating.chapter }}</td>
                          <td>{{ rating.percent }}</td>
                          <td>{{ rating.date }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-list-item-subtitle>
                </v-expansion-panel-content>
                <v-divider></v-divider>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-tab-item>
        </v-tabs>

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
                    <v-textarea
                      v-model="editedItem.note"
                      label="筆記"
                    ></v-textarea>
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
      </v-col>
      <v-col cols="12" lg="1"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    rating: {
      id: 1,
      name: "經濟學入門1",
      chapter: "1-1",
      score: "4顆星",
      date: "2021-04-20",
      percent: "75%",
    },
    record: [
      {
        id: 1,
        name: "民法入門",
        date: "2021-12-31",
        video: [
          {
            videoname: "入門一",
            chapter: [
              {
                chaptername: "1-1",
                description: "總論",
                time: "00:05:11",
                viewtime: "00:04:00",
                viewdate: "2021-04-09",
              },
              {
                chaptername: "1-2",
                description: "結論",
                time: "00:17:11",
                viewtime: "00:16:02",
                viewdate: "2021-04-10",
              },
            ],
          },
        ],
      },
    ],
    id: null,
    name: null,
    date: null,
    videoname: null,
    video: [],
    noteList: [{ date: "2021-05-07", time: "7", note: "Good!!!" },{ date: "2021-05-11", time: "13", note: "Good!!!" }],
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
    getData() {
      var data = this.getClass;
      this.id = data.id;
      this.name = data.name;
      this.date = data.date;
    },
    addTime(time) {
      var vid = document.getElementById("myVideo");
      vid.currentTime += time;
    },
    gogo(time) {
      var vid = document.getElementById("myVideo");
      vid.currentTime = time;
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
        sec = "0" + min;
      }
      if (hr);
      return hr + ":" + min + ":" + sec;
    },
    ...mapActions({}),
  },
};
</script>