/// <amd-module name="uhfMeControl"/>
import * as MeControlLoader from 'uhfMeControlLoader';

export class UhfMeControl {
    /**
    * @name - selector
    * @description - selector to use to find me control components in the document.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-me';

    public constructor() {
        MeControlLoader.Loader.init();
    }
}