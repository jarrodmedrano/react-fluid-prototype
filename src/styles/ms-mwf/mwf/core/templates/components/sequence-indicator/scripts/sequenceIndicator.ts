/// <amd-module name="sequenceIndicator"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ObservableComponent} from 'observableComponent';
import {Publisher, ISubscriber} from 'publisher';
import {IController, IControllerSubscriber, IControllerNotification} from 'iController';
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
import {apiDeprecated, getKeyCode, getVirtualKey} from 'utility';
import {keycodes} from 'keycodes';

/**
* @interface ISequenceIndicatorNotification
* @classdesc - The data contract interface used for SequenceIndicator notifications.
* @export
*/
export interface ISequenceIndicatorNotification {
    index: number;
}

/**
* @interface ISequenceIndicatorSubscriber
* @classdesc - The interface which SequenceIndicator notification subscribers must implement.
* @extends {ISubscriber}
* @export
*/
export interface ISequenceIndicatorSubscriber extends ISubscriber {
    onIndexChanged(notification: ISequenceIndicatorNotification): void;
}

/**
* @class SequenceIndicator component
* @classdesc - The SequenceIndicator component
* @extends {Publisher<IControllerSubscriber | ISequenceIndicatorSubscriber>}
* @implements {IController}
* @export
*/
export class SequenceIndicator extends Publisher<IControllerSubscriber | ISequenceIndicatorSubscriber> implements IController {
    /**
    * @name - selector
    * @memberof - SequenceIndicator
    * @description - The SequenceIndicator component selector.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static readonly selector = '.c-sequence-indicator';

    /**
    * @name - itemSelector
    * @memberof - SequenceIndicator
    * @description - The selector for sequence indicator items.
    * @protected
    * @static
    * @readonly
    * @type {string}
    */
    protected static readonly itemSelector = 'button';

    /**
    * @name - selectedValue
    * @memberof - SequenceIndicator
    * @description - The selected value of SequenceIndicator.selectedAttribute.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly selectedValue = 'true';

    /**
    * @name - deselectedValue
    * @memberof - SequenceIndicator
    * @description - The deselected value of SequenceIndicator.selectedAttribute.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly deselectedValue = 'false';

    /**
    * @name - ariaSelected
    * @memberof - SequenceIndicator
    * @description - The aria-selected attribute name.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly ariaSelected = 'aria-selected';

    /**
    * @name - ariaChecked
    * @memberof - SequenceIndicator
    * @description - The aria-checked attribute name.
    *                This value is needed only for backwards compatibility and can be removed in v2.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly ariaChecked = 'aria-checked';

    /**
    * @name - activeItemClass
    * @memberof - SequenceIndicator
    * @description - The active item class name.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly activeItemClass = 'f-active';

    /**
    * @name - selectedAttribute
    * @memberof - SequenceIndicator
    * @description - The attribute name to use to store selected state.
    * @private
    * @static
    * @type {string}
    */
    private selectedAttribute = SequenceIndicator.ariaSelected;

    /**
    * @name - items
    * @memberof - SequenceIndicator
    * @description - Stores the indicator items HTMLElement references
    * @private
    * @type {HTMLElement[]}
    */
    private items: HTMLElement[];

    /**
    * @name - activeElement
    * @memberof - SequenceIndicator
    * @description - Stores the currently selected indicator HTMLElement reference
    * @private
    * @type {HTMLElement}
    */
    private activeElement: HTMLElement;

    /**
    * @name - activeIndex
    * @memberof - SequenceIndicator
    * @description - Stores the currently selected indicator index reference
    * @private
    * @type {HTMLElement}
    */
    private activeIndex: number;

    /**
    * @name - constructor
    * @memberof - SequenceIndicator
    * @description - Constructor for the SequenceIndicator component.
    * @public
    * @param {HTMLElement} sequenceIndicatorElement - The native element to attach the SequenceIndicator behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected sequenceIndicatorElement: HTMLElement, params: any = null) {
        super(sequenceIndicatorElement, params);

        if (ObservableComponent.shouldInitializeAsClass(sequenceIndicatorElement, params)) {
            this.update();
        }
    }

    /**
    * @name - update
    * @memberof - SequenceIndicator
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @override
    * @returns {boolean}
    */
    protected update(): boolean {
        let activeIndex: number;

        if (!this.sequenceIndicatorElement) {
            return false;
        }

        // Check if element is deprecated shape or not
        if (this.sequenceIndicatorElement.getAttribute('role') === 'radiogroup') {
            this.selectedAttribute = SequenceIndicator.ariaChecked;
        }

        this.items = selectElements((this.constructor as any).itemSelector, this.sequenceIndicatorElement);

        if (!this.items.length) {
            return false;
        }

        for (let item of this.items) {
            if (item.getAttribute(this.selectedAttribute) === SequenceIndicator.selectedValue) {
                activeIndex = this.items.indexOf(item);
            }

            // Deselect everything initially to make sure we don't have multiple selected items
            this.deselectItem(item);
        }

        // Make sure we
        this.setControllerIndex(activeIndex || 0);

        // Bind listener
        addEvent(this.sequenceIndicatorElement, eventTypes.click, this.handleClickEvent);
        addEvent(this.sequenceIndicatorElement, eventTypes.keydown, this.onKeydown, true);
        return true;
    }

    /**
    * @name - teardown
    * @memberof - SequenceIndicator
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @override
    * @returns {void}
    */
    protected teardown(): void {
        removeEvent(this.sequenceIndicatorElement, eventTypes.click, this.handleClickEvent);
        removeEvent(this.sequenceIndicatorElement, eventTypes.keydown, this.onKeydown);
    }

    /**
    * @name - publish
    * @memberof - SequenceIndicator
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @override
    * @param {IControllerSubscriber | ISequenceIndicatorSubscriber} subscriber - The subscriber to make the callback to.
    * @param {any} context - The publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IControllerSubscriber | ISequenceIndicatorSubscriber, context?: any): void {
        let sequenceIndicatorSubscriber = subscriber as ISequenceIndicatorSubscriber;
        let controllerSubscriber = subscriber as IControllerSubscriber;

        if (sequenceIndicatorSubscriber.onIndexChanged) {
            sequenceIndicatorSubscriber.onIndexChanged(context as ISequenceIndicatorNotification);
        }

        if (controllerSubscriber.onControllerIndexChanged) {
            controllerSubscriber.onControllerIndexChanged(context as IControllerNotification);
        }
    }

    /**
    * @name - selectItem
    * @memberof - SequenceIndicator
    * @description - Sets the selection properties for a sequence indicator item
    * @private
    * @param {HTMLElement} element - the element to select
    * @returns {void}
    */
    private selectItem(element: HTMLElement): void {
        if (!!element) {
            element.setAttribute(this.selectedAttribute, SequenceIndicator.selectedValue);
            element.setAttribute('tabindex', '0');

            // For LogoController we also need to do this. Can we remove in V2?
            addClass(element, SequenceIndicator.activeItemClass);
        }
    }

    /**
    * @name - deselectItem
    * @memberof - SequenceIndicator
    * @description - Sets the deselection properties for a sequence indicator item
    * @private
    * @param {HTMLElement} element - the element to deselect
    * @returns {void}
    */
    private deselectItem(element: HTMLElement): void {
        if (!!element) {
            element.setAttribute(this.selectedAttribute, SequenceIndicator.deselectedValue);
            element.setAttribute('tabindex', '-1');

            // For LogoController we also need to do this. Can we remove in V2?
            removeClass(element, SequenceIndicator.activeItemClass);
        }
    }

    /**
    * @name - setActiveIndex
    * @memberof - SequenceIndicator
    * @description - Sets the active sequence indicator item.
    *                This method needs to remain until v2 for backward compatibility.
    * @public
    * @param {number} The index in this.items to set to active.
    * @returns {boolean} - true if the index is changed, otherwise false.
    */
    public setActiveIndex = (index: number): boolean => {
        apiDeprecated('SequenceIndicator.setActiveIndex() is deprecated, please use SequenceIndicator.setControllerIndex() instead.');
        return this.setControllerIndex(index);
    }

    /**
    * @name - setControllerIndex
    * @memberof - SequenceIndicator
    * @description - Implements IController's setControllerIndex method to set the SequenceIndicator's index.
    * @public
    * @param {number} toIndex - The desired new index.
    * @param {boolean} [forceFocus = false] - Whether or not to force setting the focus to the new index element.
    * @returns {boolean} - true if the index is changed, otherwise false.
    */
    public setControllerIndex = (toIndex: number, forceFocus: boolean = false): boolean => {
        // Range check passed index to make sure it's valid
        if ((toIndex < 0) || (toIndex > this.items.length - 1) || (toIndex === this.activeIndex)) {
            return false;
        }

        let previousIndex = this.activeIndex;
        let activeElement = this.items[this.activeIndex];
        let toElement = this.items[toIndex];

        // If focus is on the active element, we need to make sure we don't loose
        // focus when we change selected states.
        let isFocused = document.activeElement === activeElement;

        // Change DOM
        this.deselectItem(activeElement);
        this.selectItem(toElement);

        // Change activeElement now that we've updated everything's state
        this.activeIndex = toIndex;

        if (forceFocus || isFocused) {
            toElement.focus();
        }

        this.initiatePublish({
            previousIindex: previousIndex,
            currentIndex: toIndex,
            index: toIndex
        });

        return true;
    }

    /**
    * @memberof - SequenceIndicator
    * @name - handleClickEvent
    * @description - Event handler for click events
    * @private
    * @param {UIEvent} event - The click event.
    * @returns {void}
    */
    private handleClickEvent = (event: UIEvent): void => {
        preventDefault(event);

        let target = getEventTargetOrSrcElement(event);

        if (target) {
            let role = target.getAttribute('role');

            if (!role && target.parentElement) {
                target = (target.parentElement.getAttribute('role') === 'tab') ? target.parentElement : null;
            }

            this.setControllerIndex(this.items.indexOf(target));
        }
    }

    /**
    * @memberof - SequenceIndicator
    * @name - onKeydown
    * @description - Listener for keyboard events
    * @private
    * @param {KeyboardEvent} event - The keydown event.
    * @returns {void}
    */
    private onKeydown = (event: KeyboardEvent): void => {
        switch (getKeyCode(event as KeyboardEvent)) {
            case keycodes.ArrowRight:
            case keycodes.ArrowDown:
                this.next();
                break;
            case keycodes.ArrowLeft:
            case keycodes.ArrowUp:
                this.previous();
                break;
            default: {
                switch (getVirtualKey(event)) {
                    case 'ArrowRight':
                    case 'ArrowDown': {
                        this.next();
                        break;
                    }
                    case 'ArrowLeft':
                    case 'ArrowUp': {
                        this.previous();
                        break;
                    }

                    default: break;
                }
                break;
            }
        }
    }

    /**
    * @name - next
    * @memberof - SequenceIndicator
    * @description - Go to the next item
    * @private
    * @returns {void}
    */
    private next(): void {
        let index: number;
        index = this.activeIndex === this.items.length - 1 ? 0 : this.activeIndex + 1;
        this.setControllerIndex(index);
    }

    /**
    * @name - previous
    * @memberof - SequenceIndicator
    * @description - Go to the previous item
    * @private
    * @returns {void}
    */
    private previous(): void {
        let index: number;
        index = this.activeIndex === 0 ? this.items.length - 1 : this.activeIndex - 1;
        this.setControllerIndex(index);
    }
}