'use strict';

var markoTemplate = require('marko').load(require.resolve('./index.marko'));
var FlickrAPI = require('../../services/flickr-svc/api');

function isMobile(deviceType) {
    if (typeof deviceType !== 'undefined' && !!deviceType && deviceType === 'phone') {
        return true;
    }

    return false;
}

/*
This is the main controller. Serves the request for the /sch command and renders the page.
 */
module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    var deviceType = req.device.type,
        encodedKeyword = req.params.kw,
        perPage = req.query.per_page,
        options = {
            perPage: perPage
        };

    FlickrAPI.getPhotoFeed(encodedKeyword, options)
        .then(function(data) {
            if(data && typeof data === 'object') {
                //Setting the $global flag which is used by all marko files. 
                data.$global = {
                    isMobile: isMobile(deviceType)
                };    
            }
            
            markoTemplate.render(data, res);
        }, function(error) {
            markoTemplate.render({}, res);
        });
};  
