import * as TimelineUtilities from '../../src/utilities/timeline-utilities';
import { expect } from 'chai';


describe('Timeline Utilities', function () {
  
  describe('calculateTimelineYearWidthNoPadding:', function () {
    it('calculate the width of a year given the amount of years and stage width', function () {
      expect(TimelineUtilities.calculateTimelineYearWidthNoPadding(1000,10)).to.equal(100)
    });
  });
  describe('findTimelineMode:', function () {
    it('should change the mode of the timeline to quarters if a timeline year width goes under 400px in width', function () {
      expect(TimelineUtilities.findTimelineMode(300)).to.equal('Quarters')
    });

    it('should change the mode of the timeline to months if a timeline year width goes over 400px in width', function () {
      expect(TimelineUtilities.findTimelineMode(500)).to.equal('Months')
    });
  });
  
  describe('calculateTimelinePadding', function () {
    
    it('should divide the value by 40 if the mode is in "Quarters" ', function () {
      expect(TimelineUtilities.calculateTimelinePadding(1000, "Quarters")).to.equal(25)
    });

    it('should divide the value by 100 if the mode is in "Months" ', function () {
      expect(TimelineUtilities.calculateTimelinePadding(1000, "Months")).to.equal(10)
    });
    
  });
  
  describe('calculateIndicatorWidth', function () {
    it('should return the width of the indicators based on the number of indicators, padding, and width of the year', function () {
      expect(TimelineUtilities.calculateIndicatorWidth(12,10,500)).to.equal(32.5)
    });
    
  });
  
  describe('calculateYearWidthModePadding', function () {
    it('should return yearWidth of 97.75, mode: "Quarters", padding:2.5', function () {
      expect(TimelineUtilities.calculateYearWidthModePadding(1000, 10)).to.deep.equal({ yearWidth: 97.75, mode: 'Quarters', padding: 2.5 })
    });
    it('should return yearWidth of 991, mode: "Months", padding:10', function () {
      expect(TimelineUtilities.calculateYearWidthModePadding(10000, 10)).to.deep.equal({ yearWidth: 991, mode: 'Months', padding: 10 })
    });
  });
  
  describe('yearsBetween', function () {
    it('return 0 when passed two dates the span less than a year', function () {
      let janFirst2016 = new Date(2016,1)
      let octFirst2016 = new Date(2016,10)
      expect(TimelineUtilities.yearsBetween(janFirst2016,octFirst2016)).to.equal(0)
    });
    it('return 1 when passed two dates from jan - dec', function () {
      let janFirst2016 = new Date(2016,1)
      let decFirst2016 = new Date(2016,12)
      expect(TimelineUtilities.yearsBetween(janFirst2016,decFirst2016)).to.equal(1)
    });
    it('return 10 when passed two dates are 10 years apart', function () {
      let janFirst2016 = new Date(2016,1)
      let octFirst2026 = new Date(2026,10)
      expect(TimelineUtilities.yearsBetween(janFirst2016,octFirst2026)).to.equal(10)
    });
  });
  
});
