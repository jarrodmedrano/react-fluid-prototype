/// <amd-module name="refineItem"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {addEvent, addClass, eventTypes, getText, hasClass, removeClass, removeEvent, selectFirstElement} from 'htmlExtensions';
import {format} from 'stringExtensions';

/**
* @class - RefineItem
* @classdesc - The RefineItem component
* @export
*/
export class RefineItem {
    /**
    * @name - selector
    * @description - The RefineItem component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-refine-item';

    /**
    * @name - ariaAttribute
    * @description - The ariaAttribute to use. Depends on the RefineItem's role.
    * @private
    * @type {string}
    * DEPRECATED 2.0.0
    */
    private ariaAttribute: string;

    /**
    * @name - isRadioItem
    * @description - The radio item state.
    * @private
    * @type {boolean}
    * DEPRECATED 2.0.0
    */
    private isRadioItem: boolean;

    /**
    * @name - isUpdatedShape
    * @description - Check to see if this is a legacy shape
    * @private
    * @type {boolean}
    * DEPRECATED 2.0.0
    */
    private isUpdatedShape: boolean;

    /**
    * @name - selectedClass
    * @description - Selected class name
    * @private
    * @static
    * @type {string}
    */
    private static selectedClass = 'f-selected';

    /**
    * @name - selectedString
    * @description - Aria-label for when a refine-item is selected
    * @private
    * @static
    * @type {string}
    */
    // TODO: 8188671 - This needs to come from a localized strings file. Hard coding these strings for now
    private static selectedLabel = 'Active refinement: {0}';

    /**
    * @name - unSelectedString
    * @description - Aria-label for when a refine-item is unselected
    * @private
    * @static
    * @type {string}
    */
    // TODO: 8188671 - This needs to come from a localized strings file. Hard coding these strings for now
    private static unSelectedLabel = 'Refine by {0}';

    /**
    * @name - label
    * @description - Stores the text value of the refine-item
    * @private
    * @type {string}
    */
    private label: string;

    /**
    * @name - ariaLabel
    * @description - Aria-label attribute
    * @private
    * @static
    * @type {string}
    */
    private static ariaLabel = 'aria-label';

    /**
    * @name - constructor
    * @description - Constructor for the RefineItem component.
    * @public
    * @param {HTMLElement} element - The native element to attach the RefineItem behavior to.
    *                                This member is public because it is directly accessed by RefineMenu.
    */
    constructor(public element: HTMLElement) {
        if (!this.element) {
            return;
        }

        if (!this.element.hasAttribute('role')) {
            // The old shape has role="radio" or role="checkbox". The new shape has neither.
            this.isUpdatedShape = true;
            this.label = getText(selectFirstElement('span', this.element));
        } else {
            this.isRadioItem = this.element.getAttribute('role') === 'radio';
            this.ariaAttribute = this.isRadioItem ? 'aria-checked' : 'aria-selected';
        }

        // Ensure the initial state.
        this.changeItemState(this.isSelected());

        // Add item click event
        addEvent(this.element, eventTypes.click, this.toggleRefineItem);
    }

    /**
    * @name - toggleRefineItem
    * @description - Toggles the selected state of the RefineItem based on it's current selected state.
    * @private
    * @returns {void}
    */
    private toggleRefineItem = (): void => {
        this.changeItemState(!this.isSelected());
    }

    /**
    * @name - isSelected
    * @description - Check if the RefineItem is selected.
    * @private
    * @returns {boolean} - True if selected, otherwise false.
    */
    private isSelected(): boolean {
        if (this.isUpdatedShape) {
            return hasClass(this.element, RefineItem.selectedClass);
        } else {
            return this.element.getAttribute(this.ariaAttribute) === 'true';
        }
    }

    /**
    * @name - changeItemState
    * @description - Sets the refine item's aria attribute to the specified value.
    * @private
    * @param {boolean} value - The desired value.
    * @returns {void}
    */
    private changeItemState(value: boolean): void {
        if (this.isUpdatedShape) {
            if (value) {
                addClass(this.element, RefineItem.selectedClass);
                this.element.setAttribute(RefineItem.ariaLabel, format(RefineItem.selectedLabel, this.label));
            } else {
                removeClass(this.element, RefineItem.selectedClass);
                this.element.setAttribute(RefineItem.ariaLabel, format(RefineItem.unSelectedLabel, this.label));
            }
        } else {
            this.element.setAttribute(this.ariaAttribute, value.toString());
        }
    }

    /**
    * @name - unselectItem
    * @description - Public method to unselect an item
    * @public
    * @returns {void}
    */
    public unselectItem(): void {
        this.changeItemState(false);
    }

    /**
    * @name - teardown
    * @description - This method is only called by RefineMenu when it needs to clean up its RefineItems.
    * @public
    * @returns {void}
    */
    public teardown(): void {
        // Remove the click listener.
        removeEvent(this.element, eventTypes.click, this.toggleRefineItem);
    }
}
