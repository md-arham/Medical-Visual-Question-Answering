import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Verification = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const LOCAL_STORAGE_KEYS = {
        USERNAME: 'username',
        EMAIL: 'email',
        PASSWORD: 'password',
    };
    const [generatedOTP, setGeneratedOTP] = useState(null);

    const fetchOTP = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getotp', {});
            setGeneratedOTP(response.data.otp);
        } catch (error) {
            console.error('Error getting OTP:', error);
        }
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem(LOCAL_STORAGE_KEYS.USERNAME);
        const storedEmail = localStorage.getItem(LOCAL_STORAGE_KEYS.EMAIL);
        const storedPassword = localStorage.getItem(LOCAL_STORAGE_KEYS.PASSWORD);

        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
        if (storedPassword) setPassword(storedPassword);


        fetchOTP();
    }, []);
    
    const [resendButtonEnabled, setResendButtonEnabled] = useState(false);
    // Timer logic
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(10);

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);
                } else {
                    setMinutes((prevMinutes) => prevMinutes - 1);
                    setSeconds(59);
                }
            } else {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }
        }, 1000);

        setTimeout(() => {
            setResendButtonEnabled(true);
        }, 10000);

        return () => clearInterval(interval);
    }, [minutes, seconds]);

    useEffect(() => {
      
        setTimeout(() => {
            setResendButtonEnabled(true);
        }, 10000);
        console.log(generatedOTP)
    }, []);


    const sendOTP = async () => {
        // Send a request to your server to generate and send OTP
        try {
            console.log("hhhhhhhh")
            const response = await axios.post('http://localhost:5000/genotp', {
                userId: 
                email,
            });
            console.log("hhhhhhhh")

            if (response.data.success) {
                setGeneratedOTP(response.data.otp);
                toast.success('OTP sent successfully', {
                    position: 'bottom-right',
                    autoClose: 1400,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                });

            } else {
                console.error('Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    const handleResendClick = () => {
        if (resendButtonEnabled) {
            sendOTP();
            

            // Enable the resend button after a delay (e.g., 30 seconds)
            
        }
    };

    const handleSubmit = async () => {
        try {
            if (generatedOTP !== null) {
                if (otp === generatedOTP) {
                    axios
                        .post('http://localhost:5000/signup', { uname: username, mail: email, key: password })
                        .then((response) => {
                            console.log('Saved item:', response.data);
                        })
                        .catch((error) => {
                            console.error('Error saving item:', error);
                        });

                    toast.success('Registered successfully', {
                        position: 'bottom-right',
                        autoClose: 1400,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });

                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    alert('Invalid OTP');
                }
            }
        } catch (error) {
            console.error('Error sending OTP email:', error);
        }
    };

    return (
        <div className="modal modal-signin position-static d-block py-2" tabIndex="-1" role="dialog" id="modalSignin">
            <ToastContainer
                position="bottom-right"
                autoClose={1400}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="modal-dialog" role="document">
                <div className="modal-content rounded-4 shadow">
                    <div className="modal-header p-5 pb-4 border-bottom-0">
                        <button className="btn btn-info">
                            <Link to="/signup">back</Link>
                        </button>
                        <h3 className="fw-bold mb-0 fs-2">Verify your email</h3>
                    </div>
                    <div className="modal-body p-5 pt-0">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control rounded-3"
                                id="password"
                                name="key"
                                placeholder="Password"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <label htmlFor="password">Enter OTP</label>
                        </div>

                        <div className="d-flex inline">
                            <div className="p-3">
                                {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
                                <br />
                            </div>
                            <div className="p-3">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleResendClick}
                                    disabled={!resendButtonEnabled}
                                >
                                    Resend
                                </button>
                            </div>
                            <br />
                        </div>

                        <button
                            className="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Sign up
                        </button>
                        <small className="text-muted">By clicking Sign up, you agree to the terms of use.</small>
                        <br />
                        <small className="text-muted">
                            Already have an account? <Link to="/login">Login</Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verification;
