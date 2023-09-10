'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';

import Settings from '@/components/settings/settings';

import Image from 'next/image';
import axios from '@/api/axiosInstances';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAvatar,
  setBioUpdate,
  setCover,
  setUserName,
} from '@/redux_toolkit/auth';

import UploadFileAvatar from './uploadFile';

const Profile = () => {
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [country, setcountry] = useState('');
  const [avatarP, setAvatarP] = useState('');
  const [coverP, setCoverP] = useState('');
  const [bio, setBio] = useState('');
  const dispatch = useDispatch();

  const [updateStatus, setUpdateStatus] = useState('');
  const id = useSelector((state: any) => state.auth.id);

  //   upload
  const handleUploadFile = (fileInput: any, type: string) => {
    const formData = new FormData();
    formData.append('avatar', UploadFileAvatar(fileInput));
    formData.append('type', type);
    axios
      .patch('/profile/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        toast.info('seccessfully update profile picture');
        if (type === 'profile') {
          dispatch(setAvatar(res.data));
          setAvatarP(res.data);
        } else {
          dispatch(setCover(res.data));
          setCoverP(res.data);
        }
      })
      .catch(() => {
        toast.error('error update profile picture');
      });
  };
  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    handleUploadFile(fileInput, 'profile');
  };
  const onFileUploadCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    handleUploadFile(fileInput, 'cover');
  };
  const keepDataUpdated = async () => {
    axios
      .get('/update/' + id)
      .then((res) => {
        setusername(res.data.UserName);
        setfirstname(res.data.firstName);
        setlastname(res.data.lastName);
        setBio(res.data.bio);
        setcountry(res.data.Country);
        setemail(res.data.email);
        setAvatarP(res.data.avatar);
        setCoverP(res.data.cover);
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message);
      });
  };
  useEffect(() => {
    if (!id) return;
    keepDataUpdated();
  }, [id]);

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setusername(e.target.value);
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setemail(e.target.value);
  };

  const handleChangeFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setfirstname(e.target.value);
  };

  const handleChangeLastname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setlastname(e.target.value);
  };

  const handleChangeCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcountry(e.target.value);
  };

  const handleChangeBio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      bio: bio,
    };
    const checkvalue = [username, lastname, firstname];
    if (checkvalue.some((value: any)=> value.length < 3)) return toast.error('username, firstname, lastname must be at least 3 characters');

    axios
      .put('/update/' + id, null, { params: data })
      .then((res) => {
        res;
        setUpdateStatus('Updated');
        dispatch(setUserName(username));
        dispatch(setBioUpdate(bio));
        notify();
        setTimeout(() => {
          setUpdateStatus('');
        }, 3000);
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message);
      });
      return;
  };

  const notify = () => {
    toast.success('Profile Updated successfully', {
      position: 'bottom-right',
      autoClose: 500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };
  return (
    <div className="">
      {updateStatus && (
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          limit={1}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="colored"
        />
      )}
      <div className="p-5 text-xl text-semibold tracking-wider hidden sm:block">
        Settings
      </div>
      <div className="flex justify-start w-full h-full p-0 overflow-hidden relative rounded-sm space-x-0 md:space-x-3 max-w-[1300px]">
        <Settings index={1} />
        <div className="w-full">
          <div className="w-full bg-[#393A6C] flex flex-col justify-around space-y-6 relative items-center p-2 md:p-10 md:rounded">
            <div className="w-full flex gap-4 md:gap-8 flex-col-reverse min-[1268px]:flex-row justify-around md:justify-start items-start  space-y-2 md:space-y-0 mb-4">
              <div className="w-full sm:max-w-[300px] min-[1268px]:w-[20%] object-cover flex flex-col justify-center items-center space-y-1">
                <div className="w-full h-100">
                  {avatarP.length > 1 ? (
                    <Image
                      loading="lazy"
                      src={avatarP}
                      width={100}
                      height={100}
                      alt="#"
                      className="w-full h-full object-cover"
                       blurDataURL='/images/blur.jpg'
                    />
                  ) : null}
                </div>
                <div className="w-full">
                  <button className="w-full py-2 text-md font-medium flex justify-center items-center bg-dark-100 break-words whitespace-nowrap hover:bg-dark min-[950px]:text-xs">
                    <label htmlFor="picProfile" className="cursor-pointer">
                      Change profile picture
                    </label>
                    <input
                      type="file"
                      name='picProfile_id'
                      className="hidden"
                      id="picProfile"
                      onChange={onFileUploadChange}
                    />
                  </button>
                </div>
              </div>

              <div className="w-full min-[1268px]:w-[80%] flex flex-row-reverse relative object-cover h-[200px] md:h-full">
                {coverP.length > 1 ? (
                  <Image
                    loading="lazy"
                    property="LCP"
                    src={coverP}
                    width={100}
                    height={100}
                    alt="#"
                    className="w-full h-52 object-cover "
                  />
                ) : null}
                <div className="absolute top-2 right-2">
                  <button className="flex justify-center items-center rounded text-xs font-medium text-white bg-dark-100 px-6 py-2 hover:bg-dark">
                    <label htmlFor="coverProfile" className="cursor-pointer">
                      Change
                    </label>
                    <input
                      type="file"
                      name='coverProfile_id'
                      className="hidden"
                      id="coverProfile"
                      onChange={onFileUploadCoverChange}
                    />
                  </button>
                </div>
              </div>
            </div>

            <ItemProfile
              firstName="Username"
              secondName="Email Address"
              firstNameValue={username}
              secondNameValue={email}
              disabledSecond={true}
              handleChangeFirstName={handleChangeUsername}
              handleChangeSecondName={handleChangeEmail}
            />
            <ItemProfile
              firstName="First Name"
              secondName="Last Name"
              firstNameValue={firstname}
              secondNameValue={lastname}
              handleChangeFirstName={handleChangeFirstname}
              handleChangeSecondName={handleChangeLastname}
            />
            <ItemProfile
              firstName="Bio"
              secondName="Country"
              isVisibleSecond={false}
              maxLength={20}
              firstNameValue={bio}
              secondNameValue={country}
              handleChangeFirstName={handleChangeBio}
              handleChangeSecondName={handleChangeCountry}
            />

            <div className="w-full flex justify-center md:justify-start">
              <button
                type="submit"
                onClick={(e: any) => handleSubmit(e)}
                className="w-full md:w-[30%] min-w-[100px] bg-[#3CCF4E] hover:bg-[#3CCF4E]/[.9] text-md px-4 py-2 rounded flex justify-center items-center md:max-w-[130px]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;

interface ItemProfileProps {
  firstName?: string;
  secondName?: string;
  maxLength?: number;
  disabledSecond?: boolean;
  disabledFirst?: boolean;
  isVisibleSecond?: boolean;
  isVisibleFirst?: boolean;
  firstNameValue: string;
  secondNameValue: string;
  handleChangeFirstName?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeSecondName?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ItemProfile = ({
  firstName = '',
  secondName = '',
  firstNameValue = '',
  secondNameValue = '',
  isVisibleSecond = true,
  disabledFirst = false,
  isVisibleFirst = true,
  disabledSecond = false,
  handleChangeFirstName,
  handleChangeSecondName,
  maxLength,
}: ItemProfileProps) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-start space-y-4 md:space-y-0 text-md">
      {isVisibleFirst && (
        <div className="w-full md:w-[48%]">
          <label className="block mb-1" htmlFor={`r${firstName}_id`}>{firstName}</label>
          <input
            maxLength={maxLength}
            type="text"
            name={`n${firstName}_id`}
            id={`r${firstName}_id`}
            disabled={disabledFirst}
            className="w-full h-[40px] bg-[#26274F] py-2 px-4 rounded  placeholder-[#FFFFFFF] outline-none"
            value={firstNameValue}
            onChange={handleChangeFirstName}
          />
        </div>
      )}
      {isVisibleSecond ? (
        <div className="w-full md:w-[48%]">
          <label htmlFor={`c${secondName}_id`} className="block mb-1" >{secondName}</label>
          <input
            type="text"
            name={`a${secondName}_id`}
            id={`c${secondName}_id`}
            disabled={disabledSecond}
            maxLength={maxLength}
            className="w-full h-[40px] placeholder-green bg-[#26274F] py-2 px-4 rounded  placeholder-[#FFFFFFF] outline-none"
            value={secondNameValue}
            onChange={handleChangeSecondName}
          />
        </div>
      ) : null}
    </div>
  );
};
