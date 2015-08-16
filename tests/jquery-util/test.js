'use strict';

var expect = require('chai').expect;
var JqueryUtilClass = require('../../src/static/js/slack-utils/jquery-util');


describe('[jquery-util]', function () {
    var _$, thisElement;

    before(function fn() {
        _$ = new JqueryUtilClass();
    });
    
    after(function fn() {
        _$ = null;
    });

    beforeEach(function(){
        var div = document.createElement('div');
        div.id = 'test-id';
        div.className = 'test-class';
        document.body.appendChild(div);
        thisElement = document.getElementById('test-id');
    });

    afterEach(function() {
        thisElement.parentNode.removeChild(thisElement);
    });

    it('[jquery-util] instance should be created', function() {
        expect(_$).to.be.a('object');
    });

    describe('[jquery-util: hasClass]', function() {
        it('[jquery-util] hasClass checks for presence of class', function() {
            expect(_$.hasClass(thisElement, 'test-class')).to.be.true;
        });

        it('[jquery-util] hasClass checks for absense of class', function() {
            expect(_$.hasClass(thisElement, 'test2-class')).to.be.false;
        });    
    });

    describe('[jquery-util: addClass]', function() {
        it('[jquery-util] addClass adds a new class', function() {
            _$.addClass(thisElement, 'test2-class');
            expect(_$.hasClass(thisElement, 'test2-class')).to.be.true;
        });
    });

    describe('[jquery-util: removeClass]', function() {
        it('[jquery-util] removeClass removes the given class', function() {
            _$.addClass(thisElement, 'test2-class');
            expect(_$.hasClass(thisElement, 'test2-class')).to.be.true;
            _$.removeClass(thisElement, 'test2-class');
            expect(_$.hasClass(thisElement, 'test2-class')).to.be.false;
        });
    });

    describe('[jquery-util: toggleClass]', function() {
        it('[jquery-util] toggleClass toggles the given class', function() {
            expect(_$.hasClass(thisElement, 'test-class')).to.be.true;
            _$.toggleClass(thisElement, 'test-class');
            expect(_$.hasClass(thisElement, 'test-class')).to.be.false;
            _$.toggleClass(thisElement, 'test-class');
            expect(_$.hasClass(thisElement, 'test-class')).to.be.true;
        });
    }); 

    describe('[jquery-util: hide]', function() {
        it('[jquery-util] hides the given element', function() {
            expect(thisElement.style.display).to.be.equal('');
            
            _$.hide(thisElement);
            expect(thisElement.style.display).to.be.equal('none');
        });
    }); 

    describe('[jquery-util: show]', function() {
        it('[jquery-util] shows the given element', function() {
            expect(thisElement.style.display).to.be.equal('');
            _$.hide(thisElement);
            expect(thisElement.style.display).to.be.equal('none');
            _$.show(thisElement);
            expect(thisElement.style.display).to.be.equal('');
        });
    }); 

    describe('[jquery-util: append]', function() {
        it('[jquery-util] appends the given element', function() {
            var newElement = document.createElement('div');
            newElement.id = 'test-id-2';
            _$.append(thisElement, newElement)
            expect(document.getElementById('test-id-2')).to.not.be.null;
        });
    }); 

    describe('[jquery-util: remove]', function() {
        it('[jquery-util] remove the given element', function() {
            var newElement = document.createElement('div');
            newElement.id = 'test-id-2';
            _$.append(thisElement, newElement)
            expect(document.getElementById('test-id-2')).to.not.be.null;
            _$.remove(newElement);
            expect(document.getElementById('test-id-2')).to.be.null;
        });
    }); 

    describe('[jquery-util: query]', function() {
        it('[jquery-util] query elements with a given class', function() {
            var elements = _$.query('.test-class');
            expect(elements).to.not.be.null;
            expect(elements.length).to.be.above(0);
        });

        it('[jquery-util] query an element with a given id', function() {
            var elements = _$.query('#test-id');
            expect(elements).to.not.be.null;
            expect(elements.length).to.be.above(0);
        });

        it('[jquery-util] query elements with a given tagname', function() {
            var elements = _$.query('div');
            expect(elements).to.not.be.null;
            expect(elements.length).to.be.above(0);
        });
    }); 

    describe('[jquery-util: trigger]', function() {
        it('[jquery-util] trigger an event without data', function(done) {
            window.addEventListener('slack.lightbox.show', function(event) {
                expect(event).to.not.be.null;
                done();
            });

            _$.trigger('slack.lightbox.show');
        });

        it('[jquery-util] trigger an event with data', function(done) {
            window.addEventListener('slack.lightbox.show', function(event) {
                expect(event).to.not.be.null;
                expect(event.detail).to.not.be.null;
                expect(event.detail.data).to.not.be.null;
                expect(event.detail.data.text).to.be.equal('fizzbuzz');
                done();
            });

            _$.trigger('slack.lightbox.show', {text: 'fizzbuzz'});
        });
    }); 
});
