declare function require(s: string[], fn: Function): void;

require(['carousel', 'componentFactory'], (carouselModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{'component': carouselModule.Carousel}]);
    }
});