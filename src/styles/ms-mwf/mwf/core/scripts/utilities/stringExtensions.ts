/// <amd-module name="stringExtensions"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

/**
* @name - isNullOrWhiteSpace
* @description - Determines if the specified string is undefined, null, empty, or whitespace.
* @export
* @public
* @param {string} value - The string to examine.
* @returns {boolean} - True if the value is undefined, null, empty, or whitespace, otherwise false.
*/
export function isNullOrWhiteSpace(value: string): boolean {
    return (!value) || (!trim(value));
}

/**
* @name - trim
* @description - Trims leading and trailing whitespace from the string.
* @export
* @public
* @param {string} value - The string to examine.
* @returns {string} - The trimmed string.
*/
export function trim(value: string): string {
    if (!value) {
        return null;
    }

    if (value.trim) {
        return value.trim();
    }

    return value.replace(/^\s+|\s+$/g, '');
}

/**
* @name - startsWith
* @description - Determines if the specified string starts with the specified value.
* @export
* @public
* @param {string} value - The string to look in.
* @param {string} prefix - The prefix to look for.
* @returns {boolean} - True if the string starts with the prefix, otherwise false.
*/
export function startsWith(value: string, prefix: string, ignoreCase: boolean = true): boolean {
    if (!value || !prefix) {
        return false;
    }

    if (ignoreCase) {
        value = value.toLocaleLowerCase();
        prefix = prefix.toLocaleLowerCase();
    }

    if ((<any>value).startsWith) {
        return (<any>value).startsWith(prefix);
    }

    return value.indexOf(prefix) === 0;
}

/**
* @name - endsWith
* @description - Determines if the specified string ends with the specified value.
* @export
* @public
* @param {string} value - The string to look in.
* @param {string} suffix - The suffix to look for.
* @returns {boolean} - True if the string ends with the suffix, otherwise false.
*/
export function endsWith(value: string, suffix: string, ignoreCase: boolean = true): boolean {
    if (!value || !suffix) {
        return false;
    }

    if (ignoreCase) {
        value = value.toLocaleLowerCase();
        suffix = suffix.toLocaleLowerCase();
    }

    if ((<any>value).endsWith) {
        return (<any>value).endsWith(suffix);
    }

    return value.lastIndexOf(suffix) === value.length - suffix.length;
}

/**
* @name - getMatchLength
* @description - Gets the number of characters the two specified strings match for.
* @export
* @public
* @param {string} string1 - The first string.
* @param {string} string2 - The second string.
* @returns {number} - The number of characters the two specified strings match for, if any.
*/
export function getMatchLength(string1: string, string2: string, ignoreCase: boolean = true): number {
    if (!string1 || !string2) {
        return 0;
    }

    let match = 0;

    if (ignoreCase) {
        string1 = string1.toLocaleLowerCase();
        string2 = string2.toLocaleLowerCase();
    }

    while (string1.charCodeAt(match) === string2.charCodeAt(match)) {
        match++;
    }

    return match;
}

/**
* @name - format
* @description - Builds a string from a format specifier and replacement parameters.
* @export
* @public
* @param {string} formatSpecifier - The format specifier for the formatted string.
* @param {any[]} params - The replacement string parameters.
* @returns {string} - The formatted string.
*/
export function format(formatSpecifier: string, ...parameters: any[]): string {
    return formatSpecifier.replace(/{(\d+)}/g, function (match, index) {
        if (index >= parameters.length) {
            return match;
        }

        let value = parameters[index];

        if ((typeof value !== 'number') && !value) {
            return '';
        }
        
        if (typeof value === 'string') {
            return value;
        }

        return value.toString();
    });
}