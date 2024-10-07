import React, { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { FaCheck, FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdClose, IoMdMore } from "react-icons/io";
import GroupTask from './GroupTask';
import GroupTaskDetail from './GroupTaskDetail';
import { IoCheckmark } from 'react-icons/io5';
function GroupColumn() {
    const [show, setShow] = useState(false);
    const handleRemoveTask = () => {
        if (window.confirm("Remove this column?")) {

        }
    }
    const [editColumn, setEditColumn] = useState(false)
    const [addTask, setAddTask] = useState(false)
    return (
        <Container fluid className='py-1'>
            <Row className='my-2 d-flex justify-content-between '>
                <Col md={10} className='text-start'>
                    {editColumn == false ? <p className='m-0 p-1 rounded-1 background-hover fw-bold' onClick={() => setEditColumn(true)}>Column Name</p> :
                        <Row className='d-flex justify-content-between'>
                            <Col md={8}><input type="text" name='columnName' className='w-100' required/></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setEditColumn(false) }}><IoCheckmark /></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setEditColumn(false) }}><IoMdClose /></Col>

                        </Row>}
                </Col>
                <Col md={2} className='text-end item-hover p-1'><IoMdMore /></Col>
            </Row>

            <Row className='my-2' onClick={() => { setShow(true) }}>
                <GroupTask />
            </Row>

            <Row className='my-2' onClick={() => { setShow(true) }}>
                <GroupTask />
            </Row>

            <Row className='my-2'>
                <Col md={9} className='text-start p-1'>
                    {addTask == false ? <p className='m-0 p-1 rounded-1 background-hover' onClick={() => setAddTask(true)}><FaPlus />  Create task</p> :
                        <Row className='d-flex justify-content-between'>
                            <Col md={8}><input type="text" name='taskName' className='w-100' required/></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setAddTask(false) }}><IoCheckmark /></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setAddTask(false) }}><IoMdClose /></Col>

                        </Row>}
                </Col>
                <Col md={3} className='text-end p-1'><FaRegTrashCan className='item-hover ' onClick={handleRemoveTask} /></Col>
            </Row>
            <GroupTaskDetail show={show} setShow={setShow} />
        </Container>
    )
}

export default GroupColumn
