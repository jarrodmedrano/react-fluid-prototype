declare function require(s: string[], fn: Function): void;

require(['refineMenu', 'componentFactory'], (refineMenuModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': refineMenuModule.RefineMenu }]);
    }
});
