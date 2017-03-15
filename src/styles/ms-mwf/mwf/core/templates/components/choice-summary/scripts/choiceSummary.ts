/// <amd-module name="choiceSummary"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ObservableComponent} from 'observableComponent';
import {addEvent, eventTypes, getEventTargetOrSrcElement,
    getText, preventDefault, removeEvent, selectFirstElement, selectElementsT, setText} from 'htmlExtensions';

/**
* @class - ChoiceSummary
* @classdesc - The choice summary component
*/
export class ChoiceSummary extends ObservableComponent {

    /**
    * @name - selector
    * @description - selector to use to find choice summary components in the document.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-choice-summary';

    /**
    * @name - dropdownButtonSelector
    * @description - selector to use to find dropdown button on the choice summary element.
    * @private
    * @static
    * @type {string}
    */
    private static dropdownButtonSelector = '.c-action-trigger.glyph-chevron-down';

    /**
    * @name - dropdownMenuSelector
    * @description - selector to use to find dropdown menu on the choice summary element.
    * @private
    * @static
    * @type {string}
    */
    private static dropdownMenuSelector = 'ul';

    /**
    * @name - ariaHidden
    * @description - aria-hidden attribute name. Set to true/false to hide/show the dropdown.
    * @private
    * @static
    * @type {string}
    */
    private static ariaHidden = 'aria-hidden';

    /**
    * @name - ariaExpanded
    * @description - aria-expanded attribute name. Set to true/false to determine if the dropdown is hidden.
    * @private
    * @static
    * @type {string}
    */
    private static ariaExpanded = 'aria-expanded';

    /**
    * @name - separatorSpanSelector
    * @description - selector to find the first direct descendant span in choice summary.
    * @private
    * @static
    * @type {string}
    */
    private static separatorSpanSelector = '.c-choice-summary > span';

    /**
    * @name - spanSelector
    * @description - selector to use to find dropdown text on the choice summary element.
    * @private
    * @static
    * @type {string}
    */
    private static spanSelector = 'span';

    /**
    * @name - separatorSelector
    * @description - selector to use to find separator text on the choice summary element.
    * @private
    * @static
    * @type {string}
    */
    private static separatorSelector = 'data-js-separator';

    /**
    * @name - labelSelector
    * @description - selector to use to find the label element on the choice summary element.
    * @private
    * @static
    * @type {string}
    */
    private static labelSelector = 'label';

    /**
    * @name - choiceOptionSelector
    * @description - selector to use to find radio inputs on the choice summary element.
    * @private
    * @static
    * @type {string}
    */
    private static choiceOptionSelector: string = 'input[type="radio"]';

    /**
    * @name - separator
    * @description - separator text in the choice summary element.
    * @private
    * @type {string}
    */
    private separator: string;

    /**
    * @name - dropdownMenu
    * @description - dropdown menu in the choice summary element.
    * @private
    * @type {HTMLElement}
    */
    private dropdownMenu: HTMLElement;

    /**
    * @name - label
    * @description - label in the choice summary element.
    * @private
    * @type {HTMLElement}
    */
    private label: HTMLElement;

    /**
    * @name - isVisible
    * @description - Flag indicating whether or not the ChoiceSummary is currently visible.
    * @private
    * @type {boolean}
    */
    private isVisible: boolean;

    /**
    * @name - labelText
    * @description - label text in the choice summary element.
    * @private
    * @type {string}
    */
    private labelText: string;

    /**
    * @name - checkedChoiceOption
    * @description - use to store the radio button that has been checked.
    * @private
    * @type {HTMLInputElement}
    */
    private checkedChoiceOption: HTMLInputElement;

    /**
    * @name - dropdownButton
    * @description - dropdown button element in the choice summary element.
    * @private
    * @type {HTMLElement}
    */
    private dropdownButton: HTMLElement;

    /**
    * @name - dropdownText
    * @description - dropdown button element in the choice summary element.
    * @private
    * @type {HTMLElement}
    */
    private dropdownText: HTMLElement;

    /**
    * @name - choiceOptions
    * @description - an array of all the radio items in the dropdown menu.
    * @private
    * @type {HTMLElement[]}
    */
    private choiceOptions: HTMLInputElement[];

    /**
    * @name - constructor
    * @description - Constructor for the ChoiceSummary component.
    * @public
    * @param {HTMLElement} element - the native element to attach the ChoiceSummary behavior to.
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
        this.dropdownButton = selectFirstElement(ChoiceSummary.dropdownButtonSelector, this.element);
        this.dropdownMenu = selectFirstElement(ChoiceSummary.dropdownMenuSelector, this.element);
        this.dropdownText = selectFirstElement(ChoiceSummary.separatorSpanSelector, this.element);
        this.separator = this.dropdownText.getAttribute(ChoiceSummary.separatorSelector);

        this.labelText = getText(this.dropdownText);

        // add dropdown button click handlers
        if (this.dropdownButton && this.separator && this.dropdownMenu && this.dropdownText && this.labelText) {
            this.choiceOptions = selectElementsT<HTMLInputElement>(ChoiceSummary.choiceOptionSelector, this.element);
            this.isVisible = this.dropdownMenu.getAttribute(ChoiceSummary.ariaHidden) === 'true';

            addEvent(this.dropdownButton, eventTypes.click, this.onDropdownClicked);
            addEvent(document, eventTypes.click, this.onNonDropdownClick);
            addEvent(this.choiceOptions, eventTypes.click, this.replaceText);

            for (let choiceOption of this.choiceOptions) {
                if (choiceOption.checked) {
                    this.checkedChoiceOption = choiceOption;
                    break;
                }
            }
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
        removeEvent(this.dropdownButton, eventTypes.click, this.onDropdownClicked);
        removeEvent(document, eventTypes.click, this.onNonDropdownClick);
        removeEvent(this.choiceOptions, eventTypes.click, this.replaceText);
    }

    /**
     * @name - onDropdownClicked
     * @description - Dropdown button click handler
     * @param  {MouseEvent} event - The event.
     * @returns void
     */
    private onDropdownClicked = (event: MouseEvent) => {
        preventDefault(event);
        this.toggleVisibility();
    }

    /**
     * @name - onNonDropdownClick
     * @description - Document click handler
     * @param  {MouseEvent} event - The event.
     * @returns void
     */
    private onNonDropdownClick = (event: MouseEvent) => {
        let target = getEventTargetOrSrcElement(event);

        if (!this.isVisible && !this.element.contains(target)) {
            this.toggleVisibility();
        }
    }

    /**
     * @name - replaceText
     * @description - Replace text for dropdown
     * @param  {MouseEvent} event - The event.
     * @returns void
     */
    private replaceText = (event: MouseEvent) => {
        this.checkedChoiceOption = <HTMLInputElement>event.target;

        // get text in dropdown
        let choiceOptionContainer = this.checkedChoiceOption.parentNode;
        this.label = selectFirstElement(ChoiceSummary.spanSelector, <HTMLElement>choiceOptionContainer);

        let replacementText = this.labelText + this.separator + ' ' + getText(this.label);

        setText(this.dropdownText, replacementText);
    }

    /**
     * @name - toggleVisibility
     * @description - Toggles visibility for the dropdown
     * @returns void
     */
    private toggleVisibility = () => {
        this.isVisible = !this.isVisible;
        this.element.setAttribute(ChoiceSummary.ariaExpanded, (!this.isVisible).toString());
        this.dropdownMenu.setAttribute(ChoiceSummary.ariaHidden, this.isVisible.toString());
    }
}
