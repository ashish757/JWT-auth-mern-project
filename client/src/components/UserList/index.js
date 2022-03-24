import styles from './UserList.module.css'
import User from '../User'
import { useEffect, useState } from 'react'

export default function UserList() {
    const [users, setUsers] = useState([])

    useEffect(() => {

        const fetchUsers = async () => {
            const res = await fetch("http://localhost:5000/api/users")
            const users = await res.json()
            setUsers(users.users)
        }
        fetchUsers()
    }, [])
    console.log("RENDERED USERSLIST");
    return (   
        <div className={styles.userList}>
            {users ? (
                users.map((user) => <User key={user._id} user={user}/>)
            ) : "LOADING....."}

        </div> 
        
    )
}