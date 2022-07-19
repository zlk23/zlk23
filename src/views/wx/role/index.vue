<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入角色名称"
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
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--<el-table-column label="序号" align="center" prop="id" />-->
      <el-table-column label="微信角色名称" align="center" prop="name"/>
      <!--<el-table-column label="父id" align="center" prop="parentId" />-->
      <el-table-column label="微信角色类型" align="center" prop="type"/>
      <!--<el-table-column label="微信角色排序" align="center" prop="sort"/>-->
      <el-table-column label="角色状态" align="center" prop="status" width="100">
        <!--<template slot-scope="scope">-->
          <!--<el-switch-->
            <!--v-model="scope.row.status"-->
            <!--active-value="0"-->
            <!--inactive-value="1"-->
            <!--@change="handleStatusChange(scope.row)"-->
          <!--&gt;</el-switch>-->
        <!--</template>-->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!--<el-table-column label="创建人" align="center" prop="createUser"/>-->
      <!--<el-table-column label="修改人" align="center" prop="updateUser"/>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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

    <!-- 添加或修改微信角色对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="微信角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入微信角色名称"/>
        </el-form-item>
        <el-form-item label="微信角色类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入微信角色类型"/>
        </el-form-item>
        <el-form-item label="微信角色排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入微信角色排序"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :key="0" :label="0">正常</el-radio>
            <el-radio :key="1" :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            :data="treeList"
            show-checkbox
            ref="trees"
            node-key="id"
            :default-expanded-keys="[]"
            :default-checked-keys="resourceIds"
            @check-change="getChecked"
            empty-text="加载中，请稍后"
          ></el-tree>
          <!--<el-tree-->
            <!--:data="treeList"-->
            <!--show-checkbox-->
            <!--node-key="id"-->
            <!--ref="trees"-->
            <!--:default-expanded-keys="[]"-->
            <!--:default-checked-keys="resourceIds"-->
            <!--:props="resourceIds"-->
            <!--@check-change="getChecked"-->
          <!--&gt;-->
          <!--</el-tree>-->
        </el-form-item>
        <!--<el-form-item label="删除标志" prop="delFlag">-->
          <!--<el-input v-model="form.delFlag" placeholder="请输入删除标志"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="创建人" prop="createUser">-->
          <!--<el-input v-model="form.createUser" placeholder="请输入创建人"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="修改人" prop="updateUser">-->
          <!--<el-input v-model="form.updateUser" placeholder="请输入修改人"/>-->
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
  import {
    addRole,
    delRole,
    exportRole,
    getRole,
    getWxResources,
    getWxRoleResources,
    listRole,
    updateRole,
    updateWxRoleResources
  } from '@/api/wx/role'

  export default {
    name: 'Role',
    components: {},
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
        // 微信角色表格数据
        roleList: [],
        //更新角色权限数据
        wxRoleResources: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          parentId: null,
          type: null,
          sort: null,
          status: null,
          createUser: null,
          updateUser: null
        },
        // 表单参数
        form: {},
        //权限列表
        treeList: [],
        //权限列表
        resourceIds: [],
        // 表单校验
        rules: {
          status: [
            { required: true, message: '角色状态不能为空', trigger: 'blur' }
          ],
          delFlag: [
            { required: true, message: '删除标志不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      getWxResources().then(response => {
        console.log(response)
        this.treeList = response
      })
      this.getList()
    },
    methods: {
      // 角色状态修改
      handleStatusChange(row) {
        let text = row.status == 0 ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.name + '"角色吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return updateRole({id: row.id, status: row.status});
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status == 0 ? 1 : 0;
        });
      },
      /** 查询微信角色列表 */
      getList() {
        this.loading = true
        listRole(this.queryParams).then(response => {
          this.roleList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        if (this.$refs.trees != undefined) {
          this.$refs.trees.setCheckedKeys([]);
        }
        this.resourceIds = [];
        this.form = {
          id: null,
          name: null,
          parentId: null,
          type: null,
          sort: null,
          // resourceIds: [],
          status: 0,
          delFlag: null,
          createTime: null,
          createUser: null,
          updateTime: null,
          updateUser: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加微信角色'
      },
      /**选中权限*/
      getChecked() {
        return this.$refs.trees.getCheckedKeys()
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getRole(id).then(response => {
          this.form = response.data
          getWxRoleResources(id).then(response => {
            // this.form.resourceIds = response;
            this.resourceIds = response
          }).then(() => {
            this.open = true
          })
          this.title = '修改微信角色'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          console.log(this.getChecked())
          // let form = { roleId: this.form.id, resourcesIds: String(this.getChecked()), wxRoleType: this.form.type }
          // var qs = require('qs')
          if (valid) {
            if (this.form.id != null) {
              updateRole({...this.form, resourceIds: this.getChecked() || []}).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addRole({...this.form, resourceIds: this.getChecked()}).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除微信角色编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delRole(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有微信角色数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportRole(queryParams)
        }).then(response => {
          this.download(response.msg)
        })
      }
    }
  }
</script>
