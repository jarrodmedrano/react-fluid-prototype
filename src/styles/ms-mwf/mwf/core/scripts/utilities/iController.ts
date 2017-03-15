/// <amd-module name="IController"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {IPublisher, ISubscriber} from 'publisher';

/**
* @interface IControllerNotification
* @classdesc - The data contract interface used for controller notifications.
* @export
*/
export interface IControllerNotification {
    previousIndex: number;
    currentIndex: number;
}

/**
* @interface IControllerSubscriber
* @classdesc - The interface which controller notification subscribers must implement.
* @extends {ISubscriber}
* @export
*/
export interface IControllerSubscriber extends ISubscriber {
    onControllerIndexChanged(notification: IControllerNotification): void;
}

/**
* @interface IController
* @classdesc - The interface which controller's must implement.
* @extends {IPublisher}
* @export
*/
export interface IController extends IPublisher {
    setControllerIndex(toIndex: number, forceFocus: boolean): boolean;
}