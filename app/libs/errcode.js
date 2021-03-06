/**
 * reused in front-end
 */
module.exports = {
    user: {
        // 第一位是大项分类,第二位是子分类 第三位开始一次排序 间隔建议为2或5 方便以后插入
        wrongMobile   : 1110,
        wrongPassword : 1111,
        alreadyExist  : 1112,
        notFound      : 1113,

        userReferrerWrong : 1140,

        userIdWrong : 1150,
        userGenderWrong : 1152,
        userOldAddressWrong : 1155,

        invitationSendCodeWrong : 1190,

        addressIdWrong : 1210,
        addressNotFound : 1212,
        addressNotInUser : 1214,

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
        addressSortOrderWrong     : 1237,

        addressNotDeliver     : 1270,

        addressBaiduMapNotFoundError     : 1280,
        addressBaiduMapQueryWrong     : 1290,
        addressBaiduMapRegionWrong     : 1291,


        shoppingCartNotArray     : 1500,
        shoppingCartDishIdWrong     : 1502,
        shoppingCartDishNumberWrong     : 1504,
        shoppingCartSubDishIdWrong     : 1506,
        shoppingCartSubDishNumberWrong     : 1508





    },
    order: {
        notFound: 2010,

        orderNumberWrong: 2010,
        orderIdWrong: 2011,
        warehouseIdWrong: 2012,

        cookingTypeWrong: 2110,
        clientFromWrong: 2112,

        creditWrong: 2115,
        freightWrong: 2117,
        paymentWrong: 2119,
        paymentUsedCashWrong: 2120,

        deliveryDateCookWrong: 2122,
        deliveryTimeCookWrong: 2124,
        deliveryDateEatWrong: 2126,
        deliveryTimeEatWrong: 2128,

        dishListArrayWrong: 2130,
        dishListDishNumberWrong: 2132,
        dishListDishIdWrong: 2134,
        dishListSubDishArrayWrong: 2136,
        dishListSubDishNumberWrong: 2138,
        dishListSubDishIdWrong: 2139,


        addressLatitudeWrong  : 2140,
        addressLongitudeWrong : 2142,

        addressProvinceWrong     : 2144,
        addressCityWrong         : 2145,
        addressDistrictWrong     : 2146,
        addressStreetWrong       : 2147,
        addressStreetNumberWrong : 2148,
        addressAddressWrong      : 2149,

        addressContactPersonWrong : 2152,
        addressMobileWrong        : 2154,

        addressIdWrong : 2160,

        userCommentWrong: 2180,

        dishIdInvalid: 2190,
        notOnlyDrink: 2192,
        notOverTenDrinks: 2194,


        orderStatusWrong: 2300,
        orderPaymentStatusWrong: 2310




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
        outOfCount: 5113,
        notFound      : 5120,
        exchanged: 5121,

        couponIdWrong : 5210,
        promotionCodeWrong : 5212
    },

    announcement: {
        announcementIdWrong : 8110,
        notFound: 8112
    }
};
