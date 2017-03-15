/// <amd-module name="immersiveHeroItem"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {HeroItemBase} from 'hero-item-base';
import {ICollectionItem} from 'ICollectionItem';
import {addThrottledEvent, css, eventTypes, getClientRect,
        hasClass, removeEvent, selectFirstElement} from 'htmlExtensions';

/**
* @class ImmersiveHeroItem
* @description - The Immersive Hero Item module
* @export
*/
export class ImmersiveHeroItem extends HeroItemBase implements ICollectionItem {
    /**
    * @name - selector
    * @memberof ImmersiveHeroItem
    * @description - Selector to use to find ImmersiveHeroItem components in the document.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static readonly selector = '.m-immersive-hero-item';

    /**
    * @name - titleSelector
    * @memberof ImmersiveHeroItem
    * @description - The title area selector
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly titleSelector = 'div > div';

    /**
    * @name - imageSelector
    * @memberof ImmersiveHeroItem
    * @description - The optional foreground image selector
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly imageSelector = 'div > .c-image > img';

    /**
    * @name - image
    * @memberof ImmersiveHeroItem
    * @description - The optional foreground image
    * @private
    * @type {HTMLElement}
    */
    private image: HTMLElement;

    /**
    * @name - title
    * @memberof ImmersiveHeroItem
    * @description - The title area element
    * @private
    * @type {HTMLElement}
    */
    private title: HTMLElement;

    /**
    * @name - titleHeight
    * @memberof ImmersiveHeroItem
    * @description - The height of the title area in pixels
    * @private
    * @type {number}
    */
    private titleHeight: number;

    /**
    * @name - sectionHeight
    * @memberof ImmersiveHeroItem
    * @description - The height of the Immersive Hero Item section in pixels
    * @private
    * @type {number}
    */
    private sectionHeight: number;

    /**
    * @name - resizeThrottledEvent
    * @memberof ImmersiveHeroItem
    * @description - function to throttle the window.resize event
    * @private
    * @type {EventListener}
    */
    private resizeThrottledEvent: EventListener;

    /**
    * @name - isTopAligned
    * @memberof ImmersiveHeroItem
    * @description - The top aligned instance of Immersive Hero Item
    * @private
    * @type {boolean}
    */
    private isTopAligned: boolean;

    /**
    * @name - windowWidth
    * @memberof ImmersiveHeroItem
    * @description - The width of the current window in pixels
    * @private
    * @type {number}
    */
    private windowWidth: number;

    /**
    * @name - constructor
    * @memberof ImmersiveHeroItem
    * @description - Constructor for the ImmersiveHeroItem class.
    * @param {HTMLElement} immersiveHeroItemElement - The native element to attach the ImmersiveHeroItem behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected immersiveHeroItemElement: HTMLElement, params: any = null) {
        super(immersiveHeroItemElement, params);
    }

    /**
    * @name - update
    * @memberof ImmersiveHeroItem
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @override
    * @returns {boolean}
    */
    protected update(): boolean {
        if (!super.update()) {
            return false;
        }

        this.image = selectFirstElement(ImmersiveHeroItem.imageSelector, this.immersiveHeroItemElement);
        this.title = selectFirstElement(ImmersiveHeroItem.titleSelector, this.immersiveHeroItemElement);
        this.isTopAligned = hasClass(this.immersiveHeroItemElement, 'f-align-top');

        this.windowWidth = window.innerWidth;

        if (!this.image) {
            this.handleTextOnly();
        } else {
            this.resizeImage();
            this.resizeThrottledEvent = addThrottledEvent(window, eventTypes.resize, this.handleWindowEvent, 50);
        }
    }

    /**
    * @name - teardown
    * @memberof ImmersiveHeroItem
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @override
    * @returns {void}
    */
    protected teardown(): void {
        super.teardown();

        removeEvent(window, eventTypes.resize, this.resizeThrottledEvent);

        // Reset non static members
        this.image = null;
        this.sectionHeight = null;
        this.title = null;
        this.titleHeight = null;
        this.isTopAligned = null;
    }

    /**
    * @name - handleWindowEvent
    * @memberof ImmersiveHeroItem
    * @description - calls a function to resize the image
    * @private
    * @returns {void}
    */
    private handleWindowEvent = (): void => {
        this.resizeImage();

        // checking to see if the width of the window has changed
        // certain mobile devices were performing resize on scroll events when it had not
        if (this.windowWidth !== window.innerWidth) {
            this.windowWidth = window.innerWidth;
        }
    }

    /**
    * @name - handleTextOnly
    * @memberof ImmersiveHeroItem
    * @description - handles text alignment if image is missing from bottom aligned option
    * @private
    * @returns {void}
    */
    private handleTextOnly(): void {
        if (!this.isTopAligned && this.title.parentElement) {
            let titleWrapper = this.title.parentElement;

            css(titleWrapper, 'top', 'auto');
            css(titleWrapper, 'bottom', '0px');
        }
    }

    /**
    * @name - resizeImage
    * @memberof ImmersiveHeroItem
    * @description - resizes the image based on breakpoints
    * @private
    * @returns {void}
    */
    private resizeImage(): void {
        if (!this.immersiveHeroItemElement || !this.title || !this.image) {
            return;
        }

        let elementRect = getClientRect(this.immersiveHeroItemElement);
        let titleRect = getClientRect(this.title);
        let top = this.isTopAligned ? titleRect.top - elementRect.top : getClientRect(this.image).top - elementRect.top;

        this.titleHeight = titleRect.height + top;
        this.sectionHeight = elementRect.height;

        let imageHeight = this.sectionHeight - this.titleHeight + 'px';

        css(this.image, 'height', imageHeight);
    }

    /**
    * @name - onCollectionItemHidden
    * @memberof - ImmersiveHeroItem
    * @description - This is our implementation of ICollectionItem.onCollectionItemHidden()
    *                It's called when this item is hidden by its containing carousel, if any.
    * @public
    * @returns {void}
    */
    public onCollectionItemHidden(): void {
        // We don't need to do anything when this item is hidden.
    }

    /**
    * @name - onCollectionItemShown
    * @memberof - ImmersiveHeroItem
    * @description - This is our implementation of ICollectionItem.onCollectionItemShown()
    *                It's called when this item is shown by its containing carousel, if any.
    * @public
    * @returns {void}
    */
    public onCollectionItemShown(): void {
        // Our images are initialized with a height of zero so we need to resize them when they are shown.
        this.resizeImage();
    }
}
