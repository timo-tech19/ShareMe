import React, { useState, useEffect, useCallback } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { client, urlFor } from "../client";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { id } = useParams();

  const fetchPinDetail = useCallback(async () => {
    let query = pinDetailQuery(id);
    if (query) {
      const data = await client.fetch(query);
      setPinDetail(data[0]);

      if (data[0]) {
        query = pinDetailMorePinQuery(data[0]);

        const pins = await client.fetch(query);
        setPins(pins);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchPinDetail();
  }, [fetchPinDetail]);

  const addComment = async () => {
    if (comment) {
      setAddingComment(true);

      await client
        .patch(id)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuid(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit();

      fetchPinDetail();
      setComment("");
      setAddingComment(false);
    }
  };

  if (!pinDetail) return <Spinner message='Loading Pin...' />;
  return (
    <>
      <div
        className='flex xl:flex-row flex-col m-auto bg-white'
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            alt='User pin'
            className='rounded-t-3xl rounded-b-lg'
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center flex-end'>
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetail.destination}
              target='_blank'
              rel='noreferrer'
              className=''
            >
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3 '>
              {pinDetail.title}
            </h1>
            <p className='mt-3'>{pinDetail.about}</p>
          </div>
          <Link
            to={`/profile/${pinDetail.postedBy?._id}`}
            className='flex gap-2 mt-5 items-center bg-white rounded-lg'
          >
            <img
              src={pinDetail.postedBy?.image}
              alt='User profile'
              className='w-8 h-8 rounded-full object-cover'
            />
            <p className='font-semibold capitalize'>
              {pinDetail.postedBy?.name}
            </p>
          </Link>
          <h2 className='mt-5 text-2xl'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>
            {pinDetail?.comments?.map((comment, i) => {
              return (
                <div
                  key={i}
                  className='flex gap-2 mt-5 items-center bg-white rounded-lg'
                >
                  <img
                    src={comment.postedBy.image}
                    alt='User profile'
                    className='w-10 h-10 rounded-full cursor-pointer'
                  />
                  <div className='flex flex-col'>
                    <p className='font-bold'>{comment.postedBy.name}</p>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='flex flex-wrap mt-6 gap-3 items-center'>
            <Link to={`/profile/${pinDetail.postedBy?._id}`}>
              <img
                src={pinDetail.postedBy?.image}
                alt='User profile'
                className='w-10 h-10 rounded-full object-cover cursor-pointer'
              />
            </Link>
            <input
              type='text'
              className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              placeholder='Leave a comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type='button'
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}
            >
              {addingComment ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      {pins ? (
        <>
          <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner mesages='Loading more pins' />
      )}
    </>
  );
};

export default PinDetail;
