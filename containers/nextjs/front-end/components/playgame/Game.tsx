'use client';


import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@/hooks/customHooks';

import { useSelector } from 'react-redux';
import Matter from 'matter-js'

import Result from '@/components/playgame/Result'

import socket from '@/plugins/socket';
import Image from 'next/image'

interface Props {
  avatar: string;
    theme?: string;
}

function PlayerBar({avatar}: Props) {

  const blueAvatar = useSelector((state: any) => state.auth.avatar);


  const [blueResult, setBlueResult] = useState(0);
  const [redResult, setRedResult] = useState(0);

  const authuser = useSelector((state: any) => state.auth)

  useEffect(() => {
  
    socket.on('result', (data: any) => {

      if (data.firstPlayerId == authuser.id) {
        setBlueResult(data.firstPlayerScore);
        setRedResult(data.secondPlayerScore);
      }
      else {
        setBlueResult(data.secondPlayerScore);
        setRedResult(data.firstPlayerScore);
      }
    })

    return () => {
      socket.off('result')
    }

  }, [])

  return (
    <div className="player-bar text-white flex  justify-between mb-5 items-center">
      <div className='flex justify-between items-center w-36  bg-[#0079FF] p-1 rounded-md'>
        <div className='h-[60px] w-[60px] rounded-md overflow-hidden'>
          <Image src={blueAvatar} width={50} height={50} alt='user avatar' className='h-full w-full object-cover'  blurDataURL='/images/blur.jpg' />
        </div>
        <div className='font-semibold text-2xl antialiased m-auto'>{blueResult}</div>
      </div>

      <div className='flex justify-between items-center flex-row-reverse w-36 bg-red p-1 rounded-md'>
        <div className='h-[60px] w-[60px] rounded-md overflow-hidden'>
          <Image src={avatar} width={50} height={50} alt='user avatar' className='h-full w-full object-cover'  blurDataURL='/images/blur.jpg' />
        </div>
        <div className='font-semibold text-2xl antialiased m-auto'>{redResult}</div>
      </div>
    </div>
  )
}



export default function Game({avatar, theme}: Props) {

  const isDesktop = useMediaQuery('(min-width: 1600px)')
  const authUser: number = useSelector((state: any) => state.auth.id)

  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false);
  const scene = useRef<HTMLDivElement>(null)
  const resp = useRef<HTMLDivElement>(null)
  
  
  const R_HEIGHT = 20;
  const offsetWidth = 600;
  const offsetHeight = 900;

  const getColor = (theme: string = '/textures/fire.jpg') => {
    
    if (theme == '/textures/fire1.jpg') {
        return 'white'
    }
    else if (theme == '/textures/ice.jpg') {
        return "blue"
    } else {
        return 'red'
    }

}

const getbgColor = (theme: string = '/textures/fire.jpg') => {

    if (theme == '/textures/fire1.jpg') {
        return 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)'
    }
    else if (theme == '/textures/ice.jpg') {
        return "linear-gradient(to right, #DECBA4, #3E5151)"
    } else {
        return 'linear-gradient(to right, #8360c3, #2ebf91)'
    }


}
  
  useEffect(() => {

    if (!scene.current || !resp.current) return;

    const widthScalingFactor = scene.current.offsetWidth / offsetWidth;
    resp.current.style.transform = `scale(${widthScalingFactor})`;

    const boxColor = getColor(theme);
    let Engine = Matter.Engine,

      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    let engine = Engine.create(
      {
        gravity: {
          x: 0,
          y: 0,
          scale: 0.001
        }
      }
    );

    let render = Render.create({
      element: scene.current,
      engine: engine,
      options: {
        width: scene.current.offsetWidth,
        height: scene.current.offsetHeight,
        background: 'transparent',
        wireframes: false,
        showAngleIndicator: true
      }
    });

    let reactOptions = {
      isStatic: true,
      render: { fillStyle: boxColor },
      chamfer: { radius: 10 }
    }

    let middle: number = scene.current.offsetWidth / 2;

    let boxA: Matter.Body = Bodies.rectangle(middle, 20, 150, R_HEIGHT, reactOptions);
    boxA.label = 'boxA';

    let boxB: Matter.Body = Bodies.rectangle(middle, scene.current.offsetHeight - R_HEIGHT, 150, R_HEIGHT,
      {
        isStatic: true,
        render: { fillStyle: boxColor },
        chamfer: { radius: 10 }
      }
    );

    let ball: Matter.Body = Bodies.circle(scene.current.offsetWidth / 2, scene.current.offsetHeight / 2, 20, {
      isStatic: true,
      render: { fillStyle: boxColor },
    });

    Composite.add(engine.world, [boxA, boxB, ball]);
    Render.run(render);

    let runner = Runner.create();
    Runner.run(runner, engine);

    const responsive = () => {
      if (!scene.current || !resp.current) return;

      const newWidth = scene.current.offsetWidth;

      const widthScalingFactor = newWidth / offsetWidth;

      if (widthScalingFactor >= 0.6)
      {
        resp.current.style.transform = `scale(${widthScalingFactor})`;
        render.canvas.width = resp.current.offsetWidth;
        render.canvas.height = resp.current.offsetHeight
        return ;
      }

    }

    window.addEventListener('resize', responsive)

    socket.on('ball_position', (pos, firstPlayer1, xa, xb) => {

      if (!scene.current || !resp.current) return;

      if (firstPlayer1 != authUser.toString()) {
        localStorage.setItem('isSecond', 'true')
      } else {
        localStorage.setItem('isSecond', 'false')
      }

      const scaleX = resp.current.offsetWidth / offsetWidth;
      const scaleY = resp.current.offsetHeight / offsetHeight;

      pos.x = pos.x * scaleX;
      pos.y = pos.y * scaleY;

      Matter.Body.setPosition(ball, pos);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      Matter.Body.setPosition(boxB, {
        x: xb * scaleX,
        y: scene.current.offsetHeight - (R_HEIGHT * scaleY)
      });

      Matter.Body.setPosition(boxA, {
        x: xa * scaleX,
        y: 20 * scaleY
      });

    })

    socket.on('boxA_position', (pos, user, playerB) => {
        user;
      if (!scene.current) return;

      let scaleX = scene.current.offsetWidth / offsetWidth;
      const scaleY = scene.current.offsetHeight / offsetHeight;


      if (playerB == "boxB") {
        Matter.Body.setPosition(boxB, {
          x: pos.x * scaleX,
          y: scene.current.offsetHeight - (R_HEIGHT * scaleY)
        });
      }
      else {
        Matter.Body.setPosition(boxA, {
          x: pos.x * scaleX,
          y: 20 * scaleY
        });
      }
    })

    return () => {
      window.removeEventListener('resize', responsive)
      socket.off('ball_position')
      socket.off('boxA_position')
    }

  }, [])


  useEffect(() => {
    const keyUpEvent = (event: KeyboardEvent) => {
      if (event.key == 'ArrowRight' || event.key == 'ArrowLeft') {
        setIsKeyPressed(false)
        socket.emit('key_released', {
          key: event.key,
          userId: authUser,
          room: localStorage.getItem('room'),
        })
      }
    }

    const keyDownEvent = (event: KeyboardEvent) => {
      if (isKeyPressed) return;
      if (event.key == 'ArrowRight' || event.key == 'ArrowLeft') {
        setIsKeyPressed(true)

        socket.emit('key_pressed', {
          key: event.key,
          userId: authUser,
          room: localStorage.getItem('room'),
        })
      }
    }

    document.addEventListener('keydown', keyDownEvent)
    document.addEventListener('keyup', keyUpEvent)

    return () => {
      document.removeEventListener('keydown', keyDownEvent)
      document.removeEventListener('keyup', keyUpEvent)
    }

  }, [isKeyPressed])

  
  return (
    <div>
      {!isDesktop && <PlayerBar avatar={avatar}/>}
      <div ref={resp} className='bg-red w-[90vw] h-[80vh] min-w-[280px] max-w-[600px] max-h-[900px] m-auto overflow-hidden  rounded-2xl'>
        <div ref={scene} className={`h-full w-full   ${localStorage.getItem("isSecond") == "true" ? '-scale-y-100' : ''}`}
          style={{ background: getbgColor(theme) }}
        />
      </div>
      {isDesktop && <Result />}
    </div>
  )
}



