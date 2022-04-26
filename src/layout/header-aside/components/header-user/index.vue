<template>
    <el-dropdown
        class="admin-mr"
        @command="handleCommand"
    >
        <span class="btn-text">{{getUsernameFlter()}}</span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="admin">
                    <i class="fa fa-user-circle"></i>
                    个人中心
                </el-dropdown-item>

                <el-dropdown-item
                    v-if="isMark()"
                    command="database"
                >
                    <i class="fa fa-refresh"></i>
                    重置数据库
                </el-dropdown-item>

                <el-dropdown-item command="logout">
                    <admin-icon
                        name="power-off"
                        class="admin-mr-5"
                    />
                    注销
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>

        <Admin
            ref="adminData"
            :params="params"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
            @callback="handleClose"
        ></Admin>
    </el-dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { cloneDeep } from "lodash";
import { AgainCreateDrop } from "@api/sys.base";
import Admin from "@/layout/pages/sys/admin/info.vue";
import useCurrentInstance from "@/proxy";

const { proxy } = useCurrentInstance() as any;
const store = useStore();
const user = computed(() => store.getters["user/user"]) as any;
const params = ref({});
const centerDialogVisible = ref(false);

function getUsernameFlter() {
    if (user.value && Object.keys(user.value).length > 0) {
        let name = user.value.nickname
            ? user.value.nickname
            : user.value.username;
        return name ? `你好 ${name}` : "未登录";
    }
    return "未登录";
}

function getInfo() {
    params.value = cloneDeep(user.value);
    centerDialogVisible.value = true;
}

function handleClose(data) {
    if (data.admin_id) user.value = cloneDeep(data);
    centerDialogVisible.value = false;
}

function isMark() {
    return user.value ? user.value.is_admin : false;
}

function handleCommand(command) {
    switch (command) {
        case "admin":
            getInfo();
            break;
        case "logout":
            store.dispatch("account/logout", {
                confirm: true,
            });
            break;
        case "database":
            proxy
                .$confirm("重置数据库将清空所有数据，确定要重置吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    let loadingInstance = proxy.$loading(
                        proxy.loadOption("正在重置数据库中.....")
                    );
                    AgainCreateDrop()
                        .then((res) => {
                            loadingInstance.close();
                            proxy
                                .$confirm("请重新登录", "提示", {
                                    confirmButtonText: "确定",
                                    type: "success",
                                    showClose: false,
                                    showCancelButton: false,
                                    closeOnClickModal: false,
                                    closeOnPressEscape: false,
                                    closeOnHashChange: false,
                                })
                                .then(() => {
                                    store.dispatch("account/logout");
                                });
                        })
                        .catch(async (res) => {
                            loadingInstance.close();
                        });
                });
            break;
    }
}
</script>

<style scoped>
.el-dropdown-menu--small .el-dropdown-menu__item {
    padding: 5px 15px;
}
</style>
