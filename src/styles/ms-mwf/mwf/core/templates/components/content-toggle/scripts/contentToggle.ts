/// <amd-module name="contentToggle"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {selectFirstElement, eventTypes, addEvent, removeEvent, addThrottledEvent, css, getClientRect} from 'htmlExtensions';
import {apiDeprecated} from 'utility';

/**
* @class - ContentToggle
* @classdesc - The ContentToggle component
*              Show more/less behavior for paragraph and expand/collapse link.
* @export
*/
export class ContentToggle extends ObservableComponent {
    /**
    * @name - selector
    * @description - selector to use to find ContentToggle components in the document.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-content-toggle';

    /**
    * @name - dataExpanded
    * @description - The data-f-expanded attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static dataExpanded = 'data-f-expanded';

    /**
    * @name - targetSelector
    * @description - The target selector.
    * @static
    * @private
    * @type {string}
    */
    private static targetSelector = '[data-f-expanded]';

    /**
    * @name - dataMoreAttributeValue
    * @description - The data-f-more attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static dataMoreAttributeValue = 'data-f-more';

    /**
    * @name - dataLessAttributeValue
    * @description - The data-f-less attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static dataLessAttributeValue = 'data-f-less';

    /**
    * @name - dataShowAttribute
    * @description - The data-f-show attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static dataShowAttribute = 'data-f-show';

    /**
    * @name - defaultShow
    * @description - The default number of lines to show in collapsed view.
    * @static
    * @private
    * @type {string}
    */
    private static defaultShow: number = 3;

    /**
    * @name - moreString
    * @description - The localized 'More' string.
    * @static
    * @private
    * @type {string}
    */
    private static moreString: string;

    /**
    * @name - lessString
    * @description - The localized 'Less' string.
    * @static
    * @private
    * @type {string}
    */
    private static lessString: string;

    /**
    * @name - target
    * @description - The ContentToggle target element.
    * @private
    * @type {HTMLElement}
    */
    private target: HTMLElement;

    /**
    * @name - trigger
    * @description - The ContentToggle trigger element.
    * @private
    * @type {HTMLElement}
    */
    private trigger: HTMLElement;

    /**
    * @name - show
    * @description - The number of lines to show in collapsed mode.
    * @private
    * @type {number}
    */
    private show: number;

    /**
    * @name - lineHeight
    * @description - The height of one line of text.
    * @private
    * @type {number}
    */
    private lineHeight: number;

    /**
    * @name - triggerDisplayStyle
    * @description - The value of the content's display style.
    * @private
    * @type {string}
    */
    private triggerDisplayStyle: string;

    /**
    * @name - resizeThrottledEventHandler
    * @description - The resize event listener.
    * @private
    * @type {EventListener}
    */
    private resizeThrottledEventHandler: EventListener;

    /**
    * @name - constructor
    * @description - Constructor for the ContentToggle component.
    * @public
    * @param {HTMLElement} element - the native element to attach the ContentToggle behavior to.
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

        this.target = selectFirstElement(ContentToggle.targetSelector, this.element);

        if (!this.target) {
            // Keeping original element detection for backwards compatibility
            this.target = selectFirstElement('p', this.element);
        }

        this.trigger = selectFirstElement('button', this.element);

        if (!this.target || !this.trigger) {
            return;
        }

        this.lineHeight = this.calculateLineHeight();

        // Read the show value attribute allowing zero to be a valid value. (ie. do not use default if 0)
        let showValue = parseInt(this.trigger.getAttribute(ContentToggle.dataShowAttribute), 10);

        this.show = (isNaN(showValue) || (showValue < 0)) ? ContentToggle.defaultShow : showValue;

        ContentToggle.moreString = this.trigger.getAttribute(ContentToggle.dataMoreAttributeValue);
        ContentToggle.lessString = this.trigger.getAttribute(ContentToggle.dataLessAttributeValue);

        // Save the trigger's initial display style value in case we need to restore it later.
        this.triggerDisplayStyle = css(this.trigger, 'display');

        this.onResized();

        addEvent(this.trigger, eventTypes.click, this.clickHandler);
        this.resizeThrottledEventHandler = addThrottledEvent(window, eventTypes.resize, this.onResized);
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
        // clean up throttled event handlers.
        removeEvent(this.trigger, eventTypes.click, this.clickHandler);
        removeEvent(window, eventTypes.resize, this.resizeThrottledEventHandler);

        // Reset non static members
        this.target = null;
        this.trigger = null;
        this.show = null;
        this.lineHeight = null;
    }

    /**
    * @name - toggleContent
    * @description - Toggle Expand Content behavior.
    * @private
    * @param {boolean} [toggleOpen=(!(this.target.getAttribute(ContentToggle.dataExpanded) === 'true'))]
    * @returns {void}
    */
    private toggleContent(toggleOpen: boolean = (!(this.target.getAttribute(ContentToggle.dataExpanded) === 'true'))): void {
        this.target.setAttribute(ContentToggle.dataExpanded, toggleOpen.toString());
        this.trigger.innerText = toggleOpen ? ContentToggle.lessString : ContentToggle.moreString;

        if (toggleOpen) {
            css(this.target, 'max-height', '');
        } else {
            css(this.target, 'max-height', (this.lineHeight * this.show) + 'px');
        }
    }

    /**
    * @name - noToggle
    * @description - Remove Toggle Behavior.
    * @private
    * @returns {boolean}
    */
    private noToggle(): boolean {
        // Make sure we remove maxHeight from the target so we get its true target height
        // when we call getClientRect on it. Otherwise if we've earlier collapsed it we'll
        // only get the maxHeight we limited it to at that time which is not what we want.
        css(this.target, 'max-height', '');

        let targetRect = getClientRect(this.target) as ClientRect;
        let targetPadding = (parseInt(css(this.target, 'padding-top'), 10) || 0) +
                            (parseInt(css(this.target, 'padding-bottom'), 10) || 0);

        return (targetRect.height - targetPadding) <= (this.lineHeight * this.show);
    };

    /**
    * @name - calculateLineHeight
    * @description - Calculate line height.
    * @private
    * @returns {number}
    */
    private calculateLineHeight(): number {
        // measure line-height by adding two new lines and measure the distance
        // between the two new lines. Adding one line can cause an incorrect
        // measurement because of the possibility of padding/margins.
        let clone = this.target.cloneNode() as HTMLElement;

        clone.innerHTML = '<br>';
        this.target.appendChild(clone);

        let singleLineHeight = clone.offsetHeight;

        clone.innerHTML = '<br><br>';

        let doubleLineHeight = clone.offsetHeight;

        this.target.removeChild(clone);
        this.ignoreNextDOMChange = true;

        return doubleLineHeight - singleLineHeight;
    };

    /**
    * @name - clickHandler
    * @description - ContentToggle more/less event handler.
    * @private
    * @returns {void}
    */
    private clickHandler = (): void => {
        this.toggleContent();
    };

    /**
    * @name - onResized
    * @description - Handles the window resize event.
    * @private
    * @returns {void}
    */
    private onResized = (): void => {
        if (this.noToggle()) {
            css(this.trigger, 'display', 'none');
            return;
        }

        css(this.trigger, 'display', this.triggerDisplayStyle);
        this.toggleContent(this.target.getAttribute(ContentToggle.dataExpanded) === 'true');
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('ContentToggle.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: ContentToggle,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
