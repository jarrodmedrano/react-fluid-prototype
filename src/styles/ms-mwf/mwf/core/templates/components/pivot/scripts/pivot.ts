/// <amd-module name="pivot"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {IController, IControllerSubscriber, IControllerNotification} from 'iController';
import {Publisher, ISubscriber} from 'publisher';
import {
    addClass,
    addEvent,
    Direction,
    eventTypes,
    getDirection,
    getEventTargetOrSrcElement,
    hasClass,
    preventDefault,
    removeClass,
    removeEvent,
    selectElements,
    selectFirstElement
} from 'htmlExtensions';
import {apiDeprecated, getKeyCode, getVirtualKey, isNumber} from 'utility';
import {keycodes} from 'keycodes';

/**
 * @interface IPivotNotification
 * @classdesc - The data contract interface used for pivot notifications.
 * @export
 */
export interface IPivotNotification {
    activePivotId: string;
    previousPivotId: string;
}

/**
 * @interface IPivotSubscriber
 * @classdesc - The interface which pivot notification subscribers must implement.
* @extends {ISubscriber}
 * @export
 */
export interface IPivotSubscriber extends ISubscriber {
    onPivotChanged(notification: IPivotNotification): void;
}

/**
 * @class - Pivot
 * @classdesc - The Pivot component
* @extends {Publisher<IControllerSubscriber | IPivotSubscriber>}
* @implements {IController}
 * @export
 */
export class Pivot extends Publisher<IControllerSubscriber | IPivotSubscriber> implements IController {
    /**
     * @name - selector
    * @memberof - Pivot
     * @description - The pivot component selector.
     * @public
    * @static
    * @readonly
     * @type {string}
     */
    public static readonly selector = '.c-pivot';

    /**
     * @name - tabIndexAttribute
    * @memberof - Pivot
     * @description - The tabIndex attribute name.
     * @private
    * @static
    * @readonly
     * @type {string}
     */
    private static readonly tabIndexAttribute = 'tabIndex';

    /**
     * @name - state
    * @memberof - Pivot
     * @description - The pivot state attribute name.
     * @private
    * @static
    * @readonly
     * @type {string}
     */
    private static readonly state = 'data-f-state';

    /**
     * @name - disabled
    * @memberof - Pivot
     * @description - The disabled pivot attribute value.
     * @private
    * @static
    * @readonly
     * @type {string}
     */
    private static readonly disabled = 'disabled';

    /**
     * @name - activePivotSelector
    * @memberof - Pivot
     * @description - The active pivot class selector.
     * @private
    * @static
    * @readonly
     * @type {string}
     */
    private static readonly activePivotSelector = 'f-active';

    /**
     * @name - ariaHidden
    * @memberof - Pivot
     * @description - aria-hidden attribute name.
     * @private
    * @static
    * @readonly
     * @type {string}
     */
    private static readonly ariaHidden = 'aria-hidden';

    /**
     * @name - ariaSelected
    * @memberof - Pivot
     * @description - aria-selected attribute name.
     * @private
     * @static
    * @readonly
     * @type {string}
     */
    private static readonly ariaSelected = 'aria-selected';

    /**
     * @name - pivotHeader
    * @memberof - Pivot
     * @description - The pivot's header element.
     * @private
     * @type {HTMLElement}
     */
    private pivotHeader: HTMLElement;

    /**
     * @name - activePivotHeader
    * @memberof - Pivot
     * @description - The pivots header's active element.
     * @private
     * @type {HTMLElement}
     */
    private activePivotHeader: HTMLElement;

    /**
     * @name - pivotTabs
    * @memberof - Pivot
     * @description - The list of pivot tab elements.
     * @private
    * @type {HTMLElement[]}
     */
    private pivotTabs: HTMLElement[];

    /**
     * @name - pivots
    * @memberof - Pivot
     * @description - The list of pivot elements.
     * @private
    * @type {HTMLElement[]}
     */
    private pivots: HTMLElement[];

    /**
     * @name - activePivot
    * @memberof - Pivot
     * @description - The active pivot element.
     * @private
     * @type {HTMLElement}
     */
    private activePivot: HTMLElement;

    /**
     * @name - isLtr
    * @memberof - Pivot
     * @description - Whether or not the pivot direction is ltr.
     * @private
     * @type {boolean}
     */
    private isLtr: boolean;

    /**
    * @name - constructor
    * @memberof - Pivot
    * @description - Constructor for the Pivot component.
    * @public
    * @param {HTMLElement} pivotElement - The native element to attach the Pivot behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected pivotElement: HTMLElement, params: any = null) {
        super(pivotElement, params);

        if (ObservableComponent.shouldInitializeAsClass(pivotElement, params)) {
            this.update();
        }
    }

    /**
    * @name - update
    * @memberof - Pivot
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @override
    * @returns {boolean}
    */
    protected update(): boolean {
        if (!this.pivotElement) {
            return false;
        }

        this.pivots = [];

        let pivots = selectElements('.c-pivot > section', this.element);

        // We may have found nested pivots so filter out the pivots that aren't children of this component.
        for (let pivot of pivots) {
            if (pivot.parentElement === this.element) {
                this.pivots.push(pivot);
            }
        }

        this.pivotHeader = selectFirstElement('header', this.element);

        if (this.pivots && this.pivots.length && !!this.pivotHeader) {
            let activeTab: HTMLElement;

            this.pivotTabs = selectElements('header > a', this.pivotHeader);

            if (this.pivotTabs && (this.pivotTabs.length > 1)) {
                for (let pivotTab of this.pivotTabs) {
                    if (hasClass(pivotTab, Pivot.activePivotSelector)) {
                        // Ensure that we only have one active pivot.
                        if (!activeTab) {
                            activeTab = pivotTab;
                        } else {
                            removeClass(pivotTab, Pivot.activePivotSelector);
                        }
                    }

                    // Remove all tabs from the tab order, we will access via arrow keys
                    pivotTab.setAttribute(Pivot.tabIndexAttribute, '-1');
                    pivotTab.setAttribute('href', '#');
                    pivotTab.setAttribute(Pivot.ariaSelected, 'false');
                }

                // Ensure that we have an activeTab
                if (!activeTab) {
                    activeTab = this.pivotTabs[0];
                }

                this.isLtr = (getDirection(this.pivotHeader) === Direction.left);

                this.onPivotChanged(activeTab, false);

                addEvent(this.pivotHeader, eventTypes.click, this.onPivotClicked);
                addEvent(this.pivotHeader, eventTypes.keydown, this.onKeydown);
            }
        }

        return true;
    }

    /**
    * @name - teardown
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @override
    * @returns {void}
    */
    protected teardown(): void {
        // Remove the click listener.
        if (this.pivotTabs && (this.pivotTabs.length > 1)) {
            removeEvent(this.pivotHeader, eventTypes.click, this.onPivotClicked);
            removeEvent(this.pivotHeader, eventTypes.click, this.onKeydown);
        }

        // Reset non static members
        this.pivotHeader = null;
        this.activePivotHeader = null;
        this.pivots = null;
        this.activePivot = null;
    }

    /**
    * @name - setControllerIndex
    * @description - Implements IController's setControllerIndex method to set the pivot index.
    * @public
    * @param {number} toIndex - The desired new index.
    * @param {boolean} [forceFocus = false] - Whether or not to force setting the focus to the new index element.
    * @returns {boolean} - true if the index is changed, otherwise false.
    */
    public setControllerIndex = (toIndex: number, forceFocus: boolean = false): boolean => {
        if (!this.pivotTabs || (toIndex < 0) || (toIndex >= this.pivotTabs.length)) {
            return false;
        }

        this.onPivotChanged(this.pivotTabs[toIndex], forceFocus);
        return true;
    }

    /**
    * @name - onPivotClicked
    * @description - Handles the pivot click events.
    * @private
    * @param {Event} event - The click event.
    * @returns {void}
    */
    private onPivotClicked = (event: MouseEvent): void => {
        preventDefault(event);
        this.onPivotChanged(getEventTargetOrSrcElement(event));
    }

    /**
    * @name - onKeydown
    * @description - Handles the pivot keydown events.
    * @private
    * @param {KeyboardEvent} event - The keydown event.
    * @returns {void}
    */
    private onKeydown = (event: KeyboardEvent): void => {
        let delta: number;
        let keyCode = getKeyCode(event);
        let virtualKey = getVirtualKey(event);

        if ((keyCode === keycodes.Enter) || (keyCode === keycodes.Space) ||
            (virtualKey === 'Enter') || (virtualKey === ' ')) {
            preventDefault(event);
        } else if ((keyCode === keycodes.ArrowLeft) || (virtualKey === 'ArrowLeft')) {
            delta = -1;
        } else if ((keyCode === keycodes.ArrowRight) || (virtualKey === 'ArrowRight')) {
            delta = 1;
        }

        if (delta) {
            preventDefault(event);
            delta *= this.isLtr ? 1 : -1;

            let targetPivot: HTMLElement;

            for (let index = 0; index < this.pivotTabs.length; index++) {
                if (this.pivotTabs[index] === this.activePivotHeader) {
                    let targetIndex = index + delta;

                    if (targetIndex >= this.pivotTabs.length) {
                        targetIndex = 0;
                    } else if (targetIndex < 0) {
                        targetIndex = this.pivotTabs.length - 1;
                    }

                    targetPivot = this.pivotTabs[targetIndex];
                    break;
                }
            }

            if (targetPivot) {
                this.onPivotChanged(targetPivot);
            }
        }
    }

    /**
    * @name - onPivotChanged
    * @description - Pivot changed handler.
    * @private
    * @param {HTMLElement} activePivotHeader - The pivot header to make active.
    * @param [boolean] setFocus - Sets the focus to the pivot if true.  Default is true.
    * @returns {void}
    */
    private onPivotChanged(activePivotHeader: HTMLElement, setFocus = true): void {
        if (!this.isDisabled()) {
            if (!!activePivotHeader && (activePivotHeader !== this.activePivotHeader)) {
                this.updatePivot(activePivotHeader, setFocus);
            }
        }
    }

    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @override
    * @param {IControllerSubscriber | IPivotSubscriber} subscriber - The subscriber to make the callback to.
    * @param {any} context - The publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IControllerSubscriber | IPivotSubscriber, context?: any): void {
        let pivotSubscriber = subscriber as IPivotSubscriber;
        let controllerSubscriber = subscriber as IControllerSubscriber;

        if (pivotSubscriber.onPivotChanged) {
            pivotSubscriber.onPivotChanged(context as IPivotNotification);
        }

        if (controllerSubscriber.onControllerIndexChanged) {
            controllerSubscriber.onControllerIndexChanged(context as IControllerNotification);
        }
    }

    /**
    * @name - updatePivot
    * @description - Update the pivot header and content associated with the active pivot header.
    * @private
    * @param {HTMLElement} activePivotHeader - The pivot header to make active.
    * @param {boolean} forceFocus - Whether or not to force setting the focus to the new index element.
    * @returns {void}
    */
    private updatePivot(activePivotHeader: HTMLElement, forceFocus: boolean): void {
        let isFocused = false;
        let previousActiveHeader = this.activePivotHeader;
        this.activePivotHeader = activePivotHeader;

        if (!!this.activePivotHeader) {
            let previousPivotId = previousActiveHeader ? previousActiveHeader.getAttribute('aria-controls') : null;
            let pivotId = this.activePivotHeader ? this.activePivotHeader.getAttribute('aria-controls') : null;
            let previousIndex: number;
            let currentIndex: number;

            for (let index = 0; index < this.pivotTabs.length; index++) {
                let pivotTab = this.pivotTabs[index];

                if (pivotTab === previousActiveHeader) {
                    previousIndex = index;

                    if (isNumber(currentIndex)) {
                        break;
                    }
                } else if (pivotTab === activePivotHeader) {
                    currentIndex = index;

                    if (isNumber(previousIndex)) {
                        break;
                    }
                }
            }

            if (previousActiveHeader) {
                removeClass(previousActiveHeader, Pivot.activePivotSelector);
                previousActiveHeader.setAttribute(Pivot.ariaSelected, 'false');

                // Take previousActiveHeader out the tab order
                previousActiveHeader.setAttribute(Pivot.tabIndexAttribute, '-1');

                // If focus is on the active element, we need to make sure we don't loose
                // focus when we change selected states.
                isFocused = document.activeElement === previousActiveHeader;
            }

            addClass(this.activePivotHeader, Pivot.activePivotSelector);
            this.activePivotHeader.setAttribute(Pivot.ariaSelected, 'true');

            // Put activeTab back into the tab order
            this.activePivotHeader.removeAttribute(Pivot.tabIndexAttribute);

            if (forceFocus || isFocused) {
                this.activePivotHeader.focus();
            }

            if (!!pivotId) {
                let activePivot = document.getElementById(pivotId);

                if (!!activePivot && (!this.activePivot || (this.activePivot !== activePivot))) {
                    for (let pivot of this.pivots) {
                        if (pivot === activePivot) {
                            this.showPivot(pivot);
                            this.activePivot = activePivot;
                        } else {
                            this.hidePivot(pivot);
                        }
                    }
                }
            }

            this.initiatePublish({
                previousIndex: previousIndex,
                currentIndex: currentIndex,
                activePivotId: pivotId,
                previousPivotId: previousPivotId
            });
        }
    }

    /**
    * @name - showPivot
    * @description - Show the specified pivot.
    * @private
    * @param {HTMLElement} pivot - The pivot to show.
    * @returns {void}
    */
    private showPivot(pivot: HTMLElement): void {
        if (!!pivot) {
            pivot.setAttribute(Pivot.ariaHidden, 'false');
        }
    };

    /**
    * @name - hidePivot
    * @description - Hide the specified pivot.
    * @private
    * @param {HTMLElement} pivot - The pivot to hide.
    * @returns {void}
    */
    private hidePivot(pivot: HTMLElement): void {
        if (!!pivot) {
            pivot.setAttribute(Pivot.ariaHidden, 'true');
        }
    };

    /**
    * @name - isDisabled
    * @description - Determines whether or not the Pivot is disabled.
    * @private
    * @returns {boolean} - True if the Pivot is disabled, otherwise false
    */
    private isDisabled(): boolean {
        return this.pivotElement.getAttribute(Pivot.state) === Pivot.disabled;
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Pivot.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Pivot,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
