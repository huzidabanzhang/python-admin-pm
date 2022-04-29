export default {
    // 快捷键
    // 支持快捷键 例如 ctrl+shift+s
    hotkey: {
        search: {
            open: 's',
            close: 'esc'
        }
    },
    // 侧边栏默认折叠状态
    menu: {
        asideCollapse: false
    },
    // 整体风格大小
    size: {
        type: 'default'
    },
    // 在读取持久化数据失败时默认页面
    page: {
        opened: [
            {
                name: 'index',
                fullPath: '/index',
                meta: {
                    title: '首页',
                    auth: false
                }
            }
        ]
    },
    // 菜单搜索
    search: {
        enable: false
    },
    // 注册的主题
    theme: {
        list: [
            {
                title: '经典',
                name: 'admin',
                preview: 'image/theme/admin/preview@2x.png'
            }
        ]
    },
    // 是否默认开启页面切换动画
    transition: {
        active: true
    },
    hidden_menu: ['system', 'system_menu'],
    // 按钮接口标识
    lock_interface: ['lock_interface', 'del_interface', 'get_interface_list'],
    SYS_ADMIN: {
        name: 'Admin',
        mark: 'SYS_ADMIN'
    }
}
