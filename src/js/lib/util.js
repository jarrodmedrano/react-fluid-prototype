import React from 'react';
import _ from 'lodash';
export function externalNavigate(e) {
    if(window.RDX) {
        e.preventDefault();
        window.RDX.externalNavigate(e.target);
    }
}

export function navigateEvent(group, section) {
    if(window.RDX) {
        window.RDX.navigateEvent(group, section);
    }
}

export function impressionEvent(visible, group, section) {
    if(window.RDX) {
        window.RDX.impressionEvent(visible, group, section);
    }
}

export function _cssSplit(str){
    if(str) {
        let O = {},
            S = str.match(/([^ :;]+)/g) || [];
        while(S.length) {
            O[S.shift()]= S.shift() || '';
        }
        return _.mapKeys(O, function (v, k) {return _.camelCase(k)});
    }
}

export default function propsAreValid(props, componentName = 'ANONYMOUS') {
    //TODO better validation of all props
    if(!props) {
        if(window.RDX) {
            window.RDX.logError('Error: no props were passed to component', componentName);
        } else {
            console.error('Error: no props were passed to component', componentName);
        }
        return false
    } else {
        return true
    }
}

function createChainableTypeChecker(validate) {
    function checkType(isRequired, props, propName, componentName, location) {
        componentName = componentName || ANONYMOUS;
        if (props[propName] == null) {
            var locationName = ReactPropTypeLocationNames[location];
            if (isRequired) {
                return new Error(
                    ("Required " + locationName + " `" + propName + "` was not specified in ") +
                    ("`" + componentName + "`.")
                );
            }
            return null;
        } else {
            return validate(props, propName, componentName, location);
        }
    }

    let chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
}