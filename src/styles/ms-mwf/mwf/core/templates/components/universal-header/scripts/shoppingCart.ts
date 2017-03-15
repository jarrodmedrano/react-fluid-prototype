/// <amd-module name="shoppingCart"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

/**
 *UHF Shopping cart
*/
import * as $ from 'jquery';
import {selectElements} from 'htmlExtensions';
 export class ShoppingCart {

    /**
    * The ID of the shopping cart count element
    *
    * @public
    * @type {string}
    */
     public static shoppingCartFrameId = 'shell-cart-count';
     public static shoppingCartCountSelector = '.shopping-cart-amount';

     shoppingCartFrame : HTMLElement;

       /**
        * Constructor of a shopping cart component.
        * @class ShoppingCart
        * @classdesc Constructor of a ShoppingCart component.
        * @param {HTMLElement} shoppingCartFrame - the html element containing the shopping cart iframe.
        */
       constructor() {
            this.shoppingCartFrame = document.getElementById(ShoppingCart.shoppingCartFrameId);
            if (!this.shoppingCartFrame) {
                return null;
            }
            let shoppingCartSummaryUrl = this.shoppingCartFrame.getAttribute('data-src');
            if (!!shoppingCartSummaryUrl) {
                this.shoppingCartFrame.setAttribute('src', shoppingCartSummaryUrl);
             }

            $(window).on('message onmessage', this.handleEvent);
        }

        /** The main event handler that will respond user initiated on message event
        * @param  {JQueryEventObject} $event - The JQuery event triggered on message
        * @returns void
        */
        private handleEvent($event: any): void {
            let data = $event.originalEvent.data;
            let count = '0';
            let cartCountElements = selectElements(ShoppingCart.shoppingCartCountSelector) as HTMLElement[];

            if (data && data.split && cartCountElements) {
                let dataArr = data.split('=');
                if (dataArr[0] === 'DR_Cart_Count') {
                    count = dataArr[1];
                    $(cartCountElements).text(count);
                }
            }
        }
}