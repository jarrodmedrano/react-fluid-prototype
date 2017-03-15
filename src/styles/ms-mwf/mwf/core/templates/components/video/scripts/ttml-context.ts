/// <amd-module name="ttml-context"/>
import {ITtmlEvent, TtmlParser} from 'ttml-parser';
import {TtmlSettings, xmlNS} from 'ttml-settings';
import {addClass, css, getText, nodeListToArray, selectElements} from 'htmlExtensions';
import {trim, isNullOrWhiteSpace, format} from 'stringExtensions';
import {extend, getDimensions, IClientDimension, IDictionaryStringString} from 'utility';

// Timed Text Markup Language (TTML).
// See http://www.w3.org/TR/ttml1/ for more details.

/**
* @interface ITtmlContext
* @classdesc - The TtmlContext interface contract.
* @export
*/
export interface ITtmlContext {
    setOwnerDocument(ownerDocument: Document): void;
    updateRelatedMediaObjectRegion(dimensions: IClientDimension): void;
    resetCurrentEvents(): void;
    hasEvents(): boolean;
    updateCurrentEvents(time: number): boolean;
    getCues(time: number): HTMLElement[];
}

/**
* @interface ITtmlTranslationResult
* @classdesc - The ITtmlTranslationResult interface contract.
*/
interface ITtmlTranslationResult {
    outerNode: HTMLElement;
    innerNode: HTMLElement;
    inheritableStyleSet?: IDictionaryStringString;
}

/**
* @interface ITtmlPruneResult
* @classdesc - The ITtmlPruneResult interface contract.
*/
interface ITtmlPruneResult {
    prunedElement: Element;
    hasPreservedContent: boolean;
}

/**
* @class - TtmlContext
* @classdesc - The TtmlContext. An instance of this class is returned from the TttmlParser.parse() method after it
*              parses a ttml file. This context is then used by the VideoClosedCaptions object to get the captions
*              for any play position of the video.
* @export
*/
export class TtmlContext implements ITtmlContext {
    /**
    * @name - ownerDocument
    * @description - The owner document for this context. Used to create html elements.
    * @private
    * @type {Document}
    */
    private ownerDocument: Document;

    /**
    * @name - currentEvents
    * @description - The current set of temporally active events.
    * @private
    * @type {ITtmlEvent[]}
    */
    private currentEvents: ITtmlEvent[];

    /**
    * @name - currentEventsTime
    * @description - The time the currentEvents was populated.
    * @private
    * @type {number}
    */
    private currentEventsTime: number;

    /**
    * @name - events
    * @description - The set of all ttml events.
    * @public
    * @type {ITtmlEvent[]}
    */
    public events: ITtmlEvent[];

    /**
    * @name - settings
    * @description - The ttml settings.
    * @public
    * @type {TtmlSettings}
    */
    public settings: TtmlSettings;

    /**
    * @name - styleSetCache
    * @description - The ttml styleSet cache.
    * @public
    * @type {IDictionaryStringString[]}
    */
    public styleSetCache: IDictionaryStringString[];

    /**
    * @name - rootContainerRegion
    * @description - The root container region.
    * @public
    * @type {Element}
    */
    public rootContainerRegion: Element;

    /**
    * @name - root
    * @description - The root element.
    * @public
    * @type {Element}
    */
    public root: Element;

    /**
    * @name - body
    * @description - The body element.
    * @public
    * @type {Element}
    */
    public body: Element;

    /**
    * @name - layout
    * @description - The layout element.
    * @public
    * @type {Element}
    */
    public layout: Element;

    /**
    * @const­ructor
    * @description - Constructor for the TtmlContext class.
    * @public
    */
    constructor() {
        // Nothing to do at this time...
    }

    /**
    * @name - setOwnerDocument
    * @description - Set the context's owner document. It will use this to create elements during translation.
    * @public
    * @param {Document} ownerDocument - The owner document for this context.
    * @returns {void}
    */
    public setOwnerDocument(ownerDocument: Document): void {
        this.ownerDocument = ownerDocument;
    }

    /**
    * @name - updateRelatedMediaObjectRegion
    * @description - Updates the context's media object region.
    * @public
    * @param {IClientDimension} dimensions - The desired dimensions for the region.
    * @returns {boolean} - True if the dimensions where changed, otherwise false.
    */
    public updateRelatedMediaObjectRegion(dimensions: IClientDimension): boolean {
        if (!this.settings.relatedMediaObjectRegion ||
            (dimensions.width !== this.settings.relatedMediaObjectRegion.width) ||
            (dimensions.height !== this.settings.relatedMediaObjectRegion.height)) {

            this.settings.relatedMediaObjectRegion = {
                width: dimensions.width,
                height: dimensions.height
            };

            return true;
        }

        return false;
    }

    /**
    * @name - hasEvents
    * @description - Indicates whether or not the context has events.
    * @public
    * @returns {boolean} - True if the context has events, otherwise false.
    */
    public hasEvents(): boolean {
        return this.events && !!this.events.length;
    }

    /**
    * @name - resetCurrentEvents
    * @description - Resets the context's currentEvents.
    * @public
    * @returns {void}
    */
    public resetCurrentEvents(): void {
        this.currentEvents = [];
    }

    /**
    * @name - updateCurrentEvents
    * @description - Updates the context's currentEvents if there are new events for the specified time.
    * @public
    * @param {number} time - The time to get events for.
    * @returns {boolean} - True if the events for the specified time are different than the currentEvents, otherwise false.
    */
    public updateCurrentEvents(time: number): boolean {
        let timeEvents = this.getTemporallyActiveEvents(time);

        // As a shortcut compare lengths first.
        let currentEventsLength = this.currentEvents ? this.currentEvents.length : 0;
        let timeEventsLength = timeEvents ? timeEvents.length : 0;

        if (currentEventsLength !== timeEventsLength) {
            this.currentEventsTime = time;
            this.currentEvents = timeEvents;
            return true;
        }

        if (this.currentEvents) {
            for (let index = 0; index < currentEventsLength; index++) {
                if (this.currentEvents[index].time !== timeEvents[index].time) {
                    this.currentEventsTime = time;
                    this.currentEvents = timeEvents;
                    return true;
                }
            }
        }

        return false;
    }

    /**
    * @name - getTemporallyActiveEvents
    * @description - Get the list of temporally active events for the specified time.
    * @private
    * @param {number} time - The time to get the active events for.
    * @returns {ITtmlEvent[]} - The set of active events for the specified time, otherwise an empty [].
    */
    private getTemporallyActiveEvents(time: number): ITtmlEvent[] {
        return this.events.filter((event) => {
            return event.element ? this.isTemporallyActive(event.element, time) : true;
        });
    }

    /**
    * @name - isTemporallyActive
    * @description - Determines whether or not the specified element is temporally active at the specified time.
    * @private
    * @param {HTMLElement} element - The element to check.
    * @param {number} time - The time to check against.
    * @returns {boolean} - True if the element is active at the specified time, otherwise false.
    */
    private isTemporallyActive(element: Element, time: number): boolean {
        return (((parseInt(element.getAttribute('data-time-start'), 10) || 0) <= time) &&
            (time < (parseInt(element.getAttribute('data-time-end'), 10) || 0)));
    }

    /**
    * @name - getCues
    * @description - The set of cues that apply to the specified time.
    * @public
    * @param {number} time - The time to get cues for.
    * @returns {HTMLElement[]} - The set of cues for the specified time, otherwise an empty [].
    */
    public getCues(time: number): HTMLElement[] {
        let cues: HTMLElement[] = [];

        if (this.currentEventsTime !== time) {
            this.updateCurrentEvents(time);
        }

        // Find all the region elements in the TTML namespace.
        let preserveSpace = (TtmlParser.getAttributeNS(this.root, 'space', xmlNS) === 'preserve');
        let regions = (this.layout ? this.layout.getElementsByTagNameNS(this.settings.ttmlNamespace, 'region') : []) as HTMLElement[];

        for (let region of regions) {
            let regionId = TtmlParser.getAttributeNS(region, 'id', xmlNS);
            let anonymousId = region.getAttribute('data-isanonymous');

            if (anonymousId || regionId) {
                let translation = this.translate(region, this.settings.defaultRegionStyle, preserveSpace, time, this.translateToHtml);

                if (translation.outerNode) {
                    let innerNode = translation.innerNode;
                    let outerNode = translation.outerNode;

                    // Create a new subtree for the body element, prune elements
                    // not associated with the region, and if its not empty then
                    // select it into this region by adding it to div container.
                    for (let event of this.events) {
                        if (event.element) {
                            if (this.isInRegion(event.element, anonymousId ? null : regionId)) {
                                let pruneResult = this.prune(
                                    event.element,
                                    translation.inheritableStyleSet,
                                    preserveSpace,
                                    time,
                                    this.translateToHtml);
                                let cueBody = pruneResult.prunedElement;

                                if ((!pruneResult.hasPreservedContent) && cueBody && (!trim(getText(cueBody)).length)) {
                                    cueBody = null;
                                }

                                if (cueBody) {
                                    innerNode.appendChild(cueBody);
                                }
                            }
                        }
                    }

                    let showAlways = (outerNode.getAttribute('data-showBackground') === 'always');

                    if (showAlways || innerNode.children.length) {
                        if (showAlways) {
                            // Just needed internally for the previous check, don't pass through on the cue.
                            outerNode.removeAttribute('data-showBackground');
                        }

                        cues.push(outerNode);
                    }
                }
            }
        }

        // If we ended up with any displayable cues add them all to the rootContainerRegion cue.
        if (cues.length) {
            let rcr = this.translate(this.rootContainerRegion, { overflow: 'hidden', padding: '0' }, false, time, this.translateToHtml);

            for (let cue of cues) {
                rcr.innerNode.appendChild(cue);
            }

            cues = [];
            cues.push(rcr.outerNode);
        }

        return cues;
    }

    /**
    * @name - translate
    * @description - Convert a ttml element into the equivalent in another format via the supplied translator function.
    * @private
    * @param {Element} element - The ttml element to translate.
    * @param {IDictionaryStringString} inheritedStyleSet - The element's inherited style set.
    * @param {boolean} preserveSpace - Indicates whether or not space should be preserved.
    * @param {number} time - The time to translate against. Elements and styles are temporally transient.
    * @param {Function} translator - The translator function to use. Originally supported both xml/html but is always using html in MWF.
    * @returns {ITtmlTranslationResult} - A ITtmlTranslationResult instance containing the translation results.
    */
    private translate(
        element: Element,
        inheritedStyleSet: IDictionaryStringString,
        preserveSpace: boolean,
        time: number,
        translator: Function): ITtmlTranslationResult {
        let translation: ITtmlTranslationResult;
        let computedStyleSet: IDictionaryStringString;

        if (this.isTemporallyActive(element, time)) {
            let tag = this.getTagNameEquivalent(element);

            computedStyleSet = this.getComputedStyleSet(element, inheritedStyleSet, tag, time);

            if (computedStyleSet['display'] !== 'none') {
                let applicableStyleSet = this.getApplicableStyleSet(computedStyleSet, tag);

                translation = translator(element, applicableStyleSet, preserveSpace);

                // TODO: 8479736: Update build step to remove commented code.
                // The following console.log useful for debugging and is left in commented out for easy restoration.
                ////// if (this.settings.log) {
                ////// let s = '';

                ////// for (let style in inheritedStyleSet) {
                ////// if (inheritedStyleSet.hasOwnProperty(style)) {
                ////// s += style + ':' + inheritedStyleSet[style] + '; ';
                ////// }
                ////// }

                ////// this.settings.log(format('translate  elem({0})  inheritedStyle({1})', element.localName, s.trim()));

                ////// s = '';

                ////// for (let style in computedStyleSet) {
                ////// if (computedStyleSet.hasOwnProperty(style)) {
                ////// s += style + ':' + computedStyleSet[style] + '; ';
                ////// }
                ////// }

                ////// this.settings.log(format('translate  elem({0})   computedStyle({1})', element.localName, s.trim()));

                ////// s = '';

                ////// for (let style in applicableStyleSet) {
                ////// if (applicableStyleSet.hasOwnProperty(style)) {
                ////// s += style + ':' + applicableStyleSet[style] + '; ';
                ////// }
                ////// }

                ////// this.settings.log(format('translate  elem({0})   applicableStyle({1})', element.localName, s.trim()));

                ////// if (translation.outerNode) {
                ////// this.settings.log(format(
                ////// 'translate  elem({0})   html({1})',
                ////// element.localName,
                ////// translation.outerNode.outerHTML));
                ////// }
                ////// }
            }
        }

        if (!translation) {
            return { outerNode: null, innerNode: null, inheritableStyleSet: null };
        }

        return {
            outerNode: translation.outerNode,
            innerNode: translation.innerNode,
            inheritableStyleSet: this.getInheritableStyleSet(computedStyleSet)
        };
    }

    /**
    * @name - translateToHtml
    * @description - Convert a ttml element into the its equivalent html element.
    * @private
    * @param {Element} element - The ttml element to translate.
    * @param {IDictionaryStringString} applicableStyleSet - The style set applicable to this element.
    * @param {boolean} preserveSpace - Indicates whether or not space should be preserved.
    * @returns {ITtmlTranslationResult} - A ITtmlTranslationResult instance containing the translation results.
    */
    private translateToHtml = (
        element: Element,
        applicableStyleSet: IDictionaryStringString,
        preserveSpace: boolean): ITtmlTranslationResult => {
        let translation: HTMLElement;
        let innerNode: HTMLElement;
        let name = this.getTagNameEquivalent(element);
        let htmlName = '';
        let htmlClass = '';

        switch (name) {
            case 'ttml:region':
                // To simulate the ::cue selector.
                htmlClass = 'cue ';
                // Intentionally fall through...
            case 'ttml:rootcontainerregion':
            case 'ttml:body':
            case 'ttml:div':
                htmlName = 'div';
                break;
            case 'ttml:p':
                htmlName = 'p';
                break;
            case 'ttml:span':
                htmlName = 'span';
                break;
            case 'ttml:br':
                htmlName = 'br';
                break;
            default:
                break;
        }

        let role = TtmlParser.getAttributeNS(element, 'role', this.settings.ttmlMetaNamespace);

        if (role) {
            htmlClass +=  ' ' + (role);
        }

        let agent = TtmlParser.getAttributeNS(element, 'agent', this.settings.ttmlMetaNamespace);

        if (agent) {
            htmlClass += ' ' + (agent);
        }

        // Hack until display:ruby on other elements works.
        if (role === 'x-ruby') {
            htmlName = ('ruby');
        } else if (role === 'x-rubybase') {
            htmlName = ('rb');
        } else if (role === 'x-rubytext') {
            htmlName = ('rt');
        }

        if (!isNullOrWhiteSpace(htmlName)) {
            translation = TtmlContext.defaultStyle(this.ownerDocument.createElement(htmlName));
            addClass(translation, trim(htmlClass));

            let title = TtmlParser.getAttributeNS(element, 'title', this.settings.ttmlMetaNamespace);

            if (title) {
                translation.setAttribute('title', title);
            }

            // This code can help for alignment debugging.
            //////if (name === 'ttml:p') {
            ////// translation$.css({'background-color': 'lime'});
            //////}
            //////if (name === 'ttml:span') {
            ////// translation$.css({'background-color': 'pink', 'display': 'inline-block'});
            //////}

            let id = TtmlParser.getAttributeNS(element, 'id', xmlNS);

            if (id && this.settings.idPrefix) {
                // Migrate the ttml doc id's over to the html markup.
                // Use idPrefix to ensure there are no name clases on id's already in target doc.
                translation.setAttribute('id', this.settings.idPrefix + id);
            }

            if (name === 'ttml:region') {
                // To get a <region> to display properly we are actually going to need to create two nested <div>s
                // This is because for displayAlign to work we need a table-cell <div> inside a table <div>.
                innerNode = translation.appendChild(TtmlContext.defaultStyle(this.ownerDocument.createElement('div'))) as HTMLElement;
                css(innerNode, 'display', 'table');
                css(innerNode, 'border-spacing', '0');
                css(innerNode, 'cell-spacing', '0');
                css(innerNode, 'cell-padding', '0');
                css(innerNode, 'width', '100%');
                css(innerNode, 'height', '100%');
                innerNode = innerNode.appendChild(TtmlContext.defaultStyle(this.ownerDocument.createElement('div'))) as HTMLElement;
                css(innerNode, 'display', 'table-cell');

                // Apply the displayAlign style to inner table-cell <div>
                if (applicableStyleSet['displayAlign']) {
                    this.translateStyle(name, innerNode, { 'displayAlign': applicableStyleSet['displayAlign'] });

                    // Then remove displayAlign from the applicableStyleSet so as not to also later apply it to the outer table <div>
                    applicableStyleSet['displayAlign'] = null;
                }
            }

            // If we're preserving space add an inner <span> with 'white-space: pre'.
            // This is how we implement preserving space in css and we need an inner
            // span because the 'real' span will already be setting it's css white-space
            // value to either normal or nowrap and we can't collide with that.
            if (preserveSpace && (name === 'ttml:span')) {
                innerNode = translation.appendChild(TtmlContext.defaultStyle(this.ownerDocument.createElement('span'))) as HTMLElement;
                css(innerNode, 'white-space', 'pre');
            }

            // Default some css properties that we don't want to inadvertantly end up
            // inheriting values for that might cause adverse layout impacts for us.
            css(translation, 'position', 'static');
            css(translation, 'width', '100%');

            // Copy style from element over to html, translating into CSS as we go.
            this.translateStyle(name, translation, applicableStyleSet);
        }

        return { outerNode: translation, innerNode: innerNode ? innerNode : translation };
    }

    /**
    * @name - translateStyle
    * @description - Translate the ttml styles in a styleSet to their equivalent css styles and apply them to the specified html element.
    * @private
    * @param {string} tagName - The ttml element tagName. All styles do not apply to all tagNames.
    * @param {Element} element - The ttml element to translate.
    * @param {IDictionaryStringString} applicableStyleSet - The style set applicable to this element.
    * @returns {void}
    */
    private translateStyle(tagName: string, element: HTMLElement, applicableStyleSet: IDictionaryStringString): void {
        for (let style in applicableStyleSet) {
            if (applicableStyleSet[style]) {
                this.applyStyle(element, tagName, style, applicableStyleSet[style]);
            }
        }
    }

    /**
    * @name - prune
    * @description - Convert the element if it is in the region, then recurse into its contents.
    *                If it ends up with no children then we dont add it to the region, we prune it.
    * @private
    * @param {Element} element - The ttml element to translate.
    * @param {IDictionaryStringString} inheritedStyleSet - The style set inherited by this element.
    * @param {boolean} preserveSpace - Indicates whether or not space should be preserved.
    * @param {number} time - The time to translate against. Elements and styles are temporally transient.
    * @param {Function} translator - The translator function to use. Originally supported both xml/html but is always using html in MWF.
    * @param {boolean} [ignoreAncestors = false] - Specifies whether or not to ignore the element's ancestors.
    * @returns {ITtmlPruneResult} - A ITtmlPruneResult instance containing the prune results.
    */
    private prune(
        element: Element,
        inheritedStyleSet: IDictionaryStringString,
        preserveSpace: boolean,
        time: number,
        translator: Function,
        ignoreAncestors: boolean = false): ITtmlPruneResult {
        let outerNode: Element;
        let hasPreservedContent = false;

        let translation = this.translate(element, inheritedStyleSet, preserveSpace, time, translator);

        if (translation.outerNode !== null) {
            let tag = this.getTagNameEquivalent(element);

            outerNode = translation.outerNode;
            let innerNode = translation.innerNode;

            for (let child of nodeListToArray<Node>(element.childNodes)) {
                if (child.nodeType === Node.COMMENT_NODE) {
                    // Do nothing.
                } else if (child.nodeType === Node.TEXT_NODE) {
                    innerNode.appendChild(document.createTextNode((<Text>child).data));

                    if (preserveSpace && (tag === 'ttml:span')) {
                        hasPreservedContent = true;
                    }
                } else {
                    let childPreserveSpace = preserveSpace;
                    let spaceAttr = TtmlParser.getAttributeNS(<Element>child, 'space', xmlNS);

                    if (spaceAttr) {
                        childPreserveSpace = (spaceAttr === 'preserve');
                    }

                    let pruneRecord = this.prune(
                        <Element>child,
                        translation.inheritableStyleSet,
                        childPreserveSpace,
                        time,
                        translator,
                        true);

                    hasPreservedContent = hasPreservedContent || pruneRecord.hasPreservedContent;

                    if (pruneRecord.prunedElement) {
                        innerNode.appendChild(pruneRecord.prunedElement);
                    }
                }
            }

            // Now traverse back till the body and build the corresponding structures.
            if (!ignoreAncestors) {
                let ancestor = element.parentNode as Element;

                while ((ancestor !== null) && (ancestor.nodeType === Node.ELEMENT_NODE) && (ancestor !== this.body)) {
                    translation = this.translate(ancestor, inheritedStyleSet, preserveSpace, time, translator);
                    if (translation.outerNode) {
                        innerNode = translation.innerNode;
                        innerNode.appendChild(outerNode);
                        outerNode = translation.outerNode;
                    } else {
                        break;
                    }

                    ancestor = ancestor.parentNode as Element;
                }
            }
        }

        return { prunedElement: outerNode, hasPreservedContent: hasPreservedContent };
    }

    /**
    * @name - getComputedStyleSet
    * @description - Build this element's ttml computed styleset.
    *                This is used as the base styleSet to filter the inherited styleSet from for an element's children.
    * @private
    * @param {Element} element - The ttml element to translate.
    * @param {IDictionaryStringString} inheritedStyleSet - The styleSet inherited by this element.
    * @param {string} tagName - The ttml element tagName. All styles do not apply to all tagNames.
    * @param {number} time - The time to translate against. Elements and styles are temporally transient.
    * @returns {IDictionaryStringString} - The resulting computed styleSet.
    */
    private getComputedStyleSet(
        element: Element,
        inheritedStyleSet: IDictionaryStringString,
        tagName: string,
        time: number): IDictionaryStringString {
        // Start off with a clone of the inherited styleset.
        let computedStyleSet = extend({}, inheritedStyleSet);

        // Iterate over this nodes ttml styles and pave them onto it's computed styleset.
        extend(computedStyleSet, this.styleSetCache[parseInt(element.getAttribute('data-styleSet'), 10)]);

        // Apply any temporally active style animations.
        let sets = element.getElementsByTagNameNS(this.settings.ttmlNamespace, 'set');

        for (let set of nodeListToArray(sets)) {
            if (this.isTemporallyActive(set, time)) {
                TtmlParser.applyInlineStyles(this.settings, computedStyleSet, set);
            }
        }

        if ((tagName === 'ttml:p') && (computedStyleSet['lineHeight'] === 'normal')) {
            // Special case for <p>'s with tts:lineHeight='normal'
            // This means use the largest tts:fontSize value of any
            // of it's descendent <span>'s. Since we don't know what
            // values those might be until translateStyle we'll just
            // save them all and figure it out then.
            let fontSizes = this.appendSpanFontSizes(element, this.getInheritableStyleSet(computedStyleSet), time, '');

            if (fontSizes) {
                computedStyleSet['computed-lineHeight'] = fontSizes;
            }
        }

        return computedStyleSet;
    }

    /**
    * @name - getApplicableStyleSet
    * @description - Build this tags ttml applicable styleset from the specified computed styleSet to apply only to it.
    * @private
    * @param {IDictionaryStringString} computedStyleSet - The style set inherited by this element.
    * @param {string} tagName - The ttml element tagName. All styles do not apply to all tagNames.
    * @returns {IDictionaryStringString} - The resulting applicable styleSet.
    */
    private getApplicableStyleSet(computedStyleSet: IDictionaryStringString, tagName: string): IDictionaryStringString {
        let applicableStyleSet: IDictionaryStringString = {};

        // Special case extent to the front of the list as later processing of
        // padding will depend on it having already been set first.
        if (computedStyleSet['extent'] && this.isStyleApplicable(tagName, 'extent')) {
            applicableStyleSet['extent'] = computedStyleSet['extent'];
        }

        // Special case color to the front of the list as later processing of
        // textOutline will depend on it having already been set first.
        if (computedStyleSet['color'] && this.isStyleApplicable(tagName, 'color')) {
            applicableStyleSet['color'] = computedStyleSet['color'];
        }

        for (let style in computedStyleSet) {
            if (this.isStyleApplicable(tagName, style)) {
                applicableStyleSet[style] = computedStyleSet[style];
            }
        }

        return applicableStyleSet;
    }

    /**
    * @name - isStyleApplicable
    * @description - Determines if the specified style applies to the specified ttml tagName.
    *                NOTE: The ttml spec doesn't mention ttml:br in the styles 'applies to' sections but
    *                as noted in the span section everything that applies to ttml:span also applies to ttml:br
    * @private
    * @param {string} tagName - The ttml element tagName. All styles do not apply to all tagNames.
    * @param {string} style - The style to check against the tagName.
    * @returns {boolean} - True if the ttml:style applies to the ttml:tag, otherwise false.
    */
    private isStyleApplicable(tagName: string, style: string): boolean {
        switch (style) {
            case 'backgroundColor':
            case 'display':
            case 'visibility':
                return (('ttml:body ttml:div ttml:p ttml:region ttml:rootcontainerregion ttml:span ttml:br').indexOf(tagName) >= 0);

            // Technically these font styles do not apply to <p>s but for some reason the resulting html/css
            // for span/br doesnt compute line-height correctly if the entire containing <p> (div) isn't all the same...
            case 'fontFamily':
            case 'fontSize':
            case 'fontStyle':
            case 'fontWeight':
                return ('ttml:p ttml:span ttml:br'.indexOf(tagName) >= 0);

            case 'color':
            // Technically the following commented out font styles only apply to the <span> and <br> tags but
            // we have moved them up above to also apply to the <p> tag to get the translated <div> to compute
            // its line-height correctly. Leaving them here to signify they should be restored if we find a
            // solution to the line-height issue and no longer want to apply them to the <p> tag.
            //////case     'fontFamily':
            //////case       'fontSize':
            //////case      'fontStyle':
            //////case     'fontWeight':
            case 'textDecoration':
            case 'textOutline':
            case 'wrapOption':
                return ('ttml:span ttml:br'.indexOf(tagName) >= 0);

            case 'direction':
            case 'unicodeBidi':
                return ('ttml:p ttml:span ttml:br'.indexOf(tagName) >= 0);

            case 'displayAlign':
            case 'opacity':
            case 'origin':
            case 'overflow':
            case 'padding':
            case 'showBackground':
            case 'writingMode':
            case 'zIndex':
                return ('ttml:region ttml:rootcontainerregion'.indexOf(tagName) >= 0);

            case 'extent':
                return ('ttml:tt ttml:region ttml:rootcontainerregion'.indexOf(tagName) >= 0);

            case 'computed-lineHeight':
            case 'lineHeight':
            case 'textAlign':
                return ('ttml:p'.indexOf(tagName) >= 0);

            default: return false;
        }
    }

    /**
    * @name - getInheritableStyleSet
    * @description - Filters a computed styleSet into an inheritable styleSet subset to pass on to children.
    *                Not all styles are inheritable.
    * @private
    * @param {IDictionaryStringString} computedStyleSet - The computed styleSet to filter.
    * @returns {IDictionaryStringString} - The resulting inheritable styleSet.
    */
    private getInheritableStyleSet(computedStyleSet: IDictionaryStringString): IDictionaryStringString {
        let inheritedStyleSet: IDictionaryStringString = {};

        for (let style in computedStyleSet) {
            if (computedStyleSet.hasOwnProperty(style)) {
                switch (style) {
                    case 'backgroundColor':
                    case 'computed-lineHeight':
                    case 'display':
                    case 'displayAlign':
                    case 'extent':
                    case 'opacity':
                    case 'origin':
                    case 'overflow':
                    case 'padding':
                    case 'showBackground':
                    case 'unicodeBidi':
                    case 'writingMode':
                    case 'zIndex':
                        break;
                    default:
                        inheritedStyleSet[style] = computedStyleSet[style];
                        break;
                }
            }
        }

        return inheritedStyleSet;
    }

    /**
    * @name - appendSpanFontSizes
    * @description - Recurses through an element and it's descendents finding the font sizess of all it's <span>'s.
    * @private
    * @param {Element} element - The ttml element to translate.
    * @param {IDictionaryStringString} inheritedStyleSet - The element's inherited styleSet.
    * @param {number} time - The time to translate against. Elements and styles are temporally transient.
    * @param {string} value - The list of font sizes to append to.
    * @returns {string} - The value with any additional font sizes appended to it.
    */
    private appendSpanFontSizes(element: Element, inheritedStyleSet: IDictionaryStringString, time: number, value: string): string {
        for (let child of nodeListToArray<Element>(element.childNodes)) {
            if ((child.nodeType === Node.ELEMENT_NODE)) {
                let tag = this.getTagNameEquivalent(child);

                if (tag === 'ttml:span') {
                    let computedStyleSet = this.getComputedStyleSet(child, inheritedStyleSet, 'ttml:span', time);
                    let fontSize = computedStyleSet['fontSize'];

                    if (fontSize) {
                        value += ((value) ? ',' : '') + fontSize;
                    }

                    value = this.appendSpanFontSizes(child, this.getInheritableStyleSet(computedStyleSet), time, value);
                }
            }
        }

        return value;
    }

    /**
    * @name - isInRegion
    * @description - Determines whether or not the specified element is associated with the specified region.
    *                Ttml defines 5 ordered rules, where the first rule satisfied is used and remaining rules are skipped.
    * @private
    * @param {Element} element - The ttml element to check.
    * @param {string} regionId - The id of the region to see if the element is associated with.
    * @returns {boolean} - True if the specified element is within the specified region, otherwise false.
    */
    private isInRegion(element: Element, regionId: string): boolean {

        // Quick test: Out of normal order, but makes following rules simpler.
        // This is a shortcut to check step #4 first
        if (!regionId) {
            return true;
        }

        let elemRegion = TtmlParser.getAttributeNS(element, 'region', this.settings.ttmlNamespace);

        // 1. If the element specifies a region attribute, then the element is
        // associated with the region referenced by that attribute;
        if (elemRegion === regionId) {
            return true;
        }

        if (!elemRegion) {
            // 2. If some ancestor of that element specifies a region attribute, then the element is
            // associated with the region referenced by the most immediate ancestor that specifies
            // this attribute;
            let ancestor = element.parentNode as Element;

            while ((ancestor !== null) && (ancestor.nodeType === Node.ELEMENT_NODE)) {
                let id = this.getRegionId(ancestor);
                if (id) {
                    return id === regionId;
                }
                ancestor = ancestor.parentNode as Element;
            }

            // 3. If the element contains a descendant element that specifies a region attribute,
            // then the element is associated with the region referenced by that attribute;
            for (let node of nodeListToArray(element.getElementsByTagName('*'))) {
                if (this.getRegionId(node) === regionId) {
                    return true;
                }
            }
        }

        // 5. The element is not associated with any region.
        return false;
    }

    /**
    * @name - getRegionId
    * @description - Gets the region id for the specified element.
    * @private
    * @param {Element} element - The ttml element to check.
    * @returns {string} - The id of the region the element is associated with.
    */
    private getRegionId(element: Element): string {
        let regionId: string;

        if ((element.nodeType === Node.ELEMENT_NODE) && (element.namespaceURI === this.settings.ttmlNamespace)) {
            if (TtmlParser.getLocalTagName(element) === 'region') {
                regionId = TtmlParser.getAttributeNS(element, 'id', xmlNS);
            } else {
                regionId = TtmlParser.getAttributeNS(element, 'region', this.settings.ttmlNamespace);
            }
        }

        return regionId;
    }

    /**
    * @name - getTagNameEquivalent
    * @description - Gets the tagName of the element with the current ttml namespace prepended if non-standard.
    * @private
    * @param {Element} element - The ttml element to get the tagName of.
    * @returns {string} - The tagName or '' if the namespace isn't one of the ttml ones.
    */
    private getTagNameEquivalent(element: Element): string {
        let tagName = TtmlParser.getLocalTagName(element);
        let nameSpace = element.namespaceURI;

        if (nameSpace === this.settings.ttmlNamespace) {
            return 'ttml:' + tagName;
        }

        if (nameSpace === 'http://www.w3.org/1999/xhtml') {
            return tagName;
        }

        return '';
    }

    /**
    * @name - applyStyle
    * @description - Translates the ttml style/value into one or more css styles/values and applies them to the element.
    * @private
    * @param {HTMLElement} element - The ttml element to apply the css style(s) too.
    * @param {string} tagName - The ttml tagName associated with the element.
    * @param {string} style - The ttml style name.
    * @param {string} value - The ttml style value.
    * @returns {void}
    */
    private applyStyle(element: HTMLElement, tagName: string, style: string, value: string): void {
        let mappedValue = value;

        switch (style) {
            case 'color':
            case 'backgroundColor': {
                mappedValue = TtmlContext.ttmlToCssColor(value);
                css(element, style, mappedValue);
                return;
            }

            case 'direction':
            case 'display': {
                // No change.
                css(element, style, mappedValue);
                return;
            }

            case 'displayAlign': {
                switch (value) {
                    case 'before':
                        mappedValue = 'top';
                        break;
                    case 'center':
                        mappedValue = 'middle';
                        break;
                    case 'after':
                        mappedValue = 'bottom';
                        break;
                }

                css(element, 'vertical-align', mappedValue);
                return;
            }

            case 'extent': {
                let width: string;
                let height: string;

                if (value !== 'auto') {
                    // Get the individual components.
                    let coords = (value.split(/\s+/));

                    if (coords.length === 2) {
                        width = this.ttmlToCssUnits(coords[0], true);
                        height = this.ttmlToCssUnits(coords[1], false);
                    }
                }

                if (!width) {
                    width = (this.settings.rootContainerRegionDimensions
                        ? this.settings.rootContainerRegionDimensions.width
                        : this.settings.relatedMediaObjectRegion.width).toString() + 'px';
                    height = (this.settings.rootContainerRegionDimensions
                        ? this.settings.rootContainerRegionDimensions.height
                        : this.settings.relatedMediaObjectRegion.height).toString() + 'px';
                }

                css(element, 'position', 'absolute');
                css(element, 'width', width);
                css(element, 'min-width', width);
                css(element, 'max-width', width);
                css(element, 'height', height);
                css(element, 'min-height', height);
                css(element, 'max-height', height);
                return;
            }

            case 'fontFamily': {
                if (this.settings.fontMap && this.settings.fontMap[value]) {
                    mappedValue = this.settings.fontMap[value];
                }

                if (value === 'smallCaps') {
                    // Need to additionally add font-variant: small-caps.
                    css(element, 'fontVariant', 'small-caps');
                }

                css(element, style, mappedValue);
                return;
            }

            case 'fontSize': {
                let parts = value.split(/\s+/);

                // For two part fontSize values we use the vertical size which is in the second part.
                let size = (parts.length > 1) ? parts[1] : parts[0];

                // Set the fontsize scaleFactor to 75% (of cell size) to account for ascenders/descenders etc.
                mappedValue = this.ttmlToCssFontSize(size, false, 0.75, tagName === 'ttml:region');

                css(element, style, mappedValue);
                return;
            }

            case 'fontStyle':
            case 'fontWeight': {
                // No change.
                css(element, style, mappedValue);
                return;
            }

            case 'lineHeight': {
                // Spec doesn't qualify what % lengths mean so I'm going to assume it's % of a
                // cell and therefore use fontSize conversion method.
                let mappedValue = (value === 'normal') ? value : this.ttmlToCssFontSize(value, false);

                css(element, 'line-height', mappedValue);
                return;
            }

            case 'computed-lineHeight': {
                let values = value.split(',');
                let max = -1;

                for (let fontSize of values) {
                    // Computed-lineHeight is based off of fontSize so use fontSize conversion method.
                    mappedValue = this.ttmlToCssFontSize(fontSize, false);

                    if (mappedValue && (mappedValue.indexOf('px') === mappedValue.length - 2)) {
                        let height = parseFloat(mappedValue.substr(0, mappedValue.length - 2));

                        if (!isNaN(height) && (height > max)) {
                            max = height;
                        }
                    }
                }

                if (max >= 0) {
                    css(element, 'line-height', max + 'px');
                }

                return;
            }

            case 'origin': {
                if (value !== 'auto') {
                    // Get the individual components.
                    let coords = (value.split(/\s+/));

                    if (coords.length === 2) {
                        css(element, 'position', 'absolute');
                        css(element, 'left', this.ttmlToCssUnits(coords[0], true));
                        css(element, 'top', this.ttmlToCssUnits(coords[1], false));
                    }
                }

                return;
            }

            case 'opacity': {
                // No change.
                css(element, style, mappedValue);
                return;
            }

            case 'padding': {
                let contextRect = getDimensions(element);

                // Get the individual components.
                let parts = (value.split(/\s+/));
                let first: string;
                let second: string;
                let third: string;
                let forth: string;

                switch (parts.length) {
                    case 1:
                        // Value is used for all 4 sides.
                        first = this.ttmlToCssUnits(parts[0], false, contextRect);
                        second = this.ttmlToCssUnits(parts[0], true, contextRect);
                        mappedValue = format('{0} {1} {0} {1}', first, second);
                        break;
                    case 2:
                        // First is top/bottom, second is left/right.
                        first = this.ttmlToCssUnits(parts[0], false, contextRect);
                        second = this.ttmlToCssUnits(parts[1], true, contextRect);
                        mappedValue = format('{0} {1} {0} {1}', first, second);
                        break;
                    case 3:
                        // First is top, second is left/right, third is bottom.
                        first = this.ttmlToCssUnits(parts[0], false, contextRect);
                        second = this.ttmlToCssUnits(parts[1], true, contextRect);
                        third = this.ttmlToCssUnits(parts[2], false, contextRect);
                        mappedValue = format('{0} {1} {2} {1}', first, second, third);
                        break;
                    case 4:
                        // Top, right, bottom, left.
                        first = this.ttmlToCssUnits(parts[0], false, contextRect);
                        second = this.ttmlToCssUnits(parts[1], true, contextRect);
                        third = this.ttmlToCssUnits(parts[2], false, contextRect);
                        forth = this.ttmlToCssUnits(parts[3], true, contextRect);
                        mappedValue = format('{0} {1} {2} {3}', first, second, third, forth);
                        break;
                }

                // Using border width to implement tts:padding as neither padding nor margin fix the size (height) of the content area.
                css(element, 'box-sizing', 'border-box');
                // TODO: See if we work in FF without the following commented out -moz-box-sizing line now and if so remove it.
                //////css(element, '-moz-box-sizing', 'border-box');
                css(element, 'border-style', 'solid');
                css(element, 'border-color', 'transparent');
                // It can be helpful when debugging to change the border-color from transparent to something like rgba(255,255,200,0.5)
                //css(element, 'border-color', 'rgba(255,255,200,0.5)');
                css(element, 'border-width', mappedValue);
                return;
            }

            // If you know what this was for please document it here and uncomment it.
            // As of now the caller appeared to be doing nothing with it so commenting it out.
            //////case 'showBackground': {
            ////// return this.getAttribute('data-showBackground', value);
            //////}

            case 'textAlign': {
                switch (value) {
                    case 'start':
                        mappedValue = 'left';   // TODO: handle rtl correctly.
                        break;
                    case 'end':
                        mappedValue = 'right';  // TODO: handle rtl correctly.
                        break;
                }

                css(element, 'text-align', mappedValue);
                return;
            }

            case 'textDecoration': {
                mappedValue = TtmlContext.ttmlToCssTextDecoration(value);
                css(element, 'text-decoration', mappedValue);
                return;
            }

            case 'textOutline': {
                css(element, 'text-shadow', this.ttmlToCssTextOutline(mappedValue));
                return;
            }

            case 'unicodeBidi': {
                // TOOD: Handle multiple options correctly.
                switch (value) {
                    case 'bidiOverride':
                        mappedValue = 'bidi-override';
                        break;
                }
                css(element, 'unicode-bidi', mappedValue);
                return;
            }

            case 'visibility': {
                // No change.
                css(element, style, mappedValue);
                return;
            }

            case 'writingMode': {
                // TODO: See if all this vendor specific stuff can be removed now.
                // No browser seems to support the W3C CSS3 standard for text-orientation or writing-mode
                // so we will do as best we can with the vendor specific versions for now.
                switch (value) {
                    case 'lr':
                    case 'lrtb': {
                        css(element, 'writing-mode', 'horizontal-tb');          // CCS3 standard: Doesn't work yet
                        css(element, '-webkit-writing-mode', 'horizontal-tb');  // webkit for Chrome
                        css(element, 'writing-mode', 'lr-tb');                  // IE specific
                        return;
                    }
                    case 'rl':
                    case 'rltb': {
                        css(element, 'writing-mode', 'horizontal-tb');          // CCS3 standard: Doesn't work yet
                        css(element, '-webkit-writing-mode', 'horizontal-tb');  // webkit for Chrome
                        css(element, 'writing-mode', 'rl-tb');                  // IE specific
                        return;
                    }
                    case 'tblr': {
                        css(element, 'text-orientation', 'upright');            // CCS3 standard: Doesn't work yet
                        css(element, 'writing-mode', 'vertical-lr');            // CCS3 standard: Doesn't work yet
                        css(element, '-webkit-text-orientation', 'upright');    // webkit for Chrome
                        css(element, '-webkit-writing-mode', 'vertical-lr');    // webkit for Chrome
                        css(element, 'writing-mode', 'tb-lr');                  // IE specific
                        return;
                    }
                    case 'tb':
                    case 'tbrl': {
                        css(element, 'text-orientation', 'upright');            // CCS3 standard: Doesn't work yet
                        css(element, 'writing-mode', 'vertical-rl');            // CCS3 standard: Doesn't work yet
                        css(element, '-webkit-text-orientation', 'upright');    // webkit for Chrome
                        css(element, '-webkit-writing-mode', 'vertical-rl');    // webkit for Chrome
                        css(element, 'writing-mode', 'tb-rl');                  // IE specific
                        return;
                    }
                }
                return;
            }

            case 'wrapOption': {
                css(element, 'white-space', value === 'noWrap' ? 'nowrap' : (value === 'pre' ? 'pre' : 'normal'));
                return;
            }

            case 'zIndex': {
                css(element, style, mappedValue);   // Requires global information...
                return;
            }

            default: {
                css(element, style, mappedValue);
                return;
            }
        }
    }

    /**
    * @name - defaultStyle
    * @description - Applies default styles to the element to match the ttml defaults.
    * @static
    * @private
    * @param {HTMLElement} element - The element to set the default styles on.
    * @returns {HTMLElement} - The specified element (for chaining).
    */
    private static defaultStyle(element: HTMLElement): HTMLElement {
        // Set some element styles to our ttml defaults for them.
        css(element, 'background-color', TtmlContext.TtmlNamedColorMap['transparent']);
        css(element, 'offset', '0');
        css(element, 'margin', '0');
        css(element, 'padding', '0');
        css(element, 'border', '0');
        return element;
    }

    /**
    * @name - ttmlToCssUnits
    * @description - Converts a ttml unit string to a css one.
    * @private
    * @param {string} ttmlUnits - The ttml value.
    * @param {boolean} width - Indicates whether to perform a width based or a height based conversion.
    * @param {IClientDimension} [contextRect] - The context rectangle to use for conversion.
    * @returns {string} - The css value.
    */
    private ttmlToCssUnits(ttmlUnits: string, width: boolean, contextRect?: IClientDimension): string {
        let cssUnits = ttmlUnits;

        if (ttmlUnits) {
            let unit = ttmlUnits.charAt(ttmlUnits.length - 1);

            // Need to special case handle ttml cell metrics.
            if ((unit === 'c') || (unit === '%')) {
                let container = this.settings.rootContainerRegionDimensions
                    ? this.settings.rootContainerRegionDimensions
                    : this.settings.relatedMediaObjectRegion;
                let length = parseFloat(ttmlUnits.substr(0, ttmlUnits.length - 1));
                let containerSize = width ? container.width : container.height;
                let value: number;

                if (unit === 'c') {
                    let gridSize = width ? this.settings.cellResolution.columns : this.settings.cellResolution.rows;

                    value = length * containerSize / gridSize;
                } else if (unit === '%') {
                    // If % units calls also specify a contextRect use that instead of the container.
                    if (contextRect) {
                        containerSize = width ? contextRect.width : contextRect.height;
                    }

                    // Have to convert % to px because padding and vertical-align (displayAlign) are not
                    // working together if the extent width/height are % instead of px.
                    value = containerSize * length / 100;
                }

                // Round to 1 decimal place
                value = Math.round(value * 10) / 10;
                cssUnits = value + 'px';
            }
        }

        return cssUnits;
    }

    /**
    * @name - ttmlToCssFontSize
    * @description - Converts a ttml font size to a css one.
    * @private
    * @param {string} ttmlUnits - The ttml value.
    * @param {boolean} width - Indicates whether to perform a width based or a height based conversion.
    * @param {number} [scaleFactor = 1] - The scale factor to use for conversion.
    * @param {boolean} [isRegion = false] - Indicates whether or not the conversion is being done for a <region>.
    * @returns {string} - The css value.
    */
    private ttmlToCssFontSize(ttmlUnits: string, width: boolean, scaleFactor: number = 1, isRegion: boolean = false): string {
        let cssUnits = ttmlUnits;

        if (ttmlUnits) {
            let unit = ttmlUnits.charAt(ttmlUnits.length - 1);

            // Need to special case handle ttml cell metrics and % units.
            if ((unit === 'c') || (isRegion && (unit === '%'))) {
                let container = this.settings.rootContainerRegionDimensions
                    ? this.settings.rootContainerRegionDimensions
                    : this.settings.relatedMediaObjectRegion;
                let length = parseFloat(ttmlUnits.substr(0, ttmlUnits.length - 1));
                let containerSize = width ? container.width : container.height;
                let gridSize = width ? this.settings.cellResolution.columns : this.settings.cellResolution.rows;
                let value = length * containerSize / gridSize;

                if (unit === '%') {
                    // Length is % so divide by 100.
                    value /= 100;
                }

                // Apply the scale factor and limit to one decimal place precision.
                value = Math.floor(value * scaleFactor * 10) / 10;

                cssUnits = value + 'px';
            }
        }

        return cssUnits;
    }

    /**
    * @name - lengthRegEx
    * @description - The regular expression pattern used in ttml->css text outline conersion.
    * @static
    * @private
    * @type {RegExp}
    */
    private static lengthRegEx: RegExp = /\s*(\d+\.*\d*)(.*)\s*/;

    /**
    * @name - ttmlToCssTextOutline
    * @description - Converts a ttml text outline style value to a css one.
    * @private
    * @param {string} textOutline - The ttml value.
    * @returns {string} - The css value.
    */
    private ttmlToCssTextOutline(textOutline: string): string {
        let textShadow = 'none';

        if (!isNullOrWhiteSpace(textOutline) && (textOutline !== 'none')) {
            let parts = textOutline.split(/\s+/);
            let color: string;
            let thickness: string;
            let blur: string;

            if (parts.length === 1) {
                color = $(this).css('color');
                thickness = parts[0];
                blur = '';
            } else if (parts.length === 3) {
                color = parts[0];
                thickness = parts[1];
                blur = parts[2];
            } else if (parts.length === 2) {
                let firstChar = parts[0].charAt(0);

                if ((firstChar >= '0') && (firstChar <= '9')) {
                    color = $(this).css('color');
                    thickness = parts[0];
                    blur = parts[1];
                } else {
                    color = parts[0];
                    thickness = parts[1];
                    blur = '';
                }
            }

            // Spec doesn't qualify what % lengths mean so I'm going to assume it's % of a cell
            // and therefore use fontSize conversion method with the same scaleFactor applied
            // to fontSize since it's the font that we're outlining here.
            blur = this.ttmlToCssFontSize(blur, false, 0.75);
            thickness = this.ttmlToCssFontSize(thickness, false, 0.75);

            parts = TtmlContext.lengthRegEx.exec(thickness);

            if (parts && (parts.length === 3)) {
                let width = Math.round(parseFloat(parts[1]));
                let units = parts[2];

                textShadow = '';

                for (let x = -width; x <= width; x++) {
                    for (let y = -width; y <= width; y++) {
                        if ((x !== 0) || (y !== 0)) {
                            textShadow += format('{0}{4} {1}{4} {2} {3}, ', x, y, blur, TtmlContext.ttmlToCssColor(color), units);
                        }
                    }
                }

                if (textShadow) {
                    textShadow = textShadow.substr(0, textShadow.length - 2);
                }
            }
        }

        return textShadow;
    }

    /**
    * @name - ttmlToCssTextDecoration
    * @description - Converts a ttml text decoration style value to a css one.
    * @static
    * @private
    * @param {string} ttmlTextDecoration - The ttml value.
    * @returns {string} - The css value.
    */
    private static ttmlToCssTextDecoration(ttmlTextDecoration: string): string {
        let textDecoration = '';
        let parts = ttmlTextDecoration.split(/\s+/);

        // Since we have no CSS for the 'no' values just replace them all with a none at the front of the list.
        for (let value of parts) {
            switch (value) {
                case 'none':
                case 'noUnderline':
                case 'noLineThrough':
                case 'noOverline':
                    textDecoration = 'none';
                    break;
            }
        }

        // Then append all the others.
        for (let value of parts) {
            switch (value) {
                case 'none':
                case 'noUnderline':
                case 'noLineThrough':
                case 'noOverline':
                    break;
                case 'lineThrough':
                    textDecoration += ' line-through';
                    break;
                default:
                    textDecoration += ' ' + value;
                    break;
            }
        }

        return trim(textDecoration);
    }

    /**
    * @name - rgbaRegEx
    * @description - The regular expression pattern used in ttml->css color conersion.
    * @static
    * @private
    * @type {RegExp}
    */
    private static rgbaRegEx: RegExp = /\s*rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*/;

    /**
    * @name - TtmlNamedColorMap
    * @description - The table used to map named ttml color values to css color values.
    * @static
    * @private
    * @type {IDictionaryStringString}
    */
    private static TtmlNamedColorMap: IDictionaryStringString = {
        transparent: 'rgba(0,0,0,0)',
        black: 'rgba(0,0,0,1)',
        silver: 'rgba(192,192,192,1)',
        gray: 'rgba(128,128,128,1)',
        white: 'rgba(255,255,255,1)',
        maroon: 'rgba(128,0,0,1)',
        red: 'rgba(255,0,0,1)',
        purple: 'rgba(128,0,128,1)',
        fuchsia: 'rgba(255,0,255,1)',
        magenta: 'rgba(255,0,255,1)',
        green: 'rgba(0,128,0,1)',
        lime: 'rgba(0,255,0,1)',
        olive: 'rgba(128,128,0,1)',
        yellow: 'rgba(255,255,0,1)',
        navy: 'rgba(0,0,128,1)',
        blue: 'rgba(0,0,255,1)',
        teal: 'rgba(0,128,128,1)',
        aqua: 'rgba(0,255,255,1)',
        cyan: 'rgba(0,255,255,1)'
    };

    /**
    * @name - ttmlToCssColor
    * @description - Converts a ttml text color style value to a css one.
    *                #RRGGBB and rgb(rrr,ggg,bbb) do not need conversion and are not modified.
    *                #RRGGBBAA is modified because css doesn't support it (at least as implemented in todays browsers).
    *                rgba(rrr,ggg,bbb,aaa) is converted to rgba(rrr,ggg,bbb,0-1).
    *                ttml namedColors are converted to rgb(rrr,ggg,bbb) in the unlikely event that their alpha (only) is overridden.
    * @static
    * @private
    * @param {string} color - The ttml value.
    * @returns {string} - The css value.
    */
    private static ttmlToCssColor(color: string): string {
        let mappedColor = color;

        color = color.toLowerCase();

        if (color.indexOf('rgba') === 0) {
            let parts = TtmlContext.rgbaRegEx.exec(color);

            if (parts && (parts.length === 5)) {
                let red = parts[1];
                let green = parts[2];
                let blue = parts[3];
                let alpha = parseInt(parts[4], 10);

                mappedColor = format('rgba({0},{1},{2},{3})', red, green, blue, Math.round(alpha * 100 / 255) / 100);
            }
        } else if ((color.charAt(0) === '#') && (color.length === 9)) {
            let red = parseInt(color.substr(1, 2), 16);
            let green = parseInt(color.substr(3, 2), 16);
            let blue = parseInt(color.substr(5, 2), 16);
            let alpha = parseInt(color.substr(7, 2), 16);

            mappedColor = format('rgba({0},{1},{2},{3})', red, green, blue, Math.round(alpha * 100 / 255) / 100);
        } else if (TtmlContext.TtmlNamedColorMap[color]) {
            mappedColor = TtmlContext.TtmlNamedColorMap[color];
        }

        return mappedColor;
    }
}