import React from 'react';
import Vertical from '../Vertical';
import {shallow} from 'enzyme';

describe('Vertical', () => {

    const minProps = {
        layout: 'threeColSpecs',
        ordinal: '100',
        groupIdentifier: 'oem',
        sectionIdentifier: 'hero1'
    };

    it('should render without exploding', () => {
        const wrapper = shallow(<Vertical data={minProps} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should fire impression event when active and fire again when it changes to non active', () => {
        const wrapper = shallow(<Vertical data={minProps}  />);
        const spy = spyOn(wrapper.instance(), "_logImpression");
        wrapper.update();
        wrapper.setState({ active: true });
        expect(spy).toBeCalledWith(true);
        wrapper.setState({ active: false });
        expect(spy).toBeCalledWith(false);
        expect(wrapper).toMatchSnapshot();
    });
});
