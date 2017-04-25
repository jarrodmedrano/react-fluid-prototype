import React from 'react';
import renderer from 'react-test-renderer';
import ButtonLink from '../ButtonLink';
import {shallow} from 'enzyme';

describe('Button Link functions', () => {

    const minProps = {
        dangerouslySetInnerHTML: {},
        draggable: "false",
        href: "",
        to: ""
    };

    it('should click', () => {
        const spy = jasmine.createSpy();
        const wrapper = shallow(<ButtonLink onClick={spy} {...minProps} />);
        wrapper.find('a').simulate('click');
        expect(spy).toHaveBeenCalled();
        expect(wrapper).toMatchSnapshot();
    });

    it('Should have internal state false when linking externally', () => {
        const wrapper = shallow(<ButtonLink to="http://www.google.com" />);
        expect(wrapper.state('internal')).toEqual(false);
        expect(wrapper).toMatchSnapshot();
    });

    it('Should have internal state false when link has a token', () => {
        const wrapper = shallow(<ButtonLink to="media:{pictureslibrary}//Glaciers.docx" />);
        expect(wrapper.state('internal')).toEqual(false);
        expect(wrapper).toMatchSnapshot();
    });

    it('Should have internal state true when linking internally', () => {
        const wrapper = shallow(<ButtonLink to="/windows/#Cortana" />);
        expect(wrapper.state('internal')).toEqual(true);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render without exploding', () => {
        const component = renderer.create(
            <ButtonLink {...minProps} />
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
