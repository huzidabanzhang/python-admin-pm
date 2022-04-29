<template>
    <admin-container>
        <template v-slot:header>
            <el-button
                title="返回上一级"
                style="float: left"
                circle
                v-if="pid != '0' && !isDel"
                :icon="Back"
                @click="backFolder(prev)"
            ></el-button>

            <el-breadcrumb
                v-if="!isDel"
                separator-class="el-icon-arrow-right"
                style="float: left; height: 30px; padding-left: 10px; line-height: 30px"
            >
                <el-breadcrumb-item v-for="(item, index) in tree"
                    ><a @click="toFolder(item)">{{ item.name }}</a></el-breadcrumb-item
                >
            </el-breadcrumb>

            <el-form :inline="true" style="float: right">
                <el-form-item v-if="!isDel">
                    <el-button type="danger" @click="changeFolder(true)">回收站 </el-button>
                </el-form-item>

                <el-form-item v-if="isDel">
                    <el-button @click="changeFolder(false)">文件夹 </el-button>
                </el-form-item>

                <el-form-item v-if="isDel">
                    <el-dropdown split-button @command="handleCommand">
                        <el-icon>
                            <setting />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="3" :disabled="auth.retrieve">还原</el-dropdown-item>
                                <el-dropdown-item command="2" :disabled="auth.del">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-form-item>

                <el-form-item v-if="!isDel">
                    <el-dropdown split-button @command="handleCommand">
                        <el-icon>
                            <setting />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="1" :disabled="auth.retrieve">移动到回收站</el-dropdown-item>
                                <el-dropdown-item command="2" :disabled="auth.del">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-form-item>

                <el-form-item v-if="!isDel">
                    <el-button type="primary" @click="addFolder" :disabled="auth.addf" :icon="Plus" v-auth:addf_folder
                        >新建文件夹
                    </el-button>
                </el-form-item>

                <el-form-item v-if="!isDel">
                    <el-button
                        type="primary"
                        @click="centerDialogVisible = true"
                        :disabled="auth.add || pid == '0'"
                        v-auth:add_document
                        :icon="UploadFilled"
                        >上传</el-button
                    >
                </el-form-item>
            </el-form>
        </template>

        <el-space wrap v-loading="loading">
            <el-checkbox-group v-model="checked">
                <div v-for="(item, index) in data" :key="index">
                    <el-card v-if="item.is_folder" :body-style="{ padding: '10px' }">
                        <div>
                            <div class="name" :title="item.name">{{ item.name }}</div>
                            <el-dropdown class="button" trigger="click" placement="bottom-start">
                                <span class="el-dropdown-link">
                                    <i class="fa fa-ellipsis-v"></i>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click.native="openFolder(item)">打开文件夹</el-dropdown-item>
                                        <el-dropdown-item
                                            @click.native="setFolder(item)"
                                            v-if="item.admin_id && (user.admin_id == item.admin_id || user.is_admin)"
                                            :disabled="auth.setf"
                                            >重命名</el-dropdown-item
                                        >
                                        <el-dropdown-item
                                            @click.native="delFolder(item)"
                                            v-if="item.admin_id && (user.admin_id == item.admin_id || user.is_admin)"
                                            :disabled="auth.delf"
                                            >删除</el-dropdown-item
                                        >
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                        <div class="el-image image">
                            <div class="image-slot">
                                <img src="./image/folder.png" />
                            </div>
                        </div>
                    </el-card>

                    <el-card :body-style="{ padding: '10px' }" v-else>
                        <div>
                            <el-checkbox :label="item.document_id">
                                <div class="name" :title="item.name">{{ item.name }}</div>
                            </el-checkbox>
                            <el-dropdown class="button" trigger="click" placement="bottom-start">
                                <span class="el-dropdown-link">
                                    <i class="fa fa-ellipsis-v"></i>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item
                                            v-if="!isDel"
                                            @click.native="retrieveFile([item.document_id], true)"
                                            :disabled="auth.retrieve"
                                            >移到回收站</el-dropdown-item
                                        >
                                        <el-dropdown-item
                                            v-if="isDel"
                                            @click.native="retrieveFile([item.document_id], false)"
                                            :disabled="auth.retrieve"
                                            >还原</el-dropdown-item
                                        >
                                        <el-dropdown-item
                                            @click.native="down(item.path, item.name)"
                                            :disabled="auth.down"
                                            >下载</el-dropdown-item
                                        >
                                        <el-dropdown-item
                                            @click.native="delFile([item.document_id])"
                                            :disabled="auth.del"
                                            >删除</el-dropdown-item
                                        >
                                        <el-dropdown-item @click.native="getFile(item)">属性</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
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
                            <div slot="error" class="image-slot">
                                <el-button :icon="Picture"></el-button>
                            </div>
                        </el-image>
                        <div class="el-image image" v-else>
                            <div class="image-slot">
                                <img src="./image/file.png" />
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-checkbox-group>
        </el-space>

        <template v-slot:footer>
            <Pagination
                :page="page"
                :total="total"
                :size="size"
                :layout="'prev, pager, next, jumper'"
                @handleSize="handleSize"
                @handleCurrent="handleCurrent"
            ></Pagination>
        </template>

        <Upload :centerDialogVisible="centerDialogVisible" :folder_id="pid" @handleClose="handleClose"></Upload>

        <el-dialog
            title="附件属性"
            v-model="Visible"
            width="400px"
            append-to-body
            destroy-on-close
            @closed="Visible = false"
        >
            <el-form label-width="80px" ref="adminForm" :model="form" class="show">
                <el-form-item label="创建者" prop="username">
                    <el-input v-model="form.username" readonly></el-input>
                </el-form-item>
                <el-form-item label="文件名" prop="name">
                    <el-input v-model="form.name" readonly></el-input>
                </el-form-item>
                <el-form-item label="大小" prop="size">
                    <el-input v-model="form.size" readonly></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="create_time">
                    <el-input v-model="form.create_time" readonly></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </admin-container>
</template>

<script setup lang="ts">
import { Setting, Picture, UploadFilled, Back, Plus } from '@element-plus/icons-vue'
import { DelDocument, RetrieveDocument, DownDocument, QueryDocumentByParam } from '@api/sys.document'
import { DelFolder, CreateFolder, ModifyFolder, QueryFolderByParam } from '@api/sys.folder'
import { cloneDeep } from 'lodash'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import Pagination from '@/layout/pages/pagination/index.vue'
import Upload from '@/layout/pages/upload/index.vue'
import useCurrentInstance from '@/proxy'

const { _this } = useCurrentInstance()
const store = useStore()
const props = defineProps({
    visible: Boolean
})
const auth = {
    add: false,
    down: false,
    del: false,
    retrieve: false,
    addf: false,
    setf: false,
    listf: false,
    delf: false
}
const loading = ref(false)
const isDel = ref(false)
const centerDialogVisible = ref(false)
const Visible = ref(false)
const is_sys = ref(false)
const data = ref([])
const checked = ref([])
const prev = ref({})
const form = ref({}) as any
const tree = ref([
    {
        name: '根目录',
        folder_id: '0',
        index: 0
    }
])
const page = ref(1)
const total = ref(0)
const size = ref(40)
const pid = ref('0')
const src = store.getters['api/base'] + '/API/v1/Document/GetDocument'
const user = store.getters['user/user']

watch(
    () => props.visible,
    (val) => {
        if (val) getFolder(pid.value, true)
    },
    {
        immediate: true,
        deep: true
    }
)

function init() {
    let params = {
        page: page.value,
        page_size: size.value,
        deleted: isDel.value,
        folder_id: pid.value
    }

    loading.value = true
    QueryDocumentByParam(params)
        .then(async (res) => {
            checked.value = []
            total.value = res.total
            for (let i = 0; i < data.value.length; i++) {
                if (data.value[i].is_folder == false) {
                    data.value.splice(i)
                    i--
                }
            }
            for (let i = 0; i < res.data.length; i++) {
                let item = res.data[i]
                item.is_folder = false
                data.value.push(item)
            }
            loading.value = false
        })
        .catch(() => {
            loading.value = false
        })
}

function changeFolder(visible) {
    isDel.value = visible
    if (visible) {
        data.value = []
        page.value = 1
        init()
    } else getFolder(pid.value, true)
}

function getFolder(pid, isInit) {
    loading.value = true
    QueryFolderByParam({
        pid: pid,
        admin_id: user.admin_id
    })
        .then(async (res) => {
            data.value = res.map((i) => {
                let item = i
                item.is_folder = true
                return item
            })
            if (isInit) page.value = 1
            init()
        })
        .catch(() => {
            loading.value = false
        })
}

function down(src, name) {
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
        document.body.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放blob对象
    })
}

function handleSize(size) {
    size.value = size
    page.value = 1
    init()
}

function handleCurrent(page) {
    page.value = page
    init()
}

function handleClose(params) {
    centerDialogVisible.value = params.change
    page.value = 1
    init()
}

function bytesToSize(bytes) {
    if (bytes === 0) return '0 B'
    let k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k))

    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

function addFolder() {
    _this
        .$prompt('', '新建文件夹', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入文件夹名',
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    instance.confirmButtonText = '提交中...'
                    CreateFolder({
                        name: instance.inputValue,
                        pid: pid.value,
                        is_sys: is_sys.value,
                        admin_id: user.admin_id
                    })
                        .then(async (res) => {
                            instance.confirmButtonLoading = false
                            getFolder(pid.value, false)
                            done()
                        })
                        .catch(() => {
                            instance.confirmButtonLoading = false
                        })
                } else {
                    done()
                }
            }
        })
        .then(() => {
            _this.$message.success('创建文件夹成功')
        })
        .catch()
}

function setFolder(item) {
    _this
        .$prompt('', '重命名文件夹', {
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
                        .then(async (res) => {
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
        })
        .then(() => {
            _this.$message.success('重命名文件夹成功')
        })
        .catch()
}

function delFile(id) {
    _this
        .$confirm('确定将文件删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            DelDocument({
                document_id: id
            }).then(async (res) => {
                _this.$message.success('删除文件成功')
                init()
            })
        })
}

function retrieveFile(id, deleted) {
    _this
        .$confirm(deleted ? '确定将文件移到回收站吗？' : '确定还原文件吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            RetrieveDocument({
                document_id: id,
                deleted: deleted
            }).then(async (res) => {
                _this.$message.success('移动文件成功')
                init()
            })
        })
}

function delFolder(id) {
    _this
        .$confirm('删除该文件夹，其中的文件将转移到根目录下，确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            DelFolder({
                folder_id: id.folder_id
            }).then(async (res) => {
                _this.$message.success('删除文件夹成功')
                getFolder(pid.value, false)
            })
        })
}

function handleCommand(command) {
    if (checked.value.length == 0) return _this.$message.warning('未选择任何记录')
    switch (command) {
        case '1':
            retrieveFile(checked.value, true)
            break
        case '2':
            delFile(checked.value)
            break
        case '3':
            retrieveFile(checked.value, false)
            break
    }
}

function openFolder(item) {
    let data = cloneDeep(item)
    data.index = tree.value.length
    prev.value = data
    tree.value.push(data)
    pid.value = item.folder_id
    is_sys.value = item.is_sys
    getFolder(pid.value, true)
}

function backFolder(item) {
    let data = cloneDeep(item),
        count = tree.value.length - data.index
    tree.value.splice(item.index, count)
    pid.value = data.pid
    if (pid.value == '0') {
        prev.value = {}
        is_sys.value = false
    } else {
        prev.value = tree.value[item.index - 1]
        is_sys.value = item.is_sys
    }
    getFolder(pid.value, true)
}

function toFolder(item) {
    let data = cloneDeep(item),
        count = tree.value.length - data.index + 1
    tree.value.splice(item.index + 1, count)
    pid.value = data.folder_id
    if (pid.value == '0') {
        prev.value = {}
        is_sys.value = false
    } else {
        prev.value = tree.value[item.index]
        is_sys.value = item.is_sys
    }
    getFolder(pid.value, true)
}

function getFile(item) {
    form.value = cloneDeep(item)
    form.value.size = bytesToSize(form.value.size)
    Visible.value = true
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
    content: '';
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

.el-checkbox :deep(.el-checkbox__input) {
    line-height: 15px;
}

.el-checkbox :deep(.el-checkbox__inner) {
    top: -3px;
}

.el-checkbox :deep(.el-checkbox__label) {
    padding-left: 10px;
    width: calc(100% - 20px);
}

.el-form--inline .el-form-item {
    margin-right: 16px;
}

.el-form--inline .el-form-item:last-child {
    margin-right: 0;
}

.show .el-form-item {
    padding-bottom: 10px;
}

.el-checkbox-group {
    width: 100%;
}

.el-card {
    width: 180px;
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
