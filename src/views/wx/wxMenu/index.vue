<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-has-permi="['wx:resource:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="wxMenuList"
      row-key="id"
      :tree-props="{children: 'list', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="resourceName" label="微信资源名称" :show-overflow-tooltip="true" width="160">

      </el-table-column>
      <el-table-column prop="resource" label="微信资源表达式" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.resource || '-'}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="parentId" label="父id" :show-overflow-tooltip="true"></el-table-column>-->
      <!--<el-table-column prop="type" label="类型" :show-overflow-tooltip="true"></el-table-column> 是否是子菜单-->
      <el-table-column prop="path" label="路由地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.path || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标" align="center">
        <template slot-scope="scope">
          <!--<td style="vertical-align: middle">-->
          <el-image :src="scope.row.icon" v-if="scope.row.icon" style="width: 30px"/>
          <span v-else>-</span>
          <!--</td>-->
        </template>
      </el-table-column>
      <el-table-column prop="orderName" label="排序" align="center"></el-table-column>
      <!--<el-table-column prop="isLeaf" label="是否叶子" width="60"></el-table-column>是否叶子-->
      <el-table-column prop="isConceal" label="是否隐藏" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isConceal===1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-has-permi="['wx:resource:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-if="!scope.row.parentId"
            v-has-permi="['wx:resource:add']"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-has-permi="['wx:resource:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="handleClose">
      <el-form ref="form" :model="form" :rules="rule" label-width="110px" :validate-on-rule-change="false">
        <el-row>
          <el-col :span="24">
            <el-form-item label="微信资源名称" prop="resourceName" maxlength="30">
              <el-input v-model="form.resourceName" placeholder="请输入微信资源名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="微信资源表达式" prop="resource" maxlength="30">
              <el-input v-model="form.resource" placeholder="请输入微信资源表达式"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="路由地址" prop="path" maxlength="30">
              <el-input v-model="form.path" placeholder="请输入路由地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <!--<el-input v-model="form.icon"></el-input>-->
              <el-upload
                class="upload-demo"
                :action="''"
                :on-change="uploadChangeFile"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-error="handleError"
                :on-success="handleSuccess"
                :auto-upload="false"
                list-type="picture"
                :limit="1"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <!--<el-image :src="form.icon" v-if="form.icon"></el-image>-->
                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
              <el-input v-model="form.icon" v-show="false"></el-input>
            </el-form-item>
            <!--<el-row>-->
            <!--<el-col :span="18">-->
            <!--<el-form-item label="图标地址" prop="icon">-->
            <!--<el-input v-model="form.icon" placeholder="请输入图标地址"/>-->
            <!--</el-form-item>-->
            <!--</el-col>-->
            <!---->
            <!--</el-row>-->
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否隐藏" prop="isConceal">
              <el-radio-group v-model="form.isConceal">
                <el-radio :key="1" :label="1">是</el-radio>
                <el-radio :key="0" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderName" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
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
    listWxMenu,
    getWxMenu,
    addWxMenu,
    updateWxMenu,
    deleteWxMenu,
    deleteWxMenuAndChildren,
    uploadFile
  } from '@/api/wx/wxMenu'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'Menu',
    components: { Treeselect },
    data() {
      return {
        fileList: [],
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        wxMenuList: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 显示状态数据字典
        // visibleOptions: [],
        // 菜单状态数据字典
        // statusOptions: [],
        // 查询参数
        queryParams: {},
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          resourceName: [
            { required: true, message: '微信资源名称', trigger: 'blur' }
          ],
          resource: [
            { required: true, message: '微信资源表达式不能为空', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '路由地址不能为空', trigger: 'blur' }
          ],
          icon: [
            { required: true, message: '图标地址不能为空', trigger: 'blur' }
          ],
          isConceal: [
            { required: true, message: '是否隐藏必选', trigger: 'blur' }
          ],
          orderName: [
            { required: true, message: '显示排序不能为空', trigger: 'blur' }
          ]
        },
        baseRules: {
          resourceName: [
            { required: true, message: '微信资源名称', trigger: 'blur' }
          ],
          resource: [
            { required: true, message: '微信资源表达式不能为空', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '路由地址不能为空', trigger: 'blur' }
          ],
          isConceal: [
            { required: true, message: '是否隐藏必选', trigger: 'blur' }
          ],
          orderName: [
            { required: true, message: '显示排序不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    created() {
      this.getList()
      // this.getDicts('sys_show_hide').then(response => {
      //   this.visibleOptions = response.data
      // })
      // this.getDicts('sys_normal_disable').then(response => {
      //   this.statusOptions = response.data
      // })
    },
    computed: {
      rule() {
        // console.log(this.form.parentId ? this.rules : this.baseRules)
        return this.form.parentId ? this.rules : this.baseRules
      }
    },
    methods: {
      /** 查询菜单列表 */
      getList() {
        this.loading = true
        listWxMenu().then(response => {
          // this.wxMenuList = this.handleTree(response.data, 'menuId');
          this.wxMenuList = response.data || []
          this.loading = false
        })
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children
        }
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children
        }
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset(rowId) {
        this.form = {
          id: undefined,
          resourceName: undefined,
          resource: undefined,
          parentId: rowId || 0,
          path: undefined,
          icon: undefined,
          isConceal: 0,
          orderName: undefined
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        if (row == undefined) {
          this.reset()
        } else {
          this.reset(row.id)
        }
        this.open = true
        this.title = '添加菜单'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset(row.parentId)
        getWxMenu(row.id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改菜单'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id !== undefined) {
              updateWxMenu(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addWxMenu(this.form).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      uploadChangeFile(file, fileList) {
        console.log(fileList)
        let form = new FormData()
        if (file.raw) {
          form.append('file', file.raw)
        }
        uploadFile(form).then(resp => {
          this.form.icon = resp.data
          // this.fileList = [];
        }).catch(error => {
          console.log('error', error)
          // console.log(error);
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.resourceName + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return deleteWxMenuAndChildren(row.id)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      },
      handleClose() {
        this.fileList = [];
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleError(error, file, fileList) {
        console.log(error)
      },
      handleSuccess(response, file, fileList) {
        console.log(response)
      }
    }
  }
</script>
