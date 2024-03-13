const router = require('koa-router')()
const { ENV } = require('../utils/env')
const packageInfo = require('../../package.json')
const testMysqlConn = require('../db/mysql2')
const { WorkContentModel } = require('../models/WorkContentModel')
const { cacheGet, cacheSet } = require('../cache/index')

// 测试数据库连接
router.get('/api/db-check', async ctx => {
    // 测试 mysql 连接
    const mysqlRes = await testMysqlConn()

    // 测试 mongodb 连接
    let mongodbConn
    try {
        mongodbConn = true
        await WorkContentModel.findOne()
    } catch (ex) {
        mongodbConn = false
    }

    // 测试 redis 连接
    cacheSet('name', 'editor sever OK - by redis')
    const redisTestVal = await cacheGet('name')

    ctx.body = {
        errno: 0,
        data: {
            name: 'editor sever',
            version: packageInfo.version,
            ENV,
            mysqlConn: mysqlRes.length > 0,
            mongodbConn,
            redisConn: redisTestVal != null,
        },
    }
})

module.exports = router
