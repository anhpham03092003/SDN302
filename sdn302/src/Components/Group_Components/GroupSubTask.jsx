import React, { useContext, useState } from 'react'
import { Col, Dropdown, Row } from 'react-bootstrap'
import { FaClock, FaPen, FaRegClock, FaUser } from 'react-icons/fa'
import { FaRegSquareCheck, FaRegTrashCan, FaSquareCheck } from 'react-icons/fa6'
import { GrTasks } from 'react-icons/gr'
import { IoMenu } from 'react-icons/io5'
import { AppContext } from '../../Context/AppContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'
function GroupSubTask({subTask}) {
  const { groupId } = useParams();  
  const {selectedTask, setSelectedTask, groups_API, group, setGroup, accessToken, groupMembers, setGroupMembers}= useContext(AppContext)
  const [isDone, setIsDone] = useState(false);
  const handleRemoveSubTask = async () => {
    if (window.confirm("Remove this subtask?")) {
      await axios.delete(`${groups_API}/${groupId}/tasks/${selectedTask?._id}/subTasks/${subTask._id}/delete`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        const updatedSubTasks = selectedTask.subTasks.filter(subTask=>subTask._id!=res.data);
        const updatedTasks = group.tasks.map(task =>
            task._id == selectedTask._id ? { ...task, subTasks: updatedSubTasks } : task
        );
        const updatedGroup = { ...group, tasks: [...updatedTasks] };
        setSelectedTask({...selectedTask,subTasks:[...updatedSubTasks]})
        setGroup(updatedGroup)
      })
      .catch((err) => console.error(err));
    }
  }
  return (
    <Row className='d-flex border border-1 border-secondary-subtle vh-5'>
      <Col md={1} className='align-self-center'>
        <GrTasks />
      </Col>
      <Col md={7} className='align-self-center'>
        <p className='m-0 text-start'>{subTask.subTaskName}</p>
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
        {subTask.status == "done" ? <FaRegSquareCheck className='mx-1 item-hover ' onClick={() => { setIsDone(!isDone) }} /> : <FaSquareCheck className='mx-1 item-hover text-success' onClick={() => { setIsDone(!isDone) }} />}
        <FaRegTrashCan className='mx-1 item-hover' onClick={handleRemoveSubTask} />
      </Col>
    </Row>
  )
}

export default GroupSubTask
