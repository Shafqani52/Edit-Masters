import { useState } from 'react';
import { message, notification } from "antd";
import { userAuth } from "../contexts/authContext.jsx";

const useLogin = () => {
    const { login } = userAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const loginUser = async (values) => {
        try {
            setError(null);
            setLoading(true);

            const res = await fetch('http://localhost:3000/auth/login', {
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
                    description: 'You have successfully login.',
                    placement: 'topRight',
                });
                login(data.access_token, data.user_id, data.role)
            }else if(res.status === 404) {
                setError(data.message)
            }else if(res.status === 401) {
                setError(data.message)
            }
            else {
                setError('User not found!')
                message.error('User not found')
            }
            
        } catch (error) {
            message.error(error)
        } finally {
            setLoading(false)
        }
    };

    return { loading, error, loginUser }
}

export default useLogin;