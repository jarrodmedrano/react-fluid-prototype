declare function require(s: string[], fn: Function): void;

require(['table', 'componentFactory'], (tableModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': tableModule.Table }]);
    }
});