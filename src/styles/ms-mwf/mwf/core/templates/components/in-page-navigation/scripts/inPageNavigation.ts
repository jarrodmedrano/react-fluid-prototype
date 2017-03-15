/// <amd-module name="inPageNavigation"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import * as Utility from 'utility';
import * as StringExtensions from 'stringExtensions';
import * as HtmlExtensions from 'htmlExtensions';
import {ObservableComponent} from 'observableComponent';

export class InPageNavigation extends ObservableComponent {
    public static selector = '.c-in-page-navigation';
    private listItems: HTMLElement[];
    private elementWidth: number;
    private anchorPositions: Utility.INameToValueMap;
    private navLinks: HTMLElement[];
    private stickyOffsetLeft: number;
    private anchorElements: HTMLElement[];

    constructor(element: HTMLElement) {
        super(element);
        if (!element) {
            return;
        }
        this.update();
    }

    /**
     * Update the component state.
     *
     * @protected
     * @abstract
     */
    protected update(): void {
        this.navLinks = HtmlExtensions.selectElements('ul a', this.element);

        if (!this.navLinks || !this.navLinks.length) {
            return;
        }

        this.anchorElements = this.getAnchorElements();

        // set initial state based on view port.
        this.checkCollapse(this.element);
        this.setStickyClass();
        this.anchorPositions = this.setAnchorPositions(this.element);

        // todo - bruk - Add debouncing or throttling
        HtmlExtensions.addEvent(window, HtmlExtensions.eventTypes.resize, this.resizeHandler);
        HtmlExtensions.addEvent(window, HtmlExtensions.eventTypes.scroll, this.scrollHandler);

        // set an event handler if the navigation is a dropdown.
        if (HtmlExtensions.hasClass(this.element, 'f-dropdown')) {
            let dropdownLink = HtmlExtensions.selectFirstElement('a', this.element);
            HtmlExtensions.addEvent(dropdownLink, HtmlExtensions.eventTypes.click, this.clickHandler, true);
        }

        this.setNavLinkHandler(this.navLinks);
    }

    /**
     * Cleaning up the old state of the component.
     *
     * @protected
     * @abstract
     */
    protected teardown(): void {
        HtmlExtensions.removeEvent(window, HtmlExtensions.eventTypes.resize, this.resizeHandler);
        HtmlExtensions.removeEvent(window, HtmlExtensions.eventTypes.scroll, this.scrollHandler);

        if (HtmlExtensions.hasClass(this.element, 'f-dropdown')) {
            let dropdownLink = HtmlExtensions.selectFirstElement('a', this.element);
            HtmlExtensions.removeEvent(dropdownLink, HtmlExtensions.eventTypes.click, this.clickHandler, true);
        }

        for (let stickyLink of this.navLinks) {
            HtmlExtensions.removeEvent(stickyLink, HtmlExtensions.eventTypes.click, this.clickHandler, true);
        }
    }

    /** A resize event handler.
     */
    public resizeHandler = () => {
        this.checkCollapse(this.element);
        this.setWidth(this.element, true);
        this.setStickyClass();
        this.anchorPositions = this.setAnchorPositions(this.element);
    }

    /** Sets handler to each navigation.
     * @param  {HTMLElement[]} navLinks
     * @returns void
     */
    private setNavLinkHandler(navLinks: HTMLElement[]) : void {
        if (navLinks === null) {
            return;
        }

        for (let stickyLink of navLinks) {
            HtmlExtensions.addEvent(stickyLink, HtmlExtensions.eventTypes.click, this.clickHandler, true);
        }
    }

    /** Calculate all bookmark anchor positions.
     * @param  {HTMLElement} element
     * @returns Utility.INameToValueMap
     */
    private setAnchorPositions(element: HTMLElement) : Utility.INameToValueMap {
        if (!this.anchorElements) {
            return;
        }
        let documentTop = HtmlExtensions.getClientRect(document.body).top;
        let anchorPositions: Utility.INameToValueMap = {};
        for (let anchor of this.anchorElements) {
            if (anchor) {
                anchorPositions[anchor.id] = HtmlExtensions.getClientRect(anchor).top - documentTop;
            }
        }
        return anchorPositions;
    }

    /** Get anchor elements which are related to the nav links.
     * If a nav link has '#anchor-1' in href attibute,
     * in the anchorElements array it will reterive an HTMLElement that has 'anchor-1' id.
     * @returns HTMLElement[]
     */
    private getAnchorElements() : HTMLElement[] {
        let anchorElements : HTMLElement[] = [];
        let anchors = HtmlExtensions.selectElements('a', this.element);
        for (let anchor of anchors) {
            let href = StringExtensions.trim(anchor.getAttribute('href'));
            if (href != null && href.indexOf('#') === 0) {
                anchorElements.push(HtmlExtensions.selectFirstElement(href));
            }
        }
        return anchorElements;
    }

    /** Set a sticky class if appropriate.
     * @returns HTMLElement - returns the element with class added if appropriate.
     */
    private setStickyClass() : HTMLElement {
         let stickyOffsetTop = HtmlExtensions.getClientRect(this.element).top + this.getScrollY();
         if (stickyOffsetTop < 0) {
             HtmlExtensions.addClass(this.element, 'f-sticky');
             HtmlExtensions.css(this.element, 'marginLeft', this.stickyOffsetLeft);
         }

         return this.element;
    }

    /** Check if there is a need to collapse the navigation or not.
     * @param  {HTMLElement} element - navigation link container.
     * @returns HTMLElement - returns the navigation links container.
     */
    private checkCollapse (element: HTMLElement) : HTMLElement {
        if (!element) {
            return;
        }

        let parentElement = element.parentElement;

        if (!parentElement) {
            return;
        }

        let allChildren = parentElement.children;
        let listItems = HtmlExtensions.selectElements('li', element);
        let elementWidth = HtmlExtensions.getClientRect(parentElement).width;
        let lastItemLoc = 0;
        let dropDownClass = 'f-dropdown';
        let verticalClass = 'f-vertical';

        if (!HtmlExtensions.hasClass(element, dropDownClass) && !HtmlExtensions.hasClass(element, verticalClass)) {
            // todo - bruk - this may need to be updated for RTL market.
            lastItemLoc = HtmlExtensions.getClientRect(listItems[listItems.length - 1]).right;
        } else if (HtmlExtensions.hasClass(element, dropDownClass) && !HtmlExtensions.hasClass(element, verticalClass)) {
            for (let childIndex = 0, childrenLength = allChildren.length; childIndex < childrenLength - 1; childIndex++) {
                listItems = HtmlExtensions.selectElements('li', allChildren[childIndex] as HTMLElement);
                if (listItems && listItems.length > 0 && !HtmlExtensions.hasClass(allChildren[childIndex] as HTMLElement, dropDownClass)) {
                    lastItemLoc = HtmlExtensions.getClientRect(listItems[listItems.length - 1]).right;
                }
            }
        }
        if (HtmlExtensions.hasClass(element, 'f-vertical')) {
            // todo - bruk - remove the hard coded 100.
            if (Utility.getWindowWidth() < 100 + elementWidth) {
                return this.convertMenu(element, 'dropdown');
            } else {
                return this.convertMenu(element);
            }
        } else {
            if (lastItemLoc > elementWidth || elementWidth === 0) {
                return this.convertMenu(element, 'dropdown');
            } else {
                return this.convertMenu(element);
            }
        }
    }

    /** Convert navigation links to vertical,
     * @param  {HTMLElement} element
     * @param  {string} format
     * @returns HTMLElement
     */
    private convertMenu(element: HTMLElement, format: string = null) : HTMLElement {
        let dropDownClass = 'f-dropdown';
        let hideClass = 'f-hide';
        if (format === 'dropdown') {
            if (HtmlExtensions.hasClass(element, dropDownClass)) {
                if (HtmlExtensions.hasClass(element, hideClass)) {
                    HtmlExtensions.removeClass(element, hideClass);
                }
            } else if (!HtmlExtensions.hasClass(element, hideClass)) {
                    HtmlExtensions.addClass(element, hideClass);
            }
        } else {
            if (!HtmlExtensions.hasClass(element, dropDownClass)) {
                if (HtmlExtensions.hasClass(element, hideClass)) {
                    HtmlExtensions.removeClass(element, hideClass);
                }
            } else if (!HtmlExtensions.hasClass(element, hideClass)) {
                    HtmlExtensions.addClass(element, hideClass);
            }
        }

        return element;
    }

    /** Set width based on the current state of the navigation elements.
     * @param  {HTMLElement} element - navigation elements container.
     * @param  {boolean=false} resize - a flag to check either this called because of a resize event.
     * @returns HTMLElement - an HTML element with proper width and margin.
     */
    private setWidth(element: HTMLElement, resize: boolean = false) : HTMLElement {
        let parentElement = element.parentElement;
        let stickyClass = 'f-sticky';
        let verticalClass = 'f-vertical';
        let inPageNavigationSelector = '[data-js-in-page-navigation-wrapper]';
        let stickElementList = HtmlExtensions.selectFirstElement('ul', element);
        let isSticky = HtmlExtensions.hasClass(element, stickyClass);
        let scrollY = this.getScrollY();
        let stickyOffsetTop = HtmlExtensions.getClientRect(parentElement).top + scrollY;
        this.stickyOffsetLeft = HtmlExtensions.getClientRect(parentElement).left;
        this.elementWidth = HtmlExtensions.getClientRect(parentElement).width;
        let inpageWrapper = HtmlExtensions.selectElements(inPageNavigationSelector);

        if (resize === true && HtmlExtensions.hasClass(element, stickyClass)) {
            stickElementList.style.width = this.elementWidth + 'px';
            stickElementList.style.marginLeft = this.stickyOffsetLeft + 'px';
        }

        if (inpageWrapper.length > 0) {
            if (stickyOffsetTop < scrollY) {
                if (!HtmlExtensions.hasClass(element, stickyClass)) {
                    HtmlExtensions.addClass(element, stickyClass);
                    stickElementList.style.width = this.elementWidth + 'px';
                    stickElementList.style.marginLeft = this.stickyOffsetLeft + 'px';
                }
            } else if (isSticky !== false) {
                HtmlExtensions.removeClass(element, stickyClass);
                HtmlExtensions.css(stickElementList, 'margin-left', '');
                HtmlExtensions.css(stickElementList, 'width', '');
            }
        }

        return element;
    }

    /** Change the active state to the current link.
     * @param  {HTMLElement} target - the target element that needs to have active state.
     * @returns HTMLElement
     */
    private updateLinks(target: HTMLElement): HTMLElement {
        if (!this.element || !this.navLinks || this.navLinks.length === 0) {
            return;
        }

        for (let navLink of this.navLinks) {
            navLink.blur();
            HtmlExtensions.removeClass(navLink, 'f-active');
        }
        HtmlExtensions.addClass(target, 'f-active');
        if (HtmlExtensions.hasClass(this.element, 'f-dropdown')) {
            var activeItem = HtmlExtensions.selectFirstElement('a', this.element);
            activeItem.setAttribute('href', target.getAttribute('href'));
            activeItem.innerHTML = target.innerHTML;
        }

        return this.element;
    }

    /** Check the visibility of the bookmark link. If it's active region update the related nav link.
     * @param  {HTMLElement} element - nav link container.
     * @returns void
     */
    private updateNavLinks(element: HTMLElement) : void {
        if (!element) {
            return;
        }

        let anchorElements = this.getAnchorElements();
        let navWrapper = HtmlExtensions.selectFirstElement('[data-js-in-page-navigation-wrapper]');

        if (navWrapper && anchorElements && anchorElements.length) {
            navWrapper.style.top = element.offsetHeight + 'px';
            for (var anchorLength = anchorElements.length - 1; anchorLength >= 0; anchorLength--) {
                // todo - bruk - follow up with DI folks how they came up with this 50.
                if (anchorElements[anchorLength].getBoundingClientRect().top <= 50) {
                    this.updateLinks(HtmlExtensions.selectElements('a', element)[anchorLength]);
                    break;
                }
            }
        }
    }

    /**
    * @name - getScrollY
    * @memberOf InPageNavigation
    * @description - Gets the scroll Y value in a x-browwser compatible way.
    * @private
    * @returns {number} - The scroll Y offset value.
    */
    private getScrollY(): number {
        return window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    }

    /** A window scroll event handler.
     * @param  {Event} event
     */
    private scrollHandler = (event: Event) => {
        let dropdownMenu = HtmlExtensions.selectFirstElement('ul', this.element);
        let visible = dropdownMenu.getAttribute('aria-hidden');

        this.updateNavLinks(this.element);

        if (!!visible) {
            dropdownMenu.setAttribute('aria-hidden', 'true');
        }

        this.setWidth(this.element);
    }

    /** A link click event handler.
     * @param  {Event} event
     */
    private clickHandler = (event: Event) => {
        var target = <HTMLElement>event.target || <HTMLElement>event.srcElement;
        var href = target.getAttribute('href');
        let hiddenClass = 'aria-hidden';

        if (!href || href.indexOf('#') < 0) {
            return;
        }

        if (HtmlExtensions.hasClass(target, 'f-dropdown-link')) {
            HtmlExtensions.preventDefault(event);
        }
        this.updateNavLinks(this.element);

        let dropdownMenu = HtmlExtensions.selectFirstElement('ul', this.element);
        let visible = dropdownMenu.getAttribute('aria-hidden') !== 'true';
        let navigationContainerHeightWithMargin = HtmlExtensions.getClientRect(this.element).height + 10;

        var anchor = href.split('#')[1];
        let hasNavigationWrapper = HtmlExtensions.selectElements('[data-js-in-page-navigation-wrapper]').length > 0 ? true : false;

        if (HtmlExtensions.hasClass(target, 'f-dropdown-link')) {
            if (!visible) {
                dropdownMenu.setAttribute(hiddenClass, 'false');
            } else {
                dropdownMenu.setAttribute(hiddenClass, 'true');
            }
        } else {
                if (!HtmlExtensions.hasClass(this.element, 'f-vertical')) {
                    window.scrollTo(0, this.anchorPositions[anchor] - (hasNavigationWrapper ? navigationContainerHeightWithMargin : 0));
                } else {
                    if (hasNavigationWrapper) {
                        window.scrollTo(0, this.anchorPositions[anchor] -
                                           (HtmlExtensions.hasClass(this.element, 'f-dropdown')
                                           ? navigationContainerHeightWithMargin : 0));
                    } else {
                        window.scrollTo(0, this.anchorPositions[anchor]);
                    }
            }

            this.updateLinks(target);
        }
    }
}