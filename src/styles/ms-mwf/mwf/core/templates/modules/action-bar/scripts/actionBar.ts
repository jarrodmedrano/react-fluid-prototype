import { ObservableComponent } from 'observableComponent';
import {
    selectFirstElement,
    selectElements,
    addThrottledEvent,
    addEvent,
    removeEvent,
    eventTypes,
    getClientRect,
    hasClass
} from 'htmlExtensions';

/**
 * The action bar module
 * @class
 * @classdesc Allow overflow of the action bar to move into the overflow dropdown.
 */
export class ActionBar extends ObservableComponent {

    /**
     * @name - selector
     * @description - selector for the ActionBar module.
     * @static
     * @public
     * @type {string}
     */
    public static selector: string = '.m-action-bar';

    /**
     * @name - showOverflow
     * @description - show/hide the overflow dropdown.
     * @private
     * @type {boolean}
     */
    private showOverflow: boolean;

    /**
     * @name - overflow
     * @description - the overflow element.
     * @private
     * @type {HTMLElement}
     */
    private overflow: HTMLElement;

    /**
     * @name - overflowToggle
     * @description - the button to toggle hide/show for the overflow element.
     * @private
     * @type {HTMLElement}
     */
    private overflowToggle: HTMLElement;

    /**
     * @name - resizeThrottledEventHandler
     * @description - the throttler for window resize.
     * @private
     * @type {EventListener}
     */
    private resizeThrottledEventHandler: EventListener;

    /**
     * @name - barLinks
     * @description - a list of links on the bar.
     * @private
     * @type {HTMLElement[]}
     */
    private barLinks: HTMLElement[];

    /**
     * @name - overflowLinks
     * @description - a list of links originally in the bar and copied to the overflow.
     * @private
     * @type {HTMLElement[]}
     */
    private overflowLinks: HTMLElement[];

    /**
     * @name - overflowLinkIds
     * @description - a list of link ids from links originally in the bar and copied to the overflow.
     * @private
     * @type {number[]}
     */
    private overflowLinkIds: number[];

    /**
     * @name - barLinkIds
     * @description - a list of link ids from links on the bar.
     * @private
     * @type {number[]}
     */
    private barLinkIds: number[];

    /**
     * @name - staticOverflowLinks
     * @description - links always in the overflow.
     * @private
     * @type {HTMLElement[]}
     */
    private staticOverflowLinks: HTMLElement[];

    /**
     * @name - linksWidth
     * @description - width of links on the bar.
     * @private
     * @type {number[]}
     */
    private linksWidth: number[];

    /**
     * @name - overflowToggleWidth
     * @description - width of toggle button for opening the overflow.
     * @private
     * @type {number}
     */
    private overflowToggleWidth: number;

    /**
     * @name - width
     * @description - width of the ActionBar module.
     * @private
     * @type {number}
     */
    private width: number;

    /**
     * @name - totalLinksWidth
     * @description - width of all of the links on the bar.
     * @private
     * @type {number}
     */
    private totalLinksWidth: number;

    /**
     * @name - overflowClass
     * @description - the class for the overflow.
     * @private
     * @static
     * @type {string}
     */
    private static overflowClass = 'f-overflow';

    /**
     * @name - ariaHiddenAttribute
     * @description - the aria-hidden attribute
     * @private
     * @static
     * @type {string}
     */
    private static ariaHiddenAttribute = 'aria-hidden';

    /**
     * @name - ariaExpandedAttribute
     * @description - the aria-expanded attribute
     * @private
     * @static
     * @type {string}
     */
    private static ariaExpandedAttribute = 'aria-expanded';

    /**
     * @name - overflowSelector
     * @description - the overflow selector
     * @private
     * @static
     * @type {string}
     */
    private static overflowSelector = ActionBar.selector + ' > .f-overflow > ul';

    /**
     * @name - overflowLinkSelector
     * @description - the overflow link selector
     * @private
     * @static
     * @type {string}
     */
    private static overflowLinkSelector = ActionBar.overflowSelector + ' > li';

    /**
     * @name - overflowToggleSelector
     * @description - the overflow toggle button selector
     * @private
     * @static
     * @type {string}
     */
    private static overflowToggleSelector = ActionBar.selector + ' > .f-overflow > button';

    /**
     * @name - barLinkSelector
     * @description - the links on the bar selector
     * @private
     * @static
     * @type {string}
     */
    private static barLinkSelector = ActionBar.selector + ' > li';

    /**
     * @name - overflowAttribute
     * @description - the overflow attribute (boolean value)
     * @private
     * @static
     * @type {string}
     */
    private static overflowAttribute = 'data-overflow';

    /**
     * @name - overflowIdAttribute
     * @description - the overflow id attribute (number value)
     * @private
     * @static
     * @type {string}
     */
    private static overflowIdAttribute = 'data-overflow-id';

    /**
     * @constructor
     * @description - Constructor for the ActionBar module.
     * @public
     * @param {HTMLElement} element - the native element to attach the ActionBar behavior to.
     */
    constructor(element: HTMLElement) {
        super(element);

        if (!element) {
            return;
        }
        this.update();
    }

    /**
     * @name - update
     * @description - Updates the module if there is any change to its underlying DOM.
     * @protected
     * @returns {void}
     */
    protected update(): void {
        this.overflow = selectFirstElement(ActionBar.overflowSelector, this.element);
        this.overflowToggle = selectFirstElement(ActionBar.overflowToggleSelector, this.element);
        this.barLinks = this.getBarLinks();
        this.staticOverflowLinks = this.getStaticOverflowLinks();
        this.linksWidth = this.getLinksWidth();
        this.totalLinksWidth = this.getTotalLinksWidth();
        this.overflowToggleWidth = getClientRect(this.overflowToggle).width;
        this.showOverflow = (this.overflowToggle.hasAttribute(ActionBar.ariaHiddenAttribute)
            && this.overflowToggle.getAttribute(ActionBar.ariaHiddenAttribute)) ? true : false;
        this.duplicateLinksToOverflow();
        this.handleWindowResize();

        addEvent(this.overflowToggle, eventTypes.click, this.toggleOverflow);
        this.resizeThrottledEventHandler = addThrottledEvent(window, eventTypes.resize, this.handleWindowResize);
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
        removeEvent(this.overflowToggle, eventTypes.click, this.toggleOverflow);
        removeEvent(window, eventTypes.resize, this.resizeThrottledEventHandler);
    }

    /**
    * @name - duplicateLinksToOverflow
    * @description - duplicates links on the bar to the overflow
    * @private
    * @returns {void}
    */
    private duplicateLinksToOverflow(): void {
        let newListItem = document.createElement('li');
        let newList = document.createElement('ul');
        this.overflowLinks = [];
        this.setDataAttributes();

        for (let link of this.barLinks) {
            let duplicateLink = link.cloneNode(true) as HTMLElement;

            this.overflowLinks.push(duplicateLink);
            newList.appendChild(duplicateLink);
        }

        newListItem.appendChild(newList);
        this.ignoreNextDOMChange = true;
        this.overflow.insertBefore(newListItem, this.staticOverflowLinks[0]);
    }

    /**
    * @name - getStaticOverflowLinks
    * @description - returns the original links in the overflow
    * @private
    * @returns {HTMLElement[]}
    */
    private getStaticOverflowLinks(): HTMLElement[] {
        let staticOverflowLinks = selectElements(ActionBar.overflowLinkSelector, this.element);
        let cleanStaticOverflowLinks = [] as HTMLElement[];

        for (let link of staticOverflowLinks) {
            if (!hasClass(link, ActionBar.overflowClass)) {
                cleanStaticOverflowLinks.push(link);
            }
        }

        return cleanStaticOverflowLinks;
    }

    /**
    * @name - updateWidth
    * @description - updates the width of the module
    * @private
    * @returns {void}
    */
    private updateWidth(): void {
        this.width = getClientRect(this.overflowToggle).right - getClientRect(this.barLinks[0]).left;
    }

    /**
    * @name - getBarLinks
    * @description - returns an array of links on the bar
    * @private
    * @returns {HTMLElement[]}
    */
    private getBarLinks(): HTMLElement[] {
        let links = selectElements(ActionBar.barLinkSelector, this.element);
        let cleanLinks = [] as HTMLElement[];

        for (let link of links) {
            if (!hasClass(link, ActionBar.overflowClass)) {
                cleanLinks.push(link);
            }
        }

        return cleanLinks;
    }

    /**
    * @name - getLinksWidth
    * @description - returns an array containing the width for each link on the bar
    * @private
    * @returns {number[]}
    */
    private getLinksWidth(): number[] {
        let linksWidth = [] as number[];

        for (let link of this.barLinks) {
            if (!hasClass(link, ActionBar.overflowClass)) {
                linksWidth.push(getClientRect(link).width);
            }
        }

        return linksWidth;
    }

    /**
    * @name - getTotalLinksWidth
    * @description - returns the total width of all links on the bar
    * @private
    * @returns {number}
    */
    private getTotalLinksWidth(): number {
        let totalLinksWidth = 0;

        for (let width of this.linksWidth) {
            totalLinksWidth += width;
        }

        return totalLinksWidth;
    }

    /**
    * @name - toggleOverflow
    * @description - toggles show/hide the overflow
    * @private
    * @returns {void}
    */
    private toggleOverflow = (): void => {
        if (this.showOverflow) {
            this.overflow.setAttribute(ActionBar.ariaHiddenAttribute, 'true');
            this.overflowToggle.setAttribute(ActionBar.ariaExpandedAttribute, 'false');
            this.showOverflow = false;
        } else {
            this.overflow.setAttribute(ActionBar.ariaHiddenAttribute, 'false');
            this.overflowToggle.setAttribute(ActionBar.ariaExpandedAttribute, 'true');
            this.showOverflow = true;
        }
    }

    /**
    * @name - handleWindowResize
    * @description - updates on window resize
    * @private
    * @returns {void}
    */
    private handleWindowResize = (): void => {
        this.updateWidth();
        this.linksClipped();
    }

    /**
    * @name - linksClipped
    * @description - updates arrays for bar and overflow links containing ids
    * @private
    * @returns {void}
    */
    private linksClipped(): void {
        this.barLinkIds = [];
        this.overflowLinkIds = [];

        let linkIds = [] as number[];
        let linkCount = 0;
        let allowedWidth = this.width - this.overflowToggleWidth;
        let visibleLinkWidth = 0;

        for (let i = 0, linkLength = this.barLinks.length; i < linkLength; i++) {
            visibleLinkWidth += this.linksWidth[i];

            if (visibleLinkWidth < allowedWidth) {
                this.barLinkIds.push(i);
                linkCount++;
            } else {
                this.overflowLinkIds.push(i);
            }
        }

        this.toggleLinks();
    }

    /**
    * @name - setDataAttributes
    * @description - sets the data attributes for overflow and overflow-id
    * @private
    * @returns {void}
    */
    private setDataAttributes(): void {
        for (let i = 0, linksLength = this.barLinks.length; i < linksLength; i++) {
            this.barLinks[i].setAttribute(ActionBar.overflowIdAttribute, String(i));
            this.barLinks[i].setAttribute(ActionBar.overflowAttribute, 'false');
        }
    }

    /**
    * @name - showOverflowLink
    * @description - shows an overflow link
    * @private
    * @param {index} number
    * @returns {void}
    */
    private showOverflowLink(index: number): void {
        this.barLinks[index].setAttribute(ActionBar.overflowAttribute, 'true');
        this.overflowLinks[index].setAttribute(ActionBar.overflowAttribute, 'true');
    }

    /**
    * @name - hideOverflowLink
    * @description - hides an overflow link
    * @private
    * @param {index} number
    * @returns {void}
    */
    private hideOverflowLink(index: number): void {
        this.barLinks[index].setAttribute(ActionBar.overflowAttribute, 'false');
        this.overflowLinks[index].setAttribute(ActionBar.overflowAttribute, 'false');
    }

    /**
    * @name - toggleLinks
    * @description - updates data attributes for showing/hiding links
    * @private
    * @returns {void}
    */
    private toggleLinks(): void {
        for (let linkId of this.overflowLinkIds) {
            this.showOverflowLink(linkId);
        }

        for (let linkId of this.barLinkIds) {
            this.hideOverflowLink(linkId);
        }
    }
}