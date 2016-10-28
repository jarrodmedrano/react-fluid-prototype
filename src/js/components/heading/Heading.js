import React from 'react';
import Button from '../button/Button';

class Heading extends React.Component {
    render() {

        let { heading, subheading, paragraph } = this.props.data;

        return (
            <div>
                <div className="content-animate">
                    <h1 className="c-heading">{heading}</h1>
                    <p className="c-subheading">{subheading}</p>
                    <p className="c-paragraph-1">{paragraph}</p>
                    <Button data={this.props.data} />
                </div>
            </div>
        )
    }
}

export default Heading