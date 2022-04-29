<template>
    <admin-container class="page">
        <el-calendar ref="calendar" v-model="time">
            <template #dateCell="{ data }">
                <div>{{ data.day.split('-').slice(1).join('-') }}</div>
                <span v-for="(item, index) in info[data.day]" :key="index" class="calendar_span">
                    {{ item.name }}登录了{{ item.count }}次
                </span>
            </template>
        </el-calendar>
    </admin-container>
</template>

<script setup lang="ts">
import { GetLoginInfo } from '@api/sys.base'
import { computed, ref, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import type { CalendarInstance } from 'element-plus'
import useCurrentInstance from '@/proxy'

const { _this } = useCurrentInstance()
const store = useStore()
const user = computed(() => store.getters['user/user'])
const info = ref({})
const time = ref(new Date())
const calendar = ref<CalendarInstance>()

function init(time, calendarEl: CalendarInstance) {
    let loadingInstance = _this.$loading({
        lock: true,
        target: calendarEl.$el
    })

    GetLoginInfo({
        time: time,
        admin_id: user.value.admin_id
    })
        .then((res) => {
            info.value = res
            loadingInstance.close()
        })
        .catch(() => {
            loadingInstance.close()
        })
}

function getDate(time) {
    return time.getFullYear() + '-' + (time.getMonth() + 1)
}

onMounted(() => {
    init(getDate(time.value), calendar.value)

    nextTick(() => {
        // 点击前一个月
        let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)')

        let nextBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:last-child')

        let nowBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)')

        prevBtn.addEventListener('click', () => {
            init(getDate(time.value), calendar.value)
        })

        nextBtn.addEventListener('click', () => {
            init(getDate(time.value), calendar.value)
        })

        nowBtn.addEventListener('click', () => {
            init(getDate(time.value), calendar.value)
        })
    })
})
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.calendar_span {
    font-size: 12px;
    text-align: right;
    width: 100%;
    display: inline-block;
    color: #909399;
}
.el-calendar-table .el-calendar-day {
    overflow: auto;
}
.header {
    text-align: center;
    & > span {
        line-height: 30px;
        height: 30px;
    }

    img {
        display: inline;
        position: relative;
        top: 8px;
        margin-right: 5px;
    }
}
.el-form-item {
    margin-bottom: 10px;
    &:last-child {
        margin-bottom: 0;
    }
}
.page {
    .logo {
        width: 120px;
    }
    .btn-group {
        color: $color-text-placehoder;
        font-size: 12px;
        line-height: 12px;
        margin-top: 0px;
        margin-bottom: 20px;
        .btn-group__btn {
            color: $color-text-sub;
            &:hover {
                color: $color-text-main;
            }
            &.btn-group__btn--link {
                color: $color-primary;
            }
        }
    }
}
</style>
