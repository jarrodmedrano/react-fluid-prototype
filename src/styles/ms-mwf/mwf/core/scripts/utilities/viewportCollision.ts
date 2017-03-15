/// <amd-module name="viewportCollision"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import * as HtmlExtensions from 'htmlExtensions';

/**
 * Determines whether or not an HTML Element collides with the edges of the viewport (is partially or completely hidden)
 * 
 * @export
 * @param {HTMLElement} element - the element
 * @returns {(ICollisionsDetected | boolean)} - an ICollisionsDetected object if a collision is detected,
 * else it returns 'false' if no collisions detected
 */
export function collidesWith(element: HTMLElement): ICollisionsDetected | boolean {
    let elementRectangle = HtmlExtensions.getClientRect(element) as ClientRect;
    let collisionsDetected: ICollisionsDetected = {
        top: false,
        bottom: false,
        left: false,
        right: false
    };

    // Detecting width to account for lingering listeners and hidden elements
    // without it collision would be detected at 0,0 (top,left) for hidden elements or non removed listeners
    if (elementRectangle.width !== 0) {
        if (elementRectangle.top <= 0) {
            collisionsDetected.top = true;
        }
        if (window.innerHeight <= elementRectangle.bottom || document.documentElement.clientHeight <= elementRectangle.bottom) {
            collisionsDetected.bottom = true;
        }
        if (elementRectangle.left <= 0) {
            collisionsDetected.left = true;
        }
        if (window.innerWidth <= elementRectangle.right || document.documentElement.clientWidth <= elementRectangle.right) {
            collisionsDetected.right = true;
        }
    }

    for (let direction in collisionsDetected) {
        if (collisionsDetected[direction] === true) {
            return collisionsDetected;
        }
    }
    
    return false;
}

/**
 * Defines the ICollisionsDetected interface for the collidesWith method
 * 
 * @interface ICollisionsDetected
 */
export interface ICollisionsDetected {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
    [direction: string]: boolean;
}