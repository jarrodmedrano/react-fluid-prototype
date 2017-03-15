/// <amd-module name="swipe"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {addEvents, Coordinate, getCoordinates, preventDefault, removeEvents} from 'htmlExtensions';

export class Swipe {

    /**
     *  Calculated x position to determine the movment is a swipe or a scroll.
     *
     * @private
     * @type {number}
     */
    private totalX: number;

    /**
     * Calculated y position to determine the movement is a swipe or a scroll.
     *
     * @private
     * @type {number}
     */
    private totalY: number;

    /**
     * X and Y coordinate of the starting position.
     *
     * @private
     * @type {HtmlExtensions.Coordinate}
     */
    private startCoordinate : Coordinate;

    /**
     * X and Y coordinate of the end position.
     *
     * @private
     * @type {HtmlExtensions.Coordinate}
     */
    private endCoordinate : Coordinate;

    /**
     * A flag that indicate a swipe is still active or not.
     *
     * @private
     */
    private active = false;

    /**
     * A distance marker (in px) to be consider the movement as a swipe.
     *
     * @private
     */
    private swipeDistanceMarker = 10;

    private pointerTypes: string[];

    /**
     * Cross browser events used for swipe.
     *
     * @private
     * @type {*}
     */
    private pointerEvents : any = {
                   'mouse': {
                        start: 'mousedown',
                        move: 'mousemove',
                        end: 'mouseup'
                    },
                    'touch': {
                        start: 'touchstart',
                        move: 'touchmove',
                        end: 'touchend',
                        cancel: 'touchcancel'
                    },
                    'pointer': {
                        start: 'pointerdown',
                        move: 'pointermove',
                        end: 'pointerup',
                        cancel: 'pointercancel'
                    }
                };

    /**
     * The maximum vertical delta for a swipe should be less than 200px.
     *
     * @private
     */
    private maximumVerticalDistance = 200;

    /**
     * Vertical distance should not be more than a fraction of the horizontal distance.
     *
     * @private
     */
    private maximumVerticalRatio = 0.85;

    /**
     * At least a 30px lateral motion is necessary for a swipe.
     *
     * @private
     */
    private minimumHorizontalDistance = 30;

    /**
     * Get all cross browser events for a given event type. Like for move, get 'mousemove touchmove pointermove'
    *
    * @private
    * @param {string[]} pointerTypes
    * @param {string} eventType
    * @returns
    */
    private getEvents(pointerTypes: string[], eventType: string) : string {
            var result : string[] = [];
            for (let pointerType of pointerTypes) {
                var eventName = this.pointerEvents[pointerType][eventType];
                    if (eventName) {
                        result.push(eventName);
                    }
                }
            return result.join(' ');
     }

    /**
     * Creates an instance of Swipe.
     *
     * @param {HTMLElement} element - An element on which a swipe event to be binded.
     * @param {*} SwipeEventHandlers - An event handler provided by the client in the following format.
     * {
     * 'start': function() { // start handler},
     * 'cancel': function() { // cancel handler },
     * 'move': function() { // move handler},
     * 'end': function() { // end handler }
     *  }
     * @param {string[]} [pointerTypes] - by default touch, pointer and mouse are supported.
     * But caller can specify the pointer type to use.
     * For example, the following initialization will use only touch.
     * new Swipe(myElement, someHandler, ['touch']);
     */
    constructor(private element: HTMLElement, private swipeEventHandlers: SwipeEventHandlers, pointerTypes?: string[]) {
      if (!this.element || !swipeEventHandlers) {
          return;
      }

      // If client doesn't provide any support all.
      this.pointerTypes = pointerTypes || ['touch', 'pointer', 'mouse'];

      // Add event hanlders to different events fired when an input is in motion.
      addEvents(this.element, this.getEvents(this.pointerTypes, 'start'), this.startHandler);
      addEvents(this.element, this.getEvents(this.pointerTypes, 'move'), this.moveHandler);
      addEvents(this.element, this.getEvents(this.pointerTypes, 'end'), this.endHandler);
      addEvents(this.element, this.getEvents(this.pointerTypes, 'cancel'), this.cancelHandler);
    }

    /**
     * Clearing up DOM bindings.
     */
    public tearDown() {
        removeEvents(this.element, this.getEvents(this.pointerTypes, 'start'), this.startHandler);
        removeEvents(this.element, this.getEvents(this.pointerTypes, 'move'), this.moveHandler);
        removeEvents(this.element, this.getEvents(this.pointerTypes, 'end'), this.endHandler);
        removeEvents(this.element, this.getEvents(this.pointerTypes, 'cancel'), this.cancelHandler);
    }

    /**
     * An end event handler, that will be called when the end event is fired.
     * For example, in case of 'pointerEvents' this method will be called on 'pointerup' event.
     *
     * @param {event} event = An event like mousedown, pointerdown or touchstart.
     * @private
     */
    private endHandler = (event : any) => {
        if (!this.active) {
            return;
        }
        this.active = false;
        let currentCoordinates = getCoordinates(event);

        if (this.validSwipe(currentCoordinates, this.startCoordinate)) {
            let swipeDirection = (currentCoordinates.x - this.startCoordinate.x) > 0 ? SwipeDirection.Left : SwipeDirection.Right;
            this.swipeEventHandlers.end && this.swipeEventHandlers.end(swipeDirection);
        }
      }

    /**
     * A start event handler, that will be called when the start event is fired.
     * For example, in case of 'pointerEvents' this method will be called when 'pointerDown' event is fired.
     *
     * @param {event} event = An event like mousedown, pointerdown or touchstart.
     * @private
     */
    private startHandler = (event: any) => {
        this.startCoordinate = getCoordinates(event);
        this.active = true;
        this.totalX = 0;
        this.totalY = 0;
        this.endCoordinate = this.startCoordinate;
        this.swipeEventHandlers.start && this.swipeEventHandlers.start(this.startCoordinate, event);
      }

    /**
     * A cancel event handler, that will be called when cancel event is fired.
     * For example, in case of 'pointerEvents' this method will be called when 'pointerCancel' event is fired.
     *
     * @param {event} event = A cancel event like touchcancel or pointercancel.
     * @private
     */
    private cancelHandler = (event: any) => {
          this.active = false;
          this.swipeEventHandlers.cancel && this.swipeEventHandlers.cancel(event);
        }

    /**
     * A move event handler. This handler will do the following things that will help to decide whether a user action is a swipe or not.
     * 1. If the total movment is less than the distance marker, it will ignore.
     * 2. If a user is moving more to the y direction instead of the x direction,
     *    it cancel the swipe and let the browser default behavior to take over.
     * 3. If the above two aren't met, the code cancel the default behavior of the event and call the move handler if any.
     * todo - bruk - add unit test.
     *
     * @param {event} event = A user pointer or mouse or touch event.
     *
     * @private
     */
    private moveHandler = (event: any) => {
        if (!this.active || !this.startCoordinate) {
            return;
        }

        var coords = getCoordinates(event);

        this.totalX += Math.abs(coords.x - this.endCoordinate.x);
        this.totalY += Math.abs(coords.y - this.endCoordinate.y);

        this.endCoordinate = coords;

        if (this.totalX < this.swipeDistanceMarker && this.totalY < this.swipeDistanceMarker) {
          return;
        }

        if (this.totalY > this.totalX) {
          this.active = false;
          this.swipeEventHandlers.cancel && this.swipeEventHandlers.cancel(event);
          return;
        }

        preventDefault(event);
        this.swipeEventHandlers.move && this.swipeEventHandlers.move(coords, event);
      }

     /**
     * check the validity of a swipe. For a swipe to be a valid swipe the following conditions should met.
     * 1. The vertical movement of the input should be less than the maximum allowed not to be considered as a vertical swipe.
     * 2. The horizoantal movement of the input should be greater than the minimum distance considered a swipe.
     * 3. The ratio of vertical movement to horizontal movement should be less than a given ratio -
     *    to make sure the movement is uni-directional.
     *
     * @private
     * @param {HtmlExtensions.Coordinate} currentCoordinates - the current coordinate by the time of the end of the swipe action.
     * @param {HtmlExtensions.Coordinate} startCoordinates - the starting coordinate when the swipe action started.
     * @returns {Boolean}
     */
    private validSwipe(currentCoordinates: Coordinate, startCoordinates: Coordinate) : Boolean {
        if (!startCoordinates) {
            return false;
        }
        var deltaY = Math.abs(currentCoordinates.y - startCoordinates.y);
        var deltaX = Math.abs(currentCoordinates.x - startCoordinates.x);
        return deltaY < this.maximumVerticalDistance &&
            deltaX > this.minimumHorizontalDistance &&
            deltaY / deltaX < this.maximumVerticalRatio;
    }
}

/**
 * An event handlers interface for different events that happen when a user swipes.
 *
 * @export
 * @interface SwipeEventHandlers
 */
export interface SwipeEventHandlers {
    start?: Function;
    move?: Function;
    end?: Function;
    cancel?: Function;
}

export enum SwipeDirection {
    Left,
    Right
}