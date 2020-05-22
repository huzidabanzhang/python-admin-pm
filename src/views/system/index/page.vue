<template>
    <chubby-container class="page">
        <el-calendar
            ref="calendar_info"
            v-model="value"
        >
            <template
                slot="dateCell"
                slot-scope="{date, data}"
            >
                <p>{{ data.day.split('-').slice(1).join('-') }}</p>
            </template>
        </el-calendar>
    </chubby-container>
</template>

<script>
import { GetLoginInfo } from '@api/sys.base'
import setting from '@/setting.js'
export default {
    data () {
        return {
            user: this.$store.getters['chubby/user/user'],
            info: {},
            users: {},
            value: new Date()
        }
    },
    mounted () {
        this.init(this.getDate(this.value))

        this.$nextTick(() => {
            // 点击前一个月
            let prevBtn = document.querySelector(
                '.el-calendar__button-group .el-button-group>button:nth-child(1)')

            let nextBtn = document.querySelector(
                '.el-calendar__button-group .el-button-group>button:last-child')

            let nowBtn = document.querySelector(
                '.el-calendar__button-group .el-button-group>button:nth-child(2)')

            prevBtn.addEventListener('click', () => {
                this.init(this.getDate(this.value))
            })

            nextBtn.addEventListener('click', () => {
                this.init(this.getDate(this.value))
            })

            nowBtn.addEventListener('click', () => {
                this.init(this.getDate(this.value))
            })
        })
    },
    methods: {
        init (time) {
            let loadingInstance = this.$loading({
                lock: true,
                target: this.$refs.calendar_info.$el
            })
            setTimeout(() => {
                loadingInstance.close()
            }, 1000)
            // GetLoginInfo({})
            //     .then(async res => {
            //         this.userLogin.chartData = {
            //             rows: res.rows,
            //             columns: res.columns
            //         }
            //         this.info = res.info
            //         this.userLogin.loading = false
            //     })
            //     .catch(() => {
            //         this.userLogin.loading = false
            //     })
        },
        getDate (time) {
            return time.getFullYear() + '-' + (time.getMonth() + 1)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
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
