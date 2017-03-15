/// <amd-module name="navigationMenus"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {Viewports} from 'utility';
import {addClass, Direction, getDirection, selectElements, selectFirstElement, removeClass} from 'htmlExtensions';
import {keycodes} from 'keycodes';
import * as $ from 'jquery';

/**
 * UHF Nav Component
 * This class handles the behaviours for both the category and the global nav, or just the global nav alone.
 */
export class NavigationMenus {

    /**
     * Class selector - Selector for the entire Universal Header
     *
     * @static
     */
    public static uhfSelector : string = '.c-universal-header';


    /**
     * Id selector - Selector for the category nav
     *
     * @static
     */
    public static categoryNavSelector : string = '#uhf-c-nav';

    /**
     * Id selector - Selector for the global nav
     *
     * @static
     */
    public static globalNavSelector: string = '#uhf-g-nav';

    /**
     * Id selector - Selector for the language nav
     *
     * @static
     */
    public static languageNavSelector: string = '#uhf-l-nav';

    /**
     * Class selector - Selector for js-specific menu elements
     *
     * @static
     */
    public static menuSelector : string = '.js-nav-menu';

    /**
     * Class selector - Selector for mobile primary button. The mobile primary button is the
     * "back" button in ltr or the left-pointing caret next to the mobile title text.
     * @private
     * @static
     */
    private static mobilePrimaryButtonSelector: string = '.f-mobile-title .c-action-trigger.glyph-chevron-left';

    /**
     * Class selector - Selector for mobile secondary button. The mobile secondary button is the
     * "forward" button in ltr or the right-pointing caret next to the mobile title text.
     *
     * @private
     * @static
     */
    private static mobileSecondaryButtonSelector: string = '.f-mobile-title .c-action-trigger.glyph-chevron-right';

    /**
     * Class selector - Selector for the hamburger menu button.
     *
     * @private
     * @static
     */
    private static hamburgerMenuSelector: string = '.js-global-head .c-action-trigger.glyph-global-nav-button';

    /**
     * Class selector - Selector for mobile title text element.
     *
     * @private
     * @static
     */
    private static mobileTitleSelector: string = '.js-mobile-title';

    /**
     * Class selector - Selector for shopping cart.
     *
     * @private
     * @static
     */
    private static shoppingCartSelector: string = '.glyph-shopping-cart';

    /**
     * Html attribute - Selector for buttons that control the menu dropdowns and flyouts.
     *
     * @private
     * @static
     */
    private static activeButtonAriaAttr: string = 'aria-expanded';

    /**
     * Html attribute - WEDCS interaction type for buttons that control the menu dropdowns and flyouts.
     * When a menu or flyout is visible or open,  ms.interactiontype = 15
     * When a menu or flyout is hidden or closed, ms.interactiontype = 14
     * @private
     * @static
     */
    private static activeButtonInteractionType : string = 'ms.interactiontype';

    /**
     * Html attribute - Selector for menu dropdowns and flyouts.
     *
     * @private
     * @static
     */
    private static hiddenMenuAriaAttr: string = 'aria-hidden';

    /**
     * Html attribute - Class name that decorates an open container.
     *
     * @private
     * @static
     */
    private static openedClass: string = 'f-opened';

    /**
     * Html attribute - Class name that decorates a closed container.
     *
     * @private
     * @static
     */
    private static closedClass: string = 'f-closed';

    /**
     * Html attribute - Class name that decorates a menu as flipped. Flipping a
     * submenu causes it to open on the opposite side of its parent menu than normal.
     * For example, a flipped C3 in LTR will open on the Left side of its parent C2,
     * instead of the right side.
     *
     * @private
     * @static
     */
    private static flippedClass: string = 'f-flip';

    /**
     * True if the event was a tap. Used to prevent double-taps on some android devices.
     *
     * @private
     * @static
     */
    private static wasTapped: boolean = false;

    /**
     * Html attribute - Class name that decorates a highlighted menu.
     *
     * @private
     * @static
     */
    private static currentClass: string = 'f-current';

    /**
     * Cached selection of all menus within UHF. This excludes multi-column menus.
     *
     * @private
     * @static
     * @type {JQuery}
     * @memberOf NavigationMenus
     */
    private static $menus: JQuery;

    /**
     * Cached selection of all level-two  (both category and global) menus within UHF.
     * This excludes multi-column menus.
     *
     * @private
     * @static
     * @type {JQuery}
     * @memberOf NavigationMenus
     */
    private static $levelTwoMenus: JQuery;

    /**
     * Cached selection of all multi-column menus within UHF.
     *
     * @private
     * @static
     * @type {JQuery}
     * @memberOf NavigationMenus
     */
    private static $multiColumnMenus: JQuery;

    /**
     * Closes the menu(s) passed in.
     * @static
     * @param {JQuery} $menuElement - JQuery object that must match the {menuSelector} selector.
     * @param {boolean} [setFocus] - after the menu is closed, set focus on that menu item.
     * This can include zero to many elements.
     */
    public static closeMenu($menuElement: JQuery, setFocus? : boolean): void {
        var $menusToClose = $menuElement.filter(NavigationMenus.$menus);
        if ($menusToClose.length === 0) {
            return;
        }

        let $menuElemenButton = $menusToClose.children('button');

        // Menu visibility is determined by activeButtonAriaAttr and hiddenMenuAriaAttr values.
        // If both hiddenMenuAriaAttr == true AND activeButtonAriaAttr == false then the menu will be hidden
        // This is because the CSS sets the display to none when aria-expanded="false" and aria-hidden="true"
        // For our the UHF service we support WEDECS tags, when the menu or flyout is closed we set it to 14 otherwise 15
        $menuElemenButton.attr(NavigationMenus.activeButtonAriaAttr, 'false');
        $menusToClose.children('ul').attr(NavigationMenus.hiddenMenuAriaAttr, 'true');

        // WEDECS attributes are only output in markup for the UHF service
        if ($menuElemenButton.attr(NavigationMenus.activeButtonInteractionType) !== undefined) {
            $menuElemenButton.attr(NavigationMenus.activeButtonInteractionType, '14');
        }

        // Setting focus programmatically is useful for keyboard scenarios, where focus can be lost if a menu is closed
        if (setFocus) {
            $menuElemenButton.focus();
        }

        // Since menus will close when we resize the window, or click paddles etc, we can clear flips here.
        $(NavigationMenus.flippedClass, $menusToClose).removeClass(NavigationMenus.flippedClass);

        let marginProperty = getDirection() === Direction.left ? 'margin-left' : 'margin-right';
        $(' > ul', $menusToClose).css(marginProperty, '').height('');
        $menusToClose.closest('ul').height('');
    }

    /**
     * Opens the menu(s) passed in.
     * @static
     * @param {JQuery} $menuElement - JQuery object that must match the {menuSelector} selector.
     * This can include zero to many elements.
     */
    public static openMenu($menuElement: JQuery): void {
        var $menusToOpen = $menuElement.filter(NavigationMenus.$menus);
        if ($menusToOpen.length === 0) {
            return;
        }
        let $menuElemenButton = $menusToOpen.children('button');

        // Menu visibility is determined by activeButtonAriaAttr and hiddenMenuAriaAttr values.
        // If both hiddenMenuAriaAttr == true AND activeButtonAriaAttr == false then the menu will be hidden
        // This is because the CSS sets the display to none when aria-expanded="false" and aria-hidden="true"
        // For the UHF service we support WEDECS tags, when the menu or flyout is open we set the  it to 15 otherwise 14
        $menuElemenButton.attr(NavigationMenus.activeButtonAriaAttr, 'true');
        $menusToOpen.children('ul').attr(NavigationMenus.hiddenMenuAriaAttr, 'false');

        // WEDECS attributes are only output in markup for the UHF service
        if ($menuElemenButton.attr(NavigationMenus.activeButtonInteractionType) !== undefined) {
            $menuElemenButton.attr(NavigationMenus.activeButtonInteractionType, '15');
        }

        // Match the height if menuElement is an L2. Also, it is possible to have menus open past
        // the window width. Flip the L2 to the other side, if this is the case.
        let $subMenuContainer = $menusToOpen.find('ul').first(),
            menuRect = $subMenuContainer[0].getBoundingClientRect(),
            windowWidth = $(window).width(),
            direction = getDirection();

        if ($menusToOpen.is(NavigationMenus.$levelTwoMenus)) {
            let $menuContainer = $menusToOpen.parent('ul');

            // Custom heights need to be reset to measure the original heights.
            $menuContainer.height('');
            $subMenuContainer.height('');

            // Match the heights of the menu and the submenu.
            let menuContainerHeight = $menuContainer.height(),
                subMenuContainerHeight = $subMenuContainer.height();

            if (menuContainerHeight > subMenuContainerHeight) {
                $subMenuContainer.height(menuContainerHeight);
            } else if (menuContainerHeight < subMenuContainerHeight) {
                $menuContainer.height(subMenuContainerHeight);
            }

            // Ignore menus that are already flipped.
            var isOverflowing = (direction === Direction.left && menuRect.right > windowWidth)
                        || (direction === Direction.right && menuRect.left < 0);

            if ($subMenuContainer.hasClass(NavigationMenus.flippedClass)) {
                return;
            } else if (isOverflowing) {
                $menuContainer.find('ul').addClass(NavigationMenus.flippedClass);
            }

            // Menu is an L1 or C1, and we're not in mobile.
        } else if (!NavigationMenus.isMobile() && $menusToOpen.is(NavigationMenus.$menus.not(NavigationMenus.$levelTwoMenus))) {
            let dropdownWidth = $subMenuContainer[0].offsetWidth,
                shiftAmount = 0,
                shiftBuffer = 20,
                isMultiColumn = $subMenuContainer.hasClass('f-multi-column'); // pad the menu out from the edge of the window.

            // The L2 to open is a multi-col menu. It likely needs to be shifted.
            if (isMultiColumn && menuRect.right > windowWidth) {
                shiftAmount = menuRect.right - windowWidth + shiftBuffer;
            } else if (isMultiColumn && menuRect.left < 0) {
                shiftAmount = -menuRect.left + shiftBuffer;

            // The L2 to open is a normal dropdown menu. Multiply by two to account for the width of the L3s
            } else if (!isMultiColumn && (menuRect.left + dropdownWidth * 2 > windowWidth) && (menuRect.right - dropdownWidth * 2 < 0)) {
                shiftAmount = dropdownWidth - $menusToOpen[0].offsetWidth;
            }

            // shift the menu
            let marginProperty = direction === Direction.left ? 'marginLeft' : 'marginRight';
            $subMenuContainer[0].style[<any>marginProperty] = -shiftAmount + 'px';
        }
    }

    /**
     * Returns true if {$menuElement} is open. Expects a $menuElement.length to be 1
     *
     * @static
     * @param {JQuery} $menuElement - JQuery object that must match the {menuSelector} selector.
     * @returns {boolean} - true if the supplied menu is open
     */
    public static isOpen($menuElement: JQuery): boolean {
        return $menuElement.children('button').attr(NavigationMenus.activeButtonAriaAttr) === 'true';
    }

    /**
     * Event Handler that toggles the open/closed state of the menu that triggered the event.
     *
     * @static
     * @param {JQuery} $menuElement - JQuery object that must match the {menuSelector} selector.
     * @param {boolean} [setFocus] - after the menu is closed, set focus on that menu item.
     * {$event.target} must match the {menuSelector} selector.
     */
    public static toggleMenu($menuElement: JQuery, setFocus? : boolean) {
        if (NavigationMenus.isOpen($menuElement)) {
            // The open descendent menus need to be closed as well.
            var $menusToClose = $(NavigationMenus.menuSelector, $menuElement).add($menuElement);
            NavigationMenus.closeMenu($menusToClose, setFocus);
        } else {
            // The open ancestor menus of the opening menu should stay open
            NavigationMenus.closeAllOpenMenus(null, $menuElement.parents());
            NavigationMenus.openMenu($menuElement);
        }
    }

    /**
     * Determines if the click supplied event came from the keyboard.
     *
     * @static
     * @param {JQueryEventObject} $event - any JQuery event object, from any element.
     */
    public static wasClickFromKeyboard($event: JQueryEventObject) {
        return $event.keyCode === keycodes.Enter;
    }

    /**
     * Returns true if the viewport is currently in VP2 or less.
     *
     * @static
     * @returns {boolean} - true if the viewport is in VP2 or less.
     */
    public static isMobile(): boolean {
        return Viewports.getViewport() < Viewports.Names.vp3;
    }

    /**
     * Returns the original title for the global mobile menu
     *
     * @static
     * @returns {boolean} - the original title for the global mobile menu
     */
    public static getOriginalGlobalTitle() : string {
        return $(`${NavigationMenus.uhfSelector} ${NavigationMenus.mobileTitleSelector}`).data().globalTitle;
    }

    /**
     * Event handler that will close all menus if the event occurred outside the category or global nav.
     *
     * @static
     * @param {JQueryEventObject} $event - any JQuery event object, from any element.
     */
    public static closeIfBlurred($event: JQueryEventObject) {
        if (!$($event.target).parents().is(`${NavigationMenus.categoryNavSelector},
            ${NavigationMenus.globalNavSelector}, ${NavigationMenus.languageNavSelector}`)) {
                NavigationMenus.closeAllOpenMenus();
        }
    }

    /**
     * Event handler that will close menus when the escape key is pressed. If event occurred inside
     * an open nav menu, it is closed. If event occurred on an open nav menu's button, that menus is
     * closed. This function only handles Escape key events matching the {menuSelector} selector.
     * Does not bubble.
     *
     * @static
     * @param {JQueryKeyEventObject} $event - any JQuery key event object, from any element.
     */
    public static handleEscapeCloseMenu($keyEvent: JQueryKeyEventObject) {
        // Handle Escape key only. Ignore bubbling. Bubbling makes the menus sad. It causes L1's to close when opening L2's.
        if ($keyEvent.keyCode !== keycodes.Escape
            || $keyEvent.currentTarget !== $($keyEvent.target).closest(NavigationMenus.menuSelector)[0]) {
            return;
        }

        // If the menu is open, close it. If it's closed, close its parent menu.
        var $menu = $($keyEvent.currentTarget).closest(NavigationMenus.menuSelector);
        if (NavigationMenus.isOpen($menu)) {
            // set focus after closing, since we already know event came from keyboard
            NavigationMenus.closeMenu($menu, true);
        } else {
            // set focus after closing, since we already know event came from keyboard
            NavigationMenus.closeMenu($menu.parent().closest(NavigationMenus.menuSelector), true);
        }
    }

    /**
     * Event handler that will close sibling menus.
     * This function only handles key events where the target.closest matches the {menuSelector} selector.
     *
     *
     * @static
     * @param {JQueryKeyEventObject} $event - any JQuery key event object, from any element.
     */
    public static closeOpenSiblingMenusOnFocusChange($keyEvent: JQueryKeyEventObject) {
        var $menu = $($keyEvent.target).closest(NavigationMenus.menuSelector).first(),
            $menuAncestors = $menu.parents(NavigationMenus.menuSelector);
        NavigationMenus.closeAllOpenMenus(null, $menuAncestors.add($menu));
    }


    /**
     * Event handler that closes all of the open menus. Optional parameter allows excluding menus.
     *
     * @static
     * @param {JQueryEventObject} [$event] - Jquery event object that triggered this handler.
     * {$event.target} must match the {menuSelector} selector.
     * @param {JQuery} [$except] - The JQuery objects that will remain open.
     */
    public static closeAllOpenMenus($event?: JQueryEventObject, $except?: JQuery) {
        NavigationMenus.closeMenu($(' > [aria-expanded="true"]', NavigationMenus.$menus).parent().not($except));
    }

    /**
     *  Function that handles everything needed when the UHF is first created.
     */
    public static init() : void {
        // For progressive enhancement - 'no-js' is default, and will cause the menus to open without any js via hover.
        // Replacing with 'js' will give us enhanced functionality/accessibility - allowing us to respond to clicks.
        $(NavigationMenus.uhfSelector).removeClass('no-js').addClass('js');
        NavigationMenus.$menus = $(NavigationMenus.menuSelector);
        NavigationMenus.$levelTwoMenus = $(`${NavigationMenus.menuSelector} ${NavigationMenus.menuSelector}`);
        NavigationMenus.$multiColumnMenus = $(`.f-multi-column ${NavigationMenus.menuSelector}`);
        NavigationMenus.$menus.on('keyup', NavigationMenus.handleEscapeCloseMenu);
    }

    public static clearCustomMenuHeights() {
        $(' > ul', NavigationMenus.$menus).height('');
    }

    /**
     *  Callback that handles everything needed when entering
     *  the desktop viewport.
     */
    public static handleMoveIntoDesktopViewport() : void {
        NavigationMenus.openMenu(NavigationMenus.$multiColumnMenus);
        NavigationMenus.clearCustomMenuHeights();
        NavigationMenus.$multiColumnMenus.children('button').attr('tabindex', -1);
        NavigationMenus.$menus = NavigationMenus.$menus.not(NavigationMenus.$multiColumnMenus);

        // Blurring away from menus should close them
        $(document).on('click', NavigationMenus.closeIfBlurred);

        // all of the following "add to css" todos are tracked via [#7891790]
        $('.js-cat-head').show(); // todo: [lacush] add to css
        $(NavigationMenus.categoryNavSelector).show(); // todo: [lacush] add to css
        $(NavigationMenus.globalNavSelector).show(); // todo: [lacush] add to css
        $('#meControl').show(); // todo: [lacush] add to css
        $(`${NavigationMenus.uhfSelector} .c-search`).show(); // todo: [lacush] add to css
        $(`${NavigationMenus.uhfSelector} ${NavigationMenus.shoppingCartSelector}`).show(); // todo: [lacush] add to css
        $('body').css('overflow-y', 'auto'); // todo: [lacush] add to css

        // Clicking on things like the cart, or a blank space shouldn't close menus on mobile.
        $(document).on('click', NavigationMenus.closeIfBlurred);
        NavigationMenus.$menus.children('button').on('focus', NavigationMenus.closeOpenSiblingMenusOnFocusChange);

        $(NavigationMenus.hamburgerMenuSelector).off('click', NavigationMenus.toggleHamburger);
        $(NavigationMenus.mobilePrimaryButtonSelector).off('click', NavigationMenus.handleMobilePrimaryButton);
        $(NavigationMenus.mobileSecondaryButtonSelector).off('click', NavigationMenus.handleMobileSecondaryButton);
        NavigationMenus.$menus.off('click', NavigationMenus.handleMobileMenuClick);
        NavigationMenus.$menus.on('click', NavigationMenus.handleDesktopMenuClick);

        NavigationMenus.resetTitleMobileText();

        // MouseEnter and MouseLeave are used for hover. TouchStart can sometimes cause a mouseEnter, so we set a flag to ignore it later.
        NavigationMenus.$levelTwoMenus.on('mouseenter', NavigationMenus.handleDesktopMenuMouseEnter);
        NavigationMenus.$levelTwoMenus.on('mouseleave', NavigationMenus.handleDesktopMenuMouseLeave);
        NavigationMenus.$menus.on('touchstart', () => { NavigationMenus.wasTapped = true; });

        NavigationMenus.closeAllOpenMenus();
    }

    /**
     * Handles menu clicks within the desktop viewport.
     *
     * @param $event {JQueryEventObject} event object with delegateTarget matching {menuSelector}
     */
    public static handleDesktopMenuClick($event: JQueryEventObject): void {
        // Ignore bubbling. Bubbling makes the menus sad. It causes L1's to close when opening L2's.
        if ($event.currentTarget !== $($event.target).parent(NavigationMenus.menuSelector)[0]) {
            return;
        }

        // if the event was a touchstart, we don't want to also register a click. see:
        $event.preventDefault();

        // f-hidden indicates a **disabled** link/menu (I know...). We don't
        // want to navigate to disabled links.
        if ($('> a, > button', $event.delegateTarget).hasClass('f-hidden')) {
            return;
        }

        var setFocusAfterClosing = NavigationMenus.wasClickFromKeyboard($event);
        NavigationMenus.toggleMenu($($event.delegateTarget), setFocusAfterClosing);
    }

    /**
    * Handles hovering into a desktop menu
    *
    * @param $event {JQueryEventObject} event object with delegateTarget matching {menuSelector}
    */
    public static handleDesktopMenuMouseEnter($event: JQueryEventObject): void {
        // Some android devices fire a mouseenter event on tap.
        if (NavigationMenus.wasTapped) {
            return;
        }

        NavigationMenus.openMenu($($event.delegateTarget));
    }

    /**
     * Handles hovering out of a desktop menu
     *
     * @param $event {JQueryEventObject} event object with delegateTarget matching {menuSelector}
     */
    public static handleDesktopMenuMouseLeave($event: JQueryEventObject): void {
        // Some android devices fire a mouseleave event on tap.
        if (NavigationMenus.wasTapped) {
            return;
        }

        NavigationMenus.closeMenu($($event.delegateTarget));
    }

    /**
     * In mobile, there are a few additional effects of clicking a menu than on desktop.
     * The back/forward buttons display state must be set, and the title text must be replaced
     * with the title text of the menu that was clicked.
     *
     * @param event
     */
    public static handleMobileMenuClick($event: JQueryEventObject): void {
        // the menus is already open
        if (NavigationMenus.isOpen($($event.delegateTarget))) {
            return;
        }

        let title = $($event.target).text();
        NavigationMenus.setTitleMobileText(title);
        $(NavigationMenus.mobilePrimaryButtonSelector).show();
        $(NavigationMenus.mobileSecondaryButtonSelector).hide();
        NavigationMenus.openMenu($($event.delegateTarget));
    }

    /**
     *  Callback that handles everything needed when entering
     *  the desktop viewport.
     */
    public static handleMoveIntoMobileViewport() : void {
        NavigationMenus.$menus = NavigationMenus.$menus.add(NavigationMenus.$multiColumnMenus);
        NavigationMenus.$multiColumnMenus.children('button').attr('tabindex', null);

        // all of the following "add to css" todos are tracked via [#7891790]
        // Hide the secondary menu button. todo: [lacush] move to css
        $(NavigationMenus.mobileSecondaryButtonSelector).hide();

        $(NavigationMenus.categoryNavSelector).hide(); // todo: [lacush] add to css
        $(NavigationMenus.globalNavSelector).hide(); // todo: [lacush] add to css
        $(NavigationMenus.hamburgerMenuSelector).attr(NavigationMenus.activeButtonAriaAttr, 'false');

        // Hide Mecontrol, and show search and cart. todo: remove and replace in css
        $('.js-global-head').addClass(NavigationMenus.closedClass).removeClass(NavigationMenus.openedClass);
        $('#meControl').hide(); // todo: [lacush] add to css
        $(`${NavigationMenus.uhfSelector} .c-search`).show(); // todo: [lacush] add to css
        $(`${NavigationMenus.uhfSelector} ${NavigationMenus.shoppingCartSelector}`).show(); // todo: [lacush] add to css

        // Clicking on things like the cart, or a blank space shouldn't close menus on mobile.
        $(document).off('click', NavigationMenus.closeIfBlurred);

        // Similarly, focusing is handled diferently on mobile.
        NavigationMenus.$menus.children('button').off('focus', NavigationMenus.closeOpenSiblingMenusOnFocusChange);

        $(NavigationMenus.hamburgerMenuSelector).on('click', NavigationMenus.toggleHamburger);
        $(NavigationMenus.mobilePrimaryButtonSelector).on('click', NavigationMenus.handleMobilePrimaryButton);
        $(NavigationMenus.mobileSecondaryButtonSelector).on('click', NavigationMenus.handleMobileSecondaryButton);
        NavigationMenus.$menus.on('click', NavigationMenus.handleMobileMenuClick);
        NavigationMenus.$menus.off('click', NavigationMenus.handleDesktopMenuClick);
        NavigationMenus.$levelTwoMenus.off('mouseenter', NavigationMenus.handleDesktopMenuMouseEnter);
        NavigationMenus.$levelTwoMenus.off('mouseleave', NavigationMenus.handleDesktopMenuMouseLeave);


        // save mobile title text into a data-*
        let $titleElement = $(NavigationMenus.mobileTitleSelector);
        $titleElement.data('orig', $titleElement.text());
        NavigationMenus.closeAllOpenMenus();
    }

    /**
     * Sets the title text of the mobile header.
     * @param title {string} - the string to set the title text to.
     */
    public static setTitleMobileText(title: string) : void {
        $(NavigationMenus.mobileTitleSelector).text(title);
    }

    /**
     * Returns true if the uhf has a category menu
     *
     * @returns {boolean} - true if the uhf has a category menu
     */
    public static hasCategoryMenu(): boolean {
        return $(NavigationMenus.categoryNavSelector).length > 0;
    }

    /**
     * Returns true if the uhf has a any global nav items
     *
     * @returns {boolean} - true if the uhf has any global nav items
     */
    private static hasGlobalNavItems(): boolean {
        return $(NavigationMenus.globalNavSelector).length > 0;
    }

    /**
     * When the page initially loads, the title text container contains the default title.
     * Resetting the text reverts that text to what it was on page load.
     */
    public static resetTitleMobileText() : void  {
        let $titleElement = $(NavigationMenus.mobileTitleSelector),
            title = $titleElement.data('orig');
        if (!!title) {
            $titleElement.text(title);
        }
    }

    /**
     * Handler for the mobile primary button. This function facilitates the "back" functionality through
     * the menu tree, and is agnostic of ltr/rtl.
     *
     * @param $event
     */
    public static handleMobilePrimaryButton($event: JQueryEventObject) : void {
        // There aren't currently any open submenus, so the open menu must be the category menu.
        // It's a special case, and is shown/hidden via a display:none/block, instead of aria-* states.
        let $openMenus = $(' > [aria-expanded="true"]', NavigationMenus.$menus);

        if (!$openMenus[0]) {
            $(NavigationMenus.categoryNavSelector).hide();
            $(NavigationMenus.globalNavSelector).show();
            $(NavigationMenus.mobilePrimaryButtonSelector).hide();

            // never show secondary btn if there's no category menu
            if (NavigationMenus.hasCategoryMenu()) {
                $(NavigationMenus.mobileSecondaryButtonSelector).show();
            }

            NavigationMenus.setTitleMobileText(NavigationMenus.getOriginalGlobalTitle());

        // The current open menu is a regular l1,c1,l2, or c2
        } else {
            // todo: [lacush] - don't depend on element order.
            let $menuToClose = $openMenus
                .last()
                .parent(NavigationMenus.menuSelector);
            NavigationMenus.closeMenu($menuToClose);

            let isOpenMenu = !$(' > [aria-expanded="true"]', NavigationMenus.$menus)[0];
            // $menuToClose was the last open global menu
            if (isOpenMenu && !$(NavigationMenus.categoryNavSelector).is(':visible')) {
                $(NavigationMenus.mobilePrimaryButtonSelector).hide();

                // never show secondary btn if there's no category menu
                if (NavigationMenus.hasCategoryMenu()) {
                    $(NavigationMenus.mobileSecondaryButtonSelector).show();
                }
                NavigationMenus.setTitleMobileText(NavigationMenus.getOriginalGlobalTitle());

            // $menuToClose was the last open category menu
            } else if (isOpenMenu && $(NavigationMenus.categoryNavSelector).is(':visible')) {
                NavigationMenus.resetTitleMobileText();

                if (!NavigationMenus.hasGlobalNavItems()) {
                    $(NavigationMenus.mobilePrimaryButtonSelector).hide();
                }

            // $menuToClose was a l2 or c2
            } else {
                NavigationMenus.setTitleMobileText(
                    $menuToClose.parents(NavigationMenus.menuSelector).first().children('button').first().text());
            }
        }
    }

    /**
     * Handler for the mobile primary button. This function facilitates the "forward" functionality through
     * the menu tree, and is agnostic of ltr/rtl.
     *
     * @param $event
     */
    public static handleMobileSecondaryButton($event: JQueryEventObject): void {
        $(NavigationMenus.globalNavSelector).hide();
        $(NavigationMenus.categoryNavSelector).show();
        $(NavigationMenus.mobilePrimaryButtonSelector).show();
        $(NavigationMenus.mobileSecondaryButtonSelector).hide();
        NavigationMenus.resetTitleMobileText();
    }

    /**
     * Handler for toggling the hamburger menu.
     */
    public static toggleHamburger() : void  {
        let $hamburger = $(NavigationMenus.hamburgerMenuSelector),
            showWhenOpenSelector = `#meControl, ${NavigationMenus.categoryNavSelector}, ${NavigationMenus.globalNavSelector}`,
            hideWhenOpenSelector = `${NavigationMenus.uhfSelector} .c-search,
                ${NavigationMenus.uhfSelector} ${NavigationMenus.shoppingCartSelector}`;

        // The hamburger is closed. Open it.
        if ($hamburger.attr(NavigationMenus.activeButtonAriaAttr) === 'false') {
            $('.js-global-head').addClass('f-opened').removeClass('f-closed');
            $(hideWhenOpenSelector).hide(); // todo: [lacush] add to css
            $(showWhenOpenSelector).show(); // todo: [lacush] add to css
            $('body').css('overflow-y', 'hidden'); // todo: [lacush] add to css

            $hamburger.attr(NavigationMenus.activeButtonAriaAttr, 'true');

            // No category nav, no need to show the buttons.
            if (!NavigationMenus.hasCategoryMenu() || !NavigationMenus.hasGlobalNavItems()) {
                $(`${NavigationMenus.mobilePrimaryButtonSelector}, ${NavigationMenus.mobileSecondaryButtonSelector}`).hide();
            } else {
                $(NavigationMenus.mobilePrimaryButtonSelector).show();
                $(NavigationMenus.mobileSecondaryButtonSelector).hide();
                $(NavigationMenus.globalNavSelector).hide();
            }

        // The hamburger is open. Close it.
        } else {
            $('.js-global-head').removeClass(NavigationMenus.openedClass).addClass(NavigationMenus.closedClass);
            $(hideWhenOpenSelector).show(); // todo: [lacush] add to css
            $(showWhenOpenSelector).hide(); // todo: [lacush] add to css
            $('body').css('overflow-y', 'auto'); // todo: [lacush] add to css

            $hamburger.attr(NavigationMenus.activeButtonAriaAttr, 'false');
        }
        NavigationMenus.resetTitleMobileText();
        NavigationMenus.closeAllOpenMenus();
    }

    /**
    * Resets all menu highlights
    */
    public static resetNavHighlight(elementContext: HTMLElement): void {
        removeClass(selectElements(`.${NavigationMenus.currentClass}`, elementContext), NavigationMenus.currentClass);
    }

    /**
    * Highlights navigation items
    */
    public static setCurrentMenuItemId(currentMenuItemId: string) {
        let element : HTMLElement = null;
        let universalHeader = selectFirstElement(NavigationMenus.uhfSelector) as HTMLElement;
        try {
            element = selectFirstElement(`#${currentMenuItemId}`, universalHeader) as HTMLElement;
        } catch (e) {
            return;
        }

        if (element) {
            NavigationMenus.resetNavHighlight(universalHeader);
            addClass(element, NavigationMenus.currentClass);
            $(element).parents('ul').siblings('button').addClass(NavigationMenus.currentClass);
        }
    }
}
