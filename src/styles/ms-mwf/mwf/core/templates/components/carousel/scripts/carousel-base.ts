/// <amd-module name="carousel-base"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {ICollectionItem} from 'ICollectionItem';
import {Publisher, ISubscriber} from 'publisher';
import {Swipe, SwipeDirection} from 'swipe';
import {isNullOrWhiteSpace} from 'stringExtensions';
import {addClass,
        addEvent,
        css,
        Direction,
        eventTypes,
        getDirection,
        getEventTargetOrSrcElement,
        removeClass,
        removeClasses,
        removeEvent,
        SafeBrowserApis,
        selectFirstElement} from 'htmlExtensions';

/**
* @interface ICarouselNotification
* @classdesc - The data contract interface used for carousel notifications.
* @export
*/
export interface ICarouselNotification {
    /**
    * @name - fullyVisibleItemRange
    * @memberof - ICarouselNotification
    * @description - This is the range of items that are fully visible horizontally within the carousel.
    *                There will be two numbers in this array. [0] will be the starting index and [1] will be the ending index.
    *                For multislide carousels the start and end values will be the same.
    * @public
    * @type {number[]}
    */
    fullyVisibleItemRange: number[];

    /**
    * @name - partiallyVisibleItemRange
    * @memberof - ICarouselNotification
    * @description - This is the range of items that are partially visible horizontally within the carousel.
    *                There will be two numbers in this array. [0] will be the starting index and [1] will be the ending index.
    *                For multislide carousels the start and end values will be the same.
    *                For singleslide carousels the start and end values may be the same as the start and end
    *                values of the fullyVisibleItemRange or there may be one more partially visible item
    *                on either or both ends of the range.
    * @public
    * @type {number[]}
    */
    partiallyVisibleItemRange: number[];

    /**
    * @name - userInitiated
    * @memberof - ICarouselNotification
    * @description - Indicates whether or not this notification was user initiated (eg. flipper click) or not (eg. autoPlay).
    * @public
    * @type {boolean}
    */
    userInitiated?: boolean;
}

/**
* @interface ICarouselSubscriber
* @classdesc - The interface which carousel notification subscribers must implement.
* @export
* @extends {ISubscriber}
*/
export interface ICarouselSubscriber extends ISubscriber {
    /**
    * @name - onSlideRangeChanged
    * @memberof - ICarouselSubscriber
    * @description - This is the slide range changed notification method.
    * @public
    * @returns {void}
    */
    onSlideRangeChanged(notification: ICarouselNotification): void;
}

/**
* @class - CarouselBase
* @classdesc - The abstract CarouselBase class
* @extends {Publisher<ICarouselSubscriber>}
* @export
*/
export abstract class CarouselBase extends Publisher<ICarouselSubscriber> {
    /**
    * @name - selector
    * @memberof - CarouselBase
    * @description - The carousel element selector.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static readonly selector = '.c-carousel';

    /**
    * @name - activeClass
    * @memberof - CarouselBase
    * @description - the active class.
    * @protected
    * @static
    * @readonly
    * @type {string}
    */
    protected static readonly activeClass = 'f-active';

    /**
    * @name - allChildSelectors
    * @memberof - CarouselBase
    * @description - The carousel slide elements selector.
    * @protected
    * @static
    * @readonly
    * @type {string}
    */
    protected static readonly allChildSelectors = CarouselBase.selector + ' > * > ul > li';

    /**
    * @name - slideThemeAttribute
    * @memberof - CarouselBase
    * @description - the slide theme attribute.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly slideThemeAttribute = 'data-f-theme';

    /**
    * @name - themePrefix
    * @memberof - CarouselBase
    * @description - the prefix for the set theme.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly themePrefix = 'theme-';

    /**
    * @name - previousFlipperClass
    * @memberof - CarouselBase
    * @description - the previous flipper class.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly previousFlipperClass = 'f-scrollable-previous';

    /**
    * @name - nextFlipperClass
    * @memberof - CarouselBase
    * @description - the next flipper class.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly nextFlipperClass = 'f-scrollable-next';

    /**
    * @name - themeLightClass
    * @memberof - CarouselBase
    * @description - the theme light class.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly themeLightClass = 'theme-light';

    /**
    * @name - themeDarkClass
    * @memberof - CarouselBase
    * @description - the theme dark class.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly themeDarkClass = 'theme-dark';

    /**
    * @name - previousButtonSelector
    * @memberof - CarouselBase
    * @description - the previous button class, f-left is deprecated.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly previousButtonSelector = '.c-flipper.f-previous, .c-flipper.f-left';

    /**
    * @name - nextButtonSelector
    * @memberof - CarouselBase
    * @description - the next button class, f-right is deprecated.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly nextButtonSelector = '.c-flipper.f-next, .c-flipper.f-right';

    /**
    * @name - activeIndex
    * @memberof - CarouselBase
    * @description - stores the active index.
    * @protected
    * @type {number}
    */
    protected activeIndex = -1;

    /**
    * @name - slides
    * @memberof - CarouselBase
    * @description - stores the carousel slides.
    * @protected
    * @type {HTMLElement[]}
    */
    protected slides: HTMLElement[];

    /**
    * @name - direction
    * @memberof - CarouselBase
    * @description - direction.
    * @protected
    * @type {HtmlExtensions.Direction}
    */
    protected direction: Direction;

    /**
    * @name - directionValue
    * @memberof - CarouselBase
    * @description - stored direction.
    * @protected
    * @type {string}
    */
    protected directionValue: string;

    /**
    * @name - previousButton
    * @memberof - CarouselBase
    * @description - previous button.
    * @private
    * @type {HTMLElement}
    */
    private previousButton: HTMLElement;

    /**
    * @name - nextButton
    * @memberof - CarouselBase
    * @description - next button.
    * @private
    * @type {HTMLElement}
    */
    private nextButton: HTMLElement;

    /**
    * @name - swipe
    * @memberof - CarouselBase
    * @description - swipe class.
    * @private
    * @type {Swipe}
    */
    private swipe: Swipe;

    /**
    * @name - requestAnimationFrame
    * @memberof - CarouselBase
    * @description - function for requesting the animation frame.
    * @private
    * @type {Function}
    */
    private requestAnimationFrame: Function;

    /**
    * @name - constructor
    * @memberof - CarouselBase
    * @description - Constructor for the CarouselBase abstract class.
    * @param {HTMLElement} carouselElement - The native element to attach the CarouselBase behavior to.
    * @param {any} params- The parameter object with the class name to match against the MWF class
    *                      attribute value to determine whether or not to initialize this element
    *                      in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected carouselElement: HTMLElement, params: any) {
        super(carouselElement, params);

        if (!ObservableComponent.shouldInitializeAsClass(carouselElement, params)) {
            return;
        }

        this.direction = getDirection();
        this.directionValue = Direction[this.direction];
        this.requestAnimationFrame = SafeBrowserApis.requestAnimationFrame;

        // If pointer event supported, add the required css.
        // IE11 and Edge implements pointerEvents and favor the browser default behavior if touchAction is not set to none.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
        // http://www.michaelbromley.co.uk/blog/193/a-note-on-touch-pointer-events-in-ie11
        if (window.navigator.pointerEnabled) {
            css(this.carouselElement, 'touchAction', 'pan-y');
        }

        this.requestAnimationFrame.call(window, () => this.update());
    }

    /**
    * @name - update
    * @memberof - CarouselBase
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @returns {boolean} - true if successful, otherwise false.
    */
    protected update(): boolean {
        if (!this.carouselElement || !this.hasSlides()) {
            return false;
        }

        this.requestAnimationFrame.call(window, () => this.setActiveSlide(this.getFirstActiveIndex(), false));

        // Get previous and next buttons
        this.previousButton = selectFirstElement(CarouselBase.previousButtonSelector, this.carouselElement);
        this.nextButton = selectFirstElement(CarouselBase.nextButtonSelector, this.carouselElement);

        // Add previous and next button click handlers
        if (!!this.previousButton && !!this.nextButton) {
            addEvent(this.previousButton, eventTypes.click, this.onFlipperClicked);
            addEvent(this.nextButton, eventTypes.click, this.onFlipperClicked);
        }

        // Instantiate a swipe object for swipe support.
        this.swipe = new Swipe(this.carouselElement, { 'end': this.swipeHandler });

        return true;
    }

    /**
    * @name - teardown
    * @memberof - CarouselBase
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @returns {void}
    */
    protected teardown(): void {
        // Clean up previous and next button handlers.
        if (!!this.previousButton && !!this.nextButton) {
            removeEvent(this.previousButton, eventTypes.click, this.onFlipperClicked);
            removeEvent(this.nextButton, eventTypes.click, this.onFlipperClicked);
        }

        // Clean up swipe handler.
        if (this.swipe) {
            this.swipe.tearDown();
        }

        // Reset members.
        this.activeIndex = -1;
        this.slides = null;
        this.previousButton = null;
        this.nextButton = null;
    }

    /**
    * @name hasSlides
    * @memberof - CarouselBase
    * @description - Determines if this carousel has any slides.
    * @private
    * @returns {boolean} - true if this carousel has any slides, otherwise false.
    */
    private hasSlides(): boolean {
        this.slides = this.getSlides();

        // make sure we actually have slides.
        return !!this.slides && !!this.slides.length;
    }

    /**
    * @name getSlides
    * @memberof - CarouselBase
    * @description - Get the individual slides in this carousel.
    * @protected
    * @abstract
    * @returns {HTMLElement[]}
    */
    protected abstract getSlides(): HTMLElement[];

    /**
    * @name getCollectionItem
    * @memberof - CarouselBase
    * @description - Get the collection item for the specified slide.
    * @protected
    * @param  {HTMLElement} slide - The slide to get the collection item of.
    * @returns {ICollectionItem} - The mwfInstance that implements ICollectionItem if found, otherwise null.
    */
    protected getCollectionItem(slide: HTMLElement): ICollectionItem {
        let collectionItem: ICollectionItem;

        if (!!slide && !!slide.firstElementChild) {
            ComponentFactory.enumerateComponents(slide.firstElementChild as HTMLElement, (typeName: string, component: any): boolean => {
                if (component.onCollectionItemHidden && component.onCollectionItemShown) {
                    collectionItem = component as ICollectionItem;
                }

                return !collectionItem;
            });
        }

        return collectionItem;
    }

    /**
    * @name getFirstActiveIndex
    * @memberof - CarouselBase
    * @description - Gets the index of the first active slide.
    * @protected
    * @abstract
    * @returns {number}
    */
    protected abstract getFirstActiveIndex(): number;

    /**
    * @name - isScrollablePrevious
    * @memberof - CarouselBase
    * @description - Determines whether or not the carousel can "scroll previous".
    * @protected
    * @abstract
    * @returns {boolean}
    */
    protected abstract isScrollablePrevious(): boolean;

    /**
    * @name - isScrollableNext
    * @memberof - CarouselBase
    * @description - Determines whether or not the carousel can "scroll next".
    * @protected
    * @abstract
    * @returns {boolean}
    */
    protected abstract isScrollableNext(): boolean;

    /**
    * @name - previousSlide
    * @memberof - CarouselBase
    * @description - Go to previous slide.
    * @protected
    * @abstract
    * @returns {void}
    */
    protected abstract previousSlide(): void;

    /**
    * @name - nextSlide
    * @memberof - CarouselBase
    * @description - Go to next slide.
    * @protected
    * @abstract
    * @returns {void}
    */
    protected abstract nextSlide(): void;

    /**
    * @name - setActiveSlide
    * @memberof - CarouselBase
    * @description - Sets the active carousel slide.
    * @protected
    * @param  {number} toIndex - The index of the slide to make active.
    * @param  {boolean} [userInitiated = true] - Whether or not this slide change is the result of a user initiated
    *                                            action like controller or paddle click or swipe, or not like autoplay.
    * @returns {boolean}
    */
    protected setActiveSlide(toIndex: number, userInitiated: boolean = true): boolean {
        if ((toIndex < 0) || (toIndex >= this.slides.length) || (toIndex === this.activeIndex)) {
            return false;
        }

        if ((this.activeIndex >= 0) && (this.activeIndex < this.slides.length)) {
            // Remove the active class from the currently active slide.
            removeClass(this.slides[this.activeIndex], CarouselBase.activeClass);
        }

        // Update the active index.
        this.activeIndex = toIndex;

        // Add the active class to the new active slide.
        addClass(this.slides[toIndex], CarouselBase.activeClass);

        // Update the carousel theme and flipper visibility.
        this.updateTheme();
        this.updateFlippers();

        return true;
    }

    /**
    * @name updateTheme
    * @memberof - CarouselBase
    * @description - Updates the carousel's theme to match the theme of the active slide.
    * @private
    * @returns {void}
    */
    private updateTheme(): void {
        // First remove any existing theme classes from the carousel.
        removeClasses(this.carouselElement, [CarouselBase.themeDarkClass, CarouselBase.themeLightClass]);

        let theme = this.slides[this.activeIndex].getAttribute(CarouselBase.slideThemeAttribute);

        // Then if the active slide has a theme add that to the carousel.
        if (!isNullOrWhiteSpace(theme)) {
            addClass(this.carouselElement, CarouselBase.themePrefix + theme);
        }
    }

    /**
    * @name - updateFlippers
    * @memberof - CarouselBase
    * @description - Updates the visibility state of the flippers.
    * @protected
    * @returns {void}
    */
    protected updateFlippers(): void {
        if (this.isScrollableNext()) {
            addClass(this.carouselElement, CarouselBase.nextFlipperClass);
        } else {
            removeClass(this.carouselElement, CarouselBase.nextFlipperClass);
        }

        if (this.isScrollablePrevious()) {
            addClass(this.carouselElement, CarouselBase.previousFlipperClass);
        } else {
            removeClass(this.carouselElement, CarouselBase.previousFlipperClass);
        }
    }

    /**
    * @name - publish
    * @memberof - CarouselBase
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @override
    * @param {ICarouselSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: ICarouselSubscriber, context?: any): void {
        subscriber.onSlideRangeChanged(context as ICarouselNotification);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////
    // // Event handers section.
    // ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
    * @name - onFlipperClicked
    * @description - The flipper click event listener
    * @private
    * @param {UIEvent} event - The click event.
    * @returns {void}
    */
    private onFlipperClicked = (event: UIEvent): void => {
        getEventTargetOrSrcElement(event) === this.previousButton
            ? this.previousSlide()
            : this.nextSlide();
    }

    /**
    * @name swipeHandler
    * @memberof - CarouselBase
    * @description - The carousel swipe handler.
    * @private
    * @param {SwipeDirection} swipeDirection - The direction of the swipe.
    * @returns {void}
    */
    private swipeHandler = (swipeDirection: SwipeDirection): void => {
        let next = (swipeDirection === SwipeDirection.Right) ? (this.direction === Direction.left) : (this.direction !== Direction.left);

        if (next && this.isScrollableNext()) {
            this.nextSlide();
        } else if (!next && this.isScrollablePrevious()) {
            this.previousSlide();
        }
    }
}