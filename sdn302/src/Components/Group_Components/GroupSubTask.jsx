import React, { useContext, useState } from 'react'
import { Col, Dropdown, Row } from 'react-bootstrap'
import { FaClock, FaPen, FaRegClock, FaUser } from 'react-icons/fa'
import { FaRegSquareCheck, FaRegTrashCan, FaSquareCheck } from 'react-icons/fa6'
import { GrTasks } from 'react-icons/gr'
import { IoCheckmark, IoMenu } from 'react-icons/io5'
import { AppContext } from '../../Context/AppContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { HiMenuAlt4, HiMinus, HiOutlineMenu } from "react-icons/hi";
import { IoMdClose } from 'react-icons/io'
function GroupSubTask({ subTask }) {

  const { groupId } = useParams();
  const { selectedTask, setSelectedTask, groups_API, group, setGroup, accessToken, groupMembers, setGroupMembers, editSubTask } = useContext(AppContext)
  const [inputSubTask, setInputSubTask] = useState(false);
  const [searchMember,setSearchMember] =  useState("");
  const filterMembers = groupMembers.filter((m)=>m.name.toUpperCase().includes(searchMember.toUpperCase()))
  const handleRemoveSubTask = async () => {
    if (window.confirm("Remove this subtask?")) {
      await axios.delete(`${groups_API}/${groupId}/tasks/${selectedTask?._id}/subTasks/${subTask._id}/delete`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((res) => {
          const updatedSubTasks = selectedTask.subTasks.filter(subTask => subTask._id != res.data);
          const updatedTasks = group.tasks.map(task =>
            task._id == selectedTask._id ? { ...task, subTasks: updatedSubTasks } : task
          );
          const updatedGroup = { ...group, tasks: [...updatedTasks] };
          setSelectedTask({ ...selectedTask, subTasks: [...updatedSubTasks] })
          setGroup(updatedGroup)
        })
        .catch((err) => console.error(err));
    }
  }

  const handleAssignSubTask = async (memberId) => {
    try {
      const res = await editSubTask("assignee", memberId, groupId, subTask)
      console.log(res);
      const updatedSubTasks = selectedTask.subTasks.map(st =>
        st._id == subTask._id ? { ...st, assignee: res.data?.assignee } : st
      );
      setSelectedTask({ ...selectedTask, subTasks: [...updatedSubTasks] })

    } catch (error) {
      console.log(error);
    }

  }

  const handleStatusSubTask = async (status) => {
    try {
      const res = await editSubTask("status", status, groupId, subTask)
      console.log(res);
      const updatedSubTasks = selectedTask.subTasks.map(st =>
        st._id == subTask._id ? { ...st, status: res.data?.status } : st
      );
      setSelectedTask({ ...selectedTask, subTasks: [...updatedSubTasks] })

    } catch (error) {
      console.log(error);
    }

  }

  const handlePrioritySubtask = async (priority) => {
    try {
      const res = await editSubTask("priority", priority, groupId, subTask)
      console.log(res);
      const updatedSubTasks = selectedTask.subTasks.map(st =>
        st._id == subTask._id ? { ...st, priority: res.data?.priority } : st
      );
      setSelectedTask({ ...selectedTask, subTasks: [...updatedSubTasks] })

    } catch (error) {
      console.log(error);
    }

  }
  return (
    <Row className='d-flex border border-1 border-secondary-subtle vh-5'>
      <Col md={1} className='align-self-center'>
        <GrTasks style={{ color: "#FE964B " }} />
      </Col>
      <Col md={7} className='align-self-center' onClick={() => { setInputSubTask(true) }}>
        {inputSubTask == false ? (<p className='m-0 text-start'>{subTask.subTaskName}</p>) : (
          <Row className='d-flex justify-content-between'>
            <Col md={8}><input type="text" name='subTaskName' className='w-100 m-0' required /></Col>
            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setInputSubTask(false); console.log(true); }}><IoCheckmark /></Col>
            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setInputSubTask(false); console.log(true); }}><IoMdClose /></Col>

          </Row>
        )}

      </Col>
      <Col md={4} className='align-self-center text-end'>

        <Dropdown className='d-inline'>

          <Dropdown.Toggle as="div" className='d-inline-block'>
            {subTask?.priority == "high" && <HiOutlineMenu className='mx-1 item-hover text-danger' />}
            {subTask?.priority == "medium" && <HiMenuAlt4 className='mx-1 item-hover text-warning' />}
            {subTask?.priority == "low" && <HiMinus className='mx-1 item-hover text-success' />}
          </Dropdown.Toggle>

          <Dropdown.Menu >
            <Dropdown.Header>Priority</Dropdown.Header>
            <Dropdown.Item onClick={() => handlePrioritySubtask("high")}><HiOutlineMenu className='mx-1 item-hover text-danger' /> HIGH</Dropdown.Item>
            <Dropdown.Item onClick={() => handlePrioritySubtask("medium")}><HiMenuAlt4 className='mx-1 item-hover text-warning' /> MEDIUM</Dropdown.Item>
            <Dropdown.Item onClick={() => handlePrioritySubtask("low")}><HiMinus className='mx-1 item-hover text-success' /> LOW</Dropdown.Item>

          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className='d-inline'>

          <Dropdown.Toggle as="div" className='d-inline-block'>
            <FaUser className='mx-1 item-hover' />
          </Dropdown.Toggle>

          <Dropdown.Menu >
            <Dropdown.ItemText><input type='text' onChange={(e)=>setSearchMember(e.target.value)}/></Dropdown.ItemText >
            <Dropdown.Header>Assignee</Dropdown.Header>
            <Dropdown.ItemText className='fw-bolder'  >{subTask?.assignee != null ? groupMembers?.find((m) => m.id == subTask.assignee).name : "Unassigned"}</Dropdown.ItemText>
            <Dropdown.Header>Members list</Dropdown.Header>
            {filterMembers ?.map((member) => {
              return <Dropdown.Item key={member.id} onClick={() => handleAssignSubTask(member.id)}>{member.name} </Dropdown.Item>
            })}
          </Dropdown.Menu>
        </Dropdown>
        {subTask.status == "done" ? <FaSquareCheck className='mx-1 item-hover text-success ' onClick={() => { handleStatusSubTask("inprogress") }} /> : <FaRegSquareCheck className='mx-1 item-hover ' onClick={() => { handleStatusSubTask("done") }} />}
        <FaRegTrashCan className='mx-1 item-hover text-danger' onClick={handleRemoveSubTask} />
      </Col>
    </Row>
  )
}

export default GroupSubTask
