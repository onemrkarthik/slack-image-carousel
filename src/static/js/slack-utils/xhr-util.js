/* global ActiveXObject*/
'use strict';

function XHRFactory() {
    var RESPONSE_READY = 4;
    var RESPONSE_OK = 200;
    var exports = {};

    var buildResultsArray = function(request) {
        var result;
        try {
            result = JSON.parse(request.responseText);
        } catch (e) {
            result = request.responseText;
        }
        return [result, request];
    };

    var xhr = function(type, url, data) {
        if (!type || !url) {
            return null;
        }

        var callbackMethods = {
            success: function() {},
            failure: function() {}
        };

        var XHR = XMLHttpRequest || ActiveXObject;
        var request = new XHR('MSXML2.XMLHTTP.3.0');

        request.open(type, url, true);

        //Each time the xhr status changes, this function gets called.
        request.onreadystatechange = function() {
            /*
                readyState holds the status of the XMLHttpRequest. readyState can have the following values:
                - 0: request not initialized
                - 1: server connection established
                - 2: request received
                - 3: processing request
                - 4: response is ready
             */
            if (request.readyState === RESPONSE_READY) {
                if (request.status === RESPONSE_OK) {
                    callbackMethods.success.apply(callbackMethods, buildResultsArray(request));
                } else {
                    callbackMethods.failure.apply(callbackMethods, buildResultsArray(request));
                }
            }
        };

        request.send(data);

        return {
            success: function(callback) {
                callbackMethods.success = callback;
                return callbackMethods;
            },
            failure: function(callback) {
                callbackMethods.failure = callback;
                return callbackMethods;
            }
        };
    };

    exports.get = function(url) {
        return xhr('GET', url);
    };

    exports.post = function(url, data) {
        return xhr('POST', url, data);
    };

    exports.put = function(url, data) {
        return xhr('PUT', url, data);
    };

    exports.delete = function(url) {
        return xhr('DELETE', url);
    };

    return exports;
}

module.exports = XHRFactory;
