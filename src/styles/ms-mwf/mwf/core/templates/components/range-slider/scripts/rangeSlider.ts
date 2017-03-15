/// <amd-module name="rangeSlider"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {Publisher, ISubscriber} from 'publisher';
import {
    addClass,
    addEvent,
    addEvents,
    Direction,
    eventTypes,
    getDirection,
    getEventTargetOrSrcElement,
    preventDefault,
    removeClass,
    removeEvent,
    removeEvents,
    SafeBrowserApis,
    selectElements
} from 'htmlExtensions';
import {getKeyCode} from 'utility';
import {keycodes} from 'keycodes';

/**
 * @interface IRangeSliderNotification
 * @description - The data contract interface used for RangeSlider notifications.
 * @export
 */
 export interface IRangeSliderNotification {
     minimum: number;
     maximum: number;
 }

/**
 * @interface IRangeSliderSubscriber
 * @description - The interface which RangeSlider notification subscribers must implement.
 * @export
 */
 export interface IRangeSliderSubscriber extends ISubscriber {
     onValueChanged(notification: IRangeSliderNotification): void;
 }

/**
 * @class RangeSlider component
 * @classdesc - The RangeSlider component
 * @export
 */
export class RangeSlider extends Publisher<IRangeSliderSubscriber> {
    /**
     * @name - selector
     * @description - The RangeSlider component selector.
     * @public
     * @static
     * @type {string}
     */
    public static selector = '.c-range-slider';

    /**
     * @name - minimumInput
     * @description - the min input element
     * @private
     * @type {HTMLElement}
     */
    private minimumInput: HTMLInputElement;

    /**
     * @name - maximumInput
     * @description - the max input element
     * @private
     * @type {HTMLElement}
     */
    private maximumInput: HTMLInputElement;

    /**
     * @name - minimumSlider
     * @description - the min slider element
     * @private
     * @type {HTMLElement}
     */
    private minimumSlider: HTMLElement;

    /**
     * @name - maximumSlider
     * @description - the max slider element
     * @private
     * @type {HTMLElement}
     */
    private maximumSlider: HTMLElement;

    /**
     * @name - selectedRangeIndicator
     * @description - the visual indicator for the currently selected range
     * @private
     * @type {HTMLElement}
     */
    private selectedRangeIndicator: HTMLElement;

    /**
     * @name - primaryDirection
     * @description - ltr / rtl direction
     * @private
     * @type {Direction}
     */
    private primaryDirection: Direction;

    /**
     * @name - offsetDirection
     * @description - The direction in which offsets are applied.
     * @private
     * @type {string}
     */
    private offsetDirection: string;

    /**
     * @name - activelyAdjustedSlider
     * @description - The element that is being activly adjusted by the mouse
     * @private
     * @type {HTMLElement}
     */
    private activelyAdjustedSlider: HTMLElement;

    /**
     * @name - animationFrameRequestInProgress
     * @description - tracks the state of animationFrame requests.
     * @private
     * @type {boolean}
     */
    private animationFrameRequestInProgress: boolean;

    /**
     * @name - mousedownReferenceLocation
     * @description - The x position of the mouse when mousedown occurs.
     * @private
     * @type {number}
     */
    private mousedownReferenceLocation: number;

    /**
     * @name - requestAnimationFrame
     * @description - Request animationFrame implementation
     * @private
     * @type {Function}
     */
    private requestAnimationFrame: Function;

    /**
     * @name - mousedownReferenceOffset
     * @description - the offset % of the slider when when mousedown occurs
     * @private
     * @type {string}
     */
    private mousedownReferenceOffset: string;

    /**
     * @name - minimum
     * @description - the minimum value of the range
     * @private
     * @type {number}
     */
    private minimum: number;

    /**
     * @name - maximum
     * @description - the maximum value of the range
     * @private
     * @type {number}
     */
    private maximum: number;

    /**
     * @name - slider
     * @description - Stores a reference to the dynamically created slider UI
     * @private
     * @type {HTMLElement}
     */
    private slider: HTMLElement;

    /**
     * @name - activlyAdjustingClassName
     * @description - Classname added to inputs when the corresponding slider is
     *                being updated with mouse.
     * @private
     * @static
     * @type {string}
     */
    private static activlyAdjustingClassName = 'f-adjusting';
    /**
     * @name - constructor
     * @description - Constructor for the RangeSlider component.
     * @public
     * @param {HTMLElement} element - the native element to attach the RangeSlider behavior to.
     */
    constructor(public element: HTMLElement) {
        super(element);
        this.requestAnimationFrame = SafeBrowserApis.requestAnimationFrame;
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

        const inputs = <HTMLInputElement[]>selectElements('input', this.element);

        // If we don't have two inputs, we should exit out because we can't set
        // a range with only one reference.
        if (inputs.length !== 2) { return; }

        this.minimumInput = inputs[0];
        this.maximumInput = inputs[1];

        this.minimum = parseInt(this.minimumInput.getAttribute('min'), 10) || 0;
        this.maximum = parseInt(this.maximumInput.getAttribute('max'), 10) || 100;

        this.createRangeSliderUI();
        this.primaryDirection = getDirection(this.element);

        this.offsetDirection = this.primaryDirection === Direction.left ? 'left' : 'right';

        this.updateRangeUI();

        addEvents([this.minimumInput, this.maximumInput], 'keydown', this.handleNumberInputChange);
        addEvents([this.minimumSlider, this.maximumSlider], 'keydown', this.handleSliderKeyboard);
        addEvents([this.minimumSlider, this.maximumSlider], 'mousedown', this.handleSliderMouseDown);
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
        removeEvents([this.minimumInput, this.maximumInput], 'keydown', this.handleNumberInputChange);
        removeEvents([this.minimumSlider, this.maximumSlider], 'keydown', this.handleSliderKeyboard);
        removeEvents([this.minimumSlider, this.maximumSlider], 'mousedown', this.handleSliderMouseDown);
    }

    /**
     * @name - publish
     * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
     *                This method will be called once for each registered subscriber.
     * @protected
     * @param {IRangeSliderSubscriber} subscriber - the subscriber to make the callback to.
     * @param {any} context - the publish context use to determine which interface callback to make.
     * @returns {void}
     */
    protected publish(subscriber: IRangeSliderSubscriber, context?: any): void {
        if (subscriber.onValueChanged) {
            subscriber.onValueChanged(context as IRangeSliderNotification);
        }
    }

    /**
     * @name - createSlider
     * @description - create a slider from a source input element
     *
     * @param {HTMLInputElement} input - the input to create the slider from
     * @private
     * @returns {HTMLElement}
     */
    private createSlider(input: HTMLInputElement): HTMLElement {
        let slider = document.createElement('div');
        slider.setAttribute('role', 'slider');
        slider.setAttribute('aria-valuemin', this.minimum.toString() || '0');
        slider.setAttribute('aria-valuemax', this.maximum.toString() || '100');
        slider.setAttribute('aria-valuenow', input.getAttribute('value') || '0');
        slider.setAttribute('tabindex', '0');

        return slider;
    }

     /**
      * @name - createRangeSliderUI
      * @description - create the range-slider non-input UI. This UI
      * is progressively enhanced from standard form inputs.
      *
      * @param {HTMLInputElement} input - the input to create the slider from
      * @private
      * @returns {void}
      */
     private createRangeSliderUI(): void {

         // Only create the slider on the first run through.
         if (!!this.slider) {
             return;
         }

         this.slider = document.createElement('div');
         let innerRange = document.createElement('div');
         this.minimumSlider = this.createSlider(this.minimumInput);
         this.maximumSlider = this.createSlider(this.maximumInput);
         this.selectedRangeIndicator = document.createElement('span');

         innerRange.appendChild(this.minimumSlider);
         innerRange.appendChild(this.maximumSlider);
         innerRange.appendChild(this.selectedRangeIndicator);

         // These elements are redundant to the inputs, so hide them from
         // screen readers.
         this.slider.setAttribute('aria-hidden', 'true');
         this.slider.appendChild(innerRange);
         this.element.appendChild(this.slider);

         return;
     }

     /**
      * @name - updateRangeUI
      * @description - updates the range visual UI
      *
      * @private
      * @returns {void}
      */
     private updateRangeUI(): void {
         const minValue = parseInt(this.minimumSlider.getAttribute('aria-valuenow'), 10);
         const maxValue = parseInt(this.maximumSlider.getAttribute('aria-valuenow'), 10);
         const minOffset = this.calculateOffset(minValue, this.maximum);
         const maxOffset = this.calculateOffset(maxValue, this.maximum);

         this.minimumSlider.style[<any>this.offsetDirection] = minOffset.toString().concat('%');
         this.maximumSlider.style[<any>this.offsetDirection] = maxOffset.toString().concat('%');
         this.selectedRangeIndicator.style[<any>this.offsetDirection] = minOffset.toString().concat('%');
         this.selectedRangeIndicator.style.width = (maxOffset - minOffset).toString().concat('%');

         this.initiatePublish({
             minimum: minValue,
             maximum: maxValue
         });
     }

     /**
      * @name - handleNumberInputChange
      * @description - handle changes to number inputs
      *
      * @private
      * @returns {void}
      */
     private handleNumberInputChange = (event: Event): void => {
         const target = <HTMLInputElement>getEventTargetOrSrcElement(event);
         const value = parseFloat(target.value);

         if (isNaN(value)) {
             preventDefault(event);
             return;
         }

         this.updateFromChangedElement(target, value);
     }

     /**
      * @name - updateFromChangedElement
      * @description - handle changes to number inputs
      *
      * @private
      * @returns {void}
      */
     private updateFromChangedElement = (element: HTMLElement, value: number): void => {
         if (element === this.minimumInput || element === this.minimumSlider) {
             const maxValue = parseFloat(this.maximumInput.getAttribute('value'));
             const minValue = this.minimum;

             if (isNaN(maxValue) || value > maxValue) {
                 this.syncInputAndSlider(this.minimumInput, this.minimumSlider, maxValue);
             } else if (value < minValue) {
                 this.syncInputAndSlider(this.minimumInput, this.minimumSlider, minValue);
             } else {
                 this.syncInputAndSlider(this.minimumInput, this.minimumSlider, value);
             }
         } else if (element === this.maximumInput || element === this.maximumSlider) {
             const maxValue = this.maximum;
             const minValue = parseFloat(this.minimumInput.getAttribute('value'));

             if (isNaN(minValue) || value < minValue) {
                 this.syncInputAndSlider(this.maximumInput, this.maximumSlider, minValue);
             } else if (value > maxValue) {
                 this.syncInputAndSlider(this.maximumInput, this.maximumSlider, maxValue);
             } else {
                 this.syncInputAndSlider(this.maximumInput, this.maximumSlider, value);
             }
         }

         this.updateRangeUI();
     }

     /**
      * @name - handleSliderKeyboard
      * @description - handle keyboard events for sliders
      *
      * @private
      * @returns {void}
      */
     private handleSliderKeyboard = (event: KeyboardEvent): void => {
         const target = getEventTargetOrSrcElement(<Event>event);
         const keyCode = getKeyCode(event);
         const value = parseFloat(target.getAttribute('aria-valuenow'));
         const adjustment = event.shiftKey ? 10 : 1;

         if (keyCode === (this.primaryDirection === Direction.left ? keycodes.ArrowRight : keycodes.ArrowLeft)) {
             this.updateFromChangedElement(target, value + adjustment);
         } else if (keyCode === (this.primaryDirection === Direction.left ? keycodes.ArrowLeft : keycodes.ArrowRight)) {
             this.updateFromChangedElement(target, value - adjustment);
         }
     }

     /**
      * @name - handleSliderMouseDown
      * @description - handle mousedown event for sliders
      *
      * @private
      * @returns {void}
      */
     private handleSliderMouseDown = (event: MouseEvent): void => {
         addEvent(window, eventTypes.mouseup, this.handleSliderMouseUp);
         addEvent(window, eventTypes.mousemove, this.handleSliderMouseMove);

         this.activelyAdjustedSlider = getEventTargetOrSrcElement(event);
         addClass(this.activelyAdjustedSlider === this.minimumSlider
             ? this.minimumInput : this.maximumInput,
             RangeSlider.activlyAdjustingClassName);
         this.mousedownReferenceLocation = event.pageX;
         this.mousedownReferenceOffset = this.activelyAdjustedSlider.style[<any>this.offsetDirection];
     }

     /**
      * @name - handleSliderMouseUp
      * @description - handle mouseup event for sliders
      *
      * @private
      * @returns {void}
      */
     private handleSliderMouseUp = (event: MouseEvent): void => {
         removeEvent(window, eventTypes.mouseup, this.handleSliderMouseUp);
         removeEvent(window, eventTypes.mousemove, this.handleSliderMouseMove);
         removeClass(this.activelyAdjustedSlider === this.minimumSlider
             ? this.minimumInput : this.maximumInput,
             RangeSlider.activlyAdjustingClassName);
         this.activelyAdjustedSlider = null;
         this.mousedownReferenceLocation = null;
         this.mousedownReferenceOffset = null;
     }

     /**
      * @name - handleSliderMouseMove
      * @description - handle mousemove event for sliders
      *
      * @private
      * @returns {void}
      */
     private handleSliderMouseMove = (event: MouseEvent): void => {
         if (this.animationFrameRequestInProgress) {
             return;
         }

         this.requestAnimationFrame.call(window, () => this.requestSliderHandleUpdate(event.pageX));
     }

     /**
      * @name - requestSliderHandleUpdate
      * @description - update the UI based on mousemove
      *
      * @param {number} mousePosition - the x-position of the mouse
      * @private
      * @returns {void}
      */
     private requestSliderHandleUpdate(mousePosition: number): void {
         this.animationFrameRequestInProgress = false;

         const mouseOffsetValue = mousePosition - this.mousedownReferenceLocation;
         const currentOffsetPercent = parseFloat(this.mousedownReferenceOffset);
         const offsetPercentAdjustment = mouseOffsetValue / this.element.clientWidth * 100;
         const newOffsetPercent = this.primaryDirection === Direction.left
            ? currentOffsetPercent + offsetPercentAdjustment
            : currentOffsetPercent - offsetPercentAdjustment;
         const newValue = Math.floor((newOffsetPercent / 100) * this.maximum);

         this.updateFromChangedElement(this.activelyAdjustedSlider, newValue);
     }

     /**
      * @name - calculateOffset
      * @description - calculate the offset of an input
      *
      * @param {number} value - the current value
      * @param {number} max - the max value
      * @private
      * @returns {number}
      */
     private calculateOffset(value: number, max: number): number {
         if (isNaN(value) || isNaN(max)) {
             return 0;
         }

         const percentage = (value / max) * 100;

         if (percentage < 0) {
             return 0;
         } else if (percentage > 100) {
             return 0;
         } else {
            return percentage;
         }
     }

     /**
      * @name - syncInputAndSlider
      * @description - updates the attributes of both the input and slider to a passed value
      *
      * @param {HTMLInputElement} input - the input element
      * @param {HTMLElement} slider - the slider element
      * @param {number} value - the value to sync elements to
      * @private
      * @returns {void}
      */
      private syncInputAndSlider(input: HTMLInputElement, slider: HTMLElement, value: number): void {
          if (isNaN(value)) {
              return;
          }

          const valueString = value.toString();
          input.setAttribute('value', valueString);
          input.value = valueString;
          slider.setAttribute('aria-valuenow', valueString);
      }
}