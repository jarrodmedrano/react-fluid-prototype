declare function require(s: string[], fn: Function): void;

require(['dialog', 'componentFactory'], (dialogModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': dialogModule.Dialog }]);
    }
});