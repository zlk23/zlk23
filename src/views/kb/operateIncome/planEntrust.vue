<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="部门" prop="department">
        <el-select v-model="queryParams.department" placeholder="请选择部门" clearable size="small">
          <el-option v-for="department in departmentOptions" :label="department.dictLabel" :value="department.dictValue" />
        </el-select>
      </el-form-item>
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
          v-hasPermi="['jysr:weituo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['jysr:weituo:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['jysr:weituo:remove']"-->
        <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['jysr:weituo:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planEntrustList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="部门" align="center" prop="department" />
      <el-table-column label="计划总数" align="center" prop="jiHuaAmount" />
      <el-table-column label="上周计划内总数" align="center" prop="jiHuaLastWeek" />
      <el-table-column label="本周计划内总数" align="center" prop="jiHuaThisWeek" />
      <el-table-column label="委托总数" align="center" prop="weiTuoAmount" />
      <el-table-column label="上周委托总数" align="center" prop="weiTuoLastWeek" />
      <el-table-column label="本周委托总数" align="center" prop="weiTuoThisWeek" />
      <!--<el-table-column label="修改状态" align="center" prop="changeStatus" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jysr:weituo:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['jysr:weituo:remove']"-->
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

    <!-- 添加或修改经营收入-计划委托对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择部门" clearable size="small">
            <el-option v-for="department in departmentOptions" :label="department.dictLabel" :value="department.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划总数" prop="jiHuaAmount">
          <el-input v-model="form.jiHuaAmount" placeholder="请输入计划总数" />
        </el-form-item>
        <el-form-item label="上周计划内总数" prop="jiHuaLastWeek">
          <el-input v-model="form.jiHuaLastWeek" placeholder="请输入上周计划内总数" />
        </el-form-item>
        <el-form-item label="本周计划内总数" prop="jiHuaThisWeek">
          <el-input v-model="form.jiHuaThisWeek" placeholder="请输入本周计划内总数" />
        </el-form-item>
        <el-form-item label="委托总数" prop="weiTuoAmount">
          <el-input v-model="form.weiTuoAmount" placeholder="请输入委托总数" />
        </el-form-item>
        <el-form-item label="上周委托总数" prop="weiTuoLastWeek">
          <el-input v-model="form.weiTuoLastWeek" placeholder="请输入上周委托总数" />
        </el-form-item>
        <el-form-item label="本周委托总数" prop="weiTuoThisWeek">
          <el-input v-model="form.weiTuoThisWeek" placeholder="请输入本周委托总数" />
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
import { listJihuaWeituo, getJihuaWeituo, delJihuaWeituo, addJihuaWeituo, updateJihuaWeituo, exportJihuaWeituo } from "@/api/kb/operateIncome/planEntrust";

export default {
  name: "planEntrust",
  components: {
  },
  data() {
    return {
      departmentOptions: [
        {dictLabel: "运行", dictValue: "运行"},
        {dictLabel: "检修", dictValue: "检修"},
        {dictLabel: "营销", dictValue: "营销"},
        {dictLabel: "建设", dictValue: "建设"},
        {dictLabel: "网学", dictValue: "网学"},
        {dictLabel: "综合", dictValue: "综合"}
      ],
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
      // 经营收入-计划委托表格数据
      planEntrustList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        department: null,
        jiHuaAmount: null,
        jiHuaLastWeek: null,
        jiHuaThisWeek: null,
        weiTuoAmount: null,
        weiTuoLastWeek: null,
        weiTuoThisWeek: null,
        changeStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询经营收入-计划委托列表 */
    getList() {
      this.loading = true;
      listJihuaWeituo(this.queryParams).then(response => {
        this.planEntrustList = response.rows;
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
        department: null,
        jiHuaAmount: null,
        jiHuaLastWeek: null,
        jiHuaThisWeek: null,
        weiTuoAmount: null,
        weiTuoLastWeek: null,
        weiTuoThisWeek: null,
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
      this.title = "添加经营收入-计划委托";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getJihuaWeituo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改经营收入-计划委托";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateJihuaWeituo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJihuaWeituo(this.form).then(response => {
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
      this.$confirm('是否确认删除经营收入-计划委托编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delJihuaWeituo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有经营收入-计划委托数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportJihuaWeituo(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
