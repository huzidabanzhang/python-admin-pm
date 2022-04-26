<template>
    <el-drawer
        size="600px"
        append-to-body
        v-model="Visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :title="title"
        :before-close="handleClosed"
    >
        <el-form
            v-loading="loading"
            ref="roleForm"
            label-width="80px"
            :model="form"
            :rules="rules"
        >
            <el-form-item
                label="角色名"
                prop="name"
            >
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item
                label="标识"
                prop="mark"
            >
                <el-input
                    v-model="form.mark"
                    :readonly="!form.role_id"
                ></el-input>
            </el-form-item>
            <el-form-item
                prop="disable"
                label="可见性"
            >
                <el-switch
                    v-model="form.disable"
                    :active-value="false"
                    :inactive-value="true"
                />
            </el-form-item>
            <el-form-item label="菜单">
                <el-tree
                    ref="treeMenu"
                    node-key="menu_id"
                    show-checkbox
                    default-expand-all
                    :data="menu"
                    :props="prop"
                    :default-checked-keys="select"
                >
                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <span>
                                ({{ data.type === 'MENU' ? `菜单` : `接口` }}) {{ data.title }}
                            </span>
                        </span>
                    </template>
                </el-tree>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button
                    type="danger"
                    style="float: left"
                    v-if="params.role_id"
                    :disabled="delAuth"
                    :icon="Delete"
                    @click="delRole"
                ></el-button>
                <el-button @click="handleClosed">取 消</el-button>
                <el-button
                    type="primary"
                    :loading="isSubmit"
                    :disabled="addAuth"
                    @click="handelInfo('roleForm')"
                >提 交</el-button>
            </span>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";
import { QueryMenuByParam } from "@/api/sys.menu";
import { CreateRole, ModifyRole, DelRole } from "@/api/sys.role";
import { cloneDeep } from "lodash";
import { ref, watch, nextTick } from "vue";
import useCurrentInstance from "@/proxy";

const { proxy } = useCurrentInstance() as any;
const props = defineProps({
    title: String,
    params: Object,
    centerDialogVisible: Boolean,
    submit: Boolean,
    del: Boolean,
});
const emits = defineEmits(["callback", "handleClose"]);

const prop = {
    label: "title",
    children: "children",
};
const rules = {
    name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
    mark: [{ required: true, message: "请输入标识", trigger: "blur" }],
};
const addAuth = ref(false);
const delAuth = ref(false);
const Visible = ref(false);
const loading = ref(false);
const isSubmit = ref(false);
const form = ref({}) as any;
const menu = ref([]);
const select = ref([]);

watch(
    () => props.centerDialogVisible,
    (val) => {
        Visible.value = val;
        if (val) {
            form.value = cloneDeep(props.params);
            getMenuList();
        }
    },
    { immediate: true }
);

watch(
    () => props.del,
    (val) => {
        delAuth.value = val;
    },
    { immediate: true }
);

watch(
    () => props.submit,
    (val) => {
        addAuth.value = val;
    },
    { immediate: true }
);

function getMenuList() {
    menu.value = [];

    let params = { is_interface: true };
    if (props.params.role_id) params["role_id"] = props.params.role_id;

    loading.value = true;
    QueryMenuByParam(params)
        .then(async (res) => {
            dealData(res.data);
            nextTick(() => {
                select.value = res.select;
            });
            loading.value = false;
        })
        .catch(() => {
            loading.value = false;
        });
}

function dealData(data) {
    while (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].pid == "0") {
                menu.value.push(data[i]);
                data.splice(i, 1);
                i--;
            } else {
                let index = menu.value.findIndex(
                    (item) => item.menu_id == data[i].pid
                );
                if (index == -1) continue;
                menu.value[index].children.push(data[i]);
                data.splice(i, 1);
                i--;
            }
        }
    }
}

function handelInfo(formName) {
    proxy.$refs[formName].validate((valid) => {
        if (valid) {
            let role = [],
                menu = [];
            proxy.$refs.treeMenu.getCheckedNodes().forEach((i) => {
                if (i.type !== "MENU") role.push(i.menu_id.split(".")[1]);
                else menu.push(i.menu_id);
            });
            proxy.$refs.treeMenu.getHalfCheckedNodes().forEach((i) => {
                if (i.type !== "MENU") role.push(i.menu_id);
                else menu.push(i.menu_id);
            });

            isSubmit.value = true;
            let params = {
                interfaces: role,
                menu: menu,
                name: form.value.name,
                mark: form.value.mark,
                disable: form.value.disable,
            };

            if (props.params.role_id) {
                params["role_id"] = props.params.role_id;
                ModifyRole(params)
                    .then(async (res) => {
                        handleInitParent("角色编辑成功");
                    })
                    .catch(() => {
                        isSubmit.value = false;
                    });
            } else {
                CreateRole(params)
                    .then(async (res) => {
                        handleInitParent("角色创建成功");
                    })
                    .catch(() => {
                        isSubmit.value = false;
                    });
            }
        }
    });
}

function handleInitParent(title) {
    proxy.$message.success(title);
    isSubmit.value = false;
    emits("callback", true);
}

function handleClosed() {
    emits("handleClose", false);
}

function delRole() {
    proxy
        .$confirm("确定要删除该角色吗", "删除角色", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
        .then(() => {
            DelRole({
                role_id: [props.params.role_id],
            }).then(async (res) => {
                proxy.$message.success("删除角色成功");
                emits("callback", true);
            });
        });
}
</script>

<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 8px;
}
</style>

<style>
.el-tree-node__content {
    line-height: 30px;
    height: 30px;
}
</style>
