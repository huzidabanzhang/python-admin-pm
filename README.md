## 演示

https://test.ig132n.cn/

测试账号：Test 密码：111111

[服务器端](https://github.com/huzidabanzhang/python-admin "服务器端")

![首页](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/desktop.png "首页")

![菜单](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/menu.png "菜单")

![权限](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/role.png "权限")

## 权限判断

[权限判断](https://github.com/huzidabanzhang/python-admin-pm/tree/master/src/plugin/premission/index.js "权限判断")

```javascript
Vue.directive("auth", function(el, binding, node) {
    let user = store.getters["chubby/user/user"],
        mark = binding.arg,
        role = store.getters["chubby/user/interfaces"],
        t = mark.split("_")[0]

    if (!user) return true

    if (user.is_admin == true) return true

    if (role) {
        let item = role.filter((i) => {
            return i.mark == mark
        })

        node.context.auth[t] = item.length == 0 ? true : Boolean(item[0].disable)
    } else node.context.auth[t] = true
})

// 注册权限判断事件
Vue.prototype.$isDisabled = (mark) => {
    let user = store.getters["chubby/user/user"],
        role = store.getters["chubby/user/interfaces"]

    if (!user) return true

    if (user.is_admin) return false

    if (role) {
        let item = role.filter((i) => {
            return i.mark == mark
        })

        return item.length == 0 ? true : Boolean(item[0].disable)
    } else return true
}
```

## 计划

-   按钮权限 （已完成）
-   文档模块功能 (已完成）
-   部署到服务器上 （已完成）
-   优化 vuex 状态管理 （已完成）
-   优化权限.角色和菜单的 UI (已完成)
-   表单设计器 （马上开始）

<a href="https://github.com/d2-projects/d2-admin" target="_blank"><img src="https://raw.githubusercontent.com/FairyEver/d2-admin/master/docs/image/d2-admin@2x.png" width="200"></a>
