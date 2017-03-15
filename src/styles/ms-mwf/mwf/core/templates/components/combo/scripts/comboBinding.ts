declare function require(s: string[], fn: Function): void;

require(['combo', 'componentFactory'], (comboModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': comboModule.Combo }]);
    }
});