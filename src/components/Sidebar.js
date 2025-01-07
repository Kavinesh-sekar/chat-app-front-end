import React, { useEffect, useState } from 'react';
import { userList } from '../api/authAPI';
import { jwtDecode } from 'jwt-decode';
import { createGroupPeople,joinGroup } from '../api/groupAPI';
import './sidebar.css';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel } from '@mui/material';

const Sidebar = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupsWithMembershipStatus, setGroupsWithMembershipStatus] = useState([]);

  const token = localStorage.getItem('accessToken');
  const userID = localStorage.getItem('ids');
  const decodedToken = jwtDecode(token);

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  
  
  useEffect(() => {
    const fetchUsersAndGroups = async () => {
      try {
        const response = await userList(userID);
        setUsers(response.allUsers);
        console.log('all users',response.allUsers);
        
        setGroups(response.userGroups);
        setGroupsWithMembershipStatus(response.groupsWithMembershipStatus);
      } catch (error) {
        console.error('Error fetching users and groups:', error);
      }
    };  
    fetchUsersAndGroups();
  }, []);

  const createGroup = async () => {
    setShowCreateGroupModal(true);
  };

  const handleGroupSubmit = async () => {
    selectedUsers.push(userID)
    const groupData = {
      groupName: groupName,
      groupDesc: groupDesc,
      groupMembers: selectedUsers,
      mediaUrl: null,
      groupCreatedBy: userID,
    };

    try {
      const response = await createGroupPeople(groupData);
      const userresponse = await userList(userID);
      setUsers(userresponse.allUsers);
      setGroups(userresponse.userGroups);
      setGroupsWithMembershipStatus(userresponse.groupsWithMembershipStatus);
      setShowCreateGroupModal(false);
      setGroupName('');
      setGroupDesc('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleJoinGroup = async(groupId) => {
    console.log(`User joining group with ID: ${groupId}`);
    let data= {
      groupId :groupId,
      userId:userID
    }
    try{
    const response = await joinGroup(data);
console.log('response',response);
const updatedResponse = await userList(userID);
setGroups(updatedResponse.userGroups);
setGroupsWithMembershipStatus(updatedResponse.groupsWithMembershipStatus);

    }catch(error){
      console.log('join group error',error);
      
    }
    
    // Logic to add the user to the group (e.g., API call to join group)
    
  };

  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
  {users.map((user) => (
    <li key={user._id} onClick={() => onUserSelect(user)} className="user-item">
      <img
        src={user.mediaUrls?.[0] || 'https://static.vecteezy.com/system/resources/previews/020/765/399/original/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'} // Use user's image or default
        alt={`${user.userName}'s profile`}
        className="profile-image"
      />
      <span>{user.userName}</span>
    </li>
  ))}
</ul>

      <h2>Groups</h2>
      <Button onClick={createGroup}>Create Group</Button>
      <ul>
  {/* Render already member groups first */}
  {groupsWithMembershipStatus
    .filter((group) => group.isMember) // Filter groups where the user is a member
    .map((group) => (
      <li key={group.groupId}>
        <span onClick={() => onUserSelect(group)}>{group.groupName}</span>
      </li>
    ))}

  {/* Render joinable groups next */}
  {groupsWithMembershipStatus
    .filter((group) => !group.isMember) // Filter groups where the user is not a member
    .map((group) => (
      <li key={group.groupId}>
        {group.groupName}
        <Button
          style={{ marginLeft: '10px' }}
          onClick={() => handleJoinGroup(group.groupId)}
        >
          Join Group
        </Button>
      </li>
    ))}
</ul>



      <Dialog open={showCreateGroupModal} onClose={() => setShowCreateGroupModal(false)}>
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <TextField
            label="Group Name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Group Description"
            fullWidth
            value={groupDesc}
            onChange={(e) => setGroupDesc(e.target.value)}
            margin="normal"
          />
          <h4>Select Users</h4>
          {users
            .filter((user) => user._id !== userID) // Exclude current user
            .map((user) => (
              <FormControlLabel
                key={user._id}
                control={
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                  />
                }
                label={user.userName}
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateGroupModal(false)}>Cancel</Button>
          <Button onClick={handleGroupSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
