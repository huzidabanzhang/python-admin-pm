<template>
    <d2-container class="page">
    </d2-container>
</template>

<script>
import { QueryLogByParam } from '@api/sys.log'
export default {
    data() {
        return {
            LogData: []
        }
    },

    methods: {
        init() {
            // QueryLogByParam().then(async res => {

            // })
        }
    }
}
</script>

<style lang="scss" scoped>
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
