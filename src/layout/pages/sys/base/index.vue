<template>
    <el-dialog
        title="数据库管理"
        width="350px"
        append-to-body
        destroy-on-close
        v-model="visible"
        @closed="handleClose"
    >
        <el-button-group>
            <el-button
                type="danger"
                v-auth:export_sql
                :disabled="$auth('export')"
                @click="handleDataBase('export')"
            >备份数据库</el-button>
            <el-button
                type="danger"
                v-if="handleVisible"
                @click="handleDataBase('import')"
            >导入数据库</el-button>
            <el-button
                type="danger"
                v-if="handleVisible"
                @click="handleDataBase('init')"
            >重置数据库</el-button>
        </el-button-group>

        <input
            type="file"
            style="display: none"
            ref="SQL_FILE"
            @change="handleImport"
        />

        <DataBase
            :params="form"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleDataBaseClose"
        ></DataBase>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, inject } from "vue";
import { useStore } from "vuex";
import { AgainCreateDrop, ImportSql } from "@/api/sys.base";
import DataBase from "./select.vue";
import useCurrentInstance from "@/proxy";

const { proxy } = useCurrentInstance() as any;
const store = useStore();
const props = defineProps({
    Visible: Boolean,
});

const visible = ref(false);
const centerDialogVisible = ref(false);
const form = ref({ type: 1 });
const user = computed(() => store.getters["user/user"]);

const handleVisibles = inject("handleVisible") as any;

watch(
    () => props.Visible,
    (val) => {
        visible.value = val;
    },
    { immediate: true }
);

function handleClose() {
    handleVisibles(false);
}

function handleDataBaseClose() {
    centerDialogVisible.value = false;
}

function handleVisible() {
    return user.value ? user.value.is_admin : false;
}

function handleLogout() {
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
}

function handleDataBase(command) {
    switch (command) {
        case "export":
            form.value.type = 1;
            centerDialogVisible.value = true;
            break;
        case "import":
            proxy
                .$confirm("导入数据库将覆盖所有数据，确定要导入吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    proxy.$refs.SQL_FILE.click();
                });
            break;
        case "init":
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
                        .then(async (res) => {
                            loadingInstance.close();
                            handleLogout();
                        })
                        .catch(async (res) => {
                            loadingInstance.close();
                        });
                });
            break;
    }
}

function handleImport() {
    let formData = new FormData(),
        file = (event.target as any).files;

    if (file.length == 0) return proxy.$message.warning("请选择上传文件");

    formData.append("document", file[0]);

    let loadingInstance = proxy.$loading(
        proxy.loadOption("正在导入数据库中.....")
    );

    ImportSql(formData)
        .then((response) => {
            loadingInstance.close();
            handleLogout();
            proxy.$refs.SQL_FILE.value = "";
        })
        .catch(async (res) => {
            loadingInstance.close();
            proxy.$refs.SQL_FILE.value = "";
        });
}
</script>

<style scoped>
.el-form-item:last-child {
    margin-bottom: 0;
    margin-right: 0;
}
</style>
