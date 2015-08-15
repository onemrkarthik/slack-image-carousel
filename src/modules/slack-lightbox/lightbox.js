'use strict';

var HIDDEN = 'hidden';
var ESC_KEY = 27;

function Lightbox(config) {
    this.init(config);
}

Lightbox.prototype.init = function(config) {
    this._$ = config._$;
    this.isMobile = config.isMobile;
    this.$mainPageContainer = this._$.$(config.pageMainContainer);
    this.state = 0;
    this.$root = this._$.$('.slack-lightbox');
    this.bindEventListeners();
};

Lightbox.prototype.bindEventListeners = function() {
    var self = this;
    window.addEventListener('slack.lightbox.show', self.showHideHandler.bind(self));
    window.addEventListener('slack.lightbox.hide', self.showHideHandler.bind(self));
    window.addEventListener('slack.lightbox.showcontent', self.showContentHandler.bind(self));

    self._$.addEventListener(document, 'keydown', function(event) {
        if (event.which === ESC_KEY && self.state) {
            self.showHideHandler();
        }
    });

    var $closeButton = self._$.$('.slack-lightbox__button--close');
    if (self.isMobile) {
        self._$.addEventListener($closeButton, 'touchstart', self.closeHandler.bind(self));
    } else {
        self._$.addEventListener($closeButton, 'click', self.closeHandler.bind(self));
    }
};

Lightbox.prototype.showHideHandler = function(event) {
    this.toggleState();
    this.toggleAccessibility();

    if (this.$root && this.$root.length > 0) {
        this._$.toggleClass(this.$root[0], HIDDEN);
    }
};

Lightbox.prototype.toggleState = function() {
    if (this.state === 0) {
        this.state = 1;
    } else {
        this.state = 0;
    }
};

Lightbox.prototype.toggleAccessibility = function() {
    if (this.$root && this.$root.length > 0 && this.$mainPageContainer && this.$mainPageContainer.length > 0) {
        if (this.state === 0) {
            this.$root[0].setAttribute('aria-hidden', true);
            this.$mainPageContainer[0].setAttribute('aria-hidden', false);
        } else {
            this.$root[0].setAttribute('aria-hidden', false);
            this.$mainPageContainer[0].setAttribute('aria-hidden', true);
        }
    }
};

Lightbox.prototype.showContentHandler = function(event) {
    var $lightBoxContainer = this._$.$('.slack-lightbox__content--body');
    var html = event.detail.data.html;
    if ($lightBoxContainer.length > 0) {
        $lightBoxContainer[0].innerHTML = html;
    }
};

Lightbox.prototype.closeHandler = function(event) {
    if (this.state) {
        this.showHideHandler();
    }
};

module.exports = Lightbox;
