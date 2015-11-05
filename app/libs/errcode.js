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
        addressCoordTypeWrong : 1222,

        addressProvinceWrong     : 1225,
        addressCityWrong         : 1226,
        addressDistrictWrong     : 1227,
        addressStreetWrong       : 1228,
        addressStreetNumberWrong : 1229,
        addressAddressWrong      : 1230,

        addressContactPersonWrong : 1235,
        addressMobileWrong        : 1236,
        addressSortOrderWrong     : 1237

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