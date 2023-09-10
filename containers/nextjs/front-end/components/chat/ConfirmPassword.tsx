import { postData } from '@/data/fetchData';
import { useInput } from '@/hooks/customHooks';
import socket from '@/plugins/socket';
import { lockedAction } from '@/redux_toolkit/rooms/messageRedux';
import { Check, Loader2 } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export interface configProps {
  roomId: number;
  userId: number;
  InitailDataRender: () => void;
}

const ConfirmPassword = ({
  roomId,
  userId,
  InitailDataRender,
}: configProps) => {
  const dispatch = useDispatch();
  const [password, setpassword] = useInput('');
  const [load, setLoad] = useState<boolean>(false);

  const roomActive = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoad(true);
    postData('/join/joined', {
      password: password,
      userId: userId,
      roomId: roomId,
    })
      .then((res: any) => {
        dispatch(lockedAction(false));
        InitailDataRender();
        socket.emit('setUser', res.data);
        setLoad(false);
      })
      .catch(() => {
        toast.error('error confirm room ');
        setLoad(false);
      });
  };

  return (
    <form
      autoComplete="off"
      onSubmit={(e: any) => roomActive(e)}
      className="flex justify-center items-center h-4/6 flex-col gap-2 "
      name="confirmPassword_form"
      id="confirmPassword_form"
    >
      <div>confirm password !</div>
      <div className="flex gap-4 flex-col  w-full px-20 py-5">
        <input
          autoComplete="false"
          type="password"
          value={password}
          className="bg-dark p-3 rounded-lg w-full outline-none border-none"
          placeholder="password"
          onChange={(e) => setpassword(e.target.value)}
          required
        />
        <div className=" flex justify-center">
          <button type="submit" className="bg-green-100 p-2 rounded-lg flex ">
            {load ? <Loader2 /> : <Check />}
            Confirm Password
          </button>
        </div>
      </div>
    </form>
  );
};

export default ConfirmPassword;
