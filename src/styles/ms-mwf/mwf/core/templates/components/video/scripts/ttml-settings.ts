/// <amd-module name="ttml-settings"/>
import {extend, IClientDimension, IDictionaryStringString, IGrid} from 'utility';

// Timed Text Markup Language (TTML).
// See http://www.w3.org/TR/ttml1/ for more details.

export const xmlNS = 'http://www.w3.org/XML/1998/namespace';

/**
* @interface ITtmlSettings
* @classdesc - The ITtmlSettings interface contract.
*/
export interface ITtmlSettings {
    ttmlNamespace?: string;
    ttmlStyleNamespace?: string;
    ttmlParameterNamespace?: string;
    ttmlMetaNamespace?: string;
    idPrefix?: string;
    mediaFrameRate?: number;
    mediaFrameRateMultiplier?: number;
    mediaSubFrameRate?: number;
    mediaTickRate?: number;
    supportedTimeBase?: string;
    rootContainerRegionDimensions?: IClientDimension;
    relatedMediaObjectRegion?: IClientDimension;
    cellResolution?: IGrid;
    defaultRegionStyle?: IDictionaryStringString;
    fontMap?: IDictionaryStringString;
    log?: Function;
}

/**
* @class - TtmlSettings
* @classdesc - The TtmlSettings class is used to pass settings between the ttml parser, the ttml context, and the outside world.
*              It supplies default values which can be overridden via overrides passed to the constructor.
* @export
*/
export class TtmlSettings implements ITtmlSettings {
    /**
    * @name - ttmlNamespace
    * @description - The ttml namespace to use.
    * @public
    * @type {string}
    */
    public ttmlNamespace = 'http://www.w3.org/ns/ttml';

    /**
    * @name - ttmlStyleNamespace
    * @description - The ttml style namespace to use.
    * @public
    * @type {string}
    */
    public ttmlStyleNamespace = 'http://www.w3.org/ns/ttml#styling';

    /**
    * @name - ttmlParameterNamespace
    * @description - The ttml parameter namespace to use.
    * @public
    * @type {string}
    */
    public ttmlParameterNamespace = 'http://www.w3.org/ns/ttml#parameter';

    /**
    * @name - ttmlMetaNamespace
    * @description - The ttml metadata namespace to use.
    * @public
    * @type {string}
    */
    public ttmlMetaNamespace = 'http://www.w3.org/ns/ttml#metadata';

    /**
    * @name - idPrefix
    * @description - The id prefix to use so ids copied from the ttml doc are unique.
    * @public
    * @type {string}
    */
    public idPrefix = '';

    /**
    * @name - mediaFrameRate
    * @description - The media frame rate to use.
    * @public
    * @type {number}
    */
    public mediaFrameRate = 30;

    /**
    * @name - mediaFrameRateMultiplier
    * @description - The media frame rate multiplier to use.
    * @public
    * @type {number}
    */
    public mediaFrameRateMultiplier = 1;

    /**
    * @name - mediaSubFrameRate
    * @description - The media sub frame rate to use.
    * @public
    * @type {number}
    */
    public mediaSubFrameRate = 1;

    /**
    * @name - mediaTickRate
    * @description - The media tick rate to use.
    * @public
    * @type {number}
    */
    public mediaTickRate = 1000;

    /**
    * @name - supportedTimeBase
    * @description - The support timebase value.
    * @public
    * @type {string}
    */
    public supportedTimeBase = 'media';

    /**
    * @name - rootContainerRegionDimensions
    * @description - The root container's dimensions.
    * @public
    * @type {IClientDimension}
    */
    public rootContainerRegionDimensions: IClientDimension;

    /**
    * @name - relatedMediaObjectRegion
    * @description - The media object's dimensions.
    * @public
    * @type {IClientDimension}
    */
    public relatedMediaObjectRegion: IClientDimension;

    /**
    * @name - cellResolution
    * @description - The default cell grid.
    * @public
    * @type {IGrid}
    */
    public cellResolution: IGrid = { rows: 15, columns: 32 };

    /**
    * @name - defaultRegionStyle
    * @description - The default region style.
    * @public
    * @type {IDictionaryStringString}
    */
    public defaultRegionStyle: IDictionaryStringString = {
        backgroundColor: 'transparent',
        color: '#E8E9EA',
        direction: 'ltr',
        display: 'auto',
        displayAlign: 'before',
        extent: 'auto',
        fontFamily: 'default',
        fontSize: '1c',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 'normal',
        opacity: '1',
        origin: 'auto',
        overflow: 'hidden',
        padding: '0',
        showBackground: 'always',
        textAlign: 'start',
        textDecoration: 'none',
        textOutline: 'none',
        unicodeBidi: 'normal',
        visibility: 'visible',
        wrapOption: 'noWrap',
        writingMode: 'lrtb',
        zIndex: 'auto'
    };

    /**
    * @name - fontMap
    * @description - The default font map.
    * @public
    * @type {IDictionaryStringString}
    */
    public fontMap: IDictionaryStringString = {};

    /**
    * @name - log
    * @description - The logging function to use in debug mode.
    * @public
    * @type {Function}
    */
    public log: Function;

    /**
    * @constructor
    * @description - Constructor for the TtmlSettings class.
    * @public
    * @param {ITtmlSettings} [settingsOverrides] - Optional settings overrides for this TtmlSettings instance.
    */
    constructor(settingsOverrides?: ITtmlSettings) {
        // These are from the Simple Delivery Profile
        // Per spec recommendation that default be monospace sans serif.
        this.fontMap['default'] = 'Lucida sans typewriter, Lucida console, Consolas';
        this.fontMap['monospaceSerif'] = 'Courier';
        this.fontMap['proportionalSerif'] = 'Times New Roman, Serif';
        this.fontMap['monospaceSansSerif'] = 'Lucida sans typewriter, Lucida console, Consolas';
        this.fontMap['proportionalSansSerif'] = 'Arial, Sans-serif';
        this.fontMap['casual'] = 'Verdana';
        this.fontMap['cursive'] = 'Zapf-Chancery, Segoe script, Cursive';
        this.fontMap['smallCaps'] = 'Arial, Helvetica';

        // These are others from the broader ttml (v1.0)
        this.fontMap['monospace'] = 'Lucida sans typewriter, Lucida console, Consolas';
        this.fontMap['sansSerif'] = 'Arial, Sans-serif';
        this.fontMap['serif'] = 'Times New Roman, Serif';

        if (settingsOverrides) {
            extend(this, settingsOverrides);
        }
    }
}