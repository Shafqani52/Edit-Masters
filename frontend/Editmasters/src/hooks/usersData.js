import { useState } from 'react';
import { message } from "antd";
import { useNavigate } from 'react-router-dom';

const usersData = () => {
    const storedData = JSON.parse(localStorage.getItem('user_data'));
    const [usersInfo, setUsersInfo] = useState([]);
    const [membersInfo, setMembersInfo] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getAllUsers = async (values) => {
        try {
            setError(null);
            setLoading(true);

            const res = await fetch('http://localhost:3000/users', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedData.access_token}`
                },    
                body: JSON.stringify(values)
            });

            const data = await res.json();

            if(res.ok) {
                const updatedData = data.filter(user => user.role === 'user')
                setUsersInfo(updatedData)
            }
            
        } catch (error) {
            message.error("Something went wrong!")
        } finally {
            setLoading(false);
        }
    };

    const deleteMember = async (user) => {
        try {
            setError(null);
            setLoading(true);

            const res = await fetch(`http://localhost:3000/users/${user.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedData.access_token}`
                }
            });

            const data = await res.json();

            if(res.ok) {
                message.success(`${user.username} is deleted!`);

                if(user.role === 'admin') {
                    const updatedMemberData = membersInfo.filter(userInfo => userInfo.id !== user.id);
                    setMembersInfo(updatedMemberData);
                }else {
                    const updatedUserData = usersInfo.filter(userInfo => userInfo.id !== user.id);
                    setUsersInfo(updatedUserData);
                }
            }else {
                throw new Error('Failed to delete user.');
            }
            
        } catch (error) {
            message.error("Something went wrong!")
        } finally {
            setLoading(false);
        }
    };

    const getAllMembers = async (values) => {
        try {
            setError(null);
            setLoading(true);

            const res = await fetch('http://localhost:3000/users', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedData.access_token}`
                },    
                body: JSON.stringify(values)
            });

            const data = await res.json();

            if(res.ok) {
                const updatedData = data.filter(user => user.role === 'admin')
                setMembersInfo(updatedData)
            }
            
        } catch (error) {
            message.error("Something went wrong!")
        } finally {
            setLoading(false);
        }
    };

    const handleUserStatus = async (userInfo) => {
        try {
            setError(null);
            setLoading(true);

            const res = await fetch(`http://localhost:3000/users/activate/${userInfo.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedData.access_token}`
                },    
                body: JSON.stringify({ 
                    active: !userInfo.active
                })
            });
    
            const data = await res.json();
    
            if(res.ok) {
                message.success(`${userInfo.username} is ${!userInfo.active ? "activated" : "deactivated"}`);
                
                if(userInfo.role === 'admin') {
                    const updateData = [];
                    membersInfo.forEach(user => {
                        if(user.id === data.id) {
                            user.active = !user.active;
                        }
                        updateData.push(user);
                    });

                    setMembersInfo(updateData)
                }else {
                    const updateData = [];
                    usersInfo.forEach(user => {
                        if(user.id === data.id) {
                            user.active = !user.active;
                        }
                        updateData.push(user);
                    });

                    setUsersInfo(updateData)
                }
            }
            
        } catch (error) {
            message.error("Something went wrong!")
        } finally {
            setLoading(false);
        }
    }

    const updateUserRole = async (values) => {
        try {
            setError(null);
            setLoading(true);

            const res = await fetch(`http://localhost:3000/users/${values.user_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedData.access_token}`
                },    
                body: JSON.stringify(values)
            });
    
            const data = await res.json();
    
            if(res.ok) {                
                if(values.role === 'admin') {
                   if(usersInfo.length) {
                    message.success(`${data.username} is now a member`);

                    const updatedUsersInfo = usersInfo.map(user => 
                        user.id === data.id ? { ...user, role: data.role } : user
                    );
                    setUsersInfo(updatedUsersInfo);
                    navigate("/members");
                   }
                }else {
                    if(membersInfo.length) {
                        message.success(`${data.username} is now a user`);

                        const updatedMembersInfo = membersInfo.map(user => 
                            user.id === data.id ? { ...user, role: data.role } : user
                        );
                        setMembersInfo(updatedMembersInfo);
                        navigate("/users");
                    }
                }
            }
            
        } catch (error) {
            message.error("Something went wrong!")
        } finally {
            setLoading(false);
        }
    }

    return { usersInfo, getAllUsers, handleUserStatus, getAllMembers, membersInfo, updateUserRole, deleteMember, loading, error }
}

export default usersData;