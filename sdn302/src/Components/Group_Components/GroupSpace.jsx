import React, { useContext, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import GroupColumn from './GroupColumn'
import { FaPlus } from 'react-icons/fa'
import { IoCheckmark } from 'react-icons/io5'
import { IoMdClose } from 'react-icons/io'
import { AppContext } from '../../Context/AppContext'
import axios from 'axios'

function GroupSpace() {
    const {groups_API,group,setGroup,accessToken,currentUserRole,setCurrentUserRole} = useContext(AppContext);
    const [newColumn,setNewColumn] = useState("");

    const [addColumn, setAddColumn] = useState(false)
    const [showUpgrade, setShowUpgrade] = useState(false)

    const handleAddColumn = async ()=>{
        if(currentUserRole?.groupRole!="viewer"){
            if(group.isPremium == false && group.classifications.length >=5){
                window.alert("You must upgrade group!")
            }else{
                if(newColumn!=""){
                    await axios.post(`${groups_API}/${group._id}/create-column`,{newColumn : newColumn}, { headers: { Authorization: `Bearer ${accessToken}` } })
                    .then((res)=>setGroup(res.data))
                    .catch((err)=>console.log(err))
                
                }else{
                    window.alert("You must enter column name!")
                }
            }
        }else{
            window.alert("You must be group member to add new column!")
        }

    }
    return (
        <Container fluid className='overflow-auto vh-83'>

            <Row className='flex-nowrap mt-3 ms-2'>
                {group?.classifications?.map((column)=>{
                    return <Col md={3} className='mx-2 background-color-secondary'><GroupColumn column={column} /></Col>
                })}
                <Col md={3} className='mx-2 '>
                    {addColumn == false ? <p className='m-0 p-2 background-color-third background-hover' onClick={() => setAddColumn(true)}><FaPlus />  Add another list</p> :
                        <Row className='d-flex rounded p-2 justify-content-between background-color-third shadow'>
                            <Col md={8}>
                                <input type="text" name='columnName' className='w-100 m-0'
                                 onChange={(e)=>{setNewColumn(e.target.value)}}  required/>
                                </Col>
                            <Col md={2} className='background-hover bg-white  border border-1 border-black' onClick={() => { setAddColumn(false); handleAddColumn() }}><IoCheckmark /></Col>

                            <Col md={2} className='background-hover bg-white  border border-1 border-black' onClick={() => { setAddColumn(false) }}><IoMdClose /></Col>

                        </Row>}
                </Col>

            </Row>
        </Container>
    )
}

export default GroupSpace
