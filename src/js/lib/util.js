import React from 'react';
import sanitizeHtml from 'sanitize-html';

export function externalNavigate(target) {
    if(window.RDX) {
        window.RDX.externalNavigate(target);
    } else {
        window.location = target;
    }
}

export function internalNavigate(target, router) {
    if (target.indexOf("#") === -1) {
        router.push(target);
    } else {
        router.push(target);

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
    if(visible === undefined || group === undefined || section === undefined) {
        return false;
    }
    if(window.RDX) {
        window.RDX.impressionEvent(visible, group, section);
    }
    // else {
    //     console.log('visible', visible, 'group', group, 'section', section)
    // }
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
            if(typeof requestAnimationFrame === 'undefined') return;
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