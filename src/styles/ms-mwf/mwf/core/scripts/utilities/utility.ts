/// <amd-module name="utility"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {isNullOrWhiteSpace} from 'stringExtensions';

/**
* @name - isNumber
* @description - Checks whether the provided value is a 'number' and not a NaN.
* @export
* @param {any} value - The value to test.
* @returns {boolean} - True if number, otherwise false
*/
export function isNumber(value: any): boolean {
    return ((!isNaN(value)) && ((typeof value) === 'number'));
}

/**
* @name - getWindowWidth
* @description - Gets the current window width.
* @export
* @returns {number} - The current window width.
*/
export function getWindowWidth(): number {
    let clientWidth = window.innerWidth && document.documentElement.clientWidth ?
        Math.min(window.innerWidth, document.documentElement.clientWidth) :
        window.innerWidth ||
        document.documentElement.clientWidth;
    return clientWidth;
}

/**
* @name - getWindowHeight
* @description - Gets the current window height.
* @export
* @returns {number} - The current window height.
*/
export function getWindowHeight(): number {
    return window.innerHeight && document.documentElement.clientHeight
        ? Math.min(window.innerHeight, document.documentElement.clientHeight)
        : window.innerHeight || document.documentElement.clientHeight;
}

/**
* @name - getDimensions
* @description - Gets the dimension of an element.
* @export
* @param  {HTMLElement} containerElement - The container element.
* @returns {IClientDimension} - The client dimension.
*          {IClientDimension.width} - The client width
*          {IClientDimension.height} - The client height
*/
export function getDimensions(containerElement: HTMLElement): IClientDimension {
    if (containerElement == null) {
        return;
    }
    return {
        width: containerElement.clientWidth,
        height: containerElement.clientHeight
    };
}

/**
* @name - getVirtualKey
* @description - Gets the virtual key string associated with a keyboard event.
*                This method is for use with DOM level 4 and up events that use the key property.
*                It also has (hopefully temporary) hacks to map around the non-standard
*                keyIdentity property used by the QtWebKit that PhantomJs uses and the
*                non-standard key identifier values used by Edge.
* @export
* @param  {KeyboardEvent} event - The keyboard event.
* @returns {string} - The virtual key string.
*/
export function getVirtualKey(event: KeyboardEvent): string {
    let virtualKey: string;

    event = event || window.event as KeyboardEvent;

    if (!event) {
        return virtualKey;
    }

    // TODO: 9575694 - Remove this compatibility mapping once phantomjs+qtwebkit (argh) uses the W3C standard
    //         KeyboardEvent.key property instead of KeyboardEvent.keyIdentifier.
    virtualKey = event.key || (<any>event).keyIdentifier;

    if (!virtualKey) {
        return virtualKey;
    }

    // TODO: 9575694 - Remove this compatibility mapping once Edge (argh) reports the W3C standard key identifiers.
    //          Spec: http://www.w3.org/TR/uievents-key/#keys-navigation
    //          Test page: http://www.movable-type.co.uk/dev/keyboardevent-key-values.html
    switch (virtualKey) {
        case 'Left': return 'ArrowLeft';
        case 'Right': return 'ArrowRight';
        case 'Up': return 'ArrowUp';
        case 'Down': return 'ArrowDown';
        case 'Esc': return 'Escape';
        default: return virtualKey;
    }
}

/**
* @name - getKeyCode
* @description - Gets the numeric key code associated with a keyboard event.
*                This method is for use with DOM level 3 events that still
*                use the deprecated keyCode property.
* @export
* @param  {KeyboardEvent} event - The keyboard event.
* @returns {number} - The key code.
*/
export function getKeyCode(event: KeyboardEvent): number {
    event = event || window.event as KeyboardEvent;
    return (event == null) ? null : event.which || event.keyCode || event.charCode;
}

/**
* @name - setCookie
* @description - Assigns the given value to the named cookie.
*                Optionally, an expiary date can be assigned, which is {days} days from now.
* @export
* @public
* @param name - The name of the cookie.
* @param value - The value for the cookie.
* @param path - The path where the cookie is used.
* @param days - Th enumber of days from now you would to make the expiary date for the new cookie.
* @returns {void}
*/
export function setCookie(name : string, value : string, path : string, days? : number): void {
    let expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }

    window.document.cookie = name + '=' + encodeURIComponent(value) + expires + `; path=${path};`;
}

/**
* @name - getCookie
* @description - Get the value associated with the given cookie.
* @export
* @public
* @param name - The name of the cookie.
* @returns {string} - The value of the specified cookie if the cookie exists, otherwise null.
*/
export function getCookie(name: string): string {
    if (!!name) {
        for (let cookie of document.cookie.split('; ')) {
            let delimiterIndex = cookie.indexOf('=');
            let cookieName = decodeQuotedCookie(cookie.substring(0, delimiterIndex));

            if (cookieName === name) {
                return decodeQuotedCookie(cookie.substring(cookieName.length + 1));
            }
        }
    }

    return null;
}

/**
* @name - decodeQuotedCookie
* @description - Decodes the given cookie value, removing quotes.
* @private
* @param value - The value of the cookie.
* @returns {string} - The decoded value.
*/
function decodeQuotedCookie(value: string): string {
    value = decodeURIComponent(value.replace('/\+/g', ' '));
    //unRfc2068
    if (value.indexOf('"') === 0) {
        // This is a quoted cookie as according to RFC2068, unescape
        value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    return value;
}

/**
* @name - detectContrast
* @description -
*      Gets the contrast value for the specified hex color value (RRGGBB).
*      http://stackoverflow.com/questions/5650924/javascript-color-contraster
* @export
* @param  {string} hexValue - The color hexValue.
* @returns {Contrast} - The contrast value if detectable, otherwise null.
*/
export function detectContrast(hexValue: string): Contrast {
    if (!!hexValue && (hexValue.length === 6)) {
        let red = parseInt(hexValue.substring(0, 2), 16);
        let green = parseInt(hexValue.substring(2, 4), 16);
        let blue = parseInt(hexValue.substring(4, 6), 16);

        if (!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
            let brightness = ((red * 299) + (green * 587) + (blue * 114)) / 255000;
            return (brightness >= 0.5) ? Contrast.dark : Contrast.light;
        }
    }

    return null;
};

/**
* @name - pointInRect
* @description - Determines if the specified point lies within the specified rectangle.
*                Note this assumes the HTML coordinate system where top is less than bottom.
* @export
* @public
* @param  {number} x - The x coordinate of the point.
* @param  {number} y - The y coordinate of the point.
* @param  {ClientRect} rectangle - The rectangle.
* @returns {boolean} - True if the point lies within the rectangle, otherwise false.
*/
export function pointInRect(x: number, y: number, rectangle: ClientRect): boolean {
    if (!rectangle || !isNumber(x) || !isNumber(y) ||
        !isNumber(rectangle.left) || !isNumber(rectangle.right) ||
        !isNumber(rectangle.top) || !isNumber(rectangle.bottom)) {
        return false;
    }

    return (x >= rectangle.left) && (x <= rectangle.right) && (y >= rectangle.top) && (y <= rectangle.bottom);
};

/**
* @name - apiDeprecated
* @description - Write an error message to console for deprecated methods.
* @export
* @public
* @param  {string} message - The message to write to the error console.
* @returns {void}
*/
export function apiDeprecated(message: string) {
    if (console && console.warn) {
        console.warn(message);
    } else  if (console && console.error) {
        console.error(message);
    }
}

/**
* @name - createPerfMarker
* @description - Creates a performance marker if supported and have the switch available.
* @export
* @public
* @param  {string} message - The message to write to the error console.
* @returns {void}
*/
export function createPerfMarker(name: string): void {
    // This is ONERF specific code for perf analysis.
    /*!/#IFDEF perf_marker_global || log_define_timing */
    if (isNullOrWhiteSpace(name) || !window.performance || !window.performance.mark) {
        return;
    }

    let normalizedName = name.split(' ').join('_');
    // Create the performance mark
    window.performance.mark(normalizedName);

    if (window.console && (window as any).console.timeStamp) {
        (window as any).console.timeStamp(normalizedName);
    }
    /*!/#ENDIF*/
}

/**
* @name - toElapsedTimeString
* @description - Formats the number (of seconds) as elapsed time.
* @export
* @public
* @param  {number} seconds - The number of elapsed seconds.
* @returns {string} - The elapsed time in h:mm:ss format.
*/
export function toElapsedTimeString(seconds: number): string {
    if (!isNumber(seconds) || (seconds <= 0)) {
        return '00:00';
    }

    let hours = Math.floor(seconds / 3600);
    let remainder = seconds % 3600;
    let minutes = Math.floor(remainder / 60);
    let elapsedTime = (hours > 0) ? hours + ':' : '';

    seconds = Math.floor(remainder % 60);
    elapsedTime += ((minutes < 10) ? '0' : '') + minutes;
    elapsedTime += ':' + ((seconds === 0) ? '00' : (((seconds < 10) ? '0' : '') + seconds));

    return elapsedTime;
};

/**
* @name - parseJson
* @description - Parses a json string into an object.
* @public
* @export
* @param {string} json - The json to parse.
* @returns {any} - The object defined by the json if the parse succeeds.
* @throws {any} - JSON.parse() may throw or we may throw is JSON.parse is unavailble.
*/
export function parseJson(json: string): any {
    if (!JSON || !JSON.parse) {
        throw new Error('JSON.parse unsupported.');
    }

    if (!json) {
        throw new Error('Invalid json.');
    }

    return JSON.parse(json);
}

/**
* @name - extend
* @description - extends an object with properties/values from one or more others.
* @export
* @public
* @param  {any[]} parameters - The objects to merge together.
* @returns {any} - The extended object.
*/
export function extend(...parameters: any[]): any {
    for (let index = 1; index < parameters.length; index++) {
        for (let key in parameters[index]) {
            if (parameters[index].hasOwnProperty(key)) {
                if (typeof parameters[index][key] === 'object') {
                    parameters[0][key] = extend(parameters[0][key] || {}, parameters[index][key]);
                } else {
                    parameters[0][key] = parameters[index][key];
                }
            }
        }
    }

    return arguments[0];
}

/**
 * @name - poll
 * @description - Generic polling function which polls for certain criteria. If criteria is met, stop and call successCallback.
 *                If criteria is not met, try again after a certain interval.
 *                If a timeout and timeoutCallback are provided, discontinue polling and call timeoutCallback if timeout is
 *                exceeded before criteria is met.
 * @export
 * @public
 * @param {Function} checkcriteria - Function which determines whether or not a desired criteria has been met and returns true if yes.
 *                                    For example, the function might evaluate to something like:
 *                                    return document.getElementById('someId').offsetTop > 0;
 * @param {number} interval - value (in milliseconds, 100 by default) which defines how often to check the conditon
 * @param {number} timeout - timeout value (in milliseconds); if not provided or provided value is less than zero,
 *                           then there is no timeout
 * @param {Function} successCallback - optional function to call when the criteria is met - if not provided, polling will quietly stop
 * @param {Function} timeoutCallback - optional function to be called when the poll times out - if not provided, polling will quietly stop
 * @todo - 8495865 - add unit tests for this method
 */
export function poll(
    checkCriteria: Function, interval: number, timeout: number, successCallback?: Function,  timeoutCallback?: Function): void {

        let endTime: number;
        if (!timeout || timeout < 0) {
            endTime = Number(new Date('9999-12-31'));
        } else {
            endTime = Number(new Date()) + timeout;
        }

        interval = interval || 100;

        (function internalPoll() { 
            let successful = checkCriteria();
            if (successful && successCallback) {
                successCallback();
            } else if (successful) {
                // criteria met without successCallback provided - quietly stop
                return;
            } else if (Number(new Date()) < endTime) {
                setTimeout(internalPoll, interval);
            } else if (timeoutCallback) {
                timeoutCallback();
            } else {
                // timeout exceeded without timeoutCallback provided - quietly stop
                return;
            }
        })();
}

/**
 * @name - getQSPValue
 * @description - Gets a query string parameter value from a URL.
 * @export
 * @param {string} queryStringParamName - The query string parameter name.
 * @returns {string} - The QSP’s value if present, otherwise an empty string.
*/
export function getQSPValue(queryStringParamName: string) : string {
    queryStringParamName = queryStringParamName.replace(/[\[\]]/g, '\\$&'); 
    let regex = new RegExp('[\\?&]' + queryStringParamName.toLowerCase() + '=([^&#]*)');
    let results = regex.exec(location.search.toLowerCase());
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/**
 * @name - Viewports
 * Config describing various attributes of the css viewport values for MWF.
 */
export module Viewports {
    export const enum Names {vp1 = 1, vp2, vp3, vp4, vp5, vp6}
    export const allWidths = [320, 540, 768, 1084, 1400, 1779];
    export const vpMin = allWidths[0];
    export const vpMax = 2048;

    /**
     * Get the mwf vp-* number representing the grid viewport.
     *
     * @static
     * @returns {Names} - the mwf vp-* number representing the grid viewport.
     */
    export function getViewport(): Names {
        if (window.matchMedia) {
            for (let i = 0; i < allWidths.length; ++i) {
                if (!window.matchMedia('(min-width:' + allWidths[i] + 'px)').matches) {
                    return i;
                }
            }
        } else {
            for (let i = 0; i < allWidths.length; ++i) {
                if (!(getWindowWidth() >= allWidths[i])) {
                    return i;
                }
            }
        }
        return allWidths.length;
    }
}

export const enum Contrast { light = 1, dark }

export interface IClientDimension {
    width: number;
    height: number;
}

/* A type safe Dictionary<string, string> */
export interface IDictionaryStringString {
    [key: string]: string;
}

/* A type safe string based dictionary */
export interface INameToValueMap {
    [key: string]: any;
}

/**
* @interface IGrid
* @classdesc - The IGrid interface contract.
* @export
*/
export interface IGrid {
    rows: number;
    columns: number;
}