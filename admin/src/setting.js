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
    // 按钮接口标识
    lock_interface: ['lock_interface', 'del_interface'],
    mark: {
        menu: {
            add: 'add_menu',
            del: 'del_menu',
            set: 'set_menu',
            lock: 'lock_menu',
            list: 'get_menu_list',
            inter: 'get_menu_to_interface'
        },
        route: {
            add: 'add_router',
            list: 'get_router_list',
            set: 'set_router',
            lock: 'lock_router',
            del: 'del_router'
        },
        interface: {
            add: 'add_interface',
            list: 'get_interface_list',
            set: 'set_interface'
        },
        file: {
            add: 'add_document',
            list: 'get_document_list',
            down: 'down_document',
            del: 'del_document',
            retrieve: 'retrieve_document'
        },
        folder: {
            add: 'create_folder',
            del: 'del_folder',
            set: 'modify_folder',
            list: 'query_folder'
        },
        admin: {
            add: 'add_admin',
            list: 'get_admin_list',
            set: 'set_admin',
            lock: 'lock_admin',
            del: 'del_admin',
            init: 'init_admin'
        },
        role: {
            add: 'add_role',
            list: 'get_role_list',
            set: 'set_role',
            lock: 'lock_role',
            del: 'del_role'
        },
        log: {
            list: 'get_log_list'
        }
    }
    // 禁止删除的菜单项
    // 禁止禁用的菜单项
}
