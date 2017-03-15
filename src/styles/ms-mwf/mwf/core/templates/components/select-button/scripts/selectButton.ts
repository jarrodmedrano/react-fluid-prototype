/// <amd-module name="selectButton"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {addClass, addEvent, eventTypes, getText, removeEvent, selectElements, setText} from 'htmlExtensions';
import {apiDeprecated, detectContrast, Contrast} from 'utility';

/**
* SelectButton component
*/
export class SelectButton extends ObservableComponent {
    // String for the component selector
    public static selector = '.c-select-button';
    private static pressedAttributeName = 'aria-pressed';
    private static multiSelectAttributeName = 'data-select-button-multiselect';
    private static selectedTextSelector = 'data-js-selected-text';
    private static unselectedTextSelector = 'data-js-unselected-text';
    private static ariaLabelledBySelector = 'aria-labelledby';

    private selectedText: string;
    private unselectedText: string;
    private ariaLabelledByElement: HTMLElement;
    private nameSelector: string;
    private buttonContainer: HTMLElement;

    /**
    * Constructor of a selectButton component.
    * @class SelectButton
    * @classdesc Constructor of a selectButton component.
    * @param {HTMLElement} element- a component element that needs to have selectButton behavior.
    */
    constructor(element: HTMLElement) {
        super(element);

        if (!element) {
            return;
        }

        this.update();
    }

    /**
     * updates the Select Button component if there is any change in the DOM inside Select Button container.
     *
     * @protected
     * @returns {void}
     */
    protected update(): void {
        this.buttonContainer = <HTMLElement>this.element.parentNode;

        if (!this.buttonContainer) {
            return;
        }

        let ariaLabelledBy = this.buttonContainer.getAttribute(SelectButton.ariaLabelledBySelector);
        this.ariaLabelledByElement = document.getElementById(ariaLabelledBy);

        this.nameSelector = '.c-select-button[name="' + this.element.getAttribute('name') + '"]';
        this.selectedText = this.element.getAttribute(SelectButton.selectedTextSelector);
        this.unselectedText = this.element.getAttribute(SelectButton.unselectedTextSelector);
        this.prepareSwatches();
        addEvent(this.element, eventTypes.click, this.onClick);
    }

    /**
     * cleans out previous bindings to avoid double binding when a component is updated.
     *
     * @protected
     */
    protected teardown(): void {
        // clean up throttled event handlers.
        removeEvent(this.element, eventTypes.click, this.onClick);
    }

    /**
    * Prepare swatches.
    * This method sets the button's background color from the data-select-button-swatch attribute value
    * and, if disabled, sets a light or dark disabled class on it to contrast with the background color.
    * These swatch attributes are only supposed to apply for buttons that don't have text so
    * we're only setting the background color, there is no need to change the foreground color.
    */
    private prepareSwatches(): void {
        let hexValue = this.element.getAttribute('data-select-button-swatch');
        let contrast = detectContrast(hexValue);

        if (!!contrast) {
            this.element.style.backgroundColor = '#' + hexValue;

            if ((this.element as HTMLButtonElement).disabled) {
                //Add diagonal line class to disabled swatches
                addClass(this.element, 'f-swatch-disabled');

                if (contrast === Contrast.light) {
                    //Make diagonal line light, the color is dark
                    addClass(this.element, 'f-swatch-disabled-dark');
                }
            }
        }
    }

    /**
    * Handle the click event.
    * @param {MouseEvent} event.
    */
    private onClick = (event: MouseEvent) => {
        this.togglePressedState();
    }

    /**
    * toggle the button's pressed state.
    */
    private togglePressedState(): void {
        var text = this.selectedText;

        if (this.element.getAttribute(SelectButton.multiSelectAttributeName)) {
            this.element.setAttribute(SelectButton.pressedAttributeName, this.isPressed() ? 'false' : 'true');
            if (!this.isPressed()) {
                text = this.unselectedText;
            }
        } else {
            for (let button of selectElements(this.nameSelector)) {
                button.setAttribute(SelectButton.pressedAttributeName, (button === this.element) ? 'true' : 'false');
            }
        }
        setText(this.ariaLabelledByElement, text);
    }

    /**
    * Determines the pressed state.
    * @returns {boolean}- True if the button is in the pressed state, otherwise false.
    */
    private isPressed(): boolean {
        return this.element.getAttribute(SelectButton.pressedAttributeName) === 'true';
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('SelectButton.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: SelectButton,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
