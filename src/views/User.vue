<!-- 學員:看課專區頁面 -->
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="1"> </v-col>
      <v-col cols="12" lg="10">
        <v-tabs v-model="tab" show-arrows>
          <v-tab> 看課紀錄 </v-tab>
          <v-tab> 收藏課程 </v-tab>
          <!-- <v-tab> 我的筆記 </v-tab> -->
          <v-tab> 測驗紀錄 </v-tab>
          <v-tab> 課程評價 </v-tab>
          <v-tab> 理解度評分 </v-tab>
          <v-tab-item transition="">
            <v-card-title class="justify-space-between">
              <div>收視過的影片</div>
              <v-btn icon class="mr-2" @click="showFilter" title="篩選日期">
                <v-icon> mdi-calendar-range </v-icon>
                <span>篩選</span>
              </v-btn>
            </v-card-title>
            <v-card-text class="pb-0">
              {{ filterText }}
            </v-card-text>
            <v-container>
              <v-row>
                <v-container>
                  <v-expansion-panels accordion v-if="pageLocate === 'record'">
                    <v-expansion-panel
                      v-for="(item, idx) in pageData"
                      :key="idx"
                    >
                      <v-expansion-panel-header expand-icon="">
                        <v-toolbar
                          flat
                          dense
                          @click="
                            checkVideo(
                              item.courName,
                              item.courseSeq,
                              item.subjectString,
                              item.courId,
                              item.code,
                              item.title,
                              item.timeCode,
                              item.updated_date + ' ' + item.updated_time
                            )
                          "
                        >
                          <span class="mr-2"> {{ item.courName }}</span>
                          <span class="mr-2">
                            進度
                            {{
                              Math.round((item.timeCode / item.duration) * 100)
                            }}
                            %</span
                          >
                          <span class="mr-2">{{
                            item.updated_date + " " + item.updated_time
                          }}</span>
                        </v-toolbar>
                      </v-expansion-panel-header>
                      <!-- <v-expansion-panel-content>
                        <v-list-item-subtitle
                          class="text-left font-weight-black"
                        >
                          <v-simple-table>
                            <thead>
                              <tr>
                                <th>單元</th>
                                <th>觀看</th>
                                <th>進度</th>
                                <th>最後觀看</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                @click="
                                  checkVideo(
                                    item.course.hid,
                                    item.course.title,
                                    item.lesson.title,
                                    item.course.code,
                                    item.timecode,
                                    item.updated_at
                                  )
                                "
                              >
                                <td>{{ item.lesson.title }}</td>
                                <td>{{ formatTime(item.timecode) }}</td>
                                <td>
                                  {{
                                    parseInt(
                                      (item.timecode / item.duration) * 100
                                    )
                                  }}%
                                </td>
                                <td>{{ item.updated_at }}</td>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </v-list-item-subtitle>
                      </v-expansion-panel-content> -->
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-container>
              </v-row>
              <v-row class="mt-0">
                <v-col cols="12">
                  <v-pagination
                    class="my-0"
                    v-model="recordPage"
                    :total-visible="7"
                    :length="pageLength"
                  ></v-pagination>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <v-tab-item transition="">
            <v-card-title class="pb-0"
              >收藏的課程
              <v-icon color="red">mdi-heart</v-icon>
            </v-card-title>
            <v-card-text>{{ recrdRes }}</v-card-text>
            <v-container class="pt-1">
              <v-row>
                <v-container>
                  <v-expansion-panels accordion v-if="pageLocate === 'favour'">
                    <v-expansion-panel
                      v-for="(item, idx) in pageData"
                      :key="idx"
                    >
                      <v-expansion-panel-header expand-icon="">
                        <v-toolbar
                          flat
                          dense
                          @click="
                            checkVideo(
                              item.courName,
                              item.courseSeq,
                              item.subjectString,
                              item.courId,
                              item.code,
                              item.title,
                              item.timeCode,
                              item.updated_date + ' ' + item.updated_time
                            )
                          "
                        >
                          {{ item.courName }}
                        </v-toolbar>
                      </v-expansion-panel-header>
                      <!-- <v-expansion-panel-content>
                        <v-list-item-subtitle
                          class="text-left font-weight-black"
                        >
                          <v-simple-table>
                            <thead>
                              <tr>
                                <th>單元</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{{ item.lesson_title }}</td>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </v-list-item-subtitle>
                      </v-expansion-panel-content> -->
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-container>
              </v-row>
              <v-row class="mt-0">
                <v-col cols="12">
                  <v-pagination
                    class="my-0"
                    v-model="pagination"
                    :total-visible="7"
                    :length="pageLength"
                  ></v-pagination>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <!-- <v-tab-item transition="">
            <v-card-title>我的筆記</v-card-title>
            <v-card-text>{{ recrdRes }}</v-card-text>
            <v-container>
              <v-row>
                <v-container>
                  <v-expansion-panels accordion v-if="pageLocate === 'note'">
                    <v-expansion-panel
                      v-for="(item, idx) in pageData"
                      :key="idx"
                    >
                      <v-expansion-panel-header>
                        <v-toolbar flat dense>
                          {{ item.lesson.course_title }}
                        </v-toolbar>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-list-item-subtitle
                          class="text-left font-weight-black"
                        >
                          <v-simple-table>
                            <thead>
                              <tr>
                                <th>單元</th>
                                <th>時間</th>
                                <th>內容</th>
                                <th>日期</th>
                                <th>操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(nots, idx) in item.notes"
                                :key="idx"
                                @click="
                                  checkVideo(
                                    item.lesson.title,
                                    item.code,
                                    nots.timecode
                                  )
                                "
                              >
                                <td>{{ item.lesson.title }}</td>
                                <td>{{ formatSecond(nots.timecode) }}</td>
                                <td>{{ nots.note }}</td>
                                <td>{{ formatDate(nots.time) }}</td>
                                <td>
                                  <v-menu>
                                    <template v-slot:activator="{ attrs, on }">
                                      <v-btn
                                        v-bind="attrs"
                                        color="orange"
                                        v-on="on"
                                        icon
                                      >
                                        <v-icon>mdi-dots-vertical</v-icon>
                                      </v-btn>
                                    </template>

                                    <v-list>
                                      <v-list-item>
                                        <v-btn
                                          text
                                          small
                                          color="orange"
                                          @click="editDialog(nots)"
                                          ><v-icon>edit</v-icon></v-btn
                                        >
                                      </v-list-item>
                                      <v-list-item>
                                        <v-btn
                                          text
                                          small
                                          color="error"
                                          @click="deleteDialog(nots)"
                                          ><v-icon>delete</v-icon></v-btn
                                        >
                                      </v-list-item>
                                    </v-list>
                                  </v-menu>
                                </td>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </v-list-item-subtitle>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-container>
              </v-row>
              <v-row class="mt-0">
                <v-col cols="12">
                  <v-pagination
                    class="my-0"
                    v-model="pagination"
                    :total-visible="7"
                    :length="pageLength"
                  ></v-pagination>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item> -->
          <v-tab-item transition="">
            <v-card-title class="pb-0">測驗紀錄</v-card-title>
            <v-card-text>{{ recrdRes }}</v-card-text>
            <v-container class="pt-1">
              <v-row>
                <v-container>
                  <v-expansion-panels accordion v-if="pageLocate === 'quizz'">
                    <v-expansion-panel
                      v-for="(quiz, idx) in pageData"
                      :key="idx"
                    >
                      <v-expansion-panel-header expand-icon="">
                        <v-toolbar flat dense>
                          <span class="mr-2">
                            {{ quiz.courName }}
                          </span>
                          <span class="mr-2"> 分數 {{ quiz.score }} </span>
                          <span>
                            {{ quiz.updated_at }}
                          </span>
                        </v-toolbar>
                      </v-expansion-panel-header>
                      <!-- <v-expansion-panel-content>
                        <v-list-item-subtitle
                          class="text-left font-weight-black"
                        >
                          <v-simple-table>
                            <thead>
                              <tr>
                                <th>單元</th>
                                <th>分數</th>
                                <th>日期</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(item, index) in quiz.quizzesRecord"
                                :key="index"
                              >
                                <td>{{ item.lessonTitle }}</td>
                                <td>{{ item.score }}</td>
                                <td>{{ item.time }}</td>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </v-list-item-subtitle>
                      </v-expansion-panel-content> -->
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-container>
              </v-row>
              <v-row class="mt-0">
                <v-col cols="12">
                  <v-pagination
                    class="my-0"
                    v-model="pagination"
                    :total-visible="7"
                    :length="pageLength"
                  ></v-pagination>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <v-tab-item transition="">
            <v-card-title class="pb-0">課程評價</v-card-title>
            <v-card-text>{{ recrdRes }}</v-card-text>
            <v-container class="pt-1">
              <v-row>
                <v-col cols="12">
                  <v-expansion-panels
                    accordion
                    v-if="pageLocate === 'evaluation'"
                  >
                    <v-expansion-panel
                      v-for="(evals, idx) in pageData"
                      :key="idx"
                    >
                      <v-expansion-panel-header expand-icon="">
                        <v-toolbar flat dense>
                          <span class="mr-2">
                            {{ evals.courName }}
                          </span>
                          <span class="mr-2"
                            >評價 {{ evals.evaluation }} 顆星
                          </span>
                          <span>
                            {{ evals.updated_at }}
                          </span>
                        </v-toolbar>
                      </v-expansion-panel-header>
                      <!-- <v-expansion-panel-content>
                        <v-list-item-subtitle
                          class="text-left font-weight-black"
                        >
                          <v-simple-table>
                            <thead>
                              <tr>
                                <th>單元</th>
                                <th>星數</th>
                                <th>日期</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(rating, idx) in ratings.ratings"
                                :key="idx"
                              >
                                <td>{{ rating.lesson }}</td>
                                <td>{{ rating.rating }} 顆星</td>
                                <td>{{ rating.date }}</td>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </v-list-item-subtitle>
                      </v-expansion-panel-content> -->
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col cols="12">
                  <v-pagination
                    class="my-0"
                    v-model="pagination"
                    :total-visible="7"
                    :length="pageLength"
                  ></v-pagination>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <v-tab-item transition="">
            <v-card-title class="pb-0">理解度評分</v-card-title>
            <v-card-text>{{ recrdRes }}</v-card-text>
            <v-container class="pt-1">
              <v-row>
                <v-col cols="12">
                  <v-expansion-panels accordion v-if="pageLocate === 'rating'">
                    <v-expansion-panel
                      v-for="(ratings, idx) in pageData"
                      :key="idx"
                    >
                      <v-expansion-panel-header expand-icon="">
                        <v-toolbar flat dense>
                          <span class="mr-2">
                            {{ ratings.courName }}
                          </span>
                          <span class="mr-2">
                            理解度 {{ ratings.rating }}%
                          </span>
                          <span>
                            {{ ratings.updated_at }}
                          </span>
                        </v-toolbar>
                      </v-expansion-panel-header>
                      <!-- <v-expansion-panel-content>
                        <v-list-item-subtitle
                          class="text-left font-weight-black"
                        >
                          <v-simple-table>
                            <thead>
                              <tr>
                                <th>單元</th>
                                <th>分數</th>
                                <th>日期</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(rating, idx) in evas.ratings"
                                :key="idx"
                              >
                                <td>{{ rating.lesson }}</td>
                                <td>{{ rating.rating }} %</td>
                                <td>{{ rating.date }}</td>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </v-list-item-subtitle>
                      </v-expansion-panel-content> -->
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col cols="12">
                  <v-pagination
                    class="my-0"
                    v-model="pagination"
                    :total-visible="7"
                    :length="pageLength"
                  ></v-pagination>
                </v-col>
              </v-row>
            </v-container>
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
                      v-model="editedItem.time"
                      label="日期"
                      disabled
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.timecode"
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
              <v-btn color="error" text @click="closeDialog"> 取消 </v-btn>
              <v-btn color="success" text @click="editNote"> 儲存 </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">要刪除這個筆記嗎?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" text @click="closeDialog">取消</v-btn>
              <v-btn color="error" text @click="deleteNote">刪除</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dateDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">篩選日期</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-menu
                      ref="menu1"
                      v-model="dateMenu1"
                      :close-on-content-click="false"
                      :return-value.sync="filterStartDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="filterStartDate"
                          label="開始日期"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="filterStartDate"
                        no-title
                        scrollable
                        :show-current="false"
                        :allowed-dates="allowedStartDates"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="dateMenu1 = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu1.save(filterStartDate)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-menu
                      ref="menu2"
                      v-model="dateMenu2"
                      :close-on-content-click="false"
                      :return-value.sync="filterEndDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="filterEndDate"
                          label="結束日期"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="filterEndDate"
                        no-title
                        scrollable
                        :show-current="false"
                        :allowed-dates="allowedEndDates"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="dateMenu2 = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu2.save(filterEndDate)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="orange" @click="dateReset"> 重設 </v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="pink" @click="dateDialog = false">
                取消
              </v-btn>
              <v-btn color="success" @click="dateFilter"> 確定 </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="12" lg="1"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { Cookie, lastDeduct, DateFormat } from "../composition_api";

export default {
  data: () => ({
    filterText: "",
    pageLocate: "",
    totalCount: 0,
    skipCount: 0,
    recordPage: 1,
    pagination: 1,
    paginationTemp: 1,
    pageStart: 0,
    pageEnd: 0,
    pageLength: 0,
    pageData: [],
    startDate: "",
    endDate: "",
    filterStartDate: null,
    filterEndDate: null,
    dateMenu1: false,
    dateMenu2: false,
    dateDialog: false,
    loginItem: JSON.parse(sessionStorage.getItem("user")),
    email: "", //* 其實是帳號，建議改成 account
    pwd: "",
    tab: 0,
    dataList: [],
    id: null,
    name: null,
    date: null,
    videoname: null,
    video: [],
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
    stb_ip: null,
    courseName: null,
    code: null,
    timeCode: null,
    historyDateTime: null,
    historyDateNoZero: null,
    historyDate: null,
    subjString: null,
    courseSeq: null,
    courseId: null,
    bdate: null,
    lessonHid: null,
    recrdRes: "",
    autoCheck: true,
  }),
  computed: {
    ...mapGetters({
      getValidated: "user/getValidated",
      getCourseList: "class/getCourseList",
      getRecords: "class/getRecords",
      getLodRecord: "class/getLodRecord",
      getFavours: "class/getFavours",
      getLodFavours: "class/getLodFavours",
      getUserNotes: "class/getUserNotes",
      getUserRating: "class/getUserRating",
      getUserEval: "class/getUserEval",
      getCRUDCourseNote: "class/getCRUDCourseNote",
      getUserQuizzes: "class/getUserQuizzes",
      getCourseAndDeduct: "user/getCourseAndDeduct",
      getCourseDeductRecord: "user/getCourseDeductRecord",
      getPoint: "user/getPoint",
      getDeductPoint: "user/getDeductPoint",
      getUserLodRating: "class/getUserLodRating",
      getLodQuizList: "class/getLodQuizList",
    }),
    dateRangeText() {
      return this.dateRange.join(" ~ ");
    },
  },
  watch: {
    tab: function (data) {
      this.handleTabPage(data);
    },
    recordPage: function (data) {
      this.distrRecord(data);
    },
    pagination: function (data) {
      this.distrPage(data);
    },
    getValidated(data) {
      this.validated(data);
    },
    getCourseList(data) {
      this.handleReserved(data.Courses);
    },
    getRecords(data) {
      this.handleRecords(data);
    },
    getLodRecord(data) {
      this.handleRecords(data);
    },
    getUserQuizzes(data) {
      this.handleQuizzes(data);
    },
    getFavours(data) {
      this.handleFavours(data);
    },
    getUserNotes(data) {
      this.handleNotes(data);
    },
    getUserRating(data) {
      this.handleRating(data);
    },
    getUserLodRating(data) {
      this.handleRating(data);
    },
    getUserEval(data) {
      this.handleEval(data);
    },
    getCRUDCourseNote(data) {
      this.reLoadNotes(data);
    },
    getCourseAndDeduct(data) {
      this.deductRecord(data);
    },
    getCourseDeductRecord(data) {
      this.handleRecord(data);
    },
    getPoint(data) {
      this.handlePoint(data);
    },
    getDeductPoint(data) {
      this.handleDeduct(data);
    },
    getLodFavours(data) {
      this.handleLodFavs(data);
    },
    getLodQuizList(data) {
      this.handleQuizzes(data);
    },
  },
  methods: {
    init() {
      const settingData = JSON.parse(Cookie.readCookie("setting") || null);
      this.stb_ip = settingData.stb_ip;

      this.email = this.loginItem.email;
      this.pwd = this.loginItem.pwd;

      let date = new Date();
      this.startDate =
        date.getFullYear() +
        "-" +
        DateFormat.checkTime(date.getMonth() + 1) +
        "-01";
      this.endDate = DateFormat.localtoISOdate(
        DateFormat.localDate(date, true)
      );

      this.tab = window.sessionStorage.getItem("userTabs")
        ? parseInt(window.sessionStorage.getItem("userTabs"))
        : 0;
      if (this.tab === 0) this.handleTabPage(this.tab);

      this.userValidate(); // 正式時要秀出來
    },
    rollBack() {
      // 恢復初始值
      this.skipCount = 0;
      this.dataList = [];
      this.pageData = [];
      this.recordPage = 1;
      this.pagination = 1;
      this.paginationTemp = 1;
      this.pageLength = 0;
      this.recrdRes = "";
    },
    userValidate() {
      // 驗證、通知產生預約課程資料 xml
      console.log("User user validating.");
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
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
    },
    validated(data) {
      if (
        data.Envelope.Body["PBNSTDData.ExecuteResponse"].Studentpwd.__text ===
        this.pwd
      ) {
        console.log("User user validated.");
        this.checkReserved();
      } else {
        // IP 位址未被認證
        this.$swal({
          title: "您無權限",
          icon: "error",
          animation: false,
          timer: 1500,
          showConfirmButton: true,
        });
        this.$emit("pageEvent", { loginData: "logout" }); //* 登出
      }
    },
    checkReserved() {
      this.$eventBus.$emit("checkReservedApp", {
        stop: false,
        email: this.email,
      }); // 通知串檢查預約 API

      // 查看是否預約
      this.$store.dispatch("class/courseList", `${this.email}`);
    },
    handleReserved(data) {
      this.$eventBus.$emit("checkReservedApp", {
        stop: true,
        email: this.email,
      }); // 通知停止重串檢查預約 API

      if (
        data.VldSub !== undefined &&
        data.VldSub === "Y" &&
        data.OnBranch !== "N"
      ) {
        console.log("User : 有預約喔! :)");
        if (!this.autoCheck) this.checkDeduct(); // 是使用者想看課，非自動檢查才進扣點流程
      } else {
        // 登出學員
        this.$swal({
          title: "您尚未預約本時段",
          icon: "warning",
          animation: false,
          timer: 0,
          showConfirmButton: true,
          allowOutsideClick: false,
        }).then((res) => {
          if (res.isConfirmed) {
            this.$emit("pageEvent", { loginData: "logout" }); //* 登出，正式時需秀出來
          }
        });
      }

      this.closeLoading();
    },
    handleTabPage(tab) {
      this.loading();
      this.rollBack();
      switch (tab) {
        case 0:
          this.getRecordList();
          this.pageLocate = "record";
          break;
        case 1:
          this.getFavourList();
          this.pageLocate = "favour";
          break;
        case 2:
          this.getUserQuizzesList();
          this.pageLocate = "quizz";
          break;
        // case 3: // 暫時移除
        //   this.getNotesList();
        //   this.pageLocate = "note";
        //   break;
        case 3:
          this.getEvalList();
          this.pageLocate = "evaluation";
          break;
        case 4:
          this.getRatingList();
          this.pageLocate = "rating";
          break;
        default:
          break;
      }
      window.sessionStorage.setItem("userTabs", tab);
    },
    dateReset() {
      this.filterStartDate = null;
      this.filterEndDate = null;
    },
    dateFilter() {
      if (this.filterStartDate !== null && this.filterEndDate !== null) {
        this.rollBack();
        this.getRecordList();
        this.dateDialog = false;
      }
    },
    showFilter() {
      this.dateDialog = true;
      this.dateReset();
    },
    allowedStartDates(val) {
      if (this.filterEndDate) {
        let thisTIme = new Date(this.filterEndDate);
        let time = new Date(val);
        return time <= thisTIme;
      }
      return true;
    },
    allowedEndDates(val) {
      if (this.filterStartDate) {
        let thisTIme = new Date(this.filterStartDate);
        let time = new Date(val);
        return time >= thisTIme;
      }

      return true;
    },
    getRecordList() {
      // this.filterStartDate = "2021-11-22"; //* 測試
      // this.filterEndDate = "2021-11-23"; //* 測試

      this.filterStartDate = this.filterStartDate
        ? this.filterStartDate
        : this.startDate;

      this.filterEndDate = this.filterEndDate
        ? this.filterEndDate
        : this.endDate;

      const payload = {
        syntax: 2,
        account: this.email,
        start: this.filterStartDate,
        end: this.filterEndDate,
      };
      this.$store.dispatch("class/lodGetRecord", payload);
      // this.$store.dispatch("class/records", payload);
    },
    getUserQuizzesList() {
      const payload = {
        syntax: 2,
        account: this.email,
      };
      this.$store.dispatch("class/lodQuiz", payload);
      // this.$store.dispatch("class/userQuizzes");
    },
    getFavourList() {
      // this.$store.dispatch("class/favours");
      const payload = {
        syntax: 2,
        account: this.email,
      };
      this.$store.dispatch("class/lodFavours", payload);
    },
    getNotesList() {
      this.$store.dispatch("class/userNotes");
    },
    getRatingList() {
      const payload = {
        syntax: 2,
        account: this.email,
        type: "rating",
      };
      this.$store.dispatch("class/userLodRating", payload);
      // this.$store.dispatch("class/userRating", "rating");
    },
    getEvalList() {
      const payload = {
        syntax: 2,
        account: this.email,
        type: "evaluation",
      };
      this.$store.dispatch("class/userLodRating", payload);
      // this.$store.dispatch("class/userEval", "evaluation");
    },
    distrRecord() {
      // 看課紀錄分配分頁資料 5列一頁
      let rows = 5;
      rows = this.dataList.length >= rows ? rows : this.dataList.length;
      let minusRes = this.recordPage - this.paginationTemp; // 當前頁碼減上次頁碼
      console.log(minusRes);
      let times = Math.abs(minusRes); // 索引起始與結束位置乘倍計算
      if (minusRes > 0) {
        this.pageStart += rows * times;
        this.pageEnd += rows * times;
      } else if (minusRes < 0) {
        this.pageStart -= rows * times;
        this.pageEnd -= rows * times;
      } else {
        this.pageStart = 0;
        this.pageEnd = rows;
      }
      this.closeLoading();
      // console.log(this.dataList);
      // console.log(this.pageStart, this.pageEnd);
      // console.log(this.dataList);
      // console.log(this.dataList.slice(this.pageStart, this.pageEnd).length); // pageEnd 指的是索引之前且不含此索引之元素

      //array index =>  page 1:  index 0~4 、 page 2: index 5~9 、 page 3 : index 10~14 ...
      // 陣列長度小於 total_count 可提取資料
      // if (
      //   this.dataList.slice(this.pageStart, this.pageEnd).length < rows &&
      //   this.dataList.length < this.totalCount
      // ) {
      //   this.getRecordList();
      //   // 若小於 5 筆則補資料、索引減回去
      //   this.pageStart -= rows * times;
      //   this.pageEnd -= rows * times;
      // }

      this.paginationTemp = this.recordPage; // 記住頁碼

      this.pageData = this.dataList.slice(this.pageStart, this.pageEnd);

      this.pageLength = Math.ceil(this.totalCount / rows);

      this.pageLength = isNaN(this.pageLength) ? 0 : this.pageLength;

      // 關閉 loading

      // * 測試
      // console.log(
      //   "skipcount:",
      //   this.skipCount,
      //   "minusRes:",
      //   minusRes,
      //   "paginationTemp:",
      //   this.paginationTemp,
      //   "recordPage:",
      //   this.recordPage,
      //   "pageStart:",
      //   this.pageStart,
      //   "pageEnd:",
      //   this.pageEnd
      // );
      // console.log(this.pageData);
    },
    distrPage() {
      if (this.dataList === undefined) this.dataList = []; //修正 undefined 值

      // 分配分頁資料 5列一頁
      let rows = this.dataList.length >= 5 ? 5 : this.dataList.length;
      let minusRes = this.pagination - this.paginationTemp; // 當前頁碼減上次頁碼
      console.log(minusRes);
      let times = Math.abs(minusRes); // 索引起始與結束位置乘倍計算
      if (minusRes > 0) {
        this.pageStart += rows * times;
        this.pageEnd += rows * times;
      } else if (minusRes < 0) {
        this.pageStart -= rows * times;
        this.pageEnd -= rows * times;
      } else {
        this.pageStart = 0;
        this.pageEnd = rows;
      }

      // page 1: array 0~4 、 page 2: array 5~9
      this.pageData = this.dataList.slice(this.pageStart, this.pageEnd);

      this.pageLength = Math.ceil(this.dataList.length / rows);

      this.pageLength = isNaN(this.pageLength) ? 0 : this.pageLength;

      this.paginationTemp = this.pagination;

      this.dateDialog = false;

      console.log(this.pageData);

      this.closeLoading();
    },
    handleRecords(data) {
      this.dataList = data.list;
      if (!this.dataList) {
        // 若無資料則關閉 loading
        this.filterText = "尚無任何紀錄";
        this.closeLoading();
      } else {
        this.totalCount =
          this.dataList[0].total_count !== undefined
            ? this.dataList[0].total_count
            : 0;
        this.filterText = `${this.filterStartDate} ~ ${this.filterEndDate} 共 ${this.totalCount} 筆紀錄`;
        if (this.totalCount) this.distrRecord();
        else this.closeLoading();
      }
    },
    handleFavours(data) {
      this.dataList = this.objToArr(data);
      if (!this.dataList.length) {
        this.recrdRes = "無任何收藏...";
      }
      this.distrPage();
    },
    handleLodFavs(data) {
      this.dataList = data.list;
      if (!this.dataList.length) {
        this.recrdRes = "無任何收藏...";
      }
      this.distrPage();
    },
    handleNotes(data) {
      this.dataList = data;
      if (!this.dataList.length) {
        this.recrdRes = "無任何筆記...";
      }
      this.distrPage();
    },
    handleQuizzes(data) {
      this.dataList = data.list;
      if (this.dataList === undefined) {
        this.recrdRes = "無任何紀錄...";
      }
      this.distrPage();
    },
    handleRating(data) {
      // this.dataList = this.objToArr(data);
      this.dataList = data.list;
      if (!this.dataList.length) {
        this.recrdRes = "無任何資料...";
      }
      this.distrPage();
    },
    handleEval(data) {
      // this.dataList = this.objToArr(data);
      this.dataList = data.list;
      if (!this.dataList.length) {
        this.recrdRes = "無任何評價...";
      }
      this.distrPage();
    },
    objToArr(data) {
      let arr = [];
      Object.keys(data).forEach((key) => {
        arr.push(data[key]);
      });
      return arr;
    },
    userPoint() {
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PBNSTDVLSVP.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Courseseq>${this.courseSeq}</Courseseq>
      <Subjectstring>${this.subjString}</Subjectstring>
      <V01001>${this.code}</V01001>
      </PBNSTDVLSVP.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      this.$store.dispatch("user/userPoint", xmls); // tc
    },
    handlePoint(data) {
      this.point = parseInt(
        data.Envelope.Body["PBNSTDVLSVP.ExecuteResponse"].Vpoint.__text
      );

      if (this.point <= 0) {
        console.log("User check point");
        this.$swal({
          text: `很抱歉您的點數不足， 剩餘${this.point}點`,
          icon: "warning",
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            this.$emit("pageEvent", { loginData: "logout" }); //* 登出，正式時需秀出來
          }
        });
      } else {
        this.deduct();
      }
    },
    checkDeduct() {
      // 產生看課紀錄及扣點紀錄 xml
      // let bDate = this.bdate;
      // if (!bDate) bDate = DateFormat.localDate(new Date(), true);
      let bDate = DateFormat.localDate(new Date(), true);
      let eDate = bDate;
      let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:header/>
      <soapenv:Body>
      <PMBSTDLOD07.Execute xmlns="CEK">
      <Studentpid>${this.email}</Studentpid>
      <Bdate>${bDate}</Bdate>
      <Edate>${eDate}</Edate>
      </PMBSTDLOD07.Execute>
      </soapenv:Body>
      </soapenv:Envelope>
      `;
      this.$store.dispatch("user/courseAndDeduct", xmls); // tc
    },
    deductRecord(data) {
      if (
        data.Envelope.Body["PMBSTDLOD07.ExecuteResponse"].Bdate !== undefined
      ) {
        this.getRecord();
      } else {
        this.$swal({
          text: "發生錯誤，無法查詢看課紀錄及扣點紀錄",
          icon: "error",
          animation: false,
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: false,
        });
      }
    },
    getRecord() {
      //查詢看課紀錄及扣點紀錄
      this.$store.dispatch("user/courseDeductRecord", this.email);
    },
    handleRecord(data) {
      // let vDate = null;
      // let vTime = null;
      // let vCode = null;
      let timeData = data.ScribelogView.Viewdata;
      console.log(timeData);
      if (timeData !== undefined) {
        let lastTime = lastDeduct(timeData, this.courseSeq);
        let lastDate = new Date(lastTime);
        let lastHours = DateFormat.timeFormat(lastDate, "h");
        let nowDate = new Date();
        let hours = DateFormat.timeFormat(nowDate, "h");
        let mins = DateFormat.timeFormat(nowDate, "i");
        console.log(lastTime, lastDate, lastHours, hours, mins);
        // 有紀錄沒扣點則扣1點
        if (!lastTime) {
          this.userPoint();
        } else {
          if (hours - lastHours > 1) {
            // 表示間隔時段
            console.log("跳過幾個時段後進入的");
            this.deduct();
          } else if (hours > lastHours) {
            if (mins >= 10) {
              //已進入 XX時10分
              console.log(hours, lastHours, "已進入新時段");
              this.userPoint();
            } else {
              this.goVideo();
            }
          } else {
            this.goVideo();
          }
        }
      } else {
        // 查無紀錄則扣點
        this.userPoint();
      }
      // if (!this.bdate) {
      //   // 沒指定日期則表示篩選當天紀錄，並取出最後一次扣點紀錄
      //   if (timeData !== undefined) {
      //     let lastTime = lastDeduct(timeData);
      //     let lastDate = new Date(lastTime);
      //     let lastHours = DateFormat.timeFormat(lastDate, "h");

      //     let nowDate = new Date();
      //     let hours = DateFormat.timeFormat(nowDate, "h");
      //     let mins = DateFormat.timeFormat(nowDate, "i");
      //     console.log(lastTime, lastHours, hours, mins);
      //     // 有紀錄沒扣點則扣1點
      //     if (!lastTime) {
      //       this.userPoint();
      //     } else {
      //       if (hours > lastHours) {
      //         if (mins >= 10) {
      //           //已進入 XX時10分
      //           console.log(hours, lastHours, "已進入新時段");
      //           this.userPoint();
      //         }
      //       } else {
      //         this.goVideo(); // 放心 else 判斷篩選紀錄時有保存了
      //       }
      //     }
      //   } else {
      //     // 查無紀錄則扣點
      //     this.userPoint();
      //   }
      // } else {
      //   console.log("timeData", timeData);
      //   console.log("timeData.length", Array.from(timeData).length);
      //   if (timeData !== undefined) {
      //     // 有指定則篩出過去紀錄取得參數值
      //     if (Array.from(timeData).length > 0) {
      //       timeData.forEach((dateObj) => {
      //         vDate = dateObj.VDate;
      //         vCode = dateObj.VLODCode;
      //         // this.code = "B1B053C001D239E370F09A02000"; //* 測試
      //         // 以日期、編碼篩出指定的紀錄
      //         console.log(
      //           this.code,
      //           vCode,
      //           "this.code === vCode",
      //           this.code === vCode,
      //           "this.historyDate === vDate",
      //           this.historyDate === vDate,
      //           "this.historyDateNoZero === vDate",
      //           this.historyDateNoZero === vDate
      //         );
      //         if (
      //           (this.historyDate === vDate ||
      //             this.historyDateNoZero === vDate) &&
      //           this.code === vCode
      //         ) {
      //           vTime = dateObj.VTime;
      //           this.courseSeq = dateObj.VCCourseq;
      //           this.subjString =
      //             dateObj.VCYear +
      //             dateObj.VCTestID +
      //             dateObj.VCObjectID +
      //             dateObj.VCClassID +
      //             dateObj.VCSubjectID +
      //             dateObj.VCTechertID;
      //         }
      //       });
      //     } else {
      //       vDate = timeData.VDate;
      //       vCode = timeData.VLODCode;

      //       if (
      //         (this.historyDate === vDate ||
      //           this.historyDateNoZero === vDate) &&
      //         this.code === vCode
      //       ) {
      //         this.courseSeq = timeData.VCCourseq;
      //         this.subjString =
      //           timeData.VCYear +
      //           timeData.VCTestID +
      //           timeData.VCObjectID +
      //           timeData.VCClassID +
      //           timeData.VCSubjectID +
      //           timeData.VCTechertID;
      //       }
      //     }
      //   }
      //   // 有紀錄則接下去查當天記錄;
      //   if (this.courseSeq !== "0" && this.courseSeq && this.subjString) {
      //     this.bdate = null;
      //     this.checkDeduct();
      //   } else {
      //     this.$swal({
      //       text: "查無課程資料，請洽櫃台!",
      //       icon: "error",
      //       timer: 0,
      //       allowOutsideClick: false,
      //       showConfirmButton: true,
      //     });
      //   }

      //   console.log(
      //     "historyDate:",
      //     this.historyDate,
      //     "Time:",
      //     vTime,
      //     "courseSeq:",
      //     this.courseSeq,
      //     "subjString:",
      //     this.subjString,
      //     "courseId:",
      //     this.courseId,
      //     "videoCode:",
      //     this.code
      //   );
      // }
    },
    deduct() {
      // 扣點處理;
      this.$swal({
        text: `您目前點數為:${this.point},本時段將使用1點`,
        icon: "warning",
        animation: false,
        timer: 0,
        showDenyButton: true,
        reverseButtons: true,
      }).then((res) => {
        if (res.isConfirmed) {
          let nowdate = new Date();
          let vlsdate = DateFormat.localDate(nowdate, true);
          let vlstime = DateFormat.timeFormat(nowdate, "h:i:s");

          let xmls = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
            <soapenv:header/>
            <soapenv:Body>
            <PBNSTDVLSSUB.Execute xmlns="CEK">
            <Studentpid>${this.email}</Studentpid>
            <Courseseq>${this.courseSeq}</Courseseq>
            <Depofip>${this.stb_ip}</Depofip>
            <Subjectstring>${this.subjString}</Subjectstring>
            <V01101>${this.courseId}</V01101>
            <V01001>${this.code}</V01001>
            <Vlssubpoint>1</Vlssubpoint>
            <Vlsdate>${vlsdate}</Vlsdate>
            <Vlstime>${vlstime}</Vlstime>
            </PBNSTDVLSSUB.Execute>
            </soapenv:Body>
            </soapenv:Envelope>
                `;

          this.$store.dispatch("user/deductPoint", xmls);
        }
      });
    },
    handleDeduct(data) {
      if (
        data.Envelope.Body["PBNSTDVLSSUB.ExecuteResponse"].Rtncode.__text ===
        "ok"
      ) {
        this.$swal({
          text: `已使用1點`,
          icon: "success",
          animation: false,
          timer: 1500,
          showConfirmButton: false,
        });
        this.goVideo();
      } else {
        this.$swal({
          text: `發生錯誤，使用點數失敗`,
          icon: "error",
          animation: false,
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: true,
        });
      }
    },
    goVideo() {
      if (
        this.courseName &&
        this.code &&
        this.timeCode &&
        this.subjString &&
        this.courseSeq &&
        this.courseId
      ) {
        this.$router.push({
          name: "Course",
          params: {
            name: this.courseName,
            fullName: this.fullName,
            videoFile: this.code,
            playTimecode: this.timeCode,
            subjString: this.subjString,
            courseSeq: this.courseSeq,
            courseId: this.courseId,
            fromEpisode: false,
          },
        });
      } else {
        this.$swal({
          text: "無法查詢到課程相關資料",
          icon: "error",
          animation: false,
          timer: 0,
          allowOutsideClick: false,
          showConfirmButton: true,
        });
      }
    },
    checkVideo(
      fullName,
      courseSeq,
      subjectString,
      courId,
      code,
      title,
      timecode,
      updated_at
    ) {
      // let courseList = window.sessionStorage.getItem("courseList");
      console.log(
        fullName,
        courseSeq,
        subjectString,
        courId,
        code,
        title,
        timecode,
        updated_at
      );

      // this.lessonHid = lesson_hid;
      // this.courseName = course_title.replace(/\d/, ";");

      this.fullName = fullName.replace(new RegExp(/\s+/, "gi"), ";");
      this.courseSeq = courseSeq;
      this.subjString = subjectString;
      this.courseName = title;
      this.courseId = courId; // 課程代碼
      this.code = code; // 影片編碼
      this.timeCode = timecode;
      this.historyDateTime = updated_at;

      // 觀看紀錄時間換成台灣格式
      this.historyDateNoZero = DateFormat.localDate(
        new Date(updated_at),
        false
      );
      this.historyDate = DateFormat.localDate(new Date(updated_at), true);
      this.bdate = this.historyDate;
      this.autoCheck = false; // 使用者點看課
      this.checkReserved(); // 檢查預約
    },
    editDialog(item) {
      this.editedItem = Object.assign({}, item);
      const date = new Date(item.time);
      this.editedItem.time =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      this.editWindows = true;
    },
    deleteDialog(item) {
      this.editedItem = item;
      this.dialogDelete = true;
    },
    closeDialog() {
      this.editWindows = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },
    editNote() {
      // 筆記:編輯
      const data = {
        data: {
          hid: this.editedItem.hid,
          content: this.editedItem.note,
        },
      };
      this.$store.dispatch("class/editCourseNote", data);
    },
    deleteNote() {
      // 筆記:刪除
      const data = {
        data: {
          hid: this.editedItem.hid,
        },
      };
      this.$store.dispatch("class/deleteCourseNote", data);
    },
    reLoadNotes() {
      this.getNotesList();
      this.$swal({
        icon: "success",
        animation: false,
        timer: 1500,
        showConfirmButton: false,
      });
    },
    formatTime(secs) {
      let hr = Math.floor(secs / 3600);
      let min = Math.floor((secs - hr * 3600) / 60);
      let sec = parseInt(secs - hr * 3600 - min * 60);
      let time = "";
      if (hr > 0) {
        time = hr + "小時";
      }
      if (min > 0) {
        time += min + "分";
      }
      if (sec > 0) {
        time += sec + "秒";
      }
      if (!time) time = secs - hr * 3600 - min * 60 + "秒";
      return time;
    },
    formatSecond(secs) {
      let hr = Math.floor(secs / 3600);
      let min = Math.floor((secs - hr * 3600) / 60);
      let sec = parseInt(secs - hr * 3600 - min * 60);

      if (hr < 10) {
        hr = "0" + hr;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      return hr + ":" + min + ":" + sec;
    },
    formatDate(dateTime) {
      let date = new Date(dateTime);
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    },
    goback() {
      this.$router.go(-1);
    },
    loading() {
      this.$eventBus.$emit("loading"); // 發出 loading 需求
    },
    closeLoading() {
      this.$eventBus.$emit("loadClose"); // 發出關閉 loading
    },
  },
  created() {
    this.$eventBus.$on("checkReserved", () => {
      // this.autoCheck = true; // 自動檢查
      this.userValidate();
    });
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // removing eventBus listener
    this.$eventBus.$off("checkReserved");
  },
};
</script>
