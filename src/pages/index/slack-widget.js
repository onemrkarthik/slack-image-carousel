'use strict';

var JqueryUtilClass = require('../../static/js/slack-utils/jquery-util');
var Carousel = require('../../modules/slack-carousel/carousel');
var Lightbox = require('../../modules/slack-lightbox/lightbox');
var TRUE = 'true';
function SlackWidget(config) {
    this.init(config);
}

SlackWidget.prototype.init = function(config) {
    /*
        Initialize all the components that are required by the page.
     */
    this.isMobile = (config.isMobile === TRUE);
    this._$ = new JqueryUtilClass();

    this.carousel = new Carousel({
        isMobile: this.isMobile,
        _$: this._$
    });

    this.lightbox = new Lightbox({
        isMobile: this.isMobile,
        _$: this._$,
        pageMainContainer: '.slack-main-container' //required for disabling main container when the lightbox is open. 
    });

    /*
        Extract the search keyword from the dom and pass it along to
        the carousel for the ajax call.
     */
    this.$mainContainer = this._$.query('.slack-main-container');
    this.searchKeyword = this.$mainContainer[0].getAttribute('data-kw');
    this.bindEventListeners();
};

SlackWidget.prototype.bindEventListeners = function() {
    var self = this;
    
    /*
    When the user clicks the main image, trigger an event to the carousel
    so that the following can happen:
        - open the lightbox
        - ajax call to fetch more images
        - render more images
     */
    var $enlargeButton = self._$.query('.slack-button--enlarge');
    if(self.isMobile) {
        self._$.addEventListener($enlargeButton, 'touchstart', self.enlargeButtonClickHandler.bind(self));
    } else {
        self._$.addEventListener($enlargeButton, 'click', self.enlargeButtonClickHandler.bind(self));    
    }
};

SlackWidget.prototype.enlargeButtonClickHandler = function() {
    this._$.trigger('slack.carousel.show', {searchKeyword: this.searchKeyword});
};

//So that widget can be instantiated on the main page. 
window.SlackWidgetClass = SlackWidget;
