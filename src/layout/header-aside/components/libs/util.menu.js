import { ElMenuItem, ElSubMenu } from 'element-plus'
// 创建 el-menu-item
export function elMenuItem (h, menu) {
    if (menu.disable) return true
    return h(ElMenuItem, { index: menu.path }, {
        default: (props) => {
            return [
                ...(menu.icon
                    ? [h('i', { class: `fa fa-${menu.icon}` })]
                    : []),
                ...((menu.icon === undefined) & !menu.iconSvg
                    ? [h('i', { class: 'fa fa-file-o' })]
                    : []),
                ...(menu.iconSvg
                    ? [h('admin-icon-svg', { name: menu.iconSvg })]
                    : []),
                h('span', {}, menu.title || '未命名菜单')
            ]
        }
    })
}

// 创建 el-submenu
export function elSubmenu (h, menu) {
    if (menu.disable) return true
    return h(ElSubMenu, { index: menu.path }, {
        title: () => {
            return [
                ...(menu.icon
                    ? [h('i', { class: `fa fa-${menu.icon}` })]
                    : []),
                ...((menu.icon === undefined) & !menu.iconSvg
                    ? [h('i', { class: 'fa fa-folder-o' })]
                    : []),
                ...(menu.iconSvg
                    ? [h('admin-icon-svg', { name: menu.iconSvg })]
                    : []),
                h('span', {}, menu.title || '未命名菜单')
            ]
        },
        default: () => {
            return [...menu.children.map((child, childIndex) =>
                (child.children === undefined ? elMenuItem : elSubmenu).call(
                    this,
                    h,
                    child
                )
            )]
        }
    })
}
