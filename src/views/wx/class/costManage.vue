<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleFeeAdd"
          v-hasPermi="['wx:cost:add']"
        >新增
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="handleFeeUpdate"
          v-hasPermi="['wx:cost:edit']"
          :disabled="single"
        >修改
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleFeeRemove"
          v-hasPermi="['wx:cost:remove']"
          :disabled="multiple"
        >删除
        </el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="costList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="费用编号" align="center" prop="id" />
      <el-table-column label="费用名称" align="center" prop="name" />
      <el-table-column
        label="商户id"
        align="center"
        prop="merchantId"
        v-if="false"
      />
      <el-table-column label="商户号" align="center" prop="mchId">
        <template slot-scope="scope">
            <span
              v-for="item in merchant"
              v-if="item.id == scope.row.merchantId"
            >{{ item.mchId }}
            </span>
        </template>
      </el-table-column>
      <el-table-column label="商户名称" align="center" prop="merchantName">
        <template slot-scope="scope">
            <span
              v-for="item in merchant"
              v-if="item.id == scope.row.merchantId"
            >{{ item.merchantName }}
            </span>
        </template>
      </el-table-column>
      <el-table-column label="费用类型" align="center" prop="type" />
      <el-table-column
        label="费用编号"
        align="center"
        prop="feeNum"
        v-if="false"
      />
      <el-table-column label="费用金额" align="center" prop="money" />
      <el-table-column
        label="培训班次id"
        align="center"
        prop="shortCourseId"
        v-if="false"
      />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleFeeUpdate(scope.row)"
            v-hasPermi="['wx:cost:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleFeeRemove(scope.row)"
            v-hasPermi="['wx:cost:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加或修改短期培训班费用对话框 -->
    <el-dialog :title="feeTitle" :visible.sync="feeInfoOpen" append-to-body>
      <el-form
        ref="feeForm"
        :model="feeForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="班次Id" prop="shortClassId" v-if="false">
          <el-input v-model="feeForm.shortClassId" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="缴费名称" prop="name">
          <el-input
            v-model="feeForm.name"
            placeholder="缴费名称"
            value="培训费"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="费用编号" prop="feeNum" >
              <el-input v-model="feeForm.feeNum" placeholder="费用编号" ></el-input>
            </el-form-item> -->
        <!-- <el-form-item label="选择费用" prop="money">
              <el-select v-model="feeForm.feeNum" placeholder="请选择">
                <el-option
                  v-for="item in fee"
                  :key="item.feeNum"
                  :label="item.feeName"
                  :value="item.feeNum">
                  <span style="float: left">{{ item.feeName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.price }}元</span>
                </el-option>
              </el-select>
              <el-input v-model="feeForm.money" placeholder="请输入培训费"></el-input>
            </el-form-item> -->
        <el-form-item label="缴费商户" prop="merchantId">
          <el-select v-model="feeForm.merchantId" placeholder="请选择">
            <el-option
              v-for="item in merchant"
              :key="item.id"
              :label="item.merchantName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用类型" prop="type">
          <el-select v-model="feeForm.type" placeholder="请选择费用类型">
            <el-option
              v-for="item in feeTypeOptions"
              :key="item.feeTypeNum"
              :label="item.feeTypeName"
              :value="item.feeTypeNum"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input-number v-model="feeForm.money" :precision="2" :step="0.1" :min="0.01"></el-input-number>
          <!--<el-input v-model="feeForm.money" placeholder="请输入金额" />-->
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="feeForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFeeForm()">确 定</el-button>
        <el-button>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listCost,
    getCost,
    delCost,
    addCost,
    updateCost,
    exportCost,
    getAllCost
  } from "@/api/wx/cost";

  import {
    listFee,
    getFee,
    delFee,
    addFee,
    updateFee,
    exportFee,
    getAllMerchant
  } from "@/api/wx/fee";

  import { allListFeeType } from "@/api/wx/feeType";
  import { allListPayType } from "@/api/wx/payType";

  export default {
    name: 'costManage',
    data() {
      return {
        showSearch: true,
        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //缴费方式
        payTypeOptions: [],
        feeTypeOptions: [],
        //弹出框费用表格数据
        costList: [],
        //商户数据
        merchant: [],
        //班主任数据
        teacher: [],
        //费用数据
        fee: [],
        // 弹出层标题
        title: "",
        feeTitle: "",
        shortClassId: null,
        // 是否显示弹出层
        open: false,
        feeInfoOpen: false,
        styleObject: "",
        disabled: false,
        //班次费用表单参数
        feeForm: {
          name: "培训费"
        },
        // 表单校验
        rules: {
          name: [
            { required: true, message: '缴费名称不能为空', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '金额不能为空', trigger: 'blur' }
          ],
          orderName: [
            { required: true, message: '费用类型不能为空', trigger: 'blur' }
          ],
          merchantId: [
            { required: true, message: '缴费商户不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '报名费用不能为空', trigger: 'blur' }
          ],
        }
      };
    },
    created() {
      getAllMerchant().then(response => {
        this.merchant = response.data;
      });
      allListFeeType().then(response => {
        this.feeTypeOptions = response.rows;
      });
      allListPayType().then(response => {
        this.payTypeOptions = response.rows;
      });
      listFee().then(response => {
        this.fee = response.rows;
      });
      // this.shortClassId = this.$route.params.shortClassId;
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        getAllCost(this.$route.params.shortClassId).then(response => {
          this.costList = response.data;
          this.loading = false;
        });
      },
      // 表单重置
      reset() {
        const shortClassId = this.$route.params && this.$route.params.shortClassId;
        this.feeForm = {
          id: null,
          shortClassId: shortClassId || null,
          name: "培训费",
          money: null,
          orderName: 1,
          merchantId: null,
          type: null,
        };
        this.resetForm("feeForm");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length !== 1;
        this.multiple = !selection.length;
      },
      /*费用新增按钮*/
      handleFeeAdd() {
        this.reset();
        this.feeInfoOpen = true;
        this.feeTitle = "新增费用";
      },
      /*费用修改按钮*/
      handleFeeUpdate(row) {
        this.reset();
        const ids = row.id || this.ids;
        getCost(ids).then(resp => {
          console.log(resp);
          this.feeForm = resp.data;
          this.feeTitle = "新增费用";
          this.feeInfoOpen = true;
        })
      },
      /*费用删除按钮*/
      handleFeeRemove(row) {
        const ids = row.id || this.ids;
        this.$confirm('确认要"删除""' + row.name + '"吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delCost(ids)
        }).then(() => {
          this.msgSuccess('删除成功');
          this.getList();
        });
      },
      //费用弹框确定按钮
      submitFeeForm() {
        this.$refs["feeForm"].validate(valid => {
          if (valid) {
            if (this.$route.params && this.$route.params.shortClassId != null) {
              if (this.feeForm.id !== null) {
                updateCost(this.feeForm).then(() => {
                  this.msgSuccess("修改成功");
                  this.feeInfoOpen = false;
                  this.getList();
                });
              } else {
                addCost(this.feeForm).then(() => {
                  this.msgSuccess("新增成功");
                  this.feeInfoOpen = false;
                  this.getList();
                });
              }
            }
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>
