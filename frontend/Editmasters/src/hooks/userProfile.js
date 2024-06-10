import { useState } from 'react';
import { message } from "antd";

const userProfile = () => {
    const storedData = JSON.parse(localStorage.getItem('user_data'));
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});
    const [documents, setDocuments] = useState([]);

    const getUser = async () => {
        try {
            setError(null);

            const res = await fetch(`http://localhost:3000/users/${storedData.user_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedData.access_token}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch user data.');
            }

            const data = await res.json();

            const pfcsData = data.pdfs.reverse();
            const imageData = data.images.reverse();
            const documentsData = [...pfcsData, ...imageData];
            
            setUserData(data);
            setDocuments(documentsData);
            
        } catch (error) {
            setError(error.message);
            message.error(error.message);
        }
    };

    const updateUserBio = async (values) => {
        try {
            setError(null);

            const res = await fetch(`http://localhost:3000/users/${storedData.user_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedData.access_token}`
                },
                body: JSON.stringify(values)
            });

            const data = await res.json();
    
            if(res.ok) {    
                message.success("Your Profile is successfully updated!");            
                setUserData(data);
            }
            
        } catch (error) {
            setError(error.message);
            message.error(error.message);
        }
    };

    const deleteFile = async (file) => {
        try {
            const url = file.mimetype.startsWith('image/') 
                ? `http://localhost:3000/image/${file.id}` 
                : `http://localhost:3000/pdf/${file.id}`;
        
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${storedData.access_token}`
                }
            });
        
            if (response.ok) {
                message.success("File is deleted!");
                setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== file.id));
            } else {
                throw new Error('Failed to delete file.');
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    return { error, userData, documents, getUser, deleteFile, updateUserBio };
}

export default userProfile;