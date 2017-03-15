declare function require(s: string[], fn: Function): void;

require(['productPlacement', 'componentFactory'], (productPlacementModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': productPlacementModule.ProductPlacement }]);
    }
});