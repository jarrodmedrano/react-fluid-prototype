/// <amd-module name="componentFactory"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {selectElementsT, documentReady, onDeferred, SafeBrowserApis} from 'htmlExtensions';
import {createPerfMarker} from 'utility';
import {isNullOrWhiteSpace} from 'stringExtensions';

/**
* @interface IEnumerateComponents
* @classdesc - The interface contract used for component enumeration callbacks.
* @export
*/
export interface IEnumerateComponents {
    /**
    * @memberof - IEnumerateComponents
    * @description - This is the component enumeration callback signature.
    * @public
    * @param {string} typeName - The type name of the component/module.
    * @param {any} component - The component/module instance.
    * @returns {boolean} - false if the enumeration should terminate, otherwise true.
    */
    (typeName: string, component: any): boolean;
}

/**
* @class ComponentFactory
* @classdesc - The ComponentFactory which handles creating and finding components.
* @export
*/
export class ComponentFactory {
    /**
    * @name - typeNameRegEx
    * @memberof ComponentFactory
    * @description - The regular expression to use to try to find an MWF type's name on
    *                browsers that don't support type.name (like IE)
    * @static
    * @private
    * @type {RegEx}
    */
    private  static typeNameRegEx = /function\s+(\S+)\s*\(/;

    /**
    * @name - onLoadTimeoutMs
    * @memberof ComponentFactory
    * @description - The timeout to wait for the onload event
    * @static
    * @public
    * @type {number}
    */
    public static onLoadTimeoutMs = 6000;

    /**
    * @name - onDeferredHappened
    * @memberof ComponentFactory
    * @description - Indicates whether or not the deferred event has already happened or not
    * @static
    * @public
    * @type {boolean}
    */
    public static onDeferredHappened = false;

    /**
    * @name - deferredFunctions
    * @memberof ComponentFactory
    * @description - The list of deferred functions to callback on deferred
    * @static
    * @public
    * @type {Function[]}
    */
    public static deferredFunctions: Function[] = [];

    /**
    * @name - create
    * @memberof ComponentFactory
    * @description - A factory method to create components.
    * @static
    * @public
    * @param {FactoryInput[]} factoryInputs - an array of ComponentFactory.FactoryInput object.
    * FactoryInput object has the following properties.
    * 1. selector - the css selector to bind the component to.
    *               A component that will be created using a factory *MUST* have a default selector.
    * 2. context - the context css selector.
    * 2. eventToBind - an event that will be listned before a component binded to the DOM.
    * 3. component - a component class from where a component object to be created from.
    *                You can also use c to save on bytes.
    * 4. elements - an optional array of existing elements to bind to instead of a selector to find elements by.
    * 5. callback - a call back function that will be called when the component is successfully created.
    * 
    * Example - 1 - Creating components with default selector.
    * ComponentFactory.create([{'component': Carousel}, 
    *                          {'component': Slider}]);
    * Or
    * ComponentFactory.create([{'c': Carousel},
    *                          {'c': Slider}]);
    * 
    * Example - 2 - Creating component with a given selector.
    * ComponentFactory.create([{'component': Carousel, selector: '#myCarousel'}
    *                         ,{'component': Slider, selector: '#mySlider'}]);
    * Or
    * ComponentFactory.create([{'c': Carousel, selector: '#myCarousel'}
    *                         ,{'c': Slider, selector: '#mySlider'}]);
    * 
    * Example - 3 - Creating component with a given selector and a callback function.
    * Callback function example:
    * function setSliderMax(slider) {
    *      slider.setValue(120);
    * }
    * 
    * ComponentFactory.create([{'component': Slider, selector: '#myslider', callback: setSliderMax}]);
    * Or
    * ComponentFactory.create([{'c': Slider, selector: '#myslider', callback: setSliderMax}]);
    * 
    * Example - 4 - creating component with a given selector in a given context.
    * 
    * ComponentFactory.create([{'component': Slider, selector: '#myslider', callback: setSliderMax, context: '.myContainer'}]);
    * 
    * Example - 5 - creating component for an existing element.
    * 
    * ComponentFactory.create([{'component': Slider, eventToBind: 'DOMContentLoaded', elements: [this.myslider], callback: setSliderMax}]);
    * @returns {void}
    */
    public static create(factoryInputs: FactoryInput[]): void {
        for (let factoryInput of factoryInputs) {
            if (!factoryInput.c && !factoryInput.component) {
                throw 'factoryInput should has either component or c to tell the factory what component to create.' +
                'Eg.ComponentFactory.create([{ c: Carousel] or ComponentFactory.create([component: Carousel]))';
            }

            ComponentFactory.createComponent(factoryInput.component || factoryInput.c, factoryInput);
        }
    }

    /**
    * @name - createComponent
    * @memberof ComponentFactory
    * @description - Creates a component, Bind to Html and execute a call back function after the component is created.
    * @static
    * @private
    * @template T - a generic type.
    * @param {{ new (componentContainer: HTMLElement): T; selector: string }} type - the type of componet to be created.
    * @param {FactoryInput} [input] - the FactoryInput object that has call back.
    * @returns {void}
    */
    private static createComponent<T>(type: { new (componentContainer: HTMLElement, params: any): T; selector: string },
        input?: FactoryInput): void {
        if (!type) {
            return;
        }
        let eventToBind = (input && input.eventToBind) ? input.eventToBind : '';
        let selector = (input && input.selector) ? input.selector : type.selector;
        let context = (input && input.context) ? input.context : null;
        let results: T[] = [];
        let bindFunction = (typeName: string, selector: string, params: any) => {
            let elements = input.elements ? input.elements : selector ? selectElementsT<any>(selector, context) : [document.body as any];

            for (let componentContainer of elements) {
                if (!componentContainer.mwfInstances) {
                    componentContainer.mwfInstances = [];
                }

                if (!componentContainer.mwfInstances[typeName]) {
                    let component = new type(componentContainer, params);

                    componentContainer.mwfInstances[typeName] = component;
                    results.push(component);
                } else {
                    results.push(componentContainer.mwfInstances[typeName] as T);
                }
            }
        };

        switch (eventToBind) {
            // todo - bruk - may need to review if there is a need to bind to a different state.
            case 'DOMContentLoaded':
                documentReady(() => {
                    ComponentFactory.callBindFunction(type, selector, bindFunction, input, results);
                });
                break;
            case 'load':
            default:
                if (ComponentFactory.onDeferredHappened) {
                    ComponentFactory.callBindFunction(type, selector, bindFunction, input, results);
                } else {
                    ComponentFactory.deferredFunctions
                        .push(() => ComponentFactory.callBindFunction(type, selector, bindFunction, input, results));
                    break;
                }
        }
    }

    /**
    * @name - callBindFunction
    * @memberof ComponentFactory
    * @description - A call to a function that will bind to DOM and wrapped with perf marker and call back call. 
    * @static
    * @private
    * @template T
    * @param {any} type - The type of the component. Used for perf marker to correlate to our components.
    * @param {string} selector - A selector a user provided.
    * @param {Function} bindFunction - A function that actually bind to the DOM
    * @param {FactoryInput} [input = null] - Factory input that has a call back.
    * @param {T[]} results - results that has list of component containers to execute the callback against.
    * @returns {void}
    */
    private static callBindFunction<T>(type: any,
        selector: string,
        bindFunction: Function,
        input: FactoryInput = null,
        results: T[]): void {
        let typeName = ComponentFactory.getTypeName(type);
        let markerName = typeName || selector || '';

        createPerfMarker(markerName + '_Begin');
        bindFunction(typeName, selector, { mwfClass: typeName });
        createPerfMarker(markerName + '_End');

        if (input && input.callback) {
            input.callback(results);
        }
    }

    /**
    * @name - getTypeName
    * @memberof ComponentFactory
    * @description - Gets the name of type if it can.
    * @static
    * @private
    * @param {any} type - The type to try to obtain the name of.
    *                     NOTE: type is already validated at the public ComponentFactory.create() level.
    * @returns {string} - The type's name if determined, otherwise undefined.
    */
    private static getTypeName(type: any): string {
        // todo - bug#10921102 - this is a temporary fix to resolve bug#10874769.
        if (type.typeName) {
            return type.typeName;
        }

        if (type.name) {
            return type.name;
        }

        let parts = ComponentFactory.typeNameRegEx.exec(type.toString());

        if (parts && (parts.length > 1)) {
            return parts[1];
        }
    }

    /**
    * @name - enumerateComponents
    * @memberof ComponentFactory
    * @description - Enumerates the MWF component/module instances associated with the specified HTMLElment.
    * @public
    * @static
    * @param {HTMLElement} element - The element to enumerate the MWF component/modules of.
    * @param {IEnumerateComponents} callback - The enumeration callback to call for each associatedMWF component/module.
    *                                          The callback can return false to terminate the enumeration,
    * @returns {void}
    */
    public static enumerateComponents(element: HTMLElement, callback: IEnumerateComponents): void {
        if (!element || !callback) {
            return;
        }

        let mwfInstances = (<any>element).mwfInstances;

        for (let property in mwfInstances) {
            if (mwfInstances.hasOwnProperty(property)) {
                let mwfInstance = mwfInstances[property];

                if (mwfInstance) {
                    if (!callback(property, mwfInstance)) {
                        break;
                    }
                }
            }
        }
    }
}

(
    // A self executor to register on deferred callback once.
    () => {
        onDeferred(() => {
            let registeredFunctions = ComponentFactory.deferredFunctions;
            if (!registeredFunctions || registeredFunctions.length > 0) {
                for (let registerFunction of registeredFunctions) {
                    if (typeof registerFunction === 'function') {
                        SafeBrowserApis.requestAnimationFrame.call(window, registerFunction);
                    }
                }
            }
            ComponentFactory.onDeferredHappened = true;
        }, ComponentFactory.onLoadTimeoutMs);
    }
)();

export interface FactoryInput {
    selector?: string;
    context?: HTMLElement;
    eventToBind?: string;
    component?: any;
    c?: any;
    elements?: any[];
    callback?: Function;
}