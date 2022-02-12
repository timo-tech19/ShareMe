import React, { useRef, useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";

import { client } from "../client";
import { SideBar, UserProfile } from "../components";
import Pins from "./Pins";
import logo from "../assets/logo.png";
import { userQuery } from "../utils/data";
import { fetchUser } from "../utils/fetchUser";

function Home() {
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [userInfo]);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <SideBar user={user && user} />
      </div>
      <div className='flex relative md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu
            fontSize={40}
            className='cursor-pointer'
            onClick={() => setToggleSideBar(true)}
          />
          <Link to='/'>
            <img src={logo} alt='Share Me Logo' className='w-28' />
          </Link>
          <Link to={`/profile/${user?._id}`}>
            <img src={user?.image} alt='Share Me Logo' className='w-28' />
          </Link>
        </div>
        {toggleSideBar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-sm z-10 animate-slide-in'>
            <SideBar user={user && user} closeToggle={setToggleSideBar} />
            <div className='absolute top-4 right-4 flex justify-between items-center p-2'>
              <AiFillCloseCircle
                fontSize={30}
                className='cursor-pointer'
                onClick={() => setToggleSideBar(false)}
              />
            </div>
          </div>
        )}
      </div>

      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/profile/:id' element={<UserProfile />} />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
