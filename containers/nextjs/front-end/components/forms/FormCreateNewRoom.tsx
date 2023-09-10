'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { FileUpload } from './uploadFile';
import { ErrorInput } from '../error/ErrorInput';
import { ButtonForm } from './BottonCreate';
import { RoomType } from './RoomType';

import { useDispatch, useSelector } from 'react-redux';
import axios from '../../api/axiosInstances';
import { motion } from 'framer-motion';
import { createNewRoomSlice } from '@/redux_toolkit/rooms/roomsRedux';
import { toast } from 'react-toastify';
import { useDebance } from '@/hooks/customHooks';

export const FormCreateNewRoom = () => {
  const dispatch = useDispatch();

  const [typeRoom, setTypeRoom] = useState<string>('public');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [onErrorFile, setErrorFile] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [msgErrorName, setMsgErrorName] = useState<string | null>(null);
  const [msgErrorPass, setMsgErrorPass] = useState<string | null>(null);
  const [msgErrorDesc, setMsgErrorDesc] = useState<string | null>(null);

  const [debouncedValue] = useDebance(name, 500);

  const userId = useSelector((state: any) => state.auth.id);

  const checkTypePassword = () => typeRoom === 'Protected';

  const createNewRoom = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    if (name.trim().length < 5 || name === '') {
      setMsgErrorName(
        name.trim().length < 5
          ? 'length of name is short then 5 character'
          : 'required Name',
      );
      setLoading(false);
      return;
    }
    if (description.trim().length < 5 || name === '') {
      setMsgErrorDesc(
        name.trim().length < 5
          ? 'length of description is short then 5 character'
          : 'required description',
      );
      setLoading(false);
      return;
    }
    if (checkTypePassword()) {
      if (password.length <= 3 || password === '') {
        setMsgErrorPass(
          password !== '' ? 'Passsword is low' : 'Required Password',
        );
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    if (avatar) formData.append('avatar', avatar!);
    formData.append('name', name!);
    formData.append('descreption', description!);
    formData.append('password', password!);
    formData.append('type', typeRoom.toLocaleLowerCase());
    formData.append('ownerId', userId);

    axios
      .post('/room/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        dispatch(createNewRoomSlice(res.data));
        toast.success(`successfuly add room ${res.data.chat.name}`);
        setLoading(false);
        setName('');
        setAvatar(null);
        setPassword('');
        setDescription('');
        setTypeRoom('public');
      })
      .catch(({ response }) => {
        setLoading(false);
        toast.warning(response?.data?.message);
      });
  };

  const setValueName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    axios
      .post('/room/exits', {
        name: debouncedValue,
        userId: userId,
      })
      .then((res) => {
        if (res.data === true) setMsgErrorName(`${name} alraedy exits`);
      });
    setMsgErrorName(null);
  }, [debouncedValue]);

  return (
    <form autoComplete='false'
      onSubmit={(e: any) => createNewRoom(e)}
      name="formCreateRoom_form"
      id="formCreateRoom_form"
    >
      <div className="flex flex-col-reverse md:flex-row gap-1">
        <div className="ml-0 md:ml-5 mt-5 md:mt-0 md:hidden">
          <ButtonForm isLoading={isLoading} />
        </div>

        <FileUpload
          uploadFile={setAvatar}
          avatar={avatar}
          onError={onErrorFile}
          setErrorFile={setErrorFile}
        />

        <div className="w-full ml-0 md:ml-5 flex flex-col justify-between">
          <div>
            <div>
              <label htmlFor="nameOfroom">Name*</label>
              <input
                placeholder="Name"
                id="nameOfroom"
                name='nameOfroom'
                value={name}
                className="w-full p-3 bg-dark-200 lg:bg-dark-100 border-none outline-none mt-2 rounded-md"
                onChange={setValueName}
              />
              <ErrorInput message={msgErrorName} />
            </div>

            <div className="mt-5">
              <label htmlFor="DescriptionRoom">Description*</label>
              <textarea
                placeholder="Description"
                id="DescriptionRoom"
                name='description'
                cols={4}
                rows={5}
                value={description}
                className="w-full p-3 bg-dark-200 lg:bg-dark-100 border-none outline-none mt-2 rounded-md"
                onChange={(e) => {
                  setDescription(e.target.value);
                  setMsgErrorDesc(null);
                }}
              ></textarea>
              <ErrorInput message={msgErrorDesc} />
            </div>

            <RoomType typeRoom={typeRoom} setTypeRoom={setTypeRoom} />
            {typeRoom === 'protected' ? (
              <motion.div initial={{ x: 5 }} animate={{ x: 0 }}>
                <div className="mt-5">
                  <label htmlFor="password">Password* </label>
                  <input
                    type="password"
                    placeholder="password Room"
                    id="password"
                    name='password'
                    value={password}
                    autoFocus={false}
                    className="w-full p-2 bg-dark-200 lg:bg-dark-100 border-none outline-none mt-2 rounded-md"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setMsgErrorPass(null);
                    }}
                  />
                  <ErrorInput message={msgErrorPass} />
                  <p className="mt-2 text-[10px] text-[#b5c9da]/70 mb-5">
                    Generate a secure password by using a combination of
                    uppercase and lowercase letters, numbers, and special
                    characters, and avoid using personal information or common
                    patterns.
                  </p>
                </div>
              </motion.div>
            ) : null}
          </div>

          <div className="hidden md:block">
            <ButtonForm isLoading={isLoading} type={true} />
          </div>
        </div>
      </div>
    </form>
  );
};
