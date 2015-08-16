'use strict';

var XHR = require('./xhr-util');
var SINGLE_WHITE_SPACE = ' ';

function JavascriptUtil() {}

//Checks whether an element has a particular class
JavascriptUtil.prototype.hasClass = function(element, className) {
    if (!element || !className) {
        return false;
    }

    var classRegex = new RegExp('(\\s+|^)' + className + '(\\s+|$)');
    return !!element.className.match(classRegex);
};

//Removes a class from the given element
JavascriptUtil.prototype.removeClass = function(element, className) {
    if (!element || !className) {
        return;
    }

    var classRegex = new RegExp('(\\s+|^)' + className + '(\\s+|$)');
    element.className = element.className.replace(classRegex, SINGLE_WHITE_SPACE);
};

//Add a class to the given element
JavascriptUtil.prototype.addClass = function(element, className) {
    if (!element || !className) {
        return;
    }

    if (!this.hasClass(element, className)) {
        element.className += SINGLE_WHITE_SPACE + className;
    }
};

//Shows/Hides a particular class
JavascriptUtil.prototype.toggleClass = function(element, className) {
    if (!element || !className) {
        return;
    }

    this.hasClass(element, className) ? this.removeClass(element, className) : this.addClass(element, className);
};

JavascriptUtil.prototype.hide = function(element) {
    if (!element) {
        return;
    }

    element.style.display = 'none';
};

JavascriptUtil.prototype.show = function(element) {
    if (!element) {
        return;
    }

    element.style.display = '';
};

JavascriptUtil.prototype.append = function(parent, htmlString) {
    if (!parent || !htmlString) {
        return;
    }

    parent.appendChild(htmlString);
};

JavascriptUtil.prototype.remove = function(element) {
    if (!element) {
        return;
    }

    element.parentNode.removeChild(element);
};

JavascriptUtil.prototype.xhr = XHR();

JavascriptUtil.prototype.query = function(selector, tag) {
    if (!selector) {
        return null;
    }

    if (document.querySelectorAll) {
        return document.querySelectorAll(selector);
    }

    var selectorType = selector.charAt(0);
    switch (selectorType) {
        case '#':
            return document.getElementById(selector.slice(1));
        case '.':
            return document.getElementsByClassName(selector.slice(1), tag); //todo
        default:
            return document.getElementsByTagName(selector);
    }
};

JavascriptUtil.prototype.trigger = function(eventName, data) {
    if (!eventName) {
        return;
    }

    var customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(eventName, true, true, {
        data: data
    });
    window.dispatchEvent(customEvent);
};

JavascriptUtil.prototype.addEventListener = function(element, eventType, eventHandler) {
    if (!element || !eventType) {
        return;
    }

    if (element && element.nodeName || element.window) {
        if (document.addEventListener) {
            element.addEventListener.call(element, eventType, eventHandler, false);
        } else {
            element.attachEvent('on' + eventType, function() {
                return eventHandler.call(element, window.event);
            });
        }
    } 

    if (element && element.length) {
        var totalElements = element.length;
        for (var i = 0; i < totalElements; i++) {
            this.addEventListener(element[i], eventType, eventHandler);
        }
    }
};

module.exports = JavascriptUtil;
