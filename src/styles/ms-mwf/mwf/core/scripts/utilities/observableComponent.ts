/// <amd-module name="observableComponent"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {addDebouncedEvent, eventTypes, getEventTargetOrSrcElement, removeEvent} from 'htmlExtensions';

/**
* @class - ObservableComponent
* @classdesc - An abstract base class for all observable components.
*              All inhertied classes should implement setup, update and teardown.
*              Observable Components will use MutationObserver browser API that is supported in all modern browsers.
*              For older browsers (IE10, IE9), it uses MutationEvents. 
*              To live with the performance issue of MutationEvents, it uses debouncing of events.
*              Currently IE8 is not supported. This scenario may not be needed for IE8 because
*              it's targeted more towards SPA pages and Ajax heavy pages.
*              If IE8 support needed, there are polyfills that we can consider.
* @export
* @abstract
*/
export abstract class ObservableComponent {
    /**
    * @name - mwfClassAttribute
    * @memberof - ObservableComponent
    * @description - The MWF class attribute name. This indicates which MWF class to use with the element markup.
    * @protected
    * @static
    * @readonly
    * @type {string}
    */
    protected static readonly mwfClassAttribute = 'data-mwf-class';

    /**
    * @name - initializeAttribute
    * @memberof - ObservableComponent
    * @description - initialize attribute name.
    *                This data-js-initialize code is just for backwards compatibility, it is deprecated and can be removed in v2.
    * @protected
    * @static
    * @readonly
    * @type {string}
    */
    protected static readonly initializeAttribute = 'data-js-initialize';

    /**
    * @name - mutationObserver
    * @memberof - ObservableComponent
    * @description - A reference to the browsers MutationObserver, if any.
    * @private
    * @static
    * @type {boolean}
    */
    // Check MutationObserver
    private static mutationObserver: any = (<any>window).MutationObserver
                                    || (<any>window).WebKitMutationObserver 
                                    || (<any>window).MozMutationObserver;

    /**
    * @name - ignoreNextDOMChange
    * @memberof - ObservableComponent
    * @description - The value indicating whether we should ignore the next set of DOM changes.
    *                We use this to ignore DOM changes we are causing ourselves when we update the page.
    *                NOTE: This is only used for modern mutations, and should be removed when we have a better solution.
    * @protected
    * @type {boolean}
    */
    protected ignoreNextDOMChange = false; 

    /**
    * @name - modernObserver
    * @memberof - ObservableComponent
    * @description - The observer for modern browswer.
    * @private
    * @type {boolean}
    */
    private modernObserver: MutationObserver;

    /**
    * @name - obsoleteNodeInsertedEventHander
    * @memberof - ObservableComponent
    * @description - A debounced event handler for older browsers that will be executed when a node is inserted in the element.
    * @private
    * @type {EventListener}
    */
    private obsoleteNodeInsertedEventHander: EventListener;

    /**
    * @name - obsoleteNodeRemovedEventHandler
    * @memberof - ObservableComponent
    * @description - A debounced event handler for older browsers that will be executed when a node is removed in the element.
    * @private
    * @type {EventListener}
    */
    private obsoleteNodeRemovedEventHandler: EventListener;

    /**
    * @name - constructor
    * @memberof - ObservableComponent
    * @description - Constructor for the ObservableComponent.
    * @param {HTMLElement} element - The native element to observe.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected element?: HTMLElement, params: any = null) {
        if (ObservableComponent.shouldInitializeAsClass(element, params)) {
            this.setObserver();
        }
    }

    /**
    * @name - update
    * @memberof - ObservableComponent
    * @description - Update the component state.
    * @protected
    * @abstract
    * @returns {void}
    */
    protected abstract update(): void;

    /**
    * @name - teardown
    * @memberof - ObservableComponent
    * @description - Cleaning up the old state of the component.
    * @protected
    * @abstract
    * @returns {void}
    */
    protected abstract teardown(): void;

    /**
    * @name - unObserve
    * @memberof - ObservableComponent
    * @description - stop observing an element.
    * @protected
    */
    protected unObserve() : void {
        if (this.modernObserver) {
            this.modernObserver.disconnect();
        }

        removeEvent(this.element, eventTypes.DOMNodeInserted, this.obsoleteNodeInsertedEventHander);
        removeEvent(this.element, eventTypes.DOMNodeRemoved, this.obsoleteNodeRemovedEventHandler);
    }

    /**
    * @name - setObserver
    * @memberof - ObservableComponent
    * @description - Sets proper observer based on a browser.
    * @private
    * @returns {void}
    */
    private setObserver(): void {
        // Chrome, FF, IE 11+, Opera, Safari (with webkit prefix)
        // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        if (typeof ObservableComponent.mutationObserver !== 'undefined') {
            this.observeModern();
            // IE9, IE10 support
        } else if ('MutationEvent' in window) {
            this.observeObsolete();
        } else {
            // IE8 support
            // todo - bruk - after studying customer need to support IE8, we can do either of the following:
            // use custom event polyfill for IE8 pages and handle the scenario using a custom event.
            // https://github.com/WebReflection/dom4#dom4
            // Or use either of the following polyfills
            // https://github.com/megawac/MutationObserver.js
            // https://github.com/webcomponents/webcomponentsjs/blob/master/src/MutationObserver/MutationObserver.js
        }
    }

    /**
    * @name - observeModern
    * @memberof - ObservableComponent
    * @description - Uses MutationObserver for modern browsers to call update or teardown methods
    *                if a node is added or removed in a component container.
    * @private
    * @returns {void}
    */
    private observeModern(): void {
        // todo - bruk - need to revisit this config based on the need of watching for other changes.
        const observerConfig = {
            childList: true,
            subtree: true
        };

        this.modernObserver  = new MutationObserver((mutations: MutationRecord[]) => { this.onModernMutations(mutations); });

        this.modernObserver.observe(this.element, observerConfig);
    }

    /**
    * @name - onModernMutations
    * @memberof - ObservableComponent
    * @description - Handle the modern observer's mutation event.
    * @private
    * @param {MutationRecord[]} mutations - The list of mutation records to process.
    * @returns {void}
    */
    private onModernMutations(mutations: MutationRecord[]): void {
        if (this.ignoreNextDOMChange) {
            this.ignoreNextDOMChange = false;
            return;
        }

        let needToTeardown = false;
        let needToUpdate = false;

        for (let mutation of mutations) {
            // Make calls based on nodes added to the DOM
            for (let index = 0, length = mutation.addedNodes.length; index < length; index++) {
                    // NodeType 1 is an Element node
                    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
                if (mutation.addedNodes[index].nodeType === 1) {
                        // Something was added, call update.
                    needToTeardown = true;
                    needToUpdate = true;
                }
            }

            // Make calls based on nodes removed from the DOM
            for (let index = 0, length = mutation.removedNodes.length; index < length; index++) {
                    // NodeType 1 is an Element node
                    // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
                if (mutation.removedNodes[index].nodeType === 1) {
                    needToTeardown = true;

                    // If the whole component wasn't deleted call update.
                    if (mutation.removedNodes[index] !== <any>this.element) {
                        needToUpdate = true;
                    }
                }
            }
        }

        if (needToTeardown) {
            this.teardown();
        }

        if (needToUpdate) {
            this.update();
        }
    }

    /**
    * @name - observeObsolete
    * @memberof - ObservableComponent
    * @description - Add mutation event listeners for older browsers to call update or teardown methods
    *                if a node is added or removed in a component's DOM.
    * @private
    * @returns {void}
    */
    private observeObsolete(): void {
        this.obsoleteNodeInsertedEventHander = addDebouncedEvent(this.element, eventTypes.DOMNodeInserted, () => {
            this.onObsoleteNodeInserted();
        });
        this.obsoleteNodeRemovedEventHandler = addDebouncedEvent(this.element, eventTypes.DOMNodeRemoved, (event: any) => {
            this.onObsoleteNodeRemoved(event);
        });
    }

    /**
    * @name - onObsoleteNodeInserted
    * @memberof - ObservableComponent
    * @description - Handle the obsolete observer's node inserted event.
    * @private
    * @returns {void}
    */
    private onObsoleteNodeInserted(): void {
        if (this.ignoreNextDOMChange) {
            return;
        }

        // A node was inserted into the component's DOM so we need to tear it down and reconstruct it.
        this.teardown();
        this.update();
    }

    /**
    * @name - onObsoleteNodeRemoved
    * @memberof - ObservableComponent
    * @description - Handle the obsolete observer's node removed event.
    * @private
    * @param {any} event - The node removed event.
    * @returns {void}
    */
    private onObsoleteNodeRemoved(event: any): void {
        if (this.ignoreNextDOMChange) {
            return;
        }

        // Call the component teardown method because either all or some portion of the component was removed.
        this.teardown();

        // If the whole component wasn't deleted call its update method.
        if (getEventTargetOrSrcElement(event) !== this.element) {
            this.update();
        }
    }

    /**
    * @name - shouldInitializeAsClass
    * @memberof - ObservableComponent
    * @description - Determines whether or not this element should be initialized as the specified class.
    * @public
    * @static
    * @param {HTMLElement} element - The element to check the class suitability for.
    * @param {any} params- The parameter object with the class name to match against the MWF class
    *                      attribute value to determine whether or not to initialize this element
    *                      in the scope of the currently active constructor class hierarchy.
    * @returns {boolean}
    */
    public static shouldInitializeAsClass(element: HTMLElement, params: any): boolean {
        let mwfClass = !element ? null : element.getAttribute(ObservableComponent.mwfClassAttribute);

        // This jsInit code is just for backwards compatibility, it is deprecated and can be removed in v2.
        let jsInit = !element ? null : element.getAttribute(ObservableComponent.initializeAttribute);

        if (jsInit === 'false') {
            return false;
        }
        // End of backwards compatibility for deprecated jsInit attribute.

        return !!element && (!mwfClass || (!!params && (mwfClass === params.mwfClass)));
    }
}