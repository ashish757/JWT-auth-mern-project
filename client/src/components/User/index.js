import {useState} from 'react'
import { Link } from 'react-router-dom'
import styles from './User.module.css'


export default function User({user}) {

    const [isLiked, setIsLiked] = useState(false)

    const like = () => {
        setIsLiked(!isLiked)

        // save into the database
    }
    return (
        <div className={styles.userCard}>
            <p>{user.name}</p>
            <small>{user.likes} Likes</small>
            <button className={styles.likeButton} onClick={like}>
                <svg fill={isLiked ? "pink" : "none"} viewBox="0 0 24 24" stroke="pink">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
            <button><Link to={`/user/${user._id}`} style={{color: '#fff', textDecoration: 'none'}}>View</Link></button>
        </div>
    )
}