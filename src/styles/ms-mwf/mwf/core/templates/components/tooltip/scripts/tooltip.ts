/// <amd-module name="tooltip"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {
    addClass,
    addEvent,
    addThrottledEvent,
    css,
    eventTypes,
    getClientRect,
    getEvent,
    getScrollY,
    preventDefault,
    removeClass,
    removeEvent,
    SafeBrowserApis,
    selectFirstElement,
    setText
} from 'htmlExtensions';
import {apiDeprecated, getKeyCode} from 'utility';
import {keycodes} from 'keycodes';

/**
* @interface ISetPostition
* @description - The data contract interface for setting the position of the tooltip.
* @export
*/
export interface ISetPostition {
    left?: number;
    top?: number;
}
/**
* @class - Tooltip
* @classdesc - The Tooltip component
* @export
*/
export class Tooltip extends ObservableComponent {

    /**
     * @name - selector
     * @description - The tooltip component selector.
     * @static
     * @public
     * @type {string}
     */
    public static selector = '.c-tooltip';

    /**
     * @name - ariaHidden
     * @description - aria-hidden attribute name. Set to true/false to hide/show the Tooltip.
     * @static
     * @private
     * @type {string}
     */
    private static ariaHidden = 'aria-hidden';

    /**
     * @name - hiddenClass
     * @description - hidden class-name.
     * @static
     * @private
     * @type {string}
     */
    private static hiddenClass = 'x-hidden';

    /**
     * @name - timerDelay
     * @description - The delay (milliseconds) to wait on hover before showing the Tooltip.
     * @static
     * @private
     * @type {number}
     */
    private static timerDelay = 800;

    /**
     * @name - controller
     * @description - The element the tooltip is associated with.
     * @private
     * @type {HTMLElement}
     */
    private controller: HTMLElement;

    /**
     * @name - isVisible
     * @description - Flag indicating whether or not the Tooltip is currently visible.
     * @private
     * @type {boolean}
     */
    private isVisible: boolean = false;

    /**
     * @name - tooltipXPosition
     * @description - The x position to place the Tooltip.
     * @private
     * @type {number}
     */
    private tooltipXPosition: number;

    /**
     * @name - tooltipYPosition
     * @description - The y position to place the Tooltip.
     * @private
     * @type {number}
     */
    private tooltipYPosition: number;

    /**
     * @name - timer
     * @description - The timer used to delay the showing of the tooltip.
     * @private
     * @type {number}
     */
    private timer = 0;

    /**
     * @name - hookFocus
     * @description - This is a hook for changing state of element to focus.
     * @static
     * @private
     * @type {string}
     */
    private static hookFocus = 'hook-focus';

    /**
     * @name - hoverHover
     * @description - This is a hook for changing state of element to hover.
     * @static
     * @private
     * @type {string}
     */
    private static hookHover = 'hook-hover';

    /**
     * @name - scrollYOnShow
     * @description - Store scrollY when show is called from mouse event
     * @private
     * @type {number}
     */
    private scrollYOnShow: number;

    /**
     * @name - animationFrameRequested
     * @description - Track if a animationFrameRequest is in process
     * @private
     * @type {boolean}
     */
    private animationFrameRequested: boolean;

    /**
     * @name - exposeToScreenReaders
     * @description - Describes whether the tooltip should  be exposed to screen-readers when shown visually.
     *               There are certain cases where this content shouldn't be exposed to screen-readers,
     *               such as when it contains content that is redundant to screen-readers but not to
     *               keyboard/mouse users.
     * @private
     * @type {boolean}
     */
    private exposeToScreenReaders = true;

    /**
     * @name - ariaDescribedByAttribute
     * @description - the aria attribute to that associates elements with the tooltip
     *
     * @public
     * @static
     * @type {string}
     */
    public static ariaDescribedByAttribute = 'aria-describedby';

    /**
     * @name - dataDescribedByAttribute
     * @description - the data attribute to that associates elements with the tooltip
     *
     * @public
     * @static
     * @type {string}
     */
    public static dataDescribedByAttribute = 'data-f-describedby';

    /**
     * @name - hiddenFromScreenReadersClass
     * @description - The class to add when the tooltip is hidden from screen-readers
     *
     * @static
     * @private
     * @type {boolean}
     */
    private static hiddenFromScreenReadersClass = 'f-hidden-from-screen-readers';
    /**
     * @name - constructor
     * @description - Constructor for the Tooltip component.
     * @public
     * @param {HTMLElement} element - the native element to attach the Tooltip behavior to.
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
        const tooltipId = this.element.getAttribute('id');
        this.controller = selectFirstElement(`[${Tooltip.ariaDescribedByAttribute}="${tooltipId}"]`);

        if (!this.controller) {
            this.controller = selectFirstElement(`[${Tooltip.dataDescribedByAttribute}="${tooltipId}"]`);
            // If we get the controller via the data-f-describedby attribute,
            // we are deliberately not associating the tooltip with aria attributes
            // so we should not expose the tooltip to screen readers.
            this.exposeToScreenReaders = !!this.controller ? false : true;
        }

        this.element.setAttribute(Tooltip.ariaHidden, 'true');

        if (!this.exposeToScreenReaders) {
            addClass(this.element, Tooltip.hiddenClass);
            addClass(this.element, Tooltip.hiddenFromScreenReadersClass);
        }

        if (!!this.controller) {
            addEvent(this.controller, eventTypes.mouseover, this.onMouseOver);
            addEvent(this.controller, eventTypes.focus, this.onFocus);
            addEvent(window, eventTypes.scroll, this.onScroll);
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
        removeEvent(this.controller, eventTypes.mouseover, this.onMouseOver);
        removeEvent(this.controller, eventTypes.mouseout, this.onMouseOut);
        removeEvent(this.controller, eventTypes.focus, this.onFocus);
        removeEvent(this.controller, eventTypes.blur, this.onBlur);
        removeEvent(window, eventTypes.scroll, this.onScroll);

        // Reset non static members
        this.controller = null;
        this.isVisible = false;
        this.tooltipXPosition = 0;
        this.tooltipYPosition = 0;

        // Clear our timer.
        if (this.timer > 0) {
            window.clearTimeout(this.timer);
            this.timer = 0;
        }
    }

    /**
      * @name - onFocus
      * @description - Handles the focus event
      * @private
      * @param {FocusEvent} event - The FocusEvent event.
      * @returns {void}
      */
    private onFocus = (event: FocusEvent): void => {
        event = getEvent(event) as FocusEvent;

        if (event && event.type !== 'mouseover') {
            this.actOnFocus();
        }
    }

    /**
      * @name - actOnFocus
      * @description - Handles non-event based focus logic
      * @private
      * @returns {void}
      */
    private actOnFocus(): void {
        removeClass(this.element, Tooltip.hookHover);
        addClass(this.element, Tooltip.hookFocus);
        let clientRect = getClientRect(this.controller);
        this.tooltipXPosition = clientRect.left;
        this.tooltipYPosition = clientRect.bottom;

        this.show();
        addEvent(this.controller, eventTypes.blur, this.onBlur);
        addEvent(this.controller, eventTypes.keydown, this.handleKeydownWhenFocused);
        removeEvent(this.controller, eventTypes.focus, this.onFocus);
    }

    /**
      * @name - handleKeydownWhenFocused
      * @description - Handles keydown event when tooltip is displayed via keyboard focus
      * @private
      * @param {KeyboardEvent} - event: the event object
      * @returns {void}
      */
    private handleKeydownWhenFocused = (event: KeyboardEvent): void => {
        if (!this.isVisible) {
            return;
        }

        event = getEvent(event) as KeyboardEvent;
        let keyCode = getKeyCode(event);

        switch (keyCode) {
            case keycodes.Escape:
                this.hide();
                break;
            case keycodes.ArrowUp:
            case keycodes.ArrowDown:
                preventDefault(event);
                break;
        }
    }

    /**
      * @name - onBlur
      * @description - Handles the blur event
      * @private
      * @returns {void}
      */
    private onBlur = (): void => {
        this.hide();
        addEvent(this.controller, eventTypes.focus, this.onFocus);
        removeEvent(this.controller, eventTypes.blur, this.onBlur);
        removeEvent(this.controller, eventTypes.keydown, this.handleKeydownWhenFocused);
    }

    /**
     * @name - onMouseOver
     * @description - Handles the mouseover event.
     * @param {MouseEvent} - event: the event object
     * @private
     * @returns {void}
     */
    private onMouseOver = (event: MouseEvent): void => {
        if (this.isVisible) {
            return;
        }

        event = getEvent(event) as MouseEvent;
        this.tooltipXPosition = event.clientX;
        this.tooltipYPosition = event.clientY;
        this.actOnMouseOver();
    }

    /**
     * @name - actOnMouseOver
     * @description - Handles non-event based mouseOver logic
     * @private
     * @returns {void}
     */
    private actOnMouseOver(): void {
        removeClass(this.element, Tooltip.hookFocus);
        addClass(this.element, Tooltip.hookHover);

        this.timer = window.setTimeout(this.showForMouse, Tooltip.timerDelay);

        addEvent(this.controller, eventTypes.mouseout, this.onMouseOut);
    }

    /**
     * @name - onMouseOut
     * @description - Handles the mouseout event.
     * @private
     * @returns {void}
     */
    private onMouseOut = (): void => {
        if (this.timer > 0) {
            window.clearTimeout(this.timer);
            this.timer = 0;
        }

        this.hide();

        removeEvent(this.controller, eventTypes.mouseout, this.onMouseOut);
        addEvent(this.controller, eventTypes.mouseover, this.onMouseOver);
    }

    /**
     * @name - showForMouse
     * @description - Show the tooltip when activated by a mouse
     * @private
     * @returns {void}
     */
    private showForMouse = (): void => {
        this.show();

        // Removing binding of mouseover because we're already over the tooltip
        removeEvent(this.controller, eventTypes.mouseover, this.onMouseOver);
    }

    /**
     * @name - onScroll
     * @description - Scroll event handler
     * @param - {UIEvent} - event: the event object
     * @private
     * @returns {void}
     */
    private onScroll = (event: UIEvent): void => {
        if (!this.isVisible || this.animationFrameRequested) {
            return;
        }

        this.animationFrameRequested = true;
        SafeBrowserApis.requestAnimationFrame.call(window, () => this.handleScroll());
    }

    /**
     * @name - handleScroll
     * @description - Handles business logic of scroll event
     * @private
     * @returns {void}
     */
    private handleScroll(): void {
        this.animationFrameRequested = false;
        let scrollY = getScrollY();
        let offset = this.scrollYOnShow - scrollY;
        this.setPosition({
            top: this.tooltipYPosition + offset
        });
    }
    /**
      * @name - show
      * @description - Show the tooltip, by calling the show callback function
      * @private
      * @returns {void}
      */
    private show(): void {
        this.isVisible = true;
        this.scrollYOnShow = getScrollY();

        if (this.exposeToScreenReaders) {
            this.element.setAttribute(Tooltip.ariaHidden, 'false');
        } else {
            removeClass(this.element, Tooltip.hiddenClass);
        }

        this.setPosition({
            left: this.tooltipXPosition,
            top: this.tooltipYPosition
        });
    }

    /**
     * @name - hide
     * @description - Hide the tooltip.
     * @private
     * @returns {void}
     */
    private hide(): void {
        if (!!this.element && this.isVisible) {
            this.isVisible = false;

            if (this.exposeToScreenReaders) {
                this.element.setAttribute(Tooltip.ariaHidden, 'true');
            } else {
                addClass(this.element, Tooltip.hiddenClass);
            }

            removeClass(this.element, Tooltip.hookHover);
            removeClass(this.element, Tooltip.hookFocus);
        }
    }

    /**
      * @name - setContent
      * @description - Set the content of the tooltip
      * @param {string} - content: The text-content to set the tooltip to
      * @public
      * @returns {void}
      */
    public setContent(content: string): void {
        if (!!this.element) {
            setText(this.element, content);
        }
    }

    /**
      * @name - setPosition
      * @description - Set the tooltip's position by setting the left and top styles
      * @param {ISetPostition} - position: the position values
      * @private
      * @returns {void}
      */
    private setPosition(position: ISetPostition) : void {
        if (!position) {
            return;
        }

        if (!!position.left) {
            css(this.element, 'left', position.left + 'px');
        }

        if (!!position.top) {
            css(this.element, 'top', position.top + 'px');
        }
    }

    /**
     * TODO: Remove this method as soon as we can verify partners are no longer calling it.
     */
    public static init(input: any): void {
        apiDeprecated('Tooltip.init() is deprecated, please use ComponentFactory.create() instead.');
        ComponentFactory.create([
            {
                component: Tooltip,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}