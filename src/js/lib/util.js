import React from 'react';
import _ from 'lodash';
import appHistory from '../app';
import sanitizeHtml from 'sanitize-html';

export function externalNavigate(target) {
    if(window.RDX) {
        window.RDX.externalNavigate(target);
    } else {
        window.location = target;
    }
}

export function internalNavigate(target) {
    if (target.indexOf("#") === -1) {
        appHistory.push(target);
    } else {
        appHistory.push(target);

        setTimeout(() => {
            const id = target.split('#')[1];
            const element = document.getElementById(id);
            if (element) element.scrollIntoView();
        }, 0);
    }
}

export function navigateEvent(group, section, source) {
    if(window.RDX) {
        window.RDX.navigateEvent(group, section, source);
    }
    // else {
    //     console.log('group', group, 'section', section, 'source', source);
    // }
}

export function impressionEvent(visible, group, section) {
    if(window.RDX) {
        window.RDX.impressionEvent(visible, group, section);
    }
    // else {
    //     console.log('visible', visible, 'group', group, 'section', section)
    // }
}

export function _cssSplit(str){
    if(str) {
        let O = {},
            S = str.match(/([^ :/',;]+)/g) || [];
        while(S.length) {
            O[S.shift()]= S.shift() || '';
        }
        return _.mapKeys(O, function (v, k) {return _.camelCase(k)});
    }
}

export const logError = (...args) => {
    if(window.RDX) {
        window.RDX.logError(...args);
    } else {
        console.error(...args);
    }
};

export default function propsAreValid(props, componentName = 'ANONYMOUS') {
    //TODO better validation of all props
    if(!props) {
        logError('Error: invalid props were passed to component:', props, 'was passed to:', componentName);
        return false
    } else {
        return true
    }
}

export const requestFrameThrottle = callback => {
    let requestId;

    const later = args => () => {
        requestId = null;
        callback(...args)
    };

    const throttled = (...args) => {
        if (requestId == null) {
            requestId = requestAnimationFrame(later(args))
        }
    };

    throttled.cancel = () =>
        cancelAnimationFrame(requestId);

    return throttled
};

export const cleanHtml = (dirty) => {
    return sanitizeHtml(dirty, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span', 'br', 'sup'],
        allowedAttributes: {
            'a': ['href', 'style'],
            'span': ['style'],
            'b': ['style'],
            'p': ['style']
        }
    });
};

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