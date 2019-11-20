<template>
    <div class="page">
        <img :src="imgSrc" class="imgException" />
        <div class="description">
            <h3 v-text="title"></h3>
            <p v-html="description"></p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BasicNotFound',
    data() {
        return {
            imgSrc: 'https://img.alicdn.com/tfs/TB1Gy4Yjv6H8KJjy0FjXXaXepXa-780-780.png',
            title: '抱歉，您没有权限访问',
            description: '抱歉您暂无权限，请看看其他页面'
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    background: white;
    background-blend-mode: multiply, multiply;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .description {
        display: contents;
    }
    img {
        width: 260px;
    }
}
</style>
