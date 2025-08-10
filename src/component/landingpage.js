import React, { useState, useCallback, useMemo, useEffect } from "react";
import { FaUserTie } from "react-icons/fa";
import { TbPasswordUser } from "react-icons/tb";
import './landingpage.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Tooltip, Input, Modal, Button, ConfigProvider, Form, Typography, message } from "antd";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa6";
import { MdCloudUpload } from "react-icons/md";
import Notification from "./features/notification";
import axios from 'axios';
import logo from '../assets/cloudxsuite_logo.png';
import { useNavigate } from "react-router-dom";
import copy from 'copy-text-to-clipboard';


// Custom hooks for better state management
const useAuthState = () => {
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return {
    loading, setLoading,
    loginLoading, setLoginLoading,
    username, setUsername,
    password, setPassword,
    showPassword, setShowPassword
  };
};

const useSignupState = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);

  return {
    name, setName,
    email, setEmail,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    isModalOpen, setIsModalOpen,
    file, setFile,
    isValid, setIsValid,
    loading, setLoading
  };
};


const useNotificationState = () => {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [emailCopied, setEmailCopied] = useState('');
  const [passwordCopied, setPasswordCopied] = useState('');

  return {
    type, setType,
    message, setMessage,
    description, setDescription,
    emailCopied, setEmailCopied,
    passwordCopied, setPasswordCopied
  };
};

// Modern theme configuration
const modernTheme = {
  token: {
    colorPrimary: '#6366f1',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 12,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    controlHeight: 44,
    fontSize: 14,
  },
  components: {
    Button: {
      borderRadius: 12,
      fontWeight: 600,
      controlHeight: 44,
    },
    Input: {
      borderRadius: 12,
      paddingBlock: 12,
      paddingInline: 16,
    },
    Modal: {
      borderRadius: 20,
    },
    Form: {
      labelFontSize: 14,
      labelColor: '#374151',
      labelFontWeight: 600,
    },
  },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Text } = Typography;

  // Custom hooks
  const authState = useAuthState();
  const signupState = useSignupState();
  const notificationState = useNotificationState();

  // API endpoints
  const API_ENDPOINTS = useMemo(() => ({
    signin: "https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/signin",
    signup: "https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/signup",
    imageUpload: "https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/get-presigned-url"
  }), []);

  // Password policy
  const passwordPolicy = useMemo(() => ({
    minLength: 8,
    hasUppercase: true,
    hasLowercase: true,
    hasNumber: true,
    hasSymbol: true,
  }), []);

  // Password validation
  const validatePassword = useCallback((_, value) => {
    if (!value) {
      signupState.setIsValid(true);
      return Promise.resolve();
    }

    const { minLength, hasUppercase, hasLowercase, hasNumber, hasSymbol } = passwordPolicy;
    let valid = true;

    if (value.length < minLength) valid = false;
    if (hasUppercase && !/[A-Z]/.test(value)) valid = false;
    if (hasLowercase && !/[a-z]/.test(value)) valid = false;
    if (hasNumber && !/[0-9]/.test(value)) valid = false;
    if (hasSymbol && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) valid = false;

    signupState.setIsValid(valid);
    return valid ? Promise.resolve() : Promise.reject('Password does not meet criteria.');
  }, [passwordPolicy, signupState]);

  // Tooltip content for password policy
  const tooltipContent = useMemo(() => (
    <div className="password-tooltip">
      <p className="tooltip-title">Password must meet the following criteria:</p>
      <ul className="password-requirements">
        <li className={signupState.newPassword.length >= passwordPolicy.minLength ? 'requirement-met' : ''}>
          Minimum length: {passwordPolicy.minLength}
        </li>
        <li className={/[A-Z]/.test(signupState.newPassword) ? 'requirement-met' : ''}>
          Contains an uppercase letter
        </li>
        <li className={/[a-z]/.test(signupState.newPassword) ? 'requirement-met' : ''}>
          Contains a lowercase letter
        </li>
        <li className={/[0-9]/.test(signupState.newPassword) ? 'requirement-met' : ''}>
          Contains a number
        </li>
        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(signupState.newPassword) ? 'requirement-met' : ''}>
          Contains a symbol (@ # $ etc.)
        </li>
      </ul>
      {!signupState.isValid && (
        <p className="password-error">Password does not meet criteria.</p>
      )}
    </div>
  ), [signupState.newPassword, signupState.isValid, passwordPolicy]);

  // File upload handler
  const handleFileChange = useCallback((e) => {
    if (e.target && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
      if (!validTypes.includes(file.type)) {
        message.error('Please upload a valid image file (JPG, JPEG, PNG)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        message.error('File size must be less than 5MB');
        return;
      }
      
      signupState.setFile(file);
    }
  }, [signupState]);

  // Login handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    notificationState.setType('');
    authState.setLoginLoading(true);

    if (!authState.username || !authState.password) {
      notificationState.setMessage('Missing Credentials');
      notificationState.setDescription("It looks like you're missing either your email or password. Please double-check and try again.");
      notificationState.setType('warning');
      authState.setLoginLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.signin, {
        email: authState.username,
        password: authState.password
      });

      if (response.data.statusCode === 200) {
        sessionStorage.setItem("email", response.data.email);
        sessionStorage.setItem("token", response.data.body);
        sessionStorage.setItem("profilePicture", response.data.filePath);
        navigate("/dashboard");
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      notificationState.setMessage('Login Failed');
      notificationState.setDescription('The email or password you entered is incorrect. Please try again.');
      notificationState.setType('error');
    } finally {
      authState.setLoginLoading(false);
    }
  }, [authState, notificationState, API_ENDPOINTS, navigate]);

  // Signup handlers
  const handleSignup = useCallback(() => {
    signupState.setIsModalOpen(true);
  }, [signupState]);

  const handleSignUpImages = useCallback(async () => {
    if (signupState.file) {
      try {
        const response = await axios.post(API_ENDPOINTS.imageUpload, {
          email: signupState.email,
          filename: signupState.file.name,
          contentType: signupState.file.type
        });

        await axios.put(response.data.presignedUrl, signupState.file, {
          headers: { "Content-Type": signupState.file.type },
        });

        handleSignupSubmit(response.data.filePath);
      } catch (error) {
        console.error("Image upload error:", error);
        handleSignupSubmit(null);
      }
    } else {
      handleSignupSubmit(null);
    }
  }, [signupState, API_ENDPOINTS]);

  const handleSignupSubmit = useCallback(async (filePath) => {
    notificationState.setType('');
    signupState.setLoading(true);

    if (!signupState.email || !signupState.newPassword || !signupState.confirmPassword || !signupState.isValid) {
      notificationState.setMessage('Missing Required Information');
      notificationState.setDescription('Please complete all the necessary information to finish your registration. Additionally, your password must adhere to the policy described.');
      notificationState.setType('warning');
      signupState.setLoading(false);
      return;
    }

    try {
      await axios.post(API_ENDPOINTS.signup, {
        email: signupState.email,
        password: signupState.newPassword,
        filePath: filePath
      });

      notificationState.setMessage('Signup Successful!');
      notificationState.setDescription('Welcome to ConnectCloud Blogs! You can now log in and explore.');
      notificationState.setType('success');
      signupState.setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      notificationState.setMessage('Signup Failed');
      notificationState.setDescription('An unexpected error occurred. Please try again later.');
      notificationState.setType('error');
    } finally {
      signupState.setLoading(false);
    }
  }, [signupState, notificationState, API_ENDPOINTS, form]);

  // Copy handlers
  const handleEmailCopy = useCallback(() => {
    notificationState.setEmailCopied('success');  
    copy('demo@cloudconnect.com');
    setTimeout(() => notificationState.setEmailCopied(''), 2000);
  }, [notificationState]);

  const handlePasswordCopy = useCallback(() => {
    notificationState.setPasswordCopied('success');
    copy('Test@123');
    setTimeout(() => notificationState.setPasswordCopied(''), 2000);
  }, [notificationState]);

  return (
    <ConfigProvider theme={modernTheme}>
      <div className="landing-page">
        {/* Modern Navbar */}
        <nav className="modern-navbar">
          <div className="navbar-content">
            <div className="logo-section">
              <div className="logo-wrapper">
                <img src={logo} alt="ConnectCloud Logo" className="logo-image" />
                <div className="logo-glow"></div>
              </div>
              <div className="brand-text">
                <span className="brand-name">ConnectCloud</span>
                <span className="brand-subtitle">Blogs</span>
              </div>
            </div>

            <div className="navbar-actions">
              <Tooltip title="New here? Sign up to enjoy full functionality and save your work." placement="bottom">
                <button 
                  onClick={handleSignup}
                  className="signup-trigger"
                  aria-label="Sign up for an account"
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="hero-section">
          <div className="hero-container">
            {/* Left Content */}
            <div className="hero-content">
              <div className="hero-header">
                <h1 className="hero-title">ConnectCloud Blogs</h1>
                <div className="hero-gradient"></div>
              </div>
              
              <p className="hero-description">
                This application provides a robust foundation for managing users and their published content. 
                Key functionalities include user authentication, profile image handling, and full CRUD operations for blog posts.
              </p>

              <div className="feature-highlights">
                <div className="feature-item">
                  <div className="feature-icon">🔐</div>
                  <span>Secure Authentication</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📝</div>
                  <span>Blog Management</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">☁️</div>
                  <span>Cloud Storage</span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="login-section">
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-header">
                  <h2>Welcome Back</h2>
                  <p>Sign in to your account</p>
                </div>

                <div className="input-group">
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <FaUserTie />
                    </div>
                    <Input
                      className="modern-input"
                      type="email"
                      placeholder="Email Address"
                      value={authState.username}
                      onChange={(e) => authState.setUsername(e.target.value)}
                      required
                    />
                    <Tooltip placement="top" title="Enter your email address">
                      <div className="info-icon">
                        <IoMdInformationCircleOutline />
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <TbPasswordUser />
                    </div>
                    <div className="password-input-container">
                      <Input
                        className="modern-input password-input"
                        type={authState.showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={authState.password}
                        onChange={(e) => authState.setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => authState.setShowPassword(!authState.showPassword)}
                      >
                        {authState.showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <Tooltip placement="top" title="Enter your password">
                      <div className="info-icon">
                        <IoMdInformationCircleOutline />
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={authState.loginLoading}
                  className="login-button"
                  size="large"
                >
                  Sign In
                </Button>
              </form>
            </div>
          </div>
        </main>

        {/* Demo Credentials Footer */}
        <footer className="demo-footer">
          <div className="demo-credentials">
            <Text className="footer-text">
              © {new Date().getFullYear()} ConnectCloud Blogs. All rights reserved.
            </Text>
            <div className="credentials-section">
              <Text className="demo-label">Demo Credentials:</Text>
              <div className="credential-item">
                <span>Email: </span>
                {/* <CopyToClipboard text="demo@cloudconnect.com"> */}
                  <button className="copy-button" onClick={handleEmailCopy}>
                    demo@cloudconnect.com
                  </button>
                {/* </CopyToClipboard> */}
              </div>
              <div className="credential-item">
                <span>Password: </span>
                {/* <CopyToClipboard text="Test@123"> */}
                  <button className="copy-button" onClick={handlePasswordCopy}>
                    Test@123
                  </button>
                {/* </CopyToClipboard> */}
              </div>
            </div>
            <Text className="developer-credit">
              Developed by <a href="https://mehulgarg.netlify.app/" target="_blank" rel="noopener noreferrer">Mehul Garg</a>
            </Text>
          </div>
        </footer>

        {/* Signup Modal */}
        <Modal
          open={signupState.isModalOpen}
          onCancel={() => signupState.setIsModalOpen(false)}
          className="modern-modal"
          footer={null}
          width={600}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create Account</h2>
              <p className="modal-subtitle">Join ConnectCloud Blogs today</p>
            </div>

            <Form
              form={form}
              onFinish={handleSignUpImages}
              layout="vertical"
              className="signup-form"
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { type: 'email', message: 'Please enter a valid email address!' },
                  { required: true, message: 'Please input your email!' },
                ]}
              >
                <div className="form-input-wrapper">
                  <Input
                    className="modern-form-input"
                    placeholder="Enter your email address"
                    onChange={(e) => signupState.setEmail(e.target.value)}
                  />
                  <Tooltip placement="top" title="Enter your email address">
                    <div className="form-info-icon">
                      <IoMdInformationCircleOutline />
                    </div>
                  </Tooltip>
                </div>
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { validator: validatePassword },
                ]}
                hasFeedback
              >
                <div className="form-input-wrapper">
                  <Input.Password
                    className="modern-form-input"
                    placeholder="Create a strong password"
                    onChange={(e) => signupState.setNewPassword(e.target.value)}
                  />
                  <Tooltip placement="top" title={tooltipContent}>
                    <div className="form-info-icon">
                      <IoMdInformationCircleOutline />
                    </div>
                  </Tooltip>
                </div>
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <div className="form-input-wrapper">
                  <Input.Password
                    className="modern-form-input"
                    placeholder="Confirm your password"
                    onChange={(e) => signupState.setConfirmPassword(e.target.value)}
                  />
                  <Tooltip placement="top" title="Re-enter your password">
                    <div className="form-info-icon">
                      <IoMdInformationCircleOutline />
                    </div>
                  </Tooltip>
                </div>
              </Form.Item>

              <Form.Item name="profileImage" label="Profile Image (Optional)">
                <div className="file-upload-wrapper">
                  <div className="file-upload-area">
                    <MdCloudUpload className="upload-icon" />
                    <p className="upload-text">Click to upload or drag and drop</p>
                    <p className="upload-subtitle">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </div>
                  {signupState.file && (
                    <div className="file-selected">
                      <span>Selected: {signupState.file.name}</span>
                    </div>
                  )}
                </div>
              </Form.Item>

              <div className="modal-actions">
                <Button
                  onClick={() => signupState.setIsModalOpen(false)}
                  className="cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={signupState.loading}
                  className="submit-button"
                >
                  Create Account
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        {/* Notifications */}
        <Notification 
          type={notificationState.type} 
          message={notificationState.message} 
          description={notificationState.description} 
        />
        <Notification 
          type={notificationState.emailCopied} 
          message="Copied to clipboard" 
          description="Email ID copied to clipboard"
        />
        <Notification 
          type={notificationState.passwordCopied} 
          message="Copied to clipboard" 
          description="Password copied to clipboard"
        />
      </div>
    </ConfigProvider>
  );
}
