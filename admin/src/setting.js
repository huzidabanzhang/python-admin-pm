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
                title: 'd2admin 经典',
                name: 'd2',
                preview: 'image/theme/d2/preview@2x.png'
            },
            {
                title: '简约线条',
                name: 'line',
                backgroundImage: 'image/theme/line/bg.jpg',
                preview: 'image/theme/line/preview@2x.png'
            },
            {
                title: '流星',
                name: 'star',
                backgroundImage: 'image/theme/star/bg.jpg',
                preview: 'image/theme/star/preview@2x.png'
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
    },
    mark: {
        menu: {
            add: 'add_menu',
            del: 'del_menu',
            set: 'set_menu',
            lock: 'lock_menu',
            inter: 'get_menu_to_interface'
        },
        route: {
            add: 'add_router',
            set: 'set_router',
            lock: 'lock_router',
            del: 'del_router',
            all_del: 'del_router',
            all_lock: 'lock_router'
        },
        interface: {
            add: 'add_interface',
            set: 'set_interface',
            lock: 'lock_interface',
            del: 'del_interface',
            all_del: 'del_interface',
            all_lock: 'lock_interface'
        },
        file: {
            add: 'add_document',
            down: 'down_document',
            del: 'del_document',
            retrieve: 'retrieve_document'
        },
        folder: {
            add: 'create_folder',
            del: 'del_folder',
            set: 'modify_folder'
        },
        admin: {
            add: 'add_admin',
            set: 'set_admin',
            lock: 'lock_admin',
            del: 'del_admin',
            init: 'init_admin',
            all_del: 'del_admin',
            all_lock: 'lock_admin'
        },
        role: {
            add: 'add_role',
            set: 'set_role',
            lock: 'lock_role',
            del: 'del_role'
        },
        base: {
            export: 'export_sql',
            import: 'import_sql'
        }
    }
    // 禁止删除的菜单项
    // 禁止禁用的菜单项
}
