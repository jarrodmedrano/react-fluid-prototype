/// <amd-module name="ttml-time-parser"/>

// Timed Text Markup Language (TTML).
// See http://www.w3.org/TR/ttml1/ for more details.

/**
* @class - TtmlTimeParser
* @classdesc - The TtmlTimeParser class is used to parse ttml time expressions which can be absolute or relative.
* @export
*/
export class TtmlTimeParser {
    /**
    * @name - absoluteTimeRegex
    * @description - Regex to parse absolute ttml times. (clock-time)
    *                hours ":" minutes ":" seconds ( fraction | ":" frames ( "." sub-frames )? )?
    *                NOTE: (johnlemi)  Our clocktime regex matches 1 or 2 digits for hours instead of 2 because even
    *                though the spec says 2 we have some existing ttml from the Office team with end attrs with 1 hour digit
    * @static
    * @private
    * @type {string}
    */
    private static absoluteTimeRegex = /^(\d{1,}):(\d{2}):(\d{2})((\.\d{1,})|:(\d{2,}(\.\d{1,})?))?$/;

    /**
    * @name - relativeTimeRegex
    * @description - Regex to parse relative ttml times. (offset-time)
    *                time-count fraction? metric
    * @static
    * @private
    * @type {string}
    */
    private static relativeTimeRegex = /^(\d+(\.\d+)?)(ms|[hmsft])$/;

    /**
    * @const­ructor
    * @description - Constructor for the TtmlTimeParser class.
    * @public
    * @param {number} mediaFrameRate - The ttml media frame rate.
    * @param {number} mediaTickRate - The ttml media tick rate.
    */
    constructor(private mediaFrameRate: number, private mediaTickRate: number) {
        // Nothing to do at this time...
    }

    /**
    * @name - parse
    * @description - Parses a ttml time expression string into a number.
    * @public
    * @param {string} ttmlTime - The time expression to parse.
    * @returns {number} - The number the time expression represents, or 0 if the exression doesn't match.
    */
    public parse(ttmlTime: string): number {
        if (!ttmlTime) {
            return 0;
        }

        let absoluteTime = TtmlTimeParser.absoluteTimeRegex.exec(ttmlTime);

        if (absoluteTime && (absoluteTime.length > 3)) {
            let hours = parseInt(absoluteTime[1], 10) * 60 * 60;
            let minutes = parseInt(absoluteTime[2], 10) * 60;
            let seconds = parseInt(absoluteTime[3], 10);
            let subseconds = 0;

            if (absoluteTime[5]) {
                subseconds = parseFloat(absoluteTime[4]) * 1000;
            }

            if (absoluteTime[6]) {
                subseconds = Math.round(parseFloat(absoluteTime[6]) * this.getTimeUnitMultiplier('f'));
            }

            return (1000 * (hours + minutes + seconds)) + subseconds;
        }

        let relativeTime = TtmlTimeParser.relativeTimeRegex.exec(ttmlTime);

        if (relativeTime && (relativeTime.length > 3)) {
            return Math.round(parseFloat(relativeTime[1]) * this.getTimeUnitMultiplier(relativeTime[3]));
        }

        return 0;
    }

    /**
    * @name - getTimeUnitMultiplier
    * @description - Converts a ttml time unit expression string into a multiplier number.
    * @private
    * @param {string} timeUnit - The time unit expression.
    * @returns {number} - The multiplier value, or 0 if the unit exression doesn't match.
    */
    private getTimeUnitMultiplier(timeUnit: string): number {
        switch (timeUnit) {
            case 'h':
                return 1000 * 60 * 60;
            case 'ms':
                return 1;
            case 'm':
                return 1000 * 60;
            case 's':
                return 1000;
            case 'f':
                return 1000 / this.mediaFrameRate;
            case 't':
                return 1000 / this.mediaTickRate;
            default:
                return 0;
        }
    }
}