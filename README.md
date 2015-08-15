### Problem
A web page that shows a photo in a lightbox view, with the ability to move to the next / previous photos and display the photo title. 

[Demo](https://sheltered-dawn-3909.herokuapp.com/sch/ferrari) can be seen here. 

###Developer documentation:
* Github url: https://github.com/onemrkarthik/slack-image-carousel
* Application is built using NodeJS, and [lasso-js](https://github.com/lasso-js/lasso) for bundling resources. Lasso is similar to browserify and helps load components that follow the CommonJS conventions. All the Javascript Utils and components are written according to CommonJS conventions.
* Has been hosted on Heroku

#### Project folder structure 
Only shows the most important files. 
```
src/
    modules/
        carousel/
            carousel.js 
        lightbox/
            lightbox.less
            lightbox.js 
    pages/
        index/
            index.marko
            slack-widget.js
            style.less
            index.js
    services/
        flickr-svc/
    static/
        css/
        js/
          jquery-util.js
          xhr-util.js
config/
    routes.json
index.js
package.json
``` 

#### API's used
* Used the [node-flickrapi](https://github.com/Pomax/node-flickrapi) node module to make use Flickr's [Search API](https://www.flickr.com/services/api/flickr.photos.search.html)
* AJAX command: 
   * http://sheltered-dawn-3909.herokuapp.com/svc/media/sch/SEARCH_TERM?[per_page=10]
      * SEARCH_TERM (required) = any search keyword
      * per_page (options) = number of results to be returned, per request
   * Sample ajax response:
```
{
    photos: [{
        title: "Von Ryan Racing McLaren 650S GT3 British GT 2015 Sportscar Racing News",
        url: "https://farm6.static.flickr.com/5781/20611308211_e22d31984f_c.jpg"
    }],
    searchKeyword: "ferrari"
}
```

### Front end components:
#### Jquery util - Supports the following methods
  * hasClass(element, className)
  * removeClass(element, className)
  * addClass(element, className)
  * toggleClass(element, className)
  * hide(element)
  * show(element)
  * $(selector, tag)
  * xhr(type, url, data)
     * get
     * post
     * put
     * delete
  * append(parent, htmlString)
  * trigger(eventName, data)
  * addEventListener(element, eventType, eventHandler)

####Carousel
* Events - following events can be fired on the document
    * slack.carousel.show - initiates the carousel render
    * slack.carousel.next - seek to the next image
    * slack.carousel.prev - seek to the previous image

####Lightbox
* Events - following events can be fired on the document
    * slack.lightbox.showcontent - displays any content sent across in the lightbox
    * slack.lightbox.show - opens the lightbox
    * slack.lightbox.hide - closes the lightbox


#### Features supported
* All components are responsive
* Has been tested on all modern browsers on Mac(Firefox, safari, and chrome) and windows (Firefox, safari, chrome and IE)
* Has been tested on the chrome mobile simulator across all devices. And on Safari and Chrome on iPhone 6+ hardware.
* Has not been tested on Opera.  
* Images can be changed by entering different search terms in the URL: https://sheltered-dawn-3909.herokuapp.com/sch/cats, https://sheltered-dawn-3909.herokuapp.com/sch/dogs
* Click on expand icon opens the lightbox
* ESC key or click on close button closes the lightbox
* Left/right arrow keys or Prev/Next icons can be used to go to the previous or next image.
