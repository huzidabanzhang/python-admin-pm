import util from '@/libs/util'

export default {
    inject: ['handleVisible'],
    methods: {
        handleMenuSelect(index, indexPath) {
            if (/^admin-menu-empty-\d+$/.test(index) || index === undefined) {
                this.$message.warning('临时菜单')
            } else if (/^https:\/\/|http:\/\//.test(index)) {
                util.open(index)
            } else if (index === '/system/base') {
                this.handleVisible(true)
            } else {
                this.$router.push(index)
            }
        },
    },
}
