declare function require(s: string[], fn: Function): void;

require(['rating', 'componentFactory'], (ratingModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ c: ratingModule.Rating }]);
    }
});