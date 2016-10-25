import React from 'react';
import { Control } from 'react-redux-form';
import MultiSelectDropdown from 'components/multi-select-dropdown';
import { required } from 'components/forms/validators'

const UserGroupField = ({organisationGroups}) => {
  return (
    <div>
      <Control.select            
        validators={{
          required
        }}
        component={MultiSelectDropdown} 
        controlProps={
          {
            options: organisationGroups, 
            labelTemplate: group => {return(`${group.name}`)}, 
            valueMapping: group => { 
              let groupStringified = JSON.stringify(group)
              return( group )
            },
            selectionFind: ({option, value}) => {
              return (option.id === value.id)
            }
          }
        }
        multiple={true} 
        model=".groups"/>
    </div>
  );
};

export default UserGroupField;