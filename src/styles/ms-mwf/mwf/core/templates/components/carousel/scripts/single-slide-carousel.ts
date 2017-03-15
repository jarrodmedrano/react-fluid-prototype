/// <amd-module name="single-slide-carousel"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {CarouselBase} from 'carousel-base';
import {addEvent,
        addThrottledEvent,
        css,
        Direction,
        eventTypes,
        getEventTargetOrSrcElement,
        hasClass,
        removeEvent,
        selectElements,
        selectFirstElement} from 'htmlExtensions';
import {getDimensions, isNumber} from 'utility';

/**
* @class - SingleSlideCarousel
* @classdesc - The SingleSlideCarousel class. This class is intended for carousels containing a single logical slide
*              where the slide may span more than the width of the carousel.
* @extends {CarouselBase}
* @export
*/
export class SingleSlideCarousel extends CarouselBase {
    /**
    * @name - selector
    * @memberof - SingleSlideCarousel
    * @description - The single-slide carousel element selector.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static readonly selector = '.c-carousel[class*=f-single-slide]';

    /**
    * @name - singleSlideSelector
    * @memberof - SingleSlideCarousel
    * @description - The single-slide carousel single logical slide selector.
    * @private
    * @static
    * @type {string}
    */
    private static singleSlideSelector = CarouselBase.selector + ' > * > ul';

    /**
    * @name - focusItemSelector
    * @memberof - SingleSlideCarousel
    * @description - The focus items selector for non-gallery mode.
    * @private
    * @static
    * @type {string}
    */
    private static focusItemSelector = CarouselBase.selector + ' > * > ul > li > section a';

    /**
    * @name - focusGalleryItemSelector
    * @memberof - SingleSlideCarousel
    * @description - The focus items selector for gallery mode.
    * @private
    * @static
    * @type {string}
    */
    private static focusGalleryItemSelector = CarouselBase.selector + ' > * > ul > li a';

    /**
    * @name - focusElements
    * @memberof - SingleSlideCarousel
    * @description - The focus elements.
    * @private
    * @type {HTMLElement[]}
    */
    private focusElements: HTMLElement[];

    /**
    * @name - singleSlideWidth
    * @memberof - SingleSlideCarousel
    * @description - The width of the logical single slide.
    * @private
    * @type {number}
    */
    private singleSlideWidth: number;

    /**
    * @name - focusThrottledEventHandler
    * @memberof - SingleSlideCarousel
    * @description - The throttled event listener for focus events.
    * @private
    * @type {EventListener}
    */
    private focusThrottledEventHandler: EventListener;

    /**
    * @name - resizeThrottledEventHandler
    * @memberof - SingleSlideCarousel
    * @description - The throttled event listener for resize events.
    * @private
    * @type {EventListener}
    */
    private resizeThrottledEventHandler: EventListener;

    /**
    * @name - constructor
    * @memberof - SingleSlideCarousel
    * @description - Constructor for the SingleSlideCarousel class.
    * @param {HTMLElement} carouselElement - The native element to attach the SingleSlideCarousel behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected carouselElement: HTMLElement, params: any = null) {
        super(carouselElement, params);
    }

    /**
    * @name - update
    * @memberof - SingleSlideCarousel
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @override
    * @returns {boolean} - true if successful, otherwise false.
    */
    protected update(): boolean {
        if (!super.update()) {
            return false;
        }

        // In single slide mode we also need to add a resize handler in order to update flipper visibility.
        this.resizeThrottledEventHandler = addThrottledEvent(window,
            eventTypes.resize,
            this.onResized);

        // In single slide mode we also need to add a focus handler in order to position items and update flipper visibility.
        let focusSelector = hasClass(this.slides[0], 'f-gallery')
            ? SingleSlideCarousel.focusGalleryItemSelector
            : SingleSlideCarousel.focusItemSelector;

        this.focusElements = selectElements(focusSelector, this.carouselElement);

        addEvent(this.focusElements, eventTypes.focus, this.onItemFocus);

        return true;
    }

    /**
    * @name - teardown
    * @memberof - SingleSlideCarousel
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @override
    * @returns {void}
    */
    protected teardown(): void {
        super.teardown();

        // Clean up throttled event handlers.
        removeEvent(window, eventTypes.resize, this.resizeThrottledEventHandler);
        removeEvent(this.focusElements, eventTypes.focus, this.onItemFocus);
    }

    /**
    * @name getSlides
    * @memberof - SingleSlideCarousel
    * @description - Get the individual slides in this multi-slide carousel.
    * @protected
    * @override
    * @returns {HTMLElement[]}
    */
    protected getSlides(): HTMLElement[] {
        let slides = selectElements(SingleSlideCarousel.singleSlideSelector, this.carouselElement);

        // make sure we actually have slides.
        if (slides && slides.length && selectFirstElement('li', slides[0])) {
            this.singleSlideWidth = getDimensions(slides[0]).width;
            return slides;
        }

        return null;
    }

    /**
    * @name getFirstActiveIndex
    * @memberof - SingleSlideCarousel
    * @description - Gets the index of the first active slide.
    * @protected
    * @override
    * @returns {number}
    */
    protected getFirstActiveIndex(): number {
        return 0;
    }

    /**
    * @name - isScrollablePrevious
    * @memberof - SingleSlideCarousel
    * @description - Determines whether or not the carousel can "scroll previous".
    * @protected
    * @override
    * @returns {boolean}
    */
    protected isScrollablePrevious(): boolean {
        let offset = parseInt(css(this.slides[this.activeIndex], this.directionValue), 10);

        return !isNaN(offset) && (offset !== 0);
    }

    /**
    * @name - isScrollableNext
    * @memberof - SingleSlideCarousel
    * @description - Determines whether or not the carousel can "scroll next".
    * @protected
    * @override
    * @returns {boolean}
    */
    protected isScrollableNext(): boolean {
        let offset = parseInt(css(this.slides[this.activeIndex], this.directionValue), 10);
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

    /**
    * @name - previousSlide
    * @memberof - SingleSlideCarousel
    * @description - Go to previous slide.
    * @protected
    * @override
    * @returns {void}
    */
    protected previousSlide(): void {
        this.changeSingleSlide(false);
    }

    /**
    * @name - nextSlide
    * @memberof - SingleSlideCarousel
    * @description - Go to next slide.
    * @protected
    * @override
    * @returns {void}
    */
    protected nextSlide(): void {
        this.changeSingleSlide(true);
    }

    /**
    * @name - changeSingleSlide
    * @memberof - SingleSlideCarousel
    * @description - Scrolls previous or next panning through the logical single slide.
    * @private
    * @param {boolean} next - Whether or not to scroll in the 'next' direction.
    * @returns {void}
    */
    private changeSingleSlide(next: boolean): void {
        let activeSlide = this.slides[this.activeIndex];
        let currentOffset = parseInt(css(activeSlide, this.directionValue), 10);
        let itemDimensions = this.getCurrentSlideSize();
        let carouselWidth = getDimensions(this.carouselElement).width;
        let maxScrollCount = Math.floor(carouselWidth / (itemDimensions.width + itemDimensions.gutter));
        let maxScrollDistance: number;

        let directionModifier = next ? -1 : 1;
        let itemDimensionsGutterValue = next ? itemDimensions.gutter : 0;

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

        let distanceToEdge = next ? this.singleSlideWidth - carouselWidth + currentOffset : Math.abs(currentOffset);

        let offset: number;

        // If we can scroll the distance of elements * scrollcount without going past the edge, we should
        if (maxScrollDistance <= distanceToEdge) {
            offset = (maxScrollDistance * directionModifier) + currentOffset;
        } else {
            offset = (distanceToEdge * directionModifier) + currentOffset + itemDimensionsGutterValue;
        }

        css(activeSlide, this.directionValue, offset + 'px');

        super.updateFlippers();
        this.fireSingleSlideChangedNotification(offset, carouselWidth, itemDimensions);
    }

    /**
    * @name - fireSingleSlideChangedNotification
    * @memberof - SingleSlideCarousel
    * @description - Fires a ISlideChangedNotification for a singleslide mode change.
    * @private
    * @param {number} offset - The current offset of the singleslide within the carousel.
    * @param {number} carouselWidth - The width of the carousel.
    * @param {IScrollWindow} itemDimensions - The dimensions of a single item.
    * @returns {void}
    */
    private fireSingleSlideChangedNotification(offset: number, carouselWidth: number, itemDimensions: IScrollWindow): void {
        let slides = selectElements(CarouselBase.allChildSelectors, this.carouselElement);
        let itemWidth = itemDimensions.width;
        let fullItemWidth = itemDimensions.width + itemDimensions.gutter;
        let firstPartial = -1;
        let lastPartial = -1;
        let firstFull = -1;
        let lastFull = -1;

        for (let index = 0; index < slides.length; index++) {
            let slideOffset = (index * fullItemWidth) + offset;
            let slideEndOffset = slideOffset + itemWidth;

            if (slideEndOffset < 0) {
                continue;
            }

            if ((slideOffset < 0) && (slideEndOffset > 0)) {
                firstPartial = index;
            }

            if ((firstFull === -1) && (slideOffset >= 0)) {
                firstFull = index;

                if (firstPartial === -1) {
                    firstPartial = firstFull;
                }
            }

            if ((firstFull !== -1) && (slideEndOffset <= carouselWidth)) {
                lastFull = index;
            }

            if ((lastFull !== -1) && (lastPartial === -1) && (slideOffset < carouselWidth) && (slideEndOffset > carouselWidth)) {
                lastPartial = index;
                break;
            }
        }

        if (lastPartial === -1) {
            lastPartial = lastFull;
        }

        super.initiatePublish({
            fullyVisibleItemRange: [ firstFull, lastFull ],
            partiallyVisibleItemRange: [ firstPartial, lastPartial ],
            userInitiated: true
        });
    }

    /**
    * @name getCurrentSlideSize
    * @memberof - SingleSlideCarousel
    * @description Gets the width and gutter of the current slide.
    * @private
    * @returns {IScrollWindow}
    */
    private getCurrentSlideSize(): IScrollWindow {
        let currentSlide = selectFirstElement(CarouselBase.allChildSelectors, this.carouselElement);

        if (!!currentSlide) {
            let gutter = this.direction === Direction.left ?
                parseInt(css(currentSlide, 'marginRight'), 10) :
                parseInt(css(currentSlide, 'marginLeft'), 10);

            return {
                width: currentSlide.offsetWidth,
                gutter: isNaN(gutter) ? 0 : gutter
            };
        }

        return { width: 0, gutter: 0 };
    }

    /**
    * @name onCarouselResized
    * @memberof - SingleSlideCarousel
    * @description Carousel resize handler
    * @private
    * @returns {void}
    */
    private onCarouselResized(): void {
        let slide = this.slides[0];
        let offset = parseInt(css(slide, this.directionValue), 10);
        let carouselWidth = getDimensions(this.carouselElement).width;

        // Update the singleSlideWidth in case that also changed when the carousel was resized.
        this.singleSlideWidth = getDimensions(this.slides[0]).width;

        // Ensure the single slide extends to "next" edge of the carousel container if the offset is less than zero.
        // We don't want it to be more negative than it needs to be.
        if ((!isNaN(offset)) && (offset < 0) && (this.singleSlideWidth + offset < carouselWidth)) {
            css(slide, this.directionValue, Math.min(0, carouselWidth - this.singleSlideWidth) + 'px');
        }

        super.updateFlippers();
    }

    /**
    * @name scrollItemIntoView
    * @memberof - SingleSlideCarousel
    * @description Scroll item into view.
    * @private
    * @param  {HTMLElement} item - The item that should be scrolled into view.
    * @returns {void}
    */
    private scrollItemIntoView(item: HTMLElement) {
        let carouselWidth = getDimensions(this.carouselElement).width;
        let activeSlide = this.slides[ 0 ];
        let offset = (item as HTMLElement).offsetLeft;
        let itemSize = this.getCurrentSlideSize();
        let updateOffset = false;

        if (this.direction === Direction.left) {
            let left = parseInt(css(activeSlide, 'left'), 10) || 0;

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
            css(activeSlide, this.directionValue, offset + 'px');
            super.updateFlippers();

            // The browser will potentially have already decided to scroll this item
            // into view by setting the parent's scrollLeft property. For our
            // positioning to work property we need this restored to 0. IE/Edge will
            // do this after we return from handling the focus event so we need to
            // do it in an immediate callback after giving them a chance to act first.
            setTimeout(() => {
                (activeSlide as Node).parentElement.scrollLeft = 0;
                this.fireSingleSlideChangedNotification(offset, carouselWidth, itemSize);
            }, 0);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Event handers section.
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /**
    * @name onItemFocus
    * @memberof - SingleSlideCarousel
    * @description Item focus handler
    * @private
    * @param  {FocusEvent} event - The event.
    * @returns {void}
    */
    private onItemFocus = (event: FocusEvent): void => {
        let item = getEventTargetOrSrcElement(event);

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
    * @name onResized
    * @memberof - SingleSlideCarousel
    * @private
    * @description Carousel resize handler
    * @param  {UIEvent} event - The event.
    * @returns {void}
    */
    private onResized = (event: UIEvent): void => {
        this.onCarouselResized();
    }
}

/**
* @interface IScrollWindow
* @classdesc - The interface which defines the scroll window data contract.
*/
interface IScrollWindow {
    width: number;
    gutter: number;
}