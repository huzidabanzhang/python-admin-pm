<template>
    <admin-container class="page">
    </admin-container>
</template>

<script>
export default {
    data () {
        return {
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
