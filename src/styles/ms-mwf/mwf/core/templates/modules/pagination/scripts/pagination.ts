/// <amd-module name='pagination'/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {Publisher, ISubscriber} from 'publisher';
import {ComponentFactory} from 'componentFactory';
import {selectFirstElement, selectElements, eventTypes, addEvent, removeEvent,
        hasClass, addClass, removeClass, getEventTargetOrSrcElement} from 'htmlExtensions';
import {isNumber, apiDeprecated} from 'utility';

/**
* @interface IPaginationNotification
* @description - The data contract interface used for pagination notifications.
* @export
*/
export interface IPaginationNotification {
    page: number;
    priorPage: number;
    internal: boolean;
    userInitiated: boolean;
}

/**
* @interface IPaginationSubscriber
* @description - The interface which Pagination notification subscribers must implement.
* @export
*/
export interface IPaginationSubscriber extends ISubscriber {
    onPageChanged(notification: IPaginationNotification): void;
}

/**
* @class - Pagination
* @classdesc - The Pagination component
* @export
*/
export class Pagination extends Publisher<IPaginationSubscriber> {
    /**
    * @name - selector
    * @description - The pagination component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.m-pagination';

    /**
    * @name - pageClassSelector
    * @description - The page class.
    * @static
    * @private
    * @type {string}
    */
    private static pageClassSelector = 'li[data-label]';

    /**
    * @name - buttonsClassSelector
    * @description - The buttons class.
    * @static
    * @private
    * @type {string}
    */
    private static buttonsClassSelector = '.c-glyph';

    /**
    * @name - activeClass
    * @description - Active item class.
    * @static
    * @private
    * @type {string}
    */
    private static activeClass = 'f-active';

    /**
    * @name - activeClassSelector
    * @description - The active item class selector.
    * @static
    * @private
    * @type {string}
    */
    private static activeClassSelector = '.' + Pagination.activeClass;

    /**
    * @name - hideClass
    * @description - Hidden item class.
    * @static
    * @private
    * @type {string}
    */
    private static hideClass = 'f-hide';

    /**
    * @name - ariaLabel
    * @description - aria-label element attribute.
    * @static
    * @private
    * @type {string}
    */
    private static ariaLabel = 'aria-label';

    /**
    * @name - dataLabel
    * @description - data-label element attribute.
    * @static
    * @private
    * @type {string}
    */
    private static dataLabel = 'data-label';

    /**
    * @name - dataHref
    * @description - data-href element attribute.
    *                This attribute will hold the href value while the <a> is the current page.
    * @static
    * @private
    * @type {string}
    */
    private static dataHref = 'data-href';

    /**
    * @name - href
    * @description - href element attribute.
    *                This attribute will hold the href value while the <a> is not the current page.
    * @static
    * @private
    * @type {string}
    */
    private static href = 'href';

    /**
    * @name - activeItem
    * @description - The currently active item.
    * @private
    * @type {HTMLElement}
    */
    private activeItem: HTMLElement;

    /**
    * @name - previousButton
    * @description - The previous button.
    * @private
    * @type {HTMLElement}
    */
    private previousButton: HTMLElement;

    /**
    * @name - nextButton
    * @description - The next button.
    * @private
    * @type {HTMLElement}
    */
    private nextButton: HTMLElement;

    /**
    * @name - pages
    * @description - The list of page hyperlinks.
    * @private
    * @type {HTMLElement[]}
    */
    private pages: HTMLElement[];

    /**
    * @name - page
    * @description - The zero based current page, or -1 if no valid page has been set.
    * @private
    * @type {number}
    */
    private page = -1;

    /**
    * @name - constructor
    * @description - Constructor for the Pagination component.
    * @public
    * @param {HTMLElement} element - the native element to attach the Pagination behavior to.
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

        // Get the page elements
        this.pages = selectElements(Pagination.pageClassSelector, this.element) as HTMLElement[];

        // pagination behavior only makes sense if there are at least two pages
        if (this.pages.length < 2) {
            return;
        }

        let buttons = selectElements(Pagination.buttonsClassSelector, this.element);

        if (buttons.length !== 2) {
            return;
        }

        this.previousButton = buttons[0].parentElement;
        this.nextButton = buttons[1].parentElement;

        // Add click listener.
        addEvent(this.element, eventTypes.click, this.handleClickEvent);

        let activeItems = selectElements(Pagination.activeClassSelector, this.element);

        if (!activeItems || activeItems.length === 0) {
            activeItems = this.pages;
        }

        this.setActivePage(this.getPageFromElement(activeItems[0]), true, false);
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
        removeEvent(this.element, eventTypes.click, this.handleClickEvent);

        // Reset non static members.
        this.page = -1;
        this.pages = null;
        this.activeItem = null;
        this.previousButton = null;
        this.nextButton = null;
    }

    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {IPaginationSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IPaginationSubscriber, context?: any): void {
        if (subscriber.onPageChanged) {
            subscriber.onPageChanged(context as IPaginationNotification);
        }
    }

    /**
    * @name - getPage
    * @description - Gets the zero based page index of the active page.
    * @public
    * @returns {number} - The index of the current page, or -1.
    */
    public getPage(): number {
        return this.page;
    }

    /**
    * @name - setPage
    * @description - Sets the current page.
    * @public
    * @param {number} page - The zero based index of the desired page.
    * @returns {boolean} - True if the active page is successfully changed, otherwise false.
    */
    public setPage(page: number): boolean {
        return this.setActivePage(page, false, false);
    }

    /**
    * @name - handleClickEvent
    * @description - Handles the pagination click events and calls handleButtonClick or setActivePage which do the real work.
    * @private
    * @param {Event} event - The click event.
    * @returns {void}
    */
    private handleClickEvent = (event: Event): void => {
        let target = getEventTargetOrSrcElement(event);

        if (hasClass(target, 'c-glyph')) {
            this.handleButtonClick(target.parentElement);
        } else {
            this.setActivePage(this.getPageFromElement(target.parentElement), true, true);
        }
    }

    /**
    * @name - handleButtonClick
    * @description - Handles a click on the 'next' or 'previous' button.
    * @private
    * @param {HTMLElement} target - The clicked element.
    * @returns {void}
    */
    private handleButtonClick(target: HTMLElement): void {
        let isNext = target === this.nextButton;
        let isPrevious = target === this.previousButton;
        let page = this.getPage();

        if (!isNext && !isPrevious) {
            return;
        }

        this.setActivePage((page === -1) ? 0 : (isNext ? page + 1 : page - 1), true, true);
    }

    /**
    * @name - setActivePage
    * @description - Sets the specified page to be the active one.
    * @private
    * @param {number} page - The zero based index of the desired page.
    * @param {boolean} internal - The origin page change. 
    * @param {boolean} userInitiated - Whether or not the page change was user initiated.
    * @returns {boolean} - True if the active page is successfully changed, otherwise false.
    */
    private setActivePage(page: number, internal: boolean, userInitiated: boolean): boolean {
        let priorPage = this.getPage();

        if (!isNumber(page) || !this.pages ||
            !(page >= 0) || !(page < this.pages.length) ||
            (page === priorPage)) {
            return false;
        }

        if (!!this.activeItem) {
            // Step 1 - Deactivate the old active item
            // Take the active item and swap out its data label and href, and remove the active class.
            let activeLink = this.activeItem.firstElementChild;
            let ariaLabel = this.activeItem.getAttribute(Pagination.dataLabel);
            let href = activeLink.getAttribute(Pagination.dataHref);

            this.activeItem.setAttribute(Pagination.dataLabel, activeLink.getAttribute(Pagination.ariaLabel));
            activeLink.setAttribute(Pagination.dataLabel, ariaLabel);

            if (!!href) {
                activeLink.setAttribute(Pagination.href, href);
                activeLink.removeAttribute(Pagination.dataHref);
            }

            removeClass(this.activeItem, Pagination.activeClass);
        }

        // Step 2 - Prepare the new item
        // Create a new span, give it the aria label from the item's data label, and remove the click event handler
        let newActiveItem = this.pages[page];
        let activeLink = newActiveItem.firstElementChild;
        let ariaLabel = newActiveItem.getAttribute(Pagination.dataLabel);
        let href = activeLink.getAttribute(Pagination.href);

        newActiveItem.setAttribute(Pagination.dataLabel, activeLink.getAttribute(Pagination.ariaLabel));
        activeLink.setAttribute(Pagination.dataLabel, ariaLabel);

        if (!!href) {
            activeLink.setAttribute(Pagination.dataHref, href);

            // Remove the new active page's href after giving it a chance to navigate away if it wishes to do so.
            setTimeout(() => { activeLink.removeAttribute(Pagination.href); }, 0);
        }

        addClass(newActiveItem, Pagination.activeClass);

        this.activeItem = newActiveItem;
        this.page = page;

        this.updateButtons();

        // Step 4 - Call the consumer callback to let them know there's a new active item
        this.initiatePublish({ page: page, priorPage: priorPage, internal: internal, userinitiated: userInitiated });
        return true;
    }

    /**
    * @name - updateButtons
    * @description - Updates the previous and next buttons.
    * @private
    * @returns {void}
    */
    private updateButtons() {
        let activePage = this.getPage();

        if (activePage !== -1) {
            if (activePage === 0) {
                addClass(this.previousButton, Pagination.hideClass);
            } else {
                removeClass(this.previousButton, Pagination.hideClass);
            }

            if (activePage === this.pages.length - 1) {
                addClass(this.nextButton, Pagination.hideClass);
            } else {
                removeClass(this.nextButton, Pagination.hideClass);
            }
        }
    }

    /**
    * @name - getPageFromElement
    * @description - Gets the current page index from the specified page element.
    * @private
    * @param {HTMLElement} element - The element to get the page index for.
    * @returns {number} - The index of the current page, or -1.
    */
    private getPageFromElement(element: HTMLElement): number {
        return (!this.pages || !element) ? -1 : this.pages.indexOf(element);
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Pagination.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Pagination,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
