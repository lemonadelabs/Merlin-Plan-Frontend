import * as arrayUtilities from '../../src/utilities/array';
import { expect } from 'chai';


describe('Array Utilities', function () {
  
  describe('replace', function () {
    it('should find and update an element in an array.', function () {
      let array = [{id:1,name:"foo"},{id:2,name:"bar"}, {id:3,name:"baz"}]
      let newItem = {id:2,name:"fooBar"}
      let updatedArray = arrayUtilities.replace(array,newItem)
      expect(updatedArray).to.deep.equal([{id:1,name:"foo"},{id:2,name:"fooBar"}, {id:3,name:"baz"}])
    });
    
  });
  
});

