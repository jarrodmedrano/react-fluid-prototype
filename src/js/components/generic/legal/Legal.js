import React from 'react';
import Text from '../text/Text';

const LegalText = (props) => {
    return (
        <div className="c-caption-1 legal-text"><p className="c-meta-text"><small><Text data={props.data} /></small></p></div>
    )
};

export default LegalText;