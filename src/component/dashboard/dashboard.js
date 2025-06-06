import {useEffect, useState} from "react";
import { Tooltip, Input, Modal, Button, ConfigProvider, Form, Table , Popconfirm  } from "antd";
import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from 'axios';
import Notification from "../features/notification";

export default function Dashboard(){


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [blogData, setBlogData] = useState("");
    const [updateBlogId, setUpdateBlogId] = useState("");
    const [updateTitle, setUpdateTitle] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState();
    const [tableLoading, setTableLoading]=useState(false)
    const [loading, setLoading]=useState(false)
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);


    const blogGetApi="https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/get-blogs"
    const blogUpdateApi="https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/update"
    const blogPostApi="https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/post"
    const blogDeleteApi="https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/delete"
    
    const handleNewBlog=()=>{
        setIsModalOpen(true);
    }
    
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const handleUpdateBlog=(value)=>{
        console.log("Update blogID: ", value)
        setUpdateBlogId(value)
        setIsUpdateModalOpen(true);
    }
    
    const handleUpdateOk = () => {
        setIsUpdateModalOpen(false);
    };

    const handleUpdateCancel = () => {
        setIsUpdateModalOpen(false);
    };





    const { TextArea } = Input;

    let formData=new FormData();
    const onfileChange=(e)=>{
        if(e.target && e.target.files[0]){
            formData.append("File_Name", e.target.files[0])
            console.log(formData)
            setFile(e.target.files[0])
        }
    }

    const getBlogs=()=>{
        setTableLoading(true)
        let email=sessionStorage.getItem("email")
        const params={
            email: email
        }
        axios.post(blogGetApi, params).then((res)=>{
            setBlogData(res.data.body)
            console.log("res", res)
            setTableLoading(false)
        }).catch((err)=>{
            console.log(err)
            setTableLoading(false)
        })
    }

    useEffect(()=>{
        getBlogs()
    },[])

    const handleNewBlogSubmit=()=>{
        setLoading(true)
        let email=sessionStorage.getItem("email")
        console.log("title, description: ", email, title, description)
        const params={
            email: email,
            title: title,
            description: description
          }
        axios.post(blogPostApi, params).then((res)=>{
            console.log(res)
            setMessage('Success!');
            setNotificationDescription('The blog is successfully created');
            setType('success');
            setLoading(false)
            handleCancel()
            getBlogs()
        }).catch((err)=>{
            console.log(err)
            setMessage('Oops! Something went wrong.');
            setNotificationDescription('We were unable to create the blog. Please try again later.');
            setType('error');
            setLoading(false)
        })

        setTitle("")
        setDescription("")
    }

    const handleUpdateBlogSubmit=()=>{
        let email=sessionStorage.getItem("email")
        console.log("title, description: ", email, title, description)
        const params={
            email: email,
            blogId: updateBlogId,
            title: updateTitle,
            description: updateDescription
          }
        axios.post(blogUpdateApi, params).then((res)=>{
            console.log(res)
            setMessage('Success!');
            setNotificationDescription('The blog is successfully updated');
            setType('success');
            handleUpdateCancel()
            getBlogs()
        }).catch((err)=>{
            console.log(err)
            setMessage('Oops! Something went wrong.');
            setNotificationDescription('We were unable to update the blog. Please try again later.');
            setType('error');
        })
    }


    const handleBlogDelete=(record)=>{
        let email=sessionStorage.getItem("email")
        const params={
            email:email,
            blogId: record
        }

        axios.delete(blogDeleteApi, {
            data: params
        }).then((res)=>{
            console.log(res)
            setMessage('Success!');
            setNotificationDescription('The blog is successfully deleted');
            setType('success');
            getBlogs()
        }).catch((err)=>{
            console.log(err)
            setMessage('Oops! Something went wrong.');
            setNotificationDescription('We were unable to delete the blog. Please try again later.');
            setType('error');
        })

    }

    const handleBlogFiles=()=>{
        console.log("title, description: ", title, description)
    }


    const columns = [
        { title: 'Blog Title', dataIndex: 'title', key: 'title' },
        { title: 'Blog Description', dataIndex: 'description', key: 'description', align:'center' },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: (text, record) => 

                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={(e)=>handleBlogDelete(text.blogId)}
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger>Delete</Button>
                </Popconfirm>
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) =><Button onClick={(e)=>handleUpdateBlog(text.blogId)} >Update</Button>
        },
    ];


    const onExpand = (expanded, record) => {
        const keys = expanded ? [record.blogId] : [];
        setExpandedRowKeys(keys);
    };

    return (
        <div>
            <Notification type={type} message={message} description={notificationDescription} />
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                footer={[
                <ConfigProvider
                    theme={{                                                    // To change color of antd buttons
                    token: {
                        colorPrimary: '#a51d4a',
                        borderRadius: 6,
                        colorBgContainer: 'white',
                    },
                    }}
                >
                    <Button type="primary" loading={loading} onClick={handleNewBlogSubmit}>
                        Save 
                    </Button>
                </ConfigProvider>
                ]}
            >
                <div style={{textAlign:'center', fontSize:'20px', fontWeight:'bold'}}>Create Blog</div> <br/>
                
                <Form>
                    <Form.Item name="title" label="Title">
                        <div style={{display:'flex'}}>                  
                        <Input 
                            onChange={(event) => {
                                setTitle(event.target.value);
                            }}
                        />
                        <Tooltip placement="top" title="Enter Blog Title" >
                            <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                            <IoMdInformationCircleOutline/>
                            </span>
                        </Tooltip>
                        </div>
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <div style={{display:'flex'}}>
                        <TextArea rows={4} 
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                        <Tooltip style={{whiteSpace: 'pre-line'}} placement="top" title="Enter Blog Description" >
                            <span style={{cursor:'pointer',  marginLeft:'10px',fontSize:'20px'}}>
                            <IoMdInformationCircleOutline/>
                            </span>
                        </Tooltip>
                        </div>
                    </Form.Item>
                    <Form.Item name="blogimage" label="Image">
                        
                        <div style={{display:'flex', marginTop:'5px'}}>
                            <Tooltip style={{whiteSpace: 'pre-line', marginTop:'5px'}} placement="top" title="Upload blog image in jpg/png format" >
                                <span style={{cursor:'pointer',  marginLeft:'10px',fontSize:'20px'}}>
                                <IoMdInformationCircleOutline/>
                                </span>
                            </Tooltip>
                            <input style={{marginLeft:"10px", marginTop:'5px'}} onChange={(e)=> onfileChange(e)} type="file" />

                        </div>
                    </Form.Item>
                </Form>

            </Modal>




            <Modal open={isUpdateModalOpen} onOk={handleUpdateOk} onCancel={handleUpdateCancel}
                footer={[
                <ConfigProvider
                    theme={{                                                    // To change color of antd buttons
                    token: {
                        colorPrimary: '#a51d4a',
                        borderRadius: 6,
                        colorBgContainer: 'white',
                    },
                    }}
                >
                    <Button type="primary" loading={loading} onClick={handleUpdateBlogSubmit}>
                        Save update
                    </Button>
                </ConfigProvider>
                ]}
            >
                <div style={{textAlign:'center', fontSize:'20px', fontWeight:'bold'}}>Update Blog</div> <br/>
                
                <Form>
                    <Form.Item name="title" label="Title">
                        <div style={{display:'flex'}}>                  
                        <Input 
                            onChange={(event) => {
                                setUpdateTitle(event.target.value);
                            }}
                        />
                        <Tooltip placement="top" title="Enter Blog Title" >
                            <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                            <IoMdInformationCircleOutline/>
                            </span>
                        </Tooltip>
                        </div>
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <div style={{display:'flex'}}>
                        <TextArea rows={4} 
                            onChange={(event) => {
                                setUpdateDescription(event.target.value);
                            }}
                        />
                        <Tooltip style={{whiteSpace: 'pre-line'}} placement="top" title="Enter Blog Description" >
                            <span style={{cursor:'pointer',  marginLeft:'10px',fontSize:'20px'}}>
                            <IoMdInformationCircleOutline/>
                            </span>
                        </Tooltip>
                        </div>
                    </Form.Item>
                    <Form.Item name="blogimage" label="Image">
                        
                        <div style={{display:'flex', marginTop:'5px'}}>
                            <Tooltip style={{whiteSpace: 'pre-line', marginTop:'5px'}} placement="top" title="Upload blog image in jpg/png format" >
                                <span style={{cursor:'pointer',  marginLeft:'10px',fontSize:'20px'}}>
                                <IoMdInformationCircleOutline/>
                                </span>
                            </Tooltip>
                            <input style={{marginLeft:"10px", marginTop:'5px'}} onChange={(e)=> onfileChange(e)} type="file" />

                        </div>
                    </Form.Item>
                </Form>

            </Modal>









            <div>
                <h1 style={{textAlign:'center'}}>Welcome to Your Dashboard!</h1>
                
                <div>
                    <section>
                        <h2 style={{
                        fontSize: '1.5em',
                        display:'flex',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '15px',
                        borderBottom: '2px solid #ccc',
                        paddingBottom: '5px',
                        }}>
                            <p style={{marginLeft:"2%"}}>Published Blogs</p> 
                            <ConfigProvider
                                theme={{                                                   
                                    token: {
                                    colorPrimary: '#a51d4a',
                                    borderRadius: 6,
                                    colorBgContainer: 'white',
                                    },
                                }}
                                >
                                <Button onClick={handleNewBlog} variant="filled" style={{marginLeft:'75%', marginTop:'20px'}}>
                                    Create New Blog
                                </Button>
                            </ConfigProvider>
                        </h2>
                    </section>

                </div>
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                        rowExpandable: record => true,
                        expandedRowKeys: expandedRowKeys,
                        onExpand: onExpand,
                    }}
                    dataSource={blogData}
                    bordered
                    loading={tableLoading}
                    style={{ margin: '20px' }}
                    rowKey="blogId"
                />
            </div>


        </div>
    )
}