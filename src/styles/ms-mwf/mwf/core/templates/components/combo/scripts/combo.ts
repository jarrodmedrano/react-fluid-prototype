/// <amd-module name='combo'/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import { Publisher, ISubscriber } from 'publisher';
import { ComponentFactory } from 'componentFactory';
import {
    addClass,
    addEvent,
    eventTypes,
    getEventTargetOrSrcElement,
    getText,
    hasClass,
    preventDefault,
    removeClass,
    removeEvent,
    scrollElementIntoView,
    selectElements,
    selectFirstElement,
    selectFirstElementT
} from 'htmlExtensions';
import { apiDeprecated, getKeyCode } from 'utility';
import { getMatchLength, isNullOrWhiteSpace, trim } from 'stringExtensions';
import { keycodes } from 'keycodes';

/**
* @interface IComboNotification
* @classdesc - The data contract interface used for combo notifications.
* @export
*/
export interface IComboNotification {
    id: string;
    value: string;
    internal: boolean;
    userInitiated: boolean;
}

/**
* @interface IComboSubscriber
* @classdesc - The interface which combo notification subscribers must implement.
* @export
*/
export interface IComboSubscriber extends ISubscriber {
    onSelectionChanged(notification: IComboNotification): void;
}

/**
* @class - Combo
* @classdesc - The combo component
* @export
*/
export class Combo extends Publisher<IComboSubscriber> {
    /**
    * @name - selector
    * @description - Selector to use to find combo components in the document.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-combo';

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
    * @description - This attribute to set to true/false to indicate whether or not the autosuggest results are expanded.
    * @static
    * @private
    * @type {string}
    */
    private static ariaExpanded = 'aria-expanded';

    /**
    * @name - role
    * @description - Selector to verify the role of the combo.
    * @static
    * @private
    * @type {string}
    */
    private static role = 'role';

    /**
    * @name - isCombobox
    * @description - Boolean to veriify usage of combobox role.
    * @static
    * @private
    * @type {boolean}
    */
    private isCombobox = false;

    /**
    * @name - activeClassName
    * @description - The class used to designate the active item.
    * @static
    * @private
    * @type {string}
    */
    private static activeClassName = 'active';

    /**
    * @name - maxDisplayedItems
    * @description - The default maximum number of items to show in the menu without scrolling, any additional items will scroll.
    * @static
    * @private
    * @type {number}
    */
    private static defaultMaxDisplayedItems = 5;

    /**
    * @name - input
    * @description - The input element.
    * @private
    * @type {HTMLInputElement}
    */
    private input: HTMLInputElement;

    /**
    * @name - button
    * @description - The button element.
    * @private
    * @type {HTMLElement}
    */
    private button: HTMLElement;

    /**
    * @name - menu
    * @description - The menu element.
    * @private
    * @type {HTMLElement}
    */
    private menu: HTMLElement;

    /**
    * @name - listItems
    * @description - The list of menu items.
    * @private
    * @type {HTMLElement[]}
    */
    private listItems: HTMLElement[];

    /**
    * @name - activeItem
    * @description - The active item.
    * @private
    * @type {HTMLElement}
    */
    private activeItem: HTMLElement;

    /**
    * @name - activeValue
    * @description - The active value. Used to store the input value to determine changes between keydown and keyup.
    *                This helps us prevent showing the menu on keys that do not change the value.
    * @private
    * @type {string}
    */
    private activeValue: string;

    /**
    * @name - maxDisplayedItems
    * @description - The maximum number of items to show in the menu without scrolling, any additional items will scroll.
    * @public
    * @type {number}
    */
    public maxDisplayedItems = Combo.defaultMaxDisplayedItems;

    /**
    * @name - constructor
    * @description - Constructor for the Combo component.
    * @public
    * @param {HTMLElement} element - the native element to attach the Combo behavior to.
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

        // find elements
        this.input = selectFirstElementT<HTMLInputElement>('input', this.element);
        this.button = selectFirstElement('button', this.element);
        this.menu = selectFirstElement('ul', this.element);
        this.listItems = selectElements('span, a', this.menu);

        if (this.input.getAttribute(Combo.role) === 'combobox') {
            this.isCombobox = true;
        }

        if (!this.input || !this.button || !this.menu || this.listItems.length < 1) {
            return;
        }

        this.activeValue = this.input.value;
        this.activeItem = selectFirstElement('span[class=\'' + Combo.activeClassName + '\']', this.menu);

        // bind elements to events
        addEvent(this.input, eventTypes.keydown, this.handleInputKeydownEvent, true);
        addEvent(this.input, eventTypes.keyup, this.handleInputKeyupEvent, true);
        addEvent(this.input, eventTypes.click, this.handleInputOrButtonClickEvent, true);
        addEvent(this.button, eventTypes.click, this.handleInputOrButtonClickEvent, true);
        addEvent(this.button, eventTypes.keydown, this.handleButtonKeydownEvent, true);
        addEvent(this.listItems, eventTypes.keydown, this.handleMenuKeydownEvent, true);
        addEvent(this.listItems, eventTypes.click, this.handleMenuClickEvent, true);

        if (this.activeItem) {
            this.setActiveItemAndHideMenu(this.activeItem, false);
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
        // Remove event listeners
        removeEvent(this.input, eventTypes.keydown, this.handleInputKeydownEvent, true);
        removeEvent(this.input, eventTypes.keyup, this.handleInputKeyupEvent, true);
        removeEvent(this.input, eventTypes.click, this.handleInputOrButtonClickEvent, true);
        removeEvent(this.button, eventTypes.click, this.handleInputOrButtonClickEvent, true);
        removeEvent(this.button, eventTypes.keydown, this.handleButtonKeydownEvent, true);
        removeEvent(this.listItems, eventTypes.keydown, this.handleMenuKeydownEvent, true);
        removeEvent(this.listItems, eventTypes.click, this.handleMenuClickEvent, true);

        // Reset non static members
        this.input = null;
        this.button = null;
        this.menu = null;
        this.listItems = null;
        this.activeItem = null;
    }

    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {IComboSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IComboSubscriber, context?: any): void {
        subscriber.onSelectionChanged(context as IComboNotification);
    }

    /**
    * @name - onSelectionChanged
    * @description - Call when subscribers need to be notified that the selection has changed.
    * @private
    * @param {boolean} internal - Whether or not this change was internally generated (true by default).
    * @param {boolean} userInitiated - Whether or not this change was user initiated (via mouse/keyboard/touch) (true by default).
    * @returns {void}
    */
    private onSelectionChanged(internal: boolean = true, userInitiated: boolean = true) {
        // TODO: 8479736: Update build step to remove commented code.
        // The following console.log useful for debugging and is left in commented out for easy restoration.
        // console.log('id(' + this.activeItem.parentElement.id + ') value(' + this.input.value + ')');
        this.initiatePublish({
            id: (!!this.activeItem && !!this.activeItem.parentElement) ? this.activeItem.parentElement.id : '',
            value: this.input.value,
            internal: internal,
            userInitiated: userInitiated
        });
    }

    /**
    * @name - getValue
    * @description - Gets the current value as an IComboNotification.
    * @public
    * @returns {IComboNotification} - The current value as an IComboNotification.
    */
    public getValue(): IComboNotification {
        return {
            id: (!!this.activeItem && !!this.activeItem.parentElement) ? this.activeItem.parentElement.id : '',
            value: this.input.value,
            internal: false,
            userInitiated: false
        };
    }

    /**
    * @name - showMenu
    * @description - Show the menu.
    * @private
    * @param {boolean} showIfNoValue - Show the menu even if the input value is null or whitespace. (false by default)
    * @param {boolean} itemFocus - Set the focus to the menu item. (true by default)
    * @returns {void}
    */
    private showMenu(showIfNoValue: boolean = false, itemFocus: boolean = true): void {
        if (this.isMenuVisible()) {
            return;
        }

        let value = this.input.value;

        if (!showIfNoValue && isNullOrWhiteSpace(value)) {
            return;
        }

        // This must be done prior to determining maxHeight or the offsetHeight's will be zero.
        this.setMenuAriaAttributes(true);

        // Make the combo box show a maximum of this.maxDisplayedItems -- the rest will be visible via a vertical scroll bar.
        let listItemLength = this.listItems.length;

        if (listItemLength > this.maxDisplayedItems) {
            let maxHeight = 0;

            for (let index = 0; index < this.maxDisplayedItems; index++) {
                maxHeight += this.listItems[index].offsetHeight;
            }

            this.menu.style.maxHeight = maxHeight + 'px';
        }

        // Add a click listener to the document to handle closing the menu when someone clicks outside of it.
        addEvent(document.body, eventTypes.click, this.handleOffMenuClick);

        this.matchItem(itemFocus);
    }

    /**
    * @name - hideMenu
    * @description - Hide the menu.
    * @private
    * @returns {void}
    */
    private hideMenu(): void {
        if (this.isMenuVisible()) {
            this.setMenuAriaAttributes(false);

            // Remove the click listener added to the document to handle closing the menu when someone clicks outside of it.
            removeEvent(document.body, eventTypes.click, this.handleOffMenuClick);
        }
    }

    /**
    * @name - setMenuAriaAttributes
    * @description - Sets the menu.
    * @private
    * @param {boolean} show - Whether or not to show or hide the menu. Default is true at instantiation.
    * @returns {void}
    */
    private setMenuAriaAttributes(show: boolean): void {
        if (this.isCombobox) {
            this.menu.setAttribute(Combo.ariaExpanded, show.toString());
        } else {
            this.menu.setAttribute(Combo.ariaHidden, (!show).toString());
        }
    }

    /**
    * @name - isMenuVisible
    * @description - Determines whether or not the menu is currently visible.
    * @private
    * @returns {boolean} - True if the menu is visible, otherwise false.
    */
    private isMenuVisible(): boolean {
        if (this.isCombobox) {
            return this.menu.getAttribute(Combo.ariaExpanded) === 'true';
        } else {
            return this.menu.getAttribute(Combo.ariaHidden) === 'false';
        }
    }

    /**
    * @name - setActiveItemAndHideMenu
    * @description - Sets the specified element to be the activeItem, updates the input value, and hides the menu.
    * @private
    * @param {HTMLElement} element - The desired activeItem element.
    * @param {boolean} focusInput - Whether or not the input should be set to the input on menu hide. Default is true
    * @returns {void}
    */
    private setActiveItemAndHideMenu(element: HTMLElement, focusInput: boolean = true): void {
        if (!!element) {
            this.setActiveItem(element);
            this.input.value = this.activeValue = this.getActiveText();
            this.hideMenu();

            if (focusInput) {
                this.input.focus();
            }

            this.onSelectionChanged();
        }
    }

    /**
    * @name - setActiveItem
    * @description - Sets the active item in the list.
    * @private
    * @param {HTMLElement} item - The menu item element to set as active.
    * @param {boolean} displayAsActive - Whether or not to visually indicate the item is active. Default is true.
    * @returns {void}
    */
    private setActiveItem(item: HTMLElement, displayAsActive: boolean = true): void {
        if (this.activeItem) {
            removeClass(this.activeItem, Combo.activeClassName);
        }

        this.activeItem = item;

        if (displayAsActive) {
            addClass(this.activeItem, Combo.activeClassName);
        }
    }

    /**
    * @name - getActiveText
    * @description - Gets the currently active item's text content.
    * @private
    * @returns {string} - The active item's text content if there is an active item, otherwise na emtpy string.
    */
    private getActiveText(): string {
        return this.activeItem ? getText(this.activeItem) : '';
    }

    /**
    * @name - matchItem
    * @description - Matches the current input.value to the best matching item, or the first item ifno match is found.
    * @private
    * @param {boolean} itemFocus - Set the focus to the matched item. (false by default)
    * @returns {void}
    */
    private matchItem(itemFocus: boolean = false): void {
        let value = this.input.value;
        let match: HTMLElement;
        let matchLength = 0;

        if (!isNullOrWhiteSpace(value)) {
            value = trim(value).toLocaleLowerCase();

            for (let item of this.listItems) {
                let itemValue = getText(item).toLocaleLowerCase();

                if (value === itemValue) {
                    match = item;
                    matchLength = -1;
                    break;
                } else {
                    let itemMatchLength = getMatchLength(itemValue, value, false);

                    if ((itemMatchLength > 0) && ((matchLength === 0) || (itemMatchLength > matchLength))) {
                        match = item;
                        matchLength = itemMatchLength;
                    }
                }
            }
        }

        if (!match) {
            match = this.listItems[0];
        }

        // If we found an exact match or we're setting focus to the one we found set it active.
        this.setActiveItem(match, itemFocus || (matchLength === -1));

        // Bring the matched item into view.
        scrollElementIntoView(match, this.menu);

        if (itemFocus) {
            match.focus();
        }
    }

    /**
    * @name - handleInputKeydown
    * @description - Handler for keydown events for the menu.
    * @private
    * @param {number} keyCode - the key code of the key that was pressed.
    * @returns {void}
    */
    private handleInputKeydown(keyCode: number): void {
        this.activeValue = this.input.value;

        switch (keyCode) {
            case keycodes.Tab:
            case keycodes.Enter:
                this.hideMenu();
                let activeItemText = this.getActiveText();

                if (this.activeValue !== activeItemText) {
                    if (hasClass(this.activeItem, Combo.activeClassName)) {
                        this.activeValue = this.input.value = activeItemText;
                    }
                    this.onSelectionChanged();
                }
                break;
            case keycodes.ArrowDown:
                if (!this.isMenuVisible()) {
                    this.showMenu(true);
                } else if (this.activeItem) {
                    this.setActiveItem(this.activeItem);
                    this.activeItem.focus();
                }
                break;
            case keycodes.Escape:
                this.hideMenu();
                break;
            default:
        }
    }

    /**
    * @name - handleInputKeyup
    * @description - Handler for keyup events for the menu.
    * @private
    * @param {number} keyCode - the key code of the key that was pressed.
    * @returns {void}
    */
    private handleInputKeyup(keyCode: number): void {
        if (isNullOrWhiteSpace(this.input.value) && (keyCode !== keycodes.ArrowDown)) {
            this.hideMenu();
        } else if (this.input.value !== this.activeValue) {
            if (!this.isMenuVisible()) {
                this.showMenu(true, false);
            } else {
                this.matchItem();
            }
        }
    }

    /**
    * @name - handleInputOrButtonClick
    * @description - Handler for click events for the input and button.
    * @private
    * @returns {void}
    */
    private handleInputOrButtonClick(): void {
        if (!this.isMenuVisible()) {
            this.showMenu(true, false);
        } else {
            this.hideMenu();
            this.input.focus();
        }
    }

    /**
    * @name - handleButtonKeydown
    * @description - Handler for keydown events for the button.
    * @private
    * @param {number} keyCode - the key code of the key that was pressed.
    * @returns {void}
    */
    private handleButtonKeydown(keyCode: number): void {
        switch (keyCode) {
            case keycodes.ArrowDown:
            case keycodes.Space:
            case keycodes.Enter: {
                this.showMenu(true);
                break;
            }

            case keycodes.ArrowUp:
            case keycodes.Escape: {
                this.hideMenu();
                break;
            }
        }
    }

    /**
    * @name - handleMenuKeydown
    * @description - Handler for a keydown event on the menu.
    * @private
    * @param {HTMLElement} target - the target element of the keyboard event
    * @param {number} keyPressed - the keycode of the keyboard event
    * @returns {void}
    */
    private handleMenuKeydown(target: HTMLElement, keyPressed: number): void {
        switch (keyPressed) {
            case keycodes.Space:
            case keycodes.Tab:
            case keycodes.Enter:
                this.setActiveItemAndHideMenu(this.activeItem, keyPressed !== keycodes.Tab);
                break;
            case keycodes.Escape:
                this.input.focus();
                this.hideMenu();
                this.matchItem();
                break;
            case keycodes.ArrowUp:
                this.handleMenuArrowKey(true, target);
                break;
            case keycodes.ArrowDown:
                this.handleMenuArrowKey(false, target);
                break;
        }
    }

    /**
    * @name - handleMenuArrowKey
    * @description - Handler for an arrow key on the menu.
    * @private
    * @param {boolean} isUpArrow - true means the arrow key pressed was the up arrow, false means the down arrow key was pressed
    * @param {HTMLElement} currentItem - the item currently focused on
    * @returns {void}
    */
    private handleMenuArrowKey(isUpArrow: boolean, currentItem: HTMLElement): void {
        let currentItemIndex = this.listItems.indexOf(currentItem);

        if (currentItemIndex === -1) {
            return;
        }

        currentItemIndex += isUpArrow ? -1 : 1;

        if (currentItemIndex < 0) {
            currentItemIndex = this.listItems.length - 1;
        } else if (currentItemIndex >= this.listItems.length) {
            currentItemIndex = 0;
        }

        let target = this.listItems[currentItemIndex];

        this.setActiveItem(target);
        target.focus();
    }

    /**
    * @name - handleMenuClick
    * @description - Handler for a click event on the menu.
    * @private
    * @param {HTMLElement} target - the target element of the keyboard event
    * @returns {void}
    */
    private handleMenuClick(target: HTMLElement): void {
        this.setActiveItemAndHideMenu(target);
    }

    // --------------------------------------------------------------------------------------------
    // Event listeners
    // --------------------------------------------------------------------------------------------

    /**
    * @name - handleInputKeydownEvent
    * @description - Handler for input keydown events, calls handleInputKeydown which does the real work.
    * @private
    * @param {KeyboardEvent} event - The keyboard event.
    * @returns {void}
    */
    private handleInputKeydownEvent = (event: KeyboardEvent): void => {
        let keyCode = getKeyCode(event);

        if ((keyCode === keycodes.Enter) || (keyCode === keycodes.ArrowDown)) {
            // Stop the enter key from submitting the combo form
            preventDefault(event);
        }

        this.handleInputKeydown(keyCode);
    }

    /**
    * @name - handleInputKeyupEvent
    * @description - Handler for input keyup event, calls handleInputKeyup which does the real work.
    * @private
    * @param {KeyboardEvent} event - The keyboard event.
    * @returns {void}
    */
    private handleInputKeyupEvent = (event: KeyboardEvent): void => {
        this.handleInputKeyup(getKeyCode(event));
    }

    /**
    * @name - handleInputOrButtonClickEvent
    * @description - Handler for input or button click events, calls handleInputOrButtonClick which does the real work.
    * @private
    * @param {UIEvent} event - The click event.
    * @returns {void}
    */
    private handleInputOrButtonClickEvent = (event: UIEvent): void => {
        preventDefault(event);

        this.handleInputOrButtonClick();
    }

    /**
    * @name - handleButtonKeydownEvent
    * @description - Handler for button arrow down events, calls handleButtonKeydown which does the real work.
    * @private
    * @param {KeyboardEvent} event - The keyboard event.
    * @returns {void}
    */
    private handleButtonKeydownEvent = (event: KeyboardEvent): void => {
        let keyCode = getKeyCode(event);

        if (keyCode !== keycodes.Tab) {
            preventDefault(event);
        }

        this.handleButtonKeydown(keyCode);
    }

    /**
    * @name - handleMenuKeydownEvent
    * @description - Handler for menu keydown events, calls handleMenuKeydown which does the real work.
    * @private
    * @param {KeyboardEvent} event - The keyboard event.
    * @returns {void}
    */
    private handleMenuKeydownEvent = (event: KeyboardEvent): void => {
        let keyCode = getKeyCode(event);

        if (keyCode !== keycodes.Tab) {
            preventDefault(event);
        }

        this.handleMenuKeydown(getEventTargetOrSrcElement(event), keyCode);
    }

    /**
    * @name - handleMenuClickEvent
    * @description - Handler for menu click events, calls handleMenuClick which does the real work.
    * @private
    * @param event {UIEvent} - The mouse event
    * @returns {void}
    */
    private handleMenuClickEvent = (event: UIEvent): void => {
        this.handleMenuClick(getEventTargetOrSrcElement(event));
    }

    /**
    * @name - handleOffMenuClick
    * @description - Handler for click events outside the menu when it is open.
    * @private
    * @param {UIEvent} event - The click event
    * @returns {void}
    */
    private handleOffMenuClick = (event: UIEvent): void => {
        if (!this.element.contains(getEventTargetOrSrcElement(event))) {
            this.hideMenu();
        }
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Combo.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Combo,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}