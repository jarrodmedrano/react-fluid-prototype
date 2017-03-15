/// <amd-module name="logo-controller"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {SequenceIndicator} from 'sequenceIndicator';

/**
* @class - LogoController
* @classdesc - The LogoController class.
*              This class extends the sequenceIndicator class to use logos instead of dots.
* @extends {SequenceIndicator}
* @export
*/
export class LogoController extends SequenceIndicator {
    /**
    * @name - selector
    * @memberof - LogoController
    * @description - The LogoController component selector.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static readonly selector = '.c-logo-controller';

    /**
    * @name - typeName
    * @memberof - LogoController
    * @description - The LogoController typename.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static typeName = 'LogoController';

    /**
    * @name - itemSelector
    * @memberof - LogoController
    * @description - The selector for LogoController items.
    * @protected
    * @static
    * @readonly
    * @override
    * @type {string}
    */
    protected static readonly itemSelector = '[role="tab"]';

    /**
    * @name - constructor
    * @memberof - LogoController
    * @description - Constructor for the LogoController class.
    * @param {HTMLElement} logoControllerElement - The native element to attach the LogoController behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected logoControllerElement: HTMLElement, params: any = null) {
        super(logoControllerElement, params);
    }
}