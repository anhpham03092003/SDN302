import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import IndividualColumn from './IndividualColumn'
import { FaPlus } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { AppContext } from '../../Context/AppContext'
import axios from 'axios';

function IndividualSpace() {
    const [userInfo, setUserInfo] = useState(null);
    const token = localStorage.getItem('token');
    const [showTempColumn, setShowTempColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get('http://localhost:9999/users/get-profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };
    
    useEffect(() => {
        if (token) {
            
            fetchUserInfo();
        }
    }, [token]);
    // Hàm xử lý hiển thị cột tạm thời
    const handleAddColumn = () => {
        setShowTempColumn(true); // Hiển thị cột tạm thời khi nhấn nút
    };
   
    // Hàm xử lý khi lưu cột mới
    const handleSaveColumn = async () => {
        if (newColumnName) {
            try {
                await axios.post(
                    'http://localhost:9999/users/add-classification',
                    { classification: newColumnName },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUserInfo(prev => ({
                    ...prev,
                    classifications: [...prev.classifications, newColumnName],
                }));
                setNewColumnName('');
                
                setShowTempColumn(false); 
                await fetchUserInfo();
            } catch (error) {
                console.error('Error adding new column:', error);
            }
        }
    };

    // Hàm xử lý khi hủy thêm cột
    const handleCancel = () => {
        setNewColumnName('');
        setShowTempColumn(false);
    };

    const updateColumnName = (oldName, newName) => {
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            classifications: prevUserInfo.classifications.map(col => (col === oldName ? newName : col))
        }));
    };

    const sortedClassifications = userInfo ? [...userInfo.classifications] : [];
    const otherIndex = sortedClassifications.indexOf("other");
    
    if (otherIndex > -1) {
        sortedClassifications.splice(otherIndex, 1); 
        sortedClassifications.push("other"); 
    }
    
    return (
        <Container fluid className='vh-83'>

            {sortedClassifications.reduce((rows, column, index) => {
                if (index % 3 === 0) rows.push([]);
                rows[rows.length - 1].push(column);
                return rows;
            }, []).map((row, rowIndex) => (
                <Row className='flex-nowrap mt-3 ms-2' key={rowIndex}>
                    {row.map((column, colIndex) => (
                        <Col md={3} className='mx-2 background-color-secondary' key={`${column}-${colIndex}` }>
                            <IndividualColumn column={column} updateColumnName={updateColumnName} onDataChange={fetchUserInfo} />
                        </Col>
                    ))}

                    {/* Chỉ thêm ô 'Add another list' ở hàng đầu tiên */}
                    {rowIndex === 0 && (
                        <Col md={3} className='mx-2 '>
                            {!showTempColumn ? (
                                <p 
                                    className='p-2 background-color-third background-hover' 
                                    onClick={handleAddColumn}
                                >
                                    <FaPlus /> Add another list
                                </p>
                            ) : (
                                <div className='p-2 background-color-third'>
                                    <input
                                        type="text"
                                        className="w-100 mb-2"
                                        placeholder="Enter column name"
                                        value={newColumnName}
                                        onChange={(e) => setNewColumnName(e.target.value)}
                                        required
                                    />
                                    <Row>
                                        <Col xs={6}>
                                            <button
                                                className='btn btn-primary w-100'
                                                onClick={handleSaveColumn}
                                            >
                                                Save
                                            </button>
                                        </Col>
                                        <Col xs={6}>
                                            <button
                                                className='btn btn-secondary w-100'
                                                onClick={handleCancel}
                                            >
                                                <IoMdClose /> Cancel
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Col>
                    )}
                </Row>
            ))}
        </Container>
    )
}

export default IndividualSpace
