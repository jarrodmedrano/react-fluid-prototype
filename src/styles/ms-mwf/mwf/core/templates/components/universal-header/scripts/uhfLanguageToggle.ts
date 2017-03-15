/// <amd-module name="uhfLanguageToggle"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import { selectFirstElement, selectElements } from 'htmlExtensions';
import { trim } from 'stringExtensions';

/**
 * This component is the Language Togggle selector for multi-language sites.
 * The component initially loads with # sign as the href value until the
 * Javascript swaps out the # sign with an actual url specific to each lang-locale.
 * 
 * @class UhfLanguageToggle
 */
export class UhfLanguageToggle {
    /**
     * The URL used for each anchor in the Language Toggle
     * 
     * @private
     * @type {string}
     */
    private currentUrl: string;

    /**
     * Constructor for Uhf Language Toggle component.
     */
    constructor(private languageToggleElement: HTMLElement) {
    }

    /** Generate the URL used to replace the default href, # sign,
     *  for each locale language in the toggle dropdown.
     *  We use the abbreviated language provided in the data-language settings
     *  as a hint as to what we will need to swap out instead of trying to regex
     *  urls looking for lang-locales.
     *
     *@name - createLanguageToggleUrls
    * @public
    * @param {HTMLElement} element - the Language Toggle Element.
    * @param {string} urlToSwap - the url used to generate Language Toggle Links.
     *  
     * @returns void
     */
    public createLanguageToggleUrls(element: HTMLElement, urlToSwap: string = window.location.href): void {
        // if no url is provided, use the current page url
        this.currentUrl = urlToSwap.toLowerCase();

        let langSelector = selectFirstElement('ul', element);
        let anchors = selectElements('a', element) as HTMLElement[];

        if (!langSelector || !anchors) {
            return;
        }

        // the lang-locale of the page, for example fr-ca
        let lang = langSelector.getAttribute('data-localsettings');

        if (!lang) {
            return;
        }

        //let langLocaleReg = new RegExp(lang, 'i');
        let langLocaleArray = this.createLangLocaleArray(lang, this.currentUrl);

        for (let anchorIndex = 0, anchorsLength = anchors.length; anchorIndex < anchorsLength; anchorIndex++) {
            let href = trim(anchors[anchorIndex].getAttribute('href'));

            // 2-3 letter abbreviated language code for example FR
            let destinationLocale = anchors[anchorIndex].getAttribute('lang');

            if (href != null && !!destinationLocale && langLocaleArray && langLocaleArray.length > 1) {
                let newLangLocale = `${destinationLocale}-${langLocaleArray[1]}`.toLowerCase();
                this.setLangLocaleInUrls(anchors[anchorIndex], lang, newLangLocale);
            }
        }
    }

    // TODO: [joek] Deliverable 10158987: need to fire AWA tracking events if we can't swap url's
    /**
    * @name - setLangLocaleInUrls
    * @description - Each language toggle anchor shares the same locale,
    *                we only need to swap out the lang part of the lang-locale in the url.
                     fr-ca, en-ca, foo-ca
    * @public
    * @param {HTMLElement} anchor - the anchor for each Language in the Toggle.
    * @param {string} lang - the abbreviated language.
    * @param {string} newLangLocale - the lang-locale to be substituted.
    * @returns {void}
    */
    public setLangLocaleInUrls = (anchor: HTMLElement, lang: string, newLangLocale: string): void => {
        anchor.setAttribute('href', this.currentUrl.replace(`/${lang}/`, `/${newLangLocale}/`));
    }

    /**
    * @name - createLangLocaleArray
    * @description - Converts the lang-locale from a string (fr-ca) into an array
    *                The array is used for the url swapping logic.
    * @public
    * @param {string} langLocale - the lang-locale.
    * @param {string} currentUrl - the url used to generate the language toggle urls.
    * @returns {array}
    */
    public createLangLocaleArray = (langLocale: string, currentUrl: string): string[] => {
        let langLocaleArray: string[] = [];

        if (langLocale && currentUrl.match(langLocale)) {
            langLocaleArray = currentUrl.match(langLocale)[0].split('-');
            return langLocaleArray;
        }
        return;
    }
}
