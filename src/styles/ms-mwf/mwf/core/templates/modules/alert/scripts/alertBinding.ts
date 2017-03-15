declare function require(s: string[], fn: Function): void;

require(['alert', 'componentFactory'], (alertModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': alertModule.Alert }]);
    }
});
