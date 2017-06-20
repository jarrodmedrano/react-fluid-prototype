import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import ButtonLink from '../../src/js/components/generic/link/ButtonLink';
import Heading from '../../src/js/components/generic/heading/Heading';
import Picture from '../../src/js/components/generic/picture/Picture';
import MosaicPicture from '../../src/js/components/generic/picture/MosaicPicture';
import Text from '../../src/js/components/generic/text/Text';
import Video from '../../src/js/components/generic/video/Video';
import DownArrow from '../../src/js/components/structure/header/downarrow/DownArrow';
import Starrating from '../../src/js/components/generic/starrating/Starrating';
import StickyBanner from '../../src/js/components/structure/header/stickynav/StickyBanner';
import StickyFooter from '../../src/js/components/structure/header/stickynav/StickyFooter';
import FooterLink from '../../src/js/components/generic/link/FooterLink';
import Tabs from '../../src/js/components/structure/header/tabs/Tabs';
import CompareTable from '../../src/js/components/structure/main/layouts/compare/CompareTable';
import Hero from '../../src/js/components/structure/main/layouts/hero/Hero';
import LegacyFeature from '../../src/js/components/structure/main/layouts/legacy/legacyFeature';
import LegacyKSP from '../../src/js/components/structure/main/layouts/legacy/legacyksp';
import LegacyCenteredBackdrop from '../../src/js/components/structure/main/layouts/legacy/legacycenteredbackdrop';
import LegacySpecs from '../../src/js/components/structure/main/layouts/legacy/legacySpecs';
import Mosaic from '../../src/js/components/structure/main/layouts/mosaic/Mosaic';
import VerticalPage from '../../src/js/components/structure/VerticalPage';
import classNames from 'classnames';

import '../../src/styles/fonts.scss';
import '../../src/styles/main.scss';

const Wrapper = (props) => {
    let templateClass = classNames(`${props.wrapperClass ? props.wrapperClass : null}`, `scene-vertical active`);

    return (
        <div id="app">
            <div>
                <main id="main">
                    <div>
                        <section className={templateClass} name={props.name} id={props.id}>
                            {props.children}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}


class Grid extends React.Component {
    render() {
        return (
            <div data-grid="col-12" class="context-control-appearance">
                {this.props.children}
            </div>
        )
    }
}

import * as data from '../data';
storiesOf('Heading', module)
    .add('Default', () => (
        <Grid>
            <Heading data={data.headingBlock}/>
        </Grid>
    ))
    .add('Center', () => (
        <Grid>
            <Heading data={data.headingBlockCenter}/>
        </Grid>
    ))
    .add('Right', () => (
        <Grid>
            <Heading data={data.headingBlockRight}/>
        </Grid>
    ));

storiesOf('Button Link', module)
    .add('Default', () => (
        <ButtonLink to="#" className="c-call-to-action c-glyph" aria-label="A button" children="Hello World"/>
    ));

storiesOf('Picture', module)
    .add('Default', () => (
        <Wrapper>
            <Picture data={data.pictureBlock}/>
        </Wrapper>
    ))
    .add('Mosaic Specific', () => (
        <Wrapper>
            <MosaicPicture data={data.pictureBlock}/>
        </Wrapper>
    ));

storiesOf('HTML Text', module)
    .add('Default', () => (
        <Grid>
            <Text data="Hello<br>Hi"/>
        </Grid>
    ));

storiesOf('Video', module)
    .add('Default', () => (
        <Video active={true} data={data.videoBlock} className="video-fullscreen fixed"/>
    ));

storiesOf('Down Arrow', module)
    .add('Default', () => (
        <DownArrow data={3} onClick={action('clicked')}/>
    ));

storiesOf('Star Rating', module)
    .add('Default', () => (
        <Starrating data={data.ratings}/>
    ));

storiesOf('Sticky Banner', module)
    .add('Default', () => (
        <Wrapper>
            <StickyBanner brand={data.stickyBanner}/>
        </Wrapper>
    ));

storiesOf('Sticky Footer', module)
    .add('2 Links (Should not appear)', () => (
        <Wrapper name="Section2" id="Section2">
            <StickyFooter data={data.oemGroupSmallest}/>
        </Wrapper>
    ));

storiesOf('Sticky Footer', module)
    .add('3 Links', () => (
        <Wrapper name="Section2" id="Section2">
            <StickyFooter data={data.oemGroupSmall}/>
        </Wrapper>
    ));

storiesOf('Sticky Footer', module)
    .add('Lots of Links (With breadcrumbs)', () => (
        <Wrapper name="Section2" id="Section2">
            <StickyFooter data={data.oemGroup}/>
        </Wrapper>
    ));

storiesOf('Compare Chart', module)
    .add('Default', () => (
        <Wrapper>
            <CompareTable data={data.Compare}/>
        </Wrapper>
    ));


storiesOf('Hero', module)
    .add('Right Center Dark', () => (
        <Wrapper>
            <Hero data={data.RightCenterDark}/>
        </Wrapper>
    ))
    .add('Right Top Dark', () => (
        <Wrapper>
            <Hero data={data.RightTopDark}/>
        </Wrapper>
    ))
    .add('Right Bottom Dark', () => (
        <Wrapper>
            <Hero data={data.RightBottomDark}/>
        </Wrapper>
    ))
    .add('Center Center Dark', () => (
        <Wrapper>
            <Hero data={data.CenterCenterDark}/>
        </Wrapper>
    ))
    .add('Center Top Dark', () => (
        <Wrapper>
            <Hero data={data.CenterTopDark}/>
        </Wrapper>
    ))
    .add('Center Bottom Dark', () => (
        <Wrapper>
            <Hero data={data.CenterBottomDark}/>
        </Wrapper>
    ))
    .add('Left Center Dark', () => (
        <Wrapper>
            <Hero data={data.LeftCenterDark}/>
        </Wrapper>
    ))
    .add('Left Top Dark', () => (
        <Wrapper>
            <Hero data={data.LeftTopDark}/>
        </Wrapper>
    ))
    .add('Left Bottom Dark', () => (
        <Wrapper>
            <Hero data={data.LeftBottomDark}/>
        </Wrapper>
    ))
    .add('Immersive Hero Top', () => (
        <Wrapper>
            <Hero data={data.IHeroTop}/>
        </Wrapper>
    ))
    .add('Immersive Hero Bottom', () => (
        <Wrapper>
            <Hero data={data.IHeroBottom}/>
        </Wrapper>
    ))
    .add('Immersive Hero Video Top', () => (
        <Wrapper>
            <Hero data={data.IHeroTopVideo}/>
        </Wrapper>
    ))
    .add('Immersive Hero Video Bottom', () => (
        <Wrapper>
            <Hero data={data.IHeroBottomVideo}/>
        </Wrapper>
    ))
    .add('Fullscreen', () => (
        <Wrapper wrapperClass="fullscreen">
            <Hero data={data.dataFullscreenHero}/>
        </Wrapper>
    ))
    .add('Card', () => (
        <Wrapper>
          <Hero data={data.dataCardHero}/>
        </Wrapper>
    ))
    .add('Video BG', () => (
        <Wrapper>
          <Hero data={data.VideoBG}/>
        </Wrapper>
    ))
    .add('Right Center Light', () => (
        <Wrapper>
            <Hero data={data.RightCenterLight}/>
        </Wrapper>
    ))
    .add('Heading Picture', () => (
        <Wrapper>
            <Hero data={data.PictureHeading}/>
        </Wrapper>
    ))
    .add('Heading Picture Left', () => (
    <Wrapper>
        <Hero data={data.PictureHeadingLeft}/>
    </Wrapper>
    ))
    .add('Heading Picture Right', () => (
        <Wrapper>
            <Hero data={data.PictureHeadingRight}/>
        </Wrapper>
    ))
    .add('Heading Picture RTL', () => (
        <Wrapper>
            <Hero data={data.PictureHeadingRTL}/>
        </Wrapper>
    ));


storiesOf('Legacy', module)
    .add('dataFeature', () => (
        <Wrapper>
            <LegacyFeature data={data.dataFeature}/>
        </Wrapper>
    ))
    .add('dataFeatureCTA', () => (
        <Wrapper>
            <LegacyFeature data={data.dataFeatureCTA}/>
        </Wrapper>
    ))
    .add('dataKSP', () => (
        <Wrapper>
            <LegacyKSP data={data.dataKSP}/>
        </Wrapper>
    ))
    .add('dataLegacyBackdrop', () => (
        <Wrapper>
            <LegacyCenteredBackdrop data={data.dataLegacyBackdrop}/>
        </Wrapper>
    ))
storiesOf('Mosaic', module)
    .add('BG Tiles', () => (
        <Wrapper>
            <Mosaic data={data.BGTiles}/>
        </Wrapper>
    ))
    .add('Mosaic 2 Tiles', () => (
        <Wrapper>
            <Mosaic data={data.TwoTileDefault}/>
        </Wrapper>
    ))
    .add('Mosaic 3 Tiles', () => (
        <Wrapper>
            <Mosaic data={data.ThreeTileDefault}/>
        </Wrapper>
    ))
    .add('Mosaic 4 Tiles', () => (
        <Wrapper>
            <Mosaic data={data.FourTileDefault}/>
        </Wrapper>
    ))
    .add('Mosaic 5 Tiles', () => (
        <Wrapper>
            <Mosaic data={data.FiveTileDefault}/>
        </Wrapper>
    ))
    .add('Mosaic 6 Tiles', () => (
        <Wrapper>
            <Mosaic data={data.SixTileDefault}/>
        </Wrapper>
    ))
    .add('Mosaic 7 Tiles', () => (
        <Wrapper>
            <Mosaic data={data.SevenTileDefault}/>
        </Wrapper>
    ))
    .add('Mosaic 8 Tiles', () => (
        <Wrapper>
            <Mosaic data={data.EightTileDefault}/>
        </Wrapper>
    ))
    .add('Too Few Tiles', () => (
        <Wrapper>
            <Mosaic data={data.TooFewTiles}/>
        </Wrapper>
    ))
    .add('Too Many Tiles', () => (
        <Wrapper>
            <Mosaic data={data.TooManyTiles}/>
        </Wrapper>
    ))
    .add('Center Aligned', () => (
        <div>
            <Wrapper name="Section2" id="Section2">
                <Mosaic data={data.PositionTiles}/>
            </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ))
    .add('Left Aligned', () => (
        <div>
            <Wrapper name="Section2" id="Section2">
                <Mosaic data={data.PositionTilesLeft}/>
            </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ))
    .add('Right Aligned', () => (
        <div>
        <Wrapper name="Section2" id="Section2">
            <Mosaic data={data.PositionTilesRight}/>
        </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ))
    .add('Top Aligned', () => (
        <div>
            <Wrapper name="Section2" id="Section2">
                <Mosaic data={data.PositionTilesTop}/>
            </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ))
    .add('Bottom Aligned', () => (
        <div>
            <Wrapper name="Section2" id="Section2">
                <Mosaic data={data.PositionTilesBottom}/>
            </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ))
    .add('Tile Themes', () => (
        <div>
            <Wrapper name="Section2" id="Section2">
                <Mosaic data={data.TileThemes}/>
            </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ))
    .add('RTL Mosaic', () => (
        <div dir="rtl">
            <Wrapper name="Section2" id="Section2">
                <Mosaic data={data.RTLMosaic} />
            </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ))
    .add('RTL Mosaic Right', () => (
        <div dir="rtl">
            <Wrapper name="Section2" id="Section2">
                <Mosaic data={data.RTLMosaicRight} />
            </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ))
    .add('RTL Mosaic Left', () => (
        <div dir="rtl">
            <Wrapper name="Section2" id="Section2">
                <Mosaic data={data.RTLMosaicLeft} />
            </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ))
    .add('RTL Mosaic Center', () => (
        <div dir="rtl">
            <Wrapper name="Section2" id="Section2">
                <Mosaic data={data.RTLMosaicCenter} />
            </Wrapper>
            <StickyFooter data={data.oemGroup}/>
        </div>
    ));

// storiesOf('Tabs', module)
//     .add('Default', () => (
//         <main id="main">
//             <Tabs data={myData} />
//         </Grid>
//     ));