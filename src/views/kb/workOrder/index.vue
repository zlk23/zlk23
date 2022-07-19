<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单编号" prop="workOrderNum">
        <el-input
          v-model="queryParams.workOrderNum"
          placeholder="请输入工单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工单类型" prop="workOrderType">
        <el-select v-model="queryParams.workOrderType" placeholder="请选择工单类型" clearable size="small">
          <el-option v-for="workOrderType in workOrderTypeOptions" :label="workOrderType.dictLabel" :value="workOrderType.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理结果" prop="result">
        <el-select v-model="queryParams.result" placeholder="请选择处理结果" clearable size="small">
          <el-option label="已完成" value="已完成" />
          <el-option label="未完成" value="未完成" />
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
          v-hasPermi="['workOrder:workOrder:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['workOrder:workOrder:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['workOrder:workOrder:remove']"-->
        <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['workOrder:workOrder:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工单编号" align="center" prop="workOrderNum" />
      <el-table-column label="工单类型" align="center" prop="workOrderType" />
      <el-table-column label="工单详情" align="center" prop="workOrderDetail" />
      <el-table-column label="处理结果" align="center" prop="result" />
      <!--<el-table-column label="修改状态" align="center" prop="changeStatus" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleGoDetail(scope.row)"
            v-hasPermi="['workOrder:workOrder:edit']"
          >详情管理</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workOrder:workOrder:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['workOrder:workOrder:remove']"-->
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

    <!-- 添加或修改工单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工单编号" prop="workOrderNum">
          <el-input v-model="form.workOrderNum" placeholder="请输入工单编号" />
        </el-form-item>
        <el-form-item label="工单类型" prop="workOrderType">
          <el-select v-model="form.workOrderType" placeholder="请选择工单类型" clearable size="small">
            <el-option v-for="workOrderType in workOrderTypeOptions" :label="workOrderType.dictLabel" :value="workOrderType.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单详情" prop="workOrderDetail">
          <el-input v-model="form.workOrderDetail" placeholder="请输入工单详情" />
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-select v-model="form.result" placeholder="请选择处理结果" clearable size="small">
            <el-option label="已完成" value="已完成" />
            <el-option label="未完成" value="未完成" />
          </el-select>
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
import { listWorkOrder, getWorkOrder, delWorkOrder, addWorkOrder, updateWorkOrder, exportWorkOrder } from "@/api/kb/workOrder/workOrder";

export default {
  name: "WorkOrder",
  components: {
  },
  data() {
    return {
      workOrderTypeOptions: [
        {dictLabel: "后勤服务", dictValue: "后勤服务"},
        {dictLabel: "培训教学", dictValue: "培训教学"}
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
      // 工单表格数据
      workOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workOrderNum: null,
        workOrderType: null,
        workOrderDetail: null,
        result: null,
        changeStatus: null,
      },
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
    /** 查询工单列表 */
    getList() {
      this.loading = true;
      listWorkOrder(this.queryParams).then(response => {
        this.workOrderList = response.rows;
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
        workOrderNum: null,
        workOrderType: null,
        workOrderDetail: null,
        result: null,
        createTime: null,
        updateTime: null,
        changeStatus: 0,
        updateBy: null
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
    handleGoDetail(row) {
      this.$router.push('/order/detail/' + row.id)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWorkOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWorkOrder(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWorkOrder(this.form).then(response => {
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
      this.$confirm('是否确认删除工单编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWorkOrder(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有工单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportWorkOrder(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
