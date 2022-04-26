<template>
    <admin-container>
        <template v-slot:header>
            <div>
                <el-button
                    circle
                    title="新增"
                    type="primary"
                    v-auth:add_interface
                    :icon="Plus"
                    @click="editInterface(auth.add)"
                ></el-button>
                <el-button
                    circle
                    title="显示"
                    type="success"
                    :icon="Check"
                    :disabled="auth.lock_all"
                    @click="lockInterface(interface_id, false)"
                ></el-button>
                <el-button
                    circle
                    title="隐藏"
                    type="info"
                    :icon="Close"
                    :disabled="auth.lock_all"
                    @click="lockInterface(interface_id, true)"
                ></el-button>
                <el-button
                    circle
                    title="删除"
                    type="danger"
                    :icon="Delete"
                    :disabled="auth.del_all"
                    @click="delInterface(interface_id)"
                ></el-button>
                <el-button
                    title="刷新"
                    circle
                    :icon="RefreshRight"
                    @click="init"
                ></el-button>

                <el-form
                    inline
                    class="form-right"
                >
                    <el-form-item>
                        <el-input
                            placeholder="接口名称"
                            v-model="search.name"
                            clearable
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select
                            v-model="search.disable"
                            placeholder="可见性"
                            clearable
                        >
                            <el-option
                                v-for="item in lockOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select
                            v-model="search.menu_id"
                            placeholder="所属菜单"
                            clearable
                        >
                            <el-option
                                v-for="item in menuOption"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select
                            v-model="search.role_id"
                            placeholder="所属角色"
                            clearable
                        >
                            <el-option
                                v-for="item in roleData"
                                :key="item.role_id"
                                :label="item.name"
                                :value="item.role_id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select
                            v-model="search.method"
                            placeholder="请求方式"
                            clearable
                        >
                            <el-option
                                v-for="item in methodOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            :icon="Search"
                            :loading="loading"
                            @click="init()"
                        >搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </template>

        <el-table
            style="width: 100%"
            height="100%"
            type="ghost"
            v-loading="loading"
            :data="interfaceData"
            @select="changeSelect"
            @select-all="changeSelect"
        >
            <el-table-column
                type="selection"
                width="55"
                :selectable="isAuth"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                align="left"
                width="200"
            >
            </el-table-column>
            <el-table-column
                prop="path"
                label="路由"
                align="left"
            > </el-table-column>
            <el-table-column
                prop="method"
                label="请求方式"
                align="center"
                width="100"
            >
            </el-table-column>
            <el-table-column
                prop="disable"
                label="可见性"
                align="left"
                width="100"
            >
                <template #default="scope">
                    <el-button
                        :type="scope.row.disable ? 'info' : 'success'"
                        :disabled="auth.lock"
                        @click="handleRowLock(scope.row)"
                    >{{scope.row.disable ? '隐藏' : '显示'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="menus"
                label="所属菜单"
                align="center"
                width="150"
            >
                <template #default="scope">
                    <el-tag
                        v-for="(i, k) in scope.row.menus"
                        :key="i.menu_id"
                    >{{i.name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="roles"
                label="所属角色"
                align="center"
                width="150"
            >
                <template #default="scope">
                    <el-tag
                        v-for="(i, k) in scope.row.roles"
                        :key="i.role_id"
                    >{{i.name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                label="描述"
                align="left"
                width="200"
            >
            </el-table-column>
            <el-table-column
                prop="mark"
                label="标识"
                align="left"
                width="200"
            >
                <template #default="scope">
                    <el-tag>{{ scope.row.mark }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="content"
                label="操作"
                align="left"
                width="100"
            >
                <template v-slot="scope">
                    <el-button
                        circle
                        title="编辑"
                        :icon="Edit"
                        @click="editInterface(auth.set, scope.row)"
                    ></el-button>
                    <el-button
                        v-if="isAuth(scope.row)"
                        circle
                        type="danger"
                        title="删除"
                        :disabled="auth.del"
                        :icon="Delete"
                        @click="delInterface([scope.row.interface_id])"
                    >
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <template v-slot:footer>
            <Pagination
                :page="page"
                :total="total"
                :size="size"
                @handleSize="handleSize"
                @handleCurrent="handleCurrent"
            ></Pagination>
        </template>

        <Info
            ref="roleInfo"
            :title="title"
            :params="params"
            :submit="btnSubmit"
            :roles="roleData"
            :def="roleDefault"
            :menus="menuOption"
            :centerDialogVisible="centerDialogVisible"
            @handleClose="handleClose"
            @callback="init"
        ></Info>
    </admin-container>
</template>

<script setup lang="ts">
import {
    RefreshRight,
    Plus,
    Check,
    Close,
    Delete,
    Edit,
    Search,
} from "@element-plus/icons-vue";
import {
    QueryInterfaceByParam,
    LockInterface,
    DelInterface,
} from "@/api/sys.interface";
import { QueryRoleByParam } from "@/api/sys.role";
import { ref, reactive, onMounted } from "vue";
import { cloneDeep } from "lodash";
import { useStore } from "vuex";
import Info from "./info.vue";
import Pagination from "@/layout/pages/pagination/index.vue";
import setting from "@/setting";
import util from "@/libs/util";
import useCurrentInstance from "@/proxy";

const { proxy } = useCurrentInstance() as any;
const store = useStore();
const lockOption = [
    { label: "显示", value: "false" },
    { label: "隐藏", value: "true" },
];
const methodOption = [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "DELETE", value: "DELETE" },
];
const auth = reactive({
    add: false,
    del: proxy.$auth("del_interface"),
    set: proxy.$auth("set_interface"),
    lock: proxy.$auth("lock_interface"),
    del_all: true,
    lock_all: true,
});
const auth_all = {
    del: proxy.$auth("del_interface"),
    lock: proxy.$auth("lock_interface"),
};
const interfaceData = ref([]);
const menuOption = ref([]);
const roleData = ref([]);
const interface_id = ref([]);
const params = ref({}) as any;
const page = ref(1);
const total = ref(0);
const size = ref(20);
const search = reactive({
    disable: "",
    menu_id: "",
    role_id: "",
    method: "",
    name: "",
});
const title = ref("");
const loading = ref(false);
const centerDialogVisible = ref(false);
const btnSubmit = ref(false);
const roleDefault = ref(null);

function pushMenu(ary) {
    ary.map((i) => {
        if (i.children && i.children.length > 0) {
            pushMenu(i.children);
        } else menuOption.value.push(i);
    });
}

function init(visible = false) {
    changeSelect([]);
    if (visible) centerDialogVisible.value = false;
    let params = {
        page: page.value,
        page_size: size.value,
    };

    for (let i in search) {
        if (search[i] !== "") params[i] = search[i];
    }

    loading.value = true;

    util.axiosAll(
        [
            QueryInterfaceByParam(params),
            QueryRoleByParam({
                is_default: true,
            }),
        ],
        (res) => {
            total.value = res[0].total;
            interfaceData.value = res[0].data;

            roleData.value = res[1].data;
            roleDefault.value = res[1].default;

            loading.value = false;
        },
        (err) => {
            loading.value = false;
        }
    );
}

function handleSize(size) {
    size.value = size;
    page.value = 1;
    init();
}

function handleCurrent(page) {
    page.value = page;
    init();
}

function handleClose() {
    centerDialogVisible.value = false;
}

function isAuth(row) {
    return !setting.lock_interface.some((i) => {
        return i === row.mark;
    });
}

function editInterface(disabled, row) {
    btnSubmit.value = disabled;
    title.value = row ? "编辑接口" : "新建接口";
    params.value = row
        ? cloneDeep(row)
        : {
              method: "GET",
              forbid: true,
              disable: false,
              menus: [],
              roles: [roleDefault.value],
          };
    if (row) {
        const roles = row.roles.map((i) => {
            return i.role_id;
        });
        const menus = row.menus.map((i) => {
            return i.menu_id;
        });
        params.value.roles = roles;
        params.value.menus = menus;
    }
    centerDialogVisible.value = true;
}

function changeSelect(selection) {
    interface_id.value = selection.map((i) => {
        return i.interface_id;
    });

    for (let i in auth_all) {
        if (!auth_all[i]) auth[i + "_all"] = interface_id.value.length === 0;
    }
}

function handleRowLock(row) {
    if (!isAuth(row)) return true;

    delInterface([row.role_id]);
}

function lockInterface(keys, disable) {
    if (keys.length === 0) return proxy.$message.warning("未选择任何记录");

    proxy
        .$confirm(
            disable ? "确定要隐藏该接口吗" : "确定要显示该接口吗",
            disable ? "隐藏接口" : "显示接口",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }
        )
        .then(() => {
            Lock(keys, disable);
        })
        .catch();
}

function delInterface(interface_id) {
    if (interface_id.length === 0)
        return proxy.$message.warning("未选择任何记录");

    proxy
        .$confirm("确定要删除该接口吗", "删除接口", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
        .then(() => {
            DelInterface({
                interface_id: interface_id,
            }).then(async (res) => {
                getInterfaceInfo(interface_id, 1);
                proxy.$message.success("接口删除成功");
                init();
            });
        });
}

function getInterfaceInfo(interface_id, type, disable = "") {
    let interfaces = cloneDeep(store.getters["user/interfaces"]);
    interface_id.map((i) => {
        for (let j = 0; j < interfaces.length; j++) {
            if (i === interfaces[j].interface_id) {
                if (type === 1) {
                    interfaces.splice(j);
                    j--;
                }

                if (type === 2) interfaces[j].disable = disable === "true";
                break;
            }
        }
    });

    util.initInterface(interfaces);
}

function Lock(keys, disable) {
    LockInterface({
        interface_id: keys,
        disable: disable,
    }).then(async (res) => {
        getInterfaceInfo(keys, 2, disable);
        proxy.$message.success(disable ? "接口隐藏成功" : "接口显示成功");
        init();
    });
}

onMounted(() => {
    menuOption.value = [];
    pushMenu(util.getMenuTree(true));
    init();
});
</script>

<style scoped>
.el-select {
    width: 120px;
}
.el-input {
    width: 120px;
}
.el-form-item.el-form-item {
    margin-bottom: 0;
    margin-right: 16px;
}
.el-form--inline .el-form-item:last-child {
    margin-right: 0;
}
.form-right {
    float: right;
}
.el-table .cell .el-tag {
    margin: 0 8px 8px 0;
}
</style>
