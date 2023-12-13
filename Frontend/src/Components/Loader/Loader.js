import React from 'react'
import { TailSpin } from 'react-loader-spinner'
import styles from './Loader.module.css'

const Loader = ({text}) => {
  return (
    <div className={styles.loadingWrapper}>
        <TailSpin height={80} width={80} radius={1} color={'#3861fb'} />
        <h2>Loading {text}</h2>
    </div>
  )
}

export default Loader
