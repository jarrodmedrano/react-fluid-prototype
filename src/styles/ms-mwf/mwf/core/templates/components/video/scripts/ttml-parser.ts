/// <amd-module name="ttml-parser"/>
import {ITtmlContext, TtmlContext} from 'ttml-context';
import {TtmlTimeParser} from 'ttml-time-parser';
import {ITtmlSettings, TtmlSettings, xmlNS} from 'ttml-settings';
import {nodeListToArray} from 'htmlExtensions';
import {trim, format} from 'stringExtensions';
import {IClientDimension, IDictionaryStringString, IGrid} from 'utility';

// Timed Text Markup Language (TTML).
// See http://www.w3.org/TR/ttml1/ for more details.

/**
* @interface ITtmlEvent
* @classdesc - The ITtmlEvent interface contract.
* @export
*/
export interface ITtmlEvent {
    time: number;
    element?: Element;
}

/**
* @interface ITtmlTimingBounds
* @classdesc - The ITtmlTimingBounds interface contract.
* @export
*/
interface ITtmlTimingBounds {
    start: number;
    end: number;
}

export class TtmlParser {
    /**
    * @name - mediaStart
    * @description - Used as the start time for applyTiming when applying to the entire document.
    * @static
    * @private
    * @type {number}
    */
    private static mediaStart = -1;

    /**
    * @name - mediaEnd
    * @description - Used as the end time for applyTiming when applying to the entire document.
    *                Picking a number that should always be greater than any real media end time.
    * @static
    * @private
    * @type {number}
    */
    private static mediaEnd = 99999999;

    /**
    * @name - parse
    * @description - Parses a ttml document and builds a ttmlContext instance from it.
    * @static
    * @public
    * @param {XMLDocument} ttmlDocument - The ttml document to parse.
    * @param {ITtmlSettings} settingsOverrides - The ttml settings overrides to use.
    * @returns {ITtmlContext} - The resulting ttmlContext instance that can be used to get cues by time.
    */
    public static parse(ttmlDocument: XMLDocument, settingsOverrides: ITtmlSettings): ITtmlContext {
        ttmlDocument = (typeof ttmlDocument === 'string') ? TtmlParser.parseXml(ttmlDocument) : ttmlDocument;

        let ttmlContext = new TtmlContext();

        // Start initializing the context.
        ttmlContext.settings = new TtmlSettings(settingsOverrides);
        ttmlContext.root = TtmlParser.verifyRoot(ttmlDocument, ttmlContext);
        ttmlContext.body = TtmlParser.getFirstElementByTagNameNS(ttmlContext.root, 'body', ttmlContext.settings.ttmlNamespace);
        ttmlContext.events = [];
        ttmlContext.styleSetCache = [];

        if (ttmlContext.body) {
            try {
                // Parse the root <tt> attributes.
                TtmlParser.parseTtAttrs(ttmlContext);

                // Set up our regions.
                let head = TtmlParser.ensureRegions(ttmlContext);

                let timeBase = TtmlParser.getAttributeNS(
                    ttmlContext.root,
                    'timeBase',
                    ttmlContext.settings.ttmlParameterNamespace) || 'media';

                if (ttmlContext.settings.supportedTimeBase.indexOf(timeBase) !== -1) {
                    // Process textnodes into anonymous spans.
                    TtmlParser.processAnonymousSpans(ttmlContext, ttmlContext.body);

                    let timeParser = new TtmlTimeParser(ttmlContext.settings.mediaFrameRate, ttmlContext.settings.mediaTickRate);

                    // Apply the intervals over the tree.
                    TtmlParser.applyTiming(
                        ttmlContext,
                        ttmlContext.root,
                        { start: TtmlParser.mediaStart, end: TtmlParser.mediaEnd },
                        true,
                        timeParser);

                    // Apply the style inheritance over the tree.
                    TtmlParser.applyStyling(ttmlContext, head);

                    // TODO: 8479736: Update build step to remove commented code.
                    // The following console.log useful for debugging and is left in commented out for easy restoration.
                    ////// if (ttmlContext.settings.log) {
                    ////// ttmlContext.settings.log(format('parseComplete events({0}) styleSets({1})',
                    ////// ttmlContext.events.length, ttmlContext.styleSetCache.length));
                    ////// }
                }
            } catch (error) {
                // TODO: 8479736: Update build step to remove commented code.
                // The following console.log useful for debugging and is left in commented out for easy restoration.
                ////// if (ttmlContext.settings.log) {
                ////// ttmlContext.settings.log(format('unexpected error: {0}', error));
                ////// }
            }

            // Add an dummy end event for the captions to appear until end of video.
            // Not sure why we need to do this, please add to this comment if you know.
            ttmlContext.events.push({ time: TtmlParser.mediaEnd, element: null });

            // Sort events into temporal order.
            ttmlContext.events.sort((event1: ITtmlEvent, event2: ITtmlEvent) => {
                return event1.time - event2.time;
            });
        }

        return ttmlContext;
    }

    /**
    * @name - parseXml
    * @description - Parses an xml document in string format to an XMLDocument.
    * @static
    * @private
    * @param {string} xmlString - The xml string to parse.
    * @returns {XMLDocument} - The resulting XMLDocument, or null if the xml string failed to parse.
    */
    private static parseXml(xmlString: string): XMLDocument {
        let xml: XMLDocument = null;

        try {
            if ((<any>window).DOMParser) {
                let domParser = new DOMParser();
                xml = domParser.parseFromString(xmlString, 'application/xml');
            } else {
                let domParser = new ActiveXObject('Microsoft.XMLDOM');
                domParser.async = false;
                domParser.loadXML(xmlString);
                xml = domParser as XMLDocument;
            }
        } catch (exception) {
            xml = null;
        }

        return xml;
    }

    /**
    * @name - verifyRoot
    * @description - Verifies that root <tag> of the specified document is the expected ttml <tt> tagName and
    *                updates the settings namespaces from it if they are non standard.
    * @static
    * @private
    * @param {XMLDocument} ttmlDocument - The ttml document to verify.
    * @param {TtmlContext} ttmlContext - The ttmlContext for this document.
    * @returns {Element} - The valid root Element, or or null if the root Element was not valid.
    */
    private static verifyRoot(ttmlDocument: XMLDocument, ttmlContext: TtmlContext): Element {
        let root: Element;
        let candidate = ttmlDocument.documentElement;

        if (TtmlParser.getLocalTagName(candidate) === 'tt') {
            if (candidate.namespaceURI !== 'http://www.w3.org/ns/ttml') {
                ttmlContext.settings.ttmlNamespace = candidate.namespaceURI;
                ttmlContext.settings.ttmlStyleNamespace = ttmlContext.settings.ttmlNamespace + '#styling';
                ttmlContext.settings.ttmlParameterNamespace = ttmlContext.settings.ttmlNamespace + '#parameter';
                ttmlContext.settings.ttmlMetaNamespace = ttmlContext.settings.ttmlNamespace + '#metadata';
            }

            root = candidate;
        }

        return root;
    }

    /**
    * @name - parseTtAttrs
    * @description - Parses the <tt> tag attributes and initializes ttmlContext properties from them.
    * @static
    * @private
    * @param {TtmlContext} ttmlContext - The ttmlContext for this document.
    * @returns {void}
    */
    private static parseTtAttrs(ttmlContext: TtmlContext): void {
        let cellRes = TtmlParser.getAttributeNS(ttmlContext.root, 'cellResolution', ttmlContext.settings.ttmlParameterNamespace);
        let extent = TtmlParser.getAttributeNS(ttmlContext.root, 'extent', ttmlContext.settings.ttmlStyleNamespace);
        let cellGrid: IGrid = null;

        if (cellRes) {
            let parts = trim(cellRes).split(/\s+/);

            if (parts.length === 2) {
                let columns = Math.round(parseFloat(parts[0]));
                let rows = Math.round(parseFloat(parts[1]));

                if ((rows > 0) && (columns > 0)) {
                    cellGrid = { rows: rows, columns: columns };
                }
            }
        }

        if (cellGrid) {
            ttmlContext.settings.cellResolution = cellGrid;
        }

        if (extent) {
            if (extent !== 'auto') {
                // Get the individual components.
                let coords = extent.split(/\s+/);

                if ((coords.length === 2) &&
                    (coords[0].substr(coords[0].length - 2) === 'px') &&
                    (coords[1].substr(coords[1].length - 2) === 'px')) {
                    let width = parseFloat(coords[0].substr(0, coords[0].length - 2));
                    let height = parseFloat(coords[1].substr(0, coords[1].length - 2));

                    // Round to integer.
                    ttmlContext.settings.rootContainerRegionDimensions = { 'width': Math.round(width), 'height': Math.round(height) };
                }
            }
        }

        // TODO: 8479736: Update build step to remove commented code.
        // The following console.log useful for debugging and is left in commented out for easy restoration.
        ////// if (ttmlContext.settings.log) {
        ////// ttmlContext.settings.log(format('rootContainerRegionDimensions({0}x{1}) cellResolution({2}x{3}){4}',
        ////// ttmlContext.settings.rootContainerRegionDimensions ? ttmlContext.settings.rootContainerRegionDimensions.width : '-',
        ////// ttmlContext.settings.rootContainerRegionDimensions ? ttmlContext.settings.rootContainerRegionDimensions.height : '-',
        ////// ttmlContext.settings.cellResolution.columns,
        ////// ttmlContext.settings.cellResolution.rows,
        ////// (cellGrid) ? '' : '(default)'));
        ////// }
    }

    /**
    * @name - ensureRegions
    * @description - Ensures we have the elements/regions we require by either finding them or creating them if they are not present.
    * @static
    * @private
    * @param {TtmlContext} ttmlContext - The ttmlContext for this document.
    * @returns {Element} - The <head> element.
    */
    private static ensureRegions(ttmlContext: TtmlContext): Element {
        // Create our rootContainerRegion
        ttmlContext.rootContainerRegion = ttmlContext.root.ownerDocument.createElementNS(
            ttmlContext.settings.ttmlNamespace, 'rootcontainerregion') as Element;

        ttmlContext.root.appendChild(ttmlContext.rootContainerRegion);

        let extents = ttmlContext.settings.rootContainerRegionDimensions ? format('{0}px {1}px',
            ttmlContext.settings.rootContainerRegionDimensions.width, ttmlContext.settings.rootContainerRegionDimensions.height) : 'auto';

        ttmlContext.rootContainerRegion.setAttributeNS(ttmlContext.settings.ttmlStyleNamespace, 'extent', extents);

        let head = TtmlParser.getFirstElementByTagNameNS(ttmlContext.root, 'head', ttmlContext.settings.ttmlNamespace);

        // Ensure we have a <head>
        if (!head) {
            // No <head> so we need to create that now.
            head = ttmlContext.root.ownerDocument.createElementNS(ttmlContext.settings.ttmlNamespace, 'head');
            ttmlContext.root.appendChild(head);
        }

        // Ensure we have a <layout>
        ttmlContext.layout = TtmlParser.getFirstElementByTagNameNS(head, 'layout', ttmlContext.settings.ttmlNamespace);

        if (!ttmlContext.layout) {
            // No <layout> so we need to create that now.
            ttmlContext.layout = ttmlContext.root.ownerDocument.createElementNS(ttmlContext.settings.ttmlNamespace, 'layout');
            ttmlContext.root.appendChild(ttmlContext.layout);
        }

        // Create an anonymous region if we have no regions.
        let regions = ttmlContext.layout.getElementsByTagNameNS(ttmlContext.settings.ttmlNamespace, 'region');

        if (!regions.length) {
            let anonymousRegion = ttmlContext.root.ownerDocument.createElementNS(ttmlContext.settings.ttmlNamespace, 'region');

            anonymousRegion.setAttributeNS(xmlNS, 'id', 'anonymous');
            anonymousRegion.setAttribute('data-isanonymous', '1');
            ttmlContext.layout.appendChild(anonymousRegion);

            ttmlContext.body.setAttributeNS(ttmlContext.settings.ttmlNamespace, 'region', 'anonymous');

            // TODO: 8479736: Update build step to remove commented code.
            // The following console.log useful for debugging and is left in commented out for easy restoration.
            ////// if (ttmlContext.settings.log) {
            ////// ttmlContext.settings.log('added anonymous region');
            ////// }
        }

        return head;
    }

    /**
    * @name - processAnonymousSpans
    * @description - Recurses through all the <p> elements in the document and groups all the contiguous TEXT_NODES together into <span>'s
    * @static
    * @private
    * @param {TtmlContext} ttmlContext - The ttmlContext for this document.
    * @param {Element} element - The element to process the TEXT_NODES of.
    * @returns {void}
    */
    private static processAnonymousSpans(ttmlContext: TtmlContext, element: Element): void {
        // If this element is <p> then group all contiguous textnodes together in <span>
        if (TtmlParser.isTagNS(element, 'p', ttmlContext.settings.ttmlNamespace)) {
            let textNodeGroups: Node[][] = [];
            let prevNodeType: number;

            for (let child of nodeListToArray(element.childNodes)) {
                if (child.nodeType === Node.TEXT_NODE) {
                    if (prevNodeType !== Node.TEXT_NODE) {
                        textNodeGroups.push([]);
                    }

                    textNodeGroups[textNodeGroups.length - 1].push(child);
                }

                prevNodeType = child.nodeType;
            }

            for (let group of textNodeGroups) {
                let anonSpan = ttmlContext.root.ownerDocument.createElementNS(ttmlContext.settings.ttmlNamespace, 'span');

                anonSpan.appendChild(group[0].parentNode.replaceChild(anonSpan, group[0]));

                for (let index = 1; index < group.length; index++) {
                    anonSpan.appendChild(group[index]);
                }
            }
        }

        // Then recurse through the contents doing the same thing for those.
        for (let child of nodeListToArray<Element>(element.childNodes)) {
            this.processAnonymousSpans(ttmlContext, child);
        }
    }

    /**
    * @name - applyTiming
    * @description - Recurses through the document element tree to determine the absolute start and end times of all the elements
    *                using the TTML subset of the SMIL timing model. The reference times passed in 'bound' are absolute times.
    *                The result of calling this is to set the local start time and end time to absolute times between these two
    *                reference times, based on the begin, end and dur attributes and to recursively set all of the children.
    * @static
    * @private
    * @param {TtmlContext} ttmlContext - The ttmlContext for this document.
    * @param {Element} element - The element to apply the timing to.
    * @param {ITtmlTimingBounds} bound - The bounds for the timing.
    * @param {boolean} isParallelContext - Indicates whether or not this element is in a parallel timing context.
    * @param {TtmlTimeParser} timeParser - The TtmlTimeParser to use to parse this elements time attributes.
    * @returns {void}
    */
    private static applyTiming(
        ttmlContext: TtmlContext,
        element: Element,
        bound: ITtmlTimingBounds,
        isParallelContext: boolean,
        timeParser: TtmlTimeParser): void {
        let beginAttribute = TtmlParser.getAttributeNS(element, 'begin', ttmlContext.settings.ttmlNamespace);
        let startTime = beginAttribute ? timeParser.parse(beginAttribute) : bound.start;
        let endTime = 0;

        // Compute the simple duration of the interval.
        let defaultDuration = 0;
        let duration = 0;
        let end = 0;
        let durationAttribute = TtmlParser.getAttributeNS(element, 'dur', ttmlContext.settings.ttmlNamespace);
        let endAttribute = TtmlParser.getAttributeNS(element, 'end', ttmlContext.settings.ttmlNamespace);

        if ((!durationAttribute) && (!endAttribute)) {
            // No direct timing attested, so use default based on context.
            // Parallel children have indefinite default duration, truncated by bounds.
            if (isParallelContext) {
                // Sequential children have zero default duration.
                if (startTime <= bound.end) {
                    defaultDuration = Math.max(0, bound.end - startTime);
                    endTime = bound.end;
                } else {
                    endTime = 0;
                }
            }
        } else if (durationAttribute && endAttribute) {
            // Both duration and end attested, the minimum interval applies.
            duration = timeParser.parse(durationAttribute);
            end = timeParser.parse(endAttribute);
            let minEnd = Math.min(startTime + duration, bound.start + end);
            endTime = Math.min(minEnd, bound.end);
        } else if (endAttribute) {
            // Only end attested.
            end = timeParser.parse(endAttribute);
            endTime = Math.min(bound.start + end, bound.end);
        } else {
            // Only dur attested.
            duration = timeParser.parse(durationAttribute);
            endTime = Math.min(startTime + duration, bound.end);
        }

        if (endTime < startTime) {
            endTime = startTime;
        }

        startTime = Math.floor(startTime);
        endTime = Math.floor(endTime);

        element.setAttribute('data-time-start', startTime.toString());
        element.setAttribute('data-time-end', endTime.toString());

        if ((startTime >= 0) && (ttmlContext.events.filter((event) => { return event.time === startTime; }).length <= 0)) {
            ttmlContext.events.push({ time: startTime, element: element });
        }

        let start = startTime;

        for (let child of nodeListToArray<Element>(element.childNodes)) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                // Parallel is the default so null is OK here.
                if (TtmlParser.getAttributeNS(element, 'timeContainer', ttmlContext.settings.ttmlNamespace) !== 'seq') {
                    this.applyTiming(ttmlContext, child, { start: startTime, end: endTime }, true, timeParser);
                } else {
                    this.applyTiming(ttmlContext, child, { start: start, end: endTime }, false, timeParser);
                    start = parseInt(child.getAttribute('data-time-end'), 10);
                }
            }
        }
    }

    /**
    * @name - applyStyling
    * @description - Recurses through all the elements in <head> applying the ttml sytling to them based on the <style>'s.
    * @static
    * @private
    * @param {TtmlContext} ttmlContext - The ttmlContext for this document.
    * @param {Element} head - The element to process the TEXT_NODES of.
    * @returns {void}
    */
    private static applyStyling(ttmlContext: TtmlContext, head: Element): void {
        // First find all the <style>'s
        let styling = TtmlParser.getFirstElementByTagNameNS(head, 'styling', ttmlContext.settings.ttmlNamespace);
        let styles = styling ? nodeListToArray(styling.getElementsByTagNameNS(ttmlContext.settings.ttmlNamespace, 'style')) : [];

        // Apply the styles to every element in the body
        for (let element of nodeListToArray(ttmlContext.root.querySelectorAll('*'))) {
            this.applyStyle(ttmlContext, element, styles);
        }
    }

    /**
    * @name - applyStyle
    * @description - Applies the ttml styling to the specified element.
    *                Apply styles in the correct order to element by building a styleSet, adding it
    *                to the stlyeSetCache, and the adding reference to the cached styleSet to the element.
    * @static
    * @private
    * @param {TtmlContext} ttmlContext - The ttmlContext for this document.
    * @param {Element} element - The element to apply the ttml styling to.
    * @param {Element[]} styles - The set of styles to apply.
    * @returns {void}
    */
    private static applyStyle(ttmlContext: TtmlContext, element: Element, styles: Element[]): void {
        let styleSet: IDictionaryStringString = {};

        // Find all the applicable styles and set them as properties on styleSet.
        this.applyStylesheet(ttmlContext.settings, styleSet, element, styles);
        TtmlParser.applyInlineStyles(ttmlContext.settings, styleSet, element);

        let empty = true;

        for (let style in styleSet) {
            // Just need to see if there's at least one.
            if (styleSet.hasOwnProperty(style)) {
                empty = false;
                break;
            }
        }

        if (!empty) {
            // TODO: 8479736: Update build step to remove commented code.
            // The following console.log useful for debugging and is left in commented out for easy restoration.
            ////// if (ttmlContext.settings.log) {
            ////// let styles = '';

            ////// for (let style in styleSet) {
            ////// if (styleSet.hasOwnProperty(style)) {
            ////// styles += style + ':' + styleSet[style] + '; ';
            ////// }
            ////// }

            ////// ttmlContext.settings.log(
            ////// format('addStyleSet element({0}) id({1}) style({2})',
            ////// element.nodeName,
            ////// ttmlContext.styleSetCache.length,
            ////// trim(styles)));
            ////// }

            // Record the applied set to the element.
            element.setAttribute('data-styleSet', ttmlContext.styleSetCache.length.toString());
            ttmlContext.styleSetCache.push(styleSet);
        // TODO: 8479736: Update build step to remove commented code.
        // The following console.log useful for debugging and is left in commented out for easy restoration.
        ////// } else if (ttmlContext.settings.log) {
        ////// ttmlContext.settings.log(format('skipStyleSet element({0})', element.nodeName));
        }
    }

    /**
    * @name - applyStylesheet
    * @description - For each style id on the element, find the corresponding style element and then
    *                apply the stylesheet into styleset; this recurses over the tree of referenced styles.
    * @static
    * @private
    * @param {TtmlSettings} settings - The TtmlSettings for this document.
    * @param {IDictionaryStringString} styleSet - The styleSet to build upon.
    * @param {Element} element - The element to apply the styles of.
    * @param {Element[]} styles - The set of styles to apply.
    * @returns {void}
    */
    private static applyStylesheet(settings: TtmlSettings, styleSet: IDictionaryStringString, element: Element, styles: Element[]): void {
        // Find all the style ID references.
        let styleAttribute = TtmlParser.getAttributeNS(element, 'style', settings.ttmlNamespace);
        let ids = styleAttribute ? styleAttribute.split(/\s+/) : [];

        for (let styleId of ids) {
            for (let style of styles) {
                // Filter on those whose id is the one we want.
                if (TtmlParser.getAttributeNS(style, 'id', xmlNS) === styleId) {
                    // Recurse into its style references.
                    this.applyStylesheet(settings, styleSet, style, styles);

                    // Do inline styles.
                    TtmlParser.applyInlineStyles(settings, styleSet, style);
                }
            }
        }

        // If the element is a region do nested styles. NOTE regions can only be referenced from elements in the body.
        if (TtmlParser.isTagNS(element, 'region', settings.ttmlNamespace)) {
            // Find all the style elements in the TTML namespace.
            for (let style of nodeListToArray(element.getElementsByTagNameNS(settings.ttmlNamespace, 'style'))) {
                TtmlParser.applyInlineStyles(settings, styleSet, style);
            }
        }
    }

    /**
    * @name - applyInlineStyles
    * @description - Applies the elements inline styles into the styleSet.
    * @static
    * @public
    * @param {TtmlSettings} settings - The TtmlSettings for this document.
    * @param {IDictionaryStringString} styleSet - The styleSet to build upon.
    * @param {Element} element - The element to apply the styles of.
    * @returns {void}
    */
    public static applyInlineStyles(settings: TtmlSettings, styleSet: IDictionaryStringString, element: Element): void {
        for (let attribute of nodeListToArray(element.attributes)) {
            if (attribute.namespaceURI === settings.ttmlStyleNamespace) {
                // trim() because we see lots of ttml attribute values with trailing space...
                styleSet[TtmlParser.getLocalTagName(attribute)] = trim(attribute.nodeValue);
            }
        }
    }

    /**
    * @name - getLocalTagName
    * @description - Gets the local tagName of a Node.
    * @static
    * @public
    * @param {Node} node - The node to get the tagName of.
    * @returns {string} - The tagName.
    */
    public static getLocalTagName(node: Node): string {
        return node.localName || (<any>node).baseName;
    }

    /**
    * @name - isTagNS
    * @description - Determines whether or not the namespace and local tagName of an element matches
    *                the specified namespace and tag name.
    * @static
    * @private
    * @param {Element} element - The node to compare against.
    * @param {string} tagName - The tag name.
    * @param {string} namespace - The attribute namespace.
    * @returns {boolean} - True if the elements ns/tagName match, otherwise false.
    */
    private static isTagNS(element: Element, tagName: string, namespace: string): boolean {
        return ((element.namespaceURI === namespace) && this.getLocalTagName(element) === tagName);
    }

    /**
    * @name - getAttributeNS
    * @description - Gets the value of a namespaced attribute. First tries element.getAttributeNS() but falls back
    *                to scanning each attribute if that fails.
    *                If you know which cases go into the fallback code please document it here.
    * @static
    * @public
    * @param {Element} element - The element to get the attribute of.
    * @param {string} name - The attribute name.
    * @param {string} namespace - The attribute namespace.
    * @returns {string} - The attribute value. or an empty string if a matching attribute is not found.
    */
    public static getAttributeNS(element: Element, name: string, namespace: string): string {
        let result = element.getAttributeNS(namespace, name);

        if (!result) {
            // Go through all the attributes looking for a match.
            for (let attribute of nodeListToArray(element.attributes)) {
                if ((attribute.localName === name) && (attribute.lookupNamespaceURI(attribute.prefix) === namespace)) {
                    result = attribute.value;
                    break;
                }
            }
        }

        return result;
    }

    /**
    * @name - getFirstElementByTagNameNS
    * @description - Gets the first matching element that matches the specified tagName and namespace.
    * @static
    * @private
    * @param {Element} context - The context to search within.
    * @param {string} tagName - The tagName to match.
    * @param {string} namespace - The namespace to match.
    * @returns {Element} - The first matching element found, or null if there are no matches.
    */
    private static getFirstElementByTagNameNS(context: Element, tagName: string, namespace: string): Element {
        if (context) {
            let matches = context.getElementsByTagNameNS(namespace, tagName);

            if (matches && matches.length) {
                return matches[0];
            }
        }

        return null;
    }
}