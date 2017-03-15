/// <amd-module name="dialog"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {Publisher, ISubscriber} from 'publisher';
import {ComponentFactory} from 'componentFactory';
import {BreakpointTracker} from 'breakpointTracker';
import {
    addEvent,
    addThrottledEvent,
    css,
    eventTypes,
    getClientRect,
    getEventTargetOrSrcElement,
    hasClass,
    preventDefault,
    removeEvent,
    selectElements,
    selectFirstElement
} from 'htmlExtensions';
import {apiDeprecated, getKeyCode} from 'utility';
import {keycodes} from 'keycodes';

/**
* @interface IDialogNotification
* @description - The data contract interface used for dialog notifications.
* @export
*/
export interface IDialogNotification {
    button: HTMLElement;
}

/**
* @interface IDialogSubscriber
* @interfacedesc - The interface which Dialog notification subscribers must implement.
* @export
*/
export interface IDialogSubscriber extends ISubscriber {
    onButtonClicked(notification: IDialogNotification): void;
    onShown(): void;
    onHidden(): void;
}

/**
 * @interface IDialogContentContainer
 * @interfacedesc - The interface that describes content containers and hidden states
 */
interface IDialogContentContainer {
    element: HTMLElement;
    hidden: boolean;
}

/**
* @name - DialogNotifications
* @description - The IDialogSubscriber notifications.
* @private
*/
const enum DialogNotifications {
    // Custom button clicked notification
    buttonClicked,

    // Dialog shown notification
    shown,

    // Dialog hidden notification
    hidden
}

/**
* @class - Dialog
* @description - The IDialogSubscriber
* @classdesc - The Dialog component
* @export
*/
export class Dialog extends Publisher<IDialogSubscriber> {
    /**
    * @name - selector
    * @description - The dialog component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-dialog';

    /**
    * @name - dialogInputSelectors
    * @description - The dialog component inputs selectors.
    * @static
    * @private
    * @type {string}
    */
    private static dialogInputSelectors = 'select, input, textarea, button, a, .c-glyph[data-js-dialog-hide]';

    /**
    * @name - closeSelector
    * @description - The dialog component close selector.
    * @static
    * @private
    * @type {string}
    */
    private static closeSelector = '[data-js-dialog-hide]';

    /**
    * @name - notifyButtonSelector
    * @description - The dialog component notify buttons selector.
    * @static
    * @private
    * @type {string}
    */
    private static customButtonSelector = 'button[type="button"]';

    /**
    * @name - ariaHidden
    * @description - aria-hidden attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static ariaHidden = 'aria-hidden';

    /**
    * @name - scrollSelector
    * @description - scroll class selector.
    * @static
    * @private
    * @type {string}
    */
    private static scrollSelector = '.f-dialog-scroll';

    /**
    * @name - heightCalculationString
    * @description - calculation string for maxheight or height - 24px is the padding
    * @static
    * @private
    * @type {string}
    */
    private static heightCalculationString = 'calc(100% - 24px)';

    /**
    * @name - container
    * @description - top most container within the body.
    * @private
    * @type {HTMLElement}
    */
    private container : HTMLElement;

    /**
    * @name - dialogId
    * @description - The dialog's id.
    * @private
    * @type {string}
    */
    private dialogId: string;

    /**
    * @name - dialogWrapper
    * @description - The dialog wrapping container.
    * @private
    * @type {HTMLElement}
    */
    private dialogWrapper: HTMLElement;

    /**
    * @name - dialogInnerContent
    * @description - The inner dialog document container.
    * @private
    * @type {HTMLElement}
    */
    private dialogInnerContent: HTMLElement;

    /**
    * @name - openButtons
    * @description - The list of elements that open the dialog.
    * @private
    * @type {HTMLElement[]}
    */
    private openButtons: HTMLElement[];

    /**
    * @name - closeButtons
    * @description - The list of elements that close the dialog.
    * @private
    * @type {HTMLElement[]}
    */
    private closeButtons: HTMLElement[];

    /**
    * @name - dialogInputs
    * @description - The list of input controls on the dialog.
    * @private
    * @type {HTMLElement[]}
    */
    private dialogInputs: HTMLElement[];

    /**
    * @name - firstInput
    * @description - The first input control on the dialog.
    * @private
    * @type {HTMLElement}
    */
    private firstInput: HTMLElement;

    /**
    * @name - lastInput
    * @description - The last input control on the dialog.
    * @private
    * @type {HTMLElement}
    */
    private lastInput: HTMLElement;

    /**
    * @name - customButtons
    * @description - The list of custom buttons that we publish notifications for.
    * @private
    * @type {HTMLElement[]}
    */
    private customButtons: HTMLElement[];

    /**
    * @name - bodyOverflow
    * @description - Used to store/restore the body's overflow value in show/hide.
    * @private
    * @type {HTMLElement}
    */
    private bodyOverflow: string;

    /**
    * @name - resizeThrottledEventHandler
    * @description - The resize event listener.
    * @private
    * @type {EventListener}
    */
    private resizeThrottledEventHandler: EventListener;

    /**
    * @name - activeButton
    * @description - This is the element that launched the dialog to appear.
    * @private
    * @type {HTMLElement}
    */
    private activeButton: HTMLElement;

    /**
     * @name - overlay
     * @description - the element that creates the overlay effect.
     * @private
     * @type {HTMLElement}
     */
    private overlay: HTMLElement;

    /**
     * @name - shouldCloseOnEscape
     * @description - flags whether the dialog should be closable via the escape key.
     * @private
     * @type {boolean}
     */
    private shouldCloseOnEscape = false;

    /**
     * @name - isFlowDialog
     * @description - flags whether the dialog has the 'flow' option.
     * @private
     * @type {boolean}
     */
    private isFlowDialog = false;

    /**
     * @name - isLightboxDialog
     * @description - flags whether the dialog has the 'lightbox' option.
     * @private
     * @type {boolean}
     */
    private isLightboxDialog = false;

    /**
     * @name - isScroll
     * @description - flags whether the dialog has the 'scroll' option.
     * @private
     * @type {HTMLElement}
     */
    private isScroll: HTMLElement;

    /**
     * @name pageContentContainerSelector
     * @description - the css selector for pageContentContainers.
     * @private
     * @static
     * @type {string}
     */
    private static pageContentContainerSelector = '[data-js-controlledby="dialog"]';

    /**
     * @name - pageContentContainers
     * @description - sections of the page that contain content to be hidden when the dialog is shown.
     * @private
     * @type {IDialogContentContainer[]}
     */
    private pageContentContainers: IDialogContentContainer[];

    /**
     * @name - breakpointTracker
     * @description - The breakpoint tracker.
     * @private
     * @type {IDialogContentContainer[]}
     */
    private breakpointTracker = BreakpointTracker.getBreakpointTracker();

    /**
    * @name - constructor
    * @description - Constructor for the Dialog component.
    * @public
    * @param {HTMLElement} element - the native element to attach the Dialog behavior to.
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
        if (!this.element || !this.element.id) {
            return;
        }

        this.dialogId = this.element.id;
        this.dialogWrapper = selectFirstElement('div[role=dialog]', this.element);
        this.dialogInnerContent = selectFirstElement('[role="document"]', this.element);
        this.openButtons = selectElements('[data-js-dialog-show=' + this.dialogId + ']');
        this.closeButtons = selectElements(Dialog.closeSelector, this.element);
        this.dialogInputs = selectElements(Dialog.dialogInputSelectors, this.element);
        this.customButtons = selectElements(Dialog.customButtonSelector, this.element);
        this.appendDialog();
        this.container = selectFirstElement('[data-grid*="container"]') as HTMLElement;
        this.overlay = selectFirstElement('[role="presentation"]', this.element);
        this.isScroll = selectFirstElement(Dialog.scrollSelector, this.element);

        if (hasClass(this.element, 'f-flow')) {
            this.isFlowDialog = true;
        }

        if (hasClass(this.element, 'f-lightbox')) {
            this.isLightboxDialog = true;
        }

        if (!this.dialogWrapper ||
            !this.openButtons || !this.openButtons.length ||
            !this.closeButtons || !this.closeButtons.length ||
            !this.dialogInputs || !this.dialogInputs.length ||
            !this.container || !this.overlay) {
            return;
        }

        if (this.isLightboxDialog) {
            // Lightboxes are always closable via clicking the overlay and
            // pressing the esc key
            if (this.closeButtons.indexOf(this.overlay) === -1) {
                this.closeButtons.push(this.overlay);
            }

            this.shouldCloseOnEscape = true;
        } else if (this.isFlowDialog) {
            for (let index = 0; index < this.closeButtons.length; index++ ) {
                let closeButton = this.closeButtons[index];

                // The 'x' to close button is optional for flow dialogs.
                // If the 'x' close button exists then the dialog should also be
                // dismissible by clicking the overlay of the dialog and via the
                // escape key
                if (hasClass(closeButton, 'c-glyph') && hasClass(closeButton, 'glyph-cancel')) {
                    this.closeButtons.push(this.overlay);
                    this.shouldCloseOnEscape = true;
                    break;
                }
            }
        }

        this.firstInput = this.dialogInputs[0] as HTMLElement;
        this.lastInput = this.dialogInputs[this.dialogInputs.length - 1];

        // Add events
        addEvent(this.openButtons, eventTypes.click, this.handleTriggerClick);
        addEvent(this.closeButtons, eventTypes.click, this.hide);
        addEvent(this.customButtons, eventTypes.click, this.triggerClickPublish);
        addEvent(this.element, eventTypes.keydown, this.onKeydown);
        this.resizeThrottledEventHandler = addThrottledEvent(window, eventTypes.resize, this.onResized);
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
        removeEvent(this.openButtons, eventTypes.click, this.handleTriggerClick);
        removeEvent(this.closeButtons, eventTypes.click, this.hide);
        removeEvent(this.customButtons, eventTypes.click, this.triggerClickPublish);
        removeEvent(this.element, eventTypes.keydown, this.onKeydown);
        removeEvent(window, eventTypes.resize, this.resizeThrottledEventHandler);
    }

    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {IDialogSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} [context] - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IDialogSubscriber, context?: any): void {
        switch (context.notification) {
            case DialogNotifications.buttonClicked:
                if (subscriber && subscriber.onButtonClicked) {
            subscriber.onButtonClicked(context as IDialogNotification);
        }
                break;
            case DialogNotifications.shown:
                if (subscriber && subscriber.onShown) {
                    subscriber.onShown();
                }
                break;
            case DialogNotifications.hidden:
                if (subscriber && subscriber.onHidden) {
                    subscriber.onHidden();
                }
                break;
        }
    }

    /**
    * @name - handleTriggerClick
    * @description - Handles click events
    * @param {Event} event - the event object from the open button's click event
    * @public
    * @returns {void}
    */
    public handleTriggerClick = (event:Event): void => {
        this.activeButton = getEventTargetOrSrcElement(event);
        this.show();
    }

    /**
    * @name - show
    * @description - Show the dialog.
    * @public
    * @returns {void}
    */
    public show = (): void => {
        const elementsToHideFromScreenReaders = selectElements(Dialog.pageContentContainerSelector);
        this.pageContentContainers = [];
        this.element.setAttribute(Dialog.ariaHidden, 'false');
        this.dialogWrapper.focus();
        this.onResized();
        this.bodyOverflow = css(document.body, 'overflow');
        css(document.body, 'overflow', 'hidden');
        this.container.setAttribute(Dialog.ariaHidden, 'true');
        this.checkOverflow();

        for (let element of elementsToHideFromScreenReaders) {
            let isHidden = !!(element.getAttribute(Dialog.ariaHidden) === 'true');

            this.pageContentContainers.push({
                element: element,
                hidden: isHidden
            });

            if (!isHidden) {
                element.setAttribute(Dialog.ariaHidden, 'true');
            }
        }

        // Set the scroll position to the top of the dialog;
        this.dialogWrapper.scrollTop = 0;

        this.initiatePublish({ notification: DialogNotifications.shown });
    }

    /**
    * @name - hide
    * @description - Hide the dialog.
    * @public
    * @returns {void}
    */
    public hide = (): void => {
        this.element.setAttribute(Dialog.ariaHidden, 'true');
        css(this.dialogWrapper, 'height', 'auto');
        css(document.body, 'overflow', this.bodyOverflow);
        this.container.setAttribute(Dialog.ariaHidden, 'false');

        for (let container of this.pageContentContainers) {
            // If the container was not hidden when the dialog opened, unhide it.
            if (!container.hidden) {
                container.element.removeAttribute(Dialog.ariaHidden);
            }
        }

        if (this.activeButton) {
            this.activeButton.focus();
        }

        this.activeButton = null;
        this.pageContentContainers = [];

        this.initiatePublish({ notification: DialogNotifications.hidden });
    }

    /**
    * @name - triggerClickPublish
    * @description - Handles the dialog's custom button click events.
    * @param {MouseEvent} event- The click event from custom buttons
    * @private
    * @returns {void}
    */
    private triggerClickPublish = (event: MouseEvent) => {
        this.initiatePublish({ notification: DialogNotifications.buttonClicked, button: getEventTargetOrSrcElement(event) });
    }

    /**
    * @name - onKeydown
    * @description - Handles the dialog keydown events.
    * @private
    * @param {Event} event - The keyboard event.
    * @returns {void}
    */
    private onKeydown = (event: KeyboardEvent): void => {
        let keyCode = getKeyCode(event);

        switch (keyCode) {
            case keycodes.Enter:
            case keycodes.Space:
                if (this.closeButtons.indexOf(getEventTargetOrSrcElement(event)) !== -1) {
                    preventDefault(event);
                    this.hide();
                } else if (this.customButtons.indexOf(getEventTargetOrSrcElement(event)) !== -1) {
                    this.initiatePublish({ notification: DialogNotifications.buttonClicked, button: getEventTargetOrSrcElement(event) });
                }
                break;

            case keycodes.Escape:
                preventDefault(event);

                if (this.shouldCloseOnEscape) {
                    this.hide();
                }

                break;

            case keycodes.Tab:
                const target = getEventTargetOrSrcElement(event);

                if (target === this.lastInput && !event.shiftKey) {
                    // If we're on the last input and tabbing forward
                    preventDefault(event);
                    this.firstInput.focus();
                } else if (target === this.firstInput && event.shiftKey) {
                    // if we're on the first input and tabbing backwards
                    preventDefault(event);
                    this.lastInput.focus();
                } else if (this.dialogInputs.length === 1) {
                    // If we're tabbing anywhere and we only have one input
                    preventDefault(event);
                    this.dialogInputs[0].focus();
                }

                break;
        }
    }

    /**
    * @name - onResized
    * @description - Handles the window resize event.
    * @private
    * @returns {void}
    */
    private onResized = (): void => {
        if (this.element.getAttribute(Dialog.ariaHidden) === 'false') {
            this.breakpointTracker.getBreakpoint() < 1
                ? this.handleMobile()
                : this.checkOverflow();
        }
    }

    /**
    * @name - checkOverflow
    * @description - Checks overflow.
    * @private
    * @returns {void}
    */
    private checkOverflow = (): void => {
        let dialogRect = getClientRect(this.dialogWrapper);
        let documentRect = getClientRect(this.dialogInnerContent);

        if (dialogRect.height < this.dialogWrapper.scrollHeight) {
            if (!this.isScroll) {
                css(this.dialogWrapper, 'overflow-y', 'auto');
            }
        } else {
            css(this.dialogWrapper, 'overflow-y', 'hidden');
        }
    }

    /**
    * @name - handleMobile
    * @description - Handles mobile positioning.
    * @private
    * @returns {void}
    */
    private handleMobile = (): void => {
        if (this.element.getAttribute(Dialog.ariaHidden) === 'false') {
            if (this.isFlowDialog && !this.isScroll) {
                let dialogRect = getClientRect(this.dialogWrapper);
                let documentRect = getClientRect(this.dialogInnerContent);
                if (dialogRect.height < this.dialogWrapper.scrollHeight) {
                    css(this.dialogWrapper, 'max-height',  Dialog.heightCalculationString);
                    css(this.dialogWrapper, 'height', '100%');
                } else {
                    css(this.dialogWrapper, 'max-height', '100%');
                }
            } else if (this.isScroll) {
                css(this.dialogWrapper, 'height',  Dialog.heightCalculationString);
                css(this.dialogInnerContent, 'height',  'inherit');
            }
        }
    }

    /**
    * @name - appendDialog
    * @description - On update move the dialog to be appended as a direct child of the body.
    * @private
    * @returns {void}
    */
    private appendDialog = (): void => {
        // Ignore the DOM change caused by moving the dialog to the end of the body.
        // Since appendDialog is called from update() this would cause a loop.
        this.ignoreNextDOMChange = true;

        document.body.appendChild(this.element);
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Dialog.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Dialog,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}