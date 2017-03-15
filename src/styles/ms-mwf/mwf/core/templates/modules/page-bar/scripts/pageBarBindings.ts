declare function require(s: string[], fn: Function): void;

require(['pageBar', 'componentFactory'], (pageBarModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': pageBarModule.PageBar }]);
    }
});