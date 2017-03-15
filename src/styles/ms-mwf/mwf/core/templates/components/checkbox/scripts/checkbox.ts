/// <amd-module name="checkbox"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ComponentFactory} from 'componentFactory';
import {Publisher, ISubscriber} from 'publisher';
import {addEvent, eventTypes, removeEvent, selectFirstElement} from 'htmlExtensions';
import {apiDeprecated} from 'utility';

/**
 * @interface ICheckboxNotification
 * @interfacedesc - The data contract interface used for Checkbox notifications.
 * @export
 */
export interface ICheckboxNotification {
    checked: boolean;
}

/**
 * @interface ICheckboxSubscriber
 * @interfacedesc - The interface which Checkbox notification subscribers must implement.
 * @export
 */
export interface ICheckboxSubscriber extends ISubscriber {
    onValueChanged(notification: ICheckboxNotification): void;
}

/**
 * Checkbox component
 */
export class Checkbox extends Publisher<ICheckboxSubscriber> {


    /**
     * @name - selector
     * @description - selector to use to find Checkbox components in the document.
     * @static
     * @public
     * @type {string}
     */
    public static selector = '.c-checkbox';

    /**
     * @name - inputSelector
     * @description - selector to use to find checkbox input in the component.
     * @static
     * @public
     * @type {string}
     */
    public static inputSelector = 'input[type="checkbox"]';

    /**
     * @name - input
     * @description - the checkbox input element
     * @private
     * @type HTMLInputElement
     */
    private input: HTMLInputElement;
    /**
     * @name - indeterminateAttribute
     * @description - the attribute to check for to determine if the checkbox is indeterminate
     * @static
     * @private
     * @type {string}
     */
    private static indeterminateAttribute = 'data-js-checkbox';

    /**
     * @name - indeterminateValue
     * @description - the value of the indeterminateValue if the checkbox is indeterminate
     * @static
     * @private
     * @type {string}
     */
    private static indeterminateValue = 'indeterminate';

    /**
     * @name - ariaCheckedAttribute
     * @description - the value of the ariaCheckedAttribute if the checkbox is indeterminate
     * @static
     * @private
     * @type {string}
     */
    private static ariaCheckedAttribute = 'aria-checked';

    /**
     * @name - checked
     * @description - the checked value
     * @private
     * @type {boolean}
     */
    private checked: boolean;

    /**
     * Creates an instance of Checkbox.
     *
     * @param {HTMLInputElement} element
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
        this.input = <HTMLInputElement>selectFirstElement(Checkbox.inputSelector, this.element);

        if (!this.input) {
            return;
        }

        if (this.input.getAttribute(Checkbox.indeterminateAttribute) === Checkbox.indeterminateValue) {
            this.input.indeterminate = true;
        }

        this.checked = this.input.checked;
        this.input.setAttribute(Checkbox.ariaCheckedAttribute, this.checked.toString());

        addEvent(this.input, eventTypes.click, this.updateCheckbox);
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
        // Remove the click listeners.
        removeEvent(this.input, eventTypes.click, this.updateCheckbox);
    }

    /**
     * @name - publish
     * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
     *                This method will be called once for each registered subscriber.
     * @protected
     * @param {ICheckboxSubscriber} subscriber - the subscriber to make the callback to.
     * @param {any} context - the publish context use to determine which interface callback to make.
     * @returns {void}
     */
    protected publish(subscriber: ICheckboxSubscriber, context?: any): void {
        subscriber.onValueChanged(context as ICheckboxNotification);
    }

    /**
     * @name - updateCheckbox
     * @description - update the checkbox component and publish to subscribers if checkbox was updated.
     * @private
     * @returns {void}
     */
    private updateCheckbox = (): void => {
        const checked = this.input.checked;

        if (checked !== this.checked) {
            this.checked = checked;
            this.input.setAttribute(Checkbox.ariaCheckedAttribute, this.checked.toString());

            this.initiatePublish({
                checked: this.checked
            });
        }
    }

    /**
     * Gets checkbox indeterminate state.
     *
     * @type {boolean}
     */
    public get indeterminate(): boolean {
        if (!this.input) {
            return false;
        }
        return this.input.indeterminate;
    }

    /**
     * Sets checkbox indeterminate state.
     *
     * @param {boolean} value
     */
    public set indeterminate(value: boolean) {
        if (!this.input) {
            return;
        }

        this.input.indeterminate = value;
    }

    /**
     * TODO: Remove this method as soon as we can verify partners are no longer calling it.
     */
    public static init(input?: any): void {
        apiDeprecated('Checkbox.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Checkbox,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
