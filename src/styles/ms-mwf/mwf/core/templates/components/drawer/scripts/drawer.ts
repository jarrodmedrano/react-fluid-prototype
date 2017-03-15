/// <amd-module name="drawer"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {BreakpointTracker, IBreakpointTrackerSubscriber, IBreakpointTrackerNotification} from 'breakpointTracker';
import {selectFirstElement, eventTypes, addEvent, removeEvent, hasClass, addClass, removeClass} from 'htmlExtensions';
import {apiDeprecated} from 'utility';

/**
* @class - Drawer
* @classdesc - The Drawer component
* @export
*/
export class Drawer extends ObservableComponent {
    /**
    * @name - selector
    * @description - The drawer component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector: string = '.c-drawer';

    /**
    * @name - ariaExpanded
    * @description - aria-expanded attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static ariaExpanded = 'aria-expanded';

    /**
    * @name - disabledString
    * @description - The disabled string.
    * @static
    * @private
    * @type {string}
    */
    private static disabledString = 'disabled';

    /**
    * @name - hiddenString
    * @description - The hidden string.
    * @static
    * @private
    * @type {string}
    */
    private static hiddenString = 'hidden';

    /**
    * @name - trueString
    * @description - The true string.
    * @static
    * @private
    * @type {string}
    */
    private static trueString = 'true';

    /**
    * @name - deprecatedResponsiveString
    * @description - The true string.
    * @static
    * @private
    * @type {string}
    */
    private static deprecatedResponsiveString = 'f-responsive';

    /**
    * @name - dataCollapseAttribute
    * @description - The data-js-collpase attribute string.
    * @static
    * @private
    * @type {string}
    */
    private static dataCollapseAttribute = 'data-js-collapse';

    /**
    * @name - drawerContainer
    * @description - The drawer's container element.
    * @private
    * @type {HTMLElement}
    */
    private drawerContainer: HTMLElement;

    /**
    * @name - drawerToggleButton
    * @description - The drawer's toggle button.
    * @private
    * @type {HTMLElement}
    */
    private drawerToggleButton: HTMLElement;

    /**
    * @name - collapseBreakpoint
    * @description - The responsive drawer's collapse breakpoint.
    * @private
    * @type {number}
    */
    private collapseBreakpoint: number;

    /**
    * @name - constructor
    * @description - Constructor for the Drawer component.
    * @public
    * @param {HTMLElement} element - the native element to attach the Drawer behavior to.
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

        this.drawerToggleButton = selectFirstElement('button[aria-controls]', this.element);

        if (!this.drawerToggleButton) {
            return;
        }

        const drawerId = this.drawerToggleButton.getAttribute('aria-controls');
        this.drawerContainer = selectFirstElement('#' + drawerId, this.element);

        if (!this.drawerContainer) {
            return;
        }

        // Check if the drawer is the AMC responsive Drawer (Deprecated 1.19.0 in move to core)
        // If so, add the collapse attribute for VP1 to provide backwards compatability and remove deprecated class
        if (hasClass(this.element, Drawer.deprecatedResponsiveString)) {
            this.element.setAttribute(Drawer.dataCollapseAttribute, 'vp1');
            removeClass(this.element, Drawer.deprecatedResponsiveString);

            // The responsive drawer by default has a divider, so to ensure we are not breaking the previous visual
            // design of our partners we'll add a divider so long as it doesn't have the class to remove it
            if (!hasClass(this.element, 'f-remove-divider')) {
                addClass(this.element, 'f-divider');
            }
        }

        // Since we were supporting the selector of m-amc-placement we can't be assured that the AMC placement
        // module includes the deprecated class of f-responsive, so we'll ensure support here.
        if (hasClass(this.element, 'm-amc-placement')) {
            this.element.setAttribute(Drawer.dataCollapseAttribute, 'vp1');
        }

        if (!this.isExpanded()) {
            this.drawerContainer.setAttribute('aria-hidden', Drawer.trueString);
            this.changeDrawerState('collapsed');
        }

        let breakpointTracker = BreakpointTracker.getBreakpointTracker();

        if (!!this.element.getAttribute(Drawer.dataCollapseAttribute)) {
            this.getCollapseBreakpoint();

            breakpointTracker.subscribe({
                onBreakpointChanged: (notification: IBreakpointTrackerNotification): void => {
                    this.onBreakpointChanged(notification);
                }
            });
        }

        addEvent(this.drawerToggleButton, eventTypes.click, this.toggleDrawer);

        this.onBreakpointChanged({ breakpoint: breakpointTracker.getBreakpoint(), width: 0 });
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
        removeEvent(this.drawerToggleButton, eventTypes.click, this.toggleDrawer);
    }

    /**
    * @name - onBreakpointChanged
    * @description - Updates the drawer based on the current window width.
    * @public
    * @param  {IBreakpointTrackerNotification} notification - The BreakpointTracker notification.
    * @returns {void}
    */
    public onBreakpointChanged(notification: IBreakpointTrackerNotification): void {
        // * REMOVE REFERENCE TO 'f-responsive' in v.2.0 -- Deprecated * / /
        if (this.element.getAttribute(Drawer.dataCollapseAttribute)) {
            this.updateResponsiveDrawer(notification.breakpoint);
        }
    }

    /**
    * @name - getCollapseBreakpoint
    * @description - Get the breakpoint at which the responsive drawer should collapse
    * @public
    * @returns {void}
    */
    public getCollapseBreakpoint = (): void => {
        let getCollapseBreakpoint = this.element.getAttribute(Drawer.dataCollapseAttribute).toLowerCase();

        switch (getCollapseBreakpoint) {
            case 'vp3':
                this.collapseBreakpoint = 2;
            break;

            case 'vp2':
                this.collapseBreakpoint = 1;
            break;

            case 'vp1':
                this.collapseBreakpoint = 0;
            break;
        }
    }

    /**
    * @name - toggleDrawer
    * @description - Open or close the drawer based on its current state.
    * @public
    * @returns {void}
    */
    public toggleDrawer = (): void => {
        this.isExpanded() ? this.collapseDrawer() : this.expandDrawer();
    }

    /**
    * @name - changeDrawerState
    * @description - Change the drawer state. To be used with expandDrawer() and collapseDrawer()
    * @private
    * @param  {string} state - The desired state.
    *                          'open' to open the drawer, any other to close the drawer.
    * @returns {void}
    */
    public changeDrawerState(state: string): void {
        const openState = state === 'open';

        this.drawerToggleButton.setAttribute(Drawer.ariaExpanded, openState ? Drawer.trueString : 'false');
        this.drawerContainer.style.height = openState ? 'auto' : '0';
        this.drawerContainer.style.overflow = openState ? 'visible' : Drawer.hiddenString;
        this.drawerContainer.setAttribute('aria-hidden', openState ? 'false' : Drawer.trueString);
    }

    /**
    * @name - collapseDrawer
    * @description - Collapse the drawer element.
    * @private
    * @returns {void}
    */
    public collapseDrawer(): void {
        this.drawerContainer.setAttribute(Drawer.hiddenString, '');
        this.changeDrawerState('');
    }

    /**
    * @name - expandDrawer
    * @description - Expand the drawer element.
    * @private
    * @returns {void}
    */
    public expandDrawer(): void {
        this.drawerContainer.removeAttribute(Drawer.hiddenString);
        this.changeDrawerState('open');
    }

    /**
    * @name - isExpanded
    * @description - Check if the drawer is expanded by validating the aria-expanded attribute is true.
    * @private
    * @returns {boolean}
    */
    public isExpanded(): boolean {
        return this.drawerToggleButton.getAttribute(Drawer.ariaExpanded) === Drawer.trueString;
    }

    /**
    * @name - updateResponsiveDrawer
    * @description - If the we are in vp1, show drawer, otherwise just display the content.
    * @private
    * @param  {number} breakpoint - The breakpoint value.
    * @returns {void}
    */
    public updateResponsiveDrawer(breakpoint: number): void {
        // Is the current viewport larger than the collapse breakpoint?
        if (breakpoint > this.collapseBreakpoint) {
            this.drawerToggleButton.setAttribute(Drawer.disabledString, Drawer.disabledString);
            addClass(this.element, 'f-show');
            this.expandDrawer();
        } else {
            this.drawerToggleButton.removeAttribute(Drawer.disabledString);
            removeClass(this.element, 'f-show');
            this.collapseDrawer();
        }
    }
    // * NOT CORE * //

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Drawer.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Drawer,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}
