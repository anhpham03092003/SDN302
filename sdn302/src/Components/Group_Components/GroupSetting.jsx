import React, { useContext, useEffect } from 'react';
import styles from '../../Styles/Group_css/GroupSetting.module.css';
import { AppContext } from "../../Context/AppContext";
import { useParams } from 'react-router-dom';
import axios from 'axios';

function GroupSetting() {
  const { group, groupMembers = [], setGroupMembers, groups_API, accessToken } = useContext(AppContext);
  const { groupId } = useParams();

  useEffect(() => {
    axios.get(`${groups_API}/${groupId}/get-member`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then((res) => { 
      setGroupMembers(res.data.memberInfo);  // Assuming `memberInfo` contains an array of members
    })
    .catch((err) => console.error(err));
  }, []);
  console.log(groupMembers);
  

  // Find the owner in `groupMembers`
  const owner = groupMembers.find(member => member.groupRole === 'owner');

  return (
    <>
      <div className={styles.breadcrumb}></div>
      <div className={styles.title}>Details</div>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <img
            className={styles.img}
            src="https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg"
            alt="Project icon"
          />
          <button className={styles.changeIconButton}>Change icon</button>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="project-lead">Group owner</label>
          <div className={styles.projectLead}>
            <div className={styles.projectLeadContainer}>
              <span className={styles.projectLeadName}>
                {owner ? owner.name : 'No owner assigned'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name">
            Group name <span className={styles.required}>*</span>
          </label>
          <input
            id="groupName"
            type="text"
            value={group?.groupName || ''}  
            className={styles.input}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="project-key">
            Group code <span className={styles.required}>*</span>
          </label>
          <input
            id="groupCode"
            type="text"
            value={group?.groupCode || ''}  
            className={styles.input}
            readOnly
          />
        </div>
      </div>
    </>
  );
}

export default GroupSetting;
