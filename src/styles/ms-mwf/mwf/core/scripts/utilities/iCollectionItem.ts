/// <amd-module name="ICollectionItem"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

/**
* @interface ICollectionItem
* @classdesc - The interface which collection items must implement.
* @export
*/
export interface ICollectionItem {
    onCollectionItemHidden(): void;
    onCollectionItemShown(): void;
}