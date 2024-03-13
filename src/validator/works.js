/**
 * @description 数据校验 作品
 * @author Pony Wei
 */

// 普通字符串的规则
const strRule = {
    type: 'string',
    maxLength: 255,
}
// 数字规则
const numRule = {
    type: 'number',
}
// 布尔值规则
const boolRule = {
    type: 'boolean',
}

// 创建作品 Schema
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

module.exports = {
    workInfoSchema,
}
