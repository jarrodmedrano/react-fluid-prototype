/// <amd-module name="button"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {
    addEvent,
    customEvent,
    eventTypes,
    preventDefault,
    removeEvent
} from 'htmlExtensions';
import {getKeyCode} from 'utility';
import {keycodes} from 'keycodes';
/**
* @class - Button
* @classdesc - The Button component
* @description - The primary purpose of this script is to ensure that a
*                'button' built with an anchor element will emit the same events
*                as a button element.
* @export
*/
export class Button extends ObservableComponent {
    /**
    * @name - selector
    * @description - The Button component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-button';


    /**
    * @name - constructor
    * @description - Constructor for the Button component.
    * @public
    * @param {HTMLElement} element - the native element to attach the Button behavior too.
    */
    constructor(element: HTMLElement) {
        super(element);
        this.update();
    }

    /**
    * @name - update
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @returns {void}
    */
    protected update(): void {
        if (!this.element) {
            return;
        }

        // If the anchor looks like a button and quacks like a button,
        // we need to make it to behave like a button.
        if (this.element.nodeName === 'A' && (this.element.getAttribute('role') || '').toLowerCase() === 'button') {
            addEvent(this.element, eventTypes.keydown, this.handleKeydown);
        }
    }

    /**
    * @name - teardown
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @returns {void}
    */
    protected teardown(): void {
        removeEvent(this.element, eventTypes.keydown, this.handleKeydown);
    }

    /**
    * @name - handleKeydown
    * @description - Handles Keydown events
    * @param {KeyboardEvent} - event: the event object
    * @private
    * @returns {void}
    */
    private handleKeydown = (event: KeyboardEvent): void => {
        let keyCode = getKeyCode(event);

        switch (keyCode) {
            case keycodes.Space:
                // Prevent browser scroll
                preventDefault(event);
                this.emitClickEvent();
                break;
        }
    }

    /**
    * @name - emitClickEvent
    * @description - Create and dispatch a synthetic click event
    * @private
    * @returns {void}
    */
    private emitClickEvent(): void {
        customEvent(this.element, eventTypes.click);
    }
}