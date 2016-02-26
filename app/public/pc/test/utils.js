import {search} from '../src/js/utils/utils.js'
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
        it('should decode the url encoded codes', () => {
            var searchStr = '?key=%E5%93%88%E5%93%88%EF%BC%8C,'
            expect(search(searchStr)).to.eql({key: '哈哈，,'})
        })
    })
})

describe('utils.order', () => {
    describe('#orderData', () => {
        it('should ', () => {
            
        })
    })
})