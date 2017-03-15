declare function require(s: string[], fn: Function): void;

require(['rangeSlider', 'componentFactory'], (rangeSliderModule: any, factoryModule: any) => {
    if (factoryModule.ComponentFactory && factoryModule.ComponentFactory.create) {
        factoryModule.ComponentFactory.create([{ c: rangeSliderModule.RangeSlider }]);
    }
});