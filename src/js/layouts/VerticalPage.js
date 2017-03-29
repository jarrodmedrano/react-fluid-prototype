import React from 'react'
import { findDOMNode } from 'react-dom'
import '../../styles/main.scss!';
import dataPropTypes, {verticalPagePropTypes} from '../../data/dataProps';
import propsAreValid, {navigateEvent} from '../lib/util';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/tabs/Tabs';
import StickyFooter from '../components/stickynav/StickyFooter';
import Price from '../components/price/Price';
import DownArrow from '../components/downarrow/DownArrow';
import Button from '../components/button/Button';
import Main from '../components/main/Main';
import _ from 'lodash';
import keydown from 'react-keydown';

class VerticalPage extends React.Component {
    constructor(props) {
        super(props);

        let {groups} = props.data;

        let title = this.props.route.title;

        //Find the title of the group and if it's the same title as the route, that's the current page
        let currentPage = this._getCurrentPage();

        let currentBrandColor = currentPage.brand.color,
            currentPaths = _.map(this.props.routes[0].childRoutes, 'path'),
            currentId,
            currentSections = currentPage.sections,
            currentSectionClass = `${title}-section-`;

        //TODO: get array of paths from routes without mutations
        //tack index path onto the currentPaths array. kind of a hack.
        currentPaths.unshift('/');

        //if current page is homepage, set current id to 0, else find the index of the current title
        if(this.props.location.pathname === '/') {
            currentId = currentPaths.indexOf('/')
        } else {
            currentId = currentPaths.indexOf(title)
        }

        //set Current page in the state
        this.state = {
            currentPage: currentPage,
            currentBrandColor: currentBrandColor,
            currentSections: currentSections,
            currentPaths: currentPaths,
            currentId: currentId,
            currentPath: currentPaths[currentId],
            activeSections: [],
            currentSection: 0,
            currentSectionClass: currentSectionClass,
            currentTitle: title,
            groups: groups,
            legacyLayouts: false
        };

        this._getCurrentPage = this._getCurrentPage.bind(this);
    }

    componentWillMount() {

        let findCompareModels = (oemGroup) => {
            _.find(oemGroup.sections, (result) =>  {
                if (result.sectionIdentifier === 'Compare') {
                    this.setState({compareModels: result})
                }
            })
        };

        _.find(this.props.data.groups, (result) => {
            if (result.groupIdentifier === 'oem') {
                this.setState({oemGroup: result},
                    findCompareModels(result)
                )
            }
        });

        _.find(this.props.data.groups, (result) =>  {
            if (result.groupIdentifier === 'retailer') {
                this.setState({retailerGroup: result})
            }
        });

        //Find out if there are legacy layouts in this page (or not)
        _.find(this.state.currentSections, (result) => {
            if(_.includes(result.layout, 'feature', 'featureCta', 'ksp', 'centeredBackdropTemplate', 'threeColSpecs')) {
                this.setState({legacyLayouts: true})
            }
        });
    }

    @keydown('cmd+right', 'ctrl+right')
    _handleNextGroup(e) {
        e.preventDefault();
        let currentId = this.state.currentId,
            paths = this.state.currentPaths,
            nextPath = paths[currentId + 1],
            firstPath = paths[0];
        //if we are not on the last id
        if (currentId < paths.length - 1) {
            this._goNextGroup('forward', nextPath, 'ctrl+right');
        } else {
            this._goNextGroup('first', firstPath, 'ctrl+right');
        }
    }

    @keydown('cmd+left', 'ctrl+left')
    _handlePrevGroup(e) {
        e.preventDefault();
        let currentId = this.state.currentId,
            paths = this.state.currentPaths,
            lastPath = paths[paths.length - 1],
            nextPath = paths[currentId - 1];

        if (currentId > 0 && currentId < paths.length) {
            this._goNextGroup('back', nextPath, 'ctrl+left');
        } else {
            this._goNextGroup('last', lastPath, 'ctrl+left');
        }
    }

    _getCurrentPage() {
        let {groups} = this.props.data;
        let title = this.props.route.title;
        //if the title of the route matches the title of the group, that is the current page.
        return _.find(groups, function (result) {
            return result.groupIdentifier === title
        });
    }

    _goNextGroup(dir, path, source) {
        let callBack = (currentId) => {
            this.props.history.push(path);
            navigateEvent(this.state.currentPaths[currentId], this.props.data.groups[currentId].sections[0].sectionIdentifier, source);
        };

        dir === 'forward' ? this.setState({currentId: this.state.currentId += 1},
            callBack(this.state.currentId)
        ) :
        dir === 'back' ? this.setState({currentId: this.state.currentId -= 1},
            callBack(this.state.currentId)
        ) :
        dir === 'first' ? this.setState({currentId: 0},
            callBack(0)
        ) :
        dir === 'last' ? this.setState({currentId: this.state.currentPaths.length - 1},
           callBack(this.state.currentPaths.length - 1)
        ) : null
    }

    render() {
        if (propsAreValid(this.props.data, this)) {
            return (
                <div>
                    {this.state.groups.length > 1 ? <Tabs data={this.props.data} {...this.props} /> : null }
                    <Main data={this.props.data} {...this.props} legacyLayouts={this.state.legacyLayouts} />

                    {this.state.oemGroup && this.state.compareModels ?
                        <StickyBanner data={this.state.oemGroup}>
                            <Price data={this.state.oemGroup}/>

                            {this.state.retailerGroup && this.state.retailerGroup.brand && this.state.retailerGroup.brand.button ?
                                <Button data={this.state.retailerGroup.brand.button} />
                                : null }
                        </StickyBanner>
                        : null }
                </div>
            )
        }
    }
}

VerticalPage.propTypes = dataPropTypes(verticalPagePropTypes);

export default VerticalPage
