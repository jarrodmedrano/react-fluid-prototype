declare function require(s: string[], fn: Function): void;

require(['actionMenu', 'componentFactory'], (actionMenuModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': actionMenuModule.ActionMenu }]);
    }
});