<template>
    <chubby-container>
        <div slot="header">
            <el-button
                title="返回上一级"
                style="float: left;"
                circle
                v-if="pid != '0' && !isDel"
                @click="backFolder(prev)"
            ><i class="el-icon-back"></i></el-button>

            <el-breadcrumb
                v-if="!isDel"
                separator-class="el-icon-arrow-right"
                style="float: left;    
                    height: 30px;
                    padding-left: 10px;
                    line-height: 30px;"
            >
                <el-breadcrumb-item v-for="(item, index) in tree"><a @click="toFolder(item)">{{item.name}}</a></el-breadcrumb-item>
            </el-breadcrumb>

            <el-form
                :inline="true"
                style="float: right;"
            >
                <el-form-item v-if="!isDel">
                    <el-button
                        type="danger"
                        @click="changeFolder(true)"
                    >回收站
                    </el-button>
                </el-form-item>

                <el-form-item v-if="isDel">
                    <el-button @click="changeFolder(false)">文件夹
                    </el-button>
                </el-form-item>

                <el-form-item v-if="isDel">
                    <el-dropdown
                        split-button
                        @command="handleCommand"
                    >
                        <i class="el-icon-setting"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                command="3"
                                :disabled="auth.retrieve"
                                v-auth:retrieve_document
                            >还原</el-dropdown-item>
                            <el-dropdown-item
                                command="2"
                                :disabled="auth.del"
                                v-auth:del_document
                            >删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>

                <el-form-item v-if="!isDel">
                    <el-dropdown
                        split-button
                        @command="handleCommand"
                    >
                        <i class="el-icon-setting"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                command="1"
                                :disabled="auth.retrieve"
                                v-auth:retrieve_document
                            >移动回收站</el-dropdown-item>
                            <el-dropdown-item
                                command="2"
                                :disabled="auth.del"
                                v-auth:del_document
                            >删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>

                <el-form-item v-if="!isDel">
                    <el-button
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        @click="addFolder"
                        :disabled="auth.addf"
                        v-auth:addf_folder
                    >新建文件夹
                    </el-button>
                </el-form-item>

                <el-form-item v-if="!isDel">
                    <el-button
                        type="primary"
                        @click="centerDialogVisible = true"
                        :disabled="auth.add || pid == '0'"
                        v-auth:add_document
                    >上传<i class="el-icon-upload el-icon--right"></i></el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-row v-loading="loading">
            <el-checkbox-group v-model="checked">
                <el-col
                    :xs="6"
                    :sm="6"
                    :md="6"
                    :lg="4"
                    :xl="3"
                    v-for="(item, index) in data"
                    :key="index"
                >
                    <el-card
                        :body-style="{ padding: '10px' }"
                        v-if="item.is_folder"
                    >
                        <div>
                            <div
                                class="name"
                                :title="item.name"
                            >{{item.name}}</div>
                            <el-dropdown
                                class="button"
                                trigger="click"
                                placement="bottom-start"
                            >
                                <span class="el-dropdown-link">
                                    <i class="fa fa-ellipsis-v"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="openFolder(item)">打开文件夹</el-dropdown-item>
                                    <el-dropdown-item
                                        @click.native="setFolder(item)"
                                        v-if="item.admin_id && (user.admin_id == item.admin_id || user.is_admin)"
                                        :disabled="auth.setf"
                                        v-auth:setf_folder
                                    >重命名</el-dropdown-item>
                                    <el-dropdown-item
                                        @click.native="delFolder(item)"
                                        v-if="item.admin_id && (user.admin_id == item.admin_id || user.is_admin)"
                                        :disabled="auth.delf"
                                        v-auth:delf_folder
                                    >删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <div class="el-image image">
                            <div class="image-slot">
                                <img src="./image/folder.png">
                            </div>
                        </div>
                    </el-card>

                    <el-card
                        :body-style="{ padding: '10px' }"
                        v-else
                    >
                        <div>
                            <el-checkbox :label="item.document_id">
                                <div
                                    class="name"
                                    :title="item.name"
                                >{{item.name}}</div>
                            </el-checkbox>
                            <el-dropdown
                                class="button"
                                trigger="click"
                                placement="bottom-start"
                            >
                                <span class="el-dropdown-link">
                                    <i class="fa fa-ellipsis-v"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        v-if="!isDel"
                                        @click.native="retrieveFile([item.document_id], true)"
                                        :disabled="auth.retrieve"
                                        v-auth:retrieve_document
                                    >移到回收站</el-dropdown-item>
                                    <el-dropdown-item
                                        v-if="isDel"
                                        @click.native="retrieveFile([item.document_id], false)"
                                        :disabled="auth.retrieve"
                                        v-auth:retrieve_document
                                    >还原</el-dropdown-item>
                                    <el-dropdown-item
                                        @click.native="down(item.path, item.name)"
                                        :disabled="auth.down"
                                        v-auth:down_document
                                    >下载</el-dropdown-item>
                                    <el-dropdown-item
                                        @click.native="delFile([item.document_id])"
                                        :disabled="auth.del"
                                        v-auth:del_document
                                    >删除</el-dropdown-item>
                                    <el-dropdown-item @click.native="getFile(item)">属性</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <el-image
                            lazy
                            class="image"
                            :src="src + item.path"
                            fit="scale-down"
                            v-if="item.status == 1"
                            :preview-src-list="[src + item.path]"
                        >
                            <div
                                slot="error"
                                class="image-slot"
                            >
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <div
                            class="el-image image"
                            v-else
                        >
                            <div class="image-slot">
                                <img src="./image/file.png">
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col
                    class="empty"
                    v-if="data.length == 0"
                >暂无数据</el-col>
            </el-checkbox-group>
        </el-row>

        <Pagination
            slot="footer"
            :page="page"
            :total="total"
            :size="size"
            :layout="'prev, pager, next, jumper'"
            @handleSize="handleSize"
            @handleCurrent="handleCurrent"
        ></Pagination>

        <Upload
            :centerDialogVisible="centerDialogVisible"
            :folder_id="pid"
            @handleClose="handleClose"
        ></Upload>

        <el-dialog
            title="附件属性"
            :visible.sync="Visible"
            width="400px"
            append-to-body
            destroy-on-close
            @closed="Visible = false"
        >
            <el-form
                label-width="80px"
                ref="adminForm"
                :model="form"
                class="show"
            >
                <el-form-item
                    label="创建者"
                    prop="username"
                >
                    <el-input
                        v-model="form.username"
                        readonly
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="文件名"
                    prop="name"
                >
                    <el-input
                        v-model="form.name"
                        readonly
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="大小"
                    prop="size"
                >
                    <el-input
                        v-model="form.size"
                        readonly
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="创建时间"
                    prop="create_time"
                >
                    <el-input
                        v-model="form.create_time"
                        readonly
                    ></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </chubby-container>
</template>

<script>
import { DelDocument, RetrieveDocument, DownDocument, QueryDocumentByParam } from '@api/sys.document'
import { DelFolder, CreateFolder, ModifyFolder, QueryFolderByParam } from '@api/sys.folder'
import { cloneDeep } from 'lodash'
import Pagination from '@/pages/pagination/index.vue'
import Upload from '@/pages/upload/index.vue'
// 获取缓存菜单需要
import util from '@/libs/util.js'
import setting from '@/setting.js'
export default {
    name: 'sys-document',
    props: {
        visible: Boolean
    },
    components: { Pagination, Upload },
    data () {
        return {
            data: [],
            checked: [],
            page: 1,
            total: 0,
            size: 40,
            loading: false,
            isDel: false,
            centerDialogVisible: false,
            tree: [{
                name: '根目录',
                folder_id: '0',
                index: 0
            }],
            prev: {},
            pid: '0',
            src: this.$store.state.chubby.api.base + '/API/v1/Document/GetDocument',
            user: this.$store.getters['chubby/user/user'],
            Visible: false,
            form: {},
            is_sys: false,
            auth: {
                add: false,
                down: false,
                del: false,
                retrieve: false,
                addf: false,
                setf: false,
                listf: false
            }
        }
    },
    watch: {
        visible: {
            handler: function (val) {
                if (val) this.getFolder(this.pid, true)
            },
            immediate: true, //关键
            deep: true
        }
    },
    methods: {
        init () {
            let params = {
                page: this.page,
                page_size: this.size,
                deleted: this.isDel,
                folder_id: this.pid
            }

            this.loading = true
            QueryDocumentByParam(params)
                .then(async res => {
                    this.checked = []
                    this.total = res.total
                    for (let i = 0; i < this.data.length; i++) {
                        if (this.data[i].is_folder == false) {
                            this.data.splice(i)
                            i--
                        }
                    }
                    for (let i = 0; i < res.data.length; i++) {
                        let item = res.data[i]
                        item.is_folder = false
                        this.data.push(item)
                    }
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        changeFolder (isDel) {
            this.isDel = isDel
            if (isDel) {
                this.data = []
                this.page = 1
                this.init()
            } else this.getFolder(this.pid, true)
        },
        getFolder (pid, isInit) {
            this.loading = true
            QueryFolderByParam({
                pid: pid,
                admin_id: this.user.admin_id
            })
                .then(async res => {
                    this.data = res.map(i => {
                        let item = i
                        item.is_folder = true
                        return item
                    })
                    if (isInit) this.page = 1
                    this.init()
                })
                .catch(() => {
                    this.loading = false
                })
        },
        down (src, name) {
            DownDocument({
                src: src,
                name: name
            }).then((response) => {
                const href = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }))
                let downloadElement = document.createElement('a')
                downloadElement.href = href
                downloadElement.download = name //下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() //点击下载
                document.body.removeChild(downloadElement);//下载完成移除元素
                window.URL.revokeObjectURL(href) //释放blob对象
            })
        },
        handleSize (size) {
            this.size = size
            this.page = 1
            this.init()
        },
        handleCurrent (page) {
            this.page = page
            this.init()
        },
        handleClose (params) {
            this.centerDialogVisible = params.change
            this.page = 1
            this.init()
        },
        bytesToSize (bytes) {
            if (bytes === 0) return '0 B'
            let k = 1024,
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k))

            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
        },
        addFolder () {
            this.$prompt('', '新建文件夹', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '请输入文件夹名',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        instance.confirmButtonText = '提交中...'
                        CreateFolder({
                            name: instance.inputValue,
                            pid: this.pid,
                            is_sys: this.is_sys,
                            admin_id: this.user.admin_id
                        })
                            .then(async res => {
                                instance.confirmButtonLoading = false
                                this.getFolder(this.pid, false)
                                done()
                            })
                            .catch(() => {
                                instance.confirmButtonLoading = false
                            })
                    } else {
                        done()
                    }
                }
            }).then(() => {
                this.$message.success('创建文件夹成功')
            }).catch()
        },
        setFolder (item) {
            this.$prompt('', '重命名文件夹', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '请输入文件夹名',
                inputValue: item.name,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        instance.confirmButtonText = '提交中...'
                        ModifyFolder({
                            name: instance.inputValue,
                            folder_id: item.folder_id
                        })
                            .then(async res => {
                                instance.confirmButtonLoading = false
                                item.name = instance.inputValue
                                done()
                            })
                            .catch(() => {
                                instance.confirmButtonLoading = false
                            })
                    } else {
                        done()
                    }
                }
            }).then(() => {
                this.$message.success('重命名文件夹成功')
            }).catch()
        },
        delFile (id) {
            this.$confirm('确定将文件删除吗？', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    DelDocument({
                        document_id: id
                    })
                        .then(async res => {
                            this.$message.success('删除文件成功')
                            this.init()
                        })
                })
        },
        retrieveFile (id, deleted) {
            this.$confirm(deleted ? '确定将文件移到回收站吗？' : '确定还原文件吗？', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    RetrieveDocument({
                        document_id: id,
                        deleted: deleted
                    })
                        .then(async res => {
                            this.$message.success('移动文件成功')
                            this.init()
                        })
                })
        },
        delFolder (id) {
            this.$confirm('删除该文件夹，其中的文件将转移到根目录下，确定要删除吗？', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    DelFolder({
                        folder_id: id.folder_id
                    })
                        .then(async res => {
                            this.$message.success('删除文件夹成功')
                            this.getFolder(this.pid, false)
                        })
                })
        },
        handleCommand (command) {
            if (this.checked.length == 0) return this.$message.warning('未选择任何记录')
            switch (command) {
                case '1':
                    this.retrieveFile(this.checked, true)
                    break;
                case '2':
                    this.delFile(this.checked)
                    break;
                case '3':
                    this.retrieveFile(this.checked, false)
                    break;
            }
        },
        openFolder (item) {
            let data = cloneDeep(item)
            data.index = this.tree.length
            this.prev = data
            this.tree.push(data)
            this.pid = item.folder_id
            this.is_sys = item.is_sys
            this.getFolder(this.pid, true)
        },
        backFolder (item) {
            let data = cloneDeep(item), count = this.tree.length - data.index
            this.tree.splice(item.index, count)
            this.pid = data.pid
            if (this.pid == '0') {
                this.prev = {}
                this.is_sys = false
            } else {
                this.prev = this.tree[item.index - 1]
                this.is_sys = item.is_sys
            }
            this.getFolder(this.pid, true)
        },
        toFolder (item) {
            let data = cloneDeep(item), count = this.tree.length - data.index + 1
            this.tree.splice(item.index + 1, count)
            this.pid = data.folder_id
            if (this.pid == '0') {
                this.prev = {}
                this.is_sys = false
            } else {
                this.prev = this.tree[item.index]
                this.is_sys = item.is_sys
            }
            this.getFolder(this.pid, true)
        },
        getFile (item) {
            this.form = cloneDeep(item)
            this.form.size = this.bytesToSize(this.form.size)
            this.Visible = true
        }
    }
}
</script>

<style scoped>
.empty {
    color: #909399;
    text-align: center;
    font-size: 13px;
}

.el-form-item--mini.el-form-item {
    margin-bottom: 0;
}

.bottom {
    margin-top: 5px;
    line-height: 12px;
    font-size: 12px;
    color: #999;
}

.button {
    float: right;
    line-height: 15px;
    color: #999;
    font-size: 13px;
}

.image {
    width: 100%;
    display: block;
    height: 120px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}

.fa.fa-ellipsis-v {
    cursor: pointer;
    width: 10px;
    text-align: right;
}

.name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 13px;
    max-width: calc(100% - 10px);
    line-height: 15px;
    display: inline-block;
}

.el-dropdown-menu--mini .el-dropdown-menu__item {
    min-width: 40px;
    padding: 2px 10px;
}

.el-checkbox {
    width: calc(100% - 10px);
    height: 19px;
}

.el-checkbox >>> .el-checkbox__input {
    line-height: 15px;
}

.el-checkbox >>> .el-checkbox__inner {
    top: -3px;
}

.el-checkbox >>> .el-checkbox__label {
    padding-left: 10px;
    width: calc(100% - 20px);
}

.el-form--inline .el-form-item:last-child {
    margin-right: 0;
}

.show .el-form-item {
    padding-bottom: 10px;
}
</style>

<style>
.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: #909399;
    font-size: 30px;
    height: 120px;
}

.el-card {
    margin: 0 5px 10px 5px;
}
</style>