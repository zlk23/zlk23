<template>
  <div class="app-container">
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="操作时间" prop="operTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.operTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择操作时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- 
      <el-form-item label="确诊人数" prop="sureNum">
        <el-input
          v-model="queryParams.sureNum"
          placeholder="请输入确诊人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="无症状人数" prop="asymptomaticNum">
        <el-input
          v-model="queryParams.asymptomaticNum"
          placeholder="请输入无症状人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生人数" prop="stuNum">
        <el-input
          v-model="queryParams.stuNum"
          placeholder="请输入学生人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="教职工人数" prop="teacherNum">
        <el-input
          v-model="queryParams.teacherNum"
          placeholder="请输入教职工人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用,1启用,0不启用" prop="isUse">
        <el-input
          v-model="queryParams.isUse"
          placeholder="请输入是否启用,1启用,0不启用"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wx:message:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wx:message:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-document-copy"
          size="mini"
          @click="handleClone"
          >克隆</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-document-copy"
          size="mini"
          @click="allRelease"
          >合并发布</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="default"
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefresh"
        >同步</el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="messageList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" align="center" />
      <el-table-column
        label="编号"
        align="center"
        prop="id"
      />
      <el-table-column
        label="消息名称"
        align="center"
        prop="msgName"
      />
      <el-table-column label="地区" align="center" >
        <template slot-scope="scope">
          <span>{{dqChange(scope.row.schoolType)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      />
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建人" align="center"  prop="createUser"/>
      <el-table-column label="发布状态" align="center" >
        <template slot-scope="scope">
          <span>{{scope.row.ifIssue==0?'未发布':'已发布'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="updateTime" />
      
      <!-- <el-table-column label="疑似人数" align="center" prop="maybeNum" /> -->
      <!-- <el-table-column label="学生人数" align="center" prop="stuNum" />
      <el-table-column label="教职工人数" align="center" prop="teacherNum" />
      <el-table-column label="是否启用" align="center" prop="isUse" /> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="release(scope.row)"
            :disabled="scope.row.ifIssue=='0'?false:true"
            >发布</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:message:edit']"
            :disabled="scope.row.ifIssue=='0'?false:true"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:message:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      v-if="open"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
       
        <el-row>
          <el-col :span="24">
            <el-form-item label="地区" :rules="rules.area" prop="schoolType">
              <el-select v-model="form.schoolType"  placeholder="请选择区域">
                <el-option v-for="item in areaList" :key="Number(item.dictValue)" :label="item.dictLabel" :value="Number(item.dictValue)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> 
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="学院检测" name="1">
              <template>
                <el-table :data="form.theDailyCampuses" border style="width: 100%">
                  <el-table-column prop="typeName" label="" width="200">
                  </el-table-column>
                  <el-table-column label="已做人数"  label-width="0">
                    <template slot-scope="scope">
                      <el-form-item label="已做" :rules="rules.resultData" :prop="`theDailyCampuses.${scope.$index}.nucleicAcidsPeople`">
                        <el-input v-model="scope.row.nucleicAcidsPeople" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="未做人数">
                    <template slot-scope="scope">
                      <el-form-item label="未做" :rules="rules.resultData" :prop="`theDailyCampuses.${scope.$index}.unNucleicAcidsPeople`">
                        <el-input v-model="scope.row.unNucleicAcidsPeople"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="当前疫情" name="2">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="新增本土" :rules="rules.nowDate"   prop="jncPresent.newAddPeople">
                      <el-input v-model="form.jncPresent.newAddPeople"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="新增无症状" :rules="rules.nowDate"  prop="jncPresent.newAddAsymptomatic">
                      <el-input v-model="form.jncPresent.newAddAsymptomatic"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="现有确诊" :rules="rules.nowDate"  prop="jncPresent.existingDefiniteCase">
                      <el-input v-model="form.jncPresent.existingDefiniteCase"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="累计确诊" :rules="rules.nowDate"  prop="jncPresent.accumulativeDefiniteCase">
                      <el-input v-model="form.jncPresent.accumulativeDefiniteCase"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="累计治愈" :rules="rules.nowDate"  prop="jncPresent.accumulativeCure">
                      <el-input v-model="form.jncPresent.accumulativeCure"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="累计死亡" :rules="rules.nowDate"  prop="jncPresent.accumulativeDie">
                      <el-input v-model="form.jncPresent.accumulativeDie"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="实时动态" name="3">
                <el-row
                  :gutter="20"
                  v-for="(item, index) in form.epidemicInform"
                  :key="index"
                >
                  <el-col :span="7">
                      <el-date-picker
                        v-model="item.informDate"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      >
                      </el-date-picker>
                  </el-col>
                  <el-col :span="10">
                      <el-input
                        v-model="item.informDetails"
                        placeholder="请输入内容"
                      />
                  </el-col>
                  <el-col :span="7">
                      <el-button
                        type="button"
                        icon="el-icon-delete"
                        @click="delDynamic(item)"
                        >删除</el-button
                      >
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                      <el-button @click="addDynamic">新增动态</el-button>
                  </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="身边疫情" name="4">
              <el-row :gutter="20">
                <el-col
                  :span="12"
                  v-for="(item, index) in form.sideList"
                  :key="index"
                >
                  <el-form-item :label="'坐标' + (parseInt(index) + 1)">
                    <el-input
                      :v-model="item.typeName"
                      :value="item.typeName"
                      @focus="getMap(item.typeName,index)"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="mapShow" v-if="mapShow" title="选择地点"
      :close-on-click-modal="false" width="80%">

      <el-form >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经度" prop="lng">
              <el-input v-model="location.lng"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="">
              <el-input v-model="location.lat"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label=" ">
              <el-button type="primary" @click="positionSure">确 定</el-button>
              <el-button @click="hideMap">取 消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="mapContent">
        <!--<baidu-map class="map" center="济南">
          <bm-marker position="济南火车站" :dragging="true" @click="infoWindowOpen">
            <bm-info-window :show="true" @close="infoWindowClose" @open="infoWindowOpen">济南火车站</bm-info-window>
          </bm-marker> 
        </baidu-map>-->
        <baidu-map
          class="map"
          :scroll-wheel-zoom="true"
          :center="location"
          :zoom="zoom"
          @ready="handler"
          ak="xxx"
        >
          <!-- 地图显示 -->
          <bm-view style="width: 100%; height: 400px; flex: 1"></bm-view>
          <!-- 标记点组件 -->
          <bm-marker
            :position="{ lng: location.lng, lat: location.lat }"
          ></bm-marker>
          <!-- 搜索控件 -->
          <bm-control>
            <bm-auto-complete
              v-model="ruleForm.workAddress"
              :sugStyle="{ zIndex: 999999 }"
              @confirm="handleConfirm"
            >
              <el-input
                v-model="ruleForm.workAddress"
                placeholder="请输入地址来直接查找相关位置"
                style="width: 500px"
              ></el-input>
            </bm-auto-complete>
          </bm-control>
        </baidu-map>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  BaiduMap,
  BmView,
  BmMarker,
  BmControl,
  BmAutoComplete,
} from "vue-baidu-map";
import { 
  listTemplate, 
  getTemplate,//查询
  addTemplate,//add
  updateTemplate,
  delTemplate,
  cloneTemplate,
  releaseTemplate,//发布
  allReleaseTemplate,//合并发布
  refreshTemplate,
   } from "@/api/wx/message/wxtemplate2";

// import {
//   listMessage,
//   getMessage,
//   delMessage,
//   addMessage,
//   updateMessage,
//   exportMessage,
// } from "@/api/wx/message/wxmessage";

import person from "@/views/wx/template/message/person/index.vue";
export default {
  name: "Message",
  components: {
    person,
    BaiduMap,
    BmMarker,
    BmView,
    BmControl,
    BmAutoComplete,
  },
  data() {
    return {
      activeName: "1",
      xyjcData: [
        {
          type: "学员",
          allnum: "1000",
          yznum: "900",
          wznum: "100",
        },
        {
          type: "教师",
          allnum: "1000",
          yznum: "900",
          wznum: "100",
        },
        {
          type: "职工",
          allnum: "1000",
          yznum: "900",
          wznum: "100",
        },
        {
          type: "外委人员",
          allnum: "1000",
          yznum: "900",
          wznum: "100",
        },
      ],
      dqyqData: {
        num1: "",
        num2: "",
        num3: "",
        num4: "",
        num5: "",
        num6: "",
      },
      ssdtData: [
        {
          date: "2022-05-01",
          content: "1111",
        },
        {
          date: "2022-05-02",
          content: "2222",
        },
      ],
      sbyqData: ["36.618139,36.620238", "116.997464,36.618139", "", "", "", "", "", "", "", ""],
      index: "",
      mapShow: false,
      // 要搜索的关键词
      BMap: null,
      // 地图显示的中心坐标
      location: {
        lng: '',
        lat: '',
      },
      // 缩放，15基本上就可以看附近的一些街道了
      zoom: 15,
      keyWord: "",
      ruleForm:{workAddress:''},

      messageId: "",
      tempDic: [],
      codeVal: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //选中地区
      areas:['1','1','2'],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      messageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        operTime: null,
        address: null,
        sureNum: null,
        asymptomaticNum: null,
        stuNum: null,
        teacherNum: null,
        isUse: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        //地区
        area: [
          { required: true, message: "请选择地区", trigger: "blur" }
        ],
        resultData: [
          { required: true, message: "检测结果不能为空", trigger: "blur" }
        ],
        //实时数据
        nowDate: [
          { required: true, message: "当前疫情数据不能为空", trigger: "blur" }
        ],

        newAddPeople:[
          { required: true, message: "当前疫情数据不能为空", trigger: "blur" }
        ],
        //实时动态
        timeDate: [
          { required: true, message: "实时动态不能为空", trigger: "blur" }
        ]
      },
      areaList:[],
    };
  },
  created() {
    this.getList();
    this.getTempList();
    this.getDicts("msg_area_name").then(response => {
      this.areaList = response.data;
    });
  },
  methods: {
    //同步
    handleRefresh(){
      //refreshTemplate
      refreshTemplate();
    },
    selectable(row, index) {
        if (row.ifIssue == '1') {
          return false;
        } else {
          return true;
        }
      },
    dqChange(id){
      console.log("id++++++"+id)
      let selectedName = {};
      selectedName = this.areaList.find((item)=>{
        return item.dictValue == id;
        //筛选出匹配数据，是对应数据的整个对象
      });
      var name=''
      if(selectedName.dictLabel){
        name=selectedName.dictLabel
      }
      return name;
    },
    //位置确认
    positionSure(){
      if(this.location.lng&&this.location.lat){
        var index=this.index;
        var position=this.location.lng+","+this.location.lat;
        var data=this.form.sideList;
        data[index].typeName=position;
        this.$set(this.form,'sideList',data);
        this.$forceUpdate();
        console.log(this.form.sideList)
        this.mapShow=false;
      }else{
        this.$notify({
          title: '提示',
          message: '请选择地点',
          type: 'warning'
        });
      }
    },
    //隐藏地图
    hideMap(){
      this.mapShow=false;
    },
    handler(BMap) {
      this.BMap = BMap;
    },
    handleConfirm({ item }) {
      const that = this;
      let queryString = `${item.value.city}${item.value.district}${item.value.business}`;
      var myGeo = new BMap.Geocoder();
      myGeo.getPoint(queryString, function (point) {
        if (point) {
          // console.log(point, "point");
          that.location = point;
          console.log(that.location)
        }
      });
    },
    //发布
    release(val) {
      const ids=val.id
      const data=val.createTime
      console.log(val)
      this.$confirm(
        '是否确认发布日期为"' + data + '"的推送?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return releaseTemplate({id:ids});
        })
        .then(() => {
          this.msgSuccess("发布成功");
          this.getList()
        });
    },
    isRepeat(){
      var isrepeat=0;
      var ary = this.areas;
      var s = ary.join(",")+",";
      for(var i=0;i<ary.length;i++) {
        if(s.replace(ary[i]+",","").indexOf(ary[i]+",")>-1) {
          console.log("数组中有重复元素：" + ary[i]);
          isrepeat=1
          break;
        }
      }
      return isrepeat;
    },
    //合并发布
    allRelease(){
      const ids =this.ids;
      var pd=this.isRepeat()
      console.log(pd)
      if(ids.length<2){
        this.$notify({
          title: '提示',
          message: '请选择合并发布的消息',
          type: 'warning'
        });
        return false;
      }
      if(pd==1){
        this.$notify({
          title: '提示',
          message: '地区重复,请重新选择',
          type: 'warning'
        });
        return false;
      }
      this.$confirm(
        '是否确认发布编号为"' + ids + '"的推送?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return allReleaseTemplate({ids});
        })
        .then(() => {
          this.getList();
          this.msgSuccess("发布成功");
        });
    },
    //克隆
    handleClone(){
      const ids = this.ids;
      if(ids.length<1){
        this.$notify({
          title: '提示',
          message: '请选择克隆对象',
          type: 'warning'
        });
        return false;
      }
      if(ids.length>1){
        this.$notify({
          title: '提示',
          message: '只能选择一个克隆对象',
          type: 'warning'
        });
        return false;
      }
      this.$confirm(
        '是否克隆编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return cloneTemplate({id:ids[0]});
        })
        .then(() => {
          this.getList();
          this.msgSuccess("克隆成功");
        });
    },
    //新增切换 未用
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //实时动态删除

    delDynamic(item) {
      var index = this.form.epidemicInform.indexOf(item);
      if (index !== -1) {
        this.form.epidemicInform.splice(index, 1);
      }
    },
    addDynamic() {
      if(this.form.epidemicInform.length<5){
        this.form.epidemicInform.push({
          date: "",
          content: "",
        });
      }
    },
    //查询字典
    selectDictLabel(datas, value) {
      var actions = [];
      Object.keys(datas).some((key) => {
        if (datas[key].id == "" + value) {
          actions.push(datas[key].msgName);
          return true;
        }
      });
      return actions.join("");
    },
    getTempName(row, column) {
      return this.selectDictLabel(this.tempDic, row.id);
    },
    /** 查询【请填写功能名称】列表 */
    getTempList() {
      console.log("getTempList");
      //做一个字典，放入供选择，ID，name
      listTemplate().then((response) => {
        this.tempDic = response.rows;
        console.log("getTempList2");
        console.log(this.tempDic);
      });
    },
    emitVal() {
      this.$emit("selected", this.codeVal);
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listTemplate(this.queryParams).then((response) => {
        this.messageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    getMap(item,index) {
      var arr=['117.126399','36.656554']
      if(item!=''){
        arr=item.split(',')
      }
      this.location.lng=arr[0];
      this.location.lat=arr[1];
      this.index = index;
      this.mapShow = true;
      //this.$forceUpdate();  //强制刷新
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
       // schoolType:'',
        //疫情通知对象
        epidemicInform:[{
          informDetails:'' , 
          informDate:'' ,
        }],
        //济南当前疫情数据对象
        jncPresent:{
            newAddPeople:'',
            newAddAsymptomatic:'',
            existingDefiniteCase:'',
            accumulativeDefiniteCase:'',
            accumulativeCure:'',
            accumulativeDie:'',
          },
        //每日校园核酸数据模板对象List
        theDailyCampuses:[{
          id:'1',
          typeName:'学员',
          nucleicAcidsPeople:'' , 
          unNucleicAcidsPeople :'',
        },{
          id:'2',
          typeName:'教师',
          nucleicAcidsPeople:'' , 
          unNucleicAcidsPeople :'',
        },{
          id:'3',
          typeName:'教职工',
          nucleicAcidsPeople:'' , 
          unNucleicAcidsPeople :'',
        },{
          id:'4',
          typeName:'外围人员',
          nucleicAcidsPeople:'' , 
          unNucleicAcidsPeople :'',
        },],
        sideList:[
          {
            typeName:''
          },{
            typeName:''
          },{
            typeName:''
          },{
            typeName:''
          },{
            typeName:''
          },{
            typeName:''
          },{
            typeName:''
          },{
            typeName:''
          },{
            typeName:''
          },{
            typeName:''
          },
        ],
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      //记录勾选城市
      this.areas = selection.map((item) => item.schoolType);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增消息";
      this.messageId = "";
      this.activeName='1';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.activeName='1';
      const id = row.id || this.ids;
      var $this=this;
      getTemplate(id).then((response) => {
        //console.log(response.data)
        var data=response.data;
        //$this.form = response.data;
        $this.$set($this.form,'id',data.id);
        $this.$set($this.form,'schoolType',data.schoolType);
        $this.$set($this.form,'epidemicInform',data.epidemicInform);
        $this.$set($this.form,'jncPresent',data.jncPresent);
        $this.$set($this.form,'theDailyCampuses',data.theDailyCampuses);
        $this.$set($this.form,'sideList',data.sideList);
        console.log($this.form)
        $this.$forceUpdate()
        $this.open = true;
        $this.title = "修改新增";
        $this.messageId = response.data.id;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form)
          if (this.form.id != null) {
            updateTemplate(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTemplate(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              //this.messageId = response.data.id;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除消息列表编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTemplate(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>
<style scoped>
.map {
  width: 100%;
  height: 400px;
}

.el-row {
  margin-bottom: 20px;
}
</style>
