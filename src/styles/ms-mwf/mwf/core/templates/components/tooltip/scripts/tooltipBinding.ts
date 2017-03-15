declare function require(s: string[], fn: Function): void;

require(['tooltip', 'componentFactory'], (tooltipModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': tooltipModule.Tooltip }]);
    }
});