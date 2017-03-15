/// <amd-module name="publisher"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ObservableComponent} from 'observableComponent';

/**
* @interface - ISubscriber
* @classdesc - The ISubscriber base interface that all derived subscriber interfaces should inherit from.
*              This interface is intentionally left empty.
*              Classes that derive from Publisher should define their own ISubscriber derived interface to publish through.
*/
export interface ISubscriber {
}

/**
* @interface - IPublisher
* @classdesc - The IPublisher interface that all publishers must implement.
*/
export interface IPublisher {
    subscribe(subscriber: ISubscriber): boolean;
    unsubscribe(subscriber: ISubscriber): boolean;
}

/**
* @class - Publisher
* @classdesc - The abstract Publisher base class that implements IPublisher interface.
*              This allows subscribers to subscribe to notifications and notifications to be published to subscribers.
* @extends {ObservableComponent}
* @implements {IPublisher}
* @abstract
*/
export abstract class Publisher<T extends ISubscriber> extends ObservableComponent implements IPublisher {
    /**
    * @name - subscribers
    * @description - The list of current subscribers.
    * @private
    * @type {T[]}
    */
    private subscribers: T[];

    /**
    * @name - constructor
    * @description - Constructor for the Publisher.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected element?: HTMLElement, params: any = null) {
        super(element, params);
    }

    /**
    * @name - subscribe
    * @description - Called by subscribers who wish to subscribe to notifications.
    * @public
    * @param {T} subscriber - An object that implements ISubscriber.
    * @returns - True if the subscription is successful, otherwise false.
    */
    public subscribe(subscriber: T): boolean {
        if (!subscriber) {
            return false;
        }

        if (!this.subscribers) {
            this.subscribers = [];
        } else {
            if (this.subscribers.indexOf(subscriber) !== -1) {
                return false;
            }
        }

        this.subscribers.push(subscriber);
        return true;
    }

    /**
    * @name - unsubscribe
    * @description - Called by subscribers who wish to unsubscribe from notifications.
    * @public
    * @param {T} subscriber - A subscribed object that implements ISubscriber.
    * @returns - True if the unsubscription is successful, otherwise false.
    */
    public unsubscribe(subscriber: T): boolean {
        if (!subscriber || !this.subscribers || !this.subscribers.length) {
            return false;
        }

        let index = this.subscribers.indexOf(subscriber);

        if (index === -1) {
            return false;
        }

        this.subscribers.splice(index, 1);
        return true;
    }

    /**
    * @name - hasSubscribers
    * @description - Determines whether or not this publisher currently has any subscribers.
    * @protected
    * @returns - True if this publisher currently has any subscribers, otherwise false.
    */
    protected hasSubscribers(): boolean {
        return !!this.subscribers && (this.subscribers.length > 0);
    }

    /**
    * @name - initiatePublish
    * @description - Called by the derived class to initiate a publish to all subscribers.
    * @protected
    * @param {any} context - The publish context used by the derived class to determine which interface callback to make.
    * @returns {void}
    */
    protected initiatePublish(context?: any): void {
        if (this.hasSubscribers()) {
            for (let subscriber of this.subscribers) {
                this.publish(subscriber, context);
            }
        }
    }

    /**
    * @name - publish
    * @description - Abstract publish callback called by the initiatePublish method during a publish cycle.
    *                This method will be overridden by the derived class.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @abstract
    * @param {T} subscriber - The subscriber to make the callback to.
    * @param {any} context - The publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected abstract publish(subscriber: T, context?: any): void;

    /**
    * @name - update
    * @description - Update the component state.
    * @protected
    * @returns {void}
    */
    protected update(): void {
        // Nothing to do here but derived classes may override...
    }

    /**
    * @name - teardown
    * @description - Cleaning up the old state of the component.
    * @protected
    * @returns {void}
    */
    protected teardown(): void {
        // Nothing to do here but derived classes may override...
    }
}
