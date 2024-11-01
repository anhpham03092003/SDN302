import React, { useContext } from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import { AppContext } from '../../Context/AppContext'

function GroupComment({comment}) {
    const{ groupMembers, setGroupMembers} = useContext(AppContext)
    return (
        <Row className='d-flex justify-content-start my-1'>
            <Col md={1}>
                <Image className='w-100' src={"https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"}></Image>
            </Col>
            <Col md={11} className='d-flex justify-content-between'>
                <strong className=''>{groupMembers?.find(member=>member.id==comment?.user).name}</strong>
                <em className='fw-lighter ms-3'>{new Date(comment.updatedAt).toLocaleDateString('vi-VN')}</em> 
            </Col>
            <Col md={1}>

            </Col>
            <Col md={11}>
                {comment?.content}
            </Col>
            <Col md={1}></Col>
            <Col md={1}>
                <a className='text-dark fw-semibold item-hover'>Edit</a>
            </Col>
            <Col md={1}>
                <a className='text-dark fw-semibold item-hover'>Delete</a>
            </Col>
        </Row>
    )
}

export default GroupComment
