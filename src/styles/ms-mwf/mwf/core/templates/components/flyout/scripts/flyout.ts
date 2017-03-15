/// <amd-module name='flyout'/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {
    addEvent,
    addThrottledEvent,
    css,
    eventTypes,
    getClientRect,
    getOffsetParent,
    removeEvent,
    selectElementsT,
    selectFirstElement
} from 'htmlExtensions';
import {collidesWith} from 'viewportCollision';
import {isNullOrWhiteSpace} from 'stringExtensions';
import {apiDeprecated, getKeyCode} from 'utility';
import {keycodes} from 'keycodes';

/**
* Flyout Dismissal Mode enum
*/
const enum FlyoutDismissalMode {
    dismissible,
    notDismissible
}

/**
* Flyout Placement enum
*/
const enum FlyoutPlacement {
    bottom,
    top,
    left,
    right
}

/**
* Flyout gutter size in pixels
*/
const flyoutGutter = 8;

/**
 * @export
 * @class Flyout
 * @summary Contruct an instance of a Flyout component
 * @description
 * 
 * Horizontal Diagram:
 * 
 * +---------------------------------------------------------+
 * |                                                         |
 * | parent +--------------------------------------------+   |
 * |  left  |                                            |   |
 * +=======>|                   button.width             |   |
 * |        |            <========================>      |   |
 * |        |  button    +------------------------+      |   |
 * |        |   left     |                        |      |   |
 * +====================>|         button         |      |   |
 * |        |            |                        |      |   |
 * |        |            +------------------------+      |   |
 * |        |                                            |   |
 * |        | return +--------------------------------+  |   |
 * |        | value  |             flyout             |  |   |
 * |        +=======>|                                |  |   |
 * |        |        +--------------------------------+  |   |
 * |        |        <================================>  |   |
 * |        |                    flyout.width            |   |
 * |        | offset parent                              |   |
 * |        +--------------------------------------------+   |
 * |                                                         |
 * | window                                                  |
 * +---------------------------------------------------------+
 * 
 * 
 * Vertical Diagram:
 * 
 * +--------+---------------+--------------------------------------+
 * |        |               |                                      |
 * |        | parent.top    |                                      |
 * |        v               |                                      |
 * |  +---------------------|--------+---------------------------+ |
 * |  |                     |        |                           | |
 * |  |                     |        | return value              | |
 * |  |          button.top |        v                           | |
 * |  |                     |     +------------------+ +         | |
 * |  |                     |     |                  | |         | |
 * |  |                     v     |                  | |         | |
 * |  |        + +--------------+ |                  | |         | |
 * |  | button | |              | |                  | | flyout  | |
 * |  | height | |    button    | |      flyout      | | height  | |
 * |  |        | |              | |                  | |         | |
 * |  |        v +--------------+ |                  | |         | |
 * |  |                           |                  | |         | |
 * |  |                           |                  | |         | |
 * |  |                           +------------------+ v         | |
 * |  |                                                          | |
 * |  | offset parent                                            | |
 * |  +----------------------------------------------------------+ |
 * |                                                               |
 * | window                                                        |
 * +---------------------------------------------------------------+
 * 
 * 
 * # Explanation of placement algorithms:
 *      All references to offset parent, button, flyout, window/viewport, refer 
 *      to the two diagrams above
 *
 * The first step of the placement algorithms is to determine the offset parent of
 * flyout. The offset parent of the flyout is the ancestor of the flyout from which
 * the flyout's css position offsets from. In other words, setting the flyout's css
 * top property to 0 will align the top of the flyout with the top of its offset 
 * parent's border box. For most elements, the offset parent is the documentElement.
 * However, if the flyout has an ancestor with the css position property set to
 * something other than static, then the flyout's offset parent is that ancestor.
 * 
 * Currently, the algorithms coded below assume that the flyout and the flyout's
 * button have the same offset parent. This can be achieved by placeing the .c-flyout
 * element next to the [data-js-flyout] button.
 * 
 * To calculate the flyout's position, the algorithms use the browser's getBoundingClientRect API
 * (referred to as the ClientRect API henceforth). The ClientRect API returns
 * the position of the element relative to the viewport edge. However, as stated above,
 * CSS top and left properties position an element relative to its offset parent.
 * So the algorithms below use the flyout's (and assumed button's) offset parent's 
 * ClientRect to determine the button's position within the offset parent. Once the 
 * button's position within the offset parent is known, the algorithm can use the button's 
 * and flyout's width and height to position it appropriately around the button.
 * 
 * 
 * # Handling Scrolling
 * 
 * The algorithms below don't use scrollX or scrollY becauase the ClientRect API takes it into
 * account the scrolling of the viewport automatically and returns negative values if the
 * position is off the viewport. So if the offset parent is the documentElement and it is scrolled, 
 * it's left value will be negative
 * 
 * 
 * # Related Links
 * 
 *  * [Absolute Positioning Inside Relative Positioning](https://css-tricks.com/absolute-positioning-inside-relative-positioning/)
 *  * [Learn CSS Positioning in Ten Steps](http://www.barelyfitz.com/screencast/html-training/css/positioning/)
 *  * [JQuery source, CTRL+F for "offsetParent:"](http://code.jquery.com/jquery-3.1.1.js)
 *  * [Measuring Element Dimension and Location with CSSOM](https://msdn.microsoft.com/en-us/library/hh781509(v=vs.85).aspx)
 * 
 * @extends {ObservableComponent}
 */
export class Flyout extends ObservableComponent {
    public static selector = '.c-flyout';
    private static AriaHidden = 'aria-hidden';

    private bodyElement: HTMLBodyElement;
    private dismissalMode: FlyoutDismissalMode;
    private flyoutButtons: HTMLButtonElement[];
    private flyoutId: string;
    private openButton: HTMLButtonElement;
    private placement: FlyoutPlacement;
    private shown: boolean;
    private resizeThrottledEventHandler: EventListener;
    private offsetParent: HTMLElement;

    /**
    * Flyout constructor
    * @param element {HTMLElement} - The flyout element
    */
    constructor(public element: HTMLElement) {
        super(element);
        if (!element) {
            return;
        }

        this.bodyElement = selectFirstElement('body') as HTMLBodyElement;
        this.update();
    }

    /**
     * @name - update
     * @description - updates the component state
     *
     * @protected
     * @returns {Void}
     */
    protected update(): void {
        this.flyoutId = this.element.getAttribute('id');
        if (!this.flyoutId) {
            return;
        }

        this.openButton = selectFirstElement('[data-js-flyout="' + this.flyoutId + '"]') as HTMLButtonElement;
        if (!this.openButton) {
            return;
        }

        // initialze variables
        this.shown = false;
        let dismissibleAttribute = this.element.getAttribute('data-js-flyout-dismissible');
        this.dismissalMode = dismissibleAttribute === 'false' ? FlyoutDismissalMode.notDismissible : FlyoutDismissalMode.dismissible;
        let placementString = this.element.getAttribute('data-js-flyout-placement');
        switch (placementString) {
            case 'bottom':
                this.placement = FlyoutPlacement.bottom;
                break;
            case 'top':
                this.placement = FlyoutPlacement.top;
                break;
            case 'left':
                this.placement = FlyoutPlacement.left;
                break;
            default:
                this.placement = FlyoutPlacement.right;
        }

        // bind elements to events
        addEvent(this.openButton, eventTypes.click, this.toggleFlyout);
        addEvent(window, eventTypes.keydown, this.handleKeydownWhenFlyoutIsOpen);
        this.resizeThrottledEventHandler = addThrottledEvent(window, eventTypes.resize, () => {
            this.hide();
        });

        if (this.dismissalMode === FlyoutDismissalMode.notDismissible) {
            this.flyoutButtons = selectElementsT<HTMLButtonElement>('button', this.element);
            if (this.flyoutButtons.length > 0) {
                for (let button of this.flyoutButtons) {
                    addEvent(button, eventTypes.click, () => {
                        this.hide(true);
                    });
                }
            }
        }
    }

    /**
     * @name - teardown
     * @description - cleans up the component
     *
     * @protected
     * @returns {Void}
     */
    protected teardown(): void {
        removeEvent(this.openButton, eventTypes.click, this.toggleFlyout);
        removeEvent(window, eventTypes.keydown, this.handleKeydownWhenFlyoutIsOpen);
        removeEvent(window, eventTypes.resize, this.resizeThrottledEventHandler);

        if (this.dismissalMode === FlyoutDismissalMode.notDismissible && this.flyoutButtons.length > 0) {
            for (let button of this.flyoutButtons) {
                removeEvent(button, eventTypes.click, () => {
                    this.hide();
                });
            }
        }
    }

    /**
     * @name - toggleFlyout
     * @description - hides the flyout if it's currently shown, or shows it if it's currently hidden
     *
     * @private
     * @returns {Void}
     */
    private toggleFlyout = () => {
        this.shown ? this.hide(true) : this.show(true);
    }

    /**
     * @name - handleKeydownWhenFlyoutIsOpen
     * @description - Event handles the escape key -- hides the flyout if the flyout is shown
     *
     * @private
     * @returns {Void}
     */
    private handleKeydownWhenFlyoutIsOpen = (event: KeyboardEvent): void => {
        const keycode = getKeyCode(event);

        if (this.shown) {
            switch (keycode) {
                case keycodes.Escape: 
                    this.hide(true);
                break;
            }
        }
    }

    /**
     * @name - handleClickWhenFlyoutIsOpen
     * @description - Event handler for clicks when the flyout is open -- calls performActionsWhenFlyoutIsOpen which does the real work
     *
     * @private
     * @returns {Void}
     */
    private handleClickWhenFlyoutIsOpen = (event: MouseEvent) => {
        let target = event.target as HTMLElement || event.srcElement as HTMLElement;
        this.performActionsWhenFlyoutIsOpen(target);
    }

    /**
     * @name - performActionsWhenFlyoutIsOpen
     * @description - Hides the flyout if the click event occurred inside the flyout or the open button
     *
     * @private
     * @returns {Void}
     */
    private performActionsWhenFlyoutIsOpen = (target: HTMLElement) => {
        let parent = target.parentNode;
        if (this.element.contains(target) === false && target !== this.openButton && parent !== this.openButton) {
            this.hide(true);
        }
    }

    /**
     * @name - hide
     * @description - Hides the flyout
     * @param (boolean) setFocus - If true, set the focus on the openButton element (default is false)
     * 
     * @private
     * @returns {Void}
     */
    private hide = (setFocus: boolean = false) => {
        this.shown = false;
        this.element.setAttribute(Flyout.AriaHidden, 'true');
        if (this.dismissalMode === FlyoutDismissalMode.dismissible) {
            removeEvent(this.bodyElement, eventTypes.click, this.handleClickWhenFlyoutIsOpen);
        }
        if (setFocus) {
            this.openButton.focus();
        }
    }

    /**
     * @name - show
     * @description - Shows the flyout
     * @param (boolean) setFocus - If true, set the focus on the flyout element (default is false)
     * 
     * @private
     * @returns {Void}
     */
    private show = (setFocus: boolean = false) => {
        this.shown = true;
        this.element.setAttribute(Flyout.AriaHidden, 'false');

        this.offsetParent = getOffsetParent(this.element);
        if (this.placement === FlyoutPlacement.right) {
            this.placeRight();
        } else if (this.placement === FlyoutPlacement.top) {
            this.placeTop();
        } else if (this.placement === FlyoutPlacement.left) {
            this.placeLeft();
        } else if (this.placement === FlyoutPlacement.bottom) {
            this.placeBottom();
        }

        // make sure the selected flyout position is visible in the viewport -- if not, try another flyout position
        // TODO (Task 8643736:): read the object returned from collidesWith and use that to figure out which
        // side(s) to check first which is most likely to succeed, rather than always guessing placeLeft() first
        if (collidesWith(this.element) !== false) {
            this.placeLeft();
            if (collidesWith(this.element) !== false) {
                this.placeRight();
                if (collidesWith(this.element) !== false) {
                    this.placeBottom();
                    if (collidesWith(this.element) !== false) {
                        this.placeTop();
                        if (collidesWith(this.element) !== false) {
                            this.placeBottomFinal();
                            if (collidesWith(this.element) !== false) {
                                this.placeTopFinal();
                            }
                        }
                    }
                }
            }
        }

        if (this.dismissalMode === FlyoutDismissalMode.dismissible) {
            addEvent(this.bodyElement, eventTypes.click, this.handleClickWhenFlyoutIsOpen);
        }

        if (setFocus) {
            this.element.focus();
        }
    }

    /**
     * @name - placeTopFinal
     * @description - Places the flyout on in the top position (fallback when previous attempt failed)
     * 
     * @private
     * @returns {Void}
     */
    private placeTopFinal = () => {
        let parentRect = getClientRect(this.offsetParent) as ClientRect;
        let flyoutRect = getClientRect(this.element) as ClientRect;
        let buttonRect = getClientRect(this.openButton) as ClientRect;

        // Don't center the flyout in the final Top placement. Just align it with the button left
        let leftPosition = (buttonRect.left - parentRect.left);
        let topPosition = (buttonRect.top - parentRect.top) - flyoutRect.height - flyoutGutter;
        css(this.element, 'left', leftPosition + 'px');
        css(this.element, 'top', topPosition + 'px');
    }

    /**
     * @name - placeBottomFinal
     * @description - Places the flyout on in the bottom position (fallback when previous attempt failed)
     * 
     * @private
     * @returns {Void}
     */
    private placeBottomFinal = () => {
        let parentRect = getClientRect(this.offsetParent) as ClientRect;
        let flyoutRect = getClientRect(this.element) as ClientRect;
        let buttonRect = getClientRect(this.openButton) as ClientRect;

        // Don't center the flyout in the final bottom placement. Just align it with the button left pos
        let leftPosition = (buttonRect.left - parentRect.left);
        let topPosition = (buttonRect.top - parentRect.top) + buttonRect.height + flyoutGutter;
        css(this.element, 'left', leftPosition + 'px');
        css(this.element, 'top', topPosition + 'px');
    }

    /**
     * @name - placeBottom
     * @description - Places the flyout on in the bottom position
     *  
     * @private
     * @returns {Void}
     */
    private placeBottom = () => {
        let parentRect = getClientRect(this.offsetParent) as ClientRect;
        let flyoutRect = getClientRect(this.element) as ClientRect;
        let buttonRect = getClientRect(this.openButton) as ClientRect;

        let setBottomPlacement = () => {
            let leftPosition = this.calculateHorizontalCenter(parentRect, buttonRect, flyoutRect); 
            let topPosition = (buttonRect.top - parentRect.top) + buttonRect.height + flyoutGutter;
            css(this.element, 'left', leftPosition + 'px');
            css(this.element, 'top', topPosition + 'px');
        };

        // Recalculate bottom placement in case size of flyout changed with its new layout
        setBottomPlacement();
        flyoutRect = getClientRect(this.element) as ClientRect;
        setBottomPlacement();
    }

    /**
     * @name - placeLeft
     * @description - Places the flyout on in the left position
     * 
     * @private
     * @returns {Void}
     */
    private placeLeft = () => {
        let parentRect = getClientRect(this.offsetParent) as ClientRect;
        let flyoutRect = getClientRect(this.element) as ClientRect;
        let buttonRect = getClientRect(this.openButton) as ClientRect;

        let setLeftPlacement = () => {
            let leftPosition = (buttonRect.left - parentRect.left) - flyoutRect.width - flyoutGutter;
            let topPosition = this.calculateVerticalCenter(parentRect, buttonRect, flyoutRect);

            css(this.element, 'left', leftPosition + 'px');
            css(this.element, 'top', topPosition + 'px');
        };

        // Recalculate left placement in case size of flyout changed with its new layout
        setLeftPlacement();
        flyoutRect = getClientRect(this.element) as ClientRect;
        setLeftPlacement();
    }

    /**
     * @name - placeTop
     * @description - Places the flyout on in the top position
     * 
     * @private
     * @returns {Void}
     */
    private placeTop = () => {
        let parentRect = getClientRect(this.offsetParent) as ClientRect;
        let flyoutRect = getClientRect(this.element) as ClientRect;
        let buttonRect = getClientRect(this.openButton) as ClientRect;

        let setTopPlacement = () => {
            let leftPosition = this.calculateHorizontalCenter(parentRect, buttonRect, flyoutRect);
            let topPosition = (buttonRect.top - parentRect.top) - flyoutRect.height - flyoutGutter;

            css(this.element, 'left', leftPosition + 'px');
            css(this.element, 'top', topPosition + 'px');
        };

        // Recalculate top placement in case size of flyout changed with its new layout
        setTopPlacement();
        flyoutRect = getClientRect(this.element) as ClientRect;
        setTopPlacement();
    }

    /**
     * @name - placeRight
     * @description - Places the flyout on in the right position
     * 
     * @private
     * @returns {Void}
     */
    private placeRight = () => {
        let parentRect = getClientRect(this.offsetParent) as ClientRect;
        let flyoutRect = getClientRect(this.element) as ClientRect;
        let buttonRect = getClientRect(this.openButton) as ClientRect;

        let setRightPlacement = () => {
            let leftPosition = (buttonRect.left - parentRect.left) + buttonRect.width + flyoutGutter;
            let topPosition = this.calculateVerticalCenter(parentRect, buttonRect, flyoutRect);

            css(this.element, 'left', leftPosition + 'px');
            css(this.element, 'top', topPosition + 'px');
        };

        // Recalculate right placement in case size of flyout changed with its new layout
        setRightPlacement();
        flyoutRect = getClientRect(this.element) as ClientRect;
        setRightPlacement();
    }

    /**
     * @name - calculateHorizontalCenter
     * @description - Calculate left value of the flyout so it is horizontally centered with the button
     * @private
     * @param parentRect The bounding client rectangle of the flyout's offsetParent (should be relative to the browser window)
     * @param buttonRect The bounding client rectangle of the button (should be relative to the browser window)
     * @param flyoutRect The bounding client rectangle of the flyout (should be relative to the browser window)
     * @returns The value to apply to the left css property of the flyout to horizontally center it to the button
     */
    private calculateHorizontalCenter(parentRect: ClientRect, buttonRect: ClientRect, flyoutRect: ClientRect): number {
        return (buttonRect.left - parentRect.left) + buttonRect.width / 2 - flyoutRect.width / 2;
    }

    /**
     * @name - calculateVerticalCenter
     * @description - Calculate top value of the flyout so it is vertically centered with the button
     * @private
     * @param parentRect The bounding client rectangle of the flyout's offsetParent (should be relative to the browser window)
     * @param buttonRect The bounding client rectangle of the button (should be relative to the browser window)
     * @param flyoutRect The bounding client rectangle of the flyout (should be relative to the browser window)
     * @returns The value to apply to the top property of the flyout to vertically center it to the button
     */
    private calculateVerticalCenter(parentRect: ClientRect, buttonRect: ClientRect, flyoutRect: ClientRect): number {
        return (buttonRect.top - parentRect.top) + buttonRect.height / 2 - flyoutRect.height / 2;
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Flyout.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Flyout,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}