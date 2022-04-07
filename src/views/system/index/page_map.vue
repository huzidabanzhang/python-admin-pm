<template>
    <admin-container class="page">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <div
                        slot="header"
                        class="header"
                    >
                        <span>
                            <img
                                v-if="info.avatar && info.avatar != ''"
                                :src="$store.state.admin.api.base + '/API/v1/Document/GetDocument' + info.avatar"
                                class="avatar"
                            >
                            <img
                                v-else
                                :src="circleUrl"
                                class="avatar"
                            >
                            {{user.username}} {{info.isAdmin ? '管理员' : '普通用户'}}信息
                        </span>
                    </div>
                    <el-form
                        :model="info"
                        label-width="120px"
                    >
                        </el-form-item>
                        <el-form-item label="角色">
                            {{info.role_name}}
                        </el-form-item>
                        <el-form-item label="最后登录时间">
                            {{info.time}}
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>

            <el-col :span="!isAdmin() ? 8 : 12">
                <el-card class="box-card">
                    <div
                        slot="header"
                        class="header"
                    >
                        <span>{{user.username}} 登录统计表</span>
                    </div>
                    <div>
                        <ve-histogram
                            :loading="userLogin.loading"
                            :data="userLogin.chartData"
                            :extend="userLogin.extend"
                        ></ve-histogram>
                    </div>
                </el-card>
            </el-col>

            <el-col
                :span="8"
                v-if="!isAdmin()"
            >
                <el-card class="box-card">
                    <div
                        slot="header"
                        class="header"
                    >
                        <span>所有用户登录次数表</span>
                    </div>
                    <div>
                        <ve-pie
                            :loading="userAll.loading"
                            :data="userAll.chartData"
                        ></ve-pie>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-card
            class="box-card"
            v-if="!isAdmin()"
        >
            <div
                slot="header"
                class="header"
            >
                <span>用户登录IP分布情况表</span>
            </div>
            <div
                id="userIp"
                style="height: 600px;"
            ></div>
        </el-card>
    </admin-container>
</template>

<script>
import echarts from 'echarts'
require('echarts/extension/bmap/bmap')
require('echarts/map/js/china')
import { GetLoginInfo, GetAllUserLoginCount, GetUserLoginIp } from '@api/sys.base'
import defaultImg from '@/assets/3ea6beec64369c2642b92c6726f1epng.png'
import setting from '@/setting.js'
export default {
    data () {
        return {
            userLogin: {
                extend: {
                    series: {
                        type: 'line',
                        label: { show: true, position: 'top' }
                    }
                },
                chartData: {},
                loading: false
            },
            userAll: {
                chartData: {},
                loading: false
            },
            userIp: {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        let ip = this.ip_list[params.name].ip
                        return ip.join('<br>')
                    }
                },
                bmap: {
                    center: [104.114129, 37.550339],
                    zoom: 5,
                    roam: false,
                    mapStyle: {
                        styleJson: [{
                            'featureType': 'water',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'land',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#f3f3f3'
                            }
                        }, {
                            'featureType': 'railway',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'highway',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#fdfdfd'
                            }
                        }, {
                            'featureType': 'highway',
                            'elementType': 'labels',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#fefefe'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#fefefe'
                            }
                        }, {
                            'featureType': 'poi',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'green',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'subway',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'manmade',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'local',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'labels',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'boundary',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#fefefe'
                            }
                        }, {
                            'featureType': 'building',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'label',
                            'elementType': 'labels.text.fill',
                            'stylers': {
                                'color': '#999999'
                            }
                        }]
                    }
                },
                series: [
                    {
                        name: 'Ip',
                        type: 'effectScatter',
                        coordinateSystem: 'bmap',
                        data: [],
                        symbolSize: function (val) {
                            return val[2] * 2
                        },
                        itemStyle: {
                            color: 'purple',
                            shadowBlur: 1,
                            shadowColor: '#333'
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true
                    }
                ]
            },
            ip_list: {},
            user: this.$store.getters['admin/user/user'],
            info: {},
            circleUrl: defaultImg,
            myChart: null,
            socket: null
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.userLogin.loading = true
            GetLoginInfo({})
                .then(async res => {
                    this.userLogin.chartData = {
                        rows: res.rows,
                        columns: res.columns
                    }
                    this.info = res.info
                    this.userLogin.loading = false
                })
                .catch(() => {
                    this.userLogin.loading = false
                })

            if (this.isAdmin()) return true

            this.userAll.loading = true
            GetAllUserLoginCount({})
                .then(async res => {
                    this.userAll.chartData = {
                        rows: res.data,
                        columns: res.user
                    }
                    this.userAll.loading = false
                })
                .catch(() => {
                    this.userAll.loading = false
                })

            GetUserLoginIp({})
                .then(async res => {
                    this.ip_list = res.ip
                    this.userIp.series[0].data = this.convertData(res.ip, res.city)
                    this.initMap()
                })
                .catch(() => {

                })
        },
        convertData (data, city) {
            let res = []
            for (let i in data) {
                let geoCoord = city[i]
                if (geoCoord) {
                    res.push({
                        name: i,
                        value: geoCoord.concat(data[i].count)
                    })
                }
            }
            return res
        },
        initMap () {
            this.myChart = echarts.init(document.getElementById("userIp"))
            this.myChart.setOption(this.userIp, true)
        },
        isAdmin () {
            if (this.user) return this.user.is_admin
            return false
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
<template>
    <admin-container class="page">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <div
                        slot="header"
                        class="header"
                    >
                        <span>
                            <img
                                v-if="info.avatar && info.avatar != ''"
                                :src="$store.state.admin.api.base + '/API/v1/Document/GetDocument' + info.avatar"
                                class="avatar"
                            >
                            <img
                                v-else
                                :src="circleUrl"
                                class="avatar"
                            >
                            {{user.username}} {{info.isAdmin ? '管理员' : '普通用户'}}信息
                        </span>
                    </div>
                    <el-form
                        :model="info"
                        label-width="120px"
                    >
                        </el-form-item>
                        <el-form-item label="角色">
                            {{info.role_name}}
                        </el-form-item>
                        <el-form-item label="最后登录时间">
                            {{info.time}}
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>

            <el-col :span="!isAdmin() ? 8 : 12">
                <el-card class="box-card">
                    <div
                        slot="header"
                        class="header"
                    >
                        <span>{{user.username}} 登录统计表</span>
                    </div>
                    <div>
                        <ve-histogram
                            :loading="userLogin.loading"
                            :data="userLogin.chartData"
                            :extend="userLogin.extend"
                        ></ve-histogram>
                    </div>
                </el-card>
            </el-col>

            <el-col
                :span="8"
                v-if="!isAdmin()"
            >
                <el-card class="box-card">
                    <div
                        slot="header"
                        class="header"
                    >
                        <span>所有用户登录次数表</span>
                    </div>
                    <div>
                        <ve-pie
                            :loading="userAll.loading"
                            :data="userAll.chartData"
                        ></ve-pie>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-card
            class="box-card"
            v-if="!isAdmin()"
        >
            <div
                slot="header"
                class="header"
            >
                <span>用户登录IP分布情况表</span>
            </div>
            <div
                id="userIp"
                style="height: 600px;"
            ></div>
        </el-card>
    </admin-container>
</template>

<script>
import echarts from 'echarts'
require('echarts/extension/bmap/bmap')
require('echarts/map/js/china')
import { GetLoginInfo, GetAllUserLoginCount, GetUserLoginIp } from '@api/sys.base'
import defaultImg from '@/assets/3ea6beec64369c2642b92c6726f1epng.png'
import setting from '@/setting.js'
export default {
    data () {
        return {
            userLogin: {
                extend: {
                    series: {
                        type: 'line',
                        label: { show: true, position: 'top' }
                    }
                },
                chartData: {},
                loading: false
            },
            userAll: {
                chartData: {},
                loading: false
            },
            userIp: {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        let ip = this.ip_list[params.name].ip
                        return ip.join('<br>')
                    }
                },
                bmap: {
                    center: [104.114129, 37.550339],
                    zoom: 5,
                    roam: false,
                    mapStyle: {
                        styleJson: [{
                            'featureType': 'water',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'land',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#f3f3f3'
                            }
                        }, {
                            'featureType': 'railway',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'highway',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#fdfdfd'
                            }
                        }, {
                            'featureType': 'highway',
                            'elementType': 'labels',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#fefefe'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#fefefe'
                            }
                        }, {
                            'featureType': 'poi',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'green',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'subway',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'manmade',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'local',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'arterial',
                            'elementType': 'labels',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }, {
                            'featureType': 'boundary',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#fefefe'
                            }
                        }, {
                            'featureType': 'building',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#d1d1d1'
                            }
                        }, {
                            'featureType': 'label',
                            'elementType': 'labels.text.fill',
                            'stylers': {
                                'color': '#999999'
                            }
                        }]
                    }
                },
                series: [
                    {
                        name: 'Ip',
                        type: 'effectScatter',
                        coordinateSystem: 'bmap',
                        data: [],
                        symbolSize: function (val) {
                            return val[2] * 2
                        },
                        itemStyle: {
                            color: 'purple',
                            shadowBlur: 1,
                            shadowColor: '#333'
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true
                    }
                ]
            },
            ip_list: {},
            user: this.$store.getters['admin/user/user'],
            info: {},
            circleUrl: defaultImg,
            myChart: null,
            socket: null
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.userLogin.loading = true
            GetLoginInfo({})
                .then(async res => {
                    this.userLogin.chartData = {
                        rows: res.rows,
                        columns: res.columns
                    }
                    this.info = res.info
                    this.userLogin.loading = false
                })
                .catch(() => {
                    this.userLogin.loading = false
                })

            if (this.isAdmin()) return true

            this.userAll.loading = true
            GetAllUserLoginCount({})
                .then(async res => {
                    this.userAll.chartData = {
                        rows: res.data,
                        columns: res.user
                    }
                    this.userAll.loading = false
                })
                .catch(() => {
                    this.userAll.loading = false
                })

            GetUserLoginIp({})
                .then(async res => {
                    this.ip_list = res.ip
                    this.userIp.series[0].data = this.convertData(res.ip, res.city)
                    this.initMap()
                })
                .catch(() => {

                })
        },
        convertData (data, city) {
            let res = []
            for (let i in data) {
                let geoCoord = city[i]
                if (geoCoord) {
                    res.push({
                        name: i,
                        value: geoCoord.concat(data[i].count)
                    })
                }
            }
            return res
        },
        initMap () {
            this.myChart = echarts.init(document.getElementById("userIp"))
            this.myChart.setOption(this.userIp, true)
        },
        isAdmin () {
            if (this.user) return this.user.is_admin
            return false
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
