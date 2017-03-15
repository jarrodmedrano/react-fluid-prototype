/// <amd-module name="refineMenu"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {RefineItem} from 'refineItem';
import {BreakpointTracker, IBreakpointTrackerSubscriber, IBreakpointTrackerNotification} from 'breakpointTracker';
import {
    addEvent,
    css,
    eventTypes,
    getEventTargetOrSrcElement,
    isDescendent,
    removeEvent,
    selectElements,
    selectFirstElement
} from 'htmlExtensions';
import {apiDeprecated} from 'utility';

/**
* @class - RefineMenu
* @classdesc - The RefineMenu component
* @export
*/
export class RefineMenu extends ObservableComponent {
    /**
    * @name - selector
    * @description - The RefineMenu component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-refine-menu';

    /**
    * @name - collapseButton
    * @description - The button to collapse the menu.
    * @private
    * @type {HTMLElement}
    */
    private collapseButton: HTMLElement;

    /**
    * @name - expandButton
    * @description - The button to expand the menu.
    * @private
    * @type {HTMLElement}
    */
    private expandButton: HTMLElement;

    /**
    * @name - mobileTarget
    * @description - The mobile target.
    * @private
    * @type {HTMLElement}
    */
    private mobileTarget: HTMLElement;

    /**
    * @name - refineItems
    * @description - The list of refine items.
    * @private
    * @type {RefineItem[]}
    */
    private refineItems: RefineItem[];

    /**
    * @name - selectTypeProperty
    * @description - Attribute property that holds the select-type
    * @private
    * @static
    * @type {string}
    */
    private static selectTypeProperty = 'data-js-select-type';

    /**
    * @name - singleSelectValue
    * @description - Attribute property value for single-select groups
    * @private
    * @static
    * @type {string}
    */
    private static singleSelectValue = 'single-select';


    /**
    * @name - constructor
    * @description - Constructor for the RefineMenu component.
    * @public
    * @param {HTMLElement} element - the native element to attach the RefineMenu behavior to.
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

        this.collapseButton = selectFirstElement('.c-heading + button.c-action-trigger', this.element);
        this.expandButton = selectFirstElement( '[data-mobile-target] + button.c-action-trigger', this.element);
        this.mobileTarget = selectFirstElement('[data-mobile-target]', this.element);

        if (!this.collapseButton || !this.expandButton || !this.mobileTarget) {
            return;
        }

        // Get all menu items for the menu
        this.getRefineMenuItems();

        // Subscribe to breakpoint tracker
        BreakpointTracker.getBreakpointTracker().subscribe({ onBreakpointChanged: this.onBreakpointChanged });

        // Add click event for the menu
        addEvent(this.element, eventTypes.click, this.handleMenuClick);

        // Invoke the breakpoint changed handler to trigger the breakpoint resize logic in order
        // to ensure the refine-menu is initialized in the proper expanded or collapsed state.
        this.onBreakpointChanged({
            breakpoint: BreakpointTracker.getBreakpointTracker().getBreakpoint(),
            width: 0
        });
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
        // Remove the click listener.
        removeEvent(this.element, eventTypes.click, this.handleMenuClick);

        // Reset non static members
        this.collapseButton = null;
        this.expandButton = null;
        this.mobileTarget = null;

        for (let refineItem of this.refineItems) {
            refineItem.teardown();
        }

        this.refineItems = [];
    }

    /**
    * @name - onBreakpointChanged
    * @description - The breakpoint tracker notification method.
    *                This collapses the menu when the window width is less than breakpoint 2.
    * @private
    * @param {IBreakpointTrackerNotification} notification - The notificatio.
    * @returns {Void}
    */
    private onBreakpointChanged = (notification: IBreakpointTrackerNotification): void => {
        notification.breakpoint < 2 ? this.expandMenu(false) : this.expandMenu(true);
    }

    /**
    * @name - handleMenuClick
    * @description - Based on where in the refineMenu the user clicks, preform an action.
    * @private
    * @param {Event} event - The click event.
    * @returns {void}
    */
    private handleMenuClick = (event: Event): void => {
        let target = getEventTargetOrSrcElement(event);

        switch (target) {
            case this.collapseButton:
                this.expandMenu(false);
                break;
            case this.expandButton:
                this.expandMenu(true);
                break;
            default:
                this.manageRadioGroupClick(target);
        }
    }

    /**
    * @name - manageRadioGroupClick
    * @description - If the target is an element of a role radiogroup, then unselect all items.
    *                A radio group should only show one highlighted item at a time.
    * @private
    * @param {HTMLElement} element - The element that has been clicked.
    * @returns {void}
    */
    private manageRadioGroupClick(element: HTMLElement): void {
        // Because the span inside of the button can be the click target,
        // we need to normalize our checks against the button element.
        let isSpanElement = element.nodeName === 'SPAN';
        let refineItem = isSpanElement ? element.parentNode : element as HTMLElement;
        let refineGroup = refineItem != null ? refineItem.parentNode.parentNode as HTMLElement : null;
        let isSingleSelect: boolean;

        // Check for single-select
        if (refineItem == null || refineGroup == null) {
            return null;
        }

        isSingleSelect = refineGroup.getAttribute(RefineMenu.selectTypeProperty) === RefineMenu.singleSelectValue;

        // DEPRECATED v2.0.0
        // We won't need to have backwards compatibility with old shapes so we
        // should remove this check and all adjustments made inside of it
        if (!refineGroup.hasAttribute(RefineMenu.selectTypeProperty)) {
            refineGroup = refineGroup.parentNode as HTMLElement;
            isSingleSelect = refineGroup.getAttribute('role') === 'radiogroup';
        }

        // If we are a single-select group, deselect all un-clicked items in the group
        if (isSingleSelect) {
            for (let item of this.refineItems) {
                let element = item.element;

                if (element !== refineItem && isDescendent(refineGroup, element)) {
                    item.unselectItem();
                }
            }
        }
    }

    /**
    * @name - getRefineMenuItems
    * @description - Update the refineItems array with all RefineItem instances for each RefineItem in the menu.
    * @private
    * @returns {void}
    */
    private getRefineMenuItems(): void {
        this.refineItems = [];

        for (let refineItemElement of selectElements(RefineItem.selector, this.element)) {
            this.refineItems.push(new RefineItem(refineItemElement));
        }
    }

    /**
    * @name - expandMenu
    * @description - Expand or collapse the menu by setting a number of CSS classes and attributes in the menu based on the passed boolean.
    * @private
    * @param {boolean} expandMenu - expand the menu if true, otherwise collapse the menu.
    * @returns {void}
    */
    private expandMenu(expandMenu: boolean): void {
        this.mobileTarget.setAttribute('aria-hidden', (!expandMenu).toString());

        this.expandButton.setAttribute('aria-expanded', expandMenu.toString());
        this.collapseButton.setAttribute('aria-expanded', expandMenu.toString());
        css(this.expandButton, 'display', expandMenu ? 'none' : 'block');
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('RefineMenu.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: RefineMenu,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}