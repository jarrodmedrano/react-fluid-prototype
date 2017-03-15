/// <amd-module name="multiFeature"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ObservableComponent} from 'observableComponent';
import {ComponentFactory, FactoryInput} from 'componentFactory';
import {ICarouselSubscriber, ICarouselNotification} from 'carousel-base';
import {IController, IControllerSubscriber, IControllerNotification} from 'IController';
import {LogoController} from 'logo-controller';
import {MultiSlideCarousel} from 'multi-slide-carousel';
import {Pivot} from 'pivot';
import {SequenceIndicator} from 'sequenceIndicator';
import {addClass, hasClass, removeClass, selectFirstElement, selectElements} from 'htmlExtensions';
import {isNumber} from 'utility';

/**
* @class - MultiFeature
* @classdesc - The MultiFeature module
* @extends {MultiSlideCarousel}
* @implements {ICarouselSubscriber}
* @implements {IControllerSubscriber}
* @export
*/
export class MultiFeature extends MultiSlideCarousel implements ICarouselSubscriber, IControllerSubscriber {
    /**
    * @name - selector
    * @memberof - MultiFeature
    * @description - The MultiFeature element selector.
    * @public
    * @static
    * @type {string}
    */
    public static readonly selector = '.m-multi-feature';

    /**
    * @name - controllerSelector
    * @memberof - MultiFeature
    * @description - The selector for the MultiFeature's controller.
    * @private
    * @static
    * @type {string}
    */
    private static readonly controllerSelector = '[role="tablist"]';

    /**
    * @name - controllerItemsSelector
    * @memberof - MultiFeature
    * @description - The selector for the MultiFeature's controller's items.
    *                This is only used for backwards compatibility to fix pivot controller item ids.
    * @private
    * @static
    * @type {string}
    */
    private static readonly controllerItemsSelector = '[role="tab"]';

    /**
    * @name - contentSelector
    * @memberof - MultiFeature
    * @description - The selector for the MultiFeature's content items.
    * @private
    * @static
    * @type {string}
    */
    private static readonly contentSelector = 'section > ul > li[role="tabpanel"], section > div > ul > li[role="tabpanel"]';

    /**
    * @name - activeItemClass
    * @memberof - MultiFeature
    * @description - The active item class name.
    * @private
    * @static
    * @type {string}
    */
    private static readonly activeItemClass = 'f-active';

    /**
    * @name - ariaControls
    * @memberof - MultiFeature
    * @description - The aria-controls attribute name.
    * @private
    * @static
    * @type {string}
    */
    private static readonly ariaControls = 'aria-controls';

    /**
    * @name - controller
    * @memberof - MultiFeature
    * @description - The MultiFeature's controller.
    * @private
    * @type {IController}
    */
    private controller: IController;

    /**
    * @name - contentElements
    * @memberof - MultiFeature
    * @description - The MultiFeature's content elements.
    * @private
    * @type {string[]}
    */
    private contentElements: HTMLElement[];

    /**
    * @name - activeContentIndex
    * @memberof - MultiFeature
    * @description - The MultiFeature's active content index.
    * @private
    * @type {number}
    */
    private activeContentIndex: number;

    /**
    * @name - constructor
    * @memberof - MultiFeature
    * @description - Constructor for the MultiFeature class.
    * @param {HTMLElement} multiFeatureElement - The native element to attach the MultiFeature behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected multiFeatureElement: HTMLElement, params: any = null) {
        super(MultiFeature.selectMultiSlideCarousel(multiFeatureElement, params), params);
    }

    /**
    * @name - selectMultiSlideCarousel
    * @memberof - MultiFeature
    * @description - Gets the MultiSlideCarousel element. Also sets the MWF class attribute value.
    * @static
    * @private
    * @param {HTMLElement} element - The MultiFeature element to look for the MultiSlideCarousel within.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    * @returns {HTMLElement} - The MultiSlideCarousel element.
    */
    private static selectMultiSlideCarousel(multiFeatureElement: HTMLElement, params: any): HTMLElement {
        let multiSlideCarousel = selectFirstElement(MultiSlideCarousel.selector, multiFeatureElement);

        if (multiSlideCarousel) {
            // Add the initialization attribute value for the carousel ('MultiFeature' by default)
            multiSlideCarousel.setAttribute(ObservableComponent.mwfClassAttribute,
                (!!params && !!params.mwfClass) ? params.mwfClass : 'MultiFeature');

            // This is for backwards compatibility with old MultiFeature carousels that have deprecataed data-js-initialize='false'
            // It can be removed for V2.
            multiSlideCarousel.removeAttribute(ObservableComponent.initializeAttribute);
        // End of backwards compatibility for deprecated jsInit attribute.
        }

        return multiSlideCarousel;
    };

    /**
    * @name - update
    * @memberof - MultiFeature
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @override
    * @returns {boolean} - true if successful, otherwise false.
    */
    protected update(): boolean {
        if (!super.update()) {
            return false;
        }

        super.subscribe(this);

        return true;
    }

    /**
    * @name - teardown
    * @memberof - MultiFeature
    * @description - Called by ObservableComponent when the component needs to clean up its state.
    *                Components should remove any event bindings they've added to ensure they are
    *                not duplicated during repeated update/teardown cycles.
    * @protected
    * @override
    * @returns {void}
    */
    protected teardown(): void {
        super.teardown();
        super.unsubscribe(this);

        if (this.controller) {
            this.controller.unsubscribe(this);
        }
    }

    /**
    * @name loadMultiSlideController
    * @memberof - MultiFeature
    * @description - Loads the MultiFeature's controller.
    * @protected
    * @override
    * @returns {void}
    */
    protected loadMultiSlideController(): void {
        let controllerElement = selectFirstElement(MultiFeature.controllerSelector, this.multiFeatureElement);
        let controllerType: any;

        if (controllerElement && hasClass(controllerElement, 'c-sequence-indicator')) {
            this.loadContentElements(controllerElement);
            controllerType = SequenceIndicator;
        } else if (controllerElement && controllerElement.parentElement && hasClass(controllerElement.parentElement, 'c-pivot')) {
            controllerElement = controllerElement.parentElement;
            controllerType = Pivot;

            // This is really gross but for backward compatibility, it is deprecated and can be removed in v2.
            // We have to first fix up the pivot item element ids to only reference the pivot content like they
            // should, otherwise the pivot control won't hide/show it's contents properly.
            for (let pivot of selectElements(MultiFeature.controllerItemsSelector, controllerElement)) {
                let idString = pivot.getAttribute(MultiFeature.ariaControls);
                let ids = !idString ? [] : idString.split(/\s+/);

                for (let id of ids) {
                    if (selectFirstElement('#' + id, controllerElement)) {
                        pivot.setAttribute(MultiFeature.ariaControls, id);
                        break;
                    }
                }
            }

            // And we have to remove the data-js-initialize='false' because we want it to initialize.
            controllerElement.removeAttribute(ObservableComponent.initializeAttribute);
            // End backwards compatibility hack.
        } else if (controllerElement && controllerElement.firstElementChild && controllerElement.firstElementChild.firstElementChild &&
            hasClass(controllerElement.firstElementChild.firstElementChild as HTMLElement, 'c-logo')) {
            this.loadContentElements(controllerElement);
            controllerType = LogoController;
            controllerElement.setAttribute(ObservableComponent.mwfClassAttribute, 'LogoController');
            addClass(controllerElement, SequenceIndicator.selector);
        }

        ComponentFactory.create([{
            elements: [controllerElement],
            component: controllerType,
            callback: (results: IController[]): void => {
                if (results && results.length) {
                    this.controller = results[0];

                    // Subscribe to the controller.
                    if (!!this.controller) {
                        this.controller.subscribe(this);
                    }
                }
            },
            eventToBind: 'DOMContentLoaded'
        }]);
    }

    /**
    * @name - onSlideRangeChanged
    * @memberof - MultiFeature
    * @description - Called when the carousel's slide range changes.
    *                We use this to sync the carousel, controller, and our content.
    * @public
    * @param  {number} notification - The carousel changed notification.
    * @returns {ICarouselNotification}
    */
    onSlideRangeChanged(notification: ICarouselNotification): void {
        if (!!notification && !!notification.fullyVisibleItemRange && !!notification.fullyVisibleItemRange.length) {
            this.controller.setControllerIndex(notification.fullyVisibleItemRange[0], notification.userInitiated);
            this.updateMultiFeatureContentIndex(notification.fullyVisibleItemRange[0]);
        }
    }

    /**
    * @name - updateMultiFeatureContentIndex
    * @memberof - MultiFeature
    * @description - Update the MultiFeature's content index.
    *                Shows the content for the desired index and hides any previously shown content.
    *                This method doesn't do anything when we have a pivot for a controller as we
    *                expect the pivot to manage it's own content.
    * @private
    * @param  {number} toIndex - The desired new index.
    * @returns {void}
    */
    private updateMultiFeatureContentIndex(toIndex: number): void {
        // It's allowable for toIndex to be >= than this.contentElements.length as MultiFeatures are allowed to have a single content.
        if (!this.contentElements || (toIndex < 0) || ((toIndex >= this.contentElements.length) && (this.contentElements.length !== 1))) {
            return;
        }

        toIndex = Math.min(toIndex, this.contentElements.length - 1);

        if (isNumber(this.activeContentIndex) && (this.activeContentIndex >= 0) &&
            (this.activeContentIndex < this.contentElements.length)) {
            // Hide any previously shown content.
            removeClass(this.contentElements[this.activeContentIndex], MultiFeature.activeItemClass);
        }

        addClass(this.contentElements[toIndex], MultiFeature.activeItemClass);

        this.activeContentIndex = toIndex;
    }

    /**
    * @name - loadContentElements
    * @memberof - MultiFeature
    * @description - Loads the MultiFeature's content elements.
    *                This method will not be called when we have a pivot for a controller as we
    *                expect the pivot to manage it's own content.
    * @private
    * @param {HTMLElement} controllerElement - The containing content element to attach the MultiFeature behavior to.
    * @returns {void}
    */
    private loadContentElements(controllerElement: HTMLElement): void {
        this.contentElements = selectElements(MultiFeature.contentSelector, this.multiFeatureElement);
    }

    /**
    * @name - onControllerIndexChanged
    * @memberof - MultiFeature
    * @description - Implements IControllerSubscriber's onControllerIndexChanged method.
    * @public
    * @param  {number} toIndex - The desired new index.
    * @returns {void}
    */
    public onControllerIndexChanged(notification: IControllerNotification): void {
        if (!!notification) {
            super.setActiveSlide(notification.currentIndex);
        }
    }
}