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
        </el-form>

        <el-row v-loading="loading">
            <el-col
                :xs="6"
                :sm="6"
                :md="6"
                :lg="4"
                :xl="3"
                v-for="(item, index) in list"
                :key="index"
            >
                <el-card :body-style="{ padding: '0px' }">
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
                            <i class="fa fa-file"></i>
                        </div>
                    </div>
                    <div style="padding: 5px;">
                        <div
                            class="name"
                            :title="item.name"
                        >{{item.name}}</div>
                        <div class="bottom clearfix">
                            <span>{{bytesToSize(item.size)}}</span>
                            <div class="button">
                                <i
                                    class="fa fa-cloud-download"
                                    aria-hidden="true"
                                    title="下载"
                                    @click="down(item.path, item.name)"
                                ></i>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col
                class="empty"
                v-if="list.length == 0"
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
            @handleClose="handleClose"
        ></Upload>
    </d2-container>
</template>

<script>
import { DelDocument, RetrieveDocument, DownDocument, QueryDocumentByParam } from '@api/sys.document'
import { cloneDeep } from 'lodash'
import Pagination from '@/pages/pagination/index.vue'
import Upload from '@/pages/upload/index.vue'
// 获取缓存菜单需要
import util from '@/libs/util.js'
export default {
    name: 'sys-document',
    props: {
        type: Number, // 列表查询 1：全部 2：不包括回收
        visible: Boolean
    },
    components: { Pagination, Upload },
    data() {
        return {
            list: [],
            page: 1,
            total: 0,
            size: 40,
            loading: false,
            isDel: 0,
            centerDialogVisible: false,
            src: '/API/v1/Document/GetDocument/'
        }
    },
    watch: {
        visible: {
            handler: function (val) {
                if (val) this.init()
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
                deleted: this.isDel
            }

            this.loading = true
            QueryDocumentByParam(params)
                .then(async res => {
                    this.total = res.total
                    this.list = res.data
                    this.loading = false
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
        }
    }
}
</script>

<style scoped>
.container-component {
    left: 300px !important;
}

.empty {
    color: #909399;
    text-align: center;
    font-size: 13px;
}

.el-form-item--mini.el-form-item {
    margin-bottom: 0;
}

.bottom {
    margin-top: 10px;
    line-height: 12px;
    font-size: 12px;
    color: #999;
}

.button {
    padding: 0;
    float: right;
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

.fa {
    cursor: pointer;
}

.name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 13px;
    padding: 5px 0px;
}
</style>

<style>
.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 30px;
    height: 150px;
}

.el-card {
    margin: 0 5px 10px 5px;
}

.el-image__inner {
    height: 150px;
}
</style>