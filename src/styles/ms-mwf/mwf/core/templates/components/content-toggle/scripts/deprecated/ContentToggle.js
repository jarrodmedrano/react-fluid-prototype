import {getClientRect} from '../../../helpers.js';

let ContentToggle = function(el) {
    this.element = el;

    return this.init();
};

ContentToggle.prototype.init = function() {

    this.target = this.element.querySelector('[data-f-expanded]');
    if (!this.target) {
        // Keeping original element detection for backwards compatibility
        this.target = this.element.getElementsByTagName("p")[0];
    }
    this.lineHeight = this.calculateLineHeight(this.target);

    this.trigger = this.element.getElementsByTagName('button')[0];
    this.show = this.trigger.getAttribute('data-f-show');
    if (!this.show) {
        this.show = 3;
    }
    this.strings = {
        moreText: this.trigger.getAttribute('data-f-more'),
        lessText: this.trigger.getAttribute('data-f-less')
    };

    if (this.noToggle()) {
        this.trigger.innerHTML = "";
        return false;
    }

    if (this.isExpanded()) {
        this.expand();
    } else {
        this.collapse();
    }

    if (window.addEventListener) {
        this.trigger.addEventListener('click', this, false);
    } else if (window.attachEvent){
        var that = this;
        this.trigger.attachEvent('onclick', function() {
            that.handleEvent.call(that);
        });
    }

    return this;
};

ContentToggle.prototype.handleEvent = function () {
    if (this.isExpanded()) {
        this.collapse();
    } else {
        this.expand();
    }
};

ContentToggle.prototype.noToggle = function() {
    if (this.show !== 0 && getClientRect(this.target).height <= (this.lineHeight * this.show)) {
        return true;
    }
    return false;
};

ContentToggle.prototype.isExpanded = function() {
    return this.trigger.getAttribute("aria-expanded") === 'true';
};

ContentToggle.prototype.calculateLineHeight = function (element) {
    // Measure line-height by adding two new lines and measure the distance
    // between the two new lines. Adding one line can cause an incorrect
    // measurement because of the possibility of padding/margins.
    var clone = element.cloneNode();
    clone.innerHTML = '<br>';
    element.appendChild(clone);
    var singleLineHeight = clone.offsetHeight;
    clone.innerHTML = '<br><br>';
    var doubleLineHeight = clone.offsetHeight;
    element.removeChild(clone);
    var lineHeight = doubleLineHeight - singleLineHeight;
    return lineHeight;
};

ContentToggle.prototype.expand = function() {
    this.target.setAttribute('data-f-expanded', true);
    this.trigger.setAttribute('aria-expanded', true);
    this.trigger.innerHTML = this.strings.lessText;
    this.target.style.removeProperty('max-height');
};

ContentToggle.prototype.collapse = function() {
    this.target.setAttribute('data-f-expanded', false);
    this.trigger.setAttribute('aria-expanded', false);
    this.trigger.innerHTML = this.strings.moreText;
    this.target.style.maxHeight = (this.lineHeight * this.show) + "px";
};

export default ContentToggle;