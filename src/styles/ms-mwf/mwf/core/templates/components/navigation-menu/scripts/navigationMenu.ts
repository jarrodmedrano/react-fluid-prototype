/// <amd-module name="navigationMenu"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {
    addEvent,
    selectElements,
    removeEvent,
    eventTypes,
    getEventTargetOrSrcElement
} from 'htmlExtensions';

export class NavigationMenu extends ObservableComponent {
    /**
     * @name - selector
     * @description - Selector to use to find navigationMenu components in the document.
     * @static
     * @public
     * @type {string}
     */
    public static selector = '.c-navigation-menu';
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
     * @name - ariaControlsAttribute
     * @description - The aria attribute to that associates elements with the trigger.
     *
     * @public
     * @static
     * @type {string}
     */
    public static ariaControlsAttribute = 'aria-controls';

    /**
     * @name - triggers
     * @description - The navigationMenu's triggers (button) elements.
     * @private
     * @type {HTMLElement}
     */
    private triggers: HTMLElement[];

    /**
     * @name - menus
     * @description - The navigationMenu's menu elements.
     * @private
     * @type {HTMLElement}
     */
    private menus: HTMLElement[];

    /**
     * @name - constructor
     * @description - Constructor for the navigationMenu component.
     * @public
     * @param {HTMLElement} element - the native element to attach the navigationMenu behavior to.
     */
    constructor(element: HTMLElement) {
        super(element);
        this.update();
    }

    /**
     * Update the component state.
     *
     * @protected
     * @abstract
     * @return {void}
     */
    protected update(): void {
        let triggers = selectElements('button', this.element);

        // Only add listener to nav lists that contain triggers
        if (triggers.length !== 0) {
            this.triggers = triggers;
            this.menus = selectElements('button + ul', this.element);

            // Add event listener
            addEvent(this.triggers, eventTypes.click, this.onTriggerClick);
        }
    }

    /**
     * Cleaning up the old state of the component.
     *
     * @protected
     * @abstract
     */
    protected teardown(): void {
        removeEvent(this.triggers, eventTypes.click, this.onTriggerClick);
    }

    /**
      * @name - toggleVisibility
      * @description - Toggles aria attributes.
      * @private
      * @param {HTMLElement} currentMenu - the current menu.
      * @param {HTMLElement} trigger - the triggering element.
      * @return {void}
      */
    private toggleVisibility(currentMenu: HTMLElement, trigger: HTMLElement):void {
        currentMenu.getAttribute(NavigationMenu.ariaHidden) === 'true'
        ? this.showMenu(currentMenu, trigger) : this.hideMenu(currentMenu, trigger);
    }

    /**
      * @name - showMenu
      * @description - Show menu by setting aria attributes.
      * @private
      * @param {HTMLElement} currentMenu - the current menu.
      * @param {HTMLElement} trigger - the triggering element.
      * @return {void}
      */
    private showMenu(currentMenu: HTMLElement, trigger: HTMLElement):void {
        currentMenu.setAttribute(NavigationMenu.ariaHidden, 'false');
        trigger.setAttribute(NavigationMenu.ariaExpanded, 'true');
    }

    /**
      * @name - hideMenu
      * @description - Hide menu by setting aria attributes.
      * @private
      * @param {HTMLElement} currentMenu - the current menu.
      * @param {HTMLElement} trigger - the triggering element.
      * @return {void}
      */
    private hideMenu(currentMenu: HTMLElement, trigger: HTMLElement):void {
        currentMenu.setAttribute(NavigationMenu.ariaHidden, 'true');
        trigger.setAttribute(NavigationMenu.ariaExpanded, 'false');
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
        let trigger = getEventTargetOrSrcElement(event);
        let menuId = trigger.getAttribute(NavigationMenu.ariaControlsAttribute);
        let currentMenu = document.getElementById(menuId);
        if (currentMenu !== null) {
            this.toggleVisibility(currentMenu, trigger);
        }
    }
}