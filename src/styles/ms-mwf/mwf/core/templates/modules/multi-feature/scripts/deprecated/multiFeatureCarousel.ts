/// <amd-module name="multiFeatureCarousel"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
// TODO: 8865684 - Consolidate with carousel as a carousel base abstract class

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {Swipe} from 'swipe';
import {SwipeDirection} from 'swipe';
import {isNullOrWhiteSpace} from 'stringExtensions';
import * as HtmlExtensions from 'htmlExtensions';
import {apiDeprecated, getDimensions, isNumber} from 'utility';

/**
 * Navigation order.
 */
export const enum Order {
    None,
    Previous,
    Next
}

/**
 * @name - Direction
 * @description - Either "previous" or "next" for carousel slide navigation
 * @enum {number}
 */
export const enum Direction {
    Next,
    Previous
}

/**
 * @class - MultiFeatureCarousel
 * @classdesc - The MultiFeatureCarousel shared behavior
 * @export
 */
export abstract class MultiFeatureCarousel extends ObservableComponent {

    /**
     * @name - selector
     * @description - selector for Carousel component.
     * @static
     * @public
     * @type {string}
     */
    public static selector = '.c-carousel';

    /**
     * @name - multiSelectClass
     * @description - the multi select class.
     * @static
     * @private
     * @type {string}
     */
    private static multiSelectClass = 'f-multi-slide';

    /**
     * @name - slideThemeAttribute
     * @description - the slide theme attribute.
     * @static
     * @private
     * @type {string}
     */
    private static slideThemeAttribute = 'data-f-theme';

    /**
     * @name - themePrefix
     * @description - the prefix for the set theme.
     * @static
     * @private
     * @type {string}
     */
    private static themePrefix = 'theme-';

    /**
     * @name - allChildSelectors
     * @description - the list item child selector.
     * @static
     * @private
     * @type {string}
     */
    private static allChildSelectors = 'li > *';

    /**
     * @name - singleSlideSelector
     * @description - the single slide selector.
     * @static
     * @private
     * @type {string}
     */
    private static singleSlideSelector = 'ul';

    /**
     * @name - multiSlideSelector
     * @description - the multi slide list item.
     * @static
     * @private
     * @type {string}
     */
    private static multiSlideSelector = 'ul > li';

    /**
     * @name - focusItemSelector
     * @description - the section links for focus item.
     * @static
     * @private
     * @type {string}
     */
    private static focusItemSelector = 'ul > li > section a';

    /**
     * @name - previousFlipperClass
     * @description - the previous flipper class.
     * @static
     * @private
     * @type {string}
     */
    private static previousFlipperClass = 'f-scrollable-previous';

    /**
     * @name - nextFlipperClass
     * @description - the next flipper class.
     * @static
     * @private
     * @type {string}
     */
    private static nextFlipperClass = 'f-scrollable-next';

    /**
     * @name - animateNextClass
     * @description - the slide animate next class.
     * @static
     * @private
     * @type {string}
     */
    private static animateNextClass = 'f-animate-next';

    /**
     * @name - animatePreviousClass
     * @description - the slide animate previous class.
     * @static
     * @private
     * @type {string}
     */
    private static animatePreviousClass = 'f-animate-previous';

    /**
     * @name - themeLightClass
     * @description - the theme light class.
     * @static
     * @private
     * @type {string}
     */
    private static themeLightClass = 'theme-light';

    /**
     * @name - themeDarkClass
     * @description - the theme dark class.
     * @static
     * @private
     * @type {string}
     */
    private static themeDarkClass = 'theme-dark';

    /**
     * @name - activeClass
     * @description - the active class.
     * @static
     * @private
     * @type {string}
     */
    private static activeClass = 'f-active';

    /**
     * @name - sequenceIndicatorClass
     * @description - the sequence indicator class.
     * @static
     * @private
     * @type {string}
     */
    private static sequenceIndicatorClass = 'c-sequence-indicator';

    /**
     * @name - previousButtonSelector
     * @description - the previous button class, f-left is deprecated.
     * @static
     * @private
     * @type {string}
     */
    private static previousButtonSelector = '.c-flipper.f-previous, .c-flipper.f-left';

    /**
     * @name - nextButtonSelector
     * @description - the next button class, f-right is deprecated.
     * @static
     * @private
     * @type {string}
     */
    private static nextButtonSelector = '.c-flipper.f-next, .c-flipper.f-right';

    /**
     * @name - sequenceIndicatorSelector
     * @description - the sequence indicator button selector.
     * @static
     * @private
     * @type {string}
     */
    private static sequenceIndicatorSelector = '.c-sequence-indicator button';

    /**
     * @name - ariaCheckedAttribute
     * @description - the aria-checked attribute.
     * @static
     * @private
     * @type {string}
     */
    private static ariaCheckedAttribute = 'aria-checked';

    /**
     * @name - ariaControlsAttribute
     * @description - the aria-controls attribute.
     * @static
     * @private
     * @type {string}
     */
    private static ariaControlsAttribute = 'aria-controls';

    /**
     * @name - isMultiSlide
     * @description - used to determine if there are multiple slides in the carousel.
     * @private
     * @type {boolean}
     */
    private isMultiSlide: boolean;

    /**
     * @name - activeIndex
     * @description - stores the active index.
     * @private
     * @type {number}
     */
    private activeIndex: number;

    /**
     * @name - slides
     * @description - stores the carousel slides.
     * @private
     * @type {HTMLElement[]}
     */
    private slides: HTMLElement[];

    /**
     * @name - sequenceIndicators
     * @description - sequence indicator items.
     * @private
     * @type {HTMLElement[]}
     */
    private sequenceIndicators: HTMLElement[];

    /**
     * @name - singleSlideWidth
     * @description - width of a single slide.
     * @private
     * @type {number}
     */
    private singleSlideWidth: number;

    /**
     * @name - direction
     * @description - direction.
     * @private
     * @type {HtmlExtensions.Direction}
     */
    private direction: HtmlExtensions.Direction;

    /**
     * @name - directionValue
     * @description - stored direction.
     * @private
     * @type {string}
     */
    private directionValue: string;

    /**
     * @name - carouselElement
     * @description - carousel element.
     * @private
     * @type {HTMLElement}
     */
    private carouselElement: HTMLElement;

    /**
     * @name - previousButton
     * @description - previous button.
     * @private
     * @type {HTMLElement}
     */
    private previousButton: HTMLElement;

    /**
     * @name - nextButton
     * @description - next button.
     * @private
     * @type {HTMLElement}
     */
    private nextButton: HTMLElement;

    /**
     * @name - swipe
     * @description - swipe class.
     * @private
     * @type {Swipe}
     */
    private swipe: Swipe;

    /**
     * @name - focusThrottledEventHandler
     * @description - focus throttled event.
     * @private
     * @type {EventListener}
     */
    private focusThrottledEventHandler: EventListener;

    /**
     * @name - resizeThrottledEventHandler
     * @description - resize throttled event.
     * @private
     * @type {EventListener}
     */
    private resizeThrottledEventHandler: EventListener;

    /**
     * @name - requestAnimationFrame
     * @description - function for requesting the animation frame.
     * @private
     * @type {Function}
     */
    private requestAnimationFrame: Function;

    /**
     * Constructor of a Carousel component.
     * @class Carousel
     * @classdesc Constructor of a Carousel component.
     * @param {HTMLElement} element - an Element set that contains elements that needed to have carousel behavior.
    */
    constructor(element: HTMLElement) {
        super(element);

        this.carouselElement = HtmlExtensions.selectFirstElement(MultiFeatureCarousel.selector, element);

        if (!this.carouselElement) {
            return;
        }

        this.isMultiSlide = HtmlExtensions.hasClass(this.carouselElement, MultiFeatureCarousel.multiSelectClass);
        this.direction = HtmlExtensions.getDirection();
        this.directionValue = HtmlExtensions.Direction[this.direction];
        this.requestAnimationFrame = HtmlExtensions.SafeBrowserApis.requestAnimationFrame;

        // If pointer event supported, add the required css.
        // IE11 and Edge implements pointerEvents and favor the browser default behavior if touchAction is not set to none.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
        // http://www.michaelbromley.co.uk/blog/193/a-note-on-touch-pointer-events-in-ie11
        if (window.navigator.pointerEnabled) {
            HtmlExtensions.css(this.carouselElement, 'touchAction', 'pan-y');
        }

        this.requestAnimationFrame.call(window, () => this.update());
    }

    /**
     * @name - update
     * @description - Updates the component if there is any change to its underlying DOM.
     * @protected
     * @returns {void}
     */
    protected update(): void {

        this.slides = this.getSlides();

        if (!this.slides || !this.slides.length) {
            return;
        }

        // If multi-slide we need to get the sequence indicators, otherwise we need to get the single slide width
        if (this.isMultiSlide) {
            this.sequenceIndicators
                = HtmlExtensions.selectElements(MultiFeatureCarousel.sequenceIndicatorSelector, this.carouselElement);
        } else {
            // if single slides dont' have content return because it will
            // skew calculation since the width is set to zero since it's blank.
            if (!HtmlExtensions.selectFirstElement('li', this.slides[0])) {
                return;
            }
            this.singleSlideWidth = getDimensions(this.slides[0]).width;

            // In single slide mode we also need to add a resize handler in order to update flipper visibility.
            this.resizeThrottledEventHandler = HtmlExtensions.addThrottledEvent(window,
                HtmlExtensions.eventTypes.resize,
                this.onResized);

            // In single slide mode we also need to add a focus handler in order to position items and update flipper visibility.
            for (let item of HtmlExtensions.selectElements(MultiFeatureCarousel.focusItemSelector, this.carouselElement)) {
                this.focusThrottledEventHandler = HtmlExtensions.addThrottledEvent(item,
                    HtmlExtensions.eventTypes.focus,
                    this.onItemFocus);
            }
        }

        this.requestAnimationFrame.call(window, () => this.setActiveSlide(this.getActiveIndex()));

        // Get previous and next buttons
        this.previousButton = HtmlExtensions.selectFirstElement(MultiFeatureCarousel.previousButtonSelector, this.carouselElement);
        this.nextButton = HtmlExtensions.selectFirstElement(MultiFeatureCarousel.nextButtonSelector, this.carouselElement);

        // Instantiate a swipe object for swipe support of a MultiFeatureCarousel.
        this.swipe = new Swipe(this.carouselElement, {
            'end': this.swipeHandler
        });

        // If neccesary attach the sequence indicator click handlers.
        if (this.sequenceIndicators) {
            for (var sequenceIndicator of this.sequenceIndicators) {
                HtmlExtensions.addEvent(sequenceIndicator, HtmlExtensions.eventTypes.click, this.onSequenceClicked);
            }
        }
    }

    /**
     * @name getSlides
     * @description - get individual slides in a carousel container.
     * @private
     * @returns {HTMLElement[]}
     */
    private getSlides(): HTMLElement[] {
        let slides = HtmlExtensions.selectElements(
            this.isMultiSlide ? MultiFeatureCarousel.multiSlideSelector : MultiFeatureCarousel.singleSlideSelector,
            this.carouselElement);

        // make sure we actually have slides.
        if (this.isMultiSlide && slides && slides.length > 0 || HtmlExtensions.selectFirstElement('li', slides[0])) {
            return slides;
        }

        return null;
    }

    /**
     * @name swipeHandler
     * @description - a swipe handler.
     * @param {SwipeDirection} swipeDirection - the direction of the swipe.
     * @private
     */
    private swipeHandler = (swipeDirection: SwipeDirection) => {
        if (swipeDirection === SwipeDirection.Right) {
            (this.direction === HtmlExtensions.Direction.left) ? this.nextSlide() : this.previousSlide();
        } else {
            (this.direction === HtmlExtensions.Direction.left) ? this.previousSlide() : this.nextSlide();
        }
    }

    /**
     * @name getActiveIndex
     * @description - get an active slide index.
     * @protected
     * @returns {number}
     */
    protected getActiveIndex(): number {
        if (this.isMultiSlide) {
            for (let index = 0, indexSize = this.slides.length; index < indexSize; index++) {
                if (HtmlExtensions.hasClass(this.slides[index], MultiFeatureCarousel.activeClass)) {
                    return index;
                }
            }
        }

        return 0;
    }

    /**
     * @name updateTheme
     * @description - update the carousel's theme to match the theme of the active slide.
     * @param {number}
     * @private
     * @returns {void}
     */
    private updateTheme(): void {
        // First remove any existing theme classes from the MultiFeatureCarousel.
        HtmlExtensions.removeClasses(this.carouselElement, [MultiFeatureCarousel.themeDarkClass, MultiFeatureCarousel.themeLightClass]);

        let theme = this.slides[this.activeIndex].getAttribute(MultiFeatureCarousel.slideThemeAttribute);

        if (!isNullOrWhiteSpace(theme)) {
            HtmlExtensions.addClass(this.carouselElement, MultiFeatureCarousel.themePrefix + theme);
        }
    }

    /**
     * @name - updateFlippers
     * @description - updates the flippers for hide/show.
     * @private
     * @returns {void}
     */
    private updateFlippers(): void {
        if (this.isScrollableNext()) {
            HtmlExtensions.addClass(this.carouselElement, MultiFeatureCarousel.nextFlipperClass);
        } else {
            HtmlExtensions.removeClass(this.carouselElement, MultiFeatureCarousel.nextFlipperClass);
        }

        if (this.isScrollablePrevious()) {
            HtmlExtensions.addClass(this.carouselElement, MultiFeatureCarousel.previousFlipperClass);
        } else {
            HtmlExtensions.removeClass(this.carouselElement, MultiFeatureCarousel.previousFlipperClass);
        }
    }

    /**
     * @name - updateSequenceIndicators
     * @description - updates the sequence indicators for active indicator.
     * @private
     * @param  {number} toIndex - The index of the indicator to make active.
     * @returns {void}
     */
    private updateSequenceIndicators(toIndex: number): void {
        if (this.sequenceIndicators && (toIndex >= 0) && (toIndex < this.sequenceIndicators.length)) {
            let activeIndex = this.activeIndex || 0;

            if ((activeIndex >= 0) && (activeIndex < this.sequenceIndicators.length)) {
                this.sequenceIndicators[activeIndex].setAttribute(MultiFeatureCarousel.ariaCheckedAttribute, 'false');
            }

            this.sequenceIndicators[toIndex].setAttribute(MultiFeatureCarousel.ariaCheckedAttribute, 'true');
        }
    }

    /**
     * @name - isScrollablePrevious
     * @description - checking either the slide is scrollable to previous or not.
     * @private
     * @returns {boolean}
     */
    private isScrollablePrevious() : boolean {
        if (this.isMultiSlide) {
            return true;
        } else {
            let offset = parseInt(HtmlExtensions.css(this.slides[this.activeIndex], this.directionValue), 10);

            if (isNaN(offset) || (offset === 0)) {
                return false;
            }

            return true;
        }
    }

    /**
     * @name - isScrollableNext
     * @description - checking either the slide is scrollable to next or not.
     * @private
     * @returns {boolean}
     */
    private isScrollableNext() : boolean {
        if (this.isMultiSlide) {
            return true;
        } else {
            let offset = parseInt(HtmlExtensions.css(this.slides[this.activeIndex], this.directionValue), 10);
            let carouselWidth = getDimensions(this.carouselElement).width;
            let currentItemScrollWindow = this.getCurrentSlideSize();

            if (!isNumber(offset)) {
                offset = 0;
            }

            if ((carouselWidth + Math.abs(offset) + currentItemScrollWindow.gutter) >= this.singleSlideWidth) {
                return false;
            }

            return true;
        }
    }

    /**
     * @name - setActiveSlide
     * @description - set the active carousel slide.
     * @protected
     * @param  {number} toIndex - The index of the slide to make active.
     * @param  {Order=Order.None} order - The order of the to slide.
     * @returns {void}
     */
    protected setActiveSlide(toIndex: number, order: Order = Order.None): void {
        if ((toIndex < 0) || (toIndex >= this.slides.length)) {
            return;
        }

        // remove classes from the current active slide.
        HtmlExtensions.removeClasses(this.slides[this.activeIndex],
            [MultiFeatureCarousel.activeClass,
                MultiFeatureCarousel.animateNextClass,
                MultiFeatureCarousel.animatePreviousClass]);

        // Update the sequence indicator (must be done before activeIndex is updated).
        this.updateSequenceIndicators(toIndex);

        // update the active index.
        this.activeIndex = toIndex;

        // add classes to the new active slide.
        HtmlExtensions.addClass(this.slides[this.activeIndex], MultiFeatureCarousel.activeClass);

        // Update the carousel theme and flipper visibility.
        this.updateTheme();
        this.updateFlippers();

        if (order !== Order.None) {
            // Add the animate class associated with our order
            HtmlExtensions.addClass(
                this.slides[this.activeIndex],
                order === Order.Next ? MultiFeatureCarousel.animateNextClass : MultiFeatureCarousel.animatePreviousClass);
        }
    }

    /**
     * @name - previousMultiSlide
     * @description - go to previous slide.
     * @private
     * @returns {void}
     */
    private previousMultiSlide(): void {
        this.setActiveSlide(this.activeIndex === 0 ? this.slides.length - 1 : this.activeIndex - 1, Order.Previous);
    }

    /**
     * @name - nextMultiSlide
     * @description - go to next slide.
     * @private
     * @returns {void}
     */
    private nextMultiSlide(): void {
        this.setActiveSlide(this.activeIndex === this.slides.length - 1 ? 0 : this.activeIndex + 1, Order.Next);
    }

    /**
     * @name - changeSingleSlide
     * @description - Scrolls previous or next in case of a single slide.
     * @param {Direction} direction - the direction, either 'next' or 'previous'
     * @private
     */
    private changeSingleSlide(direction: Direction): void {
        let activeSlide = this.slides[this.activeIndex];
        let currentOffset = parseInt(HtmlExtensions.css(activeSlide, this.directionValue), 10);
        let itemDimensions = this.getCurrentSlideSize();
        let carouselWidth = getDimensions(this.element).width;
        let maxScrollCount = Math.floor(carouselWidth / (itemDimensions.width + itemDimensions.gutter));
        let maxScrollDistance: number;

        let directionModifier = direction === Direction.Previous ? 1 : -1;
        let itemDimensionsGutterValue = direction === Direction.Previous ? 0 : itemDimensions.gutter;

        if (!isNumber(currentOffset)) {
            currentOffset = 0;
        }

        if (maxScrollCount === 0) {
            maxScrollCount = 1;
        }

        maxScrollCount = (carouselWidth % (itemDimensions.width + itemDimensions.gutter) === 0) ? maxScrollCount - 1 : maxScrollCount;

        // bug 9260013 - make sure maxScrollCount is always at least 1 to avoid issue with flippers
        maxScrollCount = Math.max(maxScrollCount, 1);
        maxScrollDistance = maxScrollCount * (itemDimensions.width + itemDimensions.gutter);

        let distanceToEdge = direction === Direction.Next
                            ? this.singleSlideWidth - carouselWidth + currentOffset
                            : Math.abs(currentOffset);

        let offset: number;

        // If we can scroll the distance of elements * scrollcount without going past the edge, we should
        if (maxScrollDistance <= distanceToEdge) {
            HtmlExtensions.css(activeSlide, this.directionValue, ((maxScrollDistance  * directionModifier) + currentOffset) + 'px');
        } else {
            HtmlExtensions.css(activeSlide, this.directionValue, ((distanceToEdge  * directionModifier)
             + currentOffset + itemDimensionsGutterValue) + 'px');
        }

        this.updateFlippers();
    }

    /**
     * @name - getCurrentSlideSize
     * @description - gets the width and gutter of the slide.
     * @private
     * @returns {IScrollWindow}
     */
    private getCurrentSlideSize(): IScrollWindow {
        let currentSlide = HtmlExtensions.selectFirstElement(MultiFeatureCarousel.allChildSelectors, this.slides[this.activeIndex]);

        if (!!currentSlide) {
            let gutter = this.direction === HtmlExtensions.Direction.left ?
                parseInt(HtmlExtensions.css(currentSlide, 'marginRight'), 10) :
                parseInt(HtmlExtensions.css(currentSlide, 'marginLeft'), 10);

            return {
                width: currentSlide.offsetWidth,
                gutter: isNaN(gutter) ? 0 : gutter
            };
        }

        return { width: 0, gutter: 0 };
    }

    /**
     * @name - previousSlide
     * @description - go to previous slide.
     * @private
     * @returns {void}
     */
    private previousSlide(): void {
        if (this.isMultiSlide) {
            this.previousMultiSlide();
        } else {
            this.changeSingleSlide(Direction.Previous);
        }
    }

    /**
     * @name - nextSlide
     * @description - go to next slide.
     * @private
     * @returns {void}
     */
    private nextSlide(): void {
        if (this.isMultiSlide) {
            this.nextMultiSlide();
        } else {
            this.changeSingleSlide(Direction.Next);
        }
    }

    /**
     * @name - setActiveSequenceIndicator
     * @description - sets the active sequence indicator and the associated slide.
     * @private
     * @param {HTMLElement} indicator - the indicator to set as active
     * @returns {void}
     */
    private setActiveSequenceIndicator(indicator: HTMLElement): void {
        if (!!indicator) {
            let id = indicator.getAttribute(MultiFeatureCarousel.ariaControlsAttribute);

            if (!!id) {
                for (var slideIndex = 0, slidesLength = this.slides.length; slideIndex < slidesLength; slideIndex++) {
                    if (id === this.slides[slideIndex].getAttribute('id')) {
                        this.setActiveSlide(slideIndex, Order.Next);
                        break;
                    }
                }
            }
        }
    }

    /**
     * @name - onCarouselResized
     * @description - carousel resize handler.
     * @private
     * @returns {void}
     */
    private onCarouselResized() {
        if (!this.isMultiSlide) {
            let slide = this.slides[0];
            let offset = parseInt(HtmlExtensions.css(slide, this.directionValue), 10);
            let carouselWidth = getDimensions(this.carouselElement).width;

            // Ensure the single slide extends to "next" edge of the carousel container if the offset is less than zero.
            // We don't want it to be more negative than it needs to be.
            if ((!isNaN(offset)) && (offset < 0) && (this.singleSlideWidth + offset < carouselWidth)) {
                HtmlExtensions.css(slide, this.directionValue, Math.min(0, carouselWidth - this.singleSlideWidth) + 'px');
            }

            this.updateFlippers();
        }
    }

    /**
     * @name - scrollItemIntoView
     * @description - scrolls an item into view.
     * @private
     * @param {HTMLElement} item - The item that should be scrolled into view.
     * @returns {void}
     */
    private scrollItemIntoView(item: HTMLElement) {
        let carouselWidth = getDimensions(this.carouselElement).width;
        let activeSlide = this.slides[0];
        let offset = (item as HTMLElement).offsetLeft;
        let itemSize = this.getCurrentSlideSize();
        let updateOffset = false;

        if (this.direction === HtmlExtensions.Direction.left) {
            let left = parseInt(HtmlExtensions.css(activeSlide, 'left'), 10) || 0;

            if ((left < 0) && (-left > offset)) {
                offset = -offset + 1;
                updateOffset = true;
            } else if ((left + offset) > (carouselWidth - itemSize.width)) {
                offset = carouselWidth - itemSize.width - offset - 1;
                updateOffset = true;
            }
        } else {
            let width = getDimensions(activeSlide).width;

            if (offset + itemSize.width + itemSize.gutter + activeSlide.offsetLeft > carouselWidth) {
                offset = -(width - offset - itemSize.width - itemSize.gutter) + 1;
                updateOffset = true;
            } else if (offset + activeSlide.offsetLeft < 0) {
                offset = carouselWidth - (width - offset - itemSize.gutter) - 1;
                updateOffset = true;
            }
        }

        if (updateOffset) {
            HtmlExtensions.css(activeSlide, this.directionValue, offset + 'px');
            this.updateFlippers();

            // The browser will potentially have already decided to scroll this item
            // into view by setting the parent's scrollLeft property. For our
            // positioning to work property we need this restored to 0. IE/Edge will
            // do this after we return from handling the focus event so we need to
            // do it in an immediate callback after giving them a chance to act first.
            setTimeout(() => { (activeSlide as Node).parentElement.scrollLeft = 0; }, 0);
        }
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////
    // // Event handers section.
    // ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @name - onFlipperClicked
     * @description - flipper click handler
     * @protected
     * @param {MouseEvent} event - the event.
     * @returns void
     */
    protected onFlipperClicked(event: MouseEvent): void {
        let source = HtmlExtensions.getEventTargetOrSrcElement(event);

        if (source === this.previousButton) {
            this.previousSlide();
        } else {
            this.nextSlide();
        }
    }

    /**
     * @name - onSequenceClicked
     * @description - sequence indicator click handler
     * @private
     * @param {MouseEvent} event - The event.
     * @returns void
     */
    private onSequenceClicked(event: MouseEvent): void {
        this.setActiveSequenceIndicator((event.target || event.srcElement) as HTMLElement);
    }

    /**
     * @name - onItemFocus
     * @description - item focus handler
     * @param {FocusEvent} event - the event.
     * @returns void
     */
    private onItemFocus = (event: FocusEvent) => {
        let item = (event.target || event.srcElement) as Element;

        if (!item) {
            return;
        }

        while (item.tagName !== 'LI') {
            if ((!!item.parentElement) && (item.parentElement !== item)) {
                item = item.parentElement;
            } else {
                break;
            }
        }

        if (item.tagName === 'LI') {
            this.scrollItemIntoView(item as HTMLElement);
        }
    }

    /**
     * @name - onResized
     * @description - carousel resize handler
     * @param  {UIEvent} event - The event.
     * @returns void
     */
    private onResized = (event: UIEvent) => {
        this.onCarouselResized();
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
        // clean up swipe handlers.
        if (this.swipe) {
            this.swipe.tearDown();
        }

        // clean up sequence indicators handlers.
        if (this.sequenceIndicators) {
            for (var sequenceIndicator of this.sequenceIndicators) {
                HtmlExtensions.removeEvent(sequenceIndicator, HtmlExtensions.eventTypes.click, this.onSequenceClicked);
            }
        }

        // clean up throttled event handlers.
        HtmlExtensions.removeEvent(window, HtmlExtensions.eventTypes.resize, this.resizeThrottledEventHandler);
        HtmlExtensions.removeEvent(window, HtmlExtensions.eventTypes.focus, this.focusThrottledEventHandler);
    }
}

/**
 * A scroll window where a slide can move in.
 */
export interface IScrollWindow {
    width: number;
    gutter: number;
}