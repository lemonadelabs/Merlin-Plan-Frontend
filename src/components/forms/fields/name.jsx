import React from 'react';
import {Control} from 'react-redux-form';
const Name = ({newItemName=''}) => {
  return (
    <div>
    <label>{newItemName ? `${newItemName} Name`:'Name'}</label>
    <Control.text model={".name"}/>
    </div>
  );
};

export default Name;