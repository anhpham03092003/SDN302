import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { FaCheck, FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdClose, IoMdMore } from "react-icons/io";
import GroupTask from './GroupTask';
import GroupTaskDetail from './GroupTaskDetail';
import { IoCheckmark } from 'react-icons/io5';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
function GroupColumn({ column }) {
    const { groups_API, group, setGroup, accessToken,show, setShow,selectedTask,setSelectedTask } = useContext(AppContext)
    
    const tasks = group.tasks.filter((t) => {
        return t.status == column
    });
    const [newTask, setNewTask] = useState("");
    const handleRemoveTask = () => {
        if (window.confirm("Remove this column?")) {

        }
    }
    async function handleCreateTask() {
        await axios.post(`${groups_API}/${group._id}/tasks/create`, { taskName: newTask, status: column }, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((res) => {

                setGroup({...group,tasks: [...group.tasks, res.data]});
                setNewTask(''); 
                setAddTask(false)
            })
            .catch((err) => console.log(err));

    }
    const [editColumn, setEditColumn] = useState(false)
    const [addTask, setAddTask] = useState(false)
    return (
        <Container fluid className='py-1'>
            <Row className='my-2 d-flex justify-content-between '>
                <Col md={10} className='text-start'>
                    {editColumn == false ? <p className='m-0 p-1 rounded-1 background-hover fw-bold' onClick={() => setEditColumn(true)}>{column.toUpperCase()}</p> :
                        <Row className='d-flex justify-content-between'>
                            <Col md={8}><input type="text" name='columnName' className='w-100 m-0' required /></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setEditColumn(false) }}><IoCheckmark /></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setEditColumn(false) }}><IoMdClose /></Col>

                        </Row>}
                </Col>
                <Col md={2} className='text-end item-hover p-1'><IoMdMore /></Col>
            </Row>

            {tasks?.map((task) => {
                return (<Row key={task._id} className='my-2' onClick={() => { setShow(true); setSelectedTask(task) }}>
                    <GroupTask task={task} />
                </Row>)
            })}

            <Row className='my-2'>
                <Col md={9} className='text-start p-1'>
                    {addTask == false ? <p className='m-0 p-1 rounded-1 background-hover' onClick={() => setAddTask(true)}><FaPlus />  Create task</p> :
                        <Row className='d-flex justify-content-between'>
                            <Col md={8}><input type="text" name='taskName' className='w-100 m-0'
                                onChange={(e) => { setNewTask(e.target.value) }} required /></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black'
                                onClick={handleCreateTask}
                            ><IoCheckmark /></Col>

                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setAddTask(false) }}><IoMdClose /></Col>

                        </Row>}
                </Col>
                <Col md={3} className='text-end p-1'><FaRegTrashCan className='item-hover ' onClick={handleRemoveTask} /></Col>
            </Row>
            <GroupTaskDetail />
        </Container>
    )
}

export default GroupColumn
