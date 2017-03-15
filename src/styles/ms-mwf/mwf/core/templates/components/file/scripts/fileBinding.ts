declare function require(s: string[], fn: Function): void;

require(['file', 'componentFactory'], (fileModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': fileModule.File }]);
    }
});
