declare function require(s: string[], fn: Function): void;

require(['multiFeature', 'componentFactory'], (multiFeatureModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': multiFeatureModule.MultiFeature }]);
    }
});
