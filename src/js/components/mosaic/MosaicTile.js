import React from 'react';
import Picture from '../picture/Picture';
import Heading from '../heading/Heading';

class MosaicTile extends React.Component {
    render() {
            return (
            <section className="c-mosaic-placement">
                <Picture data={this.props.data} />
                <Heading data={this.props.data} />
            </section>
            )
    }
}
const chainablePropType = predicate => {
    const propType = (props, propName, componentName) => {
        // don't do any validation if empty
        if (props[propName] == null) {
            return;
        }

        return predicate(props, propName, componentName);
    }

    propType.isRequired = (props, propName, componentName) => {
        // warn if empty
        if (props[propName] == null) {
            return new Error(`Required prop \`${propName}\` was not specified in \`${componentName}\`.`);
        }

        return predicate(props, propName, componentName);
    }

    return propType;
}

const customProp = chainablePropType(() => {

});

MosaicTile.propTypes = {
    data: customProp.isRequired
};

export default MosaicTile;
