declare function require(s: string[], fn: Function): void;

require(['selectButton', 'componentFactory'], (selectButtonModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': selectButtonModule.SelectButton }]);
    }
});