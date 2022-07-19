<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="白名单键值" prop="whitelistValue">
        <el-input
          v-model="queryParams.whitelistValue"
          placeholder="请输入白名单键值"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="白名单名称" prop="whitelistName">
        <el-input
          v-model="queryParams.whitelistName"
          placeholder="请输入白名单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="ifUseWhitelist">
         <el-input
          v-model="queryParams.ifUseWhitelist"
          placeholder="请输入是否启用,1启用,0不启用"
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
          v-hasPermi="['wx:whitelist:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wx:whitelist:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wx:whitelist:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wx:whitelist:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="whitelistList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="白名单键值" align="center" prop="whitelistValue" />
      <el-table-column label="白名单名称" align="center" prop="whitelistName" />
      <el-table-column label="是否启用" align="center">
        <template slot-scope="scope">
            {{scope.row.ifUseWhitelist==1?'启用':'未启用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:whitelist:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:whitelist:remove']"
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

    <!-- 添加或修改报名缴费白名单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="白名单名称" prop="whitelistName">
          <el-select v-model="form.whitelistName"  placeholder="请选择" @change="form.whitelistValue=nameChange(form.whitelistName)">
            <el-option v-for="item in nameList" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictLabel"></el-option>
          </el-select>
          <!-- <el-input v-model="form.whitelistName" placeholder="请输入白名单名称" /> -->
        </el-form-item>
        <el-form-item label="白名单键值" prop="whitelistValue">
          <el-input v-model="form.whitelistValue" placeholder="请输入白名单键值"  readonly="readonly"/>
        </el-form-item>
        <el-form-item label="是否启用" prop="ifUseWhitelist">
          <el-switch
              v-model="form.ifUseWhitelist"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="remake">
          <el-input v-model="form.remake" placeholder="请输入备注" />
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
import { listWhitelist, getWhitelist, delWhitelist, addWhitelist, updateWhitelist, exportWhitelist } from "@/api/wx/whitelist";

export default {
  name: "Whitelist",
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
      // 报名缴费白名单表格数据
      whitelistList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        whitelistValue: null,
        whitelistName: null,
        ifUseWhitelist: null,
        createUser: null,
        updateUser: null,
        remake: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {

        whitelistName: [
          { required: true, message: "请选择白名单名称", trigger: "blur" }
        ],
        whitelistValue: [
          { required: true, message: "请选择白名单名称匹配键值", trigger: "blur" }
        ],
      },
      nameList:[],
    };
  },
  created() {
    
    this.getList();

    this.getDicts("sys_dkt_province").then(response => {
      this.nameList = response.data;
    });
  },
  methods: {
    //name
    nameChange(name){
      console.log("id++++++"+name)
      let selectedName = {};
      selectedName = this.nameList.find((item)=>{
        return item.dictLabel == name;
        //筛选出匹配数据，是对应数据的整个对象
      });
      console.log(selectedName)
      var val=''
      if(selectedName.dictValue){
        val=selectedName.dictValue
      }
      return val;
    },
    /** 查询报名缴费白名单列表 */
    getList() {
      this.loading = true;
      listWhitelist(this.queryParams).then(response => {
        this.whitelistList = response.rows;
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
        whitelistValue: null,
        whitelistName: null,
        ifUseWhitelist: null,
        createUser: null,
        createTime: null,
        updateUser: null,
        updateTime: null,
        remake: null
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
      this.title = "添加报名缴费白名单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWhitelist(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报名缴费白名单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWhitelist(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWhitelist(this.form).then(response => {
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
      this.$confirm('是否确认删除报名缴费白名单编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWhitelist(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有报名缴费白名单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportWhitelist(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
