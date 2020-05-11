<template>
    <div class="page">
        <img
            :src="imgSrc"
            class="imgException"
        />
        <div class="description">
            <h3 v-text="title"></h3>
            <p v-html="description"></p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BasicNotFound',
    data () {
        return {
            imgSrc: 'https://img.alicdn.com/tfs/TB1txw7bNrI8KJjy0FpXXb5hVXa-260-260.png',
            title: '抱歉，你访问的页面不存在',
            description: '您要找的页面没有找到，请看看其他页面'
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
