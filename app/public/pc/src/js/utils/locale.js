import en from '../../../../../locales/en.json'
import zh from '../../../../../locales/zh.json'

export function lang() {
    return document.cookie.indexOf('lang=en') != -1 ? 'en' : 'zh'
}

export function __(key) {
    var data = lang() == 'zh' ? zh : en
    return data[key] || key
}

