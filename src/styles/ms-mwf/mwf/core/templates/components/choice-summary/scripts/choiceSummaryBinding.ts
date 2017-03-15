declare function require(s: string[], fn: Function): void;

require(['choiceSummary', 'componentFactory'], (choiceSummaryModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': choiceSummaryModule.ChoiceSummary }]);
    }
});