'use client';
import { ArrowRight, Loader2, Pencil } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from '@/api/axiosInstances';
import { useDispatch } from 'react-redux';
import { setAvatar, setBioUpdate, setUserName } from '@/redux_toolkit/auth';
import UploadFileAvatar from '../UpdateProfile/uploadFile';

const FirstTimeUpdate = () => {
  const [username, setUsername] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [start, setStart] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatarP] = useState<string>('/images/profile.svg');
  const query = useSearchParams();
  const { push } = useRouter();
  const dispatch = useDispatch();

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };
  const getUserInfo = async (userId: number) => {
    axios
      .get('/update/' + userId)
      .then((res) => {
        setUsername(res.data.UserName);
        setFirstname(res.data.firstName);
        setLastname(res.data.lastName);
        setAvatarP(res.data.avatar);
      })
      .catch(({ response }) => {
        response?.data;

      });
  };
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
        dispatch(setAvatar(res.data));
        setAvatarP(res.data);
      })
      .catch(({response}) => {
        toast.error(response?.data?.message);
      });
  };
  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    handleUploadFile(fileInput, 'profile');
  };

  useEffect(() => {
    const userId = query.get('u');

    getUserInfo(parseInt(userId as string));
    
  }, []);

  const Confirmation = (
    <div className="p-2">
      <h4 className="text-1xl">
        Welcome, <strong className="font-semibold text-red">{firstname +" "+ lastname}</strong>,
        to the game of Pongster. Click on the following to change your account
        information and your personal avatar, or import it from the accounts of
        intra 42
      </h4>

      <Image
        src="/images/ping.svg"
        alt="ptofile"
        width={400}
         blurDataURL='/images/blur.jpg'
        height={400}
        className="w-full object-cover my-2 rounded-md"
      />

      <button
        className="w-full p-4 bg-green-200 mt-4 rounded-lg flex gap-2 justify-center"
        onClick={() => setStart(true)}
      >
        Next
        <span>
          <ArrowRight />
        </span>
      </button>
    </div>
  );
  const setUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    if (username === '' || firstname === '' || lastname === '') {
        toast.warn('please fill all the fields');
        setLoading(false);
        return;
    }
    const userId = query.get('u');
    const data = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      bio: bio,
      avatar: avatar,
    };
    axios
      .put('/update/' + parseInt(userId as string), null, { params: data })
      .then(() => {
        toast.success('successfuly update profile');
        setLoading(false);
        dispatch(setUserName(username));
        dispatch(setBioUpdate(bio));
        dispatch(setAvatar(avatar));
        push('/login');
      })
      .catch(({ response }) => {
        toast.warn(response?.data?.message);
        setLoading(false);
      });
  };
  return (
    <div className="bg-dark-100 w-full md:w-[600px] p-5  flex flex-col  rounded-md">
      <div className="flex  items-center flex-col">
        <h1 className="text-3xl p-2 font-semibold">Welcome to PongSter</h1>

        {!start ? (
          Confirmation
        ) : (
          <form autoComplete='false' className="w-full"
           name='firstTimeUpdate_form'
           id='firstTimeUpdate_form'
          >
            <div className="w-full grid place-content-center">
              <div className="relative rounded-full w-32 h-32 p-1 overflow-hidden">
                <Image
                  src={avatar}
                  alt="ptofile"
                  width={128}
                  height={128}
                   blurDataURL='/images/blur.jpg'
                  className="w-full h-full  object-cover"
                />
                <div className="absolute left-[50%] translate-x-[-50%] bottom-5">
                  <label htmlFor="uploadFirst">
                    {' '}
                    <Pencil color="black" />
                  </label>
                  <input
                    type="file"
                    onChange={onFileUploadChange}
                    className="hidden"
                    id="uploadFirst"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 w-full">
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
              >
                <motion.ul
                  variants={container}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  <motion.li variants={item}>
                    <input
                      type="text"
                      className="p-4 bg-dark w-full rounded-2xl outline-none"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </motion.li>
                  <motion.li variants={item}>
                    <input
                      type="text"
                      className="p-4 bg-dark w-full rounded-2xl outline-none"
                      placeholder="firstname"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </motion.li>
                  <motion.li variants={item}>
                    <input
                      type="text"
                      className="p-4 bg-dark w-full rounded-2xl outline-none"
                      placeholder="lastname"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </motion.li>
                  <motion.li variants={item}>
                    <input
                      type="text"
                      className="p-4 bg-dark w-full rounded-2xl outline-none"
                      placeholder="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </motion.li>

                  <button
                    className="p-4 bg-green-200 rounded-2xl outline-none font-semibold flex justify-center gap-2"
                    onClick={(e: any) => setUpdate(e)}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : null}
                    Start Now
                  </button>
                </motion.ul>
              </motion.div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FirstTimeUpdate;
