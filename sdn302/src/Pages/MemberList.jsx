import React, { useState } from 'react';
import { Table, Button, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import { BsEyeFill, BsPencilFill, BsTrashFill } from 'react-icons/bs';
import AddMemberModal from '../Components/Group_Components/AddMember'; // Import the new modal component

function MemberList() {
  const members = [
    { id: 1, name: 'Thomas Hardy', role: 'Manager', tasks: 12 },
    { id: 2, name: 'Maria Anders', role: 'Developer', tasks: 10 },
    { id: 3, name: 'Fran Wilson', role: 'Designer', tasks: 7 },
    { id: 4, name: 'Dominique Perrier', role: 'Tester', tasks: 5 },
    { id: 5, name: 'Martin Blank', role: 'Admin', tasks: 9 },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [modalShow, setModalShow] = useState(false); // State for modal visibility

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="mt-4">Team <span className="text-primary">Members</span></h2>

      {/* Search Input and Add New Member Button */}
      <InputGroup className="mb-3 mt-3">
        <FormControl
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Add New Member
        </Button>
      </InputGroup>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Role</th>
            <th>Number of Tasks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member, index) => (
            <tr key={member.id}>
              <td>{index + 1}</td>
              <td>{member.name}</td>
              <td>{member.role}</td>
              <td>{member.tasks}</td>
              <td>
                <Button variant="link">
                  <BsEyeFill title="View" className="text-primary" />
                </Button>
                <Button variant="link">
                  <BsPencilFill title="Edit" className="text-warning" />
                </Button>
                <Button variant="link">
                  <BsTrashFill title="Delete" className="text-danger" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item active>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Item>{3}</Pagination.Item>
        <Pagination.Item>{4}</Pagination.Item>
        <Pagination.Item>{5}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>

      <div className="text-right mt-3">
        Showing {filteredMembers.length} out of 25 entries
      </div>

      {/* Add Member Modal */}
      <AddMemberModal show={modalShow} handleClose={() => setModalShow(false)} />
    </div>
  );
}

export default MemberList;
