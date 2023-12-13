import React from 'react'
import { getBlogById, updateBlog } from '../../api/internal'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate,useParams } from 'react-router-dom'
// import Loader from '../../Components/Loader/Loader'
import styles from './/UpdateBlog.module.css'
import TextInput from '../../Components/TextInput/TextInput'

function UpdateBlog(){

    const [title ,setTitle] = useState("")
    const [content ,setContent] = useState("")
    const [photo ,setPhoto] = useState("")
    const navigate = useNavigate();
    const params = useParams();
    const blogId = params.id;

    const getPhoto = (e) =>{
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = ( ) =>{
            setPhoto(reader.result);
        }
    }

    const author = useSelector((state) => state.user._id)

    const updateHandler = async () =>{
        let data;
        //http:backend_server:port/storage/filename.png
        if(photo.includes('http')){
            data = {
                author , title ,content , blogId
            }
        }
        else{
            data = {
                author , title ,content ,photo, blogId
            }

        }
        

        const response = await updateBlog(data);

        if(response.status === 201){
            navigate('/');
        }
    }

    useEffect(()=>{
        async function updateBlog(){
            const response = await getBlogById(blogId);
            if(response.status===201){
                setTitle(response.data.blog.title)
                setContent(response.data.blog.content)
                setPhoto(response.data.blog.photo)
            }
        }

        updateBlog();
        // eslint-disable-next-line
    },[])
    return (
        <div className={styles.wrapper}>
        <div className={styles.header}>Edit your blog!</div>
        <TextInput
        type="text"
        name="title"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{width : '60%'}}
        />
        <textarea
        className={styles.content}
        placeholder='Your content goes here...'
        value={content}
        maxLength={400}
        onChange={(e) =>  setContent(e.target.value)}
        />
        <div className={styles.photoPrompt}>
            Choose a photo
            <input
            type='file'
            name='photo'
            id='photo'
            accept='image/jpg, image/jpeg, image/png'
            onChange={getPhoto}
            />
        </div>
        <img src={photo} height={150} width={150}/>
        <button className={styles.update} onClick={updateHandler} >Update</button>
    </div>
    );
}

export default UpdateBlog;