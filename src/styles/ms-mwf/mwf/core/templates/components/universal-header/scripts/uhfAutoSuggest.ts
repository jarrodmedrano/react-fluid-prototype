/// <amd-module name="uhfAutoSuggest"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {AutoSuggest, IAutoSuggestNotification, IAutoSuggestData} from 'autosuggest';
import {selectFirstElement} from 'htmlExtensions';
import {parseJson} from 'utility';

/**
* @class - UhfAutoSuggest
* @classdesc - The UHF auto suggest component.
*              Extends AutoSuggest and adds the callback to the autosuggest service.
* @export
*/
export class UhfAutoSuggest extends AutoSuggest {
    /**
    * @name - autoSuggestSelector
    * @description - selector to use to find the AutoSuggest component in the document.
    * @static
    * @private
    * @type {string}
    */
    private static autoSuggestSelector = '#universal-header-search-auto-suggest-transparent';

    /**
    * @name - configElementSelector
    * @description - selector to use to find the UHF AutoSuggest configuration element in the document.
    * @static
    * @private
    * @type {string}
    */
    public static configElementSelector = '.js-global-head .c-search';

    /**
    * @name - configDataAttribute
    * @description - Name of the UHF autosuggest configuration data attribute.
    * @static
    * @private
    * @type {string}
    */
    public static configDataAttribute = 'data-seautosuggest';

    /**
    * @name - configurationDataAttribute
    * @description - Name of the UHF autosuggest configuration data attribute.
    * @static
    * @private
    * @type {string}
    */
    private static apiUrlAttribute = 'data-seautosuggestapi';

    /**
    * @name - autoSuggestUrl
    * @description - The UHF autosuggest callback service url.
    * @private
    * @type {string}
    */
    private autoSuggestUrl: string;

    /**
    * @name - configurationElement
    * @description - The element that holds the UHF autosuggest configuration.
    * @private
    * @type {HTMLElement}
    */
    private configurationElement: HTMLElement;

    /**
    * @name - params
    * @description - The configured UHF autosuggest parameters.
    * @private
    * @type {any}
    */
    private params: IUSSRequestParams;

    /**
    * @name - familyNames
    * @description - The autosuggest product search result family names.
    * @private
    * @type {any}
    */
    private familyNames: any;

    /**
    * @name - latestTimestampReceived
    * @description - Timestamp denoting the sent time of the latest api call that has come back. This is used to ensure api calls that
    *                come in out of order are ignored. 
    * @private
    * @type {number}
    */
    private latestTimestampReceived = 0;

    /**
    * @name - showProductResults
    * @description - Feature switch that allows uhfAutosuggest to show/hide product search result types.  
    * @private
    * @type {number}
    */
    private showProductResults = false;

    /**
    * @name - badImageDomain
    * @description - beginning of the broken domain. See bug #9000236
    * @static
    * @private
    * @type {string}
    */
    private static badImageDomain = '//compass.';

    /**
    * @name - goodImageDomain
    * @description - beginning of the good domain. See bug #9000236
    * @static
    * @private
    * @type {string}
    */
    private static goodImageDomain = 'https://compass-ssl.';

    /**
    * @name - constructor
    * @description - Constructor for the UhfAutoSuggest component.
    * @public
    */
    constructor() {
        super(selectFirstElement(UhfAutoSuggest.autoSuggestSelector));

        this.configurationElement = selectFirstElement(UhfAutoSuggest.configElementSelector);

        if (this.configurationElement) {
            this.autoSuggestUrl = this.configurationElement.getAttribute(UhfAutoSuggest.apiUrlAttribute);

            // Deserialize the settings json.
            let autoSuggestSettings: IUhfAutoSuggestConfig;

            try {
                autoSuggestSettings = parseJson(
                    this.configurationElement.getAttribute(UhfAutoSuggest.configDataAttribute)) as IUhfAutoSuggestConfig;
            } catch (exception) {
                // Not doing anything if the autosuggest config json fails to parse.
            }

            if (this.autoSuggestUrl && autoSuggestSettings && autoSuggestSettings.queryParams) {
                this.params = autoSuggestSettings.queryParams;
                this.familyNames = autoSuggestSettings.familyNames;
            }

            this.subscribe({ onMatchPatternChanged: this.autoSuggestCallback });
        }

        // product search results are only available in mwf v1.9.0+, this includes the ci version
        this.showProductResults = true;
        try {
            let mwfCssLinkParts = (selectFirstElement('link[href*=mwf]') as HTMLLinkElement).href.split('/'),
                mwfVersion = mwfCssLinkParts[mwfCssLinkParts.length - 3].toLowerCase();

            if (mwfVersion !== 'ci' && parseInt(mwfVersion.split('.')[1], 10) < 9) {
                this.showProductResults = false;
            }
        } catch (exception) {
            // do nothing. We want product results to show by default.
        }
    }

    /**
    * @name - autoSuggestCallback
    * @description - The autosuggest callback that calls the autosuggest service and populates the autosuggest with the results.
    * @public
    * @param {IAutoSuggestNotification} notification - The AutoSuggest notification.
    * @returns {void}
    */
    private autoSuggestCallback = (notification: IAutoSuggestNotification): void => {
        let asOptions = window.msCommonShell && window.msCommonShell.as;

        // use the custom search suggest callback, if available. 
        if (asOptions && asOptions.callback) {
            asOptions.callback({
                text: notification.pattern,
                response: this.updateSuggestions
            });

        // Partner is using the legacy callback pattern via msCommonShell.searchSuggestCallback
        } else if (asOptions && asOptions.legacyCallback) {
            asOptions.legacyCallback({
                text: notification.pattern,
                response: this.mapLegacyCallback
            });
        // use the custom search parameters
        } else if (asOptions && asOptions.ussAPIParams && asOptions.ussAPIParams.clientId && asOptions.ussAPIParams.sources) {
            asOptions.ussAPIParams.query = notification.pattern;

            // market is optional. Use page's locale if not specified by partner
            asOptions.ussAPIParams.market = asOptions.ussAPIParams.market || this.params.market; 
            let queryUrl = this.autoSuggestUrl + '?' + $.param(asOptions.ussAPIParams);
            this.ajaxCall(queryUrl, this.updateSuggestions);

        // use search parameters from data-*
        } else if (this.params && this.params.clientId && this.params.sources) {
            this.params.query = notification.pattern;
            let queryUrl = this.autoSuggestUrl + '?' + $.param(this.params);
            this.ajaxCall(queryUrl, this.updateSuggestions);
        }
    }


    /**
     * Maps the autosuggest schema from UHF Legacy service to {IAutosuggestData}
     * 
     * @private
     * 
     * @memberOf UhfAutoSuggest
     */
    private mapLegacyCallback = (oldResponse: any) : void => {
        let newResponse : IAutoSuggestData[] = [];
        for (let suggestion of oldResponse.suggestions) {
            if (suggestion.image && suggestion.title) {
                newResponse.push({
                    type: 'product',
                    value: {
                        title: suggestion.title,
                        targetUrl: suggestion.target,
                        imageSrc: suggestion.image
                    }
                });
            } else if (suggestion.title) {
                newResponse.push({
                    type: 'string',
                    value: suggestion.title
                });
            }
        }

        this.updateSuggestions(newResponse);
    }

   /**
    * @name - transformImageDomain
    * @description - Transforms domains starting with `compass.` to `compass-ssl.` This mitigates #9000236.
    * @public
    * @param {string} inputUrl - the Url to transform.
    * @returns {string} - the transformed url.
    */
    private static transformImageUrl(inputUrl : string) : string {
        if (inputUrl && inputUrl.indexOf(UhfAutoSuggest.badImageDomain) === 0) {
            return inputUrl.replace(UhfAutoSuggest.badImageDomain, UhfAutoSuggest.goodImageDomain);
        } else {
            return inputUrl;
        }
    } 

    /**
    * @name - ajaxCall
    * @description - Makes the ajax call, and sends the response to our data processor.
    * @public
    * @param {string} queryUrl - The queryUrl for the autosuggest api.
    * @param {Function} done - The callback which popluate the autosuggest results.
    * @returns {void}
    */
    private ajaxCall = (queryUrl: string, done: Function): void => {
        let timeStamp = Date.now(),
            request = new XMLHttpRequest(),
            that = this;
            
        request.open('GET', queryUrl, true);
        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    try {
                        that.processJsonData(timeStamp, JSON.parse(this.responseText), done);   
                    } catch (error) {
                        // do nothing.
                    }                    
                } else {
                    // Error :( - todo: joserd - logging
                }
            }
        };

        request.send();
        request = null;
    }

    /**
     * Maps the results to the IAutoSuggestData type, and then calls the done() function.
     * 
     * @private
     * @param {number} timeStamp
     * @param {IUSSV3Response} data
     * @param {Function} done
     * @returns
     * 
     * @memberOf UhfAutoSuggest
     */
    private processJsonData(timeStamp: number, data : IUSSV3Response, done: Function) {
        if (!data || !data.ResultSets || timeStamp < this.latestTimestampReceived) {
            return;
        }

        this.latestTimestampReceived = timeStamp;
        let response: IAutoSuggestData[] = [];
        for (let resultSet of data.ResultSets) {
            if (resultSet.Source.toLowerCase().indexOf('-terms') !== -1) {
                for (let suggestion of resultSet.Suggests) {
                    response.push(this.responseHandlers['Term'](<IUSSTermSuggestion>suggestion));
                }
            } else if (this.showProductResults && resultSet.Source.toLowerCase().indexOf('-products') !== -1) {
                for (let suggestion of resultSet.Suggests) {
                    response.push(this.responseHandlers['Product'](<IUSSProductSuggestion>suggestion));
                }
            }
        }

        if (response) {
            done(response);
        }
    }

    private responseHandlers = {
        'Term': (suggestion: IUSSTermSuggestion): IAutoSuggestData => {
            return {
                type: 'string',
                value: suggestion.Txt
            };
        },
        'Product': (suggestion: IUSSProductSuggestion): IAutoSuggestData => {
            let bgColor: string = null;

            for (let meta of suggestion.Metas) {
                if (meta.Key === 'AppBgColor') {
                    bgColor = meta.Value;
                    break;
                }
            }

            return {
                type: 'product',
                value: {
                    title: suggestion.Title,
                    category: this.familyNames[suggestion.Source],
                    backgroundColor: bgColor,
                    imageSrc: UhfAutoSuggest.transformImageUrl(suggestion.ImageUrl),
                    targetUrl: suggestion.Url,
                    isImageRound: suggestion.Source === 'MusicArtists' || suggestion.Source === 'VideoActor'
                }
            };
        }
    };
}

/**
 * @description the autosuggest settings that come from UHF service/module. These
 * settings are used to initialize uhfautosuggest and provide localized family names.
 * 
 * @interface UhfAutoSuggestConfig
 */
declare interface IUhfAutoSuggestConfig {
    // QSP key/values for USS api calls
    queryParams:
    {
        market: string;
        clientId: string;
        sources: string;
    };
    // localised family names for the corresponding USS product families
    familyNames:
    {
        Apps: string;
        Devices: string;
        Fees: string;
        Games: string;
        MusicAlbums: string;
        MusicTracks: string;
        MusicVideos: string;
        MusicArtists: string;
        OperatingSystem: string;
        Passes: string;
        Software: string;
        Movies: string;
        TV: string;
        CSV: string;
        VideoActor: string;
    };
};
