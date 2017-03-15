/// <amd-module name="pageBehaviors"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ComponentFactory} from 'componentFactory';
import {addClass, getEventTargetOrSrcElement, removeClass} from 'htmlExtensions';
import {removeFocus} from 'removeFocus';

/**
* @class - PageBehaviors
* @classdesc - The MWF Binding Manager.
*              This is expected to be included at a page level if any of MWF exists on the page.
*              Runs common bindings on load and when new elements are added to the page.
* @export
*/
export class PageBehaviors {
    /**
    * @name - selector
    * @description - The page behaviors component selector. Used only by ComponentFactory.
    *                Left undefined to get ComponentFactory to bind the page behaviors to the page (document.body).
    * @static
    * @public
    * @type {string}
    */
    public static selector: string;

    /**
    * @name - constructor
    * @description - Constructor for the PageBehaviors component.
    * @public
    */
    constructor() {
        // Simulate moderizer's no-js/js class switching
        removeClass(document.documentElement, 'no-js');
        addClass(document.documentElement, 'js');

        // Execute all common bindings on all elements within the document
        this.executeCommonForAddedElements(document);

        // Execute the observer for DOM changes to apply common bindings
        this.watchForDomChangesToExecuteCommon();
    }

    /**
    * @name - watchForDomChangesToExecuteCommon
    * @description - Watch the document for changes, and run common methods against the changed elements
    *                NOTE:  IE8 support not implemented/supported.
    * @public
    * @returns {void}
    */
    private watchForDomChangesToExecuteCommon(): void {
        const observerConfig = {
            childList: true,
            subtree: true
        };

        // Modern support (Chrome, FF, IE11+)
        if (typeof MutationObserver !== 'undefined') {
            let observer = new MutationObserver(mutations => {
                for (let muation of mutations) {
                    // Make calls based on added nodes to the DOM
                    for (let key in muation.addedNodes) {
                        if (muation.addedNodes[key].nodeType === 1) {
                            this.executeCommonForAddedElements(muation.addedNodes[key] as HTMLElement);
                        }
                    }
                }
            });

            observer.observe(document, observerConfig);
        } else if (document.addEventListener) { // IE9+ support
            document.addEventListener('DOMNodeInserted', this.executeCommonForAddedElementsFromEvent, false);
        }
    }

    /**
    * @name - executeCommonForAddedElementsFromEvent
    * @description - Execute all common bindings that should be executed on an element from an event
    * @public
    * @param {Event} event - The DOMNodeInserted event
    * @returns {void}
    */
    private executeCommonForAddedElementsFromEvent = (event: Event): void => {
        var htmlElement = getEventTargetOrSrcElement(event);

        if (!htmlElement) {
            return;
        }

        this.executeCommonForAddedElements(htmlElement);
    }

    /**
    * @name - executeCommonForAddedElements
    * @description - Execute all common bindings that should be executed on an element
    * @public
    * @param {HTMLElement | Document} element - The element to bind all common events to.
    * @returns {void}
    */
    private executeCommonForAddedElements = (element: HTMLElement | Document): void => {
        if (!element) {
            return;
        }

        // All page level binds here:
        removeFocus(element);
    }
}