/// <amd-module name="uhfPromoBanner"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {addClass, removeClass, hasClass, addEvent, selectFirstElement, getClientRect, eventTypes} from 'htmlExtensions';
import {setCookie, getCookie} from 'utility';
import {Publisher} from 'publisher';
import {IUhfBannerSubscriber, IUhfBannerNotification} from 'uhfCookieAlert';

/**
 * This component is a custom, short-term experiment
 * specifically designed to promote the Edge browser on Windows Chrome, EPB (Edge Promo Banner) for short. This component isn't 
 * useful for anything else, and should be excluded from the UHF bundle once the experiment 
 * commenses. This can easily be done by removing the include of uhfPromoBanner from universalHeader.ts,
 * and any usages of the include.
 * 
 * @class UhfPromoBanner
 */
export class UhfPromoBanner extends Publisher<IUhfBannerSubscriber> {
    private closeSelector = 'button.c-action-trigger.glyph-cancel';
    private cookieName = 'uhf_hide_epb';
    private hiddenClass = 'x-hidden';
    private rollupAnimationClass = 'epb-rollup';

    /**
     * Constructor for uhf promo banner component. 
     */
    constructor(private promoElement: HTMLElement) {
        super(promoElement);
        if (!promoElement || !(getCookie(this.cookieName) !== 'true')) {
            return;
        }

        if (UhfPromoBanner.resolveTreatment()) {
            this.showPromoBanner();
        }
    }

    /**
     * Feature detection used to determine if the Browser/OS combination 
     * is Chrome on Windows RS1 or greater. Borrowed from our friends  in MSN.
     *
     * @returns - true if the Feature detection resolves that the browser is Chrome, and 
     * the OS is Windows with version >= RS1
     */
    private static isGteRs1OnChrome = (): boolean => {
        var context = document.createElement('canvas').getContext('2d');
        context.font = '64px Segoe UI Emoji';
        var width = context.measureText('\uD83D\uDC31\u200D\uD83D\uDC64').width;
        var h1 = document.querySelector('h1');
        var userAgent = navigator.userAgent.toLowerCase();

        if (!(window as any).chrome || userAgent.indexOf('edge') >= 0) {
            return false;
        } else {
            if (userAgent.indexOf('windows nt') === -1) {
                return false; // 'not windows';
            } else if (width <= 90) {
                return true; // '>= RS1!!';
            } else {
                return false; // < Rs1
            }
        }
    }

    /**
     * Resolves true if the OS is windows 10, and the browser is not edge
     * 
     * @private
     * @static
     * 
     * @memberOf UhfPromoBanner
     */
    private static isNotEdgeWin10 = (): boolean => {
        var userAgent = navigator.userAgent.toLowerCase();
        return !(userAgent.indexOf('edge') >= 0) && userAgent.indexOf('windows nt 10') >= 0;
    }

    /**
     * Resolves the given promo banner treatment. Using the appropriate resolver.
     * This gives the ability to apply different treatments via feature switches/configs in the future.
     * 
     * @private
     * @static
     * @returns - true if the provided treatment resolves to be true. 
     * 
     * @memberOf UhfPromoBanner
     */
    private static resolveTreatment(treatment = 'noEdgeWin10') {
        switch (treatment) {
            case 'noEdgeWin10':
                return UhfPromoBanner.isNotEdgeWin10();
            case 'gteRs1OnChrome':
                return UhfPromoBanner.isGteRs1OnChrome();
        }
    }

    /**
     * Show the promo banner
     */
    private showPromoBanner = (): void => {
        let tryNowLink = selectFirstElement('#epbTryNow') as HTMLLinkElement;
        if (!!tryNowLink) {
            tryNowLink.setAttribute('href', 'Microsoft-edge:' + window.location.toString());
        }
        let alertCloseButton = selectFirstElement(this.closeSelector, this.promoElement);
        addEvent(alertCloseButton, eventTypes.click, this.closeAndSetCookie);
        removeClass(this.promoElement, this.hiddenClass);
    }
    
    /**
     * Returns the current height of the promo banner element
     * 
     * @returns 0 if the promo banner doesn't exist or is hidden
     * 
     * @memberOf UhfPromoBanner
     */
    public getHeight = (): number => {
        if (!this.promoElement) {
            return 0;
        }
        return getClientRect(this.promoElement).height;
    }


    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {IUhfBannerSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IUhfBannerSubscriber, context?: any): void {
        subscriber.onBannerClosed(context as IUhfBannerNotification);
    }

    /**
     * Close Button click logic
     *
     * @returns - true if a search should be performed
     */
    public closeAndSetCookie = (event: MouseEvent): void => {
        setCookie(this.cookieName, 'true', '/', 7);
        addClass(this.promoElement, this.rollupAnimationClass);
        addEvent(this.promoElement, eventTypes.animationend, this.rollUpBanner);
    }

    /**
     * Causes the banner to roll up and disappear
     * 
     * @param {AnimationEvent} event - The event.
     * @returns - void
     */
    public rollUpBanner = (event: AnimationEvent): void => {
        removeClass(this.promoElement, this.rollupAnimationClass);
        addClass(this.promoElement, this.hiddenClass);
        this.initiatePublish({height: this.getHeight()});
    }
}