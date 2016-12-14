import React, {Component} from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import {
  shareToGroup,
  shareToOrganisation,
  shareToUsers,
  unshareToGroup,
  unshareToOrganisation,
  unshareToUsers } from 'actions';

class SharingSettings extends Component {
  constructor(props, context) {
    super(props, context);
    this.persistChanges = this.persistChanges.bind(this)
    this.handleSharingModeChange = this.handleSharingModeChange.bind(this)
    this.state = {
      selectedSharingMode:shareModeFromShareSettings(props.sharingSettings),
      newUsersSharedWith:[]
    }
  }
  componentWillReceiveProps(nextProps){
    if(!isEqual(this.props.sharingSettings, nextProps.sharingSettings)){
      this.setState({selectedSharingMode:shareModeFromShareSettings(nextProps.sharingSettings)})
    }
  }
  persistChanges() {
    switch (this.state.selectedSharingMode) {
      case "PRIVATE":
        this.props.dispatch(unshareToGroup({endPoint: this.props.endPoint, id: this.props.documentId}))
        this.props.dispatch(unshareToOrganisation({endPoint: this.props.endPoint, id: this.props.documentId}))
        break;
      case "ORGANISATION":
        this.props.dispatch(unshareToGroup({endPoint: this.props.endPoint, id: this.props.documentId}))
        this.props.dispatch(shareToOrganisation({endPoint: this.props.endPoint, id: this.props.documentId}))
        break;
      case "GROUP":
        this.props.dispatch(shareToGroup({endPoint: this.props.endPoint, id: this.props.documentId}))
        this.props.dispatch(unshareToOrganisation({endPoint: this.props.endPoint, id: this.props.documentId}))
        break;
      default:
        break;
    }
  }
  handleSharingModeChange(e){
    this.setState({selectedSharingMode:e.target.value})
  }
  render() {
    let {groupName} = this.props
    let orginisationName = "POO ORG"
    return (
      <div>
        <label>Sharing Mode</label>
        <select value={this.state.selectedSharingMode} onChange={ this.handleSharingModeChange}>
          <option value="GROUP">{`Share with ${groupName} group`}</option>
          <option value="ORGANISATION">{`Share with all of ${orginisationName}`}</option>
          <option value="PRIVATE">{`Only me, and the people below`}</option>
        </select>
        <button onClick={this.persistChanges}>Save</button>
      </div>
    );
  }
}

function shareModeFromShareSettings(shareSettings) {
  if(shareSettings.groupShared){
    return "GROUP"
  }
  if(shareSettings.organisationShared){
    return "ORGANISATION"
  }
  return "PRIVATE"
}


export default connect()(SharingSettings);