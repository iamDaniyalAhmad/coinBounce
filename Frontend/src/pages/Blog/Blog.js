import React from 'react'
import { useState, useEffect } from 'react'
import Loader from '../../Components/Loader/Loader'
import { getAllBlog } from '../../api/internal'
import styles from './Blog.module.css'
import { useNavigate } from 'react-router-dom'

const Blog = () => {
  const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    useEffect(()=>{
        (async function getBlogApiCall(){
            const response = await getAllBlog();
                setBlogs(response.blogs);
        })();

        setBlogs([]);
    },[])

    if(blogs.length===0){
        return <Loader text="Blogs" />
    }
  return (
    <div className={styles.blogsWrapper}>
      {blogs.map((blog) =>(
        <div className={styles.blog} key={blog._id} onClick={(()=> navigate(`/blog/${blog._id}`) )}>
            <h1>{blog.title}</h1>
            <img src={blog.photo} />
            <p>{blog.content}</p>
        </div>
      ))}
    </div>
  )
}

export default Blog
