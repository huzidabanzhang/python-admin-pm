<template>
    <span>
        <el-popover
            ref="popover"
            :virtual-ref="popButton"
            :placement="placement"
            width="300px"
            virtual-triggering
            trigger="click"
        >
            <el-row
                type="flex"
                justify="end"
                class="admin-mb-10"
                v-if="clearable"
            >
                <el-button
                    type="danger"
                    :icon="Delete"
                    class="admin-fr"
                    size="small"
                    @click="selectIcon()"
                >
                    清空
                </el-button>
            </el-row>
            <el-input
                v-model="searchText"
                :clearable="true"
                placeholder="搜索 比如 'plus'"
                :prefix-icon="Search"
            >
            </el-input>
            <el-collapse
                v-if="!searchMode"
                class="admin-icon-select--group"
                v-model="collapseActive"
            >
                <el-collapse-item
                    v-for="(item, index) in icon"
                    :key="index"
                    :title="item.title"
                    :name="index"
                    class="admin-icon-select--class"
                >
                    <el-row class="admin-icon-select--class-row">
                        <el-col
                            class="admin-icon-select--class-col"
                            v-for="(iconName, iconIndex) in item.icon"
                            :key="iconIndex"
                            :span="4"
                            @click="selectIcon(iconName)"
                        >
                            <i :class="'fa fa-' + iconName"></i>
                        </el-col>
                    </el-row>
                </el-collapse-item>
            </el-collapse>
            <div
                v-if="searchMode"
                class="admin-icon-select--group"
            >
                <div
                    class="admin-icon-select--class"
                    v-for="(item, index) in iconFilted"
                    :key="index"
                >
                    <div class="admin-icon-select--class-title">{{ item.title }}</div>
                    <el-row class="admin-icon-select--class-row">
                        <el-col
                            class="admin-icon-select--class-col"
                            v-for="(iconName, iconIndex) in item.icon"
                            :key="iconIndex"
                            :span="4"
                            @click="selectIcon(iconName)"
                        >
                            <i :class="'fa fa-' + iconName"></i>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-popover>
        <!-- 允许用户输入 -->
        <el-input
            v-bind="bind"
            v-if="userInput"
            v-model="currentValue"
            style="max-width: 240px"
            @blur="blur"
            @clear="clear"
        >
            <i
                v-if="value"
                :class="'fa fa-' + value"
            ></i>
            <template #append>
                <el-button ref="popButton">
                    <i class="fa fa-list"></i>
                </el-button>
            </template>
        </el-input>
        <!-- 不允许用户输入 -->
        <el-button
            v-if="!userInput"
            ref="popButton"
        >
            <i
                v-if="value"
                :class="'fa fa-' + value"
            ></i>
            &nbsp;{{ value ? value : placeholder }}
        </el-button>
    </span>
</template>

<script setup lang="ts">
import { Delete, Search } from "@element-plus/icons-vue";
import { ref, computed, watch } from "vue";
import icon from "./data/index";
import useCurrentInstance from "@/proxy";

const { proxy } = useCurrentInstance() as any;
const props = defineProps({
    // 值
    value: {
        type: String,
        required: false,
        default: "",
    },
    // 占位符
    placeholder: {
        type: String,
        required: false,
        default: "请选择",
    },
    // 弹出界面的方向
    placement: {
        type: String,
        required: false,
        default: "right",
    },
    // 是否可清空
    clearable: {
        type: Boolean,
        required: false,
        default: true,
    },
    // 是否允许用户输入
    userInput: {
        type: Boolean,
        required: false,
        default: false,
    },
    // 是否在选择后自动关闭
    autoClose: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const emits = defineEmits(["update:value"]);

const popover = ref();
const popButton = ref();
const currentValue = ref("");
const searchText = ref("");
const collapseActive = ref([]);
const bind = computed(() => {
    return {
        placeholder: props.placeholder,
        clearable: props.clearable,
        ...proxy.$attrs,
    };
});
const searchMode = computed(() => {
    return !!searchText.value;
});
const iconFilted = computed(() => {
    return icon
        .map((iconClass) => ({
            title: iconClass.title,
            icon: iconClass.icon.filter(
                (icon) => icon.indexOf(searchText.value) >= 0
            ),
        }))
        .filter((iconClass) => iconClass.icon.length > 0);
});

watch(
    () => props.value,
    (value) => {
        currentValue.value = value;
    },
    { immediate: true }
);

function selectIcon(iconName = "") {
    emits("update:value", iconName);
    if (iconName && props.autoClose) (proxy.$refs.popover as any).hide();
}

function clear() {
    emits("update:value", "");
}

function blur() {
    emits("update:value", this.currentValue);
}
</script>

<style lang="scss" scoped>
.admin-icon-select--group {
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-top: none;
    border-bottom: none;
    .admin-icon-select--class {
        .admin-icon-select--class-title {
            line-height: 30px;
            text-align: center;
            background-color: $color-bg;
            border-radius: 4px;
            margin: 10px 0px;
        }
        .admin-icon-select--class-row {
            .admin-icon-select--class-col {
                line-height: 40px;
                text-align: center;
                color: $color-text-sub;
                &:hover {
                    color: $color-text-main;
                    background-color: $color-bg;
                    border-radius: 4px;
                    font-size: 26px;
                    box-shadow: inset 0px 0px 0px 1px $color-border-1;
                }
            }
        }
    }
}
</style>
