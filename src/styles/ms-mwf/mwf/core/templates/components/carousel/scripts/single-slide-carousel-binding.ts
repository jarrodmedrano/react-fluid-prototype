declare function require(s: string[], fn: Function): void;

require(['single-slide-carousel', 'componentFactory'], (singleSlideCarouselModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ 'component': singleSlideCarouselModule.SingleSlideCarousel}]);
    }
});