/// <amd-module name="htmlExtensions"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {isNullOrWhiteSpace, trim} from 'stringExtensions';

/********************************* Safe browser APIs  ***********************************/
/* If this module growing big, consider to put in its own file. *************************/

/**
 * @name - SafeBrowserApis
 * A module to have browser apis in a safe manner.
 * If an API supported return, otherwise have a fallback.
 */
export module SafeBrowserApis {
    // Usage:
    // requestAnimationFrame should be called in window context.
    // requestAnimationFrame.call(window, function() { / * doing something * /}
    export const requestAnimationFrame: Function =
        window.requestAnimationFrame || function (callback: Function) {
            // check for function to ensure requestAnimationFrame doesn't act like eval
            if (typeof callback === 'function') {
                window.setTimeout(callback, 16.7);
            }
        };
}
/********************************* Safe browser APIs  ***********************************/

/**
 * Market direction.
 */
export enum Direction {
    // Right to left. Keep right to work with the current CSS implemenation.
    right,

    // Left to right. Keep left to work with the current CSS implemenation.
    left
}

/**
 * An interface to represent an x y coordinate.
 *
 * @export
 * @interface Coordinate
 */
export interface Coordinate {
    x: number;
    y: number;
}

/**
 * List of event types.
 */
export enum  eventTypes {
    animationend,
    blur,
    change,
    click,
    DOMContentLoaded,   // Has to be mixed case like this to work in IE/Edge
    DOMNodeInserted,
    DOMNodeRemoved,
    ended,
    error,
    focus,
    focusin,
    load,
    keydown,
    keypress,
    keyup,
    loadedmetadata,
    mousedown,
    mousemove,
    mouseout,
    mouseover,
    mouseup,
    onreadystatechange,
    resize,
    scroll,
    submit,
    timeupdate,
    touchstart,
    touchend,
    wheel
}

/** Add an event handler to an event target.
* @param {EventTarget | EventTarget[]} target - The event targets to add the event listener to.
* @param {eventTypes} name - The name of the event to add a listener for.
* @param {EventListener} listener - The event listener.
* @param {boolean} useCapture - (optional) true means the event should be handled in the capturing phase; else the bubbling phase
*/
export function addEvent(
    target: EventTarget | EventTarget[],
    eventType: eventTypes,
    listener: EventListener,
    useCapture: boolean = false): void {

    for (let t of toArray(target)) {
        bindEventToDOM(t, listener, useCapture, eventTypes[eventType]);
    }
}

/** Add one or many event handlers to the dom based on the the eventTypes provided.
* @param {EventTarget | EventTarget[]} target - The event targets to add the event listener to.
* @param {string} name - Event name or names. Multiple names should delimited with a space.
* @param {EventListener} listener - The event listener.
* @param {boolean} [useCapture=false] - true means the event should be handled in the capturing phase; else the bubbling phase
*/
export function addEvents(
    target: EventTarget | EventTarget[],
    eventTypes: string,
    listener: EventListener,
    useCapture: boolean = false): void {

    if (isNullOrWhiteSpace(eventTypes)) {
        return;
        }

    for (let t of toArray(target)) {
        for (let eventType of eventTypes.split(/\s+/))
        {
            if (!isNullOrWhiteSpace(eventType)) {
                bindEventToDOM(t, listener, useCapture, eventType);
            }
        }
    }
}

/**
* Remove event handlers to the dom based on the the eventTypes provided.
* @param {EventTarget | EventTarget[]} target - The event targets to add the event listener to.
* @param {string} name - Event name or names. Multiple names should delimited with a space.
* @param {EventListener} listener - The event listener.
* @param {boolean} [useCapture=false] - true means the event should be handled in the capturing phase; else the bubbling phase
*/
export function removeEvents(
    target: EventTarget | EventTarget[],
    eventTypes: string | string[],
    listener: EventListener,
    useCapture: boolean = false): void {

    for (let t of toArray(target)) {
        for (let eventType of toArray(eventTypes)) {
            if (!isNullOrWhiteSpace(eventType)) {
                removeEventFromDOM(t, listener, useCapture, eventType);
            }
        }
    }
}

/** prevent the default behavior of an event.
 * @param  {Event} event - the event.
 * @returns void
 */
export function preventDefault(event: Event): void {
    event = getEvent(event);

    if (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
}

/** Add a throttled event handler to an event target to prevent performance issues when an event is fired frequently (ie mousemove, resize)
* http://demo.nimius.net/debounce_throttle/ has a good demo of throttling and debouncing optimizations of an event.
* @param {EventTarget} target - The event target to add the event listener to.
* @param {eventTypes} name - The name of the event to add a listener for.
* @param {EventListener} listener - The event listener.
* @param {number} threshold - the threshold in milliseconds to throttle to. (default 150ms)
* @returns {Function} - returns a throttled event handler that will be used to be removed if needed.
*/
export function addThrottledEvent(target: EventTarget, name: eventTypes, listener: EventListener, threshold: number = 150): EventListener {
    let timer: number;
    let last = 0;
    let throttledEventHandler = (event: Event) => {
            let now = Date.now();

            clearTimeout(timer);

            if (!!last && (now < last + threshold)) {
                // threshold has not elapsed, throttle this event
                timer = setTimeout(() => {
                    last = now;
                    listener(event); },
                    threshold - (now - last));
            } else {
                last = now;
                listener(event);
            }
    };

    addEvent(
        target,
        name,
        throttledEventHandler
     );

     return throttledEventHandler;
}

/** Add a throttled event handler to elements to prevent performance issues when an event is fired frequently (ie mousemove, resize)
* http://demo.nimius.net/debounce_throttle/ has a good demo of throttling and debouncing optimizations of an event.
* @param {EventTarget} target - The event target to add the event listener to.
* @param {eventTypes} name - The name of the event to add a listener for.
* @param {EventListener} listener - The event listener.
* @param {number} threshold - the threshold in milliseconds to throttle to. (default 150ms)
* @returns {Function} - returns a throttled event handler that will be used to be removed if needed.
*/
export function addThrottledEvents(
    target: EventTarget | EventTarget[],
    eventTypes: string,
    listener: EventListener,
    useCapture: boolean = false,
    threshold: number = 150): EventListener {

    function throttle(listener: EventListener): EventListener {
        let timer: number;
        let last = 0;
        let throttledEventHandler = (event: Event) => {
            let now = Date.now();

            clearTimeout(timer);

            if (!!last && (now < last + threshold)) {
                // threshold has not elapsed, throttle this event
                timer = setTimeout(() => {
                    last = now;
                    listener(event); },
                    threshold - (now - last));
            } else {
                last = now;
                listener(event);
            }
        };

        return throttledEventHandler;
    }

    if (isNullOrWhiteSpace(eventTypes)) {
        return;
        }

    for (let t of toArray(target)) {
        for (let eventType of eventTypes.split(/\s+/)) {
            if (!isNullOrWhiteSpace(eventType)) {
                let throttledListener = throttle(listener);
                bindEventToDOM(t, throttledListener, useCapture, eventType);
            }
        }
    }
}

/** Add a debounced event handler to an event target.
* @param {EventTarget} target - The event target to add the event listener to.
* @param {eventTypes} name - The name of the event to add a listener for.
* @param {EventListener} listener - The event listener.
* @param {number} delay - the number of milliseconds to delay for during throttling.
* @returns {EventListener} - returns a debounced event handler that will be used to be removed if needed.
*/
export function addDebouncedEvent(target: EventTarget, name: eventTypes, listener: EventListener, delay: number = 150): EventListener {
    let timer: number;
    let debounceEventHandler = (event: Event) => {
            window.clearTimeout(timer);
            timer = setTimeout(() => { listener(event); }, delay);
    };

    addEvent(
        target,
        name,
        debounceEventHandler
        );

    return debounceEventHandler;
}

/**
 * Call an event listener when document is ready.
* @param  {EventListener} listener
* @returns void
*/
export function documentReady(listener: EventListener): void {
    if (document.readyState !== 'loading') {
        listener.call(null);
    } else if (document.addEventListener) {
        document.addEventListener(eventTypes[eventTypes.DOMContentLoaded], listener, false);
    } else if ((<any>document).attachEvent) {
        (<any>document).attachEvent(eventTypes[eventTypes.onreadystatechange], function () {
            if (document.readyState !== 'loading') {
                listener.call(null);
            }
        });
    }
}

/**
 * Deferred a call back call either on load or on timeout of on load.
 *
 * @export
 * @param {EventListener} listener -- a call back to be executed.
 * @param {number} onLoadTimeout - an onload timeout.
 * Usage:
 * var callBackFunction = function() {/ * does something * /};
 * onDeferred(callBackFunction, 4000);
 * Usage with arrow function
 * onDeferred(() => {/ * do something * /}, 4000)
 */
export function onDeferred(listener: EventListener, onLoadTimeout: number): void {
    let timeoutAwareListener: EventListener;

    let deferredTimeout = setTimeout(() => {
        clearTimeout(deferredTimeout);
        removeEvent(window, eventTypes.load, timeoutAwareListener);
        listener.call(null);
    }, onLoadTimeout);

    timeoutAwareListener = () => {
        clearTimeout(deferredTimeout);
        // make it async to release the main thread.
        SafeBrowserApis.requestAnimationFrame.call(window, listener);
    };

    if (document.readyState === 'complete') {
        clearTimeout(deferredTimeout);
        listener.call(null);
    } else {
        addEvent(window, eventTypes.load, timeoutAwareListener);
    }
}

/** Add a css class to an element.
 * @param  {HTMLElement} element - The element to add the css class to.
 * @param  {string} cssClass - The css class to add.
 */
export function addClass(element: HTMLElement, cssClass: string): void {
    if ((!!element) && (!isNullOrWhiteSpace(cssClass)) && (!hasClass(element, cssClass))) {
        if (element.classList) {
            element.classList.add(cssClass);
        } else {
            element.className = (element.className + ' ' + cssClass).trim();
        }
    }
}

/** Remove a css class from an element.
 * @param  {HTMLElement | HTMLElement[]} element - The element(s) to remove the css class from.
 * @param  {string} cssClass - The css class to remove.
 */
export function removeClass(elements: HTMLElement | HTMLElement[], cssClass: string): void {
    if ((!!elements) && (!isNullOrWhiteSpace(cssClass))) {
        for (let element of toArray(elements)) {
            if (element.className) {
                element.className = (' ' + element.className + ' ').replace(' ' + cssClass.trim() + ' ', ' ').trim();
            }
        }
    }
}

/** Remove an array of css classes from an element.
 * @param  {HTMLElement} element - The element to remove the css class from.
 * @param  {string[]} cssClasses - The css classes to remove.
 */
export function removeClasses(element: HTMLElement, cssClasses: string[]): void {
    if (cssClasses) {
        for (let cssClass of cssClasses) {
            removeClass(element, cssClass);
        }
    }
}

/** Add an array of css classes from an element.
 * @param  {HTMLElement} element - The element to remove the css class from.
 * @param  {string[]} cssClasses - The css classes to be added.
 */
export function addClasses(element: HTMLElement, cssClasses: string[]): void {
    if (cssClasses) {
        for (let cssClass of cssClasses) {
            addClass(element, cssClass);
        }
    }
}

/** Checks for the presence of a css class on an element.
 * @param  {HTMLElement} element - The element to check the css class of.
 * @param  {string} cssClass - The css class to check for.
 * @return True if the element's className has the specified class, otherwise false.
 */
// TODO: user classList for supported browsers
export function hasClass(element: HTMLElement, cssClass: string): boolean {
    return ((!element) || isNullOrWhiteSpace(cssClass) ||
        isNullOrWhiteSpace(element.className)) ?
        false :
        (' ' + element.className + ' ').indexOf(' ' + cssClass.trim() + ' ') > -1;
}

/**
 * Removes an element from the DOM
 * @param element - The HTMLElement to remove
 * @return {Node} - The removed node.
 */
export function removeElement(element: HTMLElement): Node {
    return element ? element.parentElement.removeChild(element) : element;
}

/** Select elements in a context.
* @param  {string} selector - can be class, id or tag selector.
* @param  {HTMLElement} [context] - any element to scope the selection. It's optional. If not provided document will be assumed.
* @returns HTMLElement[]
*/
export function selectElements(selector: string, context?: HTMLElement): HTMLElement[] {
    return selectElementsT<HTMLElement>(selector, context);
}

/** Select first element from the selected elements using provided selector.
* @param {string} selector - element selector.
* @param {HTMLElement} [context] - an optional context to scope the selection.
* @returns {HTMLElement} - the first element from the match.
*/
export function selectFirstElement(selector: string, context?: HTMLElement): HTMLElement {
    let elementsSelected = selectElementsT<HTMLElement>(selector, context);
    return (!elementsSelected || !elementsSelected.length) ? null : elementsSelected[0];
}

/** Select elements in a context.
 * @param  {string} selector - can be class, id or tag selector.
 * @param  {HTMLElement} [context] - any element to scope the selection. It's optional. If not provided document will be assumed.
 * @returns T[]
 */
// TODO (sekeatin) Add support for "> a" -> ":scope > a" selector support
export function selectElementsT<T extends HTMLElement>(selector: string, context?: HTMLElement): T[] {
    if (isNullOrWhiteSpace(selector)) {
        return [] as T[];
    }

    let currentContext: HTMLElement | Document = context || document;

    // check if the first character is class or id.
    if (/^[\#.]?[\w-]+$/.test(selector)) {
        switch (selector[0]) {
            case '.':
                if (currentContext.getElementsByClassName) {
                    return nodeListToArray(currentContext.getElementsByClassName(selector.slice(1)) as NodeListOf<T>);
                } else {
                    return nodeListToArray(currentContext.querySelectorAll(selector) as NodeListOf<T>);
                }
            case '#':
                let element = currentContext.querySelector(selector);
                return (element ? [element] : []) as T[];
        }

        return nodeListToArray(currentContext.getElementsByTagName(selector) as NodeListOf<T>);
    }

    return nodeListToArray(currentContext.querySelectorAll(selector) as NodeListOf<T>);
}

/** Select first element from the selected elements using provided selector.
* @param {string} selector - element selector.
* @param {HTMLElement} [context] - an optional context to scope the selection.
* @returns {T} - the first element from the match.
   */
export function selectFirstElementT<T extends HTMLElement>(selector: string, context?: HTMLElement): T {
    let elementsSelected = selectElementsT<T>(selector, context);
    return (!elementsSelected || !elementsSelected.length) ? null : elementsSelected[0];
}

/**
 * Select elements in a context with a comma delimited list of selectors.
 *
 * @export
 * @param {string} selectorsr - comma delimited list of classes, ids or tag selectors.
 * @param  {Element} [context] - any element to scope the selection. It's optional. If not provided document will be assumed.
 * @returns Element[]
 */
export function selectElementsFromSelectors(selectors: string, context?: Element): Element[] {
    let currentContext: any = context || document;
    let selectorList: string[];
    let selectedList: Element[];

    selectorList = selectors.split(',');

    for ( let selector of selectorList) {
        selectedList += this.selectElements(selector, currentContext);
    }
    return selectedList;
}

/**
 * Convert node list to array.
 * @param  {NodeListOf<T extends Node>} nodeList
 */
export function nodeListToArray<T extends Node>(nodeList: NodeListOf<T> | NodeListOf<Element> |
    HTMLCollection | NodeList | NamedNodeMap): T[] {
    if (!nodeList) {
        return [];
    }

    let elements: T[] = [];

    for (let n = 0; n < nodeList.length; n++) {
        elements.push(<T>nodeList[n]);
    }

    return elements;
}

/** get the dir attribute value from html element.
* @returns string - the dir information from the html element.
*/
export function getDirection(context = document.documentElement): Direction {
    while (context !== null) {
        let dir = context.getAttribute('dir');
        if (!!dir) {
            return dir === 'rtl' ? Direction.right : Direction.left;
        } else {
            context = context.parentElement;
        }
    }

    return Direction.left;
}

/** Gets the client bounding rectangle of an element.
* @param  {any} element - an element to check its bounding client rectangle.
* @returns {any} - an object bag that has top, bottom, left, right, width & height.
*/
/* tslint:disable */
export function getClientRect(element: HTMLElement): any {
    if (!element) {
        return;
    }

    let box = element.getBoundingClientRect();
    let clone: any = {};

    // need to clone and add width and height for IE8.
    // we can't add in the object itself because it returns freeze() object that couldn't accept additional property.
    for (var property in box) {
        // ClientRect's hasOwnProperty fails so we can't use it to check
        // our copy. This just copies directly
        // that is the reason tslint:disable added at the top of the method because forin rule fails with this code.
        clone[property] = (<any>box)[property];
    }

    if (typeof clone.width === 'undefined') {
        clone.width = element.offsetWidth;
    }

    if (typeof clone.height === 'undefined') {
        clone.height = element.offsetHeight;
    }

    return clone;
}

/** Sets or gets CSS properties
 * @param  {HTMLElement} element
 * @param  {string} property - The CSS property name
 * @param  {any} [value] - The value to set on the CSS property
 * @returns {any} - The value of the CSS property
 */
export function css(element: HTMLElement | Node, property: string, value?: any): any {
    if (!element) {
        return null;
    }

    if (!!value || value === '') {
        (<any>element).style[property] = value;
    } else {
        value = (<any>element).style[property];

        if (isNullOrWhiteSpace(value)) {
            value = getComputedStyle(element as any);
            value = value[property];
        }

        return value;
    }
}

/**
* Remove an event from an {EventTarget} or {EventTarget[]}.
* @param eventTargets - The {EventTarget[]} to detattach from.
* @param eventType - The event type name.
* @param listener - The event listener.
* @param [useCapture] - Whether or not the useCapture flag was added to the original listener.
*/
export function removeEvent(eventTargets: EventTarget | EventTarget[], name: eventTypes, listener: EventListener, useCapture? : boolean): void {
    if (!eventTargets || !name || !listener) {
        return;
    }
    for (let target of toArray(eventTargets)) {
        removeEventFromDOM(target, listener, useCapture, eventTypes[name]);
    }
}

/**
* Check if an object is an Array. Returns true if the supplied object is an Array, false otherwise.
* @param obj - The object that to check.
*/
export function isArray(obj: any) {
    return Array.isArray ?
        Array.isArray(obj) :
        ({}).toString.call(obj) === '[object Array]';
}

/**
 * Coerces objects into Arrays if they aren't already an Array. If
 * the supplied object is already an array, returns that object.
 * @param obj - The object to arrayify.
 */
export function toArray(obj: any) {
    return isArray(obj) ? obj : [obj];
}

 /**
 * @name - isDescendent
 * @description - Checks to see if an element is a child of another element
 * @param {HTMLElement} parent - The element that child is checked against
 * @param {HTMLElement} child - The element being checked
 * @returns {boolean, null} - returns null if either @param is a null value
 * @export
 */
export function isDescendent(parent: HTMLElement, child: HTMLElement) {
    if (parent == null || child == null) {
        return null;
    }

    let ancestor = child.parentNode;

    while (ancestor != null) {
        if (ancestor === parent) {
            return true;
        } else {
            ancestor = ancestor.parentNode;
        }
    }

    return false;
}

/**
* @name - getText
* @description - Get the text content of an HTMLElement
* @public
* @param  {HTMLElement | Element} element - The element to get the text of.
* @returns {string} - The element's text content.
*/
export function getText(element: HTMLElement | Element) {
    return !!element ? (<HTMLElement>element).innerText || element.textContent || '' : '';
}

/**
* @name - setText
* @description - Sets the text content of an HTMLElement
* @public
* @param  {HTMLElement} element - The element to add the text to.
* @param  {HTMLElement} text - The text to add to the element.
* @returns {Void}
*/
export function setText(element: HTMLElement, text: string) {
    if (!!element &&  text !== null) {
        element.textContent ? element.textContent = text : element.innerHTML = text;
    }
}

/**
 * Remove all inner HTML from a parent element - used to delete child elements
 * @param {HTMLElement} parentElement - the parent element from which all children should be removed
 * @returns void
 */
export function removeInnerHtml(parentElement: HTMLElement): void {
    if (parentElement) {
        parentElement.innerHTML = '';
    }
}

/**
 * @name - getEventTargetOrSrcElement
 * @description - Gets the event target element or event src element.
 * @param {Event} event - The event.
 * @returns {HTMLElement} - The event element.
 */
export function getEventTargetOrSrcElement(event: Event): HTMLElement {
    event = getEvent(event);
    return (event.target || event.srcElement) as HTMLElement;
}

/**
 * @name getEvent
 * @description - Gets the event from the passed event or the window event.
 * @param {Event} event - The event.
 * @returns - The event.
 */
export function getEvent(event: Event): Event {
    return event || window.event;
}

/**
 * Binds an event handler to a target.
 *
 * @param {EventTarget} target - an event target.
 * @param {EventListener} listener - a listner to an event.
 * @param {boolean} [useCapture=false] - a flag to indicate either to use a capture or not.
 * @param {string} eventType - an event name.
 */
function bindEventToDOM(target: EventTarget,
    listener: EventListener,
    useCapture: boolean = false,
    eventType: string) {
    if (!!target) {
        window.addEventListener
        ? target.addEventListener(eventType, listener, useCapture)
        : (target as any).attachEvent('on' + eventType, listener);
    }
}

/**
 * remove an event handler from a target.
 *
 * @param {EventTarget} target - an event target.
 * @param {EventListener} listener - a listner to an event.
 * @param {boolean} [useCapture=false] - a flag to indicate either to use a capture or not.
 * @param {string} eventType - an event name.
 */
function removeEventFromDOM(target: EventTarget,
    listener: EventListener,
    useCapture: boolean = false,
    eventType: string) {
    if (!!target) {
        window.removeEventListener
            ? target.removeEventListener(eventType, listener, useCapture)
            : (target as any).detachEvent('on' + eventType, listener);
    }
}

/**
 * Fires custom event.
 * @export
 * @param {HTMLElement} element - an element to fire a custom event.
 * @param {eventTypes | string} eventType - the name of custom event.
 * @param {*} [data] - data to be attached to the custom event.
 * @return {Event} - the created custom event
*/
export function customEvent(element: HTMLElement, eventType: eventTypes | string, data: any = {}): Event {
    if (!element || !eventType) {
        return null;
    }

    let eventName: string = (typeof eventType === 'string') ? eventType : eventTypes[eventType];
    let event: Event = null;
    data.bubbles = typeof data.bubbles === 'undefined' ? true : data.bubbles;
    data.cancelable = typeof data.cancelable === 'undefined' ? true : data.cancelable;

    // IE9 and above adds CustomEvent as object to the window, but with correct implementations, it should be a function
    // Check if CustomEvent is function to avoid exceptions in IE9 and above
    if ((window as any).CustomEvent && typeof (window as any).CustomEvent === "function") {
        event = new CustomEvent(eventName, data);
    } else if (document.createEvent) {
        event = document.createEvent('CustomEvent');
        (event as any).initCustomEvent(eventName, data.bubbles, data.cancelable, data.detail);
    } else {
        event = (document as any).createEventObject();
        (element as any).fireEvent('on' + eventName, event);
    }

    element.dispatchEvent(event);

    return event;
}

/**
 * stop propagation of an event
 *
 * @param {EventTarget} target - an event target.
 * @return {void}
 */
export function stopPropagation(event: Event): void {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.returnValue = false;
    }
}

/**
* @name - getScrollY
* @description - Get cross-browser window scrollY.
* @param {Window} - context?: the context of the call, defaults to window
* @return {number}
*/
export function getScrollY(context: Window = window): number {
    return context.scrollY || context.pageYOffset || ((context.document.compatMode === "CSS1Compat") ? context.document.documentElement.scrollTop : context.document.body.scrollTop);
}

/**
 * @name - getOffsetParent
 * @description - Get the OffsetParent of the given element. This function returns the documentElement if there
 * is no offsetParent above the element
 * @export
 * @param {HTMLElement} element The element to get the offsetParent of
 * @return {HTMLElement} The offsetParent of the element or the documentElement if there is no parent in between
 */
export function getOffsetParent(element: HTMLElement): HTMLElement {
    // This function is largely inspired by jQuery source. CTRL+F for `offsetParent:` to find it.
    // https://code.jquery.com/jquery-3.1.1.js

    if (!element) {
        return window.document.documentElement;
    }

    let docElement = element.ownerDocument.documentElement;
    let offsetParent = <HTMLElement>element.offsetParent;

    while (offsetParent && css(offsetParent, "position") == "static") {
        offsetParent = <HTMLElement>offsetParent.offsetParent;
    }

    return offsetParent || docElement;
}

/**
* @name - scrollElementIntoView
* @description - Scrolls the element into view within its scroll container.
* @export
* @param {HTMLElement} element - The element to scroll into view.
* @param {HTMLElement} scrollContainer - The scroll container of the element.
* @returns {void}
*/
export function scrollElementIntoView(element: HTMLElement, scrollContainer: HTMLElement): void {
    if (!element || !scrollContainer) {
        return;
    }

    const height = scrollContainer.clientHeight;
    const scrollHeight = scrollContainer.scrollHeight;

    if (scrollHeight > height) {
        scrollContainer.scrollTop = Math.min(element.offsetTop - (<HTMLElement>scrollContainer.firstElementChild).offsetTop, scrollHeight - height);
    }
}

/**
 * @name - isImageLoadedSuccessfully
 * @description - Determines whether or not an image is loaded successfully
                  see http://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-in-javascript
 * @param {HTMLImageElement} - image: The image element
 * @return {boolean} - If true, image is loaded successfully; else false
 * @todo - 9256666 - write unit tests
 */
export function isImageLoadedSuccessfully(image: HTMLImageElement): boolean {
    // If the browser doesn't support complete or naturalHeight then we can't know for certain whether the image correctly loaded or not.
    if (typeof image.complete !== 'undefined' && typeof image.naturalHeight !== 'undefined') {
        return image && image.complete && image.naturalHeight > 0;
    }

    // Return true to allow default browser behavior to happen so we don't accidentally replace a good image with a placeholder.
    return true;
}

/**
 * @name - getCoordinates
 * @description - get coordinates from an event
 * @export
 * @param {*} event - an event to read coordinates from
 * @returns {Coordinate}
 */
export function getCoordinates(event: any) : Coordinate {
    let touches = event.touches && event.touches.length ? event.touches : [event];
    let eventObject = (event.changedTouches && event.changedTouches[0]) || touches[0];

    return {
        x: eventObject.clientX,
        y: eventObject.clientY
    };
}

/**
 * @name - getParent
 * @description - Steps parent by parent until it finds the parent with the requested selector - Will return 'null' if a parent does not exist
 * @export
 * @param {HTMLElement} element
 * @param {string} selector
 * @returns {HTMLElement}
 */
export function getParent (element: HTMLElement, selector: string): HTMLElement {
    /**
     * TODO: Task 10141507
     * Add test for this method
     */

    let matchesSelector = element.matches || element.webkitMatchesSelector || (element as any).mozMatchesSelector || element.msMatchesSelector;

    while (element) {
        if (matchesSelector.call(element, selector)) {
            break;
        }
        element = element.parentElement;
    }
    return element;
}