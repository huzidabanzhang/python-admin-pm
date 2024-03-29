<template>
    <div class="page-login">
        <div class="page-login--layer page-login--layer-area">
            <ul class="circles">
                <li v-for="n in 10" :key="n"></li>
            </ul>
        </div>
        <div class="page-login--layer">
            <div class="page-login--content" flex="dir:top main:justify cross:stretch box:justify">
                <div class="page-login--content-header"></div>
                <div class="page-login--content-main" flex="dir:top main:center cross:center">
                    <!-- logo -->
                    <img class="page-login--logo" src="./image/logo.png" />
                    <!-- form -->
                    <div class="page-login--form">
                        <el-form ref="loginForm" label-position="top" size="large" :rules="rules" :model="formLogin">
                            <el-form-item prop="username">
                                <el-input
                                    type="text"
                                    placeholder="用户名"
                                    :prefix-icon="User"
                                    v-model="formLogin.username"
                                />
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input
                                    type="password"
                                    placeholder="密码"
                                    show-password
                                    :prefix-icon="Lock"
                                    v-model="formLogin.password"
                                />
                            </el-form-item>
                            <el-form-item prop="code">
                                <el-input
                                    type="text"
                                    placeholder="验证码"
                                    v-model="formLogin.code"
                                    @keyup.enter="handleSubmit(loginForm)"
                                >
                                    <template v-slot:append>
                                        <img class="login-code" :src="captcha" @click="refreshCaptcha" />
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-button
                                type="primary"
                                class="button-login"
                                :disabled="!isDis"
                                @click="handleSubmit(loginForm)"
                            >
                                登 录
                            </el-button>
                        </el-form>
                    </div>
                </div>
                <div class="page-login--content-footer">
                    <p class="page-login--content-footer-copyright">
                        <a> 构建于 {{ $buildTime }} </a>
                        <el-divider direction="vertical" />
                        <environment style="display: inline-block" />
                    </p>
                    <p class="page-login--content-footer-copyright">
                        Copyright@2019
                        <a href="https://beian.miit.gov.cn/" target="_blank">浙ICP备2021024276号</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useCurrentInstance from '@/proxy'
import environment from '@/layout/pages/environment/index.vue'
import util from '@/libs/util'
import { computed, ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { Lock, User } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const { proxy, _this } = useCurrentInstance()
const store = useStore()

const rules = reactive<FormRules>({
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
        },
        {
            min: 4,
            max: 20,
            message: '长度在 4 到 20 个字之间',
            trigger: 'blur'
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        },
        {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字之间',
            trigger: 'blur'
        }
    ],
    code: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
        }
    ]
})
const loginForm = ref<FormInstance>()
const formLogin = reactive({
    username: '',
    password: '',
    code: ''
})
const captcha = ref('')
const captchaUrl = ref('')
const base = computed(() => store.getters['api/base'])
const isInit = computed(() => store.getters['user/isInit'])
const isDis = ref(false)

watch(
    () => base,
    (value) => {
        captchaUrl.value = value.value + '/API/v1/Admin/Captcha'
        refreshCaptcha()
    },
    {
        immediate: true,
        deep: true
    }
)

watch(
    () => isInit,
    (value) => {
        isDis.value = value.value
        util.isInitialized()
    },
    {
        immediate: true,
        deep: true
    }
)

function refreshCaptcha() {
    captcha.value = captchaUrl.value + '?rand=' + Math.random()
}

function handleSubmit(formEl: FormInstance) {
    formEl.validate((valid) => {
        if (valid) {
            let loadingInstance = _this.$loading(_this.loadOption('正在登陆中.....'))

            store
                .dispatch('account/login', formLogin)
                .then(() => {
                    loadingInstance.close()
                    // 重定向对象不存在则返回顶层路径
                    proxy.$router.replace((proxy.$route.query.redirect as string) || '/')
                })
                .catch(() => {
                    loadingInstance.close()
                    refreshCaptcha()
                })
        } else {
            // 登录表单校验失败
            _this.$message.error('用户名、密码或者验证码不能为空')
        }
    })
}
</script>

<style lang="scss">
.page-login {
    @extend %unable-select;
    $backgroundColor: #f0f2f5; /*// ---*/
    background-color: $backgroundColor;
    height: 100%;
    position: relative; /*// 层*/
    .page-login--layer {
        @extend %full;
        overflow: auto;
    }
    .page-login--layer-area {
        overflow: hidden;
    }
    // 时间
    .page-login--layer-time {
        font-size: 24em;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.03);
        overflow: hidden;
    }
    // 登陆页面控件的容器
    .page-login--content {
        height: 100%;
        min-height: 500px;
    }
    // header
    .page-login--content-header {
        padding: 1em 0;
        .page-login--content-header-motto {
            margin: 0px;
            padding: 0px;
            color: $color-text-normal;
            text-align: center;
            font-size: 12px;
        }
    }
    // main
    .page-login--logo {
        width: 64px;
        margin-bottom: 1em;
        margin-top: -1em;
    }
    // 登录表单
    .page-login--form {
        width: 280px;
        // 卡片
        .el-card {
            margin-bottom: 15px;
        }
        // 登录按钮
        .button-login {
            width: 100%;
        }
        // 输入框左边的图表区域缩窄
        .el-input-group__prepend {
            padding: 0px 14px;
        }
        .el-input--large {
            .el-input__prefix {
                left: 12px;
            }
        }
        .login-code {
            height: 40px - 2px;
            display: block;
            margin: 0px -20px;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
        }
        // 登陆选项
        .page-login--options {
            margin: 0px;
            padding: 0px;
            font-size: 14px;
            color: $color-primary;
            margin-bottom: 15px;
            font-weight: bold;
        }
        .page-login--quick {
            width: 100%;
        }
    }
    // footer
    .page-login--content-footer {
        padding: 1em 0;
        .page-login--content-footer-locales {
            padding: 0px;
            margin: 0px;
            margin-bottom: 15px;
            font-size: 12px;
            line-height: 12px;
            text-align: center;
            color: $color-text-normal;
            a {
                color: $color-text-normal;
                margin: 0 0.5em;
                &:hover {
                    color: $color-text-main;
                }
            }
        }
        .page-login--content-footer-copyright {
            padding: 0px;
            margin: 0px;
            margin-bottom: 10px;
            font-size: 12px;
            line-height: 12px;
            text-align: center;
            color: $color-text-normal;
            a {
                color: $color-text-normal;
            }
        }
        .page-login--content-footer-options {
            padding: 0px;
            margin: 0px;
            font-size: 12px;
            line-height: 12px;
            text-align: center;
            a {
                color: $color-text-normal;
                margin: 0 1em;
            }
        }
    }
    // 背景
    .circles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0px;
        padding: 0px;
        li {
            position: absolute;
            display: block;
            list-style: none;
            width: 20px;
            height: 20px;
            background: #fff;
            animation: animate 25s linear infinite;
            bottom: -200px;
            @keyframes animate {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                    border-radius: 0;
                }
                100% {
                    transform: translateY(-1000px) rotate(720deg);
                    opacity: 0;
                    border-radius: 50%;
                }
            }
            &:nth-child(1) {
                left: 15%;
                width: 80px;
                height: 80px;
                animation-delay: 0s;
            }
            &:nth-child(2) {
                left: 5%;
                width: 20px;
                height: 20px;
                animation-delay: 2s;
                animation-duration: 12s;
            }
            &:nth-child(3) {
                left: 70%;
                width: 20px;
                height: 20px;
                animation-delay: 4s;
            }
            &:nth-child(4) {
                left: 40%;
                width: 60px;
                height: 60px;
                animation-delay: 0s;
                animation-duration: 18s;
            }
            &:nth-child(5) {
                left: 65%;
                width: 20px;
                height: 20px;
                animation-delay: 0s;
            }
            &:nth-child(6) {
                left: 75%;
                width: 150px;
                height: 150px;
                animation-delay: 3s;
            }
            &:nth-child(7) {
                left: 35%;
                width: 200px;
                height: 200px;
                animation-delay: 7s;
            }
            &:nth-child(8) {
                left: 50%;
                width: 25px;
                height: 25px;
                animation-delay: 15s;
                animation-duration: 45s;
            }
            &:nth-child(9) {
                left: 20%;
                width: 15px;
                height: 15px;
                animation-delay: 2s;
                animation-duration: 35s;
            }
            &:nth-child(10) {
                left: 85%;
                width: 150px;
                height: 150px;
                animation-delay: 0s;
                animation-duration: 11s;
            }
        }
    }
}
</style>
