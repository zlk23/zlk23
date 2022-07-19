<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="操作时间" prop="operTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.operTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择操作时间">
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
        </el-form-item>
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
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="test">test</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wx:message:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wx:message:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wx:message:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wx:message:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模板名称" align="center" prop="tempId" :formatter="getTempName"/>
      <el-table-column label="操作时间" align="center" prop="operTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="确诊人数" align="center" prop="sureNum" />
      <el-table-column label="无症状人数" align="center" prop="asymptomaticNum" />
      <!-- <el-table-column label="疑似人数" align="center" prop="maybeNum" /> -->
      <!-- <el-table-column label="学生人数" align="center" prop="stuNum" />
      <el-table-column label="教职工人数" align="center" prop="teacherNum" />
      <el-table-column label="是否启用" align="center" prop="isUse" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:message:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:message:remove']"
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" v-if="open"  width="80%" append-to-body :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="选择模板" prop="tempId">
           <el-select v-model="form.tempId" placeholder="请选择下拉选择" clearable :style="{width: '100%'}">
          <el-option v-for="dict in tempDic"
                     :key="dict.id"
                     :label="dict.tempName"
                     :value="dict.id"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="操作时间" prop="operTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.operTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择操作时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <!-- <el-form-item label="确诊人数" prop="sureNum">
          <el-input v-model="form.sureNum" placeholder="请输入确诊人数" />
        </el-form-item> -->
        <!-- <el-form-item label="无症状人数" prop="asymptomaticNum">
          <el-input v-model="form.asymptomaticNum" placeholder="请输入无症状人数" />
        </el-form-item>
        <el-form-item label="学生人数" prop="stuNum">
          <el-input v-model="form.stuNum" placeholder="请输入学生人数" />
        </el-form-item>
        <el-form-item label="教职工人数" prop="teacherNum">
          <el-input v-model="form.teacherNum" placeholder="请输入教职工人数" />
        </el-form-item> -->
        <!-- <el-form-item label="是否启用" prop="isUse">
          <el-input v-model="form.isUse" placeholder="请输入是否启用,1启用,0不启用" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
          <person :messageId="messageId" />

    </el-dialog>
  </div>
</template>

<script>
import { listTemplate,listTemplatetest } from "@/api/wx/message/wxtemplate";

import { listMessage, getMessage, delMessage, addMessage, updateMessage, exportMessage } from "@/api/wx/message/wxmessage";

import person from '@/views/wx/template/message/person/index.vue'
export default {
  name: "Message",
  components: {
    person
  },
  data() {
    return {
      activeName: '1',
      messageId:'',
      tempDic:[],
      codeVal: '',
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
        isUse: null
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
    this.getTempList();
  },
  methods: {
    test(){
      listTemplatetest().then(response => {
        // this.tempDic = response.rows;
        // console.log("getTempList2")
        // console.log(this.tempDic)
      });

    },
     //查询字典
    selectDictLabel(datas, value) {
      var actions = [];
      Object.keys(datas).some((key) => {
        if (datas[key].id == ('' + value)) {
          actions.push(datas[key].tempName);
          return true;
        }
      })
      return actions.join('');
    },
    getTempName(row,column){
      return this.selectDictLabel(this.tempDic,row.tempId)
    },
    /** 查询【请填写功能名称】列表 */
    getTempList() {
      console.log("getTempList")
      //做一个字典，放入供选择，ID，name
      listTemplate().then(response => {
        this.tempDic = response.rows;
        console.log("getTempList2")
        console.log(this.tempDic)
      });
    },
    emitVal(){
          this.$emit('selected',this.codeVal);
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listMessage(this.queryParams).then(response => {
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
    // 表单重置
    reset() {
      this.form = {
        id: null,
        operTime: null,
        address: null,
        sureNum: null,
        asymptomaticNum: null,
        stuNum: null,
        teacherNum: null,
        isUse: null
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
      this.title = "新增消息";
      this.messageId=''
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMessage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改新增";
        this.messageId=response.data.id;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMessage(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMessage(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.messageId=response.data.id;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMessage(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有【请填写功能名称】数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMessage(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
