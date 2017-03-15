/// <amd-module name="rating"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {
    addEvent,
    removeEvent,
    selectElements,
    eventTypes,
    getEvent,
    addClass,
    removeClass,
    hasClass
} from 'htmlExtensions';

/**
* @class - Rating
* @classdesc - The Rating component
* @export
*/
export class Rating extends ObservableComponent {
    /**
    * @name - selector
    * @description - The rating component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-rating.f-interactive';

    /**
    * @name - userRatedSelector
    * @description - This is the user rated class selector to add/remove when a button in rating is focused.
    * @private
    * @static
    * @type {string}
    */
    private static userRatedSelector = 'f-user-rated';

    /**
    * @name - communityRatedSelector
    * @description - This is the community rated class selector to add/remove when a button in rating is focused.
    * @private
    * @static
    * @type {string}
    */
    private static communityRatedSelector = 'f-community-rated';

    /**
    * @name - fullClass
    * @description - This is the class indicating a full star.
    * @private
    * @static
    * @type {string}
    */
    private static fullClass = 'f-full';

    /**
    * @name - halfClass
    * @description - This is the class indicating a half star.
    * @private
    * @static
    * @type {string}
    */
    private static halfClass = 'f-half';

    /**
    * @name - noneClass
    * @description - This is the class indicating an empty star.
    * @private
    * @static
    * @type {string}
    */
    private static noneClass = 'f-none';

    /**
    * @name - userRated
    * @description - Indicates whether or not this has been user rated.
    * @private
    * @type {boolean}
    */
    private userRated: boolean;

    /**
    * @name - communityRated
    * @description - Indicates whether or not this has been community rated.
    * @private
    * @type {boolean}
    */
    private communityRated: boolean;

    /**
    * @name - buttons
    * @description - An array of the buttons in rating.
    * @private
    * @type {HTMLElement[]}
    */
    private buttons: HTMLElement[];

    /**
    * @name - buttonClasses
    * @description - An array of the button classes in rating.
    * @private
    * @type {string[]}
    */
    private buttonClasses: string[];

    /**
    * @name - constructor
    * @description - Constructor for the rating component.
    * @public
    * @param {HTMLElement} element - the native element to attach the rating behavior to.
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
        this.buttons = selectElements('button', this.element);
        this.buttonClasses = this.getButtonClasses();
        this.userRated = hasClass(this.element, Rating.userRatedSelector);
        this.communityRated = hasClass(this.element, Rating.communityRatedSelector);

        addEvent(this.buttons, eventTypes.focus, this.onRatingFocus);
        addEvent(this.buttons, eventTypes.blur, this.onRatingBlur);
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
        removeEvent(this.buttons, eventTypes.focus, this.onRatingFocus);
        removeEvent(this.buttons, eventTypes.blur, this.onRatingBlur);
    }

    /**
    * @name - getButtonClasses
    * @description - Gets the button classes and returns them - used to store original button classes.
    * @private
    * @return {string[]}
    */
    private getButtonClasses(): string[] {
        let classes = [] as string[];

        for (let i = 0, buttonsLength = this.buttons.length; i < buttonsLength; i++) {
            if (hasClass(this.buttons[i], Rating.fullClass)) {
                classes.push(Rating.fullClass);
            } else if (hasClass(this.buttons[i], Rating.halfClass)) {
                classes.push(Rating.halfClass);
            } else if (hasClass(this.buttons[i], Rating.noneClass)) {
                classes.push(Rating.noneClass);
            } else {
                classes.push('');
            }
        }

        return classes;
    }

    /**
    * @name - onRatingFocus
    * @description - Adds classes for focus state that allow for the same visual as hover state.
    * @private
    * @return {void}
    */
    private onRatingFocus = (event: FocusEvent): void => {
        let focusEvent = getEvent(event) as FocusEvent;

        addClass(this.element, Rating.userRatedSelector);
        addClass(this.element, Rating.communityRatedSelector);

        this.removeButtonClasses();
        this.setButtonStyle(focusEvent.target as HTMLElement);
    }

    /**
    * @name - onRatingBlur
    * @description - Removes classes for blur state.
    * @private
    * @return {void}
    */
    private onRatingBlur = (event: FocusEvent): void => {
        if (this.communityRated === false) { removeClass(this.element, Rating.communityRatedSelector); }
        if (this.userRated === false) { removeClass(this.element, Rating.userRatedSelector); }

        this.resetButtonClasses();
    }

    /**
    * @name - removeButtonClasses
    * @description - Removes all original button classes.
    * @private
    * @return {void}
    */
    private removeButtonClasses(): void {
        for (let i = 0, buttonsLength = this.buttons.length; i < buttonsLength; i++) {
            removeClass(this.buttons[i], this.buttonClasses[i]);
        }
    }

    /**
    * @name - resetButtonClasses
    * @description - Resets button classes to their original classes.
    * @private
    * @return {void}
    */
    private resetButtonClasses(): void {
        for (let i = 0, buttonsLength = this.buttonClasses.length; i < buttonsLength; i++) {
            addClass(this.buttons[i], this.buttonClasses[i]);
            if (hasClass(this.buttons[i], Rating.fullClass) && this.buttonClasses[i] !== Rating.fullClass) {
                removeClass(this.buttons[i], Rating.fullClass);
            }
        }
    }

    /**
    * @name - setButtonStyle
    * @description - Sets button styles when focusing.
    * @private
    * @return {void}
    */
    private setButtonStyle(button: HTMLElement): void {
        let before = true;

        for (let i = 0, buttonsLength = this.buttons.length; i < buttonsLength; i++) {
            if (before === true) {
                addClass(this.buttons[i], Rating.fullClass);
            } else {
                removeClass(this.buttons[i], Rating.fullClass);
            }
            if (this.buttons[i] === button) {
                before = false;
            }
        }
    }
}
