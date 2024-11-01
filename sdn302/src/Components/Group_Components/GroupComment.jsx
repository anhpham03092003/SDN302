import React, { useContext, useState } from 'react'
import { Button, Col, Image, Row } from 'react-bootstrap'
import { AppContext } from '../../Context/AppContext'
import axios from 'axios';
import { useParams } from 'react-router-dom';

function GroupComment({ comment }) {
    const { user, selectedTask, setSelectedTask, groups_API, group, setGroup, accessToken, groupMembers, setGroupMembers } = useContext(AppContext);
    const { groupId } = useParams();
    const [showEdit, setShowEdit] = useState(false)
    const [newComment, setNewComment] = useState(comment?.content)
    const handleRemoveComment = async () => {
        if (window.confirm("Remove this comment?")) {
            await axios.delete(`${groups_API}/${groupId}/tasks/${selectedTask?._id}/comments/${comment._id}/delete`, { headers: { Authorization: `Bearer ${accessToken}` } })
                .then((res) => {
                    const updatedComments = selectedTask.comments.filter(comment => comment._id != res.data);
                    const updatedTasks = group.tasks.map(task =>
                        task._id == selectedTask._id ? { ...task, comments: updatedComments } : task
                    );
                    const updatedGroup = { ...group, tasks: [...updatedTasks] };
                    setSelectedTask({ ...selectedTask, comments: [...updatedComments] })
                    setGroup(updatedGroup)
                })
                .catch((err) => console.error(err));
        }
    }

    const handleEditComment = async () => {

        await axios.put(`${groups_API}/${groupId}/tasks/${selectedTask?._id}/comments/${comment._id}/edit`, { content: newComment }, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((res) => {
                const newComment = res.data.tasks.find(task => task._id == selectedTask?._id).comments?.find(c => c._id == comment._id)
                const updatedComments = selectedTask.comments.map(st =>
                    st._id == comment._id ? { ...st, content: newComment?.content } : st
                );
                setSelectedTask({ ...selectedTask, comments: [...updatedComments] })
                setGroup(res.data)
            })
            .catch((err)=>{console.log(err);})


    }
    return (
        <Row className='d-flex justify-content-start my-1'>
            <Col md={1}>
                <Image className='w-100' src={"https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"}></Image>
            </Col>
            <Col md={11} className='d-flex justify-content-between'>
                <strong className=''>{groupMembers?.find(member => member.id == comment?.user)?.name}</strong>
                <em className='fw-lighter ms-3'>{new Date(comment.updatedAt).toLocaleDateString('vi-VN')}</em>
            </Col>
            <Col md={1}>

            </Col>
            {showEdit == false ?
                <Col md={11}>
                    {comment?.content}
                </Col> :
                <Col md={11}>
                    <input type='text' name='comments' rows={4} cols={100}
                        placeholder='...Add a comment' className='  border border-secondary-subtle'
                        value={newComment}
                        onChange={(e) => { setNewComment(e.target.value) }}
                        required>

                    </input>
                </Col>
            }
            {comment?.user == user._id &&
                <Row>

                    {showEdit == false ?
                        <Row>
                            <Col md={1}></Col>
                            <Col md={1}>
                                <a className='text-dark fw-semibold item-hover' onClick={() => { setShowEdit(true) }}>Edit</a>
                            </Col>


                            <Col md={1}>
                                <a className='text-dark fw-semibold item-hover' onClick={() => handleRemoveComment()}>Delete</a>
                            </Col>
                        </Row> :
                        <Row className='d-flex justify-content-between'>
                            <Col md={1}></Col>
                            <Col md={7}></Col>
                            <Col md={4}>
                                <Button className='col-md-5 m-1 p-1 btn-secondary' onClick={() => { setNewComment(comment?.content); setShowEdit(false) }}>Cancel</Button>
                                <Button className='col-md-5 m-1 p-1 ' onClick={() => { handleEditComment(); setShowEdit(false) }} >Save</Button>
                            </Col>
                        </Row>}
                </Row>}
        </Row>
    )
}

export default GroupComment
