declare function require(s: string[], fn: Function): void;

require(['pagination', 'componentFactory'], (paginationModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': paginationModule.Pagination }]);
    }
});
