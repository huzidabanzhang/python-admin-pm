<template>
    <div>
        <el-tree
            :data="folderData"
            :props="tree_prop"
            node-key="folder_id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="getFolderItem"
            v-loading="loading"
            class="tree_left"
        >
            <span
                class="custom-tree-node"
                slot-scope="{ node, data }"
            >
                <span class="label"><i class="fa fa-folder-open-o"></i>{{ node.label }}</span>
                <span>
                    <el-button
                        type="text"
                        size="mini"
                        class="danger"
                        @click.stop="removeFolder(node, data)"
                        v-if="data.folder_id != '0'"
                    >
                        <i class="el-icon-delete"></i>
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        class="text"
                        @click.stop="addFolder(data)"
                    >
                        <i class="fa fa-plus"></i>
                    </el-button>
                </span>
            </span>
        </el-tree>

        <Docment
            :visible="visible"
            :type="1"
        ></Docment>
    </div>
</template>

<script>
import { DelFolder, CreateFolder, ModifyFolder, QueryFolderByParam } from '@api/sys.folder'
import Docment from './list.vue'
export default {
    components: { Docment },
    data() {
        return {
            visible: false,
            folderData: [
                {name: '系统', parent_id: '0', folder_id: '0'}
            ],
            tree_prop: {
                label: 'name',
                children: 'children'
            },
            loading: false
        }
    },
    created() {
        this.visible = true
        this.init()
    },
    methods: {
        init() {
            QueryFolderByParam({})
                .then(async res => {
                    console.log(res)
                })
                .catch(() => {

                })
        },
        getFolderItem() {

        },
        addFolder(data) {

        },
        removeFolder(node, data) {

        }
    }
}
</script>


<style lang="scss" scoped>
.tree_left {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    width: 300px;
    padding: 10px 0;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
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

.danger {
    color: #F56C6C;
}

.text {
    color: #606266;
}
</style>

<style>
.el-tree-node__content {
    line-height: 35px;
    height: 35px;
}
</style>