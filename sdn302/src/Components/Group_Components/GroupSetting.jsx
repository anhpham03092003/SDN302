import React, { useContext, useEffect, useState } from 'react';
import styles from '../../Styles/Group_css/GroupSetting.module.css';
import { AppContext } from "../../Context/AppContext";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiDotsHorizontal } from "react-icons/hi";

function GroupSetting() {
  const { group, setGroup, groupMembers, groups_API, accessToken, currentUserRole, groups, setGroups } = useContext(AppContext);
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [message, setMessage] = useState({ type: null, text: '' });
  const [showMenu, setShowMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  const owner = groupMembers?.find(member => member.groupRole === 'owner');

  // Predefined list of images
  const imageOptions = [
    "https://bucket-image.inkmaginecms.com/version/mobile/1/image/2024/07/4d272377-993c-471f-aa41-f3a3c859695e.png",
    "https://assets.teenvogue.com/photos/63b4a6386ce4660478f4d4a1/16:9/w_2560%2Cc_limit/NewJeans%2520Official%2520Photo%2520(1).jpg",
    "https://bloganchoi.com/wp-content/uploads/2022/08/new-jeans-1-2.jpg",
    "https://www.voguehk.com/media/2023/11/NewJeans-How-Sweet-MV-1800x1200.jpeg",
    "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg",
  ];

  useEffect(() => {
    if (group) {
      setGroupName(group.groupName);
      setGroupCode(group.groupCode);
      setSelectedImage(group.imageGroup);
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
    const updatedData = { groupName, groupCode, imageGroup: selectedImage };
    try {
      const response = await axios.put(
        `${groups_API}/${groupId}/edit`,
        updatedData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Update the group in context state
      setGroup(response.data);
      setGroups((prevGroups) =>
        prevGroups.map((g) => (g._id === groupId ? response.data : g))
      );

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
        setGroups(groups.filter(g => g._id !== groupId));
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
        setGroups(groups.filter(g => g._id !== groupId));
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
            src={selectedImage || "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg"}
            alt="Project icon"
          />
          {currentUserRole?.groupRole === 'owner' && (
            <button 
              className={styles.changeIconButton} 
              onClick={() => setShowImageModal(true)} // Open modal
            >
              Change image
            </button>
          )}
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
            disabled={currentUserRole?.groupRole !== 'owner'}
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
            disabled={currentUserRole?.groupRole !== 'owner'}
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

      {/* Modal for image selection */}
      {showImageModal && (
        <div className={styles.modalOverlay} onClick={() => setShowImageModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Select an Icon</h2>
            <div className={styles.imageGrid}>
              {imageOptions.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Option ${index + 1}`}
                  className={styles.optionImage}
                  onClick={() => {
                    setSelectedImage(image);
                    setShowImageModal(false); // Close modal after selection
                  }}
                />
              ))}
            </div>
            <button className={styles.closeButton} onClick={() => setShowImageModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupSetting;
