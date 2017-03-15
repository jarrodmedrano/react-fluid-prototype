/// <amd-module name='social'/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {
    addClass,
    addEvent,
    eventTypes,
    getEvent,
    getEventTargetOrSrcElement,
    preventDefault,
    removeClass,
    removeEvent,
    selectElementsT,
    selectFirstElement
} from 'htmlExtensions';
import {isNullOrWhiteSpace} from 'stringExtensions';
import {apiDeprecated, getKeyCode} from 'utility';
import {keycodes} from 'keycodes';

/**
 * Social component
 *
 * @export
 * @class Social
 */
export class Social extends ObservableComponent {
    /**
     * default social selector
     *
     * @static
     * @type {string}
     */
    public static selector = '.m-social';

    /**
     * aria-expanded attribute string
     * aria-expanded deprecated v.1.10.0
     * TODO: Remove aria-expanded in v.2.0
     * @private
     * @type {string}
     */
    private ariaExpanded = 'aria-expanded';

    /**
     *  new button toggle attribute string
     *
     * @private
     * @type {string}
     */
    private buttonToggle = 'data-js-toggle';

    /**
     * aria-hidden attribute string
     *
     * @private
     * @type {string}
     */
    private ariaHidden = 'aria-hidden';

    /**
     * element hide class
     *
     * @private
     * @type {string}
     */
    private hideClass = 'f-hide';

    /**
     * the social icons
     *
     * @private
     * @type {HTMLAnchorElement[]}
     */
    private icons: HTMLAnchorElement[];

    /**
     * the toggle button
     *
     * @private
     * @type {HTMLButtonElement}
     */
    private toggle: HTMLButtonElement;

    /**
     * boolean that describes whether or not some social icons are hidden
     *
     * @private
     * @type {boolean}
     */
    private isHidden = true;

    /**
     * threshold for adding the overflow behavior (to hide social icons)
     *
     * @private
     * @type {number}
     */
    private iconOverflowThresholdLength = 4;

    /**
     * the maximum number of icons to show
     *
     * @private
     */
    private maxIconShowCount = this.iconOverflowThresholdLength - 1;

    /**
     * Creates an instance of Social.
     *
     * @param {HTMLElement} element - the Social element
     */
    constructor(public element: HTMLElement) {
        super(element);
        if (!element) {
            return;
        }

        this.update();

    }

    /**
     * @name - update
     * @description - updates the component state
     *
     * @protected
     * @returns {Void}
     */
    protected update(): void {
        this.icons = selectElementsT<HTMLAnchorElement>('a[itemprop="sameAs"]', this.element);

        if (!this.icons || !this.icons.length) {
            return;
        }

        this.toggle = selectFirstElement('button', this.element) as HTMLButtonElement;
        if (this.toggle) {
            addEvent(this.toggle, eventTypes.mouseup, this.handleMouseUp);
            addEvent(this.element, eventTypes.keydown, this.handleKeydown);

            if (this.icons.length > this.iconOverflowThresholdLength) {
                this.toggle.setAttribute(this.ariaHidden, 'false');
                if (this.ariaExpanded) {
                    this.toggle.setAttribute(this.ariaExpanded, 'false');
                } else {
                    this.toggle.setAttribute(this.buttonToggle, 'false');
                }
                
                this.toggleIcons(true, false);
            }
        }
    }

    /**
     * @name - teardown
     * @description - cleans up the component
     *
     * @protected
     * @returns {Void}
     */
    protected teardown(): void {
        removeEvent(this.toggle, eventTypes.mouseup, this.handleMouseUp);
        removeEvent(this.element, eventTypes.keydown, this.handleKeydown);
    }

    /**
    * @name - handleMouseUp
    * @description - Handle mouseup event
    *
    * @param {MouseEvent} event - the event object
    * @private
    * @returns {Void}
    */
    private handleMouseUp = (event: MouseEvent) => {
        this.handleToggle(false);
    }

    /**
    * @name - handleKeydown
    * @description - Handle keydown event
    *
    * @param {KeyboardEvent} event - the event object
    * @private
    * @returns {Void}
    */
    private handleKeydown = (event: KeyboardEvent) => {
        event = getEvent(event as Event) as KeyboardEvent;
        const keyCode = getKeyCode(event);
        const target = getEventTargetOrSrcElement(event);

        switch (keyCode) {
            case keycodes.Tab:
                if (!this.isHidden && target === this.icons[this.maxIconShowCount] && event.shiftKey) {
                    preventDefault(event);
                    this.handleToggle(false);
                    this.toggle.focus();
                }

               break;
            case keycodes.Enter:
                if (target === this.toggle) {
                    this.handleToggle(true);
                }

                break;
        }
    }

    /**
    * @name - handleToggle
    * @description - Handle keydown event
    *
    * @param {boolean} - setFocus: should the method set keyboard focus
    * @private
    * @returns {Void}
    */
    private handleToggle = (setFocus: boolean) => {
        this.isHidden ? this.toggleIcons(false, setFocus) : this.toggleIcons(true, setFocus);
        if (this.ariaExpanded) {
            this.toggle.setAttribute(this.ariaExpanded, (!this.isHidden).toString());
        }

        this.toggle.setAttribute(this.buttonToggle, (!this.isHidden).toString());
    }

    /**
     * toggles the visible icons
     *
     * @private
     * @param {boolean} wantToHideOverflow - true if the caller wants to hide the second set of icons
     * @param {boolean} setFocus - should the method set keyboard focus
     * @returns {Void}
     */
    private toggleIcons = (wantToHideOverflow: boolean, setFocus: boolean) => {
        // set the class of the first set of icons
        for (let iconIndex = 0; iconIndex < this.maxIconShowCount; iconIndex++) {
            wantToHideOverflow ?
                removeClass(this.icons[iconIndex], this.hideClass) :
                addClass(this.icons[iconIndex], this.hideClass);
        }

        // set the class of the second set of icons
        for (let iconIndex = this.maxIconShowCount; iconIndex < this.icons.length; iconIndex++) {
            wantToHideOverflow ?
                addClass(this.icons[iconIndex], this.hideClass) :
                removeClass(this.icons[iconIndex], this.hideClass);
        }

        // set focus if keyboard action
        if (setFocus) {
            if (wantToHideOverflow) {
                this.icons[0].focus();
            } else {
                this.icons[this.maxIconShowCount].focus();
            }
        }

        this.isHidden = wantToHideOverflow;
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Social.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Social,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
