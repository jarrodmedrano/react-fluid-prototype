import {addClass} from '../../../helpers.js';

let HeroItem = function(el) {
    this.element = el;
    this.multiCTA = this.element.querySelectorAll('.c-call-to-action')[1];

    return this.init();
};

HeroItem.prototype.init = function() {
    var that = this;

    if (window.addEventListener) {
        this.element.addEventListener('click', function(){
            that.clickEvent();
        }, true);
    } else if (window.attachEvent) {
        this.element.attachEvent('onclick', function(){
            that.clickEvent();
        });
    }

    return this;
};

HeroItem.prototype.clickEvent = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var heroLink  = this.element.querySelector('.c-call-to-action').href;

    if (target != this.multiCTA && target.parentNode != this.multiCTA){
        window.location = heroLink;
    }
};

export default HeroItem;