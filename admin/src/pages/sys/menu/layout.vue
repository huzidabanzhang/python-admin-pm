<template>
    <d2-container>
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
                :class="data.is_disabled ? '' : 'disabled'"
                class="custom-tree-node"
                slot-scope="{ node, data }"
            >
                <span class="label"><i :class="'fa fa-' + data.icon"></i>{{ node.label }}</span>
                <span>
                    <el-button
                        type="text"
                        size="mini"
                        @click.stop="remove(node, data)"
                        v-if="data.path != '/system' && data.path != '/system/menu' && !data.is_disabled"
                    >
                        禁用
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        @click.stop="remove(node, data)"
                        v-if="data.path != '/system' && data.path != '/system/menu' && data.is_disabled"
                    >
                        启用
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        @click.stop="addMenu(data)"
                        v-if="data.path != '/system' && data.path != '/system/menu'"
                    >
                        删除
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        @click.stop="addMenu(data)"
                    >
                        新增
                    </el-button>
                </span>
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
                <span>{{title}}</span>
                <el-button
                    style="float: right; padding: 3px 5px"
                    type="text"
                    @click="submit"
                >提交
                </el-button>
                <el-button
                    style="float: right; padding: 3px 5px"
                    type="text"
                    @click="resetForm('SYSMENU')"
                >重置
                </el-button>
            </div>
            <el-form
                label-width="80px"
                :model="form"
                size="medium"
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
                    label="名称"
                    prop="title"
                >
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item
                    label="上级菜单"
                    prop="pid"
                >
                    <el-cascader
                        :options="menuData"
                        :props="menu_prop"
                        :show-all-levels="false"
                        v-model="form.pid"
                        clearable
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
                    label="图标"
                    prop="icon"
                >
                    <d2-icon-select
                        v-model="form.icon"
                        :user-input="true"
                    />
                </el-form-item>
                <el-form-item
                    label="排序"
                    prop="sort"
                >
                    <el-input v-model.number="form.sort"></el-input>
                </el-form-item>
            </el-form>
        </el-card>
    </d2-container>
</template>

<script>
import { QueryMenuByParam, CreateMenu, ModifyMenu, LockMenu } from '@api/sys.menu'
import { cloneDeep } from 'lodash'
import util from '@/libs/util.js'
export default {
    name: 'sys-menu',
    data() {
        return {
            menuData: [],
            loading: false,
            form: {},
            lock: '',
            is_disabled: '',
            tree_prop: {
                label: 'title',
                children: 'children'
            },
            title: '新建菜单',
            isAdd: true,
            menu_prop: { checkStrictly: true, value: 'menu_id', label: 'title', emitPath: false },
            rules: {
                title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' },
                    { type: 'number', message: '排序必须为数字值' }
                ],
                icon: [{ required: true, message: '请选择图标', trigger: 'blur' }]
            },
            formLoad: false,
            isSubmit: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(isTrue) {
            this.addMenu()
            let params = {}
            if (this.is_disabled != '') params['is_disabled'] = this.is_disabled
            this.loading = true
            QueryMenuByParam(params)
                .then(async res => {
                    let data = cloneDeep(res)
                    this.menuData = util.dealData(res, 3, false)
                    this.loading = false
                    // 更新当前路由
                    if (isTrue) util.initMenu(data, 3, true)
                })
                .catch(() => {
                    this.loading = false
                })
        },
        submit() {
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
        },
        handleInitParent(type) {
            this.$message({
                message: type == 1 ? '菜单编辑成功' : '菜单创建成功',
                type: 'success',
                duration: 3 * 1000
            })
            this.formLoad = false
            this.init(true)
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        addMenu(data) {
            this.form = {
                pid: data ? data.menu_id : '0',
                title: '',
                path: '',
                icon: '',
                sort: 1,
                type: 1,
                is_disabled: true
            }
            this.isAdd = true
            this.title = '新建菜单'
        },
        getMenuItem(data) {
            if (!data.is_disabled) return true
            this.form = cloneDeep(data)
            this.isAdd = false
            this.title = '编辑菜单'
        },
        remove(node, data) {
            this.$confirm(data.is_disabled ? '确定要禁用吗' : '确定要启用吗',
                data.is_disabled ? '禁用菜单' : '启用菜单',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    this.Lock(data)
                })
        },
        Lock(data) {
            LockMenu({
                menu_id: data.menu_id,
                is_disabled: !data.is_disabled
            }).then(async res => {
                this.init(true)
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
    display: inline-table;
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
    cursor: not-allowed;
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