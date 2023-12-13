import React from 'react'
import styles from './Error.module.css'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <div className={styles.main}>
      <h1> <span>Error 404!</span> Page not found</h1>
      <h2>Go Back to <Link className={styles.link} to='/'>Home</Link> </h2>
    </div>
  )
}

export default Error
