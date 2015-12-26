/**
 * 类似于ng-class的utils函数
 * @param constNames constNames 为不会变化的
 * @param nameObj {object} {class1: boolean}, 或者
 */
export default function (constNames, nameObj) {
    if (typeof constNames == 'object') {
        nameObj = constNames;
        constNames = ''
    }
    if (typeof nameObj == 'string') {
        return constNames + ' ' + nameObj
    }
    return constNames + Object.keys(nameObj)
            .map(name => nameObj[name] ? name : '')
            .filter(n=>!!n).join(' ')
}