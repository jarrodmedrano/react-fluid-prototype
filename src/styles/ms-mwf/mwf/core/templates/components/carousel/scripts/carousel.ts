/// <amd-module name="carousel"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ComponentFactory} from 'componentFactory';
import {CarouselBase, ICarouselSubscriber} from 'carousel-base';
import {MultiSlideCarousel} from 'multi-slide-carousel';
import {SingleSlideCarousel} from 'single-slide-carousel';
import {Publisher} from 'publisher';
import {hasClass} from 'htmlExtensions';
import {apiDeprecated} from 'utility';

/**
* @class - Carousel
* @classdesc - The Carousel module is deprecated. Please use MultiSlideCarousel or SingleSlideCarousel instead.
* @extends {Publisher<ICarouselSubscriber>}
* @deprecated
* @export
*/
export class Carousel extends Publisher<ICarouselSubscriber> {
    /**
    * @name - selector
    * @memberof - Carousel
    * @description - The carousel element selector.
    * @public
    * @static
    * @type {string}
    */
    public static readonly selector = '.c-carousel';

    /**
    * @name - multiSlideClass
    * @memberof - Carousel
    * @description - The multi-slide class name.
    * @private
    * @static
    * @type {string}
    */
    private static multiSlideClass = 'f-multi-slide';

    /**
    * @name - constructor
    * @memberof - Carousel
    * @description - Constructor for the Carousel class.
    *                The Carousel module is deprecated. Please use MultiSlideCarousel or SingleSlideCarousel instead.
    * @deprecated
    * @param {HTMLElement} carouselElement - The native element to attach the Carousel behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(carouselElement: HTMLElement, params: any = null) {
        super(carouselElement, params);

        apiDeprecated('Carousel is deprecated, please use either MultiSlideCarousel or SingleSlideCarousel instead.');

        let carousel: any = null;

        if (!!carouselElement) {
            ComponentFactory.create([{
                elements: [carouselElement],
                component: hasClass(carouselElement, Carousel.multiSlideClass) ? MultiSlideCarousel : SingleSlideCarousel,
                callback: (results: CarouselBase[]): void => { carousel = (results && results.length) ? results[0] : null; },
                eventToBind: 'DOMContentLoaded'
            }]);
        }
    
        return carousel;
    }

    /**
    * @name - publish
    * @description - Abstract publish callback called by the initiatePublish method during a publish cycle.
    *                This method will be overridden by the derived class.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @override
    * @param {ICarouselSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: ICarouselSubscriber, context?: any): void {
        apiDeprecated('Carousel is deprecated, please use either MultiSlideCarousel or SingleSlideCarousel instead.');
    }
}