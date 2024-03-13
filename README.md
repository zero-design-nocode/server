## 1. 技术选型

-   Node.js 框架选型：Koa 2
-   接口风格：RESTful API

-   数据库

    -   MySQL（mysql2 + sequelize）
    -   MongoDB（mongoose）
    -   Redis

-   登录校验：JWT
-   接口测试：Jest
-   线上服务：PM2 + Nginx

### 1.1 为什么是 Koa 2

Node.js 主流框架有 4 个：

-   轻量级
    -   Express
    -   Koa 2
-   重量级
    -   Egg.js
    -   Nest.js

低代码项目重前端，后端没有那么复杂，感觉没必要使用企业级框架，加上 Koa 2 的开发体验更好，所以就使用了 Koa 2 框架。当然，论生态肯定还是 Express 更胜一筹，但 Koa 2 也不差。

### 1.2 为什么是 RESTful API

主流的两种接口设计风格是：

-   RESTful API
-   GraphQL

GraphQL 的主要应用场景是：

-   数据关系比较复杂
-   前端查询需求多变，如果用 RESTful API 会导致频繁的修改 API，不灵活
-   有一个独立的数据提供方，对接很多使用方，不能一一定制开发

选择使用 RESTful API 的原因：

-   场景和 GraphQL 不太匹配，这个项目的特点是作品的数据结构复杂（前端编辑器复杂），而数据实体之间的关系比较清晰。
-   GraphQL 的缺点：
    -   学习使用成本高，不如 RESTful API 普及
    -   当数据结构复杂时，效率较低
    -   维护数据源和 schema 也比较复杂
-   最重要的是，不会 GraphQL，也不了解 GraphQL，更没接触过 GraphQL 的项目，也就没有学习它的动力

### 1.3 为什么是这些数据库

-   有用户、作品管理的需求，这种具有强烈表格属性色彩的数据，很适合关系型数据库，MySQL 几乎已经成为了（免费、开源）关系型数据库的事实标准

-   有缓存的地方就有 Redis，这也是一个事实标准

-   MongoDB 对 JSON 数据无与伦比的支持度，简直就是为 JSON Schema 而生，管理组件详细数据易如反掌

    原来也使用 MySQL + Redis 的方案做过低代码项目，后期数据量起来后根本没法维护，感觉 MySQL 的 JSON 数据的支持能力还是太弱了

### 1.4 为什么是 JWT

选择 JWT 的主要原因是对于一个个人项目而言，简单方便。当然在企业级项目中，应该根据业务需求来选择。

步骤：

-   前端输入用户名密码，传给后端
-   后端验证成功，返回一段 token 字符串（将用户信息加密之后得到）
-   前端获取 token 之后，存储下来
-   以后访问接口，都在 header 中带上这段 token

优点：

-   不占用服务器内存
-   多进程、多服务器，不受影响
-   不受跨域限制

缺点：

-   无法快速封禁登录的用户

与 session 的重要区别：

-   JWT 用户信息存储在客户端
-   Session 用户信息存储在服务端

### 1.4 为什么是 Jest

做单元测试和接口测试的工具库也有很多，但现在感觉 Jest 也渐渐成为标准了，毕竟简单简单好用，还有大厂背景，没有理由不选它。

### 1.5 为什么是 PM2

现在线上部署后端的方式也不少，如：

-   PM2 + Nginx
-   supervisor + Nginx
-   Docker + Nginx（可能更主流）
-   宝塔部署（按理说图形界面更好用，但个人一直觉得它不好用，也不方便）
-   ......

不管用啥，线上代理（Nginx 或 Apache 等）总是少不了的。

而且感觉大差不差，Crtl + C / Ctrl + V，会改就行。

## 2. 整体架构图

![img](https://typora.wei-jia.top/typora/%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84%E5%9B%BE.png)

## 3. 接口设计

### 3.1 功能范围

-   B 端：用户注册、作品管理、模版
-   编辑器：单个作品的内容获取、修改、预览和发布

### 3.2 功能拆分

-   用户信息
-   作品管理
-   模板
-   编辑器（发布和渠道，可以单独设计）
-   工具类
-   其他

#### 3.2.1 用户信息

-   获取手机短信验证码
-   登录（含注册）
-   获取用户信息
-   修改用户信息

#### 3.2.2 作品管理

-   创建空白作品

-   复制作品（通过模板创建）

    **模板即作品，只是有一个标志而已**，数据库设计时可以看出来

-   删除作品

-   恢复作品

-   转赠作品

-   我的作品列表（搜索，分页）

-   我的回收站列表（搜索，分页）

#### 3.2.3 模板

-   首页推荐模板列表（搜索，分页）—— 不需要登录校验
-   获取单个模板信息 —— 不需要登录校验
-   我的模板列表（搜索，分页）

#### 3.2.4 编辑器

设计时分开，但代码可能和作品管理一起写，因为都是和作品相关

-   查询单个作品信息
-   保存作品
-   预览作品
-   发布作品
-   发布为模板

#### 3.2.5 渠道

-   创建渠道
-   删除渠道
-   修改渠道名称
-   获取单个作品的所有渠道

#### 3.2.6 工具类

-   上传图片

#### 3.2.7 其他

-   作品统计，会用到单独的统计服务，不在这里出数据（H5 端收集，B 端统计）
-   预览作品（是 H5 端的能力，不需要 B 端数据的支持）

#### 3.2.8 统一输出格式

```json
{
  error: 0, // 错误码，无错误为 0
  data: { ... }, // 或者为 [...]
  message: 'xxx'
}
```

## 4. 数据库设计

### 4.1 数据之间的关系

如下面两张图：

![img](https://typora.wei-jia.top/typora/image.png)

<img src="https://typora.wei-jia.top/typora/image-20240313170751809.png" alt="img" style="zoom: 67%;" />

### 4.2 数据库设计

使用 sequelize 和 mongoose 会自动创建 id、createAt 和 updateAt，无需再自己手动创建。

#### 4.2.1 用户

|      列       |  类型   |                注释                |
| :-----------: | :-----: | :--------------------------------: |
|   username    | varchar | 用户名，**唯一**（暂定就是手机号） |
|   password    | varchar |     密码，保留字段，暂时用不到     |
|  phoneNumber  | varchar |               手机号               |
|   nickname    | varchar |                昵称                |
|    gender     |   int   |   性别（1 男性，2 女性，3 保密）   |
|    picture    | varchar |              用户头像              |
| latestLoginAt |  date   |            最后登录时间            |
|   isFrozen    | boolean |            用户是否冻结            |

#### 4.2.2 作品 / 模板

|        列        |  类型   |                     注释                     |
| :--------------: | :-----: | :------------------------------------------: |
|       uuid       | varchar | uuid, h5 url 中使用，隐藏真正的 id，防止爬虫 |
|      title       | varchar |                     标题                     |
|       desc       | varchar |                    副标题                    |
|    contentId     | varchar |       未发布内容 id，存储在 MongoDB 中       |
| publishContentId | varchar | 发布内容 id，存储在 MongoDB 中，未发布时为空 |
|      author      | varchar |         作者 username，和用户表关联          |
|     coverImg     | varchar |                 封面图片 URL                 |
|    isTemplate    | boolean |                  是否为模板                  |
|      status      |   int   | 状态（0 删除，1 未发布，2 发布，3 强制下线） |
|   copiedCount    |   int   |               模板被使用的次数               |
| latestPublishAt  |  date   |              最近一次发布的时间              |
|      isHot       | boolean |              hot 标签，模板使用              |
|      isNew       | boolean |              new 标签，模板使用              |
|    orderIndex    |   int   |                   排序参数                   |
|     isPublic     | boolean |               模板是否公开显示               |

#### 4.2.3 渠道

|   列   |  类型   |          注释          |
| :----: | :-----: | :--------------------: |
|  name  | varchar |        渠道名称        |
| workId |   int   |        作品 id         |
| status |   int   | 状态（0 删除，1 正常） |

#### 4.2.4 作品内容

-   未发布
-   发布

```JavaScript
{
  // 页面的组件列表
  components: [Object],
  // 页面的属性，如页面背景图片
  props: Obejct,
  // 配置信息，如微信分享配置
  setting: Object,
}
```

## 5. 接口实现流程

这里需要说明的是，只要是代码，任何地方都有可能出现错误，如果实现流程要做到面面俱到，对任何可能的错误都进行叙述，那将会非常冗杂，没完没了。因此下面对于实现流程的描述，仅考虑成功和可预见的错误，对不可预见和代码中未做处理的错误都会忽略。而且，我们知道，任何不可预见或未处理的错误都至少会有一个默认错误处理器来兜底，再不济也会返回一个 `500` 嘛。

### 5.1 注册登录

目前仅支持手机短信验证码登录，因为数据库中已经预留了「密码」字段，不排除后期增加密码登录的方式，毕竟密码登录不要钱。

#### 5.1.1 短信验证

1.  初次获取验证码
    -   request - 输入手机号，请求短信验证码
    -   server - 生成 4 位随机数，缓存 2min
    -   res
        -   发短信验证码
        -   返回给前端 `{ errno: 0 }` 并缓存
2.  再次获取验证码
    -   request - 输入手机号，请求短信验证码
    -   server - 检查缓存，无则生成，并再次缓存
    -   res
        -   有缓存，则返回错误：不能频繁获取
        -   没有缓存，发送短信验证码，返回给前端 `{ errno: 0 }` 并缓存

> 实际写代码时，没必要区分是否是第一次请求，所以统一设计为「再次获取验证码」，每次都去查缓存。

#### 5.1.2 考虑问题

费用：

-   缓存一定要有，禁止频繁获取验证码，增加成本，也在一定程度上防止恶搞、攻击
-   短信服务的提示和报警

用户体验：

-   短信发送失败，不会缓存，可以立马重新生成验证码

稳定性：

-   如果 服务器缓存失败，那就允许用户重新调用（少见）
-   短信服务挂掉会报警

#### 5.1.3 获取短信验证码

![](<https://typora.wei-jia.top/typora/%E5%90%8E%E7%AB%AF%E6%8E%A5%E5%8F%A3%E6%B5%81%E7%A8%8B%20(1).png>)

#### 5.1.4 手机号登录

![](https://typora.wei-jia.top/typora/%E5%90%8E%E7%AB%AF%E6%8E%A5%E5%8F%A3%E6%B5%81%E7%A8%8B.png)

### 5.2 作品接口

#### 5.2.1 创建作品

创建作品时需要经过一个作品 Schema 的校验中间件，其校验的 Schema 格式应该符合：

```js
const workInfoSchema = {
    type: 'object',
    // 作品信息要符合 WorksModel 配置
    required: ['title'], // 标题是必须的
    properties: {
        title: strRule, // 标题为字符串
        desc: strRule, // 副标题为字符串
        coverImg: strRule, // 封面图片 url 为字符串
        contentId: strRule, // 内容 ID 为字符串，存在 MongoDB 中

        // 作品内容 —— 这个并不在 WorksModel 中！！！
        // 因为作品的内容由 MongoDB 数据库接管
        content: {
            type: 'object',
            // 符合 WorkContentModel 属性规则
            properties: {
                _id: strRule,
                components: {
                    type: 'array',
                },
                props: {
                    type: 'object',
                },
                setting: {
                    type: 'object',
                },
            },
        },
    },
}
```

![](<https://typora.wei-jia.top/typora/%E5%90%8E%E7%AB%AF%E6%8E%A5%E5%8F%A3%E6%B5%81%E7%A8%8B%20(2).png>)

#### 5.2.2 查询单个作品（非模板）

![](<https://typora.wei-jia.top/typora/%E5%90%8E%E7%AB%AF%E6%8E%A5%E5%8F%A3%E6%B5%81%E7%A8%8B%20(3).png>)

#### 5.2.3 修改作品信息

![](<https://typora.wei-jia.top/typora/%E5%90%8E%E7%AB%AF%E6%8E%A5%E5%8F%A3%E6%B5%81%E7%A8%8B%20(4).png>)

#### 5.2.4 复制作品

![](https://typora.wei-jia.top/typora/%E5%90%8E%E7%AB%AF%E6%8E%A5%E5%8F%A3%E6%B5%81%E7%A8%8B1.png)

#### 5.2.5 删除作品

#### 5.2.6 恢复删除

#### 5.2.7 转赠作品

#### 5.2.8 获取自己的作品或模板

#### 5.2.9 发布作品

#### 5.2.10 发布为模板
