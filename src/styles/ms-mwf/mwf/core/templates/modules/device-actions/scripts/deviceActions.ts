/// <amd-module name="deviceActions"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {addThrottledEvent, css, getClientRect, selectElements} from 'htmlExtensions';
import {apiDeprecated} from 'utility';
import {BreakpointTracker, IBreakpointTrackerNotification} from 'breakpointTracker';

/**
* @class - DeviceActions
* @classdesc - The DeviceActions component, makes the buttons in viewport 1 to be full width.
* @export
 */
export class DeviceActions extends ObservableComponent {
    /**
    * @name - selector
    * @description - selector for the DeviceActions module.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.m-device-actions';

    /**
    * @name - buttonsSelector
    * @description - selector to use to find button components in the DeviceActions element.
    * @static
    * @public
    * @type {string}
    */
    public static buttonsSelector = '.c-button';
    /**
    * @name - buttonsContainerSelector
    * @description - selector to use to find button container components in the DeviceActions element
    * @static
    * @public
    * @type {string}
    */
    public static buttonsContainerSelector = '.f-button';

    /**
    * @name - buttons
    * @description - An array of button elements in DeviceActions.
    * @private
    * @type {HTMLElement[]}
    */
    private buttons: HTMLElement[];

    /**
    * @name - buttonContainers
    * @description - An array of buttonContainer elements in DeviceActions.
    * @private
    * @type {HTMLElement[]}
    */
    private buttonContainers: HTMLElement[];

    /**
    * @name - resizedContainerWidth
    * @description - The new width of the buttonContainer when the page is resized.
    * @private
    * @type {number}
    */
    private resizedContainerWidth: number;

    /**
    * @name - resizedButtonWidth
    * @description - The new width of the button when the page is resized.
    * @private
    * @type {number}
    */
    private resizedButtonWidth: number;

    /**
    * @name - buttonsLength
    * @description - The number of buttons in the buttons[]. 
    * @private
    * @type {number}
    */
    private buttonsLength: number;

    /**
    * @name - constructor
    * @description - Constructor for the DeviceActions component.
    * @public
    * @param {HTMLElement} element - the native element to attach the DeviceActions behavior to.
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

        this.buttons = selectElements(DeviceActions.buttonsSelector, this.element);
        this.buttonContainers = selectElements(DeviceActions.buttonsContainerSelector, this.element);

        if (!this.buttons || !this.buttonContainers || this.buttons.length < 1 || this.buttonContainers.length < 1) {
            return;
        }
        
        // save as variable for multiple loops
        this.buttonsLength = this.buttons.length;

        for (let i = 0; i < this.buttonsLength; i++) {
            let containerWidth = getClientRect(this.buttonContainers[i]).width;
            if (!this.resizedContainerWidth || containerWidth > this.resizedContainerWidth) {
                this.resizedContainerWidth = containerWidth;
            }

            let buttonWidth = getClientRect(this.buttons[i]).width;
            if (!this.resizedButtonWidth || buttonWidth > this.resizedButtonWidth) {
                this.resizedButtonWidth = buttonWidth;
            }
        }

        this.updateWidths();

        // Subscribe to breakpoint tracker
        BreakpointTracker.getBreakpointTracker().subscribe({
            onBreakpointChanged: (notification: IBreakpointTrackerNotification): void => {
                this.onBreakpointChanged(notification);
            }
        });
    }

    /**
    * @name - updateWidths
    * @description - Update the widths of the button and buttonContainer with the corresponding width after the resize event.
    * @private
    * @returns {void}
    */
    private updateWidths(): void {
        for (let buttonIndex = 0; buttonIndex < this.buttonsLength; buttonIndex++) {
            this.buttons[buttonIndex].style.width = this.resizedButtonWidth + 'px';
            this.buttonContainers[buttonIndex].style.width = this.resizedContainerWidth + 'px';
        }
    }

    /**
    * @name - onBreakpointChanged
    * @description - Breakpoint notification eventlistener
    * @private
    * @param {IBreakpointTrackerNotification} [notification]
    * @returns {void}
    */
    private onBreakpointChanged(notification: IBreakpointTrackerNotification): void {
        if (notification.breakpoint > 1) {
            this.updateWidths();
        } else {
            for (let buttonIndex = 0; buttonIndex < this.buttonsLength; buttonIndex++) {
                css(this.buttons[buttonIndex], 'width', '');
                css(this.buttonContainers[buttonIndex], 'width', '');
            }
        }

        // Set the ignore flag because we're intentionally changing the DOM here and
        // don't want to trigger another teardown/update cycle or we'll get into a loop.
        this.ignoreNextDOMChange = true;
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
        this.resizedButtonWidth = null;
        this.resizedContainerWidth = null;
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('DeviceActions.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: DeviceActions,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}