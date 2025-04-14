import React from "react";
import './navbar.css';
import { useLocation } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Menu, Divider } from "@aws-amplify/ui-react";
import logo from '../../assets/cloudxsuite_logo.png'


export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="loginNavbar">
    {
        location.pathname !=="/" && (
        <div style={{display:'flex'}}>
            <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                <span>
                    <img src={logo} style={{ height: '50px', width: '60px', marginLeft: '10px' }} alt="Logo" />
                </span>
                <span style={{ marginLeft: '10px', fontSize: '25px', fontWeight: 'bold' }}>
                    ConnectCloud Blogs
                </span>
            </div>
            <div style={{marginLeft:'75vw'}}>
                <Menu
                style={{
                    cursor: 'pointer',
                    marginTop: '5px',
                    marginRight: '10px',
                }}
                trigger={
                    <div
                    style={{
                        color: 'black',
                        cursor: 'pointer',
                        marginTop: '5px',
                        marginBottom: '1px',
                        display: 'flex',
                    }}
                    >
                        {console.log("Image", localStorage.getItem("profilePicture"))}
                        {
                            localStorage.getItem("profilePicture") ?
                                <img src={localStorage.getItem("profilePicture")} style={{height:'80%', width:'50%', borderRadius:'30px'}} /> :
                                <img src={UserOutlined} style={{height:'80%', width:'50%', borderRadius:'30px'}} />
                        }
                    </div>
                }
                >
                <div style={{
                    backgroundColor: 'white', // Menu Content background
                    border: '2px solid black', // Menu Content border
                    borderRadius: '10px',
                    padding: '10px',
                    width:'200px'
                }}>
                    <p
                    style={{
                        cursor: 'default',
                        color: 'black',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                        marginTop: '2%',
                        fontSize: '15px',
                    }}
                    >
                    {localStorage.getItem("email")}
                    </p>

                </div>
                </Menu>
            </div>
        </div>
        )
    }
    </nav>
  );
}