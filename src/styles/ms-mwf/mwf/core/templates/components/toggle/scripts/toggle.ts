/// <amd-module name="toggle"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import * as HtmlExtensions from 'htmlExtensions';
import * as StringExtensions from 'stringExtensions';
import {apiDeprecated} from 'utility';

export class Toggle extends ObservableComponent {
    // String for the component selector
    public static selector: string = '.c-toggle';
    // String for aria-checked
    private ariaCheckedString = 'aria-checked';
    // String value for the checked state
    private checkedString : string;
    // The button element for the Toggle element
    private toggleButton: HTMLButtonElement;
    // Toggle indicatator state element
    private toggleIndicatorElement: HTMLElement;
    // String value for the unchecked state
    private uncheckedString : string;

    constructor(element: HTMLElement) {
        super(element);
        if (!element) {
            return;
        }

        this.update();
    }

    /**
     * Update the component state.
     *
     * @protected
     * @abstract
     */
    protected update(): void {
        this.toggleButton = HtmlExtensions.selectFirstElementT<HTMLButtonElement>('button', this.element);
        this.toggleIndicatorElement = HtmlExtensions.selectFirstElement('button + span', this.element);

        if (!this.toggleIndicatorElement || !this.toggleButton) {
            return;
        }

        this.checkedString = this.toggleIndicatorElement.getAttribute('data-on-string');
        this.uncheckedString = this.toggleIndicatorElement.getAttribute('data-off-string');

        // Disable toggles that are in disabled state
        this.isDisabled() ? this.disableToggle() : this.enableToggle();

        // Set the toggled state
        this.toggleIndicatorElement.innerHTML = this.isChecked() ? this.checkedString : this.uncheckedString;

        // Add click events
        HtmlExtensions.addEvent(this.toggleButton, HtmlExtensions.eventTypes.click, this.toggleCheckedState);
        HtmlExtensions.addEvent(this.toggleIndicatorElement, HtmlExtensions.eventTypes.click, this.toggleCheckedState);
    }

    /**
     * Cleaning up the old state of the component.
     *
     * @protected
     * @abstract
     */
    protected teardown(): void {
        HtmlExtensions.removeEvent(this.toggleButton, HtmlExtensions.eventTypes.click, this.toggleCheckedState);
        HtmlExtensions.removeEvent(this.toggleIndicatorElement, HtmlExtensions.eventTypes.click, this.toggleCheckedState);
    }

    /**
     * checkToggle()
     * Set the toggle as checked, 'on'
     */
    public checkToggle() : void {
        this.setToggleCheckedState(true);
    }

    /**
     * disableToggle()
     * Set the disabled class on the toggle element
     */
    public disableToggle() : void {
        HtmlExtensions.addClass(this.element, 'f-disabled');
    }

    /**
     * enableToggle()
     * Remove the disabled class on the toggle element
     */
    public enableToggle() : void {
        HtmlExtensions.removeClass(this.element, 'f-disabled');
    }

    /**
     * isChecked()
     * Return the checked state of the toggle
     */
    public isChecked() : Boolean {
        return this.toggleButton.getAttribute(this.ariaCheckedString) === 'true';
    }

    /**
     * isDisabled()
     * Return this disabled state of the toggle
     */
    public isDisabled() : Boolean {
        return this.toggleButton.hasAttribute('disabled');
    }

    /**
     * setToggleCheckedState()
     * Change the toggle state of the element by the passed checked state either 'true' or 'false'.
     * @param isChecked - string - 'true' or 'false' to set the toggle state
     */
    public setToggleCheckedState(isChecked : boolean) : void {
        this.toggleButton.setAttribute(this.ariaCheckedString, isChecked.toString());
        this.toggleIndicatorElement.innerHTML = isChecked ? this.checkedString : this.uncheckedString;
    }

    /**
     * toggleCheckedState()
     * Switch the checked state of the toggle
     */
    public toggleCheckedState = () => {
        this.isChecked() ? this.uncheckToggle() : this.checkToggle();
    }

    /**
     * uncheckToggle()
     * Set the toggle as unchecked, 'off'
     */
    public uncheckToggle() : void {
        this.setToggleCheckedState(false);
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Toggle.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Toggle,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
