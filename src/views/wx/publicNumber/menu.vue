<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-finished"
          size="mini"
          @click="handleCreateWxMenu"
        >
          应用
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :tree-props="{children: 'wxMenuList', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true"/>
      <el-table-column prop="type" label="菜单类型" :show-overflow-tooltip="true"/>
      <el-table-column prop="menuKey" label="key" align="center" width="160"/>
      <el-table-column prop="menuUrl" label="url" align="center" width="160"/>
      <!--<el-table-column prop="mediaId" label="mediaId" align="center"/>-->
      <!--<el-table-column prop="articleId" label="articleId" align="center"/>-->
      <!--<el-table-column prop="appid" label="appid" align="center"/>-->
      <!--<el-table-column prop="pagepath" label="pagepath" align="center"/>-->
      <el-table-column prop="scope" label="授权作用域" :show-overflow-tooltip="true" width="160" :formatter="scopeFormatter"/>
      <el-table-column prop="state" label="state参数" align="center" width="160"/>
      <el-table-column prop="ordername" label="排序" align="center"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
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
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-if="!scope.row.parentId"
          >新增
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

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" :validate-on-rule-change="false">
        <el-form-item label="响应动作类型" prop="menuType">
          <el-select v-model="form.menuType" placeholder="请选择响应动作类型" @change="handleMenuTypeChange">
            <el-option
              v-for="item in menuTypeOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择菜单类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item v-if="keyVisible" label="key" prop="menuKey">
          <el-input v-model="form.menuKey" placeholder="请输入key"/>
        </el-form-item>
        <el-form-item v-if="urlVisible" label="url" prop="menuUrl">
          <el-input v-model="form.menuUrl" placeholder="请输入url"/>
        </el-form-item>
        <el-form-item v-if="articleIdVisible" label="articleId" prop="articleId">
          <el-input v-model="form.articleId" placeholder="请输入articleId"/>
        </el-form-item>
        <el-form-item v-if="mediaIdVisible" label="mediaId" prop="mediaId">
          <el-input v-model="form.mediaId" placeholder="请输入mediaId"/>
        </el-form-item>
        <el-form-item v-if="appIdVisible" label="小程序appId" prop="appId">
          <el-input v-model="form.appid" placeholder="请输入小程序appId"/>
        </el-form-item>
        <el-form-item v-if="pagePathVisible" label="pagePath" prop="pagePath">
          <el-input v-model="form.pagepath" placeholder="请输入pagePath"/>
        </el-form-item>
        <el-form-item label="授权作用域" prop="scope">
          <el-select v-model="form.scope" placeholder="请选择授权作用域" clearable>
            <el-option
              v-for="item in wxMenuScopeOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
          <!--<el-input v-model="form.scope" placeholder="请输入授权作用域"/>-->
        </el-form-item>
        <el-form-item label="state参数" prop="state">
          <el-input v-model="form.state" placeholder="请输入state参数"/>
        </el-form-item>
        <el-form-item label="显示排序" prop="ordername">
          <el-input-number v-model="form.ordername" controls-position="right" :min="0"/>
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
  import {
    listMenu,
    listTreeMenu,
    getMenu,
    addMenu,
    updateMenu,
    deleteMenu,
    createWxMenu
  } from '../../../api/wx/publicNumber/menu'

  export default {
    name: 'Menu',
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        menuTypeOptions: [
          {dictValue: "wx_menu_type_click", dictLabel: "点击类型"},
          {dictValue: "wx_menu_type_view", dictLabel: "跳转类型"}
        ],
        clickTypeOptions: [],
        viewTypeOptions: [],
        wxMenuScopeOptions: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {},
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          menuType: [
            { required: true, message: '请选择响应类型', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择菜单类型', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ],
          menuKey: [
            { required: true, message: '请输入key参数', trigger: 'blur' }
          ],
          menuUrl: [
            { required: true, message: '请输入url参数', trigger: 'blur' }
          ],
          articleId: [
            { required: true, message: '请输入articleId', trigger: 'blur' }
          ],
          mediaId: [
            { required: true, message: '请输入mediaId', trigger: 'blur' }
          ],
          appid: [
            { required: true, message: '请输入appId', trigger: 'blur' }
          ],
          pagepath: [
            { required: true, message: '请输入pagePath', trigger: 'blur' }
          ],
          // scope: [
          //   { required: true, message: '请输入授权作用域', trigger: 'blur' }
          // ],
          // state: [
          //   { required: true, message: '请输入state参数', trigger: 'blur' }
          // ],
          ordername: [
            { required: true, message: '显示排序不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    created() {
      this.getList();
      this.getDicts("wx_menu_type_click").then(response => {
        this.clickTypeOptions = response.data;
      });
      this.getDicts("wx_menu_type_view").then(response => {
        this.viewTypeOptions = response.data;
      });
      this.getDicts("wx_menu_scope").then(response => {
        this.wxMenuScopeOptions = response.data;
      });
    },
    computed: {
      typeOptions() {
        if (this.form.menuType === 'wx_menu_type_click') {
          return this.clickTypeOptions;
        } else if (this.form.menuType === 'wx_menu_type_view') {
          return this.viewTypeOptions;
        } else {
          return [];
        }
      },
      keyVisible() {
        const type = this.form.type;
        return type === 'click'
          || type === 'scancode_waitmsg'
          || type === 'scancode_push'
          || type === 'pic_sysphoto'
          || type === 'pic_weixin'
          || type === 'location_select'
      },
      urlVisible() {
        const type = this.form.type;
        return type === 'view' || type === 'miniprogram';
      },
      mediaIdVisible() {
        const type = this.form.type;
        return type === 'media_id' || type === 'view_limited';
      },
      articleIdVisible() {
        const type = this.form.type;
        return type === 'article_id' || type === 'article_view_limited';
      },
      appIdVisible() {
        const type = this.form.type;
        return type === 'miniprogram';
      },
      pagePathVisible() {
        const type = this.form.type;
        return type === 'miniprogram';
      }
    },
    methods: {
      handleMenuTypeChange(val) {
        this.form.type = null;
      },
      //报道地点
      scopeFormatter(row, column) {
        return this.selectDictLabel(this.wxMenuScopeOptions, row.scope);
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true
        listTreeMenu().then(response => {
          this.menuList = response.data || []
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
          id: null,
          type: null,
          name: null,
          parentId: rowId || 0,
          menuKey: null,
          menuUrl: null,
          articleId: null,
          mediaUrl: null,
          appid: null,
          pagepath: null,
          scope: null,
          state: null,
          ordername: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },
      //应用按钮
      handleCreateWxMenu() {
        createWxMenu.then(resp => {
          this.$message.success("应用成功")
        })
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        if (row && row.id) {
          const filterMenuList = this.menuList.filter(item => item.id === row.id);
          if (filterMenuList[0] && (filterMenuList[0].wxMenuList || []).length >= 5) {
            this.$message.error("二级菜单不能超过五个");
            return;
          }
          this.reset(row.id)
        } else {
          if (this.menuList.length >= 3) {
            this.$message.error("一级菜单不能超过三个");
            return;
          }
          this.reset()
        }
        this.open = true
        this.title = '添加菜单'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset(row.parentId)
        getMenu(row.id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改菜单'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id !== null) {
              updateMenu(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addMenu(this.form).then(response => {
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
        this.$confirm('是否确认删除名称为"' + row.name + '"的菜单?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return deleteMenu(row.id)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      },
      handleClose() {
      },
    }
  }
</script>
