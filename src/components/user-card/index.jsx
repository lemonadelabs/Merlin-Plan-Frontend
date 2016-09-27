'use strict';
import React from 'react';
import UserDetails from 'components/user-details'
import ProfilePic from 'components/profile-pic'
import Tag from 'components/tag'
import Break from 'components/break'
import styles from './index.css'


const UserCard = ({user, clickFunction, selected}) => (
  <div 
    key={user.id} 
    onClick={
      () => { clickFunction(user) }
    } 
    style={{outline:selected?'solid 1px rgb(155,155,255)':'none'}}
    className={styles.userCard}>
    <header>
      <ProfilePic
        firstName={user.firstName}
        lastName={user.lastName}
        profilePic={user.profilePic}
        id={user.id}/>
      <UserDetails
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email}
        id={user.employeeId}/>
    </header>
    <Break width="full" thickness="hair"/>
    <p className={styles.heading}>
      Roles:
      {user.roles.map((role) => <span> {role}</span>)}
    </p>
    {/* <div className={styles.groupContainer}>
    <p className={styles.heading}>Groups:</p>
      {user.groups.map( (group) => <Tag name={group}/>)}
    </div> */}
  </div>
);

export default UserCard;
