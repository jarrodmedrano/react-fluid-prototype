/// <amd-module name="file"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {ObservableComponent} from 'observableComponent';
import {selectFirstElement, eventTypes, addEvent, removeEvent, preventDefault} from 'htmlExtensions';
import {apiDeprecated} from 'utility';

/**
* @class - File
* @classdesc - The File component
* @export
*/
export class File extends ObservableComponent {
    /**
    * @name - selector
    * @description - The file component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-file';

    /**
    * @name - fileInputElement
    * @description - The file input element.
    * @private
    * @type {HTMLInputElement}
    */
    private fileInputElement: HTMLInputElement;

    /**
    * @name - textInputElement
    * @description - The text input element.
    * @private
    * @type {HTMLInputElement}
    */
    private textInputElement: HTMLInputElement;

    /**
    * @name - submitButton
    * @description - The submit button.
    * @private
    * @type {HTMLButtonElement}
    */
    private submitButton: HTMLButtonElement;

    /**
    * @name - constructor
    * @description - Constructor for the File component.
    * @public
    * @param {HTMLElement} element - the native element to attach the File behavior to.
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

        this.fileInputElement = selectFirstElement('input[type="file"]', this.element) as HTMLInputElement;
        this.submitButton = selectFirstElement('button', this.element) as HTMLButtonElement;
        this.textInputElement = selectFirstElement('input[type="text"]', this.element) as HTMLInputElement;

        if (!this.fileInputElement || !this.submitButton || !this.textInputElement) {
            return;
        }

        addEvent(this.fileInputElement, eventTypes.change, this.handleFileSelection);
        addEvent(this.submitButton, eventTypes.click, this.showFileDialogMenu);
        addEvent(this.textInputElement, eventTypes.click, this.showFileDialogMenu);
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
        // Remove the change and click listeners.
        removeEvent(this.fileInputElement, eventTypes.change, this.handleFileSelection);
        removeEvent(this.submitButton, eventTypes.click, this.showFileDialogMenu);
        removeEvent(this.textInputElement, eventTypes.click, this.showFileDialogMenu);

        // Reset non static members
        this.fileInputElement = null;
        this.submitButton = null;
        this.textInputElement = null;
    }

    /**
    * @name - showFileDialogMenu
    * @description - Show the file dialog when the user clicks on the input or button elements.
    * @private
    * @param {Event} event - The click event.
    * @returns {void}
    */
    private showFileDialogMenu = (event: Event): void => {
        preventDefault(event);
        this.fileInputElement.click();
    }

    /**
    * @name - handleFileSelection
    * @description - Take the file selection from the hidden file input field and put it into the visible input field.
    * @private
    * @returns {void}
    */
    private handleFileSelection = (): void => {
        // Remove the "fakepath" string that shows up when copying the value over from the input field from Chrome.
        this.textInputElement.value = this.fileInputElement.value.replace('C:\\fakepath\\', '');
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('File.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: File,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
