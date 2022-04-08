import util from '@/libs/util.js'

export default {
    methods: {
        handleMenuSelect (index, indexPath) {
            if (/^admin-menu-empty-\d+$/.test(index) || index === undefined) {
                this.$message.warning('临时菜单')
            } else if (/^https:\/\/|http:\/\//.test(index)) {
                util.open(index)
            } else if (index == '/system/base') {
                this.$parent.handleVisible(true)
            } else {
                this.$router.push(index)
            }
        },
    },
}
