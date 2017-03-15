/// <amd-module name="feed-hero-item"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {HeroItemBase} from 'hero-item-base';

/**
* @class FeedHeroItem
* @classdesc - The FeedHeroItem module which extend HeroItemBase.
* @export
*/
export class FeedHeroItem extends HeroItemBase {
    /**
    * @name - selector
    * @memberof FeedHeroItem
    * @description - Selector to use to find FeedHeroItem components in the document.
    * @public
    * @static
    * @readonly
    * @type {string}
    */
    public static readonly selector = '.m-feed-hero-item';

    /**
    * @name - callToActionSelector
    * @memberof FeedHeroItem
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
    * @memberof - FeedHeroItem
    * @description - Constructor for the FeedHeroItem class.
    * @param {HTMLElement} feedHeroItemElement - The native element to attach the FeedHeroItem behavior to.
    * @param {any} [params = null]- The parameter object with the class name to match against the MWF class
    *                               attribute value to determine whether or not to initialize this element
    *                               in the scope of the currently active constructor class hierarchy.
    */
    constructor(protected feedHeroItemElement: HTMLElement, params: any = null) {
        super(feedHeroItemElement, params);
    }
}