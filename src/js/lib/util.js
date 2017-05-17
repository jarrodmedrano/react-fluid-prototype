import React from 'react';
import sanitizeHtml from 'sanitize-html';
import cssParser from 'css';

export function externalNavigate(target) {
    if(window.RDX && target.length > 0 && target !== null) {
        window.RDX.externalNavigate(target);
    } else if(target.length > 0 && target !== null) {
        window.location = target;
    } return null
}

export function internalNavigate(target, router) {
    if(target.length > 0 && target !== null && router) {
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
    } return null;
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


//
// Transform implementation or originally thanks to
// https://github.com/raphamorim/native-css
//

function transformRules(self, rules, result) {
    rules.forEach(function (rule) {
        var obj = {};
        if (rule.type === 'media') {
            var name = mediaNameGenerator(rule.media);
            var media = result[name] = result[name] || {
                    "__expression__": rule.media
                };
            transformRules(self, rule.rules, media)
        } else if (rule.type === 'rule') {
            rule.declarations.forEach(function (declaration) {
                if (declaration.type === 'declaration') {
                    var cleanProperty = cleanPropertyName(declaration.property);
                    obj[cleanProperty] = declaration.value;
                }
            });
            rule.selectors.forEach(function (selector) {
                var name = nameGenerator(selector.trim());
                result[name] = obj;
            });
        }
    });
}

const cleanPropertyName = function(name) {

    // turn things like 'align-items' into 'alignItems'
    name = name.replace(/(-.)/g, function(v) { return v[1].toUpperCase(); })

    return name;
}

const mediaNameGenerator = function (name) {
    return '@media ' + name;
};

const nameGenerator = function (name) {
    name = name.replace(/\s\s+/g, ' ');
    name = name.replace(/[^a-zA-Z0-9]/g, '_');
    name = name.replace(/^_+/g, '');
    name = name.replace(/_+$/g, '');

    return name;
};

export function transform (inputCssText) {

    if(!inputCssText) {
        throw new Error('missing css text to transform');
    }

    // If the input "css" doesn't wrap it with a css class (raw styles)
    // we need to wrap it with a style so the css parser doesn't choke.
    var bootstrapWithCssClass = false;
    if(inputCssText.indexOf("{") === -1) {
        bootstrapWithCssClass = true;
        inputCssText = `.bootstrapWithCssClass { ${inputCssText} }`;
    }

    var css = cssParser.parse(inputCssText);
    var result = {};
    transformRules(this, css.stylesheet.rules, result);

    // Don't expose the implementation detail of our wrapped css class.
    if(bootstrapWithCssClass) {
        result = result.bootstrapWithCssClass;
    }

    return result;
}
