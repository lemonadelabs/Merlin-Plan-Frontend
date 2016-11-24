import React from 'react';
import { mount, render } from 'enzyme';
import { expect } from 'chai';
import DataPoint from '../../src/components/data-point'
import ReactTooltip from 'react-tooltip'


describe('<DataPoint/>', function () {
  
  context('Single datum, no compare mode', function () {
    it('renders single datasource without comparason', function () {
      const wrapper = render(<DataPoint data={[5000]}/>)
      expect(wrapper.text()).to.equal('5000')
    });
    it('should not have react-tooltip component for compare', function () {
      const wrapper = mount(<DataPoint data={[5000]}/>)
       expect(wrapper.find(ReactTooltip).isEmpty()).to.equal(true);
    });
  });
  
  context('Two sources of data', function () {
    it('renders two datasources with comparason', function () {
      const wrapper = render(<DataPoint data={[5000,2500]}/>)
      expect(wrapper.find('div').eq(2).text()).to.equal('2500')
    });
    it('renders two datasources with comparason', function () {
      const wrapper = render(<DataPoint data={[5000,2500]}/>)
      expect(wrapper.find('div').eq(2).text()).to.equal('2500')
    });
    it('has the react-tooltip component for compare', function () {
      const wrapper = mount(<DataPoint data={[5000,2500]}/>)
      expect(wrapper.find(ReactTooltip).isEmpty()).to.equal(false);
    });
    it('datasources of the same value should not show "up" or "down"', function () {
      const wrapper = render(<DataPoint data={[5000,5000]}/>)
      expect(wrapper.text()).to.equal('0')
    });
  });
  
  context('formatting function applied', function () {
    it('should format the output when passed a formatting function', function () {
      const wrapper = render(<DataPoint formatter={value => (`$${value}`) }data={[5000]}/>)
      expect(wrapper.text()).to.equal('$5000')
    });
  });

});
