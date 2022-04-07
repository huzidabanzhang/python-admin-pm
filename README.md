### <center>如果对您有帮助，请帮忙点右上角 "Star" 支持一下 谢谢！

## 升级 vue3 + vite + elementPlus 中

## 预览

[Preview](https://test.ig132n.cn/ "Preview")

测试账号：Test 密码：111111

Python 仓库地址 [章胖胖](https://github.com/huzidabanzhang/python-admin "章胖胖")

## 功能

-   管理员管理
-   菜单管理
-   角色管理
-   接口管理
-   文档管理
-   数据库管理
-   日志查看
-   基金查询（最近爱上基金 准备弄个基金查询的）

## 注意

tools/manage.py 为数据库版本控制的 py，具体的使用介绍你可以看： [章胖胖的笔记](https://huzidabanzhang.github.io/notes/2020-03-30.html#python-flask-migrate-%E8%BF%81%E7%A7%BB%E6%95%B0%E6%8D%AE%E5%BA%93 "章胖胖的笔记")

其中 conf 下有 aliyun.py 主要放密钥 需要的自己新建

加入 GeoLite2 的 IP 转换地址

## 启动

第一次启动前，先创建一个数据库，然后在目录 conf/setting.py 里面类中修改连接数据库信息

```shell
python start.py # 启动服务
```

前端页面打开第一次会提示是否初始化数据库，初始化后会提示弹出 Admin 的初始密码登录即可.

## 验证器

[验证器](https://github.com/huzidabanzhang/python-admin/blob/master/trunk/validate/__init__.py "验证器")

```python
# 路由中引用验证器
from validate import validate_form
from validate.v1.admin import params
validate = validate_form(params)

@route_admin.route('/Login', methods=['POST'], endpoint='Login') # endpoint这个一定要加不然报错
@validate.form('Login') # 需要验证的场景
```

```python
# 验证器路径/validate/v1
params = {
    # 引用验证字段场景
    'Test': ['admin_id[]', 'disable'],
    # 验证场景中需要修改字段里面的内容或增加字段内容

    # 用dict里面加入field这个很重要要判断是哪个字段dict会覆盖原来的判断条件
    'Test2': [{
        'field': 'code',
        'required': False
    }],
    # 验证字段
    'fields': {
        'code': {
            'name': u'验证码',
            'type': 'str', # 字段类型包括str, list, int, boolean, ic, phone, email, time
            'min': 4, # 字符长度最小值 其中list判断长度
            'max': 4, # 字符长度最大值 其中list判断长度
            'between': [888, 999], # 字符必须在list中
            'required': True, # 是否必填
            'default': 111  # 默认值
        },
        'email': {
            'name': u'邮件',
            'type': 'email'
        },
        'sex': {
            'name': u'性别',
            'type': 'int',
            'default': 1
        },
        'disable': {
            'name': u'可见性',
            'type': 'boolean',
            'required': True
        },
        'admin_id[]': {
            'name': u'管理员编号',
            'type': 'list',
            'required': True
        }
    }
}
```

## 计划

![首页](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/desktop.png "首页")

![菜单](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/menu.jpg "菜单")

![鉴权](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/role.jpg "鉴权")

![鉴权编辑](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/role_edit.jpg "鉴权编辑")

![接口](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/interface.jpg "接口")

![接口编辑](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/interface_edit.jpg "接口编辑")

![管理员](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/admin.jpg "管理员")

![日志](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/log.jpg "日志")

![markdown](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/markdown.jpg "markdown")

![上传](https://github.com/huzidabanzhang/python-admin/blob/master/static/image/markdown/upload.jpg "上传")

........

<a href="https://github.com/d2-projects/d2-admin" target="_blank"><img src="https://raw.githubusercontent.com/FairyEver/d2-admin/master/docs/image/d2-admin@2x.png" width="200"></a>
