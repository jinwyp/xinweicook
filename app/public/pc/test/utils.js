import {search} from '../src/js/utils/utils.js'
import {orderData} from '../src/js/utils/order.js'
import chai from 'chai'

var expect = chai.expect;

describe('utils.utils', () => {
    describe('#search', () => {
        it('should extract the key-value pairs as an object', () => {
            var searchStr = '?key1=value1&key2=value2'
            expect(search(searchStr)).to.eql({
                key1: 'value1',
                key2: 'value2'
            })
        })
        it('should return an empty object if the query string is empty', () => {
            var searchStr1 = ''
            var searchStr2 = '?'
            expect(search(searchStr1)).to.eql({})
            expect(search(searchStr2)).to.eql({})
        })
        it('should store values as an array if the values has the same key', () => {
            var searchStr = '?key=value1&key=value2&key=value3'
            expect(search(searchStr)).to.eql({key: ['value1', 'value2', 'value3']})
        })
        it('should decode the params with encoded codes', () => {
            var searchStr = '?key=%E5%93%88%E5%93%88%EF%BC%8C,'
            expect(search(searchStr)).to.eql({key: '哈哈，,'})
        })
    })
})

describe('utils.order', () => {
    describe('#orderData', () => {
        var state = {
            cart: [
                {
                    dish: {
                        _id: '1',
                        cookingType: 'ready to cook'
                    },
                    number: 1,
                    selected: true
                },
                {
                    dish: {
                        _id: '2',
                        cookingType: 'ready to eat'
                    },
                    number: 2,
                    selected: true,
                    subDish: [
                        {
                            dish: {
                                _id: '3'
                            },
                            number: 2
                        }
                    ]
                },
                {
                    selected: false,
                    dish: '写测试有些迷茫,运行测试信心满满'
                }
            ],
            coupon: {
                card: {
                    selectedCard: {
                        _id: 'CARD_ID'
                    }
                },
                code: {
                    code: 'CODE'
                }
            },
            balance: {
                useBalance: true
            },
            address: {
                addresses: [
                    {
                        selected: true,
                        _id: '1'
                    }
                ]
            },
            freight: 1,
            time: {
                eat: {
                    selectedTime: {
                        day: '1',
                        segment: '2'
                    }
                },
                cook: {
                    selectedTime: {
                        day: '1',
                        segment: 'xxxxxx12:00'
                    }
                }
            },
            comment: '1',
            warehouse: '1',
            credit: 0
        }

        var data = {
            cookingType: 'ready to eat',
            dishList: [
                {
                    dish: '1',
                    number: 1,
                    subDish: []
                },
                {
                    dish: '2',
                    number: 2,
                    subDish: [{dish: '3', number: 2}]
                }
            ],
            usedAccountBalance: true,
            addressId: '1',
            clientFrom: 'website',
            coupon: 'CARD_ID',
            promotionCode: 'CODE'
        }

        it('should return full data if called by isOrder be true', () => {
            expect(orderData(state, true)).to.eql({
                ...data,
                payment: 'alipay direct',
                userComment: '1',
                warehouseId: '1',
                freight: 1,
                credit: 0,
                paymentUsedCash: false,
                deliveryDateEat: '1',
                deliveryTimeEat: '2',
                deliveryDateCook: '1',
                deliveryTimeCook: '12:00'
            })
        })

        it('should contain the same cookingType with dishes in the cart', () => {
            expect(orderData({
                ...state,
                cart: [{
                    dish: {
                        _id: '1',
                        cookingType: 'ready to eat'
                    },
                    number: 1,
                    selected: true
                }]}).cookingType).to.equal('ready to eat')
        })
    })
})