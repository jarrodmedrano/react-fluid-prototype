import React from 'react';
import Text from '../text/Text';

const LegalText = (props) => {
    return (
        <div className="legal-text"><p className="c-meta-text"><small><Text data={props.data} /></small></p></div>
    )
};

export default LegalText;