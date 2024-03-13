/**
 * @description 第三方服务 test
 * @author Pony Wei
 */

const path = require('path')
const { sendVeriCodeMsg } = require('../src/vendor/sendMsg')
const uploadOSS = require('../src/vendor/uploadOSS')
const { textCensor, imgCensor } = require('../src/vendor/contentSensor')

describe('第三方 API', () => {
    // test('发短信验证码', async () => {
    //     const phoneNumber = `15071060792` // 注意，要把这个手机号加入到频率限制白名单里，否则 1h 之内发送的短信数量会被限制
    //     const res = await sendVeriCodeMsg(phoneNumber, '0000', '2')
    //     const { SendStatusSet = [] } = res
    //     const SendStatus = SendStatusSet[0] || {}
    //     expect(SendStatus.Code).toBe('Ok')
    // })

    test('上传文件到阿里云 OSS', async () => {
        const fileName = 'a.jpeg'
        const filePath = path.resolve(__dirname, 'files', 'a.jpeg')

        const url = await uploadOSS(fileName, filePath)
        expect(url).not.toBeNull()
        expect(url.lastIndexOf(fileName)).toBeGreaterThan(0)
    })

    // 文本审核，暂时关掉
    test(
        '内容审查',
        async () => {
            // 文本审核 - 正常文字
            // const text1 = 'hello world'
            // const textRes1 = await textCensor(text1)
            // expect(textRes1).toBeNull()

            // 文本审核 - 敏感文字
            const text2 =
                '猜十二生肖?(奔逸绝尘打一个生肖)(一句真言:奔逸绝尘)猜什么动物?<p><p>###040+#加·威·∨·信：【 W855～329 】 为您解--答'
            const textRes2 = await textCensor(text2)
            expect(textRes2).toBeNull()

            // 文本审核 - 敏感文字，不演示

            // 图片审核 - 正常图片
            // const img1 =
            //     'https://qiniu.wei-jia.top/GopherBlog/20240110225642__%E7%94%BB%E6%B1%9F%E6%B9%961.jpg'
            // const imgRes1 = await imgCensor(img1)
            // expect(imgRes1).toBeNull()

            // 图片审核 - 敏感图片，血腥图片
            // const img2 = ''
            // const imgRes2 = await imgCensor(img2)
            // expect(imgRes2).not.toBeNull()
        },
        20 * 1000 // 单独设置 timeout
    )
})
