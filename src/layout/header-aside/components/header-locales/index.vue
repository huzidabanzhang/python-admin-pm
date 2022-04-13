<template>
    <el-dropdown
        placement="bottom"
        size="small"
        @command="onChangeLocale"
    >
        <el-button
            class="admin-mr btn-text can-hover"
            type="text"
        >
            <admin-icon
                name="language"
                style="font-size: 16px;"
            />
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
                v-for="(language, index) in $languages"
                :key="index"
                :command="language.value"
            >
                <admin-icon
                    :name="$i18n.locale === language.value ? 'dot-circle-o' : 'circle-o'"
                    class="admin-mr-5"
                />
                {{ language.label }}
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
export default {
    methods: {
        onChangeLocale (command) {
            this.$i18n.locale = command
            let message = `当前语言：${this.$t('_name')} [ ${this.$i18n.locale} ]`
            if (!['TRAVIS', 'NETLIFY'].includes(process.env.VITE_APP_BUILD_MODE)) {
                message = [
                    `当前语言：${this.$t('_name')} [ ${this.$i18n.locale} ]`,
                    `仅提供切换功能，没有配置具体的语言数据 `,
                    `文档参考：<a class="el-link el-link--primary is-underline" target="_blank" href="https://doc.admin.fairyever.com/zh/sys-locales/">《国际化 | Admin》</a>`
                ].join('<br/>')
            }
            this.$notify({
                title: '语言变更',
                dangerouslyUseHTMLString: true,
                message
            })
        }
    }
}
</script>
