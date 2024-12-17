import { React, useState, useContext } from 'react';
import Greeting from '../components/Greeting';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../axios.js';
import toast from 'react-hot-toast';
import { AuthContext } from '../AuthContext.jsx';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { setUserLogged } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup({ formData });
      if (response == 'Signed In successfully!') {
        setUserLogged(true);
        toast.success(response);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(response);
    }
  };
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 h-screen'>
      <div className='flex flex-col justify-center items-center'>
        <img src={logo} alt='logo' className='w-1/5 sm:w-[10%] my-3' />
        <h1 className='text-2xl font-bold'>Let's get started</h1>
        <p className='text-xs mb-5'>Create an account with Uplist</p>

        <form action='' method='POST' className='w-2/3 md:w-1/2'>
          <div>
            <label htmlFor='fullname' className='text-xs'>
              Fullname
            </label>
            <input
              type='text'
              name='fullname'
              onChange={handleChange}
              className='w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-sm'
            />
          </div>
          <div className='mt-3'>
            <label htmlFor='email' className='text-xs'>
              Email
            </label>
            <input
              name='email'
              type='email'
              onChange={handleChange}
              className='w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-sm'
            />
          </div>
          <div className='mt-3'>
            <label htmlFor='password' className='text-xs'>
              Password
            </label>
            <input
              name='password'
              type='password'
              onChange={handleChange}
              className='w-full p-2 rounded-md border border-slate-200 focus:border-slate-300 focus:outline-none text-sm'
            />
          </div>
          <button
            className='w-full mt-4 bg-slate-100 hover:bg-slate-200 transition-all p-3 rounded-md text-sm'
            onClick={handleSubmit}
          >
            Sign up
          </button>
        </form>
        <span className='flex text-sm gap-1 mt-3'>
          <p>Already have an account?</p>
          <Link to='/login' className='text-blue-600 underline'>
            Login
          </Link>
        </span>
      </div>
      <div className='relative hidden md:block'>
        <Greeting />
      </div>
    </div>
  );
};

export default Signup;
