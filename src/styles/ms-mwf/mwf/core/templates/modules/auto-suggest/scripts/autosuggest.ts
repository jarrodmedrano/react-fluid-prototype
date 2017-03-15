/// <amd-module name="autosuggest"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {Publisher, ISubscriber} from 'publisher';
import {
    addEvent,
    css,
    eventTypes,
    getEventTargetOrSrcElement,
    getText,
    hasClass,
    nodeListToArray,
    preventDefault,
    removeEvent,
    removeInnerHtml,
    selectElements,
    selectFirstElement,
} from 'htmlExtensions';
import {isNullOrWhiteSpace} from 'stringExtensions';
import {getKeyCode} from 'utility';
import {keycodes} from 'keycodes';

/**
* @interface IAutoSuggestData
* @description - Describes the autosuggest data format which partners should return.
* @export
*/
export interface IAutoSuggestData {
    type: string;
    value: string | IAutoSuggestProduct;
}

/**
 * @interface IAutosuggestProduct
 * @description Describes the autosuggest product data format.
 * @export
 */
export interface IAutoSuggestProduct {
    // The title string that describes the product. This text is displayed next to the product image
    title: string;

    // The url that the product suggestion links to.
    targetUrl: string;

    // The Source of the product image.
    imageSrc: string;

    // The background color for product image.
    backgroundColor?: string;

    // The category of the product.
    category?: string;

    // The provided image will be made round. Used for artists/actors etc. 
    isImageRound?: boolean;
}

/**
* @interface IAutoSuggestNotification
* @description - The data contract interface used for autosuggest notifications.
* @export
*/
export interface IAutoSuggestNotification {
    pattern: string;
}

/**
* @interface IAutoSuggestSubscriber
* @description - The interface which AutoSuggest notification subscribers must implement.
* @export
*/
export interface IAutoSuggestSubscriber extends ISubscriber {
    onMatchPatternChanged(notification: IAutoSuggestNotification): void;
}

/**
* @class - AutoSuggest
* @classdesc - The AutoSuggest component
* @export
*/
export class AutoSuggest extends Publisher<IAutoSuggestSubscriber> {
    /**
    * @name - selector
    * @description - selector to use to find AutoSuggest components in the document.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.m-auto-suggest';

    /**
    * @name - defaultItemScrollCount
    * @description - Default number of suggestions to display.
    * @static
    * @private
    * @type {number}
    */
    private static defaultItemScrollCount = 5;

    /**
    * @name - ariaHidden
    * @description - This attribute to set to true/false to indicate whether or not the autosuggest results are hidden.
    * @static
    * @private
    * @type {string}
    */
    private static ariaHidden = 'aria-hidden';

    /**
    * @name - ariaExpanded
    * @description - This attribute to set to true/false to indicate whether or not the autosuggest results are hidden.
    * @static
    * @private
    * @type {string}
    */
    private static ariaExpanded = 'aria-expanded';

    /**
    * @name - itemScrollCount
    * @description - The number of suggestions to display.
    * @private
    * @type {number}
    */
    private itemScrollCount: number;

    /**
    * @name - form
    * @description - The autosuggest form.
    * @private
    * @type {HTMLFormElement}
    */
    private form: HTMLFormElement;

    /**
    * @name - input
    * @description - The input element.
    * @private
    * @type {HTMLInputElement}
    */
    private input: HTMLInputElement;

    /**
    * @name - menu
    * @description - The menu element (an unordered list).
    * @private
    * @type {HTMLElement}
    */
    private menu: HTMLElement;

    /**
    * @name - noResults
    * @description - The 'no results' message provided by the page author.
    * @private
    * @type {HTMLElement}
    */
    private noResults: HTMLElement;

    /**
    * @name - selectedSuggestion
    * @description - The suggestion in the menu the user has selected.
    * @private
    * @type {HTMLElement}
    */
    private selectedSuggestion: HTMLElement;

    /**
    * @name - suggestions
    * @description - The list of suggestions.
    * @private
    * @type {HTMLElement[]}
    */
    private suggestions: HTMLElement[];

    /**
    * @name - suggestionClickListeners
    * @description - This keeps a reference to all the suggestion event listeners so they can be removed on teardown.
    * @private
    * @type {EventListener[]}
    */
    private suggestionClickListeners: EventListener[] = [];

    /**
    * @name - constructor
    * @description - Constructor for the AutoSuggest component.
    * @public
    * @param {HTMLElement} element - the native element to attach the AutoSuggest behavior to.
    * @param {number} customItemScrollCount - the number of suggestions to display.
    */
    constructor(element: HTMLElement, customItemScrollCount?: number) {
        super(element);

        this.itemScrollCount = customItemScrollCount || AutoSuggest.defaultItemScrollCount;
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

        this.input = selectFirstElement('[aria-controls=' + this.element.id + ']') as HTMLInputElement;

        if (!this.input) {
            return;
        }

        this.menu = selectFirstElement('.c-menu', this.element);

        if (!this.menu) {
            return;
        }

        this.noResults = selectFirstElement('.f-auto-suggest-no-results', this.element);

        if (!this.noResults) {
            return;
        }

        this.form = this.element.parentElement as HTMLFormElement;

        if (!this.form) {
            return;
        }

        addEvent(this.input, eventTypes.keyup, this.handleInputKeyup, true);
        addEvent(this.input, eventTypes.keydown, this.handleInputKeydown, true);
        addEvent(this.input, eventTypes.click, this.handleInputClick, true);

        this.reconstructMenu(null, true);
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
        removeEvent(this.input, eventTypes.keyup, this.handleInputKeyup, true);
        removeEvent(this.input, eventTypes.keydown, this.handleInputKeydown, true);
        removeEvent(this.input, eventTypes.click, this.handleInputClick, true);
        removeEvent(document.body, eventTypes.click, this.handleClickWhenMenuOpen);

        for (let i = 0; i < this.suggestions.length; ++i) {
            removeEvent(this.suggestions[i], eventTypes.keydown, this.handleMenuKeydown);
            removeEvent(this.suggestions[i], eventTypes.click, this.suggestionClickListeners[i++]);
        }

        // Reset non static members
        this.form = null;
        this.input = null;
        this.menu = null;
        this.noResults = null;
        this.suggestions = null;
        this.selectedSuggestion = null;
    }

    /**
    * @name - updateSuggestions
    * @description - method to be called by consumer (partner) with new autosuggest data (suggestions).
    *                It will update the autosuggest menu.
    * @public
    * @param {IAutoSuggestData[]} suggestions - The list of matching suggestions.
    * @returns {void}
    */
    public updateSuggestions = (suggestions: IAutoSuggestData[]): void => {
        this.reconstructMenu(suggestions);
        this.show();
    }

    /**
    * @name - handleInputKeyup
    * @description - Handles the input keyup event.
    * @private
    * @param {KeyboardEvent} event - the keyboard event.
    * @returns {void}
    */
    private handleInputKeyup = (event: KeyboardEvent): void => {
        switch (getKeyCode(event)) {
            case keycodes.Escape:
                break;
            case keycodes.ArrowUp:
                break;
            case keycodes.ArrowDown:
                break;
            default:
                this.initiatePublish();
        }
    }

    /**
    * @name - handleInputKeydown
    * @description - Handles the input keydown event.
    * @private
    * @param {KeyboardEvent} event - the keyboard event.
    * @returns {void}
    */
    private handleInputKeydown = (event: KeyboardEvent): void => {
        switch (getKeyCode(event)) {
            case keycodes.Tab:
            case keycodes.Escape:
                this.hide();
                break;
            case keycodes.ArrowUp:
                event.preventDefault();
                this.handleInputArrowKey(true);
                break;
            case keycodes.ArrowDown:
                event.preventDefault();
                this.handleInputArrowKey(false);
                break;
        }
    }

    /**
    * @name - handleMenuKeydown
    * @description - Handles the menu keydown event.
    * @private
    * @param {KeyboardEvent} event - the keyboard event.
    * @returns {void}
    */
    private handleMenuKeydown = (event: KeyboardEvent): void => {
        switch (getKeyCode(event)) {
            case keycodes.Enter:
                this.selectSuggestion(this.selectedSuggestion, true);
                break;
            case keycodes.Escape:
                this.hide();
                break;
            case keycodes.ArrowUp:
                preventDefault(event);
                this.handleMenuArrowKey(true);
                break;
            case keycodes.ArrowDown:
                preventDefault(event);
                this.handleMenuArrowKey(false);
                break;
        }
    }

    /**
    * @name - handleClickWhenMenuOpen
    * @description - Handles the click event when the menu is open.
    *                Calls closeMenuFromClick which does the real work.
    *                (done for testability)
    * @private
    * @param {MouseEvent} event - the mouse event.
    * @returns {void}
    */
    private handleClickWhenMenuOpen = (event: MouseEvent): void => {
        this.closeMenuFromClick(getEventTargetOrSrcElement(event));
    }

    /**
    * @name - handleInputClick
    * @description - Handles the click event on the input element.
    *                Calls show which does the real work.
    *                (done for testability)
    * @private
    * @param {MouseEvent} event - the mouse event.
    * @returns {void}
    */
    private handleInputClick = (event: MouseEvent): void => {
        this.show();
    }

    /**
    * @name - selectSuggestionFromClick
    * @description - Handles the click event on a suggestion.
    *                Calls selectSuggestion which does the real work.
    *                (done for testability)
    * @private
    * @param {HTMLElement} suggestion - the mouse event.
    * @returns {void}
    */
    private selectSuggestionFromClick = (suggestion: HTMLElement): void => {
        this.selectSuggestion(suggestion, true);
    }

    /**
     * @name - searchable
     * @description - Gets or Sets the searchable property of the menu-item. A searchable item has a value that can be entered into the
     * autosuggest's parent form. For example, the string type is searchable, while the product type navigates away, so is not searchable.
     * Searchable is true if undefined. 
     * 
     * @private
     * @param {HTMLElement} menu - the suggestions menu-item
     * @param {boolean} [isSearchable] - the value to set the li to. If missing, gets the value.
     * @returns {void | boolean} - returns true if the suggestion is searchable
     */
    private searchable(option: HTMLElement, isSearchable?: boolean): void | boolean {
        let dataAttribute = 'data-is-searchable';
        if (isSearchable === undefined) {
            return option.getAttribute(dataAttribute) !== 'false';
        } else {
            option.setAttribute(dataAttribute, isSearchable.toString());
        }
    }


    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {IAutoSuggestSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IAutoSuggestSubscriber, context?: any): void {
        subscriber.onMatchPatternChanged({ pattern: this.input.value });
    }

    /**
    * @name - handleInputArrowKey
    * @description - Handles arrow keys on the input menu.
    * @private
    * @param {boolean} isUpArrow - true means the arrow key pressed was the up arrow, false means the down arrow key was pressed
    * @returns {void}
    */
    private handleInputArrowKey(isArrowUp: boolean): void {
        let suggestions = this.suggestions;
        let suggestionsLength = this.suggestions ? this.suggestions.length : 0;

        // just ignore the arrow key if there aren't any suggestions
        if (suggestionsLength > 0) {
            if (!this.selectedSuggestion) {
                // If nothing has been selected beforehand, select the first item.
                this.selectSuggestion(suggestions[0]);
            } else {
                let currentSuggestionIndex = suggestions.indexOf(this.selectedSuggestion);

                if (isArrowUp && currentSuggestionIndex === 0) {
                    this.selectSuggestion(suggestions[suggestionsLength - 1]);
                } else if (isArrowUp) {
                    this.selectSuggestion(suggestions[currentSuggestionIndex - 1]);
                } else if (currentSuggestionIndex === suggestionsLength - 1) {
                    this.selectSuggestion(suggestions[0]);
                } else {
                    this.selectSuggestion(suggestions[currentSuggestionIndex + 1]);
                }
            }
        }
    }

    /**
    * @name - handleMenuArrowKey
    * @description - Handles arrow keys on the suggestion menu.
    * @private
    * @param {boolean} isUpArrow - true means the arrow key pressed was the up arrow, false means the down arrow key was pressed
    * @returns {void}
    */
    private handleMenuArrowKey(isUpArrow: boolean) {
        let suggestions = this.suggestions;
        let suggestionsLength = this.suggestions ? this.suggestions.length : 0;

        // just ignore the arrow key if there aren't any suggestions
        if (suggestionsLength > 0) {
            let currentSuggestionIndex = suggestions.indexOf(this.selectedSuggestion);
            if (isUpArrow && currentSuggestionIndex === 0) {
                // user presses up while on the first suggestion
                this.input.focus();
            } else if (isUpArrow) {
                this.selectSuggestion(suggestions[currentSuggestionIndex - 1]);
            } else if (currentSuggestionIndex === suggestionsLength - 1) {
                // users presses down while on the last suggestion
                this.input.focus();
            } else {
                this.selectSuggestion(suggestions[currentSuggestionIndex + 1]);
            }
        }
    }

    /**
    * @name - selectSuggestion
    * @description - Deselects the current suggestion and selects the new suggestion.
    * @private
    * @param {HTMLElement} suggestion - the new suggestion
    * @param {boolean} submitOnSelection - if true, submit the form once the item is fully selected
    * @returns {void}
    */
    private selectSuggestion(suggestion: HTMLElement, submitOnSelection: boolean = false) {
        if (!suggestion) {
            return;
        }

        // unselect the current suggestion
        if (this.selectedSuggestion) {
            this.selectedSuggestion.setAttribute('data-selected', 'false');
        }

        // select and focus on the new suggestion
        this.selectedSuggestion = suggestion;
        this.selectedSuggestion.setAttribute('data-selected', 'true');
        selectFirstElement('li > a, li > span', this.selectedSuggestion).focus();

        // update the input value, removing <strong> tags if present. The input form should be empty if the suggestion is not searchable. 
        if (this.searchable(this.selectedSuggestion)) {
            let text = this.selectedSuggestion.innerText || this.selectedSuggestion.textContent || '';
            this.input.value = text;
        } else {
            this.input.value = '';
        }

        if (submitOnSelection && this.searchable(this.selectedSuggestion)) {
            this.hide();
            this.form.submit();
        }
    }

    /**
    * @name - hide
    * @description - Hides the menu and no results.
    * @public
    * @param {HTMLElement} menu - the suggestions menu
    * @param {HTMLElement} noResults - the no results display
    * @returns {void}
    */
    public hide() {
        this.menu.setAttribute(AutoSuggest.ariaHidden, 'true');
        this.noResults.setAttribute(AutoSuggest.ariaHidden, 'true');
        this.input.setAttribute(AutoSuggest.ariaExpanded, 'false');
        removeEvent(document.body, eventTypes.click, this.handleClickWhenMenuOpen);
    }

    /**
    * @name - show
    * @description - Shows the auto suggest menu or noresults as appropriate.
    * @public
    * @returns {void}
    */
    public show() {
        // If the input value is empty don't show either the menu or the noresults.
        if (isNullOrWhiteSpace(this.input.value)) {
            this.hide();
            return;
        }

        this.input.setAttribute(AutoSuggest.ariaExpanded, 'true');

        // If there are no matching suggestions hide the menu and show the noresults
        if (!this.suggestions || !this.suggestions.length) {
            this.noResults.setAttribute(AutoSuggest.ariaHidden, 'false');
            this.menu.setAttribute(AutoSuggest.ariaHidden, 'true');
            return;
        }

        // We have matching suggestions, show the menu and hide the noresults
        this.noResults.setAttribute(AutoSuggest.ariaHidden, 'true');
        this.menu.setAttribute(AutoSuggest.ariaHidden, 'false');

        // Conditionally restrict the number of suggestions displayed in the menu
        // This is done here because the menu must be shown for suggestions to have an offsetHeight
        if (hasClass(this.menu, 'f-auto-suggest-scroll')) {
            css(this.menu, 'maxHeight', (this.suggestions[0].offsetHeight * this.itemScrollCount) + 'px');
        }

        addEvent(document.body, eventTypes.click, this.handleClickWhenMenuOpen);
    }

    /**
    * @name - closeMenuFromClick
    * @description - Closes the menu if the click is outside the form.
    * @private
    * @param {HTMLElement} clickTarget - the click target
    * @returns {void}
    */
    private closeMenuFromClick(clickTarget: HTMLElement) {
        if (!this.form.contains(clickTarget)) {
            this.hide();
        }
    }

    /**
    * @name - reconstructMenu
    * @description - Reconstructs the menu from the specified suggestions.
    * @private
    * @param {IAutoSuggestData[]} suggestions - The list of matching suggestions.
    * @param {boolean} fromMarkup - If true build the menu from the existing DOM ignoring the specified suggestions.
    * @returns {void}
    */
    private reconstructMenu(newSuggestions: IAutoSuggestData[], fromMarkup: boolean = false): void {
        this.suggestions = null;
        this.suggestionClickListeners = [];

        // Replace any existing suggestions with any new suggestions.
        if (!fromMarkup) {
            this.ignoreNextDOMChange = true;
            removeInnerHtml(this.menu);
        
            for (let suggestion of newSuggestions) {
                let option : HTMLElement = null;
                switch (suggestion.type) {
                    case 'string':
                        this.buildStringSuggestionHtml(suggestion.value as string);
                        break;
                    case 'product':
                        this.buildProductSuggestionHtml(suggestion.value as IAutoSuggestProduct);
                        break; 
                    // When other data types are supported for autosuggest, please add them here
                }
            }
        }

        this.suggestions = nodeListToArray<HTMLElement>(this.menu.children);
        
        for (let i = 0; i < this.suggestions.length; ++i) {
            addEvent(this.suggestions[i], eventTypes.keydown, this.handleMenuKeydown);
            addEvent(this.suggestions[i], eventTypes.click, this.suggestionClickListeners[i] = () => {
                this.selectSuggestionFromClick(this.suggestions[i]);
            });
        }
    }

    /**
     * @name - highlight
     * @description - Highlights the substring of the given string that matches the imput box.
     * @private
     * @returns {string} - the highlighted html string
     */
    private highlight(suggestion: string) {
        let inputValue = this.input.value;
        return suggestion.replace(inputValue, `<strong>${this.input.value}</strong>`);
    }

    /**
    * @name - buildStringSuggestionHtml
    * @description - Takes an autosuggestion of type 'string' and builds the correct HTML for the suggestion,
    *                then appends it to the suggestion menu.
    * @private
    * @param {string} suggestion - the string to add to the suggestion list
    * @returns {void}
    */
    private buildStringSuggestionHtml = (suggestion: string): void => {
        let listItemElement = document.createElement('li');

        listItemElement.setAttribute('class', 'c-menu-item');
        listItemElement.setAttribute('role', 'presentation');
        listItemElement.setAttribute('title', suggestion);
        listItemElement.innerHTML = '<span role="option" tabindex="0">' + this.highlight(suggestion) + '</span>';

        this.ignoreNextDOMChange = true;
        this.menu.appendChild(listItemElement);
    }

    /**
     * @name - buildProductSuggestionHtml
     * @description - Takes a autosuggestion of type 'product' and builds the correct HTML for the suggestion, then appends
     *                it to the suggestion menu. Product is not searchable.
     * 
     * @private
     * @param {string} suggestion - the string to add to the suggestion list
     * @param {HTMLElement} menu - the suggestions list
     * @returns {void}
     */
    private buildProductSuggestionHtml = (suggestion: IAutoSuggestProduct): void => {
        let listItemElement = document.createElement('li');
        listItemElement.setAttribute('class', 'c-menu-item');
        listItemElement.setAttribute('role', 'presentation');
        listItemElement.setAttribute('title', suggestion.title);
        this.searchable(listItemElement, false);

        let productElement = document.createElement('a');
        productElement.setAttribute('class', 'f-product');
        productElement.setAttribute('href', suggestion.targetUrl);

        let imageHtml = '';
        if (suggestion.imageSrc) {
            let imageStyle = '';
            let imageClass = `class="c-image${suggestion.isImageRound ? ' f-round' : ''}"`;

            if (!isNullOrWhiteSpace(suggestion.backgroundColor) && (suggestion.backgroundColor.toLowerCase() !== 'transparent')) {
                imageStyle = `style="background:${suggestion.backgroundColor}"`;
            }

            imageHtml = `<img ${imageClass} src="${suggestion.imageSrc}" ${imageStyle}/>`;
        }
        let categoryHtml = suggestion.category ? `<span class="c-meta-text">${suggestion.category}</span>` : '';
        productElement.innerHTML =
            `${imageHtml}<div><span>${suggestion.title}</span>${categoryHtml}</div>`;
        listItemElement.appendChild(productElement);

        this.ignoreNextDOMChange = true;
        this.menu.appendChild(listItemElement);
   }
}
