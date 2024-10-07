import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
function CreateGroup() {
    const SignupSchema = Yup.object().shape({
            groupName:Yup.string().
            required('Required'),

            groupCode:Yup.string()
            .required('Required'),

            groupPassword:Yup.string()
            .required('Required'),

    });
    return (
        <Container fluid>
            
            <Row>
                <Col md={5} className='d-flex flex-column justify-content-center'>
                    <Formik 
                        initialValues={{
                            groupName: '',
                            groupCode: '',
                            groupPassword: ''
                        }}
                        validationSchema={SignupSchema}
                    >
                        <Form className="col-md-10 align-self-center ">

                            <h3 className='text-center'>CREATE GROUP</h3>
                            <hr />
                            <div className='form-group my-3'>
                                <label htmlFor="fullname" className='form-label'>Group name</label>
                                <Field id="groupName" name="groupName" placeholder="Enter group name..." className="form-control" />
                                <p className='text-danger fw-bolder'><ErrorMessage name="groupName" /></p>
                            </div>
                            <div className='form-group my-3'>
                                <label htmlFor="groupCode" className='form-label'>Group code</label>
                                <Field id="groupCode" name="groupCode" placeholder="Enter group code..." className="form-control" />
                                <p className='text-danger fw-bolder'><ErrorMessage name="groupCode" /></p>
                            </div>
                            <div className='form-group my-3'>
                                <label htmlFor="groupPassword" className='form-label'> Group password </label>
                                <Field id="groupPassword" name="groupPassword" placeholder="Enter group password..." className="form-control" />
                                <p className='text-danger fw-bolder'><ErrorMessage name="groupPassword" /></p>
                            </div>
                            <Button type='submit' className=' btn-membership w-100 btn-lg rounded-0 border-0 '>Create   </Button>
                        </Form>
                    </Formik>
                </Col>
                <Col md={7} className='creat-group-image vh-95'>

                </Col>
            </Row>
        </Container>
    )
}

export default CreateGroup
