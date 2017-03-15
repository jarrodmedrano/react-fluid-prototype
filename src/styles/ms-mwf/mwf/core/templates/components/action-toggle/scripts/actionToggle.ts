/// <amd-module name="actionToggle"/>
import {ISubscriber, Publisher} from 'publisher';
import {ComponentFactory} from 'componentFactory';
import {Tooltip} from 'tooltip';
import {
    addClass,
    addEvent,
    eventTypes,
    getText,
    hasClass,
    preventDefault,
    removeEvent,
    removeClass,
    selectFirstElement,
    setText
} from 'htmlExtensions';
import {getKeyCode} from 'utility';
import {keycodes} from 'keycodes';

/**
* @interface IActionToggleNotification
* @classdesc - The data contract interface used for ActionToggle notifications.
* @export
*/
export interface IActionToggleNotification {
    toggled: boolean;
}

/**
* @interface IActionToggleSubscriber
* @classdesc - The interface which ActionToggle notification subscribers must implement.
* @extends {ISubscriber}
* @export
*/
export interface IActionToggleSubscriber extends ISubscriber {
    onActionToggled(notification: IActionToggleNotification): void;
}

/**
 * @class ActionToggle component
 * @classdesc - The ActionToggle component
 * @export
 */
export class ActionToggle extends Publisher<IActionToggleSubscriber> {
    /**
    * @name - actionToggleSelector
    * @description - The selector for action toggle items.
    * @private
    * @static
    * @type {string}
    */
    public static selector = '.c-action-toggle';

    /**
    * @name - ariaLabelAttribute
    * @description - The aria-label attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static ariaLabelAttribute = 'aria-label';

    /**
    * @name - initializeToggledClassName
    * @description - The classname used to initialize the control as toggled or not.
    * @static
    * @private
    * @type {string}
    */
    private static initializeToggledClassName = 'f-toggle';

    /**
    * @name - toggledGlyphAttribute
    * @description - The attribute for the toggled glyph of the actionToggle
    * @private
    * @static
    * @type {string}
    */
    private static toggledGlyphAttribute = 'data-toggled-glyph';

    /**
    * @name - localizedToggledLabelAttribute
    * @description - The localized value for the attribute for the toggled label of the actionToggle
    * @private
    * @static
    * @type {string}
    */
    private static localizedToggledLabelAttribute = 'data-toggled-label';

    /**
    * @name - initialGlyph
    * @description - The initial glyph name.
    * @private
    * @type {string}
    */
    private initialGlyph: string;

    /**
    * @name - toggledGlyph
    * @description - The toggled glyph name.
    * @private
    * @type {string}
    */
    private toggledGlyph: string;

    /**
    * @name - localizedInitialLabelValue
    * @description - The localized string for the initial state of actionToggle.
    * @private
    * @type {string}
    */
    private localizedInitialLabelValue: string;

    /**
    * @name - localizedToggledLabelValue
    * @description - The localized string for the toggled state of actionToggle
    * @private
    * @type {string}
    */
    private localizedToggledLabelValue: string;

    /**
    * @name - screenReaderElement
    * @description - The x-screen-reader element to to show the initial/toggled label value.
    * @private
    * @type {HTMLElement}
    */
    private screenReaderElement: HTMLElement;

    /**
    * @name - tooltip
    * @description - The tooltip associated with the action toggle.
    * @private
    * @type {Tooltip}
    */
    private tooltip: Tooltip;
    /**
    * @name - constructor
    * @description - Constructor for the ActionToggle component.
    * @public
    * @param {HTMLElement} element - the native element to attach the ActionToggle behavior to.
    */
    constructor(public element: HTMLElement) {
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

        this.initializeLocalization();
        const initialState = hasClass(this.element, ActionToggle.initializeToggledClassName);
        const tooltipId = this.element.getAttribute(Tooltip.dataDescribedByAttribute);

        if (!!tooltipId) {
            ComponentFactory.create([{
                component: Tooltip,
                eventToBind: 'DOMContentLoaded',
                elements: [document.getElementById(tooltipId)],
                callback: (results: Tooltip[]): void => {
                    if (!!results || !!results.length) {
                        this.tooltip = results[0];
                        this.tooltip.setContent(initialState ? this.localizedToggledLabelValue : this.localizedInitialLabelValue );
                    }
                }
            }]);
        }

        if (initialState) {
            // Remove the toggle indicator to force a state switch in the first call to updateActionToggleState()
            removeClass(this.element, ActionToggle.initializeToggledClassName);
        }

        this.updateActionToggleState(initialState);

        // Bind listeners
        addEvent(this.element, eventTypes.click, this.onActionToggleChange);
        addEvent(this.element, eventTypes.keydown, this.handleKeydownEvent);
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
        removeEvent(this.element, eventTypes.click, this.onActionToggleChange);
        removeEvent(this.element, eventTypes.keydown, this.handleKeydownEvent);
    }

    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {IActionToggleSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IActionToggleSubscriber, context?: any): void {
        if (subscriber.onActionToggled) {
            subscriber.onActionToggled(context as IActionToggleNotification);
        }
    }

    /**
    * @name - isToggled
    * @memberof - ActionToggle
    * @description - Gets the current toggled state.
    * @public
    * @returns {boolean} - true if the ActionToggle is toggled, otherwise false.
    */
    public isToggled(): boolean {
        return hasClass(this.element, ActionToggle.initializeToggledClassName);
    }

    /**
    * @name - initializeLocalization
    * @description - Initialize all the localization strings.
    * @private
    * @returns {void}
    */
    private initializeLocalization(): void {

        if (!!this.element.getAttribute(ActionToggle.ariaLabelAttribute)) {
            this.localizedInitialLabelValue = this.element.getAttribute(ActionToggle.ariaLabelAttribute);
        } else if (!!getText(this.element)) {
            this.localizedInitialLabelValue = getText(this.element);
        }

        this.localizedToggledLabelValue = this.element.getAttribute(ActionToggle.localizedToggledLabelAttribute);

        for (let className of this.element.className.split(' ')) {
            if (className.indexOf('glyph-') >= 0) {
                this.initialGlyph = className;
                break;
            }
        }
        this.toggledGlyph = this.element.getAttribute(ActionToggle.toggledGlyphAttribute);
    }

    /**
    * @name - updateActionToggleState
    * @description - Updates the button's ux state.
    * @param {boolean} targetState - True for toggled and false for initial
    * @private
    * @returns {void}
    */
    private updateActionToggleState = (targetState: boolean): void => {
        if (targetState === this.isToggled()) {
            return;
        }

        if (targetState) {
            addClass(this.element, ActionToggle.initializeToggledClassName);

            // Toggle the glyph classes if needed
            if (!!this.initialGlyph) {
                removeClass(this.element, this.initialGlyph);
            }
            if (!!this.toggledGlyph) {
                addClass(this.element, this.toggledGlyph);
            }

            // Toggle the label for actionToggle
            if (!!this.element.getAttribute(ActionToggle.ariaLabelAttribute)) {
                this.element.setAttribute(ActionToggle.ariaLabelAttribute, this.localizedToggledLabelValue);
            } else {
                setText(this.element, this.localizedToggledLabelValue);
            }

            if (!!this.tooltip) {
                this.tooltip.setContent(this.localizedToggledLabelValue);
            }
        } else {
            removeClass(this.element, ActionToggle.initializeToggledClassName);

            // Toggle the glyph classes if needed
            if (!!this.toggledGlyph) {
                removeClass(this.element, this.toggledGlyph);
            }
            if (!!this.initialGlyph) {
                addClass(this.element, this.initialGlyph);
            }

            // Toggle the label for actionToggle
            if (!!this.element.getAttribute(ActionToggle.ariaLabelAttribute)) {
                this.element.setAttribute(ActionToggle.ariaLabelAttribute, this.localizedInitialLabelValue);
            } else {
                setText(this.element, this.localizedInitialLabelValue);
            }

            if (!!this.tooltip) {
                this.tooltip.setContent(this.localizedInitialLabelValue);
            }
        }

        this.initiatePublish({ toggled: targetState });
    }

    /**
    * @name - onActionToggleChange
    * @private
    * @description - The action toggle button's click/mouse/tap event listener.
    * @returns {void}
    */
    private onActionToggleChange = (): void => {
        this.updateActionToggleState(!this.isToggled());
    }

    /**
    * @name - handleKeydownEvent
    * @description - event handler for keyboard events
    * @param {KeyboardEvent} event - the keyboard event
    * @private
    * @returns {void}
    */
    private handleKeydownEvent = (event: KeyboardEvent): void => {
        switch (getKeyCode(event)) {
            case keycodes.Enter:
            case keycodes.Space:
                preventDefault(event);
                this.updateActionToggleState(!this.isToggled());
                break;
            case keycodes.Escape:
                preventDefault(event);
                this.updateActionToggleState(false);
                break;
        }
    }
}
