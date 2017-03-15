declare function require(s: string[], fn: Function): void;

require(['toggle', 'componentFactory'], (toggleModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': toggleModule.Toggle }]);
    }
});