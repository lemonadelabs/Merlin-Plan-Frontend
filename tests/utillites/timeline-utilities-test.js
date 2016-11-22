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
      let janFirst2016 = new Date('2016-1-1')
      let octFirst2016 = new Date('2016-1-10')
      expect(TimelineUtilities.yearsBetween(janFirst2016,octFirst2016)).to.equal(0)
    });
    it.skip('return 1 when passed two dates from jan - dec', function () {
      let janFirst2016 = new Date('2016-1-1')
      let decThirtyFirst2016 = new Date('2016-12-31')
      expect(TimelineUtilities.yearsBetween(janFirst2016,decThirtyFirst2016)).to.equal(1)
    });
    it('return 10 when passed two dates are 10 years apart', function () {
      let janFirst2016 = new Date('2016-1-1')
      let octFirst2026 = new Date('2026-10-1')
      expect(TimelineUtilities.yearsBetween(janFirst2016,octFirst2026)).to.equal(10)
    });
  });

  describe('dateToQuarter', function () {
    it('should set january as being q1', function () {
      let jan =new Date('2016-1-1')
      expect(TimelineUtilities.dateToQuarter(jan)).to.equal(1)
    });
    it('should set febuary as being q1', function () {
      let feb = new Date('2016-2-1')
      expect(TimelineUtilities.dateToQuarter(feb)).to.equal(1)
    });
    it('should set march as being q1', function () {
      let march = new Date('2016-3-1')
      expect(TimelineUtilities.dateToQuarter(march)).to.equal(1)
    });
    it('should set April as being q2', function () {
      let april = new Date('2016-4-1')
      expect(TimelineUtilities.dateToQuarter(april)).to.equal(2)
    });
    it('should set May as being q2', function () {
      let may = new Date('2016-5-1')
      expect(TimelineUtilities.dateToQuarter(may)).to.equal(2)
    });
    it('should set June as being q2', function () {
      let june = new Date('2016-6-1')
      expect(TimelineUtilities.dateToQuarter(june)).to.equal(2)
    });
    it('should set July as being q3', function () {
      let jul = new Date('2016-7-1')
      expect(TimelineUtilities.dateToQuarter(jul)).to.equal(3)
    });
    it('should set Aug as being q3', function () {
      let aug = new Date('2016-8-1')
      expect(TimelineUtilities.dateToQuarter(aug)).to.equal(3)
    });
    it('should set Sept as being q3', function () {
      let sept = new Date('2016-9-1')
      expect(TimelineUtilities.dateToQuarter(sept)).to.equal(3)
    });
    it('should set Oct as being q4', function () {
      let oct = new Date('2016-10-1')
      expect(TimelineUtilities.dateToQuarter(oct)).to.equal(4)
    });
    it('should set Nov as being q4', function () {
      let nov = new Date('2016-11-1')
      expect(TimelineUtilities.dateToQuarter(nov)).to.equal(4)
    });
    it('should set Dec as being q4', function () {
      let dec = new Date('2016-12-1')
      expect(TimelineUtilities.dateToQuarter(dec)).to.equal(4)
    });
  });
  
  
  describe('IndicatorWidthFromMode', function () {
    context('in "Quarters" mode', function() {
      it('should return an indicator width of 5.6875', function () {
        expect(TimelineUtilities.indicatorWidthFromMode('Quarters', 25, 97.75)).to.equal(5.6875)
      });
    })
    context('in "Months" mode', function() {
      it('should return an indicator width of 73.41666666666667', function () {
        expect(TimelineUtilities.indicatorWidthFromMode('Months', 10, 991)).to.equal(73.41666666666667)
      });
    })
    context('in "Incorrect" mode', function() {
      it('should throw an error', function () {
        expect(() =>  TimelineUtilities.indicatorWidthFromMode('Incorrect', 10, 991) ).to.throw("Incorrect mode: Incorrect not defined")
      });
    })
  });
  

});
