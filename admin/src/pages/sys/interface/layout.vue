<template>
    <d2-container>
        <el-tree :data="menuData" show-checkbox node-key="menu_id" default-expand-all :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.title }}</span>
                <span>
                    <el-button type="text" size="mini" @click="() => append(data)">
                        Append
                    </el-button>
                    <el-button type="text" size="mini" @click="() => remove(node, data)">
                        Delete
                    </el-button>
                </span>
            </span>
        </el-tree>
    </d2-container>
</template>

<script>
import { QueryMenuByParam } from '@api/sys.menu'
export default {
    name: 'sys-menu',
    data() {
        return {
            menuData: [],
            loading: false,
            lock: '',
            isLock: '',
        }
    },
    created() {
        this.init()
    },
    methods: {
        init(isTrue) {
            // if (isTrue) this.centerDialogVisible = false
            let params = {}
            if (this.isLock != '') params['isLock'] = this.isLock

            this.loading = true
            QueryMenuByParam(params)
                .then(async res => {
                    this.menuData = []
                    this.dealData(res)
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        dealData(data) {
            while (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].parentId == '0') {
                        this.menuData.push(data[i])
                        data.splice(i, 1)
                        i--
                    } else {
                        let index = this.menuData.findIndex(item => item.menu_id == data[i].parentId)
                        if (index == -1) continue
                        if (!this.menuData[index].children) this.menuData[index].children = []
                        this.menuData[index].children.push(data[i])
                        data.splice(i, 1)
                        i--
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
</style>