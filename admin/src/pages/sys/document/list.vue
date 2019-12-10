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
                >上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="20">
            <el-col
                :xs="6"
                :sm="6"
                :md="4"
                :lg="4"
                :xl="3"
                v-for="(item, index) in 6"
                :key="item"
            >
                <el-card :body-style="{ padding: '0px' }">
                    <el-image
                        lazy
                        class="image"
                        :src="'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'"
                    >
                        <div
                            slot="error"
                            class="image-slot"
                        >
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                    <div style="padding: 5px;">
                        <span>好吃的汉堡</span>
                        <div class="bottom clearfix">
                            <span>1.1MB</span>
                            <i
                                class="fa fa-search"
                                aria-hidden="true"
                            ></i>
                            <i
                                class="fa fa-cloud-download"
                                aria-hidden="true"
                            ></i>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <!-- <el-col class="empty" v-if="list.length == 0">暂无数据</el-col> -->
        </el-row>

        <Pagination
            slot="footer"
            :page="page"
            :total="total"
            :size="size"
            @handleSize="handleSize"
            @handleCurrent="handleCurrent"
        ></Pagination>
    </d2-container>
</template>

<script>
import { CreateDocument, DelDocument, RetrieveDocument, DownDocument, QueryDocumentByParam } from '@api/sys.document'
import { cloneDeep } from 'lodash'
import Pagination from '@/pages/pagination/index.vue'
// 获取缓存菜单需要
import util from '@/libs/util.js'
export default {
    name: 'sys-document',
    props: {
        type: Number, // 列表查询 1：全部 2：不包括回收
        visible: Boolean
    },
    components: { Pagination },
    data() {
        return {
            list: [],
            page: 1,
            total: 0,
            size: 20,
            loading: false,
            isShow: false,
            isDel: 0
        }
    },
    watch: {
        visible(val) {
            this.isShow = val
            if (val) this.init()
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
        handleSize(size) {
            this.size = size
            this.page = 1
            this.init()
        },
        handleCurrent(page) {
            this.page = page
            this.init()
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
    margin-top: 13px;
    line-height: 12px;
    font-size: 13px;
    color: #999;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}
</style>