angular.module('xw.directives').directive('couponCode', function (Coupon, $q) {
    return {
        restrict: 'A',
        scope: {
            couponPrice: '=couponCode',
            couponCodeType: '='
        },
        require: '?ngModel',
        link: function (scope, el, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$asyncValidators.couponCode = function (mValue, vValue) {
                var value = mValue || vValue;

                if (!value) return $q.resolve(1);

                value = value.length == 8 ? 'zz' + value : value;

                return Coupon.getCouponInfo(value).then(function (res) {
                    var coupon = res.data;
                    var now = new Date(res.headers('date'));
                    var startDate = new Date(coupon.startDate);
                    var endDate = new Date(coupon.endDate);
                    // todo: check price limit
                    if (startDate <= now && now <= endDate) {
                        if (coupon.couponType == "promocodepercentage") {
                            scope.couponCodeType = 'promocodepercentage'
                        }
                        scope.couponPrice = coupon.price;
                        // todo: 价格限制
                    } else {
                        return $q.reject('未在可使用期限内');
                    }
                })
            }
        }
    }
});