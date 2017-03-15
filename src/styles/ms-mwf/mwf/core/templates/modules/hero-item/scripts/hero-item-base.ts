/// <amd-module name="hero-item-base"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {Publisher, ISubscriber} from 'publisher';
import {ComponentFactory} from 'componentFactory';
import {addEvent,
        Coordinate,
        eventTypes,
        getCoordinates,
        removeEvent,
        SafeBrowserApis,
        selectElementsT,
        stopPropagation} from 'htmlExtensions';
import {isNullOrWhiteSpace} from 'stringExtensions';
import {apiDeprecated} from 'utility';

/**
* @interface IHeroItemNotification
* @classdesc - The data contract interface used for HeroItem notifications.
* @export
*/
export interface IHeroItemNotification {
    preventDefault: boolean;
    event: UIEvent;
    targetElement: HTMLElement;
    targetUri: string;
}

/**
* @interface IHeroItemSubscriber
* @classdesc - The interface which HeroItem notification subscribers must implement.
* @export
*/
export interface IHeroItemSubscriber extends ISubscriber {
    onHeroItemClicked(notification: IHeroItemNotification): void;
}

/**
* @class HeroItemBase
* @classdesc - The abstract HeroItemBase class which other xxxHeroItem classes extend to
* inherit common behavior like sloppy click support.
* @export
*/
export abstract class HeroItemBase extends Publisher<IHeroItemSubscriber> {
    /**
    * @name - dataJsHref
    * @memberof HeroItemBase
    * @description - The attribute name to populate to indicate js-href clickability
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly dataJsHref = 'data-js-href';

    /**
    * @name - minimumSwipeDistance
    * @memberof HeroItemBase
    * @description - The number of pixels a pointer, mouse, or touch chord must traverse to be considered a valid swipe 
    * @private
    * @static
    * @readonly
    * @type {number}
    */
    private static readonly minimumSwipeDistance = 30;

    /**
    * @name - callToActionSelector
    * @memberof HeroItemBase
    * @description - The CSS selector for the Call To Action anchor tags
    * @protected
    * @static
    * @readonly
    * @type {string}
    */
    protected static readonly callToActionSelector = 'a.c-call-to-action';

    /**
    * @name - callsToAction
    * @memberof HeroItemBase
    * @description - The list of calls to action.
    * @private
    * @type {HTMLAnchorElement[]}
    */
    private callsToAction: HTMLAnchorElement[];

    /**
    * @name - preventDefaultClickAction
    * @memberof HeroItemBase
    * @description - Indicates whether or not any subscribers wished to prevent the default click behavior.
    * @private
    * @type {boolean}
    */
    private preventDefaultClickAction: boolean;

    /**
    * @name - startCoordinates
    * @memberof HeroItemBase
    * @description - The starting coordinates for a pointerdown/pointerup, mousedown/mouseup, or touchstart/touchend chord 
    * @private
    * @type {Coordinate}
    */
    private startCoordinates: Coordinate;

    /**
    * @name - initialized
    * @memberof HeroItemBase
    * @description - Indicates whether or not the HeroItemBase initialization has completed.
    *                This is usefull for test code to determine when the HeroItem is testable.
    * @private
    * @type {boolean}
    */
    private initialized = false;

    /**
    * @name - constructor
    * @memberof HeroItemBase
    * @description - Constructor for the HeroItem component.
    * @public
    * @param {HTMLElement} heroItemBaseElement - the native element to attach the HeroItemBase behavior to.
    * @param {any} params- The parameter object with the class name to match against the MWF class
    *                      attribute value to determine whether or not to initialize this element
    *                      in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected heroItemBaseElement: HTMLElement, params: any) {
        super(heroItemBaseElement, params);

        if (!ObservableComponent.shouldInitializeAsClass(heroItemBaseElement, params)) {
            return;
        }

        SafeBrowserApis.requestAnimationFrame.call(window, () => this.update());
    }

    /**
    * @name - update
    * @memberof HeroItemBase
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @override
    * @returns {boolean}
    */
    protected update(): boolean {
        if (!this.heroItemBaseElement) {
            return false;
        }

        this.callsToAction = selectElementsT<HTMLAnchorElement>((this.constructor as any).callToActionSelector, this.heroItemBaseElement);

        this.addEventListeners();
        this.initialized = true;

        return true;
    }

    /**
    * @name - teardown
    * @memberof HeroItemBase
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @override
    * @returns {void}
    */
    protected teardown(): void {
        this.removeEventListeners();
        this.initialized = false;
    }

    /**
    * @name - publish
    * @memberof HeroItemBase
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @override
    * @param {IHeroItemSubscriber} subscriber - The subscriber to make the callback to.
    * @param {any} [context] - The publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IHeroItemSubscriber, context?: any): void {
        if (subscriber.onHeroItemClicked) {
            subscriber.onHeroItemClicked(context as IHeroItemNotification);
            this.preventDefaultClickAction = this.preventDefaultClickAction || (context as IHeroItemNotification).preventDefault;
        }
    }

    /**
    * @name - addEventListeners
    * @memberof HeroItemBase
    * @description - Add the event listeners for the sloppy click support.
    * @private
    * @returns {void}
    */
    private addEventListeners(): void {
        if (this.verifyCallToAction()) {
            this.heroItemBaseElement.setAttribute(HeroItemBase.dataJsHref, this.callsToAction[0].href);
            addEvent(this.heroItemBaseElement, eventTypes.mousedown, this.handleMouseAndTouchStart);
            addEvent(this.heroItemBaseElement, eventTypes.mouseup, this.handleMouseAndTouchEnd);
        }
    }

    /**
    * @name - removeEventListeners
    * @memberof HeroItemBase
    * @description - Remove the event listeners for the sloppy click support.
    * @private
    * @returns {void}
    */
    private removeEventListeners(): void {
        addEvent(this.heroItemBaseElement, eventTypes.mousedown, this.handleMouseAndTouchStart);
        addEvent(this.heroItemBaseElement, eventTypes.mouseup, this.handleMouseAndTouchEnd);
    }

    /**
    * @name - handleValidUserInteraction
    * @memberof HeroItemBase
    * @description - actions to take when a valid user interaction occurs (a regular click or touch "tap")
    * @private
    * @param {MouseEvent} event - The mouse event
    * @param {HTMLElement} target - The element clicked on (this parameter is useful for unit testing)
    * @returns {void}
    */
    private handleValidUserInteraction = (event: MouseEvent, target: HTMLElement): void => {

        // If we don't have a valid target that's not one of our calls to action do nothing.
        if (!target ||
            (this.callsToAction.indexOf(<HTMLAnchorElement>target) !== -1) ||
            (this.callsToAction.indexOf(<HTMLAnchorElement>target.parentElement) !== -1)) {
            return;
        }

        // Check for valid href one more time so we don't publish when navigation won't happen.
        if (!this.verifyCallToAction()) {
            // This should only happen if someone removes the href post update()
            this.heroItemBaseElement.removeAttribute(HeroItemBase.dataJsHref);
            return;
        }

        if (!this.heroItemBaseElement.hasAttribute(HeroItemBase.dataJsHref)) {
            this.heroItemBaseElement.setAttribute(HeroItemBase.dataJsHref, this.callsToAction[0].href);
        }

        // When the click was somewhere within the HeroItem but not on any of its call-to-actions see
        // if we have any subscribers that would like to act on it, otherwise do our default action.
        let notification = { preventDefault: false, event: event, targetElement: target, targetUri: this.callsToAction[0].href };

        this.preventDefaultClickAction = false;

        this.initiatePublish(notification);

        if (!this.preventDefaultClickAction) {
            // Either we have no subscribers or one or more of our subscribers wished to prevent our
            // default action of navigating to the href of the first call-to-action.
            stopPropagation(event);
            this.navigateToUrl(this.callsToAction[0].href);
        } else {
            this.preventDefaultClickAction = false;
        }
   }

    /**
    * @name - handleMouseAndTouchStart
    * @memberof HeroItemBase
    * @description - records the starting coordinates for a mouse or touch event
    * @private
    * @param {MouseEvent} event - The mouse event
    * @returns {void}
    */
    private handleMouseAndTouchStart = (event: MouseEvent): void => {
        this.startCoordinates = getCoordinates(event);
    }

    /**
    * @name - handleMouseAndTouchEnd
    * @memberof HeroItemBase
    * @description - Handles the mouseup event.
    * @private
    * @param {MouseEvent} event - The mouse event
    * @returns {void}
    */
    private handleMouseAndTouchEnd = (event: MouseEvent): void => {
        this.determineIfValidUserInteraction(event, this.heroItemBaseElement);
    }

    /**
    * @name - determineIfValidUserInteraction
    * @memberof HeroItemBase
    * @description - Determines if the user interaction is valid for activating the call-to-action
    * @private
    * @param {MouseEvent} event - The mouse event
    * @param {HTMLElement} target - The element clicked on (this parameter is useful for unit testing)
    * @returns {void}
    */
    private determineIfValidUserInteraction(event: MouseEvent, target: HTMLElement): void {
        let startCoordinates = this.startCoordinates;
        let endCoordinates = getCoordinates(event);
        let buttonCode = event.which || event.button;

        // left-mouse button is code 1 -- ignore any other code for middle-mouse button, right-mouse button, etc.
        if (buttonCode === 1 && startCoordinates && endCoordinates && !this.isSwipe(startCoordinates, endCoordinates)) {
            this.handleValidUserInteraction(event, target);
        }
    }

    /**
     * @name - isSwipe
     * @memberof HeroItemBase
     * @description - Determines whether the event should be considered a swipe event
     * @private
     * @param {Coordinate} startCoordinates - The starting coordinates of the event chord
     * @param {Coordinate} endCoordinates - The ending coordinates of the event chord
     * @returns {boolean} - true if the event should be considered a swipe event, otherwise false
     */
    private isSwipe(startCoordinates: Coordinate, endCoordinates: Coordinate): boolean {
        if (!startCoordinates || !endCoordinates) {
            return false;
        }

        let deltaY = Math.abs(endCoordinates.y - startCoordinates.y);
        let deltaX = Math.abs(endCoordinates.x - startCoordinates.x);

        return deltaX > HeroItemBase.minimumSwipeDistance ||
               deltaY > HeroItemBase.minimumSwipeDistance;
    }

    /**
    * @name - navigateToUrl
    * @memberof HeroItemBase
    * @description - Navigates to the given url.
    *                This separate method exists so jasmine spies can intercept it can circumvent the navigation during testing.
    * @private
    * @param {string} url - The destination url
    * @returns {void}
    */
    private navigateToUrl(url: string): void {
        if (!isNullOrWhiteSpace(url)) {
            location.href = url;
        }
    }

    /**
    * @name - verifyCallToAction
    * @memberof HeroItemBase
    * @description - Verifies the Hero Item has at least one Call To Action AND the first CTA has a hyperlink
    * @private
    * @returns {boolean} - true if the Hero Item has at least one Call to Action AND the first CTA has a hyperlink, else false
    */
    private verifyCallToAction(): boolean {
        return this.callsToAction && this.callsToAction.length && !isNullOrWhiteSpace(this.callsToAction[0].href);
    }
}