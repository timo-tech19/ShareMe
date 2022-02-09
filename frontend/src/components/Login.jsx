import React from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import ShareMeVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { client } from "../client";

function Login() {
  const navigate = useNavigate();

  const responseGoogle = async (response) => {
    localStorage.setItem("user", JSON.stringify(response.profileObj));

    const { googleId, name, email, imageUrl } = response.profileObj;

    const sanityUser = {
      _id: googleId,
      _type: "user",
      name,
      email,
      image: imageUrl,
    };

    await client.createIfNotExists(sanityUser);
    navigate("/", { replace: true });
  };
  return (
    <div className='flex justify-center items-center flex-col h-screen'>
      <div className='relative h-full w-full'>
        <video
          src={ShareMeVideo}
          type='video/mp4'
          autoPlay
          loop
          controls={false}
          muted
          className='h-full w-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width='130px' alt='Share me logo' />
          </div>

          <div className='shadow-2xl'>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={({ onClick, disabled }) => (
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className='bg-mainColor p-3 rounded-lg flex items-center outline-none'
                >
                  <FcGoogle />
                  <span className='ml-2 capitalize'>Sign In With Google</span>
                </button>
              )}
              // onSuccess={responseGoogle}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy='single_host_origin'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
