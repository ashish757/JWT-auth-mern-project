import styles from './Home.module.css'
import UserList from '../../components/UserList'

function Home(props) {
  
  return (
    <div className="home">
      
      {props.loading ? (
        <h1>Loading....</h1>
      ) : (
        <UserList/>
      )}

    </div>
  );
}

export default Home;
