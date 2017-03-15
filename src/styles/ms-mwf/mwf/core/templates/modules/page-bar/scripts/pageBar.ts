/// <amd-module name='pageBar'/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {addClass, addThrottledEvent, eventTypes, getClientRect,
        removeClass, removeEvent, selectFirstElement} from 'htmlExtensions';
import {apiDeprecated} from 'utility';

/**
 * The Page Bar module allows certain content to remain in the viewport in a fixed position (sticky) at the top 
 * as the user scrolls down the page.  The content is a thin bar (hence 'Page Bar') that may contain something like
 * a page navigation, a 'buy now' button, etc.
 * There are two configurations: with or without a scroll target element.
 * 1)   The target element is an HTML element on the page.  When the user scrolls down the page so that element is above
 *      the viewport, the page bar pops into view.
 * 2)   If there is no target element, the page bar will pop into view once the user has scrolled down 800 pixels from
 *      the top.
 * 
 * @export
 * @class PageBar
 */
export class PageBar extends ObservableComponent {
    /**
     * The Page Bar CSS selector.
     * 
     * @static
     */
    public static selector = '.m-page-bar';

    /**
     * The class used to indicate the page bar should be shown.
     * 
     * @private
     */
    private showClass = 'f-show';

    /**
     * The page bar element.  It does not exist initially -- it will be built at runtime from a seed element
     * provided in the initial HTML DOM.
     * 
     * @private
     * @type {HTMLElement}
     */
    private pageBar: HTMLElement;

    /**
     * The scroll target element.  When the user scrolls down to the point where this element goes above the top of
     * the viewport, the page bar appears.
     * 
     * @private
     * @type {HTMLElement}
     */
    private scrollTarget: HTMLElement;

    /**
     * The scroll distance without target.
     * When there is no scroll target element, the page bar will appear after the user scrolls down 800 pixels.
     * 
     * @private
     * @type {number}
     */
    private scrollDistanceWithoutTarget = 800;

    /**
     * The event listener for the scroll throttle event
     * 
     * @private
     * @type {EventListener}
     */
    private scrollThrottledEventHandler: EventListener;

    /**
     * @description - Creates an instance of PageBar.
     * 
     * @param {HTMLElement} element - the seed element
     */
    constructor(public element: HTMLElement) {
        super(element);
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
        if (!this.element || !this.element.id) {
            return;
        }

        this.pageBar = this.element.cloneNode(true) as HTMLElement;
        if (!this.pageBar || !this.pageBar.id) {
            return;
        }

        // this.elementTarget being undefined is a legitimate scenario - do not abort if it is undefined
        this.scrollTarget = selectFirstElement('[data-js-page-bar-target="' + this.pageBar.id + '"]');

        this.element.removeAttribute('id');
        addClass(this.pageBar, 'f-sticky');
        removeClass(this.pageBar, 'f-hidden');

        document.body.appendChild(this.pageBar);
        this.scrollThrottledEventHandler = addThrottledEvent(window, eventTypes.scroll, this.togglePageBar);
    }

    /**
     * @name - teardown
     * @description - cleans up the component
     *
     * @protected
     * @returns {Void}
     */
    protected teardown(): void {
        removeEvent(window, eventTypes.scroll, this.scrollThrottledEventHandler);
    }

    /**
     * @name - togglePageBar
     * @description - Toggles the Page Bar.
     * 
     * @private
     * @returns {Void}
     */
    private togglePageBar = () => {
        let targetOffsetTop: number;
        if (this.scrollTarget) {
            targetOffsetTop = getClientRect(this.scrollTarget).bottom;
        } else {
            targetOffsetTop = getClientRect(document.body).top + this.scrollDistanceWithoutTarget;
        }

        targetOffsetTop <= 0
            ? addClass(this.pageBar, this.showClass)
            : removeClass(this.pageBar, this.showClass);
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('PageBar.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: PageBar,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
