import React from 'react'
import { useState, useEffect } from 'react'
import { getCrypto } from '../../api/external'
import Loader from '../../Components/Loader/Loader'
import styles from './Crypto.module.css'


const Crypto = () => {
    const [data, setData] = useState([]);
    useEffect(()=>{
        (async function cryptoApiCall(){
            const response = await getCrypto();
            setData(response);

            
        })();
        setData([]);
    },[]);

    if(data.length === 0){
        return <Loader text="Cryptocurrencies" />
    }

    const negativeStyle ={
        color : '#ea3942'
    }
    const positiveStyle = {
        color : '#16c784'
    }
  return (
    <table className={styles.table}>
        <thead>
            <tr className={styles.head}>
                <th>#</th>
                <th>Coin</th>
                <th>symbol</th>
                <th>price</th>
                <th>24h</th>
            </tr>
        </thead>
        <tbody>
            {data.map((coin)=>(
                <tr id={coin.id} className={styles.tableRow}>
                    <td>{coin.market_cap_rank}</td>
                    <td>
                        <div className={styles.logo}>
                        <img src={coin.image} width={40} height={40} /> {coin.name}
                        </div>
                    </td>
                    <td>
                        <div className={styles.symbol}>{coin.symbol}</div>
                    </td>
                    <td>{coin.current_price}</td>
                    <td style={coin.price_change_percentage_24h<0 ? negativeStyle : positiveStyle}>{coin.price_change_percentage_24h}</td>
                </tr>
            ))

            }
        </tbody>
    </table>
  )
}

export default Crypto
