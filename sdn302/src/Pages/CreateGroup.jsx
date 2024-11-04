import React, { useContext, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';

function CreateGroup() {
    const navigate = useNavigate();
    const { groups_API, setGroups } = useContext(AppContext);
    const [message, setMessage] = useState({ type: null, text: '' });

    // Validation schema
    const SignupSchema = Yup.object().shape({
        groupName: Yup.string()
            .required('Required')
            .min(3, 'Group name must be at least 3 characters')
            .max(15, 'Group name cannot exceed 15 characters'),
    });

    // Check if group name already exists
    const checkGroupExistence = async (values) => {
        try {
            const response = await axios.post(`${groups_API}/check-existence`, { groupName: values.groupName });
            return response.data; // Expecting { groupNameExists: boolean }
        } catch (error) {
            console.error("Error checking group existence:", error);
            throw new Error('Unable to check group existence.');
        }
    };
    
    const handleSubmit = async (values, { setErrors, setSubmitting }) => {
        setSubmitting(true);
        try {
            // Check if the group name already exists
            const existenceCheck = await checkGroupExistence(values);
            const { groupNameExists } = existenceCheck;

            // Set errors if the group name exists
            if (groupNameExists) {
                setErrors({ groupName: 'Group name already exists.' });
                setSubmitting(false);
                return;
            }

            // If it doesn't exist, create the group
            const response = await axios.post(`${groups_API}/create`, values, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const joinedGroup = response.data.group;

            // Only navigate and update groups if the group is created successfully
            if (joinedGroup) {
                console.log("Group created successfully:", response.data);
                setGroups((prevGroups) => [...prevGroups, joinedGroup]); // Add the new group to setGroups
                navigate(`/groups/${joinedGroup._id}`);
            } else {
                setErrors({ general: 'Group creation failed. Please try again.' });
            }
        } catch (error) {
            console.error("Error creating group:", error);
            if (error.response) {
                const { message } = error.response.data;
                setErrors({ general: message || 'An error occurred. Please try again.' });
            } else {
                setErrors({ general: 'An error occurred. Please try again.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={5} className='d-flex flex-column justify-content-center'>
                    <Formik
                        initialValues={{
                            groupName: '',
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, isSubmitting }) => (
                            <Form className="col-md-10 align-self-center">
                                <h3 className='text-center'>CREATE GROUP</h3>
                                <hr />
                                <div className='form-group my-3'>
                                    <label htmlFor="groupName" className='form-label'>Group name</label>
                                    <Field id="groupName" name="groupName" placeholder="Enter group name..." className="form-control" />
                                    <p className='text-danger fw-bolder'>
                                        <ErrorMessage name="groupName" />
                                    </p>
                                </div>
                                {errors.general && <p className='text-danger fw-bolder'>{errors.general}</p>}
                                <Button type='submit' className='btn-membership w-100 btn-lg rounded-0 border-0' disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
                <Col md={7} className='creat-group-image vh-95'></Col>
            </Row>
            {message.text && (
                <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
                    {message.text}
                </div>
            )}
        </Container>
    );
}

export default CreateGroup;
