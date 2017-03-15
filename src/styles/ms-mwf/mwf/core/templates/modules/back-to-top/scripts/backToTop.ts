/// <amd-module name="backToTop"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {addThrottledEvent, eventTypes, removeElement, removeEvent} from 'htmlExtensions';
import {getWindowHeight, apiDeprecated} from 'utility';
import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';

/**
 * The Back To Top module
 * @class
 * @classdesc Add a back to top link at the bottom of the window when the user scrolls down 2x the window height
 */
export class BackToTop extends ObservableComponent {
    // String for the component selector
    public static selector: string = '.m-back-to-top';
    private scrollThrottledEventHandler: EventListener;

    constructor(element: HTMLElement) {
        super(element);

        if (!element) {
            return;
        }
        this.update();
    }

    /**
     * updates the BackToTop component if there is any change in the DOM inside BackToTop container.
     *
     * @protected
     * @returns {void}
     */
    protected update(): void {
        this.scrollThrottledEventHandler = addThrottledEvent(window, eventTypes.scroll, this.toggleBackToTop);
    }


    /**
     * cleans out previous bindings to avoid double binding when a component is updated.
     *
     * @protected
     */
    protected teardown(): void {
        // clean up throttled event handlers.
        removeEvent(window, eventTypes.scroll, this.scrollThrottledEventHandler);

    }

    /**
     * @name - toggleBackToTop
     * @description - Show the back to top link when the scrollbar position is below 2x the height of the window height.
     * @returns {Void}
     */
    private toggleBackToTop = () => {
        let scrollBarPosition = window.pageYOffset || document.body.scrollTop;
        let height = getWindowHeight();

        let value = scrollBarPosition >= (2 * height) ? 'false' : 'true';
        this.element.setAttribute('aria-disabled', value);
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('BackToTop.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: BackToTop,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
