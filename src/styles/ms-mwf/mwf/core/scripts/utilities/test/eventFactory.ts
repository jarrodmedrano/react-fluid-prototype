/// <amd-module name="eventFactory"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {extend} from 'utility';

/**
 * @name - createKeyboardEvent
 * @description - Creates a KeyboardEvent abstracting browser compatibility.
 *                This method is intended to only be used by jasmine .spec.ts tests, not production code!
 *                It has only been tested with the most recent versions of IE/Edge/Chrome/FF/webkit.
 *                It only only supports minimal modifier mapping and no locale mapping because that's
 *                all that we require for jasmine testing purposes at this point.
 * @export
 * @param {string} eventType - The event type.
 * @param {KeyboardEventInit} params - The KeyboardEvent parameters.
 * @returns {KeyboardEvent} - A KeyboardEvent.
 */
export function createKeyboardEvent(eventType: string, params: KeyboardEventInit): KeyboardEvent {
    let keyboardEvent: KeyboardEvent;

    params = extend({ bubbles: true, cancelable: true, view: window, repeat: false }, params);

    try {
        // First try to use the KeyboardEvent constructor pattern. This should work for Chrome/FF/Edge.
        keyboardEvent = new KeyboardEvent(eventType, params);
    } catch (exception) {
        try {
            // Second try to use the createEvent()/initEvent() pattern. This should work for IE and PhantomJS.
            keyboardEvent = document.createEvent('KeyboardEvent');

            // Initialize the modifiers, just looking at shiftKey until we need more.
            let modifiers = params.shiftKey ? 'Shift' : '';

            // Initialize the Keyboardevent from the params, ignoring the locale/location mapping until we need it.
            keyboardEvent.initKeyboardEvent(
                eventType,
                params.bubbles,
                params.cancelable,
                params.view,
                params.key,
                params.location,
                modifiers,
                params.repeat,
                '');

            if (params.shiftKey && !keyboardEvent.shiftKey) {
                // Assume the initKeyboardEvent signature in use is non-standard
                throw 'non-standard initKeyboardEvent signature';
            }
        } catch (exception) {
            // Assume the standard initKeyboardEvent signature didn't match, try the non-standard webkit signature.
            keyboardEvent = document.createEvent('KeyboardEvent');

            try {
                (<any>keyboardEvent).initKeyboardEvent(
                    eventType,
                    params.bubbles,
                    params.cancelable,
                    params.view,
                    params.key,
                    0,
                    params.ctrlKey,
                    params.altKey,
                    params.shiftKey,
                    params.metaKey,
                    params.modifierAltGraph);
            } catch (exception) {
                // Do nothing, return undefined.
            }
        }
    }

    return keyboardEvent;
}

/**
 * @name - createMouseEvent
 * @description - Creates a MouseEvent abstracting browser compatibility.
 *                This method is intended to only be used by jasmine .spec.ts tests, not production code!
 *                It has only been tested with the most recent versions of IE/Edge/Chrome/FF.
 *                It only only supports minimal modifier mapping and no locale mapping because that's
 *                all that we require for jasmine testing purposes at this point.
 * @export
 * @param {string} eventType - The event type.
 * @param {MouseEventInit} [params = {}] - The MouseEvent parameters.
 * @returns {MouseEvent} - A MouseEvent.
 */
export function createMouseEvent(eventType: string, params: MouseEventInit = {}): MouseEvent {
    let mouseEvent: MouseEvent;

    params = extend({ bubbles: true, cancelable: true }, params);

    try {
        // First try to use the MouseEvent constructor pattern.  This should work for Chrome/FF/Edge.
        mouseEvent = new MouseEvent(eventType, params);
    } catch (exception) {
        try {
            // Second try to use the createEvent()/initEvent() pattern. This should work for IE and PhantomJS.
            mouseEvent = document.createEvent('MouseEvent');
            mouseEvent.initMouseEvent(
                eventType,
                params.bubbles,
                params.cancelable,
                window,
                params.detail,
                params.screenX,
                params.screenY,
                params.clientX,
                params.clientY,
                params.ctrlKey,
                params.altKey,
                params.shiftKey,
                params.metaKey,
                params.button,
                params.relatedTarget
            );
        } catch (exception) {
            // Do nothing, return undefined.
        }
    }

    return mouseEvent;
}