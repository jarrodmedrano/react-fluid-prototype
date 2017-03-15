/// <amd-module name="uhfCookieAlert"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {addClass, removeClass, hasClass, addEvent, selectFirstElement, eventTypes, css, getClientRect} from 'htmlExtensions';
import {setCookie, getCookie} from 'utility';
import {Alert} from 'alert';
import {Publisher, ISubscriber} from 'publisher';

export interface IUhfBannerSubscriber extends ISubscriber {
    onBannerClosed(notification: IUhfBannerNotification): void;
}

/**
* @interface IUhfBannerNotification
* @classdesc - The data contract interface used for uhf banner notifications.
* @export
*/
export interface IUhfBannerNotification  {
    /**
    * @name - height
    * @description - This is the new height in px of the Uhf Banner
    * @public
    * @type {number}
    */
    height: number;
}

/**
* @class UhfCookieAlert
*/
export class UhfCookieAlert extends Publisher<IUhfBannerSubscriber>  {
    private closeSelector = 'button.c-action-trigger.glyph-cancel';
    private cookieName = 'uhf_hide_cn';
    private hiddenClass = 'x-hidden';

    /**
     * Constructor of uhf alert component.
     */
    constructor(private cookieAlertElement: HTMLElement) {
        super(cookieAlertElement);
        if (!cookieAlertElement || !(getCookie(this.cookieName) !== 'true')) {
            return;
        }

        removeClass(this.cookieAlertElement, this.hiddenClass);

        
        let alertCloseButton = selectFirstElement(this.closeSelector, cookieAlertElement);
        addEvent(alertCloseButton, eventTypes.click, this.closeAndSetCookie);
    }

    /**
     * Returns the current height of the cookie alert element
     * 
     * @returns 0 if the cookie alert doesn't exist or is hidden
     * 
     * @memberOf UhfCookieAlert
     */
    public getHeight = (): number => {
        if (!this.cookieAlertElement) {
            return 0;
        }
        return getClientRect(this.cookieAlertElement).height;
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
        setCookie(this.cookieName, 'true', '/', 365);
        addClass(this.cookieAlertElement, this.hiddenClass);
        this.initiatePublish({height: this.getHeight()});
    }
}
