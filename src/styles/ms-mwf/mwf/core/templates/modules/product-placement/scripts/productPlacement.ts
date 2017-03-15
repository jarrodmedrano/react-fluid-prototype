/// <amd-module name="productPlacement"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import { ComponentFactory } from 'componentFactory';
import { ObservableComponent } from 'observableComponent';
import {
    addThrottledEvent,
    eventTypes,
    hasClass,
    isImageLoadedSuccessfully,
    removeEvent,
    selectElements,
    selectFirstElement
} from 'htmlExtensions';
import { apiDeprecated, getDimensions } from 'utility';
import { handleImageError, GraphicSize, GraphicType } from 'handleImageError';

/**
* @class - ProductPlacement
* @classdesc - The ProductPlacement component
* @export
*/
export class ProductPlacement extends ObservableComponent {
    /**
    * @name - selector
    * @description - The ProductPlacement module selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.m-product-placement';

    /**
    * @name - ariaHidden
    * @description - aria-hidden attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static ariaHidden = 'aria-hidden';

    /**
     * @name - showAllAlwaysClass
     * @description - A class that will display 'show all' heading irrespective of the number of items in product placement, 
     *                if it's applied to the element.
     * 
     * @private
     * @static
     * 
     * @memberOf ProductPlacement
     * @type {string}
     */
    private static showAllAlwaysClass = 'js-product-placement-persist-show-all';

    /**
    * @name - carousel
    * @description - The carousel element.
    * @private
    * @type {HTMLElement}
    */
    private carousel: HTMLElement;

    /**
    * @name - products
    * @description - The products list element.
    * @private
    * @type {HTMLElement}
    */
    private products: HTMLElement;

    /**
    * @name - seeAll
    * @description - The seeAll element.
    * @private
    * @type {HTMLElement}
    */
    private seeAll: HTMLElement;

    /**
    * @name - resizeListener
    * @description - The throttled window resize listener.
    * @private
    * @type {EventListener}
    */
    private resizeListener: EventListener;

    /**
    * @name - constructor
    * @description - Constructor for the ProductPlacement component.
    * @public
    * @param {HTMLElement} element - the native element to attach the ProductPlacement behavior to.
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
        if (!this.element) {
            return;
        }

        this.carousel = selectFirstElement('.c-carousel', this.element);
        this.products = selectFirstElement('ul', this.element);
        this.seeAll = selectFirstElement('[class^="c-heading"] .c-hyperlink[aria-label]', this.element);
        let headingElement = this.seeAll ? this.seeAll.parentElement : null;

        // select all default images and set up image error handling
        let images = selectElements('.f-default-image img', this.element) as HTMLImageElement[];

        for (let image of images) {
            if (!isImageLoadedSuccessfully(image)) {
                // go up the DOM tree to find the product placement item
                let productPlacementItemFound = false;
                let productPlacementItem: HTMLElement = image;
                while (!productPlacementItemFound) {
                    if (!productPlacementItem.parentElement) {
                        break;
                    }

                    productPlacementItem = productPlacementItem.parentElement;

                    if (hasClass(productPlacementItem, 'm-product-placement-item')) {
                        productPlacementItemFound = true;
                    }
                }

                if (productPlacementItemFound) {
                    let context: GraphicType;

                    if (hasClass(productPlacementItem, 'context-app')) {
                        context = GraphicType.app;
                    } else if (hasClass(productPlacementItem, 'context-person')) {
                        context = GraphicType.person;
                    } else if (hasClass(productPlacementItem, 'context-video')) {
                        context = GraphicType.video;
                    } else {
                        context = GraphicType.generic;
                    }

                    let imageSize = hasClass(productPlacementItem, 'f-size-small') ? GraphicSize.small : GraphicSize.large;

                    // image has not loaded - it could be in one of two states:
                    // 1) the image is still in the process of loading, or
                    // 2) the image has finished loading and encountered an error in the past
                    if (image.complete) {
                        // image finished loading - there must have been an error in the past
                        handleImageError(image, imageSize, context);
                    } else {
                        // image is still loading - there may or may not be an error in the future
                        // set onerror in case there is a problem 
                        image.onerror = () => {
                            handleImageError(image, imageSize, context);
                        };
                    }
                }
            }
        }

        if (!!this.carousel && !!this.products && !!this.seeAll && !hasClass(headingElement, ProductPlacement.showAllAlwaysClass)) {
            this.onResize();
            this.resizeListener = addThrottledEvent(window, eventTypes.resize, this.onWindowResize);
        }
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
        // Remove the click listener.
        removeEvent(window, eventTypes.resize, this.resizeListener);

        // Reset non static members
        this.carousel = null;
        this.products = null;
        this.seeAll = null;
        this.resizeListener = null;
    }

    /**
    * @name - onWindowResize
    * @description - Handles the window resize event. Calls onResize to do the real work.
    * @private
    * @param {UIEvent} event - The resize event.
    * @returns {void}
    */
    private onWindowResize = (event: UIEvent): void => {
        this.onResize();
    }

    /**
    * @name - onResize
    * @description - Handles the productplacement resizing.
    * @private
    * @returns {void}
    */
    private onResize(): void {
        if (!!this.carousel && !!this.products && !!this.seeAll) {
            let carouselWidth = getDimensions(this.carousel).width;
            let productsWidth = getDimensions(this.products).width;

            if (productsWidth < carouselWidth) {
                this.seeAll.setAttribute(ProductPlacement.ariaHidden, 'true');
            } else {
                this.seeAll.removeAttribute(ProductPlacement.ariaHidden);
            }
        }
    };

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('ProductPlacement.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: ProductPlacement,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}