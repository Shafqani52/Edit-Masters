import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const UseForgetPassword = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUserExist, setIsUserExist] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const forgetUserPassword = async (values) => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch('http://localhost:3000/auth/forgot-pwd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setSuccessMessage('Password reset link has been sent to your email.');
      } else {
        setError('User not found!');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkUserExistence = async (values) => {
    try {
      setError(null);

      const res = await fetch('http://localhost:3000/auth/reset-pwd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setCheckingUser(true);
        setIsUserExist(true)
      } else {
        setCheckingUser(false);
        setIsUserExist(false)
      }
    } catch (error) {
        setCheckingUser(false);
        setIsUserExist(false)
    } finally {
        setCheckingUser(false);
    }
  };

  const resetPassword = async (values) => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch('http://localhost:3000/auth/create-pwd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setSuccessMessage('You have successfully updated password!');
        setTimeout(function() {
          navigate("/login");
        }, 1000)
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      setSuccessMessage(null); // Reset the success message after showing it
    }
  }, [successMessage]);

  return { loading, error, forgetUserPassword, checkUserExistence, isUserExist, checkingUser, resetPassword };
};

export default UseForgetPassword;