/// <amd-module name="actionMenu"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {Publisher, ISubscriber} from 'publisher';
import {getKeyCode} from 'utility';
import {keycodes} from 'keycodes';
import {
    selectFirstElement,
    selectElementsT,
    getEvent,
    hasClass,
    addClass,
    removeClass,
    addEvent,
    removeEvent,
    eventTypes,
    preventDefault,
    getEventTargetOrSrcElement
} from 'htmlExtensions';

/**
* @interface IActionMenuNotification
* @interfacedesc - The data contract interface used for ActionMenu notifications.
* @export
*/
export interface IActionMenuNotification {
    id?: string;
}

/**
* @interface IActionMenuSubscriber
* @interfacedesc - The interface which ActionMenu notification subscribers must implement.
* @export
*/
export interface IActionMenuSubscriber extends ISubscriber {
    onSelection(notification: IActionMenuNotification): void;
}

/**
* @class - ActionMenu
* @classdesc - The ActionMenu component
*/
export class ActionMenu extends Publisher<IActionMenuSubscriber> {
    /**
     * @name - selector
     * @description - selector to use to find ActionMenu components in the document.
     * @static
     * @public
     * @type {string}
     */
    public static selector = '.c-action-menu';

    /**
     * @name - ariaExpanded
     * @description - This attribute to set to true/false to indicate whether or not a non-leaf menu is expanded.
     * @private
     * @static
     * @type {string}
     */
    private static ariaExpanded = 'aria-expanded';

    /**
     * @name - persist
     * @description - Indicates whether or not the selected menu item value should be persisted in the trigger.
     * @private
     * @type {boolean}
     */
    private persist: boolean;

    /**
     * @name - triggerSelector
     * @description - The ActionMenu's trigger (dropdown) selector.
     * @private
     * @type {string}
     */
    private static triggerSelector = ActionMenu.selector + ' > button.c-action-trigger';

    /**
     * @name - menu
     * @description - The ActionMenu's menu selector.
     * @private
     * @type {string}
     */
    private static menuSelector = ActionMenu.triggerSelector + ' + ul[role="menu"]';

    /**
     * @name - trigger
     * @description - The ActionMenu's trigger (dropdown) element.
     * @private
     * @type {HTMLElement}
     */
    private trigger: HTMLElement;

    /**
     * @name - menu
     * @description - The ActionMenu's menu element.
     * @private
     * @type {HTMLElement}
     */
    private menu: HTMLElement;

    /**
     * @name - items
     * @description - The ActionMenu's menu items.
     * @private
     * @type {HTMLElement}
     */
    private items: HTMLElement[];

    /**
     * @name - selectedItem
     * @description - The ActionMenu's currently selected menu item element.
     * @private
     * @type {HTMLElement}
     */
    private selectedItem: HTMLElement;

    /**
     * @name - disabled
     * @description - The disabled state of the action menu
     * @private
     * @type {boolean}
     */
    private disabled: boolean;

    /**
     * @name - constructor
     * @description - Constructor for the ActionMenu component.
     * @public
     * @param {HTMLElement} element - the native element to attach the ActionMenu behavior to.
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
        this.trigger = selectFirstElement(ActionMenu.triggerSelector, this.element);

        this.menu = selectFirstElement(ActionMenu.menuSelector, this.element);

        this.items = selectElementsT<HTMLElement>('li[class^="f-context-"]', this.element);
        this.disabled = this.trigger.hasAttribute('disabled');

        if (!!this.trigger && !!this.menu && !!this.items && !!this.items.length) {
            // Save the expanded state as onItemSelected may collapse it.
            let showExpanded = this.isExpanded();

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
        if (!!this.trigger && !!this.menu && !!this.items && !!this.items.length) {
            this.removeEventListeners();
        }
        // Reset non static members
        this.trigger = null;
        this.menu = null;
        this.items = null;
        this.selectedItem = null;
    }

    /**
     * @name - isExpanded
     * @description - Check the expanded state.
     * @private
     * @return {boolean} - True if the ActionMenu is expanded, otherwise false.
     */
    private isExpanded(): boolean {
        return (this.trigger.getAttribute(ActionMenu.ariaExpanded) === 'true');
    }

    /**
     * @name - expand
     * @description - Expand the ActionMenu.
     * @private
     * @return {void}
     */
    private expand(): void {
        removeClass(this.trigger, 'x-hidden-focus');
        addClass(this.trigger, 'f-active');
        this.trigger.setAttribute(ActionMenu.ariaExpanded, 'true');
    }

    /**
     * @name - collapse
     * @description - Collapse the ActionMenu.
     * @private
     * @return {void}
     */
    private collapse(): void {
        removeClass(this.trigger, 'f-active');
        this.trigger.setAttribute(ActionMenu.ariaExpanded, 'false');
    }

    /**
     * @name - addEventListeners
     * @description - Add the click event listeners needed by the ActionMenu trigger and links.
     * @private
     * @return {void}
     */
    private addEventListeners(): void {
        addEvent(this.trigger, eventTypes.click, this.onTriggerClick);
        addEvent(this.trigger, eventTypes.keydown, this.onTriggerKeyPress);
        addEvent(this.menu, eventTypes.keydown, this.handleMenuKeydownEvent, true);

        for (let item of this.items) {
            addEvent(item, eventTypes.click, this.onItemClick);
        }

        addEvent(document, eventTypes.click, this.onNonActionMenuClick);
    }

    /**
     * @name - removeEventListeners
     * @description - Remove the click event listeners needed by the ActionMenu trigger and links.
     * @private
     * @return {void}
     */
    private removeEventListeners(): void {
        removeEvent(this.trigger, eventTypes.click, this.onTriggerClick);
        removeEvent(this.trigger, eventTypes.keydown, this.onTriggerKeyPress);
        removeEvent(this.menu, eventTypes.keydown, this.handleMenuKeydownEvent, true);

        for (let item of this.items) {
            removeEvent(item, eventTypes.click, this.onItemClick);
        }

        removeEvent(document, eventTypes.click, this.onNonActionMenuClick);
    }

    /**
     * @name - onTriggerToggled
     * @description - Toggles the expand/collapse state of the ActionMenu's trigger.
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
     * @description - Makes the specified item the ActionMenu's selected item.
     * @private
     * @param {HTMLElement} item - the item to make the selected one.
     * @returns {void}
     */
    private onItemSelected(item: HTMLElement): void {
        this.selectedItem = item;

        // Collapse the action menu when selected
        this.collapse();

        this.initiatePublish({
            id: this.selectedItem.id
        });
    }

    /**
     * @name - publish
     * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
     *                This method will be called once for each registered subscriber.
     * @protected
     * @param {IActionMenuSubscriber} subscriber - the subscriber to make the callback to.
     * @param {any} context - the publish context use to determine which interface callback to make.
     * @returns {void}
     */
    protected publish(subscriber: IActionMenuSubscriber, context?: any): void {
        if (!!this.selectedItem) {
            subscriber.onSelection(context as IActionMenuNotification);
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
        const eventTarget = event.currentTarget as HTMLElement;

        if (!eventTarget.hasAttribute('aria-disabled')) {
            this.onItemSelected(eventTarget);
        }
    }

    /**
     * @name - onNonActionMenuClick
     * @description - Non-ActionMenu click handler.
     * @private
     * @param {MouseEvent} event - the click MouseEvent.
     * @returns {void}
     */
    private onNonActionMenuClick = (event: MouseEvent): void => {
        event = getEvent(event) as MouseEvent;
        if (!!this.element && !!this.menu) {
            let target = getEventTargetOrSrcElement(event);

            if (!this.element.contains(target)) {
                if ((target !== this.menu) && ((target as Node).parentElement !== this.menu)) {
                    this.collapse();
                }
            }
        }
    }

    /**
     * @name - onTriggerKeyPress
     * @description - Trigger keypress handler.
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
                    const firstMenuItem = this.items[0];

                    this.onTriggerToggled();
                    firstMenuItem.setAttribute('tabindex', '0');
                    firstMenuItem.focus();
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
                if (!target.hasAttribute('aria-disabled')) {
                    this.handleMenuEnterKey(target);
                    this.trigger.focus();
                }
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
                    this.trigger.focus();
                    this.collapse();
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

        let nextItemIndex = isUpArrow ? currentItemIndex - 1 : currentItemIndex + 1;

        if (nextItemIndex < 0) {
            nextItemIndex = this.items.length - 1;
        } else if (nextItemIndex >= this.items.length) {
            nextItemIndex = 0;
        }

        this.items[currentItemIndex].removeAttribute('tabindex');
        this.items[nextItemIndex].setAttribute('tabindex', '0');
        this.items[nextItemIndex].focus();
    }

    /**
     * @name - handleMenuEnterKey
     * @description - Handler for an arrow key on the menu.
     * @private
     * @param {HTMLElement} currentItem - the item currently focused on
     * @returns {void}
     */
    private handleMenuEnterKey(currentItem: HTMLElement): void {
        this.onItemSelected(currentItem);
    }
}