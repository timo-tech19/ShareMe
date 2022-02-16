import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";

import logo from "../assets/logo.png";
import { categories } from "../utils/data";

const notActiveStyles =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const activeStyles =
  "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize";

const SideBar = ({ user, closeToggle }) => {
  const handleCloseSideBar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className='flex flex-col'>
        <Link
          to='/'
          onClick={handleCloseSideBar}
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
        >
          <img src={logo} alt='Share Me Logo' className='w-full' />
        </Link>
        <div className='flex flex-col gap-5 w-full'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? activeStyles : notActiveStyles
            }
            onClick={handleCloseSideBar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>
            Discover Categories
          </h3>
          {categories.slice(0, categories.length - 1).map(({ name, image }) => (
            <NavLink
              key={name}
              to={`/category/${name}`}
              className={({ isActive }) =>
                isActive ? activeStyles : notActiveStyles
              }
              onClick={handleCloseSideBar}
            >
              <img
                src={image}
                alt='Category'
                className='w-8 h-8 rounded-full shadow-sm'
              />
              {name}
            </NavLink>
          ))}
        </div>
      </div>

      {user && (
        <Link
          to={`/profile/${user._id}`}
          className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg'
          onClick={handleCloseSideBar}
        >
          <img
            src={user.image}
            className='w-10 h-10 rounded-full'
            alt='User profile'
          />
          <p>{user.name}</p>
        </Link>
      )}
    </div>
  );
};

export default SideBar;
