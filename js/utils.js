const log = console.log.bind(console)

const e = (selector) => document.querySelector(selector)

const el = (selector) => document.querySelectorAll(selector)

const bindEleEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}