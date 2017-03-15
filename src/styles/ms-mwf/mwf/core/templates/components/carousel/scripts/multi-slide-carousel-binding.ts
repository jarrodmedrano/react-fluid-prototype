declare function require(s: string[], fn: Function): void;

require(['multi-slide-carousel', 'componentFactory'], (multiSlideCarouselModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': multiSlideCarouselModule.MultiSlideCarousel}]);
    }
});