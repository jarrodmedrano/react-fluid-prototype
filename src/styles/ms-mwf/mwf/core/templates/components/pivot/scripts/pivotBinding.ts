declare function require(s: string[], fn: Function): void;

require(['pivot', 'componentFactory'], (pivotModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': pivotModule.Pivot }]);
    }
});
