angular.module('xw.services').factory('Alert', function () {
    var codeMsg = {
        1110: '手机号码或密码错误',
        1111: '手机号码或密码错误',
        1112: '该用户已存在',
        1113: '手机号码或密码错误',

        2110: '手机号码错误',

        3110: '短信码错误',
        3111: '短信码已过期',
        3112: '无效的短信码',
        3113: '错误的短信码类型',
        3114: '短信码验证次数过多, 请重新接收短信码',
        3115: '发送失败, 请稍后重试',
        3116: '短信码发送次数达到当日最大次数',

        4110: '菜品库存不足',

        5110: '尚未到充值码使用时间',
        5111: '优惠码/优惠券已过期',
        5112: '优惠码/优惠券已被使用',
        5113: '超出优惠码/优惠券最大使用次数'
    };

    return {
        show: function (code, def) {
            var msg = codeMsg[code];
            if (msg) alert(msg);
            else if (def) alert(def);
        },
        message: function (code) {
            return codeMsg[code] || '';
        }
    }
})