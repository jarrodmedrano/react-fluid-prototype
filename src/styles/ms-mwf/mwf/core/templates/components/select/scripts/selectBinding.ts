declare function require(s: string[], fn: Function): void;

require(['select', 'componentFactory'], (selectModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': selectModule.Select }]);
    }
});
