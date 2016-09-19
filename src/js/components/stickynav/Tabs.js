import React from 'react'
import './tabs.scss'

import { Router, Route, Link, IndexLink, IndexRoute } from 'react-router';



class Tabs extends React.Component {



    constructor(props) {
        super(props);

        this.state = {
            brandLogo: require(`img/${this.props.branding[0].logoTab}`)
        };

        // var myObj = {};
        //
        // var brandLogos = this.props.branding.filter(function(result, index) {
        //
        //     var key = 'brandLogo' + index;
        //
        //     return myObj = {
        //         [key]: require(`img/${result.logoTab}`)
        //     }
        // });
        //
        // console.log(myObj);

        var logoTabs = this.props.branding.map(function(result) {
           return result.logoTab;
        });
        //
         console.log(logoTabs);
        //
        //
        var logoObj = {};

        logoTabs.forEach(function(element, index) {
            var keys = 'logoTab' + index;

            return logoObj[index] = {
                [keys]: require(`img/${element}`)
            }
        });


        // for(var i = 0; i < logoTabs.length; i++) {
        //     var keys = 'logoTab' + i;
        //     logoObj = {
        //         [keys]: require(`img/${logoTabs[i]}`)
        //     }
        // }

        // var logoObj = logoTabs.map(function(result, index) {
        //     var keys = 'logoTab' + index;
        //
        //     return logoObj = {
        //         [keys]: require(`img/${result}`)
        //     }
        // });

        console.log(logoObj);

        this.state = Object.assign(logoObj);

        console.log(this.state);


        // this.state = {
        //     brandLogo: require(`img/${this.props.branding.logoTab}`)
        // }
    }

    render() {

        const depth = this.props.routes.length;

        const rootRoute = this.props.routes[0];

        const rootRouteChildren = rootRoute.childRoutes;

        const innerRoute = this.props.routes[1];

        const innerRouteChildren = innerRoute.childRoutes;

        return (
            <div className="tabs">
                <ul>
                    <li className="c-hyperlink"><IndexLink to={rootRoute.path} activeClassName="active"><img alt={rootRoute.title} src={this.state[0]} /></IndexLink></li>
                    {rootRouteChildren !=null ? rootRouteChildren.map((item, index) =>
                        <li className="c-hyperlink" key={index}>
                            <Link
                                activeClassName="active"
                                to={item.path || ''}>
                                <img src="" alt={item.title} />
                            </Link>
                            {(index + 1) < depth}
                        </li>
                    ) : ''}
                </ul>
            </div>
        )
    }
}

export default Tabs