import React, { useState } from 'react'
import { Col, Dropdown, Row } from 'react-bootstrap'
import { FaClock, FaPen, FaRegClock, FaUser } from 'react-icons/fa'
import { FaRegSquareCheck, FaRegTrashCan, FaSquareCheck } from 'react-icons/fa6'
import { GrTasks } from 'react-icons/gr'
import { IoMenu } from 'react-icons/io5'
function GroupSubTask() {
  const [isDone, setIsDone] = useState(false);
  const handleRemoveSubTask = () => {
    if (window.confirm("Remove this subtask?")) {

    }
  }
  return (
    <Row className='d-flex border border-1 border-secondary-subtle vh-5'>
      <Col md={1} className='align-self-center'>
        <GrTasks />
      </Col>
      <Col md={7} className='align-self-center'>
        <p className='m-0 text-start'>SubTaskName</p>
      </Col>
      <Col md={4} className='align-self-center text-end'>
        <IoMenu className='mx-1 item-hover' />
        <Dropdown className='d-inline'>
            <FaUser className='mx-1 item-hover'  />  

          <Dropdown.Menu >
            <Dropdown.Header>Members list</Dropdown.Header>
            <Dropdown.Item eventKey="1">TriNM</Dropdown.Item>
            <Dropdown.Item eventKey="2">HaoTH</Dropdown.Item>
            <Dropdown.Item eventKey="3">...</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {isDone == true ? <FaRegSquareCheck className='mx-1 item-hover' onClick={() => { setIsDone(!isDone) }} /> : <FaSquareCheck className='mx-1 item-hover' onClick={() => { setIsDone(!isDone) }} />}
        <FaRegTrashCan className='mx-1 item-hover' onClick={handleRemoveSubTask} />
      </Col>
    </Row>
  )
}

export default GroupSubTask
