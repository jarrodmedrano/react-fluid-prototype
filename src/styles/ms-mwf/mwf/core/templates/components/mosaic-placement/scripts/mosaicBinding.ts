declare function require(s: string[], fn: Function): void;

require(['mosaicPlacement', 'componentFactory'], (mosaicPlacementModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': mosaicPlacementModule.MosaicPlacement }]);
    }
});