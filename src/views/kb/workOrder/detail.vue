<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="审核状态" prop="checkStatus">
        <el-select v-model="queryParams.checkStatus" placeholder="请选择审核状态" clearable size="small">
          <el-option v-for="checkStatus in checkStatusOptions" :label="checkStatus.dictLabel" :value="checkStatus.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="verifier">
        <el-input
          v-model="queryParams.verifier"
          placeholder="请输入审核人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['workOrder:workOrderDetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['workOrder:workOrderDetail:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['workOrder:workOrderDetail:remove']"-->
        <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['workOrder:workOrderDetail:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workOrderDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="工单表主键" align="center" prop="workOrderId" />-->
      <el-table-column label="工单类型" align="center" prop="workOrderType" />
      <el-table-column label="工单详情" align="center" prop="workOrderDetail" />
      <el-table-column label="审核状态" align="center" prop="checkStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.checkStatus == '1'">已审核</span>
          <span v-else>未审核</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人" align="center" prop="submitter" />
      <el-table-column label="提交时间" align="center" prop="submittTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.submittTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="verifier" />
      <!--<el-table-column label="审核结果" align="center" prop="checkResult" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['workOrder:workOrderDetail:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['workOrder:workOrderDetail:remove']"-->
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

    <!-- 添加或修改工单详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!--<el-form-item label="工单表主键" prop="workOrderId">-->
          <!--<el-input v-model="form.workOrderId" placeholder="请输入工单表主键" />-->
        <!--</el-form-item>-->
        <el-form-item label="工单详情" prop="workOrderDetail">
          <el-input v-model="form.workOrderDetail" placeholder="请输入工单详情" />
        </el-form-item>
        <el-form-item label="审核状态" prop="checkStatus">
          <el-select v-model="form.checkStatus" placeholder="请选择审核状态" clearable size="small">
            <el-option v-for="checkStatus in checkStatusOptions" :label="checkStatus.dictLabel" :value="checkStatus.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="提交人" prop="submitter">
          <el-input v-model="form.submitter" placeholder="请输入提交人" />
        </el-form-item>
        <el-form-item label="提交时间" prop="submittTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.submittTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择提交时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核人" prop="verifier">
          <el-input v-model="form.verifier" placeholder="请输入审核人" />
        </el-form-item>
        <!--<el-form-item label="审核结果" prop="checkResult">-->
          <!--<el-input v-model="form.checkResult" placeholder="请输入审核结果" />-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listWorkOrderDetail, getWorkOrderDetail, delWorkOrderDetail, addWorkOrderDetail, updateWorkOrderDetail, exportWorkOrderDetail } from "@/api/kb/workOrder/workOrderDetail";

  export default {
    name: "WorkOrderDetail",
    components: {
    },
    data() {
      return {
        workOrderId: null,
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
        // 工单详情表格数据
        workOrderDetailList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          workOrderId: null,
          checkStatus: null,
          submitter: null,
          submittTime: null,
          verifier: null,
          checkResult: null,
          changeStatus: null,
        },
        workOrderTypeOptions: [
          {dictLabel: "后勤服务", dictValue: "后勤服务"},
          {dictLabel: "培训教学", dictValue: "培训教学"}
        ],
        checkStatusOptions: [
          {dictLabel: "未审核", dictValue: "0"},
          {dictLabel: "已审核", dictValue: "1"}
        ],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          workOrderId: [
            { required: true, message: "工单表主键不能为空", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.workOrderId = this.$route.params && this.$route.params.id;
      this.getList();
    },
    methods: {
      /** 查询工单详情列表 */
      getList() {
        this.loading = true;
        listWorkOrderDetail({...this.queryParams, workOrderId: this.workOrderId}).then(response => {
          this.workOrderDetailList = response.rows;
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
          workOrderId: this.workOrderId,
          workOrderType: null,
          workOrderDetail: null,
          checkStatus: "0",
          submitter: null,
          submittTime: null,
          verifier: null,
          checkResult: null,
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加工单详情";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getWorkOrderDetail(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改工单详情";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateWorkOrderDetail(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addWorkOrderDetail(this.form).then(response => {
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
        this.$confirm('是否确认删除工单详情编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWorkOrderDetail(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有工单详情数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportWorkOrderDetail(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>
