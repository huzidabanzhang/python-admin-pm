<template>
    <d2-container>
        <el-form
            :inline="true"
            slot="header"
            size="mini"
        >
            <el-form-item>
                <el-button
                    type="primary"
                    size="mini"
                    @click="centerDialogVisible = true"
                >上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-form-item>

            <el-form-item>
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-circle-plus-outline"
                    @click="addFolder"
                >新建文件夹
                </el-button>
            </el-form-item>

        </el-form>

        <el-row v-loading="loading">
            <el-col
                :xs="6"
                :sm="6"
                :md="6"
                :lg="4"
                :xl="3"
                v-for="(item, index) in folder"
                :key="index"
            >
                <el-card :body-style="{ padding: '10px' }">
                    <div>
                        <div
                            class="name"
                            :title="item.name"
                        >{{item.name}}</div>
                        <el-dropdown
                            class="button"
                            trigger="click"
                            size="mini"
                            placement="bottom-start"
                        >
                            <span class="el-dropdown-link">
                                <i class="fa fa-ellipsis-v"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    @click.native="openFolder(item)"
                                    command="open"
                                >打开文件夹</el-dropdown-item>
                                <el-dropdown-item
                                    @click.native="setFolder(item)"
                                    v-if="user && user.mark == mark"
                                >重命名</el-dropdown-item>
                                <el-dropdown-item
                                    @click.native="delFolder(item, index)"
                                    v-if="user && user.mark == mark"
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
            </el-col>

            <el-col
                :xs="6"
                :sm="6"
                :md="6"
                :lg="4"
                :xl="3"
                v-for="(item, index) in file"
                :key="index"
            >
                <el-card :body-style="{ padding: '10px' }">
                    <div>
                        <el-checkbox v-model="index">
                            <div
                                class="name"
                                :title="item.name"
                            >{{item.name}}</div>
                        </el-checkbox>
                        <el-dropdown
                            class="button"
                            trigger="click"
                            size="mini"
                            placement="bottom-start"
                        >
                            <span class="el-dropdown-link">
                                <i class="fa fa-ellipsis-v"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>下载</el-dropdown-item>
                                <el-dropdown-item>删除</el-dropdown-item>
                                <el-dropdown-item>属性</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <el-image
                        lazy
                        class="image"
                        :src="src + item.path"
                        fit="contain"
                        v-if="item.type == 1"
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
                v-if="file.length == 0 && folder.length == 0"
            >暂无数据</el-col>
        </el-row>

        <Pagination
            slot="footer"
            :page="page"
            :total="total"
            :size="size"
            :pageList="[40, 80, 120]"
            @handleSize="handleSize"
            @handleCurrent="handleCurrent"
        ></Pagination>

        <Upload
            :centerDialogVisible="centerDialogVisible"
            :folder_id="pid"
            @handleClose="handleClose"
        ></Upload>
    </d2-container>
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
        type: Number, // 列表查询 1：全部 2：不包括回收
        visible: Boolean
    },
    components: { Pagination, Upload },
    data() {
        return {
            file: [],
            folder: [],
            checked: [],
            page: 1,
            total: 0,
            size: 40,
            loading: false,
            isDel: false,
            centerDialogVisible: false,
            prev_id: null,
            pid: null,
            src: '/API/v1/Document/GetDocument/',
            mark: setting.SYS_ADMIN.mark,
            user: this.$store.getters['d2admin/user/user']
        }
    },
    watch: {
        visible: {
            handler: function (val) {
                if (val) this.getFolder(this.pid)
            },
            immediate: true, //关键
            deep: true
        }
    },
    methods: {
        init() {
            let params = {
                page: this.page,
                page_size: this.size,
                deleted: this.isDel,
                folder_id: this.pid
            }

            this.loading = true
            QueryDocumentByParam(params)
                .then(async res => {
                    this.total = res.total
                    this.file = res.data
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        getFolder(pid) {
            this.loading = true
            QueryFolderByParam({
                pid: pid
            })
                .then(async res => {
                    this.folder = res
                    this.page = 1
                    this.init()
                })
                .catch(() => {
                    this.loading = false
                })
        },
        down(src, name) {
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
        handleSize(size) {
            this.size = size
            this.page = 1
            this.init()
        },
        handleCurrent(page) {
            this.page = page
            this.init()
        },
        handleClose(params) {
            this.centerDialogVisible = params.change
            this.page = 1
            this.init()
        },
        bytesToSize(bytes) {
            if (bytes === 0) return '0 B'
            let k = 1024,
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k))

            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
        },
        addFolder() {
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
                            pid: this.pid
                        })
                            .then(async res => {
                                instance.confirmButtonLoading = false
                                this.folder.push(res)
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
                this.$message.success('新建成功')
            }).catch()
        },
        setFolder(item) {
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
                this.$message.success('新建成功')
            }).catch()
        },
        delFolder(item, index) {
            
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
    min-height: 100px;
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
    padding-bottom: 5px;
}

.el-checkbox >>> .el-checkbox__input {
    line-height: 15px;
}

.el-checkbox >>> .el-checkbox__inner {
    top: -3px;
}

.el-checkbox >>> .el-checkbox__label {
    padding-left: 5px;
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

.el-image__inner {
    height: 120px;
}
</style>