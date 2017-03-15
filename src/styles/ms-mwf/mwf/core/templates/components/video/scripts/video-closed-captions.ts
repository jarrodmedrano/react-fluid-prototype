/// <amd-module name='video-closed-captions'/>
import {TtmlParser, ITtmlEvent} from 'ttml-parser';
import {ITtmlContext} from 'ttml-context';
import {selectElements, addClass, removeClass, css, getClientRect, removeInnerHtml, toArray} from 'htmlExtensions';
import {getDimensions, IDictionaryStringString} from 'utility';

/**
* @interface ICcUserPreferences
* @classdesc - Describes the closed caption user preferences data structure.
* @export
*/
export interface ICcUserPreferences {
    text: IDictionaryStringString;
    window: IDictionaryStringString;
}

export class VideoClosedCaptions {
    /**
    * @name - ariaHidden
    * @description - aria-hidden attribute name.
    * @static
    * @private
    * @type {string}
    */
    private static ariaHidden = 'aria-hidden';

    /**
    * @name - userPreferences
    * @description - The user preference overrides for the closed captions.
    * @static
    * @public
    * @type {ICcUserPreferences}
    */
    public static userPreferences: ICcUserPreferences;

    /**
    * @name - ccLanguageId
    * @description - The currently selected closed captions language.
    * @private
    * @type {string}
    */
    private ccLanguageId: string;

    /**
    * @name - lastPlayPosition
    * @description - The last player position passed to updateCaptions.
    *                This is used to call updateCaptions again when the cc language is changed.
    *                Play could be paused at that time.
    * @private
    * @type {number}
    */
    private lastPlayPosition = 0;

    /**
    * @name - ttmlContext
    * @description - The ttmlContext for the current ttml document.
    * @private
    * @type {ITtmlContext}
    */
    private ttmlContext: ITtmlContext;

    /**
    * @constructor
    * @description - Constructor for the VideoClosedCaptions class.
    * @public
    * @param {HTMLElement} element - The element associated with this VideoClosedCaptions instance.
    */
    constructor(private element: HTMLElement) {
        this.ccLanguageId = null;
        this.resetCaptions();
    }

    /**
    * @name - setCcLanguage
    * @description - Updates the component if there is any change to its underlying DOM.
    * @public
    * @param {string} ccLanguageId - The desired new cc value.
    * @param {string} href - The ttml href.
    * @returns {void}
    */
    public setCcLanguage(ccLanguageId: string, href: string): void {
        if (!this.element || (ccLanguageId === this.ccLanguageId)) {
            return;
        }

        this.ttmlContext = null;

        this.resetCaptions();

        if (!href) {
            this.ccLanguageId = null;
            return;
        }

        this.ccLanguageId = ccLanguageId;
        this.loadClosedCaptions(href);
    }

    /**
    * @name - loadClosedCaptions
    * @description - Loads the close captioning ttml file.
    * @private
    * @param {string} href - The cc href.
    * @returns {void}
    */
    private loadClosedCaptions(href: string): void {
        if (href) {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = () => {
                if ((xhttp.readyState === 4) && (xhttp.status === 200)) {
                    this.onClosedCaptionsLoaded(xhttp.responseXML || xhttp.responseText);
                } else {
                    // TODO: 8479736: Update build step to remove commented code.
                    // The following console.log useful for debugging and is left in commented out for easy restoration.
                    ////// console.log('readystate(' + xhttp.readyState + ') status(' + xhttp.status + ')');
                }
            };

            // TODO: 8479736: Update build step to remove commented code.
            // The following console.log useful for debugging and is left in commented out for easy restoration.
            ////// xhttp.ontimeout = () => {
            ////// console.log('ontimeout');
            ////// };

            xhttp.open('GET', href, true);
            xhttp.setRequestHeader('Accept', 'text/xml, application/xml');
            xhttp.send();
        }
    }

    /**
    * @name - onClosedCaptionsLoaded
    * @description - Close captioning ttml file loaded handler.
    * @private
    * @param {XMLDocument} ttmlDocument - The ttml document containing the closed captions.
    * @returns {void}
    */
    private onClosedCaptionsLoaded(ttmlDocument: XMLDocument): void {
        if (!ttmlDocument) {
            return;
        }

        this.element.setAttribute(VideoClosedCaptions.ariaHidden, 'false');

        let id = this.element.id ? (this.element.id + '-') : '';
        let settingsOverrides = {
            // TODO: 8479736: Update build step to remove commented code.
            // The following console.log useful for debugging and is left in commented out for easy restoration.
            ////// log: console.log,
            idPrefix: id,
            fontMap: { 'default': 'Segoe ui, Arial' },
            relatedMediaObjectRegion: getDimensions(this.element)
        };

        this.ttmlContext = TtmlParser.parse(ttmlDocument, settingsOverrides);

        if (this.ttmlContext) {
            this.ttmlContext.setOwnerDocument(this.element.ownerDocument);

            if (this.ttmlContext.hasEvents()) {
                this.updateCaptions(this.lastPlayPosition);
            } else {
                this.element.setAttribute(VideoClosedCaptions.ariaHidden, 'true');
            }
        }
    }

    /**
    * @name - updateCaptions
    * @description - Update the captionContainer with the captions that correspond to the current time
    * @public
    * @param {number} playPosition - The video's play position to sync the captions to.
    * @returns {void}
    */
    public updateCaptions(playPosition: number): void {
        this.lastPlayPosition = playPosition;

        if (this.ttmlContext && this.ttmlContext.hasEvents()) {
            let tick = Math.floor(playPosition * 1000);

            // Make this.element visible so we can get it's dimensions, otherwise we'll get 0.
            this.element.setAttribute(VideoClosedCaptions.ariaHidden, 'false');

            let dimensions = getDimensions(this.element);
            // TODO: 8479736: Update build step to remove commented code.
            // The following console.log useful for debugging and is left in commented out for easy restoration.
            ////// console.log('width: ' + dimensions.width + ' height: ' + dimensions.height +
            ////// 'bottom: ' + css(this.element, 'bottom') + ' class: ' + this.element.className);

            if (this.ttmlContext.updateRelatedMediaObjectRegion(dimensions)) {
                // Call resetCaptions to force an update since the relatedMediaObjectRegion size has changed.
                this.resetCaptions();
            }

            if (this.ttmlContext.updateCurrentEvents(tick)) {
                // Then hide it while we clear and update it.
                this.element.setAttribute(VideoClosedCaptions.ariaHidden, 'true');

                removeInnerHtml(this.element);

                for (let cue of this.ttmlContext.getCues(tick)) {
                    this.applyUserPreferencesOverrides(cue);
                    (<Node>this.element).appendChild(cue);
                }

                // Then make it visible again.
                this.element.setAttribute(VideoClosedCaptions.ariaHidden, 'false');
            }
        }
    }

    /**
    * @name - resetCaptions
    * @description - Resets the ttml caption container.
    *                This should be called when user preferences change.
    * @public
    * @returns {void}
    */
    public resetCaptions(): void {
        if (this.ttmlContext) {
            this.ttmlContext.resetCurrentEvents();
        }

        if (this.element) {
            this.element.setAttribute(VideoClosedCaptions.ariaHidden, 'true');
            removeInnerHtml(this.element);
        }
    }

    /**
    * @name - applyUserPreferencesOverrides
    * @description - Applies user preference overrides to the specified cue.
    * @private
    * @param {HTMLElement} cue - The cue to apply any overrides to.
    * @returns {void}
    */
    private applyUserPreferencesOverrides(cue: HTMLElement): void {
        if (!VideoClosedCaptions.userPreferences) {
            return;
        }

        if (VideoClosedCaptions.userPreferences.text) {
            for (let element of selectElements('p, span, br', cue)) {
                for (let property in VideoClosedCaptions.userPreferences.text) {
                    if (VideoClosedCaptions.userPreferences.text.hasOwnProperty(property)) {
                        // if (property === 'font-size') {
                        // // TODO: Arun need to set the 'line-height' as well based on font-size.
                        // }

                        css(element, property, VideoClosedCaptions.userPreferences.text[property]);
                    }
                }
            }
        }

        if (VideoClosedCaptions.userPreferences.window) {
            for (let element of toArray(cue.children)) {
                for (let property in VideoClosedCaptions.userPreferences.window) {
                    if (VideoClosedCaptions.userPreferences.window.hasOwnProperty(property)) {
                        css(element, property, VideoClosedCaptions.userPreferences.window[property]);
                    }
                }
            }
        }
    }
}