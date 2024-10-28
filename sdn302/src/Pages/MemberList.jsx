import React, { useState, useContext, useEffect, useRef } from 'react';
import { Table, Button, InputGroup, FormControl } from 'react-bootstrap';
import { BsEyeFill, BsChevronDown, BsTrashFill } from 'react-icons/bs';
import { AppContext } from "../Context/AppContext";

function MemberList() {
  const { group, setGroup, groupMembers, setGroupMembers, groups_API, accessToken, currentUserRole } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredMembers = groupMembers?.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (member) => {
    if (currentUserRole?.groupRole === 'owner' && member.groupRole !== 'owner') {
      setEditingMemberId(member.id);
      setNewRole(member.groupRole); // Set the newRole to the member's current role
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleRoleChange = async (memberId, role) => {
    if (currentUserRole?.groupRole !== 'owner' || role === '' || role === 'owner') return; // Prevent changing to "owner" role

    try {
      const response = await fetch(`${groups_API}/${group._id}/member/${memberId}/set-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ groupRole: role }),
      });

      if (response.ok) {
        setGroupMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === memberId ? { ...member, groupRole: role } : member
          )
        );
        setEditingMemberId(null);
        setDropdownOpen(false);
      } else {
        const errorResponse = await response.json();
        console.error('Error updating role:', errorResponse.message);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (currentUserRole?.groupRole !== 'owner') return; // Prevent deletion if not owner 

    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const response = await fetch(`${groups_API}/${group._id}/member/${memberId}/delete`, { 
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          setGroupMembers((prevMembers) => prevMembers.filter(member => member.id !== memberId));
        } else {
          const errorResponse = await response.json();
          console.error('Error deleting member:', errorResponse.message);
        }
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const roles = ['member', 'viewer'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <h2 className="mt-4">Team <span className="text-primary">Members</span></h2>

      <InputGroup className="mb-3 mt-3">
        <FormControl
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>#</th>
            <th style={{ width: '200px' }}>Name</th>
            <th style={{ width: '150px' }}>Role</th>
            <th style={{ width: '150px' }}>Number of Tasks</th>
            <th style={{ width: '150px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member, index) => (
            <tr key={member.id}>
              <td>{index + 1}</td>
              <td>{member.name}</td>
              <td>
                {member.groupRole === 'owner' ? (
                  <span>Owner</span>
                ) : (
                  editingMemberId === member.id ? (
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                      <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{
                          padding: '8px',
                          border: '1px solid #ccc',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minWidth: '100px',
                          backgroundColor: 'white',
                        }}
                      >
                        {newRole || 'Select Role'}
                        <BsChevronDown />
                      </div>
                      {dropdownOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            border: '1px solid #ccc',
                            backgroundColor: 'white',
                            width: '100%',
                            zIndex: 1,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {roles.map((role) => (
                            <div
                              key={role}
                              onClick={() => handleRoleChange(member.id, role)}
                              style={{
                                padding: '8px',
                                cursor: 'pointer',
                                backgroundColor: newRole === role ? '#f0f0f0' : 'white',
                              }}
                            >
                              {role}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => handleEditClick(member)}
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                    >
                      {member?.groupRole}
                      {currentUserRole?.groupRole === 'owner' && (
                        <BsChevronDown style={{ marginLeft: '5px' }} />
                      )}
                    </div>
                  )
                )}
              </td>
              <td>{member.tasks}</td>
              <td>
                <Button variant="link">
                  <BsEyeFill title="View" className="text-primary" />
                </Button>
                {currentUserRole?.groupRole === 'owner' && member?.groupRole !== 'owner' && (
                  <Button
                    variant="link"
                    onClick={() => handleDeleteMember(member?.id)}
                  >
                    <BsTrashFill title="Delete" className="text-danger" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default MemberList;
