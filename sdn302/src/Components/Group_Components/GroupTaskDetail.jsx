import React, { useContext, useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Container, Dropdown, Form, Image, Modal, Row } from 'react-bootstrap'
import { FaList } from 'react-icons/fa'
import { IoCheckmark, IoMenu } from 'react-icons/io5'
import GroupSubTask from './GroupSubTask'
import { IoMdClose, IoMdMenu } from 'react-icons/io'
import { AppContext } from '../../Context/AppContext'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import GroupComment from './GroupComment'

function GroupTaskDetail() {
    const { groupId } = useParams();
    const { editTask, show, setShow, selectedTask, setSelectedTask, groups_API, group, setGroup, accessToken, groupMembers, setGroupMembers, currentUserRole } = useContext(AppContext)
    const [showDescription, setShowDescription] = useState(false)
    const [showComment, setShowComment] = useState(false)
    const [editTaskName, setEditTaskName] = useState(false)
    const [newDescription, setNewDescription] = useState("")
    const [newComment, setNewComment] = useState("")
    const [newTaskName, setNewTaskName] = useState(selectedTask?.taskName)

    useEffect(() => {
        setNewDescription(selectedTask?.description)
    }, [selectedTask])
    const [searchMember, setSearchMember] = useState("");
    const filterMembers = groupMembers?.filter((m) => m.name.toUpperCase().includes(searchMember.toUpperCase()))
    const handleDelete = async () => {

        if (currentUserRole?.groupRole != "viewer") {
            if (window.confirm("Remove this task?")) {
                await axios.delete(`${groups_API}/${groupId}/tasks/${selectedTask?._id}/delete`, { headers: { Authorization: `Bearer ${accessToken}` } })
                    .then((res) => {
                        const updatedTasks = group?.tasks?.filter((t) => {
                            return t._id != selectedTask._id
                        })

                        setGroup({ ...group, tasks: [...updatedTasks] });
                        setSelectedTask();
                        setShow(false)
                    })
                    .catch((err) => console.error(err));
            }
        } else {
            window.alert("You must be group member to add new column!")
        }
    }

    const handleAddSubTask = async (e) => {
        e.preventDefault();

        if (currentUserRole?.groupRole != "viewer") {
            await axios.post(`${groups_API}/${groupId}/tasks/${selectedTask?._id}/subTasks/create`, { subTaskName: e.target.subTaskName.value }, { headers: { Authorization: `Bearer ${accessToken}` } })
                .then((res) => {
                    const updatedSubTasks = [...selectedTask.subTasks, res.data];
                    const updatedTasks = group.tasks.map(task =>
                        task._id == selectedTask._id ? { ...task, subTasks: updatedSubTasks } : task
                    );
                    const updatedGroup = { ...group, tasks: [...updatedTasks] };
                    setSelectedTask({ ...selectedTask, subTasks: [...updatedSubTasks] })
                    e.target.subTaskName.value = "";
                    setGroup(updatedGroup)

                })
                .catch((err) => console.error(err));
        } else {
            window.alert("You must be group member to add new column!")
        }
    }

    const handleAddComment = async () => {
        if (currentUserRole?.groupRole != "viewer") {
            await axios.post(`${groups_API}/${groupId}/tasks/${selectedTask?._id}/comments/create`, { content: newComment, status: "created" }, { headers: { Authorization: `Bearer ${accessToken}` } })
                .then((res) => {
                    const updatedComments = [...selectedTask.comments, res.data];
                    const updatedTasks = group.tasks.map(task =>
                        task._id == selectedTask._id ? { ...task, comments: updatedComments } : task
                    );
                    const updatedGroup = { ...group, tasks: [...updatedTasks] };
                    setSelectedTask({ ...selectedTask, comments: [...updatedComments] })
                    setNewComment("");
                    setGroup(updatedGroup)

                })
                .catch((err) => console.error(err));
        } else {
            window.alert("You must be group member to add new column!")
        }
    }

    const handleAssignTask = async (memberId) => {

        if (currentUserRole?.groupRole != "viewer") {
            try {
                const res = await editTask("assignee", memberId, groupId)
                console.log(res);
                const updatedTasks = group.tasks.map(task =>
                    task._id == selectedTask._id ? { ...task, assignee: res.data?.assignee } : task
                );


                setSelectedTask({ ...selectedTask, assignee: res.data?.assignee })
                setGroup({ ...group, tasks: [...updatedTasks] })

            } catch (error) {
                console.log(error);
            }
        } else {
            window.alert("You must be group member to add new column!")
        }

    }

    const handleAddDescription = async () => {

        if (currentUserRole?.groupRole != "viewer") {
            try {
                const res = await editTask("description", newDescription, groupId)
                console.log(res);
                const updatedTasks = group.tasks.map(task =>
                    task._id == selectedTask._id ? { ...task, description: res.data?.description } : task
                );


                setSelectedTask({ ...selectedTask, description: res.data?.description })
                setGroup({ ...group, tasks: [...updatedTasks] })

            } catch (error) {
                console.log(error);
            }
        } else {
            window.alert("You must be group member to add new column!")
        }

    }

    const handleTaskStatus = async (status) => {

        if (currentUserRole?.groupRole != "viewer") {
            try {
                const res = await editTask("status", status, groupId)
                console.log(res);
                const updatedTasks = group.tasks.map(task =>
                    task._id == selectedTask._id ? { ...task, status: res.data?.status } : task
                );


                setSelectedTask({ ...selectedTask, status: res.data?.status })
                setGroup({ ...group, tasks: [...updatedTasks] })

            } catch (error) {
                console.log(error);
            }
        } else {
            window.alert("You must be group member to add new column!")
        }

    }
    const handleEditTaskName = async () => {

        if (currentUserRole?.groupRole != "viewer") {
            try {
                const res = await editTask("taskName", newTaskName, groupId)
                console.log(res);
                const updatedTasks = group.tasks.map(task =>
                    task._id == selectedTask._id ? { ...task, taskName: res.data?.taskName } : task
                );


                setSelectedTask({ ...selectedTask, taskName: res.data?.taskName })
                setGroup({ ...group, tasks: [...updatedTasks] })

            } catch (error) {
                console.log(error);
            }
        } else {
            window.alert("You must be group member to add new column!")
        }

    }

    const handleEditDeadline = async (e) => {
        e.preventDefault();

        if (currentUserRole?.groupRole != "viewer") {
            if (new Date(e.target.deadline.value) > new Date()) {
                try {
                    const res = await editTask("deadline", e.target.deadline.value, groupId)
                    console.log(res);
                    const updatedTasks = group.tasks.map(task =>
                        task._id == selectedTask._id ? { ...task, deadline: res.data?.deadline } : task
                    );
                    console.log(e.target.deadline.value);

                    setSelectedTask({ ...selectedTask, deadline: res.data?.deadline })
                    setGroup({ ...group, tasks: [...updatedTasks] })

                } catch (error) {
                    console.log(error);
                }
            }else{
                window.alert("Deadline must be in the future date!")

            }
        } else {
            window.alert("You must be group member to add new column!")
        }

    }
    return (
        <Modal
            show={show}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered

        >
            <Modal.Header closeButton onHide={() => { setShow(false) }}>
                {editTaskName == false ?
                    <Modal.Title id="contained-modal-title-vcenter cursor-pointer" onClick={() => setEditTaskName(true)}>
                        <p className='m-0 cursor-pointer item-hover'>{selectedTask?.taskName}</p>
                    </Modal.Title>
                    :
                    <Row className='d-flex justify-content-between'>
                        <Col md={8}><input type="text" name='taskName' className='w-100 m-0' value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} required /></Col>
                        <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { handleEditTaskName(); setEditTaskName(false) }}><IoCheckmark /></Col>
                        <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setEditTaskName(false); setNewTaskName(selectedTask?.taskName) }}><IoMdClose /></Col>

                    </Row>
                }


            </Modal.Header>
            <Modal.Body className='vh-83 overflow-auto'>
                <Container>
                    <Row className='d-flex justify-content-between'>
                        <Col md={8}>
                            <Row className='mb-3'>
                                <Col md={8} className='align-content-center'>
                                    <p className='m-0'>in the <strong className='text-success '>{selectedTask?.status?.toUpperCase()}</strong></p>
                                    {selectedTask?.deadline && <p className='m-0'>Deadline: <strong>{new Date(selectedTask.deadline).toLocaleDateString('vi-VN')}    </strong></p>}

                                </Col>
                                <Col md={2} className='text-end'>
                                    <Dropdown >
                                        <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark  mx-1 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                            <strong>Deadline</strong>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu >
                                            <Dropdown.Header>
                                                <Form onSubmit={(e) => handleEditDeadline(e)}>
                                                    <Form.Control type='date' name='deadline' />
                                                    <Button type='submit' className='m-1 btn-sm p-1 '>Save</Button>
                                                </Form>
                                            </Dropdown.Header>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col md={2} className='text-end'>
                                    <Dropdown >
                                        <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark  mx-1 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                            <strong>{selectedTask?.status?.toUpperCase()}</strong>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu >
                                            <Dropdown.Header>Columns list</Dropdown.Header>
                                            {group?.classifications.map((column, index) => {
                                                return <Dropdown.Item className={selectedTask?.status == column ? "fw-bolder text-success" : ""} key={index} onClick={() => handleTaskStatus(column)}>{column?.toUpperCase()}</Dropdown.Item>
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>

                            </Row>
                            <Row className='mb-3'>
                                <h5 className='mb-3 col-md-12'><IoMdMenu /> Description</h5>
                                <textarea name='description' rows={4} cols={100}
                                    placeholder='...Add a description' className='ms-4 border border-secondary-subtle col-md-12' required
                                    onFocus={() => { setShowDescription(true) }}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    value={newDescription}
                                >

                                </textarea>


                                {showDescription == true && <Row className='d-flex justify-content-between'>
                                    <Col md={8}></Col>
                                    <Col md={4}>
                                        <Button className='col-md-5 m-1 p-1 btn-secondary' onClick={() => { setNewDescription(selectedTask?.description); setShowDescription(false) }}>Cancel</Button>
                                        <Button className='col-md-5 m-1 p-1 ' onClick={(e) => {
                                            e.preventDefault();
                                            handleAddDescription();
                                            setShowDescription(false)
                                        }}
                                        >Save</Button>
                                    </Col>
                                </Row>}


                            </Row>
                            <Row className='mb-3'>
                                <h5 className='mb-3'><FaList /> SubTask</h5>
                                <Row className='ms-4'>
                                    {selectedTask?.subTasks?.map((subTask) => {
                                        return <Col key={subTask._id} md={12}><GroupSubTask subTask={subTask} /></Col>
                                    })}
                                </Row>
                            </Row>

                            <Row className='mb-3'>
                                <h5 className='mb-3'><FaList /> Comments</h5>

                                <Row>
                                    <Col md={1}>
                                        <Image className='w-100' src={"https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"} roundedCircle></Image>
                                    </Col>
                                    <Col md={11}>
                                        <input type='text' name='comments' rows={4} cols={100}
                                            placeholder='...Add a comment' className='  border border-secondary-subtle'
                                            onFocus={() => { setShowComment(true) }}
                                            onChange={(e) => setNewComment(e.target.value)}

                                            value={newComment}

                                            required>

                                        </input>
                                    </Col>
                                </Row>


                                {showComment == true && <Row className='d-flex justify-content-between'>
                                    <Col md={8}></Col>
                                    <Col md={4}>
                                        <Button className='col-md-5 m-1 p-1 btn-secondary' onClick={() => { setNewComment(""); setShowComment(false) }}>Cancel</Button>
                                        <Button className='col-md-5 m-1 p-1 ' onClick={() => { handleAddComment(); setShowComment(false) }} >Save</Button>
                                    </Col>
                                </Row>}

                                {selectedTask?.comments
                                    ?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                                    .map((comment) => <GroupComment key={comment.id} comment={comment} />)}

                            </Row>
                        </Col>
                        <Col md={3}>
                            <Row className='text-center my-2'>
                                <Dropdown >
                                    <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark py-3 mx-1 w-100 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                        <strong>
                                            {selectedTask?.assignee != null && <Image className=' me-2' width={"15%"} height={"15%"} src={"https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"} roundedCircle></Image>}
                                            {selectedTask?.assignee != null ? groupMembers?.find((m) => m.id == selectedTask.assignee).name : "Unassigned"}
                                        </strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        <Dropdown.ItemText><input type='text' onChange={(e) => setSearchMember(e.target.value)} /></Dropdown.ItemText >
                                        <Dropdown.Header>Assignee</Dropdown.Header>
                                        <Dropdown.ItemText className='fw-bolder' >

                                            {selectedTask?.assignee != null ? groupMembers?.find((m) => m.id == selectedTask.assignee).name : "Unassigned"}
                                        </Dropdown.ItemText>
                                        <Dropdown.Header>Members list</Dropdown.Header>
                                        {filterMembers?.map((member) => {
                                            return <Dropdown.Item key={member.id} onClick={() => handleAssignTask(member.id)}>
                                                <Image className=' me-2' width={"10%"} height={"10%"} src={"https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"} roundedCircle></Image>
                                                {member.name}
                                            </Dropdown.Item>
                                        })}

                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row className='text-center my-2'>
                                <Dropdown >
                                    <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark py-3 mx-1 w-100 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                        <strong>Add sub task</strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        <Dropdown.ItemText   >
                                            <Form onSubmit={(e) => handleAddSubTask(e)}>
                                                <Form.Control type='text' name='subTaskName' required />
                                                <Button type='submit' className='w-100'  >Add</Button>
                                            </Form>
                                        </Dropdown.ItemText >
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row className='text-center my-2'>
                                <div>
                                    <Button className=' text-dark py-3 px-0 mx-1 w-100 rounded-0  border-0 text-dark background-hover background-color-third'
                                        onClick={handleDelete}>
                                        <strong>Remove</strong>
                                    </Button>
                                </div>

                            </Row>

                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default GroupTaskDetail
