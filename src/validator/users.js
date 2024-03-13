/**
 * @description 数据校验 users
 * @author Pony Wei
 */

/**
 * 可能有人看到这里会疑惑为什么下面的 Schema 会设置成这样的格式
 * 这是因为项目使用了 ajv 这个库来校验 JSON Schema
 * const Ajv = new ajv();
 * ajv(schema, data);
 *   - schema 为下面代码设置的 Schema，即校验模板
 *   - data 待校验的内容
 * 它要求，当需要校验的内容是一个对象时，传入的 Schema 有以下属性
 * type: 设置为 object 表示目标 JSON 文档是一个对象
 * properties: 设置这个对象的属性并分别指明其类型
 *   - 这意味着 properties 是一个对象（设置属性），其属性还是一个对象（设置属性的类型和属性）
 * required: 通过列表的形式限制 xx 为必填项
 * additionalProperties: 设置为 false 表示仅能包含已声明的属性, 不能有其他多余属性
 */

// 手机号规则
const phoneNumberRule = {
    type: 'string',
    pattern: '^1[34578]\\d{9}$', // 手机号正则表达式
}

// 手机号 schema
const phoneNumberSchema = {
    type: 'object',
    required: ['phoneNumber'],
    properties: {
        phoneNumber: phoneNumberRule,
        isRemoteTest: {
            type: 'boolean',
        },
    },
}

// 手机号 + 短信验证码 schema
const phoneNumberVeriCodeSchema = {
    type: 'object',
    required: ['phoneNumber', 'veriCode'],
    properties: {
        phoneNumber: phoneNumberRule,
        veriCode: {
            type: 'string',
            pattern: '^\\d{4}$', // 四位数字
        },
    },
}

// 用户信息 schema
const userInfoSchema = {
    type: 'object',
    // 用户信息要符合 UserModel 配置
    required: ['nickName', 'gender'],
    properties: {
        nickName: {
            type: 'string',
        },
        gender: {
            type: 'integer', // 整数
            minimum: 0,
            maximum: 2,
        },
        picture: {
            type: 'string',
        },
        city: {
            type: 'string',
        },
    },
}

module.exports = {
    phoneNumberSchema,
    phoneNumberVeriCodeSchema,
    userInfoSchema,
}
