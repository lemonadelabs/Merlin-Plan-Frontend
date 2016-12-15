import React, {Component} from 'react';
import { connect } from 'react-redux';
import { isEqual, find, sortBy, filter, includes,isEmpty} from 'lodash';
import {
  shareToGroup,
  shareToOrganisation,
  shareToUsers,
  unshareToGroup,
  unshareToOrganisation,
  unshareToUsers,
  getOrgUsers } from 'actions';
import FuzzySearchInput from 'components/fuzzy-search-input';
import {drop} from 'utilities/array';

class SharingSettings extends Component {
  constructor(props, context) {
    super(props, context);
    this.persistChanges = this.persistChanges.bind(this)
    this.handleSharingModeChange = this.handleSharingModeChange.bind(this)
    this.state = {
      selectedSharingMode:shareModeFromShareSettings(props.sharingSettings),
      usersSharedWith:[]
    }
  }
  componentWillMount() {
    this.props.dispatch(getOrgUsers(this.props.organisationId))
  }
  componentWillReceiveProps(nextProps){
    if(!isEqual(this.props.sharingSettings, nextProps.sharingSettings)){
      this.setState({
        selectedSharingMode:shareModeFromShareSettings(nextProps.sharingSettings),
        usersSharedWith:nextProps.sharingSettings.userShare
      })

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

    let oldUsersSharedWith = sortBy(this.props.sharingSettings.userShare)
    let newUsersSharedWith = sortBy(this.state.usersSharedWith)
    let usersToAdd = filter(newUsersSharedWith, userId => ( !includes(oldUsersSharedWith, userId) ) )
    let usersToRemove = filter(oldUsersSharedWith, userId => ( !includes(newUsersSharedWith, userId) ) )
    if(!isEmpty(usersToAdd)){
      this.props.dispatch(shareToUsers({endPoint: this.props.endPoint,id:this.props.documentId,users:usersToAdd}))
    }
    if(!isEmpty(usersToRemove)){
      this.props.dispatch(unshareToUsers({endPoint: this.props.endPoint,id:this.props.documentId,users:usersToRemove}))
    }
  }
  handleSharingModeChange(e){
    this.setState({selectedSharingMode:e.target.value})
  }
  render() {
    let {groupName, sharingSettings} = this.props
    let orginisationName = "POO ORG"
    return (
      <div>
        <label>Sharing Mode</label>
        <select value={this.state.selectedSharingMode} onChange={ this.handleSharingModeChange}>
          <option value="GROUP">{`Share with ${groupName} group`}</option>
          <option value="ORGANISATION">{`Share with all of ${orginisationName}`}</option>
          <option value="PRIVATE">{`Only me, and the people below`}</option>
        </select>
        <FuzzySearchInput 
          list={this.props.organisationUsers}
          keys={[
            {name:"firstName",weight:0.6},
            {name:"lastName",weight:0.2},
            {name:"email",weight:0.2}
          ]}
          handleSelection={selectedUser => { this.setState({usersSharedWith:[...this.state.usersSharedWith,selectedUser.id]}) }}
        />
        {this.state.usersSharedWith.map(
          (userID, index) => {
            let userData= find(this.props.organisationUsers,{"id": userID})
            return (<p>{`${userData.firstName} ${userData.lastName} `}<span onClick={ () => { this.setState({usersSharedWith:drop(this.state.usersSharedWith,index)}) } }>x</span></p>)
          }
        )}
        <button onClick={this.persistChanges}>Save</button>
      </div>
    );
  }
}

SharingSettings.defaultProps = {
  sharingSettings:{
    groupShared:false,
    organisationShared:false,
    userShare:[]
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

function mapStateToProps(state){
  return {
    organisationId:state.user.organisationId,
    organisationUsers:state.organisation.users
  }
}

export default connect(mapStateToProps)(SharingSettings);