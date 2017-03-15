/// <amd-module name="alert"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {Publisher, ISubscriber} from 'publisher';
import {selectFirstElement, eventTypes, addEvent, removeEvent, removeElement} from 'htmlExtensions';
import {apiDeprecated} from 'utility';

// The IAlertSubscriber interface which Alert notification subscribers must implement.
export interface IAlertSubscriber extends ISubscriber {
    onAlertClosed(): void;
}

/**
* @class - Alert
* @classdesc - The Alert component
* @export
 */
export class Alert extends Publisher<IAlertSubscriber> {
    /**
    * @name - selector
    * @description - selector to use to find Alert components in the document.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.m-alert';

    /**
    * @name - closeButton
    * @description - The close button element of the Alert.
    * @private
    * @type {HTMLElement}
    */
    private closeButton: HTMLElement;

    /**
    * @name - constructor
    * @description - Constructor for the Alert component.
    * @public
    * @param {HTMLElement} element - the native element to attach the Alert behavior to.
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

        // Get close button
        this.closeButton = selectFirstElement('button.c-action-trigger.glyph-cancel', this.element);

        if (!!this.closeButton) {
            // Attach events
            addEvent(this.closeButton, eventTypes.click, this.closeAlertAndRemoveEvent, false);
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
        removeEvent(this.closeButton, eventTypes.click, this.closeAlertAndRemoveEvent, false);
    }

    /**
    * @name - closeAlertAndRemoveEvent
    * @description - Remove the click events and the Alert element from the DOM.
    * @public
    * @returns {void}
    */
    public closeAlertAndRemoveEvent = (): void => {
        removeEvent(this.closeButton, eventTypes.click, this.closeAlertAndRemoveEvent);
        removeElement(this.element);
        this.initiatePublish();
    }

    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {IAlertSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IAlertSubscriber, context?: any): void {
        subscriber.onAlertClosed();
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
     */
    public static init(input: any): void {
        apiDeprecated('Alert.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Alert,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
