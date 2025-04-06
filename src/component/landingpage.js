import React, { useState, useContext } from "react";
import { FaUserTie  } from "react-icons/fa";
import { TbPasswordUser  } from "react-icons/tb";
import './landingpage.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Tooltip, Input, Modal, Button, ConfigProvider, Form, } from "antd";
import { FaUserPlus } from "react-icons/fa6";
import Notification from "./features/notification";
import axios from 'axios';
import logo from '../assets/cloudxsuite_logo.png'
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ newPassword, setNewPassword] = useState("");
  const [ confirmPassword, setConfirmPassword] = useState("");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType]=useState("")
  const [message, setMessage]=useState("")
  const [description, setDescription]=useState("")
  const [file, setFile] = useState();

  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();

  const passwordPolicy = {
    minLength: 8,
    hasUppercase: true,
    hasLowercase: true,
    hasNumber: true,
    hasSymbol: true,
  };

  const validatePassword = (_, value) => {
    if (!value) {
      setIsValid(true); // Don't show error if field is empty
      return Promise.resolve();
    }

    const { minLength, hasUppercase, hasLowercase, hasNumber, hasSymbol } = passwordPolicy;

    let valid = true;

    if (value.length < minLength) valid = false;
    if (hasUppercase && !/[A-Z]/.test(value)) valid = false;
    if (hasLowercase && !/[a-z]/.test(value)) valid = false;
    if (hasNumber && !/[0-9]/.test(value)) valid = false;
    if (hasSymbol && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) valid = false;

    setIsValid(valid);

    if (valid) {
      return Promise.resolve();
    } else {
      return Promise.reject('Password does not meet criteria.');
    }
  };

  const tooltipContent = (
    <div>
      <p>Password must meet the following criteria:</p>
      <ul>
        <li>Minimum length: {passwordPolicy.minLength}</li>
        {passwordPolicy.hasUppercase && <li>Contains an uppercase letter</li>}
        {passwordPolicy.hasLowercase && <li>Contains a lowercase letter</li>}
        {passwordPolicy.hasNumber && <li>Contains a number</li>}
        {passwordPolicy.hasSymbol && <li>Contains a symbol (@ # $)</li>}
      </ul>
      {!isValid && <p style={{ color: 'red' }}>Password does not meet criteria.</p>}
    </div>
  );

  let formData=new FormData();
  const onfileChange=(e)=>{
      if(e.target && e.target.files[0]){
          formData.append("File_Name", e.target.files[0])
          console.log(formData)
          setFile(e.target.files[0])
      }
  }

  const handleSignup=()=>{
    setIsModalOpen(true);
  }

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setType('');
    setLoginLoading(true);
    if(username==="" || password===""){
      setMessage('Missing Credentials')
      setDescription(`It looks like you're missing either your email or password. Please double-check and try again.`)
      setType('warning')
      setLoginLoading(false);
    }
    else{
      axios.post("https://0d7ti9fw58.execute-api.us-east-1.amazonaws.com/vega_signin/validate-login-user",{
        email: username,
        password: password
      }).then((res)=>{
        console.log("response", res)
        setLoginLoading(false);
        if(res.data.statusCode===200){
          localStorage.setItem("email", res.data.email)
          navigate("/dashboard");
        }else{
          setMessage('Login Failed')
          setDescription(`The email or password you entered is incorrect. Please try again.`)
          setType('error')
          setLoginLoading(false);
        }
        
      }).catch((err)=>{
        console.log("error: ", err)
        setMessage('Login Failed')
        setDescription(`The email or password you entered is incorrect. Please try again.`)
        setType('error')
        setLoginLoading(false);
      })
    }
  };

  const handleSignupSubmit = async(e) => {
    e.preventDefault();
    setType('');
    console.log("Signup", name, email, newPassword, confirmPassword)
    setLoading(true);
    if(email==="" || newPassword==="" || confirmPassword ==="" || !isValid){
      
      setMessage('Missing Required Information')
      setDescription(`Please complete all the necessary information to finish your registration. Additionally, your password must adhere to the policy described in 'i' button.`)
      setType('warning')
      setLoading(false);
    }
    else{
      axios.post("https://hy8c9rkyw8.execute-api.us-east-1.amazonaws.com/blog/signup",{
        email: email,
        password: newPassword
      }).then((res)=>{
        console.log("response", res)
        setMessage('Signup Successful!')
        setDescription('Welcome to Blog platform! You can now log in and explore.')
        setType('success')
        setLoginLoading(false);
      }).catch((err)=>{
        console.log("error: ", err)
        setMessage('Signup Failed')
        setDescription('An unexpected error occurred. Please try again later.')
        setType('error')
        setLoading(false);
      })
      setIsModalOpen(false);
    }
  };


  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  

  return (
    <div>

      {/* Navbar and Signup */}

      <div style={{display:'flex', backgroundColor:'#EBE8DB'}}>

        {/* Navbar starts */}


        <div style={{display:'flex'}}>
          <span>
            <img src={logo} style={{height:'50px', width:'60px', marginLeft:'90%',}} />
          </span>
          <span style={{marginLeft:'60px', marginTop:'9px', fontSize:'20px', fontWeight:'bold'}}>
              Blog Platform
          </span>
        </div>


        {/* Navbar ends */}

        {/* Signup starts */}


        <div
            onClick={handleSignup}
            style={{
                paddingTop:'5px',
                color:'black',
                cursor:'pointer',
                fontSize:'25px',
                textAlign:'center',
                marginLeft:'75%',
                marginTop:'5px',
                borderRadius:'70px', 
                marginBottom:'14px'
            }}
        >
            <Tooltip title="New here? Sign up to enjoy full functionality and save your work." placement="bottom">
                <span onClick={handleSignup}>
                  <FaUserPlus  />
                </span>
            </Tooltip>
        </div>

        {/* Create account form starts */}

        <div>
          <Notification type={type} message={message} description={description} />
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
                <Button type="primary" loading={loading} onClick={handleSignupSubmit}>
                  Submit
                </Button>
              </ConfigProvider>
            ]}
          >
            <div style={{textAlign:'center', fontSize:'20px', fontWeight:'bold'}}>Sign up</div> <br/>
            <Form
             {...formItemLayout}
              form={form}
              onFinish={handleSignupSubmit}
              name="register"
            >
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <div style={{display:'flex'}}>                  
                  <Input 
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                  <Tooltip placement="top" title="Enter Email ID" >
                    <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                      <IoMdInformationCircleOutline/>
                    </span>
                  </Tooltip>
                </div>
              </Form.Item>
              <Form.Item
                  name="password"
                  label="Password"
                  
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                    {
                      validator: validatePassword,
                    },
                  ]}
                  hasFeedback
              >
                <div style={{display:'flex'}}>
                  <Input.Password
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                      }}
                  />
                  <Tooltip style={{whiteSpace: 'pre-line'}} placement="top" title={tooltipContent} >
                    <span style={{cursor:'pointer',  marginLeft:'10px',fontSize:'20px'}}>
                      <IoMdInformationCircleOutline/>
                    </span>
                  </Tooltip>
                </div>
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The new password that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <div style={{display:'flex'}}>
                  <Input.Password  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}/>
                  <Tooltip placement="top" title="Please re-enter your password!" >
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
          
        </div>
        {/* Create account form ends */}


        {/* Signup ends */}
        
      </div>

      {/* Landing page information starts */}


      <div style={{ overflowX: "hidden", minHeight:'91.5vh', backgroundColor:'#EBE8DB', height:'100%', width: "100%" }}>
        <div style={{ display: "flex", backgroundColor:'white', borderRadius:'30px', marginLeft:'30px', marginRight:'30px', marginTop:'3%', height:'500px', boxShadow: '0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%)'}}>
          
          
          <div
            style={{
              width: "50%",
              textAlign: "justify",
              marginLeft: "60px",
              marginTop: "2%",
              marginRight: "20px",
              fontSize: "20px",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#a51d4a", marginBottom:'60px', fontSize:'40px' }}>  
              Blog Platform
            </div>
            <span style={{ fontWeight: "bold", color: "#a51d4a" }}>
              {" "}

              
            </span>{" "}
          
                This application provides a robust foundation for managing users and their published content. Key functionalities include user authentication, profile image handling, and full CRUD operations for blog posts.
              <br/>
              <br/>
              <br/>
          
          </div>

          {/* Login form starts */}

          <div style={{ width: "50%" }}>
            <form
              style={{ width: "100%", marginTop: "20%", marginLeft: "5%" }}
              onSubmit={handleSubmit}
            >
              <div className="input-container">
                <span style={{ fontSize: "30px", marginRight:'1%', color:'#a51d4a' }}>
                  <FaUserTie  />
                </span>
                <Input
                  className="input-field"
                  type="text"
                  width={400}
                  placeholder="Email ID"
                  name="usrnm"
                  value={username}
                  required
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
                <Tooltip placement="top" title="Enter Email ID" >
                  <span style={{cursor:'pointer', marginTop:'10px', marginLeft:'10px',fontSize:'20px'}}>
                    <IoMdInformationCircleOutline/>
                  </span>
                </Tooltip>
              </div>
              <br/>
              <div className="input-container">
                <span style={{ fontSize: "30px", color:'#a51d4a' }}>
                  <TbPasswordUser  />
                </span>
                <Input.Password
                  style={{ marginLeft: "2%" }}
                  className="input-field"
                  type="password"
                  value={password}
                  placeholder="Password"
                  name="psw"
                  required
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Tooltip placement="top" title="Enter Password" >
                  <span style={{cursor:'pointer', marginTop:'10px', marginLeft:'10px',fontSize:'20px'}}>
                    <IoMdInformationCircleOutline/>
                  </span>
                </Tooltip>
              </div>

              <div style={{ display: "flex",marginTop:'5%' }}>

                  <ConfigProvider
                    theme={{                                                    // To change color of antd buttons
                      token: {
                        colorPrimary: '#a51d4a',
                        borderRadius: 6,
                        colorBgContainer: 'white',
                      },
                    }}
                  >
                    <Button onClick={handleSubmit} variant="filled" loading={loginLoading} style={{marginRight:'10px'}}>
                      Login
                    </Button>
                  </ConfigProvider>
              </div>
            </form>
          </div>

          {/* Login form end */}

        </div>

      </div>
    </div>
  );
}
