import breakpoints from '../../../deprecated/config.breakpoints.js';
import breakpointTracker from '../../../deprecated/breakpointTracker.js';
import { getClientRect } from '../../../deprecated/helpers.js';

let DeviceActions = function(el) {
    this.element = el;
    return this.init();
};

DeviceActions.prototype.init = function() {
    this.buttons = this.element.querySelectorAll('.c-button');
    this.buttonContainers = this.element.querySelectorAll('.f-button');

    this.tempWidth = null;
    this.tempButtonWidth = null;

    for (var i = 0; i < this.buttons.length; i++) {
        var containerWidth = getClientRect(this.buttonContainers[i]).width;
        if (containerWidth > this.tempWidth || this.tempWidth === null) {
            this.tempWidth = containerWidth;
        }

        var buttonWidth = getClientRect(this.buttons[i]).width;
        if (buttonWidth > this.tempButtonWidth || this.tempButtonWidth === null) {
            this.tempButtonWidth = buttonWidth;
        }
    }
    this.updateWidths();

    if (window.addEventListener) {
        breakpointTracker.subscribe(this, this.update);
    }
};

DeviceActions.prototype.updateWidths = function() {
    for (var n = 0; n < this.buttons.length; n++) {
        this.buttons[n].style.width = this.tempButtonWidth + 'px';
        this.buttonContainers[n].style.width = this.tempWidth + 'px';
    }
};

DeviceActions.prototype.update = function(windowWidth) {
    this.viewport = breakpointTracker.identifyBreakpoint(windowWidth) + 1;

    if (this.viewport > 1) {
        this.updateWidths();
    } else {
        for (var m = 0; m < this.buttons.length; m++) {
            this.buttons[m].removeAttribute("style");
            this.buttonContainers[m].removeAttribute("style");
        }
    }
};

export default DeviceActions;