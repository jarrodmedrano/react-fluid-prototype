/// <amd-module name="selectMenu"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {Publisher, ISubscriber} from 'publisher';
import {
    addEvent,
    eventTypes,
    getEvent,
    getEventTargetOrSrcElement,
    getText,
    hasClass,
    preventDefault,
    removeEvent,
    selectElementsT,
    selectFirstElement,
    selectFirstElementT,
} from 'htmlExtensions';
import {apiDeprecated, getKeyCode} from 'utility';
import {keycodes} from 'keycodes';

/**
* @interface ISelectMenuNotification
* @interfacedesc - The data contract interface used for SelectMenu notifications.
* @export
*/
export interface ISelectMenuNotification {
    id?: string;
    href?: string;
    internal: boolean;
    userInitiated: boolean;
}

/**
* @interface ISelectMenuSubscriber
* @interfacedesc - The interface which SelectMenu notification subscribers must implement.
* @export
*/
export interface ISelectMenuSubscriber extends ISubscriber {
    onSelectionChanged(notification: ISelectMenuNotification): void;
}

/**
* @class - SelectMenu
* @classdesc - The SelectMenu component
*/
export class SelectMenu extends Publisher<ISelectMenuSubscriber> {
    /**
     * @name - selector
     * @description - selector to use to find SelectMenu components in the document.
     * @static
     * @public
     * @type {string}
     */
    public static selector = '.c-select-menu';

    /**
     * @name - ariaExpanded
     * @description - This attribute to set to true/false to indicate whether or not a non-leaf menu is expanded.
     * @private
     * @static
     * @type {string}
     */
    private static ariaExpanded = 'aria-expanded';

    /**
     * @name - ariaHidden
     * @description - This attribute to set to true/false to indicate whether or not a non-leaf menu is hidden.
     * @private
     * @static
     * @type {string}
     */
    private static ariaHidden = 'aria-hidden';

    /**
     * @name - ariaSelected
     * @description - This attribute to set to true/false to indicate whether or not a menu item is the currently selected one.
     * @private
     * @static
     * @type {string}
     */
    private static ariaSelected = 'aria-selected';

    /**
     * @name - ariaChecked
     * @description - This attribute to set to true/false to indicate whether or not a menu item is the currently selected one.
     * @private
     * @static
     * @type {string}
     */
    private static ariaChecked = 'aria-checked';

    /**
     * @name - persist
     * @description - Indicates whether or not the selected menu item value should be persisted in the trigger.
     * @private
     * @type {boolean}
     */
    private persist: boolean;

    /**
     * @name - trigger
     * @description - The SelectMenu's trigger (dropdown) element.
     * @private
     * @type {HTMLElement}
     */
    private trigger: HTMLElement;

    /**
     * @name - menu
     * @description - The SelectMenu's menu element.
     * @private
     * @type {HTMLElement}
     */
    private menu: HTMLElement;

    /**
     * @name - items
     * @description - The SelectMenu's menu items.
     * @private
     * @type {HTMLElement}
     */
    private items: HTMLElement[];

    /**
     * @name - selectedItem
     * @description - The SelectMenu's currently selected menu item element.
     * @private
     * @type {HTMLElement}
     */
    private selectedItem: HTMLElement;

    /**
     * @name - disabled
     * @description - The disabled state of the select menu
     * @private
     * @type {boolean}
     */
    private disabled: boolean;

    /**
      * @name - universalHeaderMenuSelector
      * @description - The class that will be added to select component if it is added for universal header and footer.
      *
      * @private
      * @static
      * @type {string}
      */
    private static universalHeaderMenuSelector = 'js-nav-menu';

    /**
     * @name - constructor
     * @description - Constructor for the SelectMenu component.
     * @public
     * @param {HTMLElement} element - the native element to attach the SelectMenu behavior to.
     */
    constructor(element: HTMLElement) {
        super(element);
        // TODO: 8548794 - Right now we have two behaviors for c-select component.
        // As part of this todo we should combine and have a single select behavior.
        // The below if block is a temporary fix not to have this behavior applied,
        // if the component is added as part of UHF.
        if (element && hasClass(element, SelectMenu.universalHeaderMenuSelector)) {
            super.unObserve();
            return;
        }
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

        this.persist = hasClass(this.element, 'f-persist');

        this.trigger = selectFirstElementT<HTMLElement>('[role="button"]', this.element);

        if (!this.trigger) {
            this.trigger = selectFirstElementT<HTMLElement>('button', this.element);
        }

        this.menu = selectFirstElement('.c-menu', this.element);
        let isAnchor = selectElementsT<HTMLElement>('.c-menu-item a', this.element);

        if (isAnchor.length > 0) {
            this.items = isAnchor;
        } else {
            this.items = selectElementsT<HTMLElement>('.c-menu-item span', this.element);
        }
        this.disabled = this.element.getAttribute('aria-disabled') === 'true' ? true : false;

        if (!!this.trigger && !!this.menu && !!this.items && !!this.items.length) {
            let selectedItem: HTMLElement = null;

            // Find the first selected item, if any, and ensure all others are unselected.
            for (let item of this.items) {
                if (this.itemIsSelected(item) && selectedItem === null) {
                    selectedItem = item;
                    item.setAttribute(this.getSelectedAttribute(item), 'true');
                } else {
                    item.setAttribute(this.getSelectedAttribute(item), 'false');
                }

                item.setAttribute('tabindex', '-1');
                this.cleanSelectedAttributes(item);

                if (!item.hasAttribute('role')) {
                    item.setAttribute('role', 'menuitem');
                }
            }

            // Save the expanded state as onItemSelected may collapse it.
            let showExpanded = this.isExpanded();

            this.onItemSelected(selectedItem, true, false);
            this.addEventListeners();

            if (showExpanded) {
                this.expand();
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
        // Remove the click listeners.
        removeEvent(this.trigger, eventTypes.click, this.onTriggerClick);
        removeEvent(this.trigger, eventTypes.keydown, this.onTriggerKeyPress);
        removeEvent(this.menu, eventTypes.keydown, this.handleMenuKeydownEvent, true);

        for (let item of this.items) {
            removeEvent(item, eventTypes.click, this.onItemClick);
        }

        removeEvent(document, eventTypes.click, this.onNonSelectMenuClick);
        removeEvent(this.items[this.items.length - 1], eventTypes.keydown, this.onNonSelectMenuTab);

        // Reset non static members
        this.persist = false;
        this.trigger = null;
        this.menu = null;
        this.items = null;
        this.selectedItem = null;
    }

    /**
     * @name - setSelectedItem
     * @description - Sets the selected menu item to be the one with the specified id.
     * @public
     * @param {string} id - the id of the menu item to select.
     * @returns {boolean} True if the selection was successfully changed, otherwise false.
     */
    public setSelectedItem(id: string): boolean {
        if (!id || !this.element) {
            return false;
        }

        return this.onItemSelected(selectFirstElementT<HTMLElement>('li[id=\'' + id + '\'] > a', this.element), false, false);
    }

    /**
     * @name - isExpanded
     * @description - Check the expanded state.
     * @private
     * @return {boolean} - True if the selectMenu is expanded, otherwise false.
     */
    private isExpanded(): boolean {
        return (!!this.trigger && !!this.menu &&
            (this.trigger.getAttribute(SelectMenu.ariaExpanded) === 'true') &&
            (this.menu.getAttribute(SelectMenu.ariaHidden) === 'false'));
    }

    /**
      * @name - itemIsSelected
      * @description - Check if the item is selected.
      * @private
      * @param {HTMLElement} item - the item to check for selected state.
      * @return {boolean} - True if the item is selected, otherwise false.
      */
    private itemIsSelected(item: HTMLElement):boolean {
        return item.getAttribute(SelectMenu.ariaSelected) === 'true' || item.getAttribute(SelectMenu.ariaChecked) === 'true';
    }

    /**
      * @name - getSelectedAttribute
      * @description - Return the appropriate attribute to indicate a "selected" item based on the items aria-role.
      * @private
      * @param {HTMLElement} item - the item to get the selected attribute of.
      * @return {string} - The aria attribute to indicate selection (aria-selected or aria-checked).
      */
    private getSelectedAttribute(item: HTMLElement): string {
        return item.getAttribute('role') === 'menuitemradio' ? SelectMenu.ariaChecked : SelectMenu.ariaSelected;
    }

    /**
      * @name - cleanSelectedAttributes
      * @description - Removes attributes indicating "selected" state that do not belong on a particular role.
      *                This is only necessary because we need to support legacy shapes.
      * @private
      * @param {HTMLElement} item - the item remove attributes from.
      * @return {void}
      */
    private cleanSelectedAttributes(item: HTMLElement):void {
        let attributeToRemove = this.getSelectedAttribute(item) === SelectMenu.ariaSelected
            ? SelectMenu.ariaChecked
            : SelectMenu.ariaSelected;
        item.removeAttribute(attributeToRemove);
    }

    /**
     * @name - expand
     * @description - Expand the SelectMenu.
     * @private
     * @return {void}
     */
    private expand(): void {
        if (!!this.trigger && !!this.menu) {
            this.trigger.setAttribute(SelectMenu.ariaExpanded, 'true');
            this.menu.setAttribute(SelectMenu.ariaHidden, 'false');

            if (!!this.items) {
                const selectedIndex = this.items.indexOf(this.selectedItem);
                const focusIndex = selectedIndex === -1 ? 0 : selectedIndex;
                this.items[focusIndex].focus();
            }
        }
    }

    /**
     * @name - collapse
     * @description - Collapse the SelectMenu.
     * @private
     * @return {void}
     */
    private collapse(): void {
        if (!!this.trigger && !!this.menu) {
            this.trigger.setAttribute(SelectMenu.ariaExpanded, 'false');
            this.menu.setAttribute(SelectMenu.ariaHidden, 'true');
        }
    }

    /**
     * @name - addEventListeners
     * @description - Add the click event listeners needed by the SelectMenu trigger and links.
     * @private
     * @return {void}
     */
    private addEventListeners(): void {
        if (!!this.trigger && !!this.items) {
            addEvent(this.trigger, eventTypes.click, this.onTriggerClick);
            addEvent(this.trigger, eventTypes.keydown, this.onTriggerKeyPress);
            addEvent(this.menu, eventTypes.keydown, this.handleMenuKeydownEvent, true);

            for (let item of this.items) {
                addEvent(item, eventTypes.click, this.onItemClick);
            }

            addEvent(this.items[this.items.length - 1], eventTypes.keydown, this.onNonSelectMenuTab);
            addEvent(document, eventTypes.click, this.onNonSelectMenuClick);
        }
    }

    /**
     * @name - onTriggerToggled
     * @description - Toggles the expand/collapse state of the SelectMenu's trigger.
     * @private
     * @returns {void}
     */
    private onTriggerToggled(): void {
        if (this.isExpanded()) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    /**
     * @name - onItemSelected
     * @description - Makes the specified item the SelectMenu's selected item.
     * @private
     * @param {HTMLElement} item - the item to make the selected one.
     * @param {boolean} internal - True if this selection was internally generated (update), otherwise false (setSelectedItem).
     * @param {boolean} userInitiated - True if this selection was user initiated (mouse/keyboard), otherwise false (init/api).
     * @returns {boolean} - True if the selected item was changed, otherwise false.
     */
    private onItemSelected(item: HTMLElement, internal: boolean, userInitiated: boolean): boolean {
        if (!item || (item === this.selectedItem)) {
            // We still need to collapse the menu even if they clicked on the currently selected item.
            this.collapse();
            return false;
        }

        if (this.persist && this.trigger) {
            this.trigger.innerHTML = getText(item);
        }

        if (this.selectedItem) {
            this.selectedItem.setAttribute(this.getSelectedAttribute(this.selectedItem), 'false');
        }

        // TODO: 8479736: Update build step to remove commented code.
        // The following console.log useful for debugging and is left in commented out for easy restoration.
        // console.log(
        // 'selectMenu.onSelectionChanged: ' +
        // 'id(' + (this.selectedItem ? this.selectedItem.parentElement.id : 'null') +
        // ' => ' + item.parentElement.id + ') ' +
        // 'href(' + (item ? item.getAttribute('href') : 'null') + ') ' +
        // 'internal(' + internal + ') ' +
        // 'userInitiated(' + userInitiated + ')');

        this.selectedItem = item;
        this.selectedItem.setAttribute(this.getSelectedAttribute(this.selectedItem), 'true');

        // Collapse menu once item is selected
        this.collapse();

        this.initiatePublish({
            id: this.selectedItem.parentElement.id,
            href: this.selectedItem.getAttribute('href'),
            internal: internal,
            userInitiated: userInitiated
        });

        return true;
    }

    /**
     * @name - publish
     * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
     *                This method will be called once for each registered subscriber.
     * @protected
     * @param {ISelectMenuSubscriber} subscriber - the subscriber to make the callback to.
     * @param {any} context - the publish context use to determine which interface callback to make.
     * @returns {void}
     */
    protected publish(subscriber: ISelectMenuSubscriber, context?: any): void {
        if (!!this.selectedItem) {
            subscriber.onSelectionChanged(context as ISelectMenuNotification);
        }
    }

    // ---------------------------------------------------------------------------------------------
    // Event listeners section
    // ---------------------------------------------------------------------------------------------

    /**
     * @name - onTriggerClick
     * @description - Trigger click handler.
     * @private
     * @param {Event} event - The click event.
     * @returns {void}
     */
    private onTriggerClick = (event: Event): void => {
        event = getEvent(event) as MouseEvent;
        preventDefault(event);

        if (!this.disabled) {
            this.onTriggerToggled();
        }
    }

    /**
     * @name - onItemClick
     * @description - Item click handler.
     * @private
     * @param {Event} event - The click event.
     * @returns {void}
     */
    private onItemClick = (event: Event): void => {
        event = getEvent(event) as MouseEvent;
        this.onItemSelected(getEventTargetOrSrcElement(event), false, true);
    }

    /**
     * @name - onNonSelectMenuClick
     * @description - Non-SelectMenu click handler.
     * @private
     * @param {MouseEvent} event - the click MouseEvent.
     * @returns {void}
     */
    private onNonSelectMenuClick = (event: MouseEvent): void => {
        event = getEvent(event) as MouseEvent;
        if (!!this.element && !! this.menu) {
            let target = getEventTargetOrSrcElement(event);

            if (!this.element.contains(target)) {
                if ((target !== this.menu) && ((target as Node).parentElement !== this.menu)) {
                    this.collapse();
                }
            }
        }
    }

    /**
     * @name - onNonSelectMenuTab
     * @description - Non-SelectMenu tab handler.
     * @private
     * @param {KeyboardEvent} event - the keyboard event.
     * @returns {void}
     */
    private onNonSelectMenuTab = (event: KeyboardEvent): void => {
        event = getEvent(event) as KeyboardEvent;
        let keycode = getKeyCode(event);

        if (keycode === keycodes.Tab) {
            this.collapse();
        }
    }

    /**
     * @name - onTriggerKeyPress
     * @description -
     * @private
     * @param {KeyboardEvent} event - the keyboard event.
     * @returns {void}
     */
    private onTriggerKeyPress = (event: KeyboardEvent): void => {
        event = getEvent(event) as KeyboardEvent;
        let keycode = getKeyCode(event);

        switch (keycode) {
            case keycodes.Enter:
            case keycodes.Space:
                preventDefault(event);
                if (!this.disabled) {
                    this.onTriggerToggled();
                }
            default:
        }
    }

    /**
     * @name - handleMenuKeydownEvent
     * @description - Handler for menu keydown events, calls handleMenuKeydown which does the real work.
     * @private
     * @param {KeyboardEvent} event - The keyboard event.
     * @returns {void}
     */
    private handleMenuKeydownEvent = (event: KeyboardEvent): void => {
        event = getEvent(event) as KeyboardEvent;
        let keyCode = getKeyCode(event);

        if (keyCode !== keycodes.Tab || this.isExpanded()) {
            preventDefault(event);
        }

        this.handleMenuKeydown(getEventTargetOrSrcElement(event), keyCode);
    }

    /**
     * @name - handleMenuKeydown
     * @description - Handler for a keydown event on the menu.
     * @private
     * @param {HTMLElement} target - the target element of the keyboard event
     * @param {number} keycode - the keycode of the keyboard event
     * @returns {void}
     */
    private handleMenuKeydown(target: HTMLElement, keycode: number): void {
        switch (keycode) {
            case keycodes.Space:
            case keycodes.Enter:
                this.handleMenuEnterKey(target);
                this.trigger.focus();
                break;
            case keycodes.Escape:
                this.trigger.focus();
                this.collapse();
                break;
            case keycodes.ArrowUp:
                this.handleMenuArrowKey(true, target);
                break;
            case keycodes.ArrowDown:
                this.handleMenuArrowKey(false, target);
                break;
            case keycodes.Tab:
                if (this.isExpanded()) {
                    this.handleMenuEnterKey(target);
                    this.trigger.focus();
                }
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
        let currentItemIndex = this.items.indexOf(currentItem);

        if (currentItemIndex === -1) {
            return;
        }

        currentItemIndex += isUpArrow ? -1 : 1;

        if (currentItemIndex < 0) {
            currentItemIndex = this.items.length - 1;
        } else if (currentItemIndex >= this.items.length) {
            currentItemIndex = 0;
        }

        this.items[currentItemIndex].focus();
    }

    /**
     * @name - handleMenuEnterKey
     * @description - Handler for an arrow key on the menu.
     * @private
     * @param {HTMLElement} currentItem - the item currently focused on
     * @returns {void}
     */
    private handleMenuEnterKey(currentItem: HTMLElement): void {
        this.onItemSelected(currentItem, false, true);
    }

    /**
     * TODO: Remove this method as soon as we can verify partners are no longer calling it.
     */
    public static init(input: any): void {
        apiDeprecated('SelectMenu.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: SelectMenu,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}