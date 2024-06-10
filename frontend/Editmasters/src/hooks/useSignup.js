import { useState } from 'react';
import { message, notification } from "antd";
import { userAuth } from "../contexts/authContext.jsx";
import { useNavigate } from 'react-router-dom';

const useSignUp = () => {
    const { login } = userAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const registerUser = async (values) => {
        if(values.password != values.passwordConfirm) {
            return setError("Passwords are not the same")
        }

        try {
            setError(null);
            setLoading(true);

            const res = await fetch('http://localhost:3000/auth/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },    
                body: JSON.stringify(values)
            });

            const data = await res.json();

            if(res.ok) {
                // message.success("you have successfully registered!");
                notification.success({
                    message: 'Registration Successful',
                    description: 'You have successfully registered. You can now log in.',
                    placement: 'topRight',
                });

                navigate('/login');
                // login(data.token, data.user)
            }else if(res.status === 400) {
                setError(data.message)
            }else {
                setError('This email is already authorized!')
                message.error('Registration failed')
            }
            
        } catch (error) {
            message.error(error)
        } finally {
            setLoading(false)
        }
    };

    return { loading, error, registerUser }
}

export default useSignUp;