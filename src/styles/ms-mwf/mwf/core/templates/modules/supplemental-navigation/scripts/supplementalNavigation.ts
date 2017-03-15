/// <amd-module name="supplementalNavigation"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {
    addClass,
    addEvent,
    eventTypes,
    getEventTargetOrSrcElement,
    preventDefault,
    removeClass,
    removeEvent,
    selectElements
} from 'htmlExtensions';
import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {apiDeprecated, getKeyCode} from 'utility';
import {keycodes} from 'keycodes';

/**
* @class - SupplementalNavigation
* @classdesc - The SupplementalNavigation component
* @export
*/
export class SupplementalNavigation extends ObservableComponent {
    /**
    * @name - selector
    * @description - The SupplementalNavigation module selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.m-supplemental-nav';

    /**
    * @name - activeSelector
    * @description - The active item selector.
    * @static
    * @private
    * @type {string}
    */
    private static activeSelector = 'f-active';

    /**
    * @name - itemSelector
    * @description - The item selector.
    * @static
    * @private
    * @type {string}
    */
    private static itemSelector = 'a, button';

    /**
    * @name - tabIndexAttribute
    * @description - The tabindex attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static tabIndexAttribute = 'tabindex';

    /**
    * @name - dataState
    * @description - The data-state attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static dateState = 'data-state';

    /**
    * @name - stateNames
    * @description - The data-state attribute values.
    * @static
    * @private
    * @type {string}
    */
    private static stateNames = { expanded: 'expanded', collapsed: 'collapsed' };

    /**
    * @name - items
    * @description - The list of items.
    * @private
    * @type {HTMLElement}
    */
    private items: HTMLElement[];

    /**
    * @name - activeItem
    * @description - The active item.
    * @private
    * @type {HTMLElement}
    */
    private activeItem: HTMLElement;

    /**
    * @name - expandedItem
    * @description - The expanded item.
    * @private
    * @type {HTMLElement}
    */
    private expandedItem: HTMLElement;

    /**
    * @name - constructor
    * @description - Constructor for the SupplementalNavigation module.
    * @public
    * @param {HTMLElement} element - the native element to attach the SupplementalNavigation behavior to.
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
            return null;
        }

        this.items = selectElements(SupplementalNavigation.itemSelector, this.element);

        let activeItems = selectElements( '.' + SupplementalNavigation.activeSelector, this.element);

        this.activeItem = (!activeItems) ? null : activeItems.shift();

        // If for any reason there was more than one active item make all except the first inactive.
        for (let item of activeItems) {
            removeClass(item, SupplementalNavigation.activeSelector);
        }

        // Ensure that the expandedItem is synced to the activeItem
        this.syncExpandedItem();

        // Loop through all the anchors hooking up the appropriate click handler for each one
        if (this.items && this.items.length) {
            for (let item of this.items) {
                if (this.isExpandable(item)) {
                    // Hook all expandable items up to the expand/collapse handler
                    addEvent(item, eventTypes.click, this.onExpandableItemClicked);
                } else {
                    // Hook all non-expandable items up to the activation handler
                    addEvent(item, eventTypes.click, this.onActivatableItemClicked);
                }
            }

            addEvent(this.items, eventTypes.keydown, this.keydownEventListener);
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
        // Loop through all the anchors and remove hooks for each one
        if (this.items && this.items.length) {
            for (let item of this.items) {
                if (this.isExpandable(item)) {
                    // Hook all expandable items up to the expand/collapse handler
                    removeEvent(item, eventTypes.click, this.onExpandableItemClicked);
                } else {
                    // Hook all non-expandable items up to the activation handler
                    removeEvent(item, eventTypes.click, this.onActivatableItemClicked);
                }
            }

            removeEvent(this.items, eventTypes.keydown, this.keydownEventListener);
        }

        // Reset non static members
        this.items = null;
        this.activeItem = null;
        this.expandedItem = null;
    }

    /**
    * @name - setExpandedItem
    * @description - Set the specified expandable item to be the expanded item.
    * @private
    * @param  {HTMLElement} item
    * @returns {void}
    */
    private setExpandedItem(item: HTMLElement): void {
        if ((!!item) && (item !== this.expandedItem)) {
            this.collapseItem(this.expandedItem);
            this.expandItem(item);
        }
    }

    /**
    * @name - setActiveItem
    * @description - Set the specified non expandable item to be the active item.
    * @private
    * @param  {HTMLElement} item
    * @returns {void}
    */
    private setActiveItem(item: HTMLElement): void {
        if ((!!item) && (!!item.parentElement) && (item.parentElement.getAttribute('aria-hidden') !== 'false')) {
            this.expandedItem = null;
        }
        if ((!!item) && (item !== this.activeItem)) {
            removeClass(this.activeItem, SupplementalNavigation.activeSelector);
            this.activeItem = item;
            addClass(this.activeItem, SupplementalNavigation.activeSelector);
            this.syncExpandedItem();
        }
    }

    /**
    * @name - expandItem
    * @description - Expands the specified expandable item.
    * @private
    * @param  {HTMLElement} item
    * @returns {void}
    */
    private expandItem(item: HTMLElement): void {
        if (!!item) {
            let toExpand = this.getExpandableElementForExpandableItem(item);
            let expanded = this.getExpandableElementForExpandableItem(this.expandedItem);

            if ((!!toExpand) && ((!expanded) || (toExpand !== expanded))) {
                item.setAttribute('data-state', SupplementalNavigation.stateNames.expanded);
                toExpand.setAttribute('aria-hidden', 'false');
                toExpand.style.height = 'auto';
                toExpand.style.overflow = 'visible';
                this.collapseItem(this.expandedItem);
                this.expandedItem = item;

                // Restore the expanded items to the default tab order.
                for (let item of selectElements(SupplementalNavigation.itemSelector, toExpand)) {
                    item.removeAttribute(SupplementalNavigation.tabIndexAttribute);
                }
            }
        }
    }

    /**
    * @name - collapseItem
    * @description - Collapses the specified expandable item.
    * @private
    * @param  {HTMLElement} item
    * @returns {void}
    */
    private collapseItem(item: HTMLElement): void {
        if (!!item) {
            let expandedElement = document.getElementById(item.getAttribute('aria-controls'));
            if (!!expandedElement) {
                item.setAttribute('data-state', SupplementalNavigation.stateNames.collapsed);
                expandedElement.setAttribute('aria-hidden', 'true');
                expandedElement.style.height = '0';
                expandedElement.style.overflow = 'hidden';

                // Remove the collapsed items from the default tab order.
                for (let item of selectElements(SupplementalNavigation.itemSelector, expandedElement)) {
                    item.setAttribute(SupplementalNavigation.tabIndexAttribute, '-1');
                }
            }
        }
    }

    /**
    * @name - isExpandable
    * @description - Determines if the specified element is expandable.
    * @private
    * @param  {HTMLElement} item
    * @returns {boolean} true if the specified item is expandable, otherwise false
    */
    private isExpandable(item: HTMLElement): boolean {
        return ((!!item) && item.hasAttribute('data-state') && item.hasAttribute('aria-controls')) ? true : false;
    }

    /**
    * @name - syncExpandedItem
    * @description - Sync the expanded item state to the active item.
    * @private
    * @returns {void}
    */
    private syncExpandedItem(): void {
        if (this.items && this.items.length && this.activeItem) {
            let toExpand = this.getExpandableElementForActiveItem();
            let expanded = this.getExpandableElementForExpandableItem(this.expandedItem);

            if (!expanded || (expanded !== toExpand)) {
                // Loop through all the anchors making only the one associated with the active item expanded and collapsing all others.
                for (let item of this.items) {
                    if (this.isExpandable(item)) {
                        if (!!toExpand && (this.getExpandableElementForExpandableItem(item) === toExpand)) {
                            // This expandable item is associated with the active item so ensure its expanded.
                            this.expandItem(item);
                        } else {
                            // This expandable item is *not* associated with the active item so ensure its collapsed.
                            this.collapseItem(item);
                        }
                    }
                }
            }
        }
    }

    /**
    * @name - getExpandableElementForActiveItem
    * @description - Gets the associated expandable item, if any, to expand for the active item.
    * @private
    * @returns {HTMLElement} - The expandable element, if any, associated with the activeItem, otherwise null.
    */
    private getExpandableElementForActiveItem(): HTMLElement {
        if (!!this.activeItem &&
            !!this.activeItem.parentElement &&
            this.activeItem.parentElement.hasAttribute('id')) {
            return this.activeItem.parentElement;
        }

        return null;
    }

    /**
    * @name - getExpandableElementForActiveItem
    * @description - Gets the associated expandable item, if any, to expand for an expandable item.
    * @private
    * @param  {HTMLElement} item
    * @returns {HTMLElement} - The expandable element, if any, associated with the specified expandable item, otherwise null.
    */
    private getExpandableElementForExpandableItem(item: HTMLElement): HTMLElement {
        return (this.isExpandable(item) && !!item.nextElementSibling) ? item.nextElementSibling as HTMLElement : null;
    }

    /**
    * @name - itemKeydownHandler
    * @description - Handles activatable and expandable item keydown events.
    * @private
    * @param {HTMLElement} item - The item.
    * @param {number} keyCode - The keyCode.
    * @returns {boolean} - True if the default action should be prevented, otherwise false.
    */
    private itemKeydownHandler(item: HTMLElement, keyCode: number): boolean {
        if (!item || !keyCode) {
            return false;
        }

        switch (keyCode) {
            case keycodes.Space:
            case keycodes.Enter: {
                if (this.isExpandable(item)) {
                    this.setExpandedItem(item);
                    return true;
                }
                break;
            }
        }

        return false;
    }

    // --------------------------------------------------------------------------------------------
    // Event listeners
    // --------------------------------------------------------------------------------------------
    /**
    * @name - onExpandableItemClicked
    * @description - Handles expandable item click events, calls setExpandedItem to do the real work.
    * @private
    * @param {MouseEvent} event - The keyboard event.
    * @returns {void}
    */
    private onExpandableItemClicked = (event: MouseEvent): void => {
        this.setExpandedItem(getEventTargetOrSrcElement(event));
    }

    /**
    * @name - onActivatableItemClicked
    * @description - Handles activatable item click events, calls setActiveItem to do the real work.
    * @private
    * @param {MouseEvent} event - The keyboard event.
    * @returns {void}
    */
    private onActivatableItemClicked = (event: MouseEvent): void => {
        this.setActiveItem(getEventTargetOrSrcElement(event));
    }

    /**
    * @name - keydownEventListener
    * @description - Handles activatable and expandable item keydown events. Calls itemKeydownHandler to do the real work.
    * @private
    * @param {KeyboardEvent} event - The keyboard event.
    * @returns {void}
    */
    private keydownEventListener = (event: KeyboardEvent): void => {
        if (this.itemKeydownHandler(getEventTargetOrSrcElement(event), getKeyCode(event))) {
            preventDefault(event);
        }
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('SupplementalNavigation.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: SupplementalNavigation,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
