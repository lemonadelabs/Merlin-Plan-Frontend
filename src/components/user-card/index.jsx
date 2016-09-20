'use strict';
import React from 'react';
import UserDetails from 'components/user-details'
import ProfilePic from 'components/profile-pic'
import Tag from 'components/tag'
import Break from 'components/break'
import styles from './index.css'

const UserCard = ({user}) => (
  //TODO: Replace shortid with user.id when available
  <div key={user.EmployeeId} className={styles.userCard}>
    <header>
      <ProfilePic
        firstName={user.FirstName}
        lastName={user.LastName}
        profilePic={user.ProfilePic}
        id={user.EmployeeId}/>
      <UserDetails
        firstName={user.FirstName}
        lastName={user.LastName}
        email={user.Email}
        id={user.EmployeeId}/>
    </header>
    <Break width="full" thickness="hair"/>
    <p className={styles.heading}>
      Roles:
      {user.Roles.map((role) => <span>{role}</span>)}
    </p>
    <p className={styles.heading}>Groups:</p>
    <div className={styles.groupContainer}>
      {user.Groups.map( (group) => <Tag name={group}/>)}
    </div>
  </div>
);

export default UserCard;
