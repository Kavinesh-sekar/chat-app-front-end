import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../api/axiosInstance';
import {userList} from '../api/authAPI';
import {jwtDecode} from 'jwt-decode'
import './sidebar.css';
const Sidebar = ({onUserSelect }) =>{

    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);

    const token = localStorage.getItem('accessToken');

    const userID = localStorage.getItem('ids');




    const decodedToken = jwtDecode(token);



    console.log('decodedToken',decodedToken);
    

    useEffect(() => {
        const fetchUsersAndGroups = async () => {
          try {
            const response = await userList(userID) 
            console.log('rr',response);
            
            setUsers(response.allUsers);
            setGroups(response.userGroups);
          } catch (error) {
            console.error('Error fetching users and groups:', error);
          }
        };
        fetchUsersAndGroups();
      }, []);

      console.log(users);
      console.log(groups);

      

    return(
        <>
      <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onUserSelect(user)}>
            {user.userName}
          </li>
        ))}
      </ul>

      {/* {groups.length > 1 ?
      <> */}

      <h2>Groups</h2>
      <ul>

        
        {groups.map((group) => (
          <li key={group.id} onClick={() => onUserSelect(group)}>
            {group.name}
          </li>
        ))}


      </ul> 
      {/* </>
    : <></>} */}
    </div>
  
        </>
    )
}

export default Sidebar;

