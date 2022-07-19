<template>
  <div class="enrollDetails">
    <el-form
    class="search-form"
      :model="studentQueryParams"
      ref="studentQueryParams"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="姓名" prop="userName">
        <el-input
          v-model="studentQueryParams.userName"
          placeholder="请输入培训人员姓名"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input
          v-model="studentQueryParams.idNumber"
          placeholder="请输入培训人员身份证号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobilePhone">
        <el-input
          v-model="studentQueryParams.mobilePhone"
          placeholder="请输入培训人员手机号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="getAllStudentById(studentQueryParams)"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetStudentForm"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="info-title">
      <span>{{ title }}</span>
    </div>
<div class="div-table">
        <el-table
      class="table"
      v-loading="loading"
      :data="studentMsg"
      @selection-change="handleSelectionChange"
      @cell-dblclick="bccelldblclick"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="编号" align="center" type="index" />
      <!-- <el-table-column label="人脸信息" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.imagePath"
              :fit="fit"
            ></el-image>
          </template>
        </el-table-column>-->
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex == "1" ? "男" : "女" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" align="center" prop="nation" />
      <el-table-column label="是否清真" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.qingZhen ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="身份证号"
        align="center"
        prop="idNumber"
        width="180"
      />
      <el-table-column
        label="手机号"
        align="center"
        prop="mobilePhone"
        width="120"
      />
      <el-table-column label="单位" align="center" prop="companyName" />
      <el-table-column label="部门" align="center" prop="department" />
      <el-table-column label="职位" align="center" prop="duty" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.isGraduate == "1"
              ? "已结业"
              : scope.row.isRegister == "1"
              ? "已报到"
              : scope.row.isArrive == "1"
              ? "已入园"
              : scope.row.isApply == "1"
              ? "已报名"
              : ""
          }}</span>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="网络大学账号" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.isWldx == "0" ? "无" : scope.row.isWldx == "1" ? "有" : ""
          }}</span>
          <span></span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      class="pagination"
      v-show="studentTotal > 0"
      :total="studentTotal"
      :page-sizes="[10, 100, 150, 200]"
      :page.sync="studentQueryParams.pageNum"
      :limit.sync="studentQueryParams.pageSize"
      @pagination="getAllStudentById"
    />
</div>
  </div>
</template>

<script>
import { teacherClass, getStudentById,getStudentExportById,queryClassTotalAmount } from "@/api/wx/class";
import studentApply from "@/views/wx/class/studentApply";
export default {
  data() {
    return {
      showSearch: true,
      loading: false,
      studentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        shortClassId: null,
        userName: null,
        idNumber: null,
        mobilePhone: null,
      },
      studentMsg: null,
      studentTotal: null,
      openStudentMsg: false,
      title: "",
    };
  },
  created() {
    const id = this.$route.params.shortClassId;
    const title = this.$route.query.title;
    console.log("title", title);
    this.title = title;
    this.studentQueryParams.shortClassId = id;
    console.log(id);
    this.getAllStudentById(this.studentQueryParams);
  },
  mounted() {
    this.getAllStudentById(this.studentQueryParams);
  },
  methods: {
    handleSelectionChange() {},
    getAllStudentById(studentQueryParams) {
      console.log("看看执行了没");
      // 获取学生报名详情
      console.log(studentQueryParams);
      getStudentById(studentQueryParams).then((response) => {
        console.log(response);
        if (response.code == 200) {
          this.studentMsg = response.rows;
          this.studentTotal = response.total;
          this.openStudentMsg = true;
        }
      });
    },
    resetStudentForm() {
      console.log(this.studentQueryParams)
      let id =this.studentQueryParams.shortClassId;
      this.studentQueryParams = {
        shortClassId: id,
        userName: null,
        idNumber: null,
        mobilePhone1: null
      }
      console.log(this.studentQueryParams)
    },
  },
};
</script>

<style>
.pagination {
  margin-bottom: 30px;
}
.search-form {
    margin-top: 20px;
}
.div-table {
    margin: 20px;
}
.info-title {
    margin-left: 20px;
}

</style>