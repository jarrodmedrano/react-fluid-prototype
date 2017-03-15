/// <amd-module name="handleImageError"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import { css, selectElements } from 'htmlExtensions';

// To support IE/Edge browsers, the SVGs have to be url-encoded; however, it turns out only a few characters actually need to be encoded. 
// For example:  '%20' is heavier than ' ' so not encoding the spaces is an optimization.
// See:  https://css-tricks.com/probably-dont-base64-svg/ and https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
// TODO: 9741630 - further optimize SVG strings

/**
 * @name - appSvg
 * @description - SVG-version of the app default image --> core\images\content-images\app-glyph-default-large.png
 * @const
 * @type {string}
 */
const appSvg =
`data:image/svg+xml;charset=utf-8,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999\
/xlink' x='0px' y='0px' viewBox='0 0 60 60' style='enable-background:new 0 0 60 60%3B' xml:space='preserve'%3E%3Cstyle %3E.\
st0%7Bfill:%23FFF%3B%7D%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M0 0 h60 v32 H32 v28 H0 V0 z M28 28 V4 H4 v24 H28 z M28 56 V32 H4 v24 H28\
 z M56 28 V4 H32 v24 H56 z'/%3E%3C/g%3E%3C/svg%3E`;

/**
 * @name - genericSvg
 * @description - SVG-version of the generic default image --> core\images\content-images\generic-glyph-default-large.png
 * @const
 * @type {string}
 */
const genericSvg =
`data:image/svg+xml;charset=utf-8,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999\
/xlink' x='0px' y='0px' viewBox='0 0 64 64' style='enable-background:new 0 0 64 64%3B' xml:space='preserve'%3E%3Cstyle %3E.\
st0%7Bfill:%23FFF%3B%7D%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M64,8v48H0V8H64z M4,12v21.2l14-14l20,20l8-8l14,14V12H4z M4,52h41.2L18,24.\
8l-14,14V52z M60,52v-1.2l-14-14 L40.8,42l10,10H60z M50,24c-0.5,0-1-0.2-1.4-0.6C48.2,23,48,22.5,48,22s0.2-1,0.6-1.4C49,20.2,49.5,20,50,20s1\
,0.2,1.4,0.6 C51.8,21,52,21.5,52,22s-0.2,1-0.6,1.4C51,23.8,50.5,24,50,24z'/%3E%3C/g%3E%3C/svg%3E`;

/**
 * @name - personSvg
 * @description - SVG-version of the person (artist) default image --> core\images\content-images\artist-glyph-default-large.png
 * @const
 * @type {string}
 */
const personSvg =
`data:image/svg+xml;charset=utf-8,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999\
/xlink' x='0px' y='0px' viewBox='0 0 64 64' style='enable-background:new 0 0 64 64%3B' xml:space='preserve'%3E%3Cstyle %3E.\
st0%7Bfill:%23FFF%3B%7D%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M41.7,37.9c2.8,1,\5.3,2.3,7.6,4.1c2.3,1.8,4.2,3.8,5.7,6c1.6,2.3,2.8,4.7,3\
.7,7.5c0.8,2.8,1.2,5.5,1.2,8.5h-4 c0-3.4-0.6-6.5-1.8-9.4c-1.2-2.9-2.9-5.4-4.9-7.5s-4.6-3.8-7.5-4.9c-3-1.3-6.1-1.9-9.5-1.9c-2.2,0-4.4,0.3-6\
.3,0.8 c-2,0.5-4,1.4-5.7,2.4c-1.8,1-3.4,2.3-4.7,3.8c-1.4,1.4-2.7,3.1-3.7,4.7c-1,1.7-1.8,3.7-2.4,5.7S8.5,61.8,8.5,64h-4%09c0-3,0.4-5.8,1.3-\
8.5c0.9-2.7,2.1-5.2,3.7-7.4c1.6-2.3,3.5-4.3,5.7-6s4.7-3.1,7.5-4.2c-1.6-0.9-3.1-1.9-4.4-3.2%09c-1.3-1.3-2.4-2.6-3.3-4.2c-0.9-1.6-1.6-3.2-2.\
1-4.8c-0.4-1.7-0.6-3.5-0.6-5.2c0-2.8,0.5-5.3,1.6-7.7c1-2.4,2.5-4.4,4.3-6.3%09c1.8-1.9,3.9-3.2,6.3-4.3c2.4-1,4.9-1.6,7.7-1.6c2.8,0,5.3,0.5,\
7.7,1.6c2.4,1,4.4,2.5,6.3,4.3s3.2,3.9,4.3,6.3 c1,2.4,1.6,4.9,1.6,7.7c0,1.8-0.2,3.6-0.7,5.2c-0.5,1.7-1.2,3.4-2.1,4.8c-0.9,1.5-2,2.9-3.3,4.2\
C44.6,36,43.3,37,41.7,37.9z M16.4,20.5c0,2.2,0.4,4.3,1.3,6.1s2,3.6,3.4,5c1.4,1.4,3.1,2.6,5,3.4c2,0.8,4,1.3,6.1,1.3c2.2,0,4.3-0.4,6.1-1.3 c\
1.9-0.9,3.6-2,5-3.4c1.4-1.4,2.6-3.1,3.4-5s1.3-4,1.3-6.1s-0.4-4.3-1.3-6.1s-2-3.6-3.4-5c-1.4-1.4-3.1-2.6-5-3.4 c-2-0.8-4-1.3-6.1-1.3c-2.2,0-\
4.3,0.4-6.1,1.3s-3.6,2-5,3.4c-1.4,1.4-2.6,3.1-3.4,5S16.4,18.3,16.4,20.5z'/%3E%3C/g%3E%3C/svg%3E`;

/**
 * @name - videoSvg
 * @description - SVG-version of the video (movie) default image --> core\images\content-images\movie-glyph-default-large.png
 * @const
 * @type {string}
 */
const videoSvg =
`data:image/svg+xml;charset=utf-8,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999\
/xlink' x='0px' y='0px' viewBox='0 0 64 64' style='enable-background:new 0 0 64 64%3B' xml:space='preserve'%3E%3Cstyle %3E.\
st0%7Bfill:%23FFF%3B%7D%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M0,10h64v44H0V10z M60,50V14h-4v4h-4v-4H12v4H8v-4H4v36h4v-4h4v4h40v-4h4v4H\
60z M8,26v-4h4v4H8z M8,34v-4h4v4 H8z M8,42v-4h4v4H8z M52,26v-4h4v4H52z M52,34v-4h4v4H52z M52,42v-4h4v4H52z'/%3E%3C/g%3E%3C/svg%3E`;

/**
 * @name - smallSize
 * @description - size (in pixels) for the small version of each SVG
 * @const
 * @type {string}
 */
const smallSize = 24;

/**
 * @name - largeSize
 * @description - size (in pixels) for the large version of each SVG
 * @const
 * @type {string}
 */
const largeSize = 57;

/**
 * @name - handleImageError
 * @description - handles image errors (replaces handle-img-error.js) by replacing the default image with a vector graphic
 * @export
 * @param {HTMLImageElement} target - the target image that needs to be replaced
 * @param {GraphicSize} size - the size of the graphic to be replaced (small or large)
 * @param [GraphicType] graphicType - optional: the type of vector graphic to use (app, image, person, or video), default is image
 * @returns {void}
 */
export function handleImageError(target: HTMLImageElement, size = GraphicSize.large, graphicType?: GraphicType): void {
    let dimensions: number;

    // using switch-case for extensibility, in case new sizes are ever added
    switch (size) {
        case GraphicSize.small:
            dimensions = smallSize;
            break;
        case GraphicSize.large:
        default:
            dimensions = largeSize;
            break;
    }

    handleImageErrorCustomDimensions(target, dimensions, graphicType);
}

/**
 * @name - handleImageErrorCustomDimensions
 * @description - handles image errors (replaces handle-img-error.js) by replacing the default image with a vector graphic,
 *                allowing the user to set custom SVG dimensions if desired
 * @export
 * @param {HTMLImageElement} target - the target image that needs to be replaced
 * @param {number} dimensions - the size of the graphic to be replaced (in pixels)
 *                              the SVG will be square so this value will set height and width
 *                              if no dimensions are provided or value of less than 1 is provided, then will default to large size (57px)
 * @param [GraphicType] graphicType - optional: the type of vector graphic to use (app, image, person, or video), default is image
 * @returns {void}
 */
export function handleImageErrorCustomDimensions(
    target: HTMLImageElement,
    dimensions = largeSize,
    graphicType = GraphicType.generic): void {

    if (!target) {
        return;
    }

    // default to large size if invalid value provided (null, undefinied, or if value is less than 1)
    dimensions = dimensions && dimensions > 0 ? dimensions : largeSize;

    if (target.parentElement) {
        const siblings = selectElements('source', target.parentElement) as HTMLSourceElement[];

        for (let sibling of siblings) {
            sibling.srcset = '';
        }
    }

    target.srcset = '';
    target.src = getVectorGraphic(graphicType);

    if (target.src.length) {
        css(target, 'height', `${dimensions}px`);
        css(target, 'width', `${dimensions}px`);
    }
}

/**
 * @name - getVectorGraphic
 * @description - creates the vector graphic markup to be used in the img src
 * @param {GraphicType} graphic - the type of vector graphic to use
 * @returns {string} - the src value with the vector graphic
 */
function getVectorGraphic(graphic: GraphicType): string {
    switch (graphic) {
        case GraphicType.app:
            return appSvg;
        case GraphicType.person:
            return personSvg;
        case GraphicType.video:
            return videoSvg;
        case GraphicType.generic:
        default:
            return genericSvg;
    }
}

/**
 * @name - GraphicType
 * @description - the types of vector graphics available
 * @export
 * @enum {number} - number corresponding to each graphic type
 */
export const enum GraphicType {
    // why not alphabetical?  we want generic to be first since it's the default and will get assigned the number 0
    generic,
    app,
    person,
    video
}

/**
 * @name - GraphicSize
 * @description - the sizes of vector graphics available
 * @export
 * @enum {number} - number corresponding to each graphic size
 */
export const enum GraphicSize {
    large,
    small
}