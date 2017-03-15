/// <amd-module name="multiHeroItem"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {HeroItemBase} from 'hero-item-base';

/**
* @class MultiHeroItem
* @classdesc - The MultiHeroItem module which extend HeroItemBase.
* @export
*/
export class MultiHeroItem extends HeroItemBase {
    /**
    * @name - selector
    * @memberof MultiHeroItem
    * @description - Selector to use to find MultiHeroItem components in the document.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static readonly selector = '.m-multi-hero-item';

    /**
    * @name - callToActionSelector
    * @memberof MultiHeroItem
    * @description - The CSS selector for the Call To Action anchor tags
    * @protected
    * @static
    * @readonly
    * @override
    * @type {string}
    */
    protected static readonly callToActionSelector = 'a';

    /**
    * @name - constructor
    * @memberof - MultiHeroItem
    * @description - Constructor for the MultiHeroItem class.
    * @param {HTMLElement} multiHeroItemElement - The native element to attach the MultiHeroItem behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected multiHeroItemElement: HTMLElement, params: any = null) {
        super(multiHeroItemElement, params);
    }
}