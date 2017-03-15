/// <amd-module name="uhfPaddles"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {addEvent, removeEvent, addClass, removeClass, eventTypes, selectFirstElement, nodeListToArray} from 'htmlExtensions';

/**
 * Paddles are the two caret buttons that are on either side of the category nav. When there are 
 * too many category nav menu items to show all of them, the paddles appear. Paddles act similarly 
 * to flippers, clicking a paddle will cause the navItems to slide horizontally, revealing more items.
 *
 * The paddles work by building a list of valid positions that the nav can be in. Clicking
 * a paddle causes the currentPosition to move to the next or previous valid position. 
 * 
 * @export
 * @class UhfPaddles
 */
export class UhfPaddles {

    /**
     * The ID of the category nav element
     * 
     * @public
     * @type {string}
     */
    public static categoryNavElementId = 'uhf-c-nav'; 

    /**
     * Indicates whether the header is in LTR
     * 
     * @private
     * @type {boolean}
     */
    private isLtr: boolean;

    /**
     * Paddle that points in the primary direction - left in LTR, right in RTL
     * 
     * @private
     * @type {HTMLElement}
     */
    private primaryPaddle: HTMLElement;

    /**
     * Paddle that points in the secondary direction - right in LTR, left in RTL
     * 
     * @private
     * @type {HTMLElement}
     */
    private secondaryPaddle: HTMLElement;

    /**
     * The entire category nav's HTML Element.
     * 
     * @private
     * @type {HTMLElement}
     */
    private categoryNav: HTMLElement;

    /**
     * The total width of the entire category nav menu, including all of its C1 menu elements.
     * For example the distance in LTR would be the distance from the left side of the first C1 
     * nav item to the right side of the last C1 nav item. Does not include logo, CTA, etc.      
     * 
     * @private
     * @type {number}
     */
    private navItemsWidth: number;

    /**
     * The first element in the Category Menu nav. (not the Logo)
     * 
     * @private
     * @type {HTMLElement}
     */
    private firstMenuItem: HTMLElement;

    /**
     * The css style property used to actually slide the nav. Can either be "marginLeft" or "marginRight"
     * 
     * @private
     * @type {string}
     */
    private slideMarginProperty: string;

    /**
     * List of the positions of each nav item in the category nav. 
     * 
     * @private
     * @type {number[]}
     */
    private navItemPositions: number[];

    /**
     * C1 Nav items that are partially hidden by the paddles will be disabled. These member
     * variables are used to track which elements are disabled in the primary direction.
     * 
     * @private
     * @type {HTMLElement[]}
     */
    private disabledPrimaryNavItems: HTMLElement[] = [];
    
    /**
     * C1 Nav items that are partially hidden by the paddles will be disabled. These member
     * variables are used to track which elements are disabled in the secondary direction.
     * 
     * @private
     * @type {HTMLElement[]}
     */
    private disabledSecondaryNavItems: HTMLElement[] = [];

    /**
     * Creates an instance of UhfPaddles.
     */
    constructor() {
        this.categoryNav = document.getElementById(UhfPaddles.categoryNavElementId);
        if (!this.categoryNav) {
            return;
        }

        this.isLtr = (<any>this.categoryNav).currentStyle // ie8
            ? (<any>this.categoryNav).currentStyle['direction'] === 'ltr'
            : getComputedStyle(this.categoryNav, null).direction === 'ltr';
        this.slideMarginProperty = this.isLtr ? 'marginLeft' : 'marginRight';

        // The primary paddle will float to the primary direction, Left in LTR, or Right in RTL.
        this.primaryPaddle = selectFirstElement('.js-cat-head .c-action-trigger.glyph-chevron-left');
        this.secondaryPaddle = selectFirstElement('.js-cat-head .c-action-trigger.glyph-chevron-right');
        this.firstMenuItem = <HTMLElement>this.categoryNav.children[0];
    }

    /**
     * Initializes the width of all the C1 nav items combined, and the position of each 
     * individual C1 nav item.
     * 
     * @private
     */
    private initializeNavItemsWidths(): void {
        let c1NavItems = this.categoryNav.children;

        this.navItemsWidth = 0;
        this.navItemPositions = [];
        for (let i = 0; i < c1NavItems.length; ++i) {
            this.navItemPositions.push(this.navItemsWidth);
            this.navItemsWidth += (<HTMLElement>c1NavItems[i]).offsetWidth;
        }
    }

    /**
     * Slide the categoryNav in the primary direction - in LTR, slide left
     * 
     * @private
     */
    private slidePrimary = (): void => {
        this.setCurrentSlidePosition(this.getNextValidPosition(true));
    }

    /**
     * Slide the categoryNav in the secondary direction - in LTR, slide right
     * 
     * @private
     */
    private slideSecondary = (): void => {
        this.setCurrentSlidePosition(this.getNextValidPosition(false));
    }

    /**
     * Slide the nav to the supplied position.
     * 
     * @private
     * @param {number} position - the relative position, in pixels, to slide the nav to.
     * This position is relative to the primary side of the category nav.
     */
    private setCurrentSlidePosition(position: number): void {
        if (position < 0) {
            position = 0;
        }
        (<any>this.firstMenuItem.style)[this.slideMarginProperty] = -position + 'px';
        this.updatePaddleDisplayStates(); 
        this.disablePartiallyHiddenNavItems();

        // If the categorynav scroll value gets set by the browser, it will make the 
        // C2's not open underneath their respective C1's, but instead somewhere offset
        // by that scroll amount. Here in the UHF, slide, don't scroll!
        this.categoryNav.scrollLeft = this.isLtr ? 0 : this.categoryNav.scrollWidth;
    }

    /**
     * Get the current slide position in px.
     * 
     * @private
     * @returns {number} (description)
     */
    private getCurrentSlidePosition(): number {
        let amountInPx = (<any>this.firstMenuItem.style)[this.slideMarginProperty];
        return amountInPx === '' ? 0 : -parseInt(amountInPx, 10);
    }

    /**
     * Show the supplied paddle
     * 
     * @private
     * @param {HTMLElement} paddle - the paddle to be shown
     */
    private show(paddle: HTMLElement): void {
        paddle.style.display = 'block';
    }

    /**
     * Hide the supplied paddle
     * 
     * @private
     * @param {HTMLElement} paddle - the paddle to be hidden
     */
    private hide(paddle: HTMLElement): void {
        paddle.style.display = 'none';
    }

    /**
     * Your paddle is showing
     * 
     * @private
     * @param {HTMLElement} paddle - the paddle you want to check to see if it's showing
     * @returns {boolean} whether or not it's showing
     */
    private isShowing(paddle: HTMLElement): boolean {
        return paddle.style.display !== 'none';
    }

    /**
     * Hide partially shown navItems. 
     * 
     * @private
     */
    private disablePartiallyHiddenNavItems() {
        let navItems = this.categoryNav.children,
            navWidth = this.categoryNav.offsetWidth,
            currentPosition = this.getCurrentSlidePosition();

        for (let i = 0; i < navItems.length; ++i) {
            let navItem = <HTMLElement>(<HTMLElement>navItems[i]).querySelector('button') || <HTMLElement>navItems[i];
            if (this.navItemPositions[i] < currentPosition) {
                addClass(navItem, 'f-hidden'); 
                this.disabledPrimaryNavItems[i] = <HTMLElement>navItems[i];
            } else if (this.navItemPositions[i] + (<HTMLElement>navItems[i]).offsetWidth > currentPosition + navWidth) {
                addClass(navItem, 'f-hidden');
                this.disabledSecondaryNavItems[i] = <HTMLElement>navItems[i];
            } else {
                removeClass(navItem, 'f-hidden');
                this.disabledPrimaryNavItems[i] = null;
                this.disabledSecondaryNavItems[i] = null;
            }
        }
    }

    /**
     * If the event is coming from a disabled navitem, slide the nav, and ignore the default behaviour.
     * Requires event.currentTarget to be a C1 navItem.

     * @private
     * @param {Event} event (description)
     */
    private handleSlideIfDisabled = (event: Event): void => {
        // both primary/secondary lists will always have the same number of items.
        for (let i = 0; i < this.categoryNav.children.length; ++i) {
            if (this.disabledPrimaryNavItems[i] === event.currentTarget) {
                this.slidePrimary();
                event.preventDefault();
            } else if (this.disabledSecondaryNavItems[i] === event.currentTarget) {
                this.slideSecondary();
                event.preventDefault();
            }
        }
    }

    /**
     * Event handler that will slide the nav to the navitem that the event was
     * fired from. Requires event.currentTarget to be a C1 navItem.
     * 
     * @param {KeyboardEvent} event - The event that was fired. 
     */
    private handleFromKeyboardSlideIfDisabled = (event: KeyboardEvent): void => {
        for (let i = 0; i < this.categoryNav.children.length; ++i) {
            if (this.disabledPrimaryNavItems[i] === event.currentTarget || this.disabledSecondaryNavItems[i] === event.currentTarget) {
                if (this.navItemPositions[i] > this.getMaxSlideAmount()) {
                    this.setCurrentSlidePosition(this.getMaxSlideAmount());
                } else {
                    this.setCurrentSlidePosition(this.navItemPositions[i]);
                }
            }
        }
    }

    /**
     * Update the display state of the paddles based on the current slide position.
     * 
     * @private
     */
    private updatePaddleDisplayStates(): void {
        // Add the width of both paddles. They take up space that could potentially be used by the nav, if they were gone.
        let categoryNavWidth = this.categoryNav.offsetWidth,
            totalPotentialNavWidth = categoryNavWidth + this.primaryPaddle.offsetWidth + this.secondaryPaddle.offsetWidth;

        // The nav items have enough room - hide paddles.
        if (totalPotentialNavWidth >= this.navItemsWidth) {
            this.hide(this.primaryPaddle);
            this.hide(this.secondaryPaddle);
        } else {
             // The nav items don't have enough room - show paddles.
            let slideAmount = this.getCurrentSlidePosition();

            if (slideAmount === 0) {
                // Items are all the way to the primary direction - all the way left, in LTR
                this.hide(this.primaryPaddle);
                this.show(this.secondaryPaddle);
            } else if (slideAmount >= this.getMaxSlideAmount()) {
                // Items are all the way to the secondary direction - all the way right, in LTR
                this.show(this.primaryPaddle);
                this.hide(this.secondaryPaddle);
            } else {
                // Items are somewhere in the middle
                this.show(this.primaryPaddle);
                this.show(this.secondaryPaddle);
            }
        }
    }

    /**
     * Get the maximum amount, in px, that the nav can slide.
     * This method assumes that if it's being called, at least one of the paddles is showing. 
     * 
     * @private
     * @returns {number} (description)
     */
    private getMaxSlideAmount(): number {
        let extraPaddleWidth =
            this.isShowing(this.primaryPaddle) && this.isShowing(this.secondaryPaddle)
                ? this.primaryPaddle.offsetWidth
                : 0,
            initialNavWidth = this.categoryNav.offsetWidth + extraPaddleWidth;
        return this.navItemsWidth - initialNavWidth;
    }

    /**
     * Handle width change by updating paddles, showing them if the nav doesn't have enough room,
     * and hiding them if the nav has enough room to show all of the nav items.
     * 
     * @private
     */
    public handleWidthChange(): void {
        // ensure slidePosition is still valid. Slide position will not change when the window size changes, 
        // but it can get into invalid state. Eg. The navItems can end in between the paddles.
        let currentPosition = this.getCurrentSlidePosition(),
            categoryNavWidth = this.categoryNav.offsetWidth,
            totalPotentialNavWidth = categoryNavWidth + this.primaryPaddle.offsetWidth + this.secondaryPaddle.offsetWidth;

        if (totalPotentialNavWidth > this.navItemsWidth) {
            this.setCurrentSlidePosition(0);
        } else if (this.navItemsWidth < (currentPosition + this.categoryNav.offsetWidth)) {
            this.setCurrentSlidePosition(Math.abs(this.categoryNav.offsetWidth - this.navItemsWidth));
        }

        this.updatePaddleDisplayStates();
        this.disablePartiallyHiddenNavItems();
    }

    /**
     * Get the next valid position for the nav to slide. 
     * This method follows The Price is Right rules - go as far as possible
     * without going over. That is, make the nav slide, without it overshooting
     * the last, disabled navItem that was shown.  
     * 
     * @private
     * @param {boolean} isSlidingPrimary (description)
     * @returns {number} (description)
     */
    private getNextValidPosition(isSlidingPrimary: boolean): number {
        let currentPosition = this.getCurrentSlidePosition(),
            categoryNavWidth = this.categoryNav.offsetWidth;

        if (isSlidingPrimary) {
            for (let i = 0; i < this.navItemPositions.length; ++i) {
                if (this.navItemPositions[i] > currentPosition) {
                    return Math.max(0, this.navItemPositions[i] - categoryNavWidth);
                }
            }
            return 0;
        } else {
            for (let i = 0; i < this.navItemPositions.length - 1; ++i) {
                if (this.navItemPositions[i + 1] > currentPosition + categoryNavWidth) {
                    return Math.min(this.getMaxSlideAmount(), this.navItemPositions[i]);
                }
            }
            return this.getMaxSlideAmount();
        }
    }
    
    /**
     * Handle when moving from mobile to desktop
     * 
     * @private
     */
    public handleMoveIntoDesktopViewport() {
        this.primaryPaddle.tabIndex = -1;
        this.secondaryPaddle.tabIndex = -1;

        this.initializeNavItemsWidths();
        this.updatePaddleDisplayStates();
        this.disablePartiallyHiddenNavItems();
        this.firstMenuItem.style.transition = 'margin .667s cubic-bezier(.16, 1, .29, .99)';

        addEvent(this.primaryPaddle, eventTypes.click, this.slidePrimary);
        addEvent(this.secondaryPaddle, eventTypes.click, this.slideSecondary);

        let navItems = nodeListToArray(this.categoryNav.children);
        addEvent(navItems, eventTypes.click, this.handleSlideIfDisabled);
        addEvent(navItems, eventTypes.focusin, this.handleFromKeyboardSlideIfDisabled);
    }

    /**
     * Handle when moving from desktop to mobile. Clean up anything set up or set during paddle behaviour.
     * That is any disabled elements, slide position, event handers, and anything that affected the DOM along
     * the way. 
     * 
     * @private
     */
    public handleMoveIntoMobileViewport() {
        this.hide(this.primaryPaddle);
        this.hide(this.secondaryPaddle);

        this.primaryPaddle.tabIndex = 0;
        this.secondaryPaddle.tabIndex = 0;

        this.firstMenuItem.style.transition = '';

        removeEvent(this.primaryPaddle, eventTypes.click, this.slidePrimary);
        removeEvent(this.secondaryPaddle, eventTypes.click, this.slideSecondary);

        let navItems = nodeListToArray(this.categoryNav.children);
        removeEvent(navItems, eventTypes.click, this.handleSlideIfDisabled);
        removeEvent(navItems, eventTypes.focusin, this.handleFromKeyboardSlideIfDisabled);

        for (let i = 0; i < navItems.length; ++i) {
            let navItem = navItems[i].querySelector('button') || navItems[i];
            removeClass(<HTMLElement>navItem, 'f-hidden');
            this.disabledPrimaryNavItems[i] = null;
            this.disabledSecondaryNavItems[i] = null;
        }

        // reset slide position. 
        (<any>this.firstMenuItem.style)[this.slideMarginProperty] = null;
    }
}