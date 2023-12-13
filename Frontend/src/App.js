import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar/Navbar'
import Footer from "./Components/Footer/Footer";
import Home from "./pages/Home/Home";
import styles from './App.module.css'
import Protected from "./Components/Protected/Protected";
import Error from "./pages/Error/Error";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { useSelector } from "react-redux";
import Crypto from "./pages/Crypto/Crypto";
import Blog from "./pages/Blog/Blog";
import SubmitBlog from "./pages/SubmitBlog/SubmitBlog";
import BlogDetail from "./pages/BlogDetail/BlogDetail";
import UpdateBlog from "./pages/UpdateBlog/UpdateBlog";
import Loader from "./Components/Loader/Loader";
import useAutoLogin from "./hooks/useAutoLogin";
function App() {

  const loading = useAutoLogin();
  const isAuth = useSelector((state) => state.user.auth)
  return loading ? <Loader text="..."/> : (
    <div className={styles.container}>
      <BrowserRouter>
      <Navbar/>
      <div className={styles.layout}> 
        <Routes>
         
        <Route exact path="/" element={ <div className={styles.main}><Home/> </div> }/>
        <Route exact path="/crypto" element={ <div className={styles.main}> <p> <Crypto/></p> </div> }/>
        <Route exact path="/blog" element={ <Protected isAuth={isAuth} > <div className={styles.main}> <Blog/> </div> </Protected> }/>
        <Route exact path="/blog/:id" element={ <Protected isAuth={isAuth} > <div className={styles.main}> <BlogDetail/> </div> </Protected> }/>
        <Route exact path="/blog-update/:id" element={ <Protected isAuth={isAuth} > <div className={styles.main}> <UpdateBlog/> </div> </Protected> }/>
        <Route exact path="/submit" element={ <Protected isAuth={isAuth} >  <div className={styles.main}> <SubmitBlog/> </div></Protected> }/>
        <Route exact path="/login" element={ <div className={styles.main}> <Login/> </div> }/>
        <Route exact path="/signup" element={ <div className={styles.main}> <Signup/> </div> }/>
        <Route exact path="*" element={ <div className={styles.main}> <Error/> </div> }/>

        </Routes>
      </div>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
