// File: AdminDashboard.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './AdminDashboard.css'; // Create this CSS file for styling
import './ModalStyles.css'; // Replace with your actual CSS file path


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;



  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('');

  const openModal = (id1) => {
    let index=currentUsers.findIndex((obj => obj.id === id1));
    setCurrentIndex(index);
    setNewName(users[index].name);
    setNewEmail(users[index].email);
    setNewRole(users[index].role);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentIndex(null);
    setNewName('');
    setNewEmail('');
    setNewRole('');
  };

  const updateUserInfo = () => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[currentIndex] = {
        ...updatedUsers[currentIndex],
        name: newName,
        email: newEmail,
        role: newRole,
      };
      return updatedUsers;
    });
    closeModal();
  };





  // Fetch data from the API endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

 

    // Filtering based on search term
    const filteredUsers = users.filter(user =>
    Object.values(user).some(value => value.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page click
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Toggle select/deselect all rows
  const handleSelectAll = () => {
    if (selectedRows.length === currentUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...currentUsers.map(user => user.id)]);
    }
  };

  // Delete selected rows
  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };
  const handleDelete = (id1) => {
    if(selectedRows.includes(id1)){
        selectedRows.splice(selectedRows.indexOf(id1), 1)
    }
    const updatedUsers = users.filter(user => user.id!==id1);
    setUsers(updatedUsers);
   
  };
  
  const selected_row="selected-row";
  const notselectd="";

  return (
    <div className="admin-dashboard">
      <input
        type="text"
        className='search-box'
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
     

      <table>
        {/* Table headers */}
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === currentUsers.length}
                onChange={handleSelectAll}
              />
            </th>
            
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id} className={selectedRows.includes(user.id)?selected_row:notselectd}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => {
                    setSelectedRows((prevSelected) =>
                      prevSelected.includes(user.id)
                        ? prevSelected.filter((id) => id !== user.id)
                        : [...prevSelected, user.id]
                    );
                  }}
                />
              </td>
              
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
             
                <button className="edit-icon" onClick={()=>openModal(user.id)}><i className="fas fa-edit"></i></button>
                <button className="delete-icon" onClick={()=>handleDelete(user.id)}><i className="fas fa-trash-alt"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='bottom-box flex flex-start'>
        <div>
         {selectedRows?.length} of {users?.length} rows selected
        </div>
        <div>
        
         Page 1 to {Math.ceil(filteredUsers.length / usersPerPage)} 
         
        </div>
      </div>
      <div className='bottom-box flex flex-start'>
        <div  >
         {/* Delete Selected button */}
      <button className='delete-selected-button'  onClick={handleDeleteSelected}>
        Delete Selected
      </button>
      </div>
      {/* Pagination */}
      <div className="pagination">
        <button
          className="page-button"
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
        >
         <i className="fas fa-angle-double-left"></i>
        </button>
        {/* Previous Page */}
        <button
          className="page-button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
         <i className="fas fa-angle-left"></i>
        </button>

        {/* Page numbers */}
        {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => handlePageClick(page + 1)}
            className={currentPage === page + 1 ? 'active' : 'page-button'}
          >
            {page + 1}
          </button>
        ))}

        {/* Next Page */}
        <button
          className="page-button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
        >
           <i className="fas fa-angle-right"></i>
        </button>
        {/* End Page */}
        <button className="page-button" onClick={() => handlePageClick(Math.ceil(filteredUsers.length / usersPerPage))}>
        <i class="fas fa-angle-double-right"></i>
    </button>
      </div>

      </div>
      

      <Modal  className="model" isOpen={modalIsOpen} onRequestClose={closeModal} ariaHideApp={false}>
        <h2>Edit User Information</h2>
        <label>Name:</label>
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <label>Email:</label>
        <input type="text" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        <label>Role:</label>
        <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
        <button className='' onClick={updateUserInfo}>Save Changes</button>
        <button className='' onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
