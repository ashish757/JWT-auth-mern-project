// import styles from './UserProfile.module.css'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useFetchPrivate from "../../hooks/useFetchPrivate"


export default function UserProfile() {
    const params = useParams()
    const [user, setUser] = useState([])
    const useFetch = useFetchPrivate()

    useEffect(() => {
        const FetchUsers = async () => {
            const res = await useFetch(`user/${params.id}`, {}, "GET")
            console.log(res);
            if (res.status) {
                setUser(res.user)
            } else {
                setUser(res.user)
            }
        }
        FetchUsers()
    }, [])
    return (
        <div>
            USER
            <h2>{user.name}</h2>
            <h6>{user.likes} Likes</h6>
            <h3>{user.email}</h3>
        </div>
    )
}