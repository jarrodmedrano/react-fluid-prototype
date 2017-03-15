declare function require(s: string[], fn: Function): void;

require(['compareChart', 'componentFactory'], (compareChartModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': compareChartModule.CompareChart, 'eventToBind': 'DOMContentLoaded' }]);
    }
});