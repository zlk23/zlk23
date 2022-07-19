<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="85px">
      <el-form-item label="班次类型" prop="shortClassType">
        <el-select v-model="queryParams.shortClassType" placeholder="请选择班次类型" clearable size="small">
          <el-option v-for="shortClassType in shortClassTypeOptions" :label="shortClassType.dictLabel" :value="shortClassType.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-select v-model="queryParams.department" placeholder="请选择部门" clearable size="small">
          <el-option v-for="department in departmentOptions" :label="department.dictLabel" :value="department.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="短期班名称" prop="shortClassName">
        <el-input
          v-model="queryParams.shortClassName"
          placeholder="请输入短期班名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="开始时间" prop="startTime">-->
        <!--<el-date-picker clearable size="small" style="width: 200px"-->
          <!--v-model="queryParams.start"-->
          <!--type="date"-->
          <!--value-format="yyyy-MM-dd"-->
          <!--placeholder="选择开始时间">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="结束时间" prop="endTime">-->
        <!--<el-date-picker clearable size="small" style="width: 200px"-->
          <!--v-model="queryParams.end"-->
          <!--type="date"-->
          <!--value-format="yyyy-MM-dd"-->
          <!--placeholder="选择结束时间">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ywyx:shortClassDetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ywyx:shortClassDetail:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['ywyx:shortClassDetail:remove']"-->
        <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['ywyx:shortClassDetail:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shortClassDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班次类型" align="center" prop="shortClassType" />
      <el-table-column label="部门" align="center" prop="department" />
      <el-table-column label="短期班名称" align="center" prop="shortClassName" />
      <el-table-column label="学员数量" align="center" prop="studentNum" />
      <el-table-column label="培训地点" align="center" prop="peiXunPlace" />
      <el-table-column label="主办单位" align="center" prop="zhuBanDanWei" />
      <el-table-column label="承办单位" align="center" prop="chengBanDanWei" />
      <el-table-column label="上课地点" align="center" prop="attendClassPlace" />
      <el-table-column label="授课老师" align="center" prop="teacherName" />
      <el-table-column label="课程表地址" align="center" prop="timetable" width="180"/>
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.start, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.end, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="修改状态" align="center" prop="changeStatus" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ywyx:shortClassDetail:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['ywyx:shortClassDetail:remove']"-->
          <!--&gt;删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改短期班培训详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="班次类型" prop="shortClassType">
          <el-select v-model="form.shortClassType" placeholder="请选择班次类型" clearable size="small">
            <el-option v-for="shortClassType in shortClassTypeOptions" :label="shortClassType.dictLabel" :value="shortClassType.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择部门" clearable size="small">
            <el-option v-for="department in departmentOptions" :label="department.dictLabel" :value="department.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="短期班名称" prop="shortClassName">
          <el-input v-model="form.shortClassName" placeholder="请输入短期班名称" />
        </el-form-item>
        <el-form-item label="学员数量" prop="studentNum">
          <el-input v-model="form.studentNum" placeholder="请输入学员数量" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培训地点" prop="peiXunPlace">
          <el-input v-model="form.peiXunPlace" placeholder="请输入培训地点" />
        </el-form-item>
        <el-form-item label="主办单位" prop="zhuBanDanWei">
          <el-input v-model="form.zhuBanDanWei" placeholder="请输入主办单位" />
        </el-form-item>
        <el-form-item label="承办单位" prop="chengBanDanWei">
          <el-input v-model="form.chengBanDanWei" placeholder="请输入承办单位" />
        </el-form-item>
        <el-form-item label="上课地点" prop="attendClassPlace">
          <el-input v-model="form.attendClassPlace" placeholder="请输入上课地点" />
        </el-form-item>
        <el-form-item label="授课老师" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入授课老师" />
        </el-form-item>
        <el-form-item label="课程表地址" prop="timetable">
          <el-input v-model="form.timetable" placeholder="请输入课程表地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listShortClassDetail, getShortClassDetail, delShortClassDetail, addShortClassDetail, updateShortClassDetail, exportShortClassDetail } from "@/api/kb/businessOperate/shortClassDetail";

export default {
  name: "ShortClassDetail",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 短期班培训详情表格数据
      shortClassDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shortClassType: null,
        department: null,
        shortClassName: null,
        studentNum: null,
        startTime: null,
        endTime: null,
        peiXunPlace: null,
        zhuBanDanWei: null,
        chengBanDanWei: null,
        attendClassPlace: null,
        teacherName: null,
        timetable: null,
        changeStatus: null,
      },
      shortClassTypeOptions: [
        {dictValue: "计划内", dictLabel: "计划内"},
        {dictValue: "委托类", dictLabel: "委托类"},
        {dictValue: "公司临增", dictLabel: "公司临增"}
      ],
      departmentOptions: [
        {dictValue: "综合", dictLabel: "综合"},
        {dictValue: "网学", dictLabel: "网学"},
        {dictValue: "建设", dictLabel: "建设"},
        {dictValue: "营销", dictLabel: "营销"},
        {dictValue: "检修", dictLabel: "检修"},
        {dictValue: "运行", dictLabel: "运行"}
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询短期班培训详情列表 */
    getList() {
      this.loading = true;
      listShortClassDetail(this.queryParams).then(response => {
        this.shortClassDetailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        shortClassType: null,
        department: null,
        shortClassName: null,
        studentNum: null,
        startTime: null,
        endTime: null,
        peiXunPlace: null,
        zhuBanDanWei: null,
        chengBanDanWei: null,
        attendClassPlace: null,
        teacherName: null,
        timetable: null,
        createTime: null,
        changeStatus: 0,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加短期班培训详情";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getShortClassDetail(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改短期班培训详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateShortClassDetail(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShortClassDetail(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除短期班培训详情编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delShortClassDetail(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有短期班培训详情数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportShortClassDetail(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
