import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { signout } from '../../api/internal'
import { useDispatch } from 'react-redux'
import { resetUser } from '../../Store/userSlice'


const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticate = useSelector((state) => state.user.auth)
  const handleSignout = async () =>{
    await signout();
    dispatch(resetUser());
  }
  return (
    <>
   <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
  <div className="container-fluid">
    <NavLink className="navbar-brand" to="/"> <b>Navbar</b></NavLink>
    <div className="collapse navbar-collapse " id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/crypto">Cryptocurrencies</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/blog">Blog</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/submit">Submit a blog</NavLink>
        </li>
 
      </ul>
      {isAuthenticate?<div className="d-flex" role="search">
      <NavLink className="btn btn-danger mx-5"  onClick={handleSignout} >Sign out</NavLink>
      </div>:<div>
      <NavLink className="btn btn-light mx-2 btn-outline-dark" to="/login">Log in</NavLink>
      <NavLink className="btn btn-primary" to="/signup">Sign up</NavLink>  
      </div>}

      
    </div>
  </div>
</nav>
    </>
  )
}

export default Navbar
