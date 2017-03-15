/// <amd-module name="componentAutoInitializer"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
import {ComponentFactory} from 'componentFactory';
import {ActionBar} from 'actionBar';
import {ActionMenu} from 'actionMenu';
import {ActionToggle} from 'actionToggle';
import {Alert} from 'alert';
import {AutoSuggest} from 'autosuggest';
import {Button} from 'button';
import {BackToTop} from 'backToTop';
import {Checkbox} from 'checkbox';
import {ChoiceSummary} from 'choiceSummary';
import {Combo} from 'combo';
import {CompareChart} from 'compareChart';
import {ContentToggle} from 'contentToggle';
import {DateTimePicker} from 'dateTimePicker';
import {DeviceActions} from 'deviceActions';
import {Dialog} from 'dialog';
import {Drawer} from 'drawer';
import {FeedHeroItem} from 'feed-hero-item';
import {File} from 'file';
import {Flyout} from 'flyout';
import {HeroItem} from 'heroItem';
import {ImmersiveHeroItem} from 'immersiveHeroItem';
import {InPageNavigation} from 'inPageNavigation';
import {MosaicPlacement} from 'mosaicPlacement';
import {MultiFeature} from 'multiFeature';
import {MultiHeroItem} from 'multiHeroItem';
import {MultiSlideCarousel} from 'multi-slide-carousel';
import {NavigationMenu} from 'navigationMenu';
import {PageBar} from 'pageBar';
import {PageBehaviors} from 'pageBehaviors';
import {Pagination} from 'pagination';
import {Pivot} from 'pivot';
import {ProductPlacement} from 'productPlacement';
import {RangeSlider} from 'rangeSlider';
import {Rating} from 'rating';
import {RefineItem} from 'refineItem';
import {RefineMenu} from 'refineMenu';
import {Select} from 'select';
import {SelectButton} from 'selectButton';
import {SelectMenu} from 'selectMenu';
import {SequenceIndicator} from 'sequenceIndicator';
import {SingleSlideCarousel} from 'single-slide-carousel';
import {Slider} from 'slider';
import {Social} from 'social';
import {SupplementalNavigation} from 'supplementalNavigation';
import {Table} from 'table';
import {Toggle} from 'toggle';
import {Tooltip} from 'tooltip';
import {Video} from 'video';
import {VideoControls} from 'videoControls';
import {VideoClosedCaptions} from 'video-closed-captions';
import {TtmlContext} from 'ttml-context';
import {TtmlParser} from 'ttml-parser';
import {TtmlSettings} from 'ttml-settings';
import {TtmlTimeParser} from 'ttml-time-parser';

// This class left blank on purpose. It's required for the webpack bundle to work.
export class ComponentAutoInitializer {
}

// A self executor that will create all components.
(
    () => {
        ComponentFactory.create([
            { c: ActionBar },
            { c: ActionMenu },
            { c: ActionToggle },
            { c: Alert, selector: '.c-alert, .m-alert' },
            { c: BackToTop, selector: '.c-back-to-top, .m-back-to-top' },
            { c: Button },
            { c: Checkbox },
            { c: ChoiceSummary },
            { c: Combo },
            { c: CompareChart, selector: '.c-compare-chart, .m-compare-chart' },
            { c: ContentToggle },
            { c: DateTimePicker },
            { c: DeviceActions },
            { c: Dialog },
            { c: Drawer },
            { c: FeedHeroItem },
            { c: File },
            { c: Flyout },
            { c: HeroItem, selector: '.c-hero, .m-hero-item' },
            { c: ImmersiveHeroItem },
            { c: InPageNavigation, selector: '.c-in-page-navigation, .m-in-page-navigation' },
            { c: MosaicPlacement },
            { c: MultiFeature },
            { c: MultiHeroItem },
            { c: MultiSlideCarousel },
            { c: NavigationMenu },
            { c: PageBar },
            { c: PageBehaviors },
            { c: Pagination, selector: '.c-pagination, .m-pagination' },
            { c: Pivot },
            { c: ProductPlacement },
            { c: RangeSlider },
            { c: Rating },
            { c: RefineMenu },
            { c: Select },
            { c: SelectButton },
            { c: SelectMenu, selector: '.c-select-menu, .c-select-menu .c-menu-item.f-sub-menu' },
            { c: SequenceIndicator, selector: '.context-sequence-indicator, .c-sequence-indicator' },
            { c: SingleSlideCarousel },
            { c: Slider },
            { c: Social, selector: '.c-social, .m-social' },
            { c: SupplementalNavigation, selector: '.c-supplemental-nav, .m-supplemental-nav' },
            { c: Table },
            { c: Toggle },
            { c: Tooltip },
            { c: Video, eventToBind: 'DOMContentLoaded' }
        ]);
    }
)();
