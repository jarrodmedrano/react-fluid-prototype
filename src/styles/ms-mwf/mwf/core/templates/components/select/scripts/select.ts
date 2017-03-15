/// <amd-module name="select"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {Publisher} from 'publisher';
import {SelectMenu, ISelectMenuSubscriber, ISelectMenuNotification} from 'selectMenu';
import {selectElementsT, selectFirstElementT, addClass, getText, hasClass} from 'htmlExtensions';

/**
* @class - Select
* @classdesc - The Select component
*/
export class Select extends Publisher<ISelectMenuSubscriber> implements ISelectMenuSubscriber {
    /**
    * @name - selector
    * @description - selector to use to find Select components in the document.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-select';

    // TODO: Consolidate all static attribute name/value strings into a common single place.
    /**
    * @name - ariaExpanded
    * @description - This attribute is set to true/false to indicate whether or not the dropdown is expanded.
    * @private
    * @static
    * @type {string}
    */
    private static ariaExpanded = 'aria-expanded';

    /**
    * @name - ariaHidden
    * @description - This attribute is set to true/false to indicate whether or not the dropdown is hidden.
    * @private
    * @static
    * @type {string}
    */
    private static ariaHidden = 'aria-hidden';

    /**
    * @name - ariaHaspopup
    * @description - This attribute to set to true/false to indicate whether or not a menu item is the currently selected one.
    * @private
    * @static
    * @type {string}
    */
    private static ariaHaspopup = 'aria-haspopup';

    /**
    * @name - ariaSelected
    * @description - This attribute to set to true/false to indicate whether or not a menu item is the currently selected one.
    * @private
    * @static
    * @type {string}
    */
    private static ariaSelected = 'aria-selected';

    /**
    * @name - ariaLabel
    * @description - This attribute is a string which becomes the label for the Select Menu.
    * @private
    * @static
    * @type {string}
    */
    private static ariaLabel = 'aria-label';

    /**
    * @name - select
    * @description - The original native select element.
    * @private
    * @type {HTMLElement}
    */
    private select: HTMLSelectElement;

    /**
    * @name - options
    * @description - The list of original native select option elements.
    * @private
    * @type {HTMLOptionElement[]}
    */
    private options: HTMLOptionElement[];

    /**
    * @name - selectMenu
    * @description - The replacement selectMenu we create to use instead of the native select.
    * @private
    * @type {SelectMenu}
    */
    private selectMenu: SelectMenu;

    /**
    * @name - selectMenuDiv
    * @description - The replacement selectMenu.
    * @private
    * @type {HTMLElement}
    */
    private selectMenuDiv: HTMLElement;

    /**
    * @name - constructor
    * @description - Constructor for the Select component.
    * @public
    * @param {HTMLElement} element - the native element to attach the Select behavior to.
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

        this.select = selectFirstElementT<HTMLSelectElement>('select', this.element);
        this.options = selectElementsT<HTMLOptionElement>('option', this.select);

        if (!this.select || !this.options) {
            return;
        }

        // Ensure the select has an id if the element does
        if (!this.select.id && this.element.id) {
            this.select.id = this.element.id + '-select';
        }

        // Create replacement selectMenu elements.
        if (!this.selectMenuDiv) {
            this.selectMenuDiv = document.createElement('div');
        } else {
            this.selectMenuDiv.innerHTML = '';
        }

        let selectMenu = document.createElement('button');
        let selectList = document.createElement('ul');

        addClass(this.selectMenuDiv, 'c-select-menu');
        addClass(this.selectMenuDiv, 'f-persist');

        if (hasClass(this.element, 'f-border')) {
            addClass(this.selectMenuDiv, 'f-border');
        }

        if (hasClass(this.element, 'f-accent')) {
            addClass(this.selectMenuDiv, 'f-accent');
        }

        selectMenu.innerHTML = this.select.getAttribute(Select.ariaLabel);
        selectMenu.setAttribute(Select.ariaHaspopup, 'true');
        selectMenu.setAttribute(Select.ariaExpanded, 'false');
        selectMenu.setAttribute('tabindex', '0');

        addClass(selectList, 'c-menu');
        selectList.setAttribute(Select.ariaHidden, 'true');
        selectList.setAttribute('role', 'listbox');
        selectList.setAttribute('tabindex', '0');

        // Get the select's f-flex class and propagate it forward to the replacement selectMenu
        if (hasClass(this.element, 'f-flex')) {
            addClass(this.selectMenuDiv, 'f-flex');
        }

        // Get the select's disabled state and propagate it forward to the replacement selectMenu
        if (this.select.hasAttribute('disabled')) {
            // Set aria-disabled instead of disabled because the disabled
            // attribute is not valid on div elements
            this.selectMenuDiv.setAttribute('aria-disabled', 'true');
        }

        // Get the select's required state and propagate it forward to the replacement selectMenu
        if (this.select.hasAttribute('required')) {
            // Set aria-required instead of required because the required
            // attribute is not valid on div elements
            this.selectMenuDiv.setAttribute('aria-required', 'true');
        }

        for (let option of this.options) {
            let selected = option.getAttribute('selected') === 'selected';
            let optionValue = option.getAttribute('value');
            let li = document.createElement('li');
            let span = document.createElement('span');

            addClass(li, 'c-menu-item');
            li.setAttribute('role', 'presentation');
            span.setAttribute('tabindex', '0');
            span.setAttribute('role', 'option');

            if (selected) {
                span.setAttribute(Select.ariaSelected, 'true');
            }

            if (!optionValue) {
                option.setAttribute('value', getText(option));
                optionValue = option.getAttribute('value');
            }

            if (!!optionValue) {
                li.id  = this.select.id + '-' + optionValue;
            }

            span.appendChild(document.createTextNode(getText(option)));
            li.appendChild(span);
            selectList.appendChild(li);
        }

        // Add replacement selectMenu to DOM.
        this.selectMenuDiv.appendChild(selectMenu);
        this.selectMenuDiv.appendChild(selectList);
        this.element.appendChild(this.selectMenuDiv);

        // We have just internally added nodes to the DOM, indicate to ignore next mutation event.
        this.ignoreNextDOMChange = true;

        // Asynchronously create the SelectMenu for the replacement selectMenu.
        ComponentFactory.create([{
            component: SelectMenu,
            eventToBind: 'DOMContentLoaded',
            elements: [this.selectMenuDiv],
            callback: (results: SelectMenu[]): void => {
                if (!!results || !!results.length) {
                    this.selectMenu = results[0];

                    // Subscribe to the replacement selectMenu's notifications.
                    this.selectMenu.subscribe(this);
                }
            }
        }]);
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
        // Remove the replacement selectMenu.
        this.select = null;
        this.options = null;
        this.selectMenu = null;
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
        subscriber.onSelectionChanged(context as ISelectMenuNotification);
    }

    /**
    * @name - onSelectionChanged
    * @description - Handles the selectMenu's notification. Updates the native select's state.
    *                and forwards the notification on to any subscribers.
    * @public
    * @param {ISelectMenuNotification} notification - The notification.
    * @returns {void}
    */
    public onSelectionChanged(notification: ISelectMenuNotification): void {
        if (!!notification && !!notification.id) {
            notification.id = notification.id.substr(this.select.id.length + 1);

            // TODO: 8479736: Update build step to remove commented code.
            // The following console.log useful for debugging and is left in commented out for easy restoration.
            //console.log(
            // 'select(' + (this.select.name || this.select.id) + ').value(' + this.select.value + ')' +
            // ' => (' + notification.id + ')');

            this.select.value = notification.id;

            for (let option of this.options) {
                if (option.getAttribute('value') === notification.id) {
                    option.setAttribute('selected', 'selected');
                } else {
                    option.removeAttribute('selected');
                }
            }

            this.initiatePublish(notification);
        }
    }
}