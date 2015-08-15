'use strict';

var LEFT_ARROW_KEY = 37;
var RIGHT_ARROW_KEY = 39;
var MEDIA_SEARCH_SERVICE_ENDPOINT = '/svc/media/sch/';

function Carousel(config) {
    this.init(config);
}

Carousel.prototype.init = function(config) {
    this._$ = config._$;
    this.isMobile = config.isMobile;
    this.photos = undefined;
    this.totalImages = 0;
    this.currentImage = 0;
    this.bindEventListeners();
};

Carousel.prototype.bindEventListeners = function() {
    var self = this;
    window.addEventListener('slack.carousel.show', self.showCarouselHandler.bind(self));
    window.addEventListener('slack.carousel.next', self.nextHandler.bind(self));
    window.addEventListener('slack.carousel.prev', self.prevHandler.bind(self));

    self._$.addEventListener(document, 'keydown', function(event) {
        if (event.which === RIGHT_ARROW_KEY) { //right
            self.nextHandler();
        }

        if (event.which === LEFT_ARROW_KEY) {
            self.prevHandler();
        }
    });

    if (self.isMobile) {
        self._$.addEventListener(document, 'touchstart', self.navHandler.bind(self));
    } else {
        self._$.addEventListener(document, 'click', self.navHandler.bind(self));
    }
};

Carousel.prototype.showCarouselHandler = function(event) {
    this._$.trigger('slack.lightbox.show');
    var searchKeyword = event.detail.data.searchKeyword;

    if (!this.photos) {
        this.fetchPhotosFromFlickr(searchKeyword, this.flickrPhotoHandler.bind(this));
    }
};

Carousel.prototype.fetchPhotosFromFlickr = function(searchKeyword, next) {
    this._$.xhr.get(MEDIA_SEARCH_SERVICE_ENDPOINT + encodeURIComponent(searchKeyword) + '?per_page=25')
        .success(function(data, xhr) {
            next(null, data);
        })
        .failure(function(data, xhr) {
            next(new Error('Could not fetch photos from flickr'), null);
        });
};

/*
    On receiving the data from the ajax call, cache the data
    and trigger the lighbox.
 */
Carousel.prototype.flickrPhotoHandler = function(error, data) {
    if (data) {
        this.photos = data.photos;
        this.totalImages = this.photos.length;
        var showContentData = {
            html: this._$.$('.slack-main-container')[0].innerHTML
        };
        this._$.trigger('slack.lightbox.showcontent', showContentData);
    }
};

Carousel.prototype.nextHandler = function(event) {
    if (this.currentImage === (this.totalImages - 1)) {
        this.currentImage = 0;
    } else {
        this.currentImage++;
    }

    this.switchPhotoData(this.photos[this.currentImage]);
};

Carousel.prototype.prevHandler = function(event) {
    if (this.currentImage === 0) {
        this.currentImage = this.totalImages - 1;
    } else {
        this.currentImage--;
    }

    this.switchPhotoData(this.photos[this.currentImage]);
};

Carousel.prototype.switchPhotoData = function(newImageData) {
    //Caching the dom nodes so that they dont have to be accessed over n over again.
    if (!this.$imageContainer && !this.$mainImageCaption) {
        this.$imageContainer = this._$.$('.slack-lightbox__content--body .slack-image__figure');
        this.$mainImageCaption = this._$.$('.slack-lightbox__content--body .slack-image__caption');
    }

    var $mainImage = this._$.$('.slack-lightbox__content--body .slack-image__img');
    /*
    Instead of replacing the current image souce, if we create a new image tag,
    the browser progressively renders the new image. It makes for better image
    load perception for the user. This can be observed in poor bandwidth connections.
     */
    this.removeThisImageAndCreateNewImageTag(newImageData, $mainImage);

    if (this.$mainImageCaption && this.$mainImageCaption.length > 0) {
        this.$mainImageCaption[0].innerHTML = newImageData.title;
    }
};

Carousel.prototype.removeThisImageAndCreateNewImageTag = function(newImageData, $oldImage) {
    if ($oldImage && $oldImage.length > 0) {
        var cloneImageNode = $oldImage[0].cloneNode();
        $oldImage[0].parentNode.removeChild($oldImage[0]);
        cloneImageNode.setAttribute('src', newImageData.url);
        cloneImageNode.setAttribute('alt', newImageData.title);

        if (this.$imageContainer && this.$imageContainer.length > 0) {
            this.$imageContainer[0].appendChild(cloneImageNode);
        }
    }
};

Carousel.prototype.navHandler = function(event) {
    var self = this;
    var target = event.target || event.srcElement;

    if (self._$.hasClass(target, 'slack-arrow--left')) {
        self.prevHandler();
    }

    if (self._$.hasClass(target, 'slack-arrow--right')) {
        self.nextHandler();
    }
};

module.exports = Carousel;
