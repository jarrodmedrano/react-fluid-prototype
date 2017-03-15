/// <amd-module name="breakpointTracker"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {Publisher, ISubscriber} from 'publisher';
import {eventTypes, addDebouncedEvent} from 'htmlExtensions';
import {isNumber, getWindowWidth} from 'utility';

/**
* @interface IBreakpointTrackerNotification
* @description - The data contract interface used for breakpointTracker notifications.
* @export
*/
export interface IBreakpointTrackerNotification {
    breakpoint: number;
    width: number;
}

/**
* @interface IBreakpointTrackerSubscriber
* @description - The interface which BreakpointTracker notification subscribers must implement.
* @export
*/
export interface IBreakpointTrackerSubscriber extends ISubscriber {
    onBreakpointChanged(notification: IBreakpointTrackerNotification): void;
}

/**
* @class - BreakpointTracker
* @classdesc - The BreakpointTracker component
* @export
*/
export class BreakpointTracker extends Publisher<IBreakpointTrackerSubscriber> {
    /**
    * @name - breakpoints
    * @description - The list of breakpoint widths.
    *                These breakpoints should come from data-bp and should be in ascending order.
    * @static
    * @private
    * @type {number[]}
    */
    private static breakpoints = [0, 540, 768, 1084, 1400, 1779];

    /**
    * @name - breakpoint
    * @description - The current breakpoint.
    * @private
    * @type {number}
    */
    private breakpoint: number;

    /**
    * @name - windowWidth
    * @description - The current window width.
    * @private
    * @type {number}
    */
    private windowWidth: number;

    /**
    * @name - getBreakpointTracker
    * @description - Gets the global BreakpointTracker
    * @static
    * @public
    * @type {BreakpointTracker}
    */
    public static getBreakpointTracker(): BreakpointTracker {
        if (!(<any>document.body).breakpointTracker) {
            (<any>document.body).breakpointTracker = new BreakpointTracker();
        }

        return (<any>document.body).breakpointTracker;
    }

    /**
    * @name - constructor
    * @description - Constructor for the BreakpointTracker component.
    * @private
    */
    constructor() {
        super(null);

        // Get the current window width and breakpoint.
        this.windowWidth = getWindowWidth();
        this.breakpoint = BreakpointTracker.identifyBreakpoint(this.windowWidth);

        // Attach resize listener. For performance reasons use a debounced event.
        addDebouncedEvent(window, eventTypes.resize, this.onWindowResized);
    }

    /**
    * @name - getBreakpoint
    * @description - Gets the current break.
    * @public
    * @returns {number} - The current breakpoint.
    */
    public getBreakpoint(): number {
        return this.breakpoint;
    }

    /**
    * @name - identifyBreakpoint
    * @description - Identifies the current break point based on the window width.
    * @static
    * @public
    * @param {number} [windowWidth] - The window width to get the breakpoint for.
    *                                 If not specified uses the current window width.
    * @returns {number} - The breakpoint for the specified width.
    */
    public static identifyBreakpoint(windowWidth?: number): number {
        if (!isNumber(windowWidth)) {
            windowWidth = getWindowWidth();
        }

        for (let breakpoint = BreakpointTracker.breakpoints.length - 1; breakpoint >= 0; breakpoint--) {
            if (windowWidth >= BreakpointTracker.breakpoints[breakpoint]) {
                return breakpoint;
            }
        }
    };

    /**
    * @name - onWindowResized
    * @description - The resize event listener to determine breakpoint changes.
    * @private
    * @param {UIEvent} event - The resize event.
    * @returns {void}
    */
    private onWindowResized = (event: UIEvent): void => {
        let windowWidth = getWindowWidth();
        let breakpoint = BreakpointTracker.identifyBreakpoint(windowWidth);

        if (this.breakpoint !== breakpoint) {
            this.breakpoint = breakpoint;
            this.initiatePublish({ breakpoint: breakpoint, width: windowWidth });
        }
    };

    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {IBreakpointTrackerSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} context - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IBreakpointTrackerSubscriber, context?: any): void {
        if (subscriber.onBreakpointChanged) {
            subscriber.onBreakpointChanged(context as IBreakpointTrackerNotification);
        }
    }
}
