import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FaClock, FaPen, FaRegClock, FaUser } from 'react-icons/fa'
import { FaRegSquareCheck, FaRegTrashCan, FaSquareCheck } from 'react-icons/fa6'
import {GrTasks} from 'react-icons/gr'
import { IoMenu } from 'react-icons/io5'
function GroupSubTask() {
  return (
    <Row className='d-flex border border-1 border-secondary-subtle vh-5'>
        <Col md ={1} className='align-self-center'>
            <GrTasks/>
        </Col>
        <Col md ={7} className='align-self-center'>
            <p className='m-0 text-start'>SubTaskName</p>
        </Col>
        <Col md ={4} className='align-self-center text-end'>
            <IoMenu className='mx-1'/>
            <FaRegClock className='mx-1'/>
            <FaUser className='mx-1'/>
            <FaRegSquareCheck className='mx-1'/>
            <FaSquareCheck className='mx-1' />
            <FaRegTrashCan className='mx-1'/>
        </Col>
    </Row>
  )
}

export default GroupSubTask
