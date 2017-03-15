/// <amd-module name='slider'/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {Publisher, ISubscriber} from 'publisher';
import {
    addClass,
    addDebouncedEvent,
    addEvent,
    css,
    Direction,
    eventTypes,
    getClientRect,
    getDirection,
    getEvent,
    getEventTargetOrSrcElement,
    hasClass,
    removeEvent,
    selectFirstElement
} from 'htmlExtensions';
import {isNumber, pointInRect, getKeyCode, apiDeprecated} from 'utility';
import {keycodes} from 'keycodes';

/**
* @interface ISliderNotification
* @description - The data contract interface used for slider notifications.
* @export
*/
export interface ISliderNotification {
    value: number;
    internal: boolean;
    userInitiated: boolean;
}

// The ISliderSubscriber interface which slider notification subscribers must implement.
export interface ISliderSubscriber extends ISubscriber {
    onValueChanged(notification: ISliderNotification): string;
}

/**
* @class - Slider
* @classdesc - The Slider component
* @export
*/
export class Slider extends Publisher<ISliderSubscriber> {
    /**
    * @name - selector
    * @description - selector to use to find Slider components in the document.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-slider';

    /**
    * @name - hitPadding
    * @description - padding (in pixels) to add to the clientRect of the slider to increase the hit test area.
    * @static
    * @private
    * @type {string}
    */
    private static hitPadding = 20;

    /**
    * @name - input
    * @description - The slider's native input element to read min/max/value/step properties from and update value on.
    *                This native element is hidden and the ux is replaced by the mockSlider element.
    * @private
    * @type {HTMLElement}
    */
    private input: HTMLElement;

    /**
    * @name - primaryDirection
    * @description - The ltr/rtl direction.
    * @private
    * @type {Direction}
    */
    private primaryDirection: Direction;

    /**
    * @name - isVerticalSlider
    * @description - The slider's horizontal/vertical orientation. True if vertical, otherwise false.
    * @private
    * @type {boolean}
    */
    private isVerticalSlider: boolean;

    /**
    * @name - mockSlider
    * @description - The slider's mock slider element that provides the ux replacement for the native slider.
    * @private
    * @type {HTMLElement}
    */
    private mockSlider: HTMLElement;

    /**
    * @name - thumb
    * @description - The mock slider's thumb.
    * @private
    * @type {HTMLElement}
    */
    private thumb: HTMLElement;

    /**
    * @name - valueTooltip
    * @description - The mock slider's thumb tooltip with the current value.
    * @private
    * @type {HTMLElement}
    */
    private valueTooltip: HTMLElement;

    /**
    * @name - track
    * @description - The mock slider's ux track element.
    * @private
    * @type {HTMLElement}
    */
    private track: HTMLElement;

    /**
    * @name - min
    * @description - The slider's minimum value.
    * @private
    * @type {number}
    */
    private min: number;

    /**
    * @name - max
    * @description - The slider's maximum value.
    * @private
    * @type {number}
    */
    private max: number;

    /**
    * @name - range
    * @description - The slider's value range.
    * @private
    * @type {number}
    */
    private range: number;

    /**
    * @name - value
    * @description - The slider's value.
    * @private
    * @type {number}
    */
    private value: number;

    /**
    * @name - valueTooltipText
    * @description - The mock slider's thumb tooltip text.
    * @private
    * @type {string}
    */
    private valueTooltipText: string;

    /**
    * @name - step
    * @description - The slider's step value.
    * @private
    * @type {number}
    */
    private step: number;

    /**
    * @name - dimensions
    * @description - The slider's client rect.
    * @private
    * @type {number}
    */
    private dimensions: ClientRect;

    /**
    * @name - halfThumbOffset
    * @description - The slider's half thumb offset.
    *                This will be half of the thumbs width/height depending on the sliders orientation.
    *                It is used to offset the thumb's edge from the current mouse position so the thumb
    *                is rendered centered on the mouse.
    * @private
    * @type {number}
    */
    private halfThumbOffset: number;

    /**
    * @name - thumbRange
    * @description - This is the range of the thumb in pixels. The current thumb position is compared to this range
    *                to relatively compute the value in from the slider's value range.
    * @private
    * @type {number}
    */
    private thumbRange: number;

    /**
    * @name - thumbOffset
    * @description - This is the current offset of the thumb in pixels from the starting edge of the slider.
    * @private
    * @type {number}
    */
    private thumbOffset: number;

    /**
    * @name - maxThumbOffset
    * @description - This is the maximum offset of the thumb in pixels from the starting edge of the slider.
    * @private
    * @type {number}
    */
    private maxThumbOffset: number;

    /**
    * @name - stepOffset
    * @description - This is the step offset in pixels for moving the thumb when the keyboard arrows are used.
    *                This value is proportionally computed from the slider's pixel range and it value/step properties.
    * @private
    * @type {number}
    */
    private stepOffset: number;

    /**
    * @name - resizeListener
    * @description - Window resize listener.
    *                This value is proportionally computed from the slider's pixel range and it value/step properties.
    * @private
    * @type {EventListener}
    */
    private resizeListener: EventListener;

    /**
    * @name - constructor
    * @description - Constructor for the Slider component.
    * @public
    * @param {HTMLElement} sliderElement - the native element to attach the Slider behavior to.
    */
    constructor(element: HTMLElement) {
        super(element);
        this.update();
    }

    /**
    * @name - update
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @returns {void}
    */
    protected update(): void {
        if (!this.element) {
            return;
        }

        this.input = selectFirstElement('input', this.element);
        this.primaryDirection = getDirection(this.element);
        this.isVerticalSlider = hasClass(this.input, 'f-vertical');

        // Hide the native input element.
        addClass(this.input, 'x-screen-reader');

        // Get and validate the min/max values.
        let min = parseInt(this.input.getAttribute('min'), 10) || 0;
        let max = parseInt(this.input.getAttribute('max'), 10) || 100;
        let value = parseInt(this.input.getAttribute('value'), 10);
        let step = parseInt(this.input.getAttribute('step'), 10);

        // See if we need to add the silder ux elements or if they already exist.
        if (this.element.children[this.element.children.length - 1] === this.input) {
            // The elements do not yet exist, create and add them.
            this.mockSlider = document.createElement('div');

            // Create slider button and make it accessible.
            this.thumb = document.createElement('button');
            this.thumb.setAttribute('role', 'slider');
            this.thumb.setAttribute('aria-valuemin', min.toString());
            this.thumb.setAttribute('aria-valuemax', max.toString());
            this.thumb.setAttribute('aria-valuenow', value.toString());

            // Create tooltip and track.
            this.valueTooltip = document.createElement('span');
            this.track = document.createElement('span');

            // Combine replacement elements.
            this.thumb.appendChild(this.valueTooltip);
            this.mockSlider.appendChild(this.thumb);
            this.mockSlider.appendChild(this.track);

            // Add new component elements to DOM
            this.element.appendChild(this.mockSlider);

            // Set the ignore flag because we're intentionally changing the DOM here and
            // don't want to trigger another teardown/update cycle or we'll get into a loop.
            this.ignoreNextDOMChange = true;
        } else {
            // The elements already exist, reacquire them.
            this.mockSlider = this.element.children[this.element.children.length - 1] as HTMLElement;
            this.thumb = this.mockSlider.firstElementChild as HTMLElement;
            this.valueTooltip = this.thumb.firstElementChild as HTMLElement;
            this.track = this.mockSlider.children[this.mockSlider.children.length - 1] as HTMLElement;
        }

        // For now the vertical orientation of the slider is achieved by rotating 90 degrees so for
        // vertical we'll still pull the halfThumbOffset from the width instead of the height.
        this.halfThumbOffset = (/*this.isVerticalSlider ? this.thumb.clientHeight :*/ this.thumb.clientWidth) / 2;

        if (this.resetSliderInternal(min, max, value, step, true)) {
            addEvent(this.element, eventTypes.mousedown, this.onMouseDown);
            addEvent(this.thumb, eventTypes.keydown, this.onKeyDown);
            this.resizeListener = addDebouncedEvent(window, eventTypes.resize, this.onWindowResized);
        }
    }

    /**
    * @name - teardown
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @returns {void}
    */
    protected teardown(): void {
        // Remove the click listener.
        removeEvent(this.element, eventTypes.mousedown, this.onMouseDown);
        removeEvent(this.thumb, eventTypes.keydown, this.onKeyDown);
        removeEvent(window, eventTypes.resize, this.resizeListener);

        // Reset non static members
        this.input = null;
        this.mockSlider = null;
        this.thumb = null;
        this.valueTooltip = null;
        this.track = null;
        this.resizeListener = null;
    }

    /**
    * @name - resetSlider
    * @description - Resets the slider from the specified values.
    *                This public version calls the interal version to do the real work.
    * @public
    * @param {number} min - The new min value.
    * @param {number} max - The new max value.
    * @param {number} [value] - The optional new value. If omitted the current value is preserved and range constrained.
    * @param {number} [step] - The optional new step value. If omitted step is set to range/10.
    * @returns {boolean} True if the slider was successfully reset from the specified values, otherwise false.
    */
    public resetSlider(min: number, max: number, value?: number, step?: number): boolean {
        return this.resetSliderInternal(min, max, value, step, false);
    }

    /**
    * @name - resetSliderInternal
    * @description - Resets the slider from the specified values.
    * @private
    * @param {number} min - The new min value.
    * @param {number} max - The new max value.
    * @param {number} value - The optional new value. If omitted the current value is preserved and range constrained.
    * @param {number} step - The optional new step value. If omitted step is set to range/10.
    * @param {boolean} internal - Whether or not this reset was internally generated.
    * @returns {boolean} True if the slider was successfully reset from the specified values, otherwise false.
    */
    private resetSliderInternal(min: number, max: number, value: number, step: number, internal: boolean): boolean {
        if (!isNumber(min) || !isNumber(max)) {
            return false;
        }

        if (Math.max(min, max) - Math.min(min, max) <= 0) {
            return false;
        }

        this.min = Math.min(min, max);
        this.max = Math.max(min, max);
        this.range = this.max - this.min;
        this.step = isNaN(step) ? (this.range / 10) : step;

        this.value = Math.min(Math.max(isNaN(value) ? (isNaN(this.value) ? this.min : this.value) : value, this.min), this.max);

        this.setupDimensions();
        this.updateThumbOffset(this.thumbOffset, internal, false);
        return true;
    }

    /**
    * @name - setValue
    * @description - Sets the slider's value to the specified value.
    * @public
    * @param {number} value - The new value.
    * @returns {boolean} True if the slider's value was successfully updated to the specified value, otherwise false.
    */
    public setValue(value: number): boolean {
        if (!isNumber(value) || (value < this.min) || (value > this.max)) {
            return false;
        }

        if (value !== this.value) {
            this.thumbOffset = ((value - this.min) * this.thumbRange / this.range) + this.halfThumbOffset;
            this.updateThumbOffset(this.thumbOffset, false, false);
        }

        return true;
    }

    /**
    * @name - setupDimensions
    * @description - Resets the dimensions and other members that use client coordinates
    * @private
    * @returns {void}
    */
    private setupDimensions(): void {
        this.dimensions = getClientRect(this.mockSlider) as ClientRect;

        if (this.isVerticalSlider) {
            this.dimensions.left -= Slider.hitPadding;
            this.dimensions.right += Slider.hitPadding;

            // For now the vertical orientation of the slider is achieved by rotating 90 degrees so for
            // vertical we'll still compute the thumbrange from the width instead of the height.
            this.thumbRange = this.dimensions.height - this.thumb.clientWidth; // this.thumb.clientHeight;
            this.maxThumbOffset = this.dimensions.height;
        } else {
            this.dimensions.top -= Slider.hitPadding;
            this.dimensions.bottom += Slider.hitPadding;

            this.thumbRange = this.dimensions.width - this.thumb.clientWidth;
            this.maxThumbOffset = this.dimensions.width;
        }

        this.thumbRange = Math.max(this.thumbRange, 1);
        this.thumbOffset = ((this.value - this.min) * this.thumbRange / this.range) + this.halfThumbOffset;
        this.stepOffset = this.thumbRange / (this.range / this.step);

        this.setThumbPosition();
    }

    /**
    * @name - setThumbPosition
    * @description - Updates the thumb position based on the current thumbOffset
    * @private
    * @returns {void}
    */
    private setThumbPosition(): void {
        // Offset the thumbs edge so that it's centered on the thumbOffset.
        let offset = Math.max(0, this.thumbOffset - this.halfThumbOffset);

        css(this.thumb, Direction[this.primaryDirection], offset + 'px');
        css(this.track, 'width', offset + 'px');
    }

    /**
    * @name - updateThumbOffset
    * @description - Updates the thumbOffset and slider value to the specified offset or the current thumbOffset if none is specified.
    *                The offset will be in pixels, the slider's value will be set proportionally relative from the slider's range as
    *                offset is to the slider's thumbRange.
    * @private
    * @param {number} offset - The new offset position for the thumb.
    * @param {boolean} internal - Whether or not this update was internally or externally generated.
    * @param {boolean} userInitiated - Whether or not this update was user initiated.
    * @returns {void}
    */
    private updateThumbOffset(offset: number, internal: boolean, userInitiated: boolean): void {
        if (!isNumber(offset)) {
            offset = this.thumbOffset;
        }

        // Ensure that the new offset value falls within the offset range.
        this.thumbOffset = Math.min(Math.max(0, offset), this.maxThumbOffset);

        // Find the % value of the thumbOffset within the thumbRange.
        let value = Math.max(0, this.thumbOffset - this.halfThumbOffset) * 1000 * this.range / this.thumbRange;

        // Convert the pixel value to the slider value
        value = Math.round(value) / 1000 + this.min;

        this.value = Math.min(Math.max(this.min, value), this.max);

        // Set value tooltip text to null so we can tell if any subscriber updates it.
        this.valueTooltipText = null;

        this.initiatePublish({ value: this.value, internal: internal, userInitiated: userInitiated });

        // If no subscriber updated the tooltip text default it to the new value.
        if (!this.valueTooltipText) {
            this.valueTooltipText = Math.round(this.value).toString();
        }

        // Match for colon because strings like "00:01" can be successfully
        // converted to a float. We want to avoid this because strings that are not
        // valid numbers between min and max should not be set as values for value
        // and aria-valuenow attributes.
        if (isNaN(parseFloat(this.valueTooltipText)) || this.valueTooltipText.match(':')) {
            this.input.setAttribute('value', value.toString());
            this.thumb.setAttribute('aria-valuenow', value.toString());
            this.thumb.setAttribute('aria-valuetext', this.valueTooltipText);
        } else {
            this.input.setAttribute('value', this.valueTooltipText);
            this.thumb.setAttribute('aria-valuenow', this.valueTooltipText);
        }

        this.valueTooltip.innerHTML = this.valueTooltipText;

        this.setThumbPosition();
    }

    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {ISelectMenuSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: ISliderSubscriber, context?: any): void {
        let valueTooltipText = subscriber.onValueChanged(context as ISliderNotification);

        if (!!valueTooltipText && !this.valueTooltipText) {
            // Subscribers can return a value to use for the tooltip text.
            // We will use the first one, if any, that is returned.
            this.valueTooltipText = valueTooltipText;
        }
    }

    /**
    * @name - moveThumbTo
    * @description - Moves the slider's thumb to the specified x/y position.
    *                Horizontal sliders only care about the x coordinate, vertical sliders only care about the y coordinate.
    *                The point is first hit tested against the slider's hit rect, then, if it lies within it, the coordinate
    *                is translated from client coordinate to relative offset. ltr/rtl adjustment is also made for horizontal sliders.
    * @private
    * @param {number} x - the x coordinate to move the thumb to for horizontal sliders.
    * @param {number} y - the y coordinate to move the thumb to for vertical sliders.
    * @returns {void}
    */
    private moveThumbTo(x: number, y: number): void {
        if (!pointInRect(x, y, this.dimensions)) {
            return;
        }

        let offset = this.dimensions.bottom - y;

        if (!this.isVerticalSlider) {
            offset = (this.primaryDirection === Direction.left) ?
                x - this.dimensions.left :
                this.dimensions.right - x;
        }

        this.updateThumbOffset(offset, true, true);
    }

    /**
    * @name - onKeyPressed
    * @description - Handles keyboard navigation for the mock slider thumb.
    *                Horizontal sliders only care about left/right arrows, vertical sliders only care about up/down arrows.
    * @private
    * @param {keycodes} key - the keycode of the key that was pressed.
    * @returns {void}
    */
    private onKeyPressed = (key: keycodes): void => {
        switch (key) {
            case keycodes.ArrowLeft:
            case keycodes.ArrowRight:
                if (!this.isVerticalSlider) {
                    let offset = (this.primaryDirection === Direction.left) ? this.stepOffset : -this.stepOffset;

                    offset = (key === keycodes.ArrowLeft) ? -offset : offset;
                    this.updateThumbOffset(this.thumbOffset + offset, true, true);
                }
                break;
            case keycodes.ArrowUp:
            case keycodes.ArrowDown:
                if (this.isVerticalSlider) {
                    let offset = (key === keycodes.ArrowUp) ? this.stepOffset : -this.stepOffset;

                    this.updateThumbOffset(this.thumbOffset + offset, true, true);
                    getEvent(event).preventDefault();
                }
                break;
            case keycodes.PageUp:
                {
                    let offset = 2 * this.stepOffset;
                    this.updateThumbOffset(this.thumbOffset + offset, true, true);
                }
                break;
            case keycodes.PageDown:
                {
                    let offset = -(2 * this.stepOffset);
                    this.updateThumbOffset(this.thumbOffset + offset, true, true);
                }
                break;
            case keycodes.Home:
                {
                    let min = parseInt(this.input.getAttribute('min'), 10) || 0;
                    this.updateThumbOffset(min, true, true);
                }
                break;
            case keycodes.End:
                {
                    let step = parseInt(this.input.getAttribute('step'), 10);
                    let max = this.thumbRange + step;
                    this.updateThumbOffset(max, true, true);
                }
                break;
        }
    }

    // ---------------------------------------------------------------------------------------------
    // Event listeners section
    // ---------------------------------------------------------------------------------------------

    /**
    * @name - onKeyDown
    * @description - The mock slider thumb's keydown event listener.
    *                This method is just an event listener that wraps the onKeyPressed method.
    * @private
    * @param {KeyboardEvent} event - The KeyboardEvent.
    * @returns {void}
    */
    private onKeyDown = (event: KeyboardEvent): void => {
        this.onKeyPressed(getKeyCode(getEvent(event) as KeyboardEvent));
    }

    /**
    * @name - onMouseDown
    * @description - The slider's mousedown event listener.
    *                If the target is the mock slider's thumb we capture the mouse for thumb dragging by adding move/up handlers.
    *                If not we immediately move the thumb to the current mouse position.
    * @private
    * @param {MouseEvent} event - The MouseEvent.
    * @returns {void}
    */
    private onMouseDown = (event: MouseEvent): void => {
        event = getEvent(event) as MouseEvent;

        // Need to redo the dimensions setup in case anything has moved the slider.
        this.setupDimensions();

        // If the mousedown is on our thumb then capture the move/up so we can drag the thumb.
        if (getEventTargetOrSrcElement(event) === this.thumb) {
            addEvent(document, eventTypes.mousemove, this.onMouseMove);
            addEvent(document, eventTypes.mouseup, this.onMouseUp);
            return;
        }

        // Otherwise move the thumb to where the mousedown occurred
        this.moveThumbTo(event.clientX, event.clientY);
    }

    /**
    * @name - onMouseMove
    * @description - The slider's mousemove event listener.
    *                This listener just calls moveThumbTo() so thumb tracks the mouse movement.
    * @private
    * @param {MouseEvent} event - The MouseEvent.
    * @returns {void}
    */
    private onMouseMove = (event: MouseEvent): void => {
        event = getEvent(event) as MouseEvent;

        // Move the thumb to follow the mouse around...
        this.moveThumbTo(event.clientX, event.clientY);
    }

    /**
    * @name - onMouseUp
    * @description - The slider's mouseup event listener removes the move/up events to end mouse motion tracking.
    * @private
    * @param {MouseEvent} event - The MouseEvent.
    * @returns {void}
    */
    private onMouseUp = (event: MouseEvent): void => {
        // On mouseup we can remove the move/up handlers since we're done dragging the thumb around...
        removeEvent(document, eventTypes.mousemove, this.onMouseMove);
        removeEvent(document, eventTypes.mouseup, this.onMouseUp);
    }

    /**
    * @name - onWindowResized
    * @description - The window resize event listener.
    * @private
    * @param {UIEvent} event - The resize event.
    * @returns {void}
    */
    private onWindowResized = (event: UIEvent): void => {
        this.setupDimensions();
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Slider.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Slider,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
