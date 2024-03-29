/**
 * @description 短信验证码 缓存
 * @author Pony Wei
 */

const { cacheSet, cacheGet } = require('../index')

// cache key 前缀 !!!
const PREFIX = 'phoneVeriCode-'

/**
 * 从缓存获取验证码
 * @param {string} phoneNumber 手机号
 */
async function getVeriCodeFromCache(phoneNumber) {
    const key = `${PREFIX}${phoneNumber}`
    const code = await cacheGet(key)
    if (code == null) return code
    return code.toString() // cacheGet 方法中设置了 JSON.parse
}

/**
 * 缓存验证码
 * @param {string} phoneNumber 手机号
 * @param {string} veriCode 验证码
 * @param {number} timeout timeout 单位 s
 */
async function setVeriCodeToCache(phoneNumber, veriCode, timeout) {
    const key = `${PREFIX}${phoneNumber}`
    cacheSet(key, veriCode, timeout)
}

module.exports = {
    getVeriCodeFromCache,
    setVeriCodeToCache,
}
