import axios from '@/api/axiosInstances';
import { RoomType } from '@/components/forms/RoomType';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ButtonForm } from '@/components/forms/BottonCreate';
import { useDispatch, useSelector } from 'react-redux';
import { setAvatarRoom, setTitleRoom } from '@/redux_toolkit/rooms/roomsRedux';

interface propsUpdate {
  id: number;
}
const UpdateInfoRoom = ({ id }: propsUpdate) => {
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [typeRoom, setTypeRoom] = useState<string>('public');
  const [password, setPassword] = useState<string>('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const userId = useSelector((state: any) => state.auth.id);
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState<boolean>(false);

  const handleUploadFile = (fileInput: any) => {
    if (!fileInput.files) {
      setAvatar!(null);
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      setAvatar!(null);
      return;
    }
    const file = fileInput.files[0];

    if (!file.type.startsWith('image')) {
      setAvatar!(null);
      return;
    }
    setAvatar!(file);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const fileInput = e.dataTransfer;
    handleUploadFile(fileInput);
  };

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    handleUploadFile(fileInput);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const setUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    if (title.trim() === '') {
      toast.error('required title');
      setLoading(false);
      return;
    }
    if (desc.trim() === '') {
      toast.error('required description');
      setLoading(false);
      return;
    }
    if (password.trim() === '' && typeRoom === 'protected') {
      toast.error('required password');
      setLoading(false);
      return;
    }
    const formData = new FormData();
    if (avatar) formData.append('avatar', avatar!);
    formData.append('name', title!);
    formData.append('descreption', desc!);
    formData.append('password', password!);
    formData.append('type', typeRoom.toLocaleLowerCase());
    formData.append('ownerId', userId);

    axios
      .patch(`/room/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        toast.info(`room ${res.data.name} updated success`);
        dispatch(setTitleRoom(res.data.name));
        dispatch(setAvatarRoom(res.data.avatar));

        setLoading(false);
      })
      .catch(({ response }) => {
        toast.warning(response?.data?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    axios
      .get('/join/info/room/' + id)
      .then((res) => {
        setTitle(res.data.name);
        setDesc(res.data.descreption);
        setTypeRoom(res.data.type);
      })
      .catch(() => {
        toast.warn('error ');
      });
  }, []);
  return (
    <form autoComplete='false'
      className="mx-4 my-3 scrollbar overflow-y-auto h-[80%]"
      onSubmit={(e: any) => setUpdate(e)}
      name='updateRoom_form'
      id='updateRoom_form'
    >
      <h1 className="text-2xl">update room {title}</h1>
      <div className="mt-5">
        <label htmlFor="name_edit">name* </label>
        <input
          type="text"
          placeholder="name Room"
          id="name_edit"
          name='name_edit'
          value={title}
          autoFocus={false}
          className="w-full p-2 bg-dark-100 border-none outline-none mt-2 rounded-md"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="name">Description*</label>
        <textarea
          placeholder="Description"
          id="Description_edit"
          name='Description_edit'
          cols={2}
          rows={2}
          value={desc}
          className="w-full p-3 bg-dark-100 border-none outline-none mt-2 rounded-md"
          onChange={(e) => {
            setDesc(e.target.value);
          }}
        ></textarea>
      </div>
      <RoomType typeRoom={typeRoom} setTypeRoom={setTypeRoom} />
      {typeRoom === 'protected' ? (
        <motion.div initial={{ x: 5 }} animate={{ x: 0 }}>
          <div className="mt-5">
            <label htmlFor="passwordUpdate">Password* </label>
            <input
              type="password"
              placeholder="password Room"
              id="passwordUpdate"
              name='passwordUpdate'
              value={password}
              autoFocus={false}
              autoComplete="off"
              className="w-full p-2 bg-dark-100 border-none outline-none mt-2 rounded-md"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <p className="mt-2 text-[10px] text-[#b5c9da]/70 mb-5">
              Generate a secure password by using a combination of uppercase and
              lowercase letters, numbers, and special characters, and avoid
              using personal information or common patterns.
            </p>
          </div>
        </motion.div>
      ) : null}
      <div className="mt-5">
        {' '}
        <input
          type="file"
          id='avatarUpdate'
         name='avatarUpdate'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onChange={onFileUploadChange}
        />
      </div>

      <div className="mt-5">
        <ButtonForm isLoading={isLoading} type={false} />
      </div>
    </form>
  );
};
export default UpdateInfoRoom;
