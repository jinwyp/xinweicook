/**
 * reused in front-end
 */
module.exports = {
    user: {
        // todo: 第二第三位的1 是什么意思, sms独立出来??
        wrongMobile   : 1110,
        wrongPassword : 1111,
        alreadyExist  : 1112,
        notFound      : 1113,

        addressIdNotFound : 1210,
        addressNotFound : 1212,

        addressLatitudeWrong  : 1220,
        addressLongitudeWrong : 1221,

        addressProvinceWrong     : 1222,
        addressCityWrong         : 1223,
        addressDistrictWrong     : 1224,
        addressStreetWrong       : 1225,
        addressStreetNumberWrong : 1226,
        addressAddressWrong      : 1227,

        addressContactPersonWrong : 1228,
        addressMobileWrong        : 1229,
        addressSortOrderWrong     : 1230

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
    },
    dish: {
        outOfStock: 4110
    },
    coupon: {
        notStart: 5110,
        expired: 5111,
        used: 5112,
        outOfCount: 5113
    }
};