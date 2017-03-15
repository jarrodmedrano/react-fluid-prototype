/// <amd-module name="heroItem"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {HeroItemBase} from 'hero-item-base';
import {apiDeprecated} from 'utility';

/**
* @class HeroItem
* @classdesc - The HeroItem module which extends HeroItemBase.
* @export
*/
export class HeroItem extends HeroItemBase {
    /**
    * @name - selector
    * @memberof HeroItem
    * @description - Selector to use to find HeroItem components in the document.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static readonly selector = '.c-hero, .m-hero-item';

    /**
    * @name - constructor
    * @memberof HeroItem
    * @description - Constructor for the HeroItem component.
    * @param {HTMLElement} heroItemElement - the native element to attach the HeroItem behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected heroItemElement: HTMLElement, params: any = null) {
        super(heroItemElement, params);
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('HeroItem.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: HeroItem,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}