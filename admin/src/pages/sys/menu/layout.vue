<template>
    <d2-container>
        <div slot="header">
            <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                circle
                @click="addMenu(true)"
                title="新增"
                :disabled="mark_btn.add"
                v-premissions="{
                    mark: mark.menu.add,
                    type: 'add'
                }"
            >
            </el-button>
            <el-button
                icon="el-icon-refresh-right"
                size="mini"
                @click="init"
                circle
                title="刷新"
            ></el-button>
        </div>

        <el-tree
            :data="menuData"
            :props="tree_prop"
            node-key="menu_id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="getMenuItem"
            v-loading="loading"
        >
            <span
                :class="!data.is_disabled ? '' : 'disabled'"
                class="custom-tree-node"
                slot-scope="{ node, data }"
            >
                <span class="label"><i :class="'fa fa-' + data.icon"></i>{{ node.label }}</span>
            </span>
        </el-tree>

        <el-card
            class="box-card"
            v-loading="formLoad"
        >
            <div
                slot="header"
                class="clearfix"
            >
                <span>{{isAdd == true ? '新建菜单' : '编辑菜单'}}</span>
            </div>
            <el-form
                label-width="80px"
                :model="form"
                size="mini"
                :rules="rules"
                ref="SYSMENU"
            >
                <el-form-item
                    label="ID"
                    prop="menu_id"
                    v-if="!isAdd"
                >
                    <el-input
                        v-model="form.menu_id"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="图标"
                    prop="icon"
                >
                    <d2-icon-select v-model="form.icon" />
                </el-form-item>
                <el-form-item
                    label="菜单名称"
                    prop="title"
                >
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item
                    label="路由名称"
                    prop="name"
                >
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item
                    label="标识"
                    prop="mark"
                >
                    <el-input
                        v-model="form.mark"
                        :disabled="!isAdd"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="上级菜单"
                    prop="pid"
                >
                    <el-cascader
                        :options="treeData"
                        :props="menu_prop"
                        :show-all-levels="false"
                        v-model="form.pid"
                        filterable
                    ></el-cascader>
                </el-form-item>
                <el-form-item
                    label="路径"
                    prop="path"
                >
                    <el-input v-model="form.path"></el-input>
                </el-form-item>
                <el-form-item
                    prop="component"
                    label="路由组件"
                >
                    <el-input v-model="form.component"></el-input>
                </el-form-item>
                <el-form-item
                    prop="componentPath"
                    label="组件路径"
                >
                    <el-input v-model="form.componentPath"></el-input>
                </el-form-item>
                <el-form-item
                    prop="cache"
                    label="路由缓存"
                >
                    <el-radio-group v-model="form.cache">
                        <el-radio-button label="true">是</el-radio-button>
                        <el-radio-button label="false">否</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    prop="is_disabled"
                    label="可见性"
                >
                    <el-radio-group
                        v-model="form.is_disabled"
                        :disabled="!isHidden(form.mark)"
                    >
                        <el-radio-button label="false">显示</el-radio-button>
                        <el-radio-button label="true">隐藏</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="排序"
                    prop="sort"
                >
                    <el-input-number
                        v-model="form.sort"
                        :min="1"
                    ></el-input-number>
                </el-form-item>
                <el-form-item v-if="isAdd">
                    <el-button
                        type="primary"
                        icon="el-icon-check"
                        @click="submit('SYSMENU')"
                        :disabled="mark_btn.add"
                        v-premissions="{
                            mark: mark.menu.add,
                            type: 'add'
                        }"
                    >保存
                    </el-button>
                </el-form-item>
                <el-form-item v-else>
                    <el-button
                        type="primary"
                        icon="el-icon-check"
                        @click="submit('SYSMENU')"
                        :disabled="mark_btn.set"
                        v-premissions="{
                            mark: mark.menu.set,
                            type: 'set'
                        }"
                    >保存
                    </el-button>
                    <el-button
                        v-if="isHidden(form.mark)"
                        type="danger"
                        icon="el-icon-delete"
                        @click="delMenu(form.menu_id)"
                        :disabled="mark_btn.del"
                        v-premissions="{
                            mark: mark.menu.del,
                            type: 'del'
                        }"
                    >删除</el-button>
                    <el-button
                        icon="el-icon-position"
                        @click="getMenuToInterface(form.title, form.menu_id)"
                        :disabled="mark_btn.inter"
                        v-premissions="{
                            mark: mark.menu.inter,
                            type: 'inter'
                        }"
                    >关联接口</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogTableVisible"
            v-loading="dialogLoading"
            width="800px"
        >
            <el-table
                :data="interfaceData"
                size="mini"
            >
                <el-table-column
                    prop="name"
                    label="名称"
                    align="left"
                >
                </el-table-column>
                <el-table-column
                    prop="path"
                    label="路由"
                    align="left"
                >
                </el-table-column>
                <el-table-column
                    prop="method"
                    label="请求方式"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="描述"
                    align="left"
                >
                </el-table-column>
                <el-table-column
                    prop="mark"
                    label="标识"
                    align="left"
                >
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.mark}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="is_disabled"
                    label="可见性"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-tag
                            type="success"
                            v-if="!scope.row.is_disabled"
                        >显示</el-tag>
                        <el-tag
                            type="info"
                            v-else
                        >隐藏</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </d2-container>
</template>

<script>
import { QueryMenuByParam, CreateMenu, ModifyMenu, LockMenu, DelMenu, GetMenuToInterface } from '@api/sys.menu'
import { cloneDeep } from 'lodash'
import util from '@/libs/util.js'
import setting from '@/setting.js'
export default {
    name: 'sys-menu',
    data() {
        return {
            menuData: [],
            treeData: [],
            loading: false,
            form: {},
            lock: '',
            is_disabled: '',
            tree_prop: {
                label: 'title',
                children: 'children'
            },
            isAdd: true,
            menu_prop: { value: 'menu_id', label: 'title', emitPath: false, checkStrictly: true },
            rules: {
                title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
                name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
                mark: [{ required: true, message: '请输入标识', trigger: 'blur' }],
                path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' },
                    { type: 'number', message: '排序必须为数字值' }
                ],
                icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
                component: [{ required: true, message: '请输入路由组件', trigger: 'blur' }],
                componentPath: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
                cache: [{ required: true, message: '请输入选择路由缓存', trigger: 'blur' }]
            },
            formLoad: false,
            isSubmit: false,
            dialogTableVisible: false,
            interfaceData: [],
            dialogTitle: '',
            dialogLoading: false,
            mark: setting.mark,
            mark_btn: {
                add: false,
                set: false,
                inter: false,
                del: false
            }
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(isTrue) {
            if (isTrue != true) this.addMenu(false)

            let params = {}
            if (this.is_disabled != '') params['is_disabled'] = this.is_disabled
            this.loading = true
            QueryMenuByParam(params)
                .then(async res => {
                    this.menuData = util.getMenuTree(false, cloneDeep(res))
                    this.treeData = cloneDeep(this.menuData)
                    this.loading = false
                    // 更新当前路由
                    if (isTrue == true) util.initMenu(res, true)
                })
                .catch(() => {
                    this.loading = false
                })
        },
        isHidden(mark) {
            return !setting.hidden_menu.some((i) => {
                return i == mark
            })
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.formLoad = true
                    if (this.form.pid == null) this.form.pid = '0'
                    if (this.form.menu_id) {
                        ModifyMenu(this.form)
                            .then(async res => {
                                this.handleInitParent(1)
                            })
                            .catch(() => {
                                this.formLoad = false
                            })
                    } else {
                        CreateMenu(this.form)
                            .then(async res => {
                                this.handleInitParent(2)
                            })
                            .catch(() => {
                                this.formLoad = false
                            })
                    }
                }
            })
        },
        handleInitParent(type) {
            this.$message.success(type == 1 ? '菜单编辑成功' : '菜单创建成功')
            this.formLoad = false
            this.init(true)
        },
        addMenu(isClear) {
            this.form = {
                cache: true,
                is_disabled: false,
                sort: 1
            }
            this.treeData = cloneDeep(this.menuData)
            if (isClear) this.$refs['SYSMENU'].clearValidate()
            this.isAdd = true
        },
        getMenuItem(data) {
            this.form = cloneDeep(data)
            this.treeData = cloneDeep(this.menuData)
            this.disabledMenu(this.form, this.treeData)
            this.$refs['SYSMENU'].clearValidate()
            this.isAdd = false
        },
        disabledMenu(item, data) {
            data.map((i) => {
                if (i.menu_id == item.menu_id) i.disabled = true
                if (i.children) this.disabledMenu(item, i.children)
            })
        },
        delMenu(menu_id) {
            this.$confirm('删除后子菜单将自动到根菜单下，确定删除该菜单吗', '删除菜单',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    DelMenu({
                        menu_id: menu_id
                    }).then(async res => {
                        this.init(true)
                    })
                })
        },
        getMenuToInterface(title, menu_id) {
            this.dialogTitle = title + '关联接口'
            this.dialogTableVisible = true
            this.dialogLoading = true
            GetMenuToInterface({
                menu_id: menu_id
            }).then(async res => {
                this.interfaceData = res
                this.dialogLoading = false
            }).catch(() => {
                this.dialogLoading = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.el-tree {
    width: 30%;
    display: inline-block;
}
.el-card {
    display: inline;
    width: 60%;
    margin-left: 7%;
    position: absolute;
}
.title-group {
    margin-top: 20px;
    margin-bottom: 10px;
    &:first-child {
        margin-top: 0px;
    }
    .title {
        margin: 0px;
    }
    .sub-title {
        margin: 0px;
        color: $color-text-sub;
        font-size: 10px;
    }
}
.fa {
    padding-right: 10px;
    opacity: 0.8;
}
.disabled {
    .label {
        opacity: 0.25;
    }
}
</style>

<style>
.el-tree-node__content {
    line-height: 35px;
    height: 35px;
}
</style>