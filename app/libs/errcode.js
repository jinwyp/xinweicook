/**
 * reused in front-end
 */
module.exports = {
    user: {
        // todo: 第二第三位的1 是什么意思, sms独立出来??
        wrongMobile: 1110,
        wrongPassword: 1111,
        alreadyExist: 1112,
        notFound: 1113
    },
    order: {
        wrongMobile: 2110
    },
    sms: {
        wrongCode: 3110,
        expired: 3111,
        invalidCode: 3112,
        wrongType: 3113,
        tooManyTries: 3114,
        sendFailed: 3115,
        reachSendLimitation: 3116
    }
}