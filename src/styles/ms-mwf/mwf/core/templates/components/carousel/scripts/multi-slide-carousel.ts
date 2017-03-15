/// <amd-module name="multi-slide-carousel"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {CarouselBase} from 'carousel-base';
import {ComponentFactory} from 'componentFactory';
import {ICollectionItem} from 'ICollectionItem';
import {IController, IControllerSubscriber, IControllerNotification} from 'IController';
import {SequenceIndicator} from 'sequenceIndicator';
import {ActionToggle, IActionToggleNotification, IActionToggleSubscriber} from 'actionToggle';
import {addClass,
        addEvent,
        eventTypes,
        hasClass,
        removeClasses,
        removeEvent,
        selectElements,
        selectFirstElement} from 'htmlExtensions';
import {getQSPValue} from 'utility';

/**
* @class - MultiSlideCarousel
* @classdesc - The MultiSlideCarousel class. This class is intended for carousel's containing multiple slides
*              where each slide will take up the entire width of the carousel.
* @extends {CarouselBase}
* @implements {IActionToggleSubscriber}
* @implements {IControllerSubscriber}
* @export
*/
export class MultiSlideCarousel extends CarouselBase implements IActionToggleSubscriber, IControllerSubscriber {
    /**
    * @name - selector
    * @memberof - MultiSlideCarousel
    * @description - The multi-slide carousel element selector.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static readonly selector = '.c-carousel[class*=f-multi-slide]';

    /**
    * @name - animateNextClass
    * @memberof - MultiSlideCarousel
    * @description - The slide animate-next class.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly animateNextClass = 'f-animate-next';

    /**
    * @name - animatePreviousClass
    * @memberof - MultiSlideCarousel
    * @description - The slide animate-previous class.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly animatePreviousClass = 'f-animate-previous';

    /**
    * @name - focusContentSelector
    * @memberof - MultiSlideCarousel
    * @description - The focusable content elements selector.
    *                We use this to find the focusable content elements that
    *                we want to suspend autoplay for when they have the focus.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly focusContentSelector = '.c-call-to-action';

    /**
    * @name - autoPlayClass
    * @memberof - MultiSlideCarousel
    * @description - The slide auto-play class.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly autoPlayClass = 'f-auto-play';

    /**
    * @name - autoPlayIntervalAttribute
    * @memberof - MultiSlideCarousel
    * @description - The auto-play interval attribute name.
    * @private
    * @static
    * @readonly
    * @type {string}
    */
    private static readonly autoPlayIntervalAttribute = 'data-js-interval';

    /**
    * @name - autoPlayDefaultInterval
    * @memberof - MultiSlideCarousel
    * @description - The auto-play default interval value.
    *                Default to 6 seconds to meet WCAG requirements
    * @private
    * @static
    * @readonly
    * @type {number}
    */
    private static readonly autoPlayDefaultInterval = 6000;

    /**
    * @name - autoPlayMinimumInterval
    * @memberof - MultiSlideCarousel
    * @description - The auto-play minimum interval value.
    *                WCAG requires animations to pause for 5 seconds or longer.
    * @private
    * @static
    * @readonly
    * @type {number}
    */
    private static readonly autoPlayMinimumInterval = 5000;

    /**
    * @name - isAutoPlayPaused
    * @memberof - MultiSlideCarousel
    * @description - The auto-play paused state.
    * @private
    * @type {boolean}
    */
    private isAutoPlayPaused: boolean = true;

    /**
    * @name - autoPlayTimer
    * @memberof - MultiSlideCarousel
    * @description - The auto-play timer.
    * @private
    * @type {number}
    */
    private autoPlayTimer = -1;

    /**
    * @name - autoPlayIntervalDuration
    * @memberof - MultiSlideCarousel
    * @description - The auto-play interval duration.
    * @private
    * @type {number}
    */
    private autoPlayIntervalDuration: number;

    /**
    * @name - autoPlayActionToggle
    * @memberof - MultiSlideCarousel
    * @description - The auto-play ActionToggle.
    * @private
    * @type {ActionToggle}
    */
    private autoPlayActionToggle: ActionToggle;

    /**
    * @name - hasContentFocus
    * @memberof - MultiSlideCarousel
    * @description - Indicates whether or not one of our focusable content elements has focus.
    * @private
    * @type {boolean}
    */
    private hasContentFocus = false;

    /**
    * @name - focusContentElements
    * @memberof - MultiSlideCarousel
    * @description - The focusable content elements collection.
    *                We use this to hold the focusable content elements that
    *                we want to suspend autoplay for when they have the focus.
    * @private
    * @type {HTMLElement[]}
    */
    private focusContentElements: HTMLElement[];

    /**
    * @name - sequenceIndicator
    * @memberof - MultiSlideCarousel
    * @description - The SequenceIndicator controller.
    *                This will be the default SequenceIndicator controller if MultiSlideCarousel's loadMultiSlideController()
    *                method is not overridden or is otherwise used.
    * @private
    * @type {IController}
    */
    private sequenceIndicator: IController;

    /**
    * @name - constructor
    * @memberof - MultiSlideCarousel
    * @description - Constructor for the MultiSlideCarousel class.
    * @param {HTMLElement} carouselElement - The native element to attach the MultiSlideCarousel behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected carouselElement: HTMLElement, params: any = null) {
        super(carouselElement, params);
    }

    /**
    * @name - update
    * @memberof - MultiSlideCarousel
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @override
    * @returns {boolean} - true if successful, otherwise false.
    */
    protected update(): boolean {
        if (!super.update()) {
            return false;
        }

        let actionToggleButton = selectFirstElement(ActionToggle.selector, this.carouselElement);

        if (!!actionToggleButton) {
            actionToggleButton.setAttribute('aria-hidden', (this.slides.length > 1) ? 'false' : 'true');

            ComponentFactory.create([{
                component: ActionToggle,
                elements: [ actionToggleButton ],
                callback: (results: ActionToggle[]): void => {
                    if (results.length > 0) {
                        this.autoPlayActionToggle = results[ 0 ];

                        // If we have an auto-play ActionToggle we need to subscribe to its notifications, add event listeners for pausing
                        // the auto-play behavior when the mouse is hovering over the carousel, and initiate autoplay if appropriate.
                        if (!!this.autoPlayActionToggle) {
                            // Subscribe to the ActionToggle notifications.
                            this.autoPlayActionToggle.subscribe(this);

                            addEvent(this.carouselElement, eventTypes.mouseover, this.suspendAutoPlay);
                            addEvent(this.carouselElement, eventTypes.mouseout, this.resumeAutoPlay);

                            this.focusContentElements = selectElements(MultiSlideCarousel.focusContentSelector, this.carouselElement);

                            if (this.focusContentElements) {
                                this.hasContentFocus = (this.focusContentElements.indexOf(document.activeElement as HTMLElement) !== -1);

                                addEvent(this.focusContentElements, eventTypes.focus, this.onContentFocus);
                                addEvent(this.focusContentElements, eventTypes.blur, this.onContentBlur);
                            }

                            // Set the duration of the delay between switching slides, default is 6 seconds
                            this.autoPlayIntervalDuration = Math.max(MultiSlideCarousel.autoPlayMinimumInterval,
                                parseInt(this.carouselElement.getAttribute(MultiSlideCarousel.autoPlayIntervalAttribute), 10) ||
                                MultiSlideCarousel.autoPlayDefaultInterval);

                            // Start on load if f-auto-play exists on carousel
                            // If we are running for visual diffing though, we shouldn't turn on the autoplay.
                            if (hasClass(this.carouselElement, MultiSlideCarousel.autoPlayClass) &&
                                (this.slides.length > 1) &&
                                this.autoPlayActionToggle.isToggled() &&
                                !this.hasContentFocus &&
                                (getQSPValue('mwfrun').toLowerCase() !== 'formwfvdiff')) {
                                this.startAutoPlay();
                            }
                        }
                    }
                },
                eventToBind: 'DOMContentLoaded',
            }]);
        }

        this.loadMultiSlideController();

        return true;
    }

    /**
    * @name - teardown
    * @memberof - MultiSlideCarousel
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @override
    * @returns {void}
    */
    protected teardown(): void {
        super.teardown();

        if (!!this.autoPlayActionToggle) {
            this.autoPlayActionToggle.unsubscribe(this);

            removeEvent(this.carouselElement, eventTypes.mouseover, this.suspendAutoPlay);
            removeEvent(this.carouselElement, eventTypes.mouseout, this.resumeAutoPlay);

            if (this.focusContentElements) {
                removeEvent(this.focusContentElements, eventTypes.focus, this.onContentFocus);
                removeEvent(this.focusContentElements, eventTypes.blur, this.onContentBlur);
            }

            // Clear timers, if any
            this.clearAutoPlayTimers();

            this.isAutoPlayPaused = true;
            this.autoPlayActionToggle = null;
        }

        this.hasContentFocus = false;

        if (!!this.sequenceIndicator) {
            this.sequenceIndicator.unsubscribe(this);
        }
    }

    /**
    * @name getSlides
    * @memberof - MultiSlideCarousel
    * @description - Get the individual slides in this multi-slide carousel.
    * @protected
    * @override
    * @returns {HTMLElement[]}
    */
    protected getSlides(): HTMLElement[] {
        return selectElements(CarouselBase.allChildSelectors, this.carouselElement);
    }

    /**
    * @name getFirstActiveIndex
    * @memberof - MultiSlideCarousel
    * @description - Gets the index of the first active slide.
    * @protected
    * @override
    * @returns {number}
    */
    protected getFirstActiveIndex(): number {
        for (let index = 0; index < this.slides.length; index++) {
            if (hasClass(this.slides[index], CarouselBase.activeClass)) {
                return index;
            }
        }

        return 0;
    }

    /**
    * @name - isScrollablePrevious
    * @memberof - MultiSlideCarousel
    * @description - Determines whether or not the carousel can "scroll previous".
    * @protected
    * @override
    * @returns {boolean}
    */
    protected isScrollablePrevious(): boolean {
        return !!this.slides && (this.slides.length > 1);
    }

    /**
    * @name - isScrollableNext
    * @memberof - MultiSlideCarousel
    * @description - Determines whether or not the carousel can "scroll next".
    * @protected
    * @override
    * @returns {boolean}
    */
    protected isScrollableNext(): boolean {
        return !!this.slides && (this.slides.length > 1);
    }

    /**
    * @name - previousSlide
    * @memberof - MultiSlideCarousel
    * @description - Go to previous slide.
    * @protected
    * @override
    * @returns {void}
    */
    protected previousSlide(): void {
        this.setActiveSlide(this.activeIndex === 0 ? this.slides.length - 1 : this.activeIndex - 1);
    }

    /**
    * @name - nextSlide
    * @memberof - MultiSlideCarousel
    * @description - Go to next slide.
    * @protected
    * @override
    * @returns {void}
    */
    protected nextSlide(): void {
        this.setActiveSlide(this.activeIndex === this.slides.length - 1 ? 0 : this.activeIndex + 1);
    }

    /**
    * @name - setActiveSlide
    * @memberof - MultiSlideCarousel
    * @description - Sets the active carousel slide.
    * @public
    * @param  {number} toIndex - The index of the slide to make active.
    * @param  {boolean} [userInitiated = true] - Whether or not this slide change is the result of a user initiated
    *                                            action like controller or paddle click or swipe, or not like autoplay.
    * @returns {boolean}
    */
    public setActiveSlide(toIndex: number, userInitiated: boolean = true): boolean {
        let previousActiveIndex = this.activeIndex;

        if (!super.setActiveSlide(toIndex, userInitiated)) {
            return;
        }

        if (previousActiveIndex !== -1) {
            // Remove active and animation classes from the currently active slide.
            removeClasses(
                this.slides[previousActiveIndex],
                [CarouselBase.activeClass,
                MultiSlideCarousel.animateNextClass,
                MultiSlideCarousel.animatePreviousClass]);

            // Add the animate class associated with our animation direction
            addClass(
                this.slides[this.activeIndex],
                previousActiveIndex < toIndex
                    ? MultiSlideCarousel.animateNextClass
                    : MultiSlideCarousel.animatePreviousClass);
        }

        // Call resumeAutoPlay to restart the auto-play timer if auto-play is active.
        this.resumeAutoPlay();

        // Update the SequenceIndicator's index to match the carousel's index
        if (this.sequenceIndicator) {
            this.sequenceIndicator.setControllerIndex(toIndex, false);
        }

        let previousItem = (previousActiveIndex === -1) ? null : super.getCollectionItem(this.slides[previousActiveIndex]);
        let currentItem = super.getCollectionItem(this.slides[this.activeIndex]);

        if (previousItem) {
            previousItem.onCollectionItemHidden();
        }

        if (currentItem) {
            currentItem.onCollectionItemShown();
        }

        super.initiatePublish({
            fullyVisibleItemRange: [ toIndex, toIndex ],
            partiallyVisibleItemRange: [toIndex, toIndex],
            userInitiated: userInitiated
        });
    }

    /**
    * @name onActionToggled
    * @memberof - MultiSlideCarousel
    * @description Handler for the auto-play ActionToggle's onActionToggled notifications.
    * @public
    * @param {IActionToggleNotification} notification - The notification from the action toggle component.
    * @returns {void}
    */
    public onActionToggled = (notification: IActionToggleNotification): void => {
        if (!!notification) {
            if (notification.toggled) {
                this.startAutoPlay();
            } else {
                this.pauseAutoPlay();
            }
        }
    }

    /**
    * @name - startAutoPlay
    * @memberof - MultiSlideCarousel
    * @description - Starts the carousel's auto-play behavior.
    * @private
    * @returns {void}
    */
    private startAutoPlay(): void {
        this.setAutoPlayInterval();
        this.isAutoPlayPaused = false;
    }

    /**
    * @name - pauseAutoPlay
    * @memberof - MultiSlideCarousel
    * @description - Pauses the carousel's auto-play behavior.
    * @private
    * @returns {void}
    */
    private pauseAutoPlay(): void {
        this.isAutoPlayPaused = true;
        this.clearAutoPlayTimers();
    }

    /**
    * @name - setAutoPlayInterval
    * @memberof - MultiSlideCarousel
    * @description - Sets a timer callback for playing the next slide.
    * @private
    * @returns void
    */
    private setAutoPlayInterval(): void {
        this.clearAutoPlayTimers();
        this.autoPlayTimer =
            setTimeout(() => {
                this.setActiveSlide(this.activeIndex === this.slides.length - 1 ? 0 : this.activeIndex + 1, false);
            }, this.autoPlayIntervalDuration);
    }

    /**
    * @name clearAutoPlayTimers
    * @memberof - MultiSlideCarousel
    * @description Helper function for clearing timers
    * @private
    * @returns {void}
    */
    private clearAutoPlayTimers(): void {
        if (this.autoPlayTimer !== -1) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = -1;
        }
    }

    /**
    * @name loadMultiSlideController
    * @memberof - MultiSlideCarousel
    * @description - Loads the MultiSlideCarousel's controller.
    *                By default this will look for the standard MultiSlideCarousel's SequenceIndicator.
    *                Other implementations may override this method to load an alternate controller of their choice.
    * @protected
    * @returns {void}
    */
    protected loadMultiSlideController(): void {
        let sequenceIndicator = selectFirstElement(SequenceIndicator.selector, this.carouselElement);

        if (!!sequenceIndicator) {
            ComponentFactory.create([{
                component: SequenceIndicator,
                elements: [sequenceIndicator],
                callback: (results: IController[]): void => {
                    if (results && results.length) {
                        this.sequenceIndicator = results[0];

                        // Subscribe to the sequenceIndicator.
                        if (!!this.sequenceIndicator) {
                            sequenceIndicator.setAttribute('aria-hidden', (this.slides.length > 1) ? 'false' : 'true');
                            this.sequenceIndicator.subscribe(this);
                        }
                    }
                },
                eventToBind: 'DOMContentLoaded'
            }]);
        }
    }

    /**
    * @name - onControllerIndexChanged
    * @memberof - MultiSlideCarousel
    * @description - Implements IControllerSubscriber's onControllerIndexChanged method.
    * @public
    * @param  {IControllerNotification} notification - The controller notification with the desired new index.
    * @returns {void}
    */
    public onControllerIndexChanged(notification: IControllerNotification): void {
        if (!!notification) {
            this.setActiveSlide(notification.currentIndex);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Event handers section.
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
    * @name suspendAutoPlay
    * @memberof - MultiSlideCarousel
    * @description Suspends the auto-play behavior (on mouseover) temporarily wihtout pausing it.
    *              This is different than pausing it with the auto-play ActionToggle.
    * @private
    * @returns {void}
    */
    private suspendAutoPlay = (): void => {
        this.clearAutoPlayTimers();
    }

    /**
    * @name resumeAutoPlay
    * @memberof - MultiSlideCarousel
    * @description Resumes the auto-play behavior (on mouseout) if isAutoPlayPaused is false.
    * @private
    * @returns {void}
    */
    private resumeAutoPlay = (): void => {
        if (!this.isAutoPlayPaused) {
            this.setAutoPlayInterval();
        }
    }

    /**
    * @name onContentFocus
    * @memberof - MultiSlideCarousel
    * @description - Called when any of the focusable content items gets focus.
    *                We use this to suspend autoPlay when any content item has focus.
    * @returns {void}
    */
    private onContentFocus = (): void => {
        this.hasContentFocus = true;
        this.suspendAutoPlay();
    }

    /**
    * @name onContentBlur
    * @memberof - MultiSlideCarousel
    * @description - Called when any of the focusable content items loses focus.
    *                We use this to resume autoPlay when any content item loses focus.
    * @returns {void}
    */
    private onContentBlur = (): void => {
        this.hasContentFocus = false;
        this.resumeAutoPlay();
    }
}