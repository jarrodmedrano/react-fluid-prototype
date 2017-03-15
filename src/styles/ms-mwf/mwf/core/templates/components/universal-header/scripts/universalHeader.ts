/// <amd-module name="universalHeader"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {UhfPaddles} from 'uhfPaddles';
import {ShoppingCart} from 'shoppingCart';
import {UhfSearchModule} from 'uhfSearchModule';
import {NavigationMenus} from 'navigationMenus';
import {selectFirstElement, addThrottledEvent, eventTypes, getClientRect, hasClass, 
        removeClass, css, selectElements, addClass} from 'htmlExtensions';
import {getWindowWidth, Viewports} from 'utility';
import {UhfAutoSuggest} from 'uhfAutoSuggest';
import {UhfCookieAlert, IUhfBannerNotification} from 'uhfCookieAlert';
import {UhfPromoBanner} from 'uhfPromoBanner';
import {UhfLanguageToggle} from 'uhfLanguageToggle';
import {removeFocus} from 'removeFocus';

export class UniversalHeader {
    
    /**
    * @name - selector
    * @description - The universalHeader component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector: string = '.c-universal-header';

    /**
    * Elements with this class are display:none
    *
    * @public
    */
    private hiddenClass: string = 'x-hidden';

    /**
     * Class selector - Selector for Logo Image.
     *
     * @private
     * @static
     */
    private static logoImageSelector: string = '.c-universal-header > div:first-child .c-logo .c-image';

    /**
     * The universal header's paddles.
     *
     * @private
     */
    private paddles: UhfPaddles;
   
    /**
     * The universal header's search Module.
     *
     * @private
     */
    private searchModule: UhfSearchModule;

    /**
     * True if currently considered to be in mobile view. This may become out of sync with the
     * window's true viewport/css media queries, and is used to flag to sync back up.
     *
     * @private
     */
    private wasMobile: boolean;

    /**
     * Whether or not the categoryNav exists
     *
     * @public
     * @type {boolean}
     */
    private hasCategory: boolean;

    /**
     * The universal header element;
     *
     * @private
     */
    private headerElement: HTMLElement;

    /**
     * The universal header global logo element;
     *
     * @private
     */
    private globalLogo: HTMLElement;

    /**
    * @name - uhfAutoSuggest
    * @description - The UhfAutoSuggest component.
    * @private
    * @type {UhfAutoSuggest}
    */
    private uhfAutoSuggest: UhfAutoSuggest;

    /**
    * @name - cookieAlert
    * @description - The UhfCookieAlert component.
    * @private
    * @type {UhfCookieAlert}
    */
    private cookieAlert: UhfCookieAlert;

    /**
    * @name - edgePromoBanner
    * @description - The UhfPromoBanner component.
    * @private
    * @type {UhfPromoBanner}
    */
    private edgePromoBanner: UhfPromoBanner;

    /**
    * @name - languageToggle
    * @description - The UhfLanugageToggle component.
    * @private
    * @type {UhfLanguageToggle}
    */
    private languageToggle: UhfLanguageToggle; 

    /**
     * Creates an instance of the Universal Header.
     *
     * @public
     */
    public constructor() {
        this.headerElement = selectFirstElement(UniversalHeader.selector);
        this.globalLogo = selectFirstElement('.js-global-head .c-logo');

        this.hasCategory = !!selectFirstElement('#' + UhfPaddles.categoryNavElementId);

        NavigationMenus.init();
        if (this.hasCategory) {
            this.paddles = new UhfPaddles();
        }

        if (this.isMobile() && !this.wasMobile) {
            this.wasMobile = true;
            NavigationMenus.handleMoveIntoMobileViewport();
            if (this.hasCategory) {
                this.paddles.handleMoveIntoMobileViewport();
            }
        } else {
            this.wasMobile = false;
            NavigationMenus.handleMoveIntoDesktopViewport();
            if (this.hasCategory) {
                this.paddles.handleMoveIntoDesktopViewport();
            }
        }

        let searchElement = selectFirstElement('.js-global-head .c-search');
        if (!!searchElement) {
            this.uhfAutoSuggest = new UhfAutoSuggest();
            this.searchModule = new UhfSearchModule(searchElement, this.setSearchWidth, this.uhfAutoSuggest);
        }

        let hasShoppingCart = !!selectFirstElement('#' + ShoppingCart.shoppingCartFrameId);
        if (hasShoppingCart) {
            let shoppingCart = new ShoppingCart();
        }

        addThrottledEvent(window, eventTypes.resize, this.onWindowResize, 66);

        // ====== UHF BANNERS - The UHF has three possible banners. ======
        // 1. The cookie banner 
        // 2. The edge promo banner 
        // 3. The site-wide promo banner
        // At no point should more than one banner ever be displayed. 
        // Therefore precedence of showing the banners is 1, 2, 3.
        let cookieAlertElement = selectFirstElement('#uhfCookieAlert');
        if (cookieAlertElement) {
            this.cookieAlert = new UhfCookieAlert(cookieAlertElement);
            this.cookieAlert.subscribe({onBannerClosed: this.delegateBannerNotification});
            this.updateBannerBufferHeight();
        }

        // We only show the edge promo banner if cookie alert doesn't exist or isn't shown.
        let edgePromoElement = selectFirstElement('#epb'),
            cookieAlertIsHidden = hasClass(cookieAlertElement, this.hiddenClass);
        if (!cookieAlertElement || cookieAlertIsHidden) {
            this.edgePromoBanner = new UhfPromoBanner(edgePromoElement);
            this.edgePromoBanner.subscribe({onBannerClosed: this.delegateBannerNotification});
            this.updateBannerBufferHeight();
        }
              
        // We only show the siteWide promo banner if no other banners have been shown.
        if ((!cookieAlertElement || cookieAlertIsHidden) 
                && (!edgePromoElement || hasClass(edgePromoElement, this.hiddenClass))) {    
            let siteWidePromoElement = selectFirstElement('#swp');
            removeClass(siteWidePromoElement, this.hiddenClass);        
        }

        let languageToggleElement = selectFirstElement('#uhf-l-nav');
        if (languageToggleElement) {
            this.languageToggle = new UhfLanguageToggle(languageToggleElement);
            this.languageToggle.createLanguageToggleUrls(languageToggleElement);
        }

        removeFocus(document);
    }

    private isMobile = (): boolean => {
        return Viewports.getViewport() < Viewports.Names.vp3;
    }

    /**
     * Debounces the resizing of the window. See:
     * https://developer.mozilla.org/en-US/docs/Web/Events/resize#setTimeout
     *
     * @private
     */
    private onWindowResize = () => {
        this.checkForViewportChange();

        if (!this.wasMobile && this.hasCategory) {
            this.paddles.handleWidthChange();
        }

        // the search box needs to have a custom, calculated width in vp3 only
        if (this.searchModule) {
            this.setSearchWidth();
        }

        this.updateBannerBufferHeight();
    }

    /**
     * Extends the search element width in vp3 all the way to the global header logo.
     *
     * @private
     */
    private setSearchWidth = (): void => {
        let width = '';
        if (Viewports.getViewport() === Viewports.Names.vp3) {
            let logoElementRect = getClientRect(this.globalLogo),
                searchElementRect = getClientRect(this.searchModule.getSearchFormElement()),
                side = logoElementRect.right < searchElementRect.right ? 'right' : 'left'; // for RTL
            // Minus 20px to leave some padding and account for sign in link size changes.  
            width = (Math.abs(searchElementRect[side] - logoElementRect[side]) - 20) + 'px';
        }
        this.searchModule.setSearchBoxWidth(width);
    }

    /**
     * Add the supplied positive top value to the header element. This pushes the header down
     * in situations where it's absolutely positioned, like transparent header. 
     *
     * @private
     */
    private setHeaderTop(height : string): void {
        css(this.headerElement, 'top', height);
    }

    /**
     * Add the supplied positive top value to the header element. 
     *
     * @private
     */
    private resetHeaderTop = (): void => {
        this.setHeaderTop('');
    }

    /**
     * Calculate the correct 
     *
     * @private
     */
    private updateBannerBufferHeight = () : void => {
        // check if the header needs to be shifted down to accomidate any alerts/banners 
        if (css(this.headerElement, 'position') === 'absolute') {
            let headerTop = parseInt(css(this.headerElement, 'top'), 10) || 0;            
            let cookieAlertHeight = this.cookieAlert != null ? this.cookieAlert.getHeight() : 0; 
            let promoBannerHeight = this.edgePromoBanner != null ? this.edgePromoBanner.getHeight() : 0; 
            let newHeaderBufferHeight = cookieAlertHeight > promoBannerHeight ? cookieAlertHeight : promoBannerHeight;
            if (newHeaderBufferHeight !== headerTop) {
                this.setHeaderTop(`${newHeaderBufferHeight}px`);
            }
        }
    }

    /**
     * Delegates the notification received from the Banner.
     * 
     * @private
     * 
     * @memberOf UniversalHeader
     */
    private delegateBannerNotification = (notification: IUhfBannerNotification): void => {
        this.setHeaderTop(`${notification.height}px`);
    }

    /**
     *  Checks if the mobile viewport has been changed from either mobile to
     *  desktop or desktop to mobile, and calls the necessary uhf submodule
     *  functions.
     *
     *  @private
     */
    private checkForViewportChange() {
        let windowWidth = getWindowWidth();
        let isMobile = this.isMobile();

        if (isMobile && !this.wasMobile) {
            NavigationMenus.handleMoveIntoMobileViewport();
            if (this.searchModule) {
                this.searchModule.hide();
            }
            if (this.hasCategory) {
                this.paddles.handleMoveIntoMobileViewport();
            }
            this.wasMobile = true;
        } else if (!isMobile && this.wasMobile) {
            NavigationMenus.handleMoveIntoDesktopViewport();
            if (this.searchModule) {
                this.searchModule.hide();
            }

            if (this.hasCategory) {
                this.paddles.handleMoveIntoDesktopViewport();
            }
            this.wasMobile = false;
        }
    }

    
    /**
     * Switches themes between dark and light and vice versa via javascript
     * 
     * @static
     * @param {string} theme 
     * @returns
     * 
     * @memberOf UniversalHeader
     */
    public static setTheme(theme: string) {
        let transparentContainer = selectFirstElement('header.c-universal-header.f-transparent') as HTMLElement;
        if (!transparentContainer) {
            return;
        }
        let themes = selectElements('.js-global-head, .js-cat-head', transparentContainer) as HTMLElement[];
        let themeToSwapTo = `theme-${theme}`.toLocaleLowerCase();

        const themeRegex = /theme-(dark|light)/;
        let currentTheme: string | boolean = themeRegex.test(themeToSwapTo) ? 
            themes[0].className.match(themeRegex)[0] : false;

        if (!!currentTheme && currentTheme !== themeToSwapTo ) {
            UniversalHeader.swapLogoImage(themeToSwapTo, currentTheme);
            for (var item of themes) {
                removeClass(item, currentTheme as string);
                addClass(item, themeToSwapTo);
            }
        }
    }
  
    /**
     *  Set the logo image to match the theme
     * 
     * @private
     * @static
     * @param {string} themeToSwapTo
     * @param {string} currentTheme
     * @returns
     * 
     * @memberOf UniversalHeader
     */
    private static swapLogoImage(themeToSwapTo: string, currentTheme: string) {
        let logoImageElement = selectFirstElement(UniversalHeader.logoImageSelector) as HTMLImageElement;
        if (!logoImageElement) {
            return;
        }
        let getLogoColor = function (theme:string) {
            return theme === 'theme-light' ? 'gray' : 'white';
        };
 
        //the dark theme uses the white version of the logo, the light theme uses the gray version
        let oldColor = getLogoColor(currentTheme);
        let newColor = getLogoColor(themeToSwapTo);
        logoImageElement.setAttribute('src', logoImageElement.src.replace(oldColor, newColor));
    }
}