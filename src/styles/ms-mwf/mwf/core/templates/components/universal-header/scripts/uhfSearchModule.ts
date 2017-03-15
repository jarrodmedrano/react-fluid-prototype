/// <reference path='../../../../../typings/globals/jquery/index.d.ts' />
/// <amd-module name="uhfSearchModule"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import * as HtmlExtensions from 'htmlExtensions';
import {getWindowWidth} from 'utility';
import {AutoSuggest} from 'autosuggest';
import * as $ from 'jquery';

/**
* @class UhfSearchModule
* @classdesc Constructor of a UhfSearchModule component.
*/
export class UhfSearchModule {
    public width = '';

    private searchBox: HTMLInputElement;
    private searchCloseButton: HTMLElement;
    private searchParentElement: HTMLElement;
    private searchOpenedClass = 'f-search-opened';
    private focusedClass = 'js-focused';

    /**
     * Constructor of search component.
     */
    constructor(private searchForm: HTMLElement, private showCallback?: Function, private autoSuggest? : AutoSuggest) {
        if (!searchForm) {
            return;
        }
        this.searchBox = <HTMLInputElement>HtmlExtensions.selectFirstElement('input', this.searchForm);
        this.searchParentElement = HtmlExtensions.selectFirstElement('.js-global-head');

        let searchButton = HtmlExtensions.selectFirstElement('button', this.searchForm);
        HtmlExtensions.addEvent(searchButton, HtmlExtensions.eventTypes.click, this.handleSearchButtonClick);

        this.searchCloseButton = HtmlExtensions.selectFirstElement('.c-action-trigger.glyph-arrow-htmllegacy');
        HtmlExtensions.addEvent(this.searchCloseButton, HtmlExtensions.eventTypes.click, this.hide);

        this.toggleFocusAndClickListeners(this.searchForm, this.focusInHandler);
    }

    /**
     * Search logic for the UHF component
     *
     * @returns - true if a search should be performed
     */
    public onSearch(event: MouseEvent) {
        // The search box is empty.
        if (!this.searchBox.value.trim().length) {
            event.preventDefault();
            this.searchBox.focus();
            return false;
        }

        // log searches
        if (window.msCommonShell && window.msCommonShell.events && window.msCommonShell.events.onSearch) {
            window.msCommonShell.events.onSearch(this.searchForm) as HTMLFormElement;
        }
        return true;
    }

    /**
     * True if the search box has been hidden
     */
    public isHidden = (): boolean => {
        // in > vp3, search is always shown.
        if (getWindowWidth() >= 1084) {
            return false;
        } else {
            return !HtmlExtensions.hasClass(this.searchParentElement, this.searchOpenedClass);
        }
    }

    /**
     * Show the search box and place focus into it. 
     */
    public showAndFocus = (): void => {
        if (this.showCallback) {
            this.showCallback();
        }
        
        HtmlExtensions.addClass(this.searchParentElement, this.searchOpenedClass);
        HtmlExtensions.css(this.searchBox, 'width', this.width);
        this.searchCloseButton.setAttribute('aria-expanded', 'true');        
        this.searchBox.focus();
    }

    /**
     * Hide the search box.
     */
    public hide = (): void => {
        if (this.autoSuggest) {
            this.autoSuggest.hide();
        }
        HtmlExtensions.css(this.searchBox, 'width', '');
        HtmlExtensions.removeClass(this.searchParentElement, this.searchOpenedClass);
        this.searchCloseButton.setAttribute('aria-expanded', 'false');
    }

   /**
    * Event handler that handles the click of the search button.
    *
    * @param {MouseEvent} [$event] - Event object that triggered this handler.
    */
    private handleSearchButtonClick = (event: MouseEvent) => {
        if (!this.isHidden()) {
            this.onSearch(event);
            return;
        }
        
        // Don't perform a search
        event.preventDefault();
        this.showAndFocus();
    }

    /**
     * Set the search box width
     *
     * @param width {string} - the new width as a string. That is, it must contain a unit at the end, like 'px', 'em' etc...
     */
    public setSearchBoxWidth(width: string) {
        this.width = width;

        if (!this.isHidden()) {
            HtmlExtensions.css(this.searchBox, 'width', width);
        }
    }

    public getSearchFormElement(): HTMLElement {
        return this.searchForm;
    }

    /**
     * Attaches the supplied event handler to the provided element for both the click and focus events.
     * Click allows the event to be compatible with touch devices.
     *
     * @param element {HTMLElement} - the element to bind the events to
     * @param handler {EventListener} - the handler for the click and focus events.
     * @param remove {boolean} - if true, the event handler will be removed.
     */
    private toggleFocusAndClickListeners = (element: HTMLElement, handler: EventListener, remove?: boolean): void => {
        let method = remove ? 'removeEvent' : 'addEvent';
        (<any>HtmlExtensions)[method](element, HtmlExtensions.eventTypes.focus, handler, true);
        (<any>HtmlExtensions)[method](element, HtmlExtensions.eventTypes.click, handler, true);
    }

    /**
     * Event handler that handles focusing in.
     *
     * @param {MouseEvent} [$event] - Event object that triggered this handler.
     */
    private focusInHandler = (event: MouseEvent): void => {
        HtmlExtensions.addClass(this.searchForm, this.focusedClass);
        this.toggleFocusAndClickListeners(this.searchForm, this.focusInHandler, true);
        this.toggleFocusAndClickListeners(document.body, this.focusOutHandler);
    }

    /**
     * Event that handles focusing out.
     *
     * @param {MouseEvent} [$event] - Event object that triggered this handler.
     */
    private focusOutHandler = (event: MouseEvent): void => {
        if (!this.parentHasClass(<HTMLElement>event.target, this.focusedClass)) {
            HtmlExtensions.removeClass(this.searchForm, this.focusedClass);
            this.toggleFocusAndClickListeners(document.body, this.focusOutHandler, true);
            this.toggleFocusAndClickListeners(this.searchForm, this.focusInHandler);

            // actually do something...
            if (this.autoSuggest) {
                this.autoSuggest.hide();
            }

            this.hide();
        }
    }

    /**
     * Returns true if the supplied element or any of its ancestors have the given class name.
     *
     * @param {HTMLElement} element - The element to check.
     * @param {string} className - The class name to check for.
     */
    private parentHasClass = (element: HTMLElement, className: string): boolean => {
        if (!element) {
            return false;
        } else if (HtmlExtensions.hasClass(element, className)) {
            return true;
        }
        return this.parentHasClass(<HTMLElement>element.parentNode, className);
    }
}
