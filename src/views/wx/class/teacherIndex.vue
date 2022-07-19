<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="培训班次" prop="className">
        <!--<el-input-->
          <!--v-model="queryParams.className"-->
          <!--placeholder="请输入短期培训课程名称"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
        <el-input
          v-model="queryParams.className"
          placeholder="请输入短期培训课程名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetForm"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!--<el-row :gutter="10" class="mb8">-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['wx:class:export']"-->
          <!--&gt;导出</el-button-->
        <!--&gt;-->
      <!--</el-col>-->
      <!--<right-toolbar-->
        <!--:showSearch.sync="showSearch"-->
        <!--@queryTable="getList"-->
      <!--&gt;</right-toolbar>-->
    <!--</el-row>-->
    <el-table
    class="father"
      v-loading="loading"
      :data="classList"
      @selection-change="handleSelectionChange"
      @cell-dblclick="bccelldblclick"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="班次编号" align="center" prop="id" width="180"/>
      <el-table-column label="培训班次" align="center" prop="name" width="250">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.name" placement="top">
            <span style="
                width: 100%; max-height: 80px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;"
            >
            {{ scope.row.name }}
          </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="报到地点" align="center" prop="reportPlace" :formatter="reportPlaceFormatter"/>
      <el-table-column label="培训地点" align="center" prop="classroomPlace" :show-overflow-tooltip="true" :formatter="classroomPlaceFormatter"/>
      <el-table-column label="报名人数" align="center" prop="applyNum" />
      <el-table-column label="培训费用（元）" align="center" prop="money" />
      <el-table-column label="培训类型" align="center" prop="trainType">
        <template slot-scope="scope">
          <span>{{ scope.row.trainType == "0" ? "线上" : "线下" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="250px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="handleInfo(scope.row)"
            v-hasPermi="['wx:staff:query']"
            >报名详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="exportExcel(scope.row)"
          >导出</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="queryTotalAmount(scope.row)"
          >总金额</el-button
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
    <el-dialog :title="'缴费总金额'" center :visible.sync="totalAmountOpen" >
      <div align="center" style="margin: 20px 0"><span style="font-size: 30px">{{"班次缴费金额:"+toTalAmount}}元</span></div>
    </el-dialog>
  </div>
</template>

<script>
import { teacherClass, getStudentById,getStudentExportById,queryClassTotalAmount, getStudentExport2ById } from "@/api/wx/class";
import studentApply from "@/views/wx/class/studentApply";
export default {
  data() {
    return {
      loading: false,
      // 显示搜索条件
      showSearch: true,
      classList: null,
      total: 0,
      studentTotal: 0,
      merchant: null,
      text: null,
      // 学员弹窗
      openStudentMsg: false,
      //班次缴费总金额
      toTalAmount:null,
      totalAmountOpen: false,
      // 学员数据
      studentMsg: null,
      studentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        shortClassId: null,
        userName: null,
        idNumber: null,
        mobilePhone: null
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        className: "",
      },
      title: null,
      pxddOptions: [],//培训地点列表
    };
  },
  components: {
    studentApply
  },
  created() {
    this.getDicts("sys_pxdd").then(response => {
      this.pxddOptions = response.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    //报道地点
    reportPlaceFormatter(row, column) {
      return this.selectDictLabel(this.pxddOptions, row.reportPlace);
    },
    //培训地点
    classroomPlaceFormatter(row, column) {
      return this.selectDictLabel(this.pxddOptions, row.classroomPlace);
    },
    getList() {
      this.loading = true;
      teacherClass(this.queryParams).then(response => {
        //  console.log(response);
        this.classList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleClose(done) {
      this.studentQueryParams.pageNum=1;
      done();
    },

    handleSelectionChange() {},
    bccelldblclick() {},
    handleInfo(e) {
      this.$router.push("/teacherIndex/teacherIndexDetail/" + e.id)
    },
    //根据班次名称进行搜索
    handleQuery() {
      this.getList(this.queryParams.name);
    },
    resetForm() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        name: null,
        applyEnd: null,
        reportStart: null,
        reportEnd: null,
        courseStart: null,
        courseEnd: null,
        reportPlace: null,
        classroomPlace: null,
        courseContent: null,
        cost: null,
        contacts: null,
        money: null,
        classTeacher: null,
        applyNum: null,
        maximum: null,
        theoryCourseCount: null,
        trainingCourseCount: null,
        certificateCount: null,
        url: null,
        trainType: null,
        createUser: null,
        updateUser: null
      };
      this.handleQuery();
    },
    exportExcel(row){
      let that = this;
      let notify;
      this.$confirm('确定要"导出""' + row.name + '"的报名人员信息吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        notify = that.$notify({
          title: '提示',
          message: '正在导出' + row.name + '的人员名单...',
          duration: 0,
          showClose: false
        });
        return getStudentExport2ById(row.id);
      }).then((response) => {
        notify && notify.close();
        that.download(response.msg);
        that.$notify.success({
          title: '提示',
          message: '导出' + row.name + '的报名人员信息成功',
          duration: 5000
        });
      }).catch(function() {
        notify && notify.close();
        notify ? (that.$notify.error({
          title: '提示',
          message: '导出' + row.name + '的报名人员信息失败',
          duration: 5000
        })) : (that.$notify.info({
          title: '提示',
          message: '导出' + row.name + '的报名人员信息已取消',
          duration: 5000
        }));
      })

    },
    addDate() {
      let nowDate = new Date();
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
        hour: nowDate.getHours(),
        minute: nowDate.getMinutes(),
        second: nowDate.getSeconds(),
      };
      let zero1 = 0,
        zero2 = 0,
        zero3 = 0,
        zero4 = 0,
        zero5 = 0;
      if (date.month >= 10) zero1 = "";
      if (date.date >= 10) zero2 = "";
      if (date.hour >= 10) zero3 = "";
      if (date.minute >= 10) zero4 = "";
      if (date.second >= 10) zero5 = "";
      let systemDate =
        date.year + "" + zero1 + date.month + "" + zero2 + date.date + "";
      return systemDate;
    },
    //查询班次缴费总金额
    queryTotalAmount(row){
      queryClassTotalAmount(row.id).then(response =>{
        console.log(response)
        this.toTalAmount = response.data
        console.log(this.toTalAmount)
        this.totalAmountOpen =true;
      })
    }
  },
};
</script>

<style scoped>
  /deep/.el-dialog {
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    /*height:600px;*/
    max-height:calc(100% - 200px);
    max-width:calc(100% - 30px);
  }
  /deep/.el-dialog .el-dialog__body {
    flex:1;
    overflow: auto;
  }
</style>
