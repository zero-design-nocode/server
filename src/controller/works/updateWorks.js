/**
 * @description 修改作品
 * @author Pony Wei
 */

const _ = require('lodash')
const { updateWorkService } = require('../../service/works')
const { findOneUserService } = require('../../service/users')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const {
    updateWorkFailInfo,
    updateWorkDbErrorFailInfo,
    transferWorkFailInfo,
} = require('../../res-model/failInfo/index')

/**
 * 修改作品
 * @param {string} id id
 * @param {string} author 作者 username （安全性，不允许修改他人作品）
 * @param {object} data 作品数据
 */
async function updateWorks(id, author, data = {}) {
    // 保证数据不为空
    if (!id || !author) return new ErrorRes(updateWorkFailInfo, 'id 或 author 不能为空')
    if (_.isEmpty(data)) return new ErrorRes(updateWorkFailInfo, '更新数据不能为空')

    let res
    try {
        res = await updateWorkService(data, { id, author })
    } catch (ex) {
        console.error('更新作品错误', id, ex)
        // TODO 报警：`更新作品 ${id} 错误`
        return new ErrorRes(updateWorkDbErrorFailInfo) // 数据库错误
    }

    // 更新成功
    if (res) return new SuccessRes()
    // 更新失败
    return new ErrorRes(updateWorkFailInfo, 'id 或 author 不匹配')
}

/**
 * 转赠作品
 * @param {string} id id
 * @param {string} author 作者 username
 * @param {string} receiverUsername 接收人 username
 */
async function transferWorks(id, author, receiverUsername) {
    // 作者和接收人相同
    if (author === receiverUsername) return new ErrorRes(transferWorkFailInfo, '作者和接收人相同')

    // 判断接收者是否存在
    const receiver = await findOneUserService({ username: receiverUsername })
    if (receiver == null) return new ErrorRes(transferWorkFailInfo, '未找到接收人')

    const res = await updateWorks(id, author, {
        author: receiverUsername,
    })
    return res
}

module.exports = {
    updateWorks,
    transferWorks,
}
