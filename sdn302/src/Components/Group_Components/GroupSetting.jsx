import React, { useContext, useEffect, useState } from 'react';
import styles from '../../Styles/Group_css/GroupSetting.module.css';
import { AppContext } from "../../Context/AppContext";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiDotsHorizontal } from "react-icons/hi";

function GroupSetting() {
  const { group, setGroup, groupMembers, groups_API, accessToken, currentUserRole } = useContext(AppContext);
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [message, setMessage] = useState({ type: null, text: '' });
  const [showMenu, setShowMenu] = useState(false); 
  const navigate = useNavigate();

  const owner = groupMembers?.find(member => member.groupRole === 'owner');

  useEffect(() => {
    if (group) {
      setGroupName(group.groupName);
      setGroupCode(group.groupCode);
    }
  }, [group]); 

  const editGroupDetail = async () => {
    if (groupName.length > 15) {
      setMessage({ type: 'error', text: 'Group name cannot exceed 15 characters!' });
      return;
    }
    if (groupCode.length > 6) {
      setMessage({ type: 'error', text: 'Group code cannot exceed 6 characters!' });
      return;
    }
    const updatedData = { groupName, groupCode };
    try {
      const response = await axios.put(
        `${groups_API}/${groupId}/edit`,
        updatedData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setGroup(response.data);  
      setMessage({ type: 'success', text: 'Group updated successfully!' });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage({ type: 'error', text: 'Group code already exists!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update group. Please try again later.' });
      }
    }
  };

  const deleteGroup = async () => {
    if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      try {
        await axios.delete(`${groups_API}/${groupId}/delete`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setMessage({ type: 'success', text: 'Group deleted successfully!' });
        navigate('/groups'); 
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete group. Please try again later.' });
      }
    }
  };

  const leaveGroup = async () => {
    if (window.confirm("Are you sure you want to leave this group? You will lose access to group information.")) {
      try {
        await axios.delete(`${groups_API}/${groupId}/out`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setMessage({ type: 'success', text: 'Left the group successfully!' });
        navigate('/groups'); 
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to leave group. Please try again later.' });
      }
    }
  };

  return (
    <>
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
          <label htmlFor="name">Group name <span className={styles.required}>*</span></label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className={styles.input}
            disabled={currentUserRole?.groupRole !== 'owner'} // Disable if not owner
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="project-key">Group code <span className={styles.required}>*</span></label>
          <input
            id="groupCode"
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            className={styles.input}
            disabled={currentUserRole?.groupRole !== 'owner'} // Disable if not owner
          />
        </div>
        {message.text && (
          <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
            {message.text}
          </div>
        )}
        {currentUserRole?.groupRole === 'owner' && (
          <button onClick={editGroupDetail} className={styles.changeIconButton}>
            Save Changes
          </button>
        )}
      </div>
      <div className={styles.dots} onClick={() => setShowMenu(!showMenu)}>
        <HiDotsHorizontal />
      </div>
      {showMenu && (
        <div className={styles.dropdownMenu}>
          {currentUserRole?.groupRole === 'owner' ? (
            <button onClick={deleteGroup} className={styles.menuItem}>Delete Group</button>
          ) : (
            <button onClick={leaveGroup} className={styles.menuItem}>Leave Group</button>
          )}
        </div>
      )}
    </>
  );
}

export default GroupSetting;
