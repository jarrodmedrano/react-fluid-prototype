/// <amd-module name="removeFocus"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {
    addClass,
    addEvent,
    addEvents,
    css,
    eventTypes,
    getEventTargetOrSrcElement,
    nodeListToArray,
    removeClass,
    selectElements,
    selectFirstElement} from 'htmlExtensions';

/**
 * @name - IRemoveFocusOnPseudoElement
 * @summary - Interface to describe the RemoveFocusOnPseudoElement object
 * @description - Some elements (checkbox and radio) use a pseudo-element and CSS to show the focus rectangle outline.
 *                For those elements, we have to use a class and CSS to hide the outline because JS inline styles cannot access
 *                pseudo-elements.  To complicate things further, the element with the pseudo may not be the element that actually
 *                gets focus from the browser.  Therefore, for each element that needs a CSS override, we need to provide selectors
 *                for the element that the user will click on, the element that will get focus, and the element that needs to get
 *                the CSS class -- which might all be different (although not necessarily).
 *
 *                On top of that, there's an edge case where clicking on an already active item will trigger the click handler
 *                and then trigger the blur handler on the same element, which will cause the element's focus rectangle to re-appear.
 *                To solve that, we allow the override to specify whether or not the click handler should call event.preventDefault()
 *                to cancel the blur event.
 *
 *                Additionally, there's another edge case where some elements (such as rating) don't actually get focus on click.
 *                In those cases, we have to set the focus.  Manually setting the focus can cause some strange behavior with how blur
 *                fires, so we have to instead fire on a mousedown or keydown event on some other element to ensure returnFocus's
 *                timing is correct.
 *
 * @interface IRemoveFocusOnPseudoElement
 */
interface IRemoveFocusOnPseudoElement {
    clickSelector: string;
    focusSelector: string;
    classSelector: string;
    preventDefault: boolean;
    elementDoesNotGetFocus: boolean;
}

/**
 * @name - whiteListFocusableComponents
 * @description - the selectors of the components that should have the remove focus behavior
 *
 * @const
 * @type {string}
 */
const whiteListFocusableComponents =
    ['.c-action-toggle',
    '.c-action-trigger',
    '.m-back-to-top',
    '.c-button',
    '.c-button > span',
    '.c-call-to-action',
    '.c-content-toggle button',
    '.c-checkbox [type=checkbox]',
    '.c-date-time-picker button',
    'div[data-date-time-picker] li',
    '.c-drawer > button',
    '.c-drawer > header > button',
    '.c-dialog .c-glyph.glyph-cancel',
    '.c-flipper',
    '.c-hyperlink',
    '.c-hyperlink > span',
    '.c-in-page-navigation a',
    '.c-link-navigation a.c-hyperlink',
    '.c-menu-item',
    '.c-menu-item > a',
    '.c-menu-item > button',
    '.c-navigation-menu button',
    '.c-pagination li > a',
    '.m-pagination li > a',
    '.c-pivot a',
    '.c-product-placement > a',
    '.m-product-placement-item > a',
    '.c-progress',
    '.c-radio [type=radio]',
    '.c-range-slider [role=slider]',
    '.c-rating button.c-glyph',
    '.c-refine-item',
    'button.c-refine-item',
    '.c-select-button',
    '.c-select-menu > a',
    '.c-select-menu > button',
    '.c-sequence-indicator button[role=tab]',
    '.c-social li > a',
    '.c-social button',
    '.m-social li > a',
    '.m-social button',
    '.c-slider button',
    '.c-supplemental-nav button',
    '.c-supplemental-nav a',
    '.m-supplemental-nav button',
    '.m-supplemental-nav a',
    '.c-table th > button',
    '.c-toggle button',
    '.c-video',
    '.c-universal-header a',
    '.c-universal-header button',
    '.f-video-controls > button'].toString();

/**
 * @name - removeFocusOnPseudoElementList
 * @description - array of objects describing the elements with pseudo-element that need multiple selectors and options
 *                Note:  every class selector must also be present in the whiteListFocusableComponents array above
 *
 * @const
 * @type {IRemoveFocusOnPseudoElement}
 */
const removeFocusOnPseudoElementList: IRemoveFocusOnPseudoElement[] = [
    {
        clickSelector: '.c-radio [type=radio] + span',
        focusSelector: '.c-radio [type=radio]',
        classSelector: '.c-radio [type=radio]',
        preventDefault: true,
        elementDoesNotGetFocus: false
    },
    {
        clickSelector: '.c-checkbox [type=checkbox] + span',
        focusSelector: '.c-checkbox [type=checkbox]',
        classSelector: '.c-checkbox [type=checkbox]',
        preventDefault: true,
        elementDoesNotGetFocus: false
    },
    {
        clickSelector: '.c-rating button.c-glyph',
        focusSelector: '.c-rating button.c-glyph',
        classSelector: '.c-rating button.c-glyph',
        preventDefault: true,
        elementDoesNotGetFocus: true
    }
];

/**
 * @name - hiddenFocusClass
 * @description - the CSS class to add to elements to remove the focus rectangle
 *
 * @const
 * @type {string}
 */
const hiddenFocusClass = 'x-hidden-focus';

/**
 * @name - pseudoElementSelectors
 * @description - the pseudo-element selectors; this exists so they can be looped through only one time
 *
 * @type {string}
 */
let pseudoElementSelectors = '';

/**
 * @name - lastPseudoElementParent
 * @description - the last pseudo element parent element to be examined; this exists so elements don't get bound more than once
 *
 * @type {HTMLElement}
 */
let lastPseudoElementParent: HTMLElement;

/**
 * @name - removeFocus
 * @description - Remove the focus state outline on click events for the whitelist of MWF components, and restore on blur or keydown
 * @param {HTMLElement | Document} [element] - The element to focus the context of the query for removing the focus state outline.
 * @returns {Void}
 */
export function removeFocus(element?: HTMLElement | Document): void {
    if (pseudoElementSelectors.length < 1) {
        for (let index = 0; index < removeFocusOnPseudoElementList.length; index++) {
            pseudoElementSelectors += removeFocusOnPseudoElementList[index].classSelector;

            // add a comma after every element except the last one
            if (index !== removeFocusOnPseudoElementList.length - 1) {
                pseudoElementSelectors += ',';
            }
        }
    }

    const actionComponents = !element || element === document
        ? document.querySelectorAll(whiteListFocusableComponents)
        // Return an null if querySelectorAll doesn't exist since this indicates that it is a text node instead of an HTML node
        : element.querySelectorAll && element.parentElement ? element.parentElement.querySelectorAll(whiteListFocusableComponents) : null;

    if (!actionComponents || !actionComponents.length) {
        return;
    }

    for (let component of nodeListToArray<HTMLElement>(actionComponents)) {
        addEventHandlersForRemovingFocus(component);
    }
}

/**
 * @name - addEventHandlersForRemovingFocus
 * @description - Add events to focus, blur, and mousedown that remove and return the focus outline from the passed HTMLElement.
 * @param {HTMLElement} element - The element to attach the events and remove focus outline function upon.
 * @returns {Void}
 */
function addEventHandlersForRemovingFocus(element: HTMLElement): void {
    if ((<HTMLInputElement>element).type !== 'text',
        (<HTMLInputElement>element).type !== 'textarea',
        (<HTMLInputElement>element).type !== 'password') {

        let pseudoElement: IRemoveFocusOnPseudoElement;
        let clickElements = [element];
        let focusElements = [element];
        let parent = element.parentElement || null;

        // are we in a pseudo-element case?
        if (parent && selectElements(pseudoElementSelectors, parent).length) {
            if (parent === lastPseudoElementParent) {
                // we've already set all the sibling elements so this element is already bound to events
                return;
            }

            // yes we're in a pseudo-element case, need to figure out which one and what rules to follow
            for (let pseudoElementEntry of removeFocusOnPseudoElementList) {
                if (selectElements(pseudoElementEntry.classSelector, parent).length) {
                    pseudoElement = pseudoElementEntry;

                    clickElements.splice(0);
                    focusElements.splice(0);

                    let pseudoClickElements = selectElements(pseudoElement.clickSelector, parent);
                    for (let pseudoClickElement of pseudoClickElements) {
                        clickElements.push(pseudoClickElement);
                    }

                    let pseudoFocusElements = selectElements(pseudoElement.focusSelector, parent);
                    for (let pseudoFocusElement of pseudoFocusElements) {
                        focusElements.push(pseudoFocusElement);
                    }

                    lastPseudoElementParent = parent;
                    break;
                }
            }
        }

        for (let clickElementIndex = 0, clickElementsLength = clickElements.length;
            clickElementIndex < clickElementsLength;
            clickElementIndex++) {
            addEvent(clickElements[clickElementIndex],
                     eventTypes.mousedown,
                     (event: MouseEvent) => { hideFocus(event, focusElements[clickElementIndex], pseudoElement); });
        }

        // return focus on blur and on keydown to handle situations such as slider
        // where a keydown event should return the focus rectangle for the user
        if (pseudoElement && pseudoElement.elementDoesNotGetFocus) {
            for (let focusElement of focusElements) {
                addEvents(focusElements, 'mousedown keydown', () => { returnFocusBasedOnEventTarget(event, focusElement); });
            }
        } else {
            for (let focusElement of focusElements) {
                addEvents(focusElements, 'blur keydown', () => { returnFocus(element); });
            }
        }
    }
}

/**
 * @name - hideFocus
 * @description - adds the hiddenFocusClass on the element and possibly calls event.preventDefault
 *
 * @param {MouseEvent} event - the mouse event
 * @param {HTMLElement} element - the element to remove focus from
 * @param [IRemoveFocusOnPseudoElement] pseudoElement - the IRemoveFocusOnPseudoElement object (optional)
 * @returns {Void}
 */
function hideFocus(event: MouseEvent, element: HTMLElement, pseudoElement?: IRemoveFocusOnPseudoElement): void {
    addClass(element, hiddenFocusClass);
    if (pseudoElement && pseudoElement.preventDefault) {
        // prevent blur from firing to avoid the situation of clicking on an already-selected element
        // and having the focus rectangle return because the this handler fires, then the blur handler fires
        event.preventDefault();
    }

    if (pseudoElement && pseudoElement.elementDoesNotGetFocus) {
        element.focus();
    }
}

/**
 * @name - returnFocus
 * @description - removes the hiddenFocusClass on the element
 *
 * @param {HTMLElement} element - the element to return focus to
 * @returns {Void}
 */
function returnFocus(element: HTMLElement): void {
    removeClass(element, hiddenFocusClass);
}

/**
 * @name - returnFocusBasedOnEventTarget
 * @description - removes the hiddenFocusClass on the element based on the event target
 *
 * @param {Event} event
 * @param {HTMLElement} element
 * @returns {Void}
 */
function returnFocusBasedOnEventTarget(event: Event, element: HTMLElement): void {
    let eventTarget = getEventTargetOrSrcElement(event);
    if (eventTarget !== element) {
        returnFocus(element);
    }
}