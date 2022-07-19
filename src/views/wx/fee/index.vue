<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="费用编号" prop="feeNum">
        <el-input
          v-model="queryParams.feeNum"
          placeholder="请输入费用编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="缴费方式" prop="payTypeNum">
        <el-input
          v-model="queryParams.payTypeNum"
          placeholder="请输入缴费方式"
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
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="feeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="费用编号" align="center" prop="feeNum" />
      <el-table-column label="费用名称" align="center" prop="feeName" />
      <el-table-column label="费用金额(元)" align="center" prop="price" width="95px"/>
      <el-table-column label="收费单位" align="center" prop="companyName" />
      <el-table-column label="商户号" align="center" prop="storeNum" />
      <el-table-column label="费用类型" align="center" prop="feeTypeNum" >
      </el-table-column>
      <el-table-column label="缴费方式" align="center" prop="payTypeNum" />
      <el-table-column label="在线支付" align="center" prop="isOnline" >
        <template slot-scope="scope">
          <span>{{ scope.row.isOnline ? "是":"否" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createdBy" />
      <el-table-column label="创建时间" align="center" prop="createdTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updatedBy" />
      <el-table-column label="更新时间" align="center" prop="updatedTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 添加或修改缴费项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="费用编号" prop="feeNum">
          <el-input v-model="form.feeNum" placeholder="请输入费用编号" />
        </el-form-item>
        <el-form-item label="费用名称" prop="feeName">
          <el-input v-model="form.feeName"  placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="费用金额" prop="price">
          <el-input v-model="form.price" placeholder="请输入费用金额,保留两位小数" />
        </el-form-item>
        <el-form-item label="收费单位" prop="companyName">
          <el-input v-model="form.companyName"  placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="商户号" prop="storeNum">
          <el-input v-model="form.storeNum"  placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="费用类型" prop="feeTypeNum">
          <el-select v-model="form.feeTypeNum" placeholder="请选择">
            <el-option
              v-for="item in feeTypeOptions"
              :key="item.feeTypeNum"
              :label="item.feeTypeName"
              :value="item.feeTypeNum">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费方式" prop="payTypeNum">
          <el-select v-model="form.payTypeNum" placeholder="请选择">
            <el-option
              v-for="item in payTypeOptions"
              :key="item.payTypeNum"
              :label="item.payTypeName"
              :value="item.payTypeNum">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线支付" prop="isOnline" >
          <el-select v-model="form.isOnline" placeholder="请选择">
            <el-option
              v-for="item in isOnlineOptions"
              :key="item.isOnline"
              :label="item.isOnlineName"
              :value="item.isOnline">
            </el-option>
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
  import { listFee, getFee, delFee, addFee, updateFee, exportFee,getAllMerchant } from "@/api/wx/fee";
  import { allListFeeType } from "@/api/wx/feeType";
  import { allListPayType } from "@/api/wx/payType";
  export default {
    name: "Fee",
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
        // 缴费项目表格数据
        feeList: [],
        feeTypeOptions:[],
        payTypeOptions: [],
        isOnlineOptions:[{isOnline:true ,isOnlineName:"是"},{isOnline:false ,isOnlineName:"否"}],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          feeNum: null,
          feeName: null,
          price: null,
          companyName: null,
          storeNum: null,
          feeTypeNum: null,
          payTypeNum: null,
          isOnline:null,
          createdBy: null,
          createdTime: null,
          updatedBy: null,
          updatedTime: null
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
      /** 查询缴费项目列表 */
      getList() {
        this.loading = true;
        listFee(this.queryParams).then(response => {
          this.feeList = response.rows;
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
          feeNum: null,
          feeName: null,
          price: null,
          companyName: null,
          storeNum: null,
          feeTypeNum: null,
          payTypeNum: null,
          isOnline:null,
          createdBy: null,
          createdTime: null,
          updatedBy: null,
          updatedTime: null
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
        allListPayType().then(response =>{
          console.log(response)
          this.payTypeOptions=response.rows;
            allListFeeType().then(response =>{
              console.log(response)
              this.feeTypeOptions=response.rows;
            }).then(()=>{this.open = true;})
        })
        this.title = "添加缴费项目";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getFee(id).then(response => {
          this.form = response.data;
          allListPayType().then(response =>{
            console.log(response)
            this.payTypeOptions=response.rows;
            allListFeeType().then(response =>{
              console.log(response)
              this.feeTypeOptions=response.rows;
            }).then(()=>{this.open = true;})
          })
          this.title = "修改缴费项目";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateFee(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addFee(this.form).then(response => {
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
        this.$confirm('是否确认删除缴费项目编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFee(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有缴费项目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFee(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>
