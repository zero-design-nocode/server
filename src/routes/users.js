/**
 * @description users router
 * @author Pony Wei
 */

const router = require('koa-router')()
const { SuccessRes } = require('../res-model/index')

// 中间件
const loginCheck = require('../middlewares/loginCheck')
const genValidator = require('../middlewares/genValidator')
const {
    phoneNumberSchema,
    phoneNumberVeriCodeSchema,
    userInfoSchema,
} = require('../validator/users')

// controller
// 发送短信验证码
const sendVeriCode = require('../controller/users/sendVeriCode')
// 通过手机号码登录
const loginByPhoneNumber = require('../controller/users/loginByPhoneNumber')
// 更新用户信息
const updateUserInfo = require('../controller/users/updateUserInfo')

// 路由前缀
router.prefix('/api/users')

// 生成短信验证码
router.post('/genVeriCode', genValidator(phoneNumberSchema), async ctx => {
    const { phoneNumber, isRemoteTest } = ctx.request.body

    // 尝试发送验证码
    const res = await sendVeriCode(phoneNumber, isRemoteTest)

    ctx.body = res
})

// 使用手机号登录
router.post('/loginByPhoneNumber', genValidator(phoneNumberVeriCodeSchema), async ctx => {
    const { phoneNumber, veriCode } = ctx.request.body
    const res = await loginByPhoneNumber(phoneNumber, veriCode)
    ctx.body = res
})

// 获取用户信息
router.get('/getUserInfo', loginCheck, async ctx => {
    // 经过了 loginCheck ，用户信息在 ctx.userInfo 中
    ctx.body = new SuccessRes(ctx.userInfo)
})

// 修改用户信息
router.patch('/updateUserInfo', loginCheck, genValidator(userInfoSchema), async ctx => {
    // 经过了 loginCheck ，用户信息在 ctx.userInfo 中
    const res = await updateUserInfo(ctx.userInfo, ctx.request.body)
    ctx.body = res
})

module.exports = router
