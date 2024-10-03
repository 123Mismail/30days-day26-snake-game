"use client"
 
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from './ui/button';


enum GAMESTATE{
  START,
  PAUSE,
  RUNNING,
  GAME_OVER,
  
}

enum DIRECTION{
  UP,
  DOWN,
  RIGHT,
  LEFT,
}

interface Position{
  x:number;
  y:number;
}
  
const initialSnake:Position[]=[{
  x:0,
  y:0,
}]
 const initialFood:Position={
  x:5, y:5
 }
 
// console.log(Math.floor(Math.random() * 10),"snakes foods next position after eating food")

const SnakeGame = () => {
  
    // State to manage the game
    const [gameState, setGameState] = useState<GAMESTATE>(GAMESTATE.START);
    const [snake, setSnake] = useState<Position[]>(initialSnake);
    const [food, setFood] = useState<Position>(initialFood);
    const [direction, setDirection] = useState<DIRECTION>(DIRECTION.RIGHT);
    const [score, setScore] = useState<number>(0);
    const [highScore, setHighScore] = useState<number>(0);
    const gameInterval = useRef<NodeJS.Timeout | null>(null);

    //  hanlde snack movement 
    const moveSnack =useCallback(()=>{
      setSnake((prevSnack)=> {
        const newSnak=[...prevSnack];
        const Head=newSnak[0];
        let newHead:Position
        
          //  using switch cases 
          switch(direction){
            case DIRECTION.UP:
           newHead={ x:Head.x , y:Head.y -1 }
           break;
           case DIRECTION.DOWN:
            newHead={ x:Head.x , y:Head.y +1}
            break;
            case DIRECTION.LEFT:
              newHead={x:Head.x -1, y:Head.y }
              break;
              case DIRECTION.RIGHT:
                newHead={ x:Head.x +1 , y:Head.y}
                break;
                default:
                  return [...newSnak]
               
          }
          newSnak.unshift(newHead);
          if(food.x === newHead.x && food.y === newHead.y ){
            setFood({
              x:Math.floor(Math.random()*10),
              y:Math.floor(Math.random()*10),
            });
            setScore((prevScore)=> prevScore +1)
          }else{
            newSnak.pop();
          }
          return newSnak;
      });
    },[direction , food]);
//  handel key press for directions

  const handleKeyPresses=useCallback((event:KeyboardEvent)=>{
        

    // switch cases
     switch(event.key){
      case "ArrowUp" :
        if(direction !== DIRECTION.DOWN)setDirection(DIRECTION.UP);
        break;
      case "ArrowDown" :
        if(direction !== DIRECTION.UP)setDirection(DIRECTION.DOWN);
        break;
      case "ArrowRight" :
        if(direction !== DIRECTION.LEFT)setDirection(DIRECTION.RIGHT);
        break;
      case "ArrowLeft" :
        if(direction !== DIRECTION.RIGHT)setDirection(DIRECTION.LEFT);
        break;
        
     }
  },[direction])

//   useEffect for Game Interval and Key Press Events

   useEffect(()=>{
    if( gameState===GAMESTATE.RUNNING){
      gameInterval.current= setInterval(moveSnack , 200)
      document.addEventListener("keydown" , handleKeyPresses)
    }else{
      if(gameInterval.current) clearInterval(gameInterval.current)
      document.removeEventListener("keydown",handleKeyPresses)
    }

    return ()=>  { if(gameInterval.current) clearInterval(gameInterval.current)
      document.removeEventListener("keydown",handleKeyPresses)};
   },[moveSnack,handleKeyPresses]);

  //  handelling start puse reset btns

   const startGame=()=>{
    setGameState(GAMESTATE.RUNNING);
    setDirection(DIRECTION.RIGHT);
    setSnake(initialSnake);
    setFood(initialFood)
   }
  //  

      // const pauseGame=()=>{
      //   setGameState(GAMESTATE.PAUSE);
      //   // setGameState( 
      //   //   gameState===GAMESTATE.RUNNING ? GAMESTATE.PAUSE : GAMESTATE.RUNNING)
      // };
 const resetGame=()=>{
  setGameState(GAMESTATE.START);
  setScore(0);
  setFood({
    x:Math.floor(Math.random()*10),
    y:Math.floor(Math.random()*10),
  });
  setSnake(initialSnake)
 }
  
//   updating high score

useEffect(()=>{
  if(score > highScore){
    setHighScore(score)
  }
},[score,highScore])

  return (
<div className='flex justify-center items-center h-screen'>
  <div className='h-[500px] w-[500px] bg-gray-200 border border-spacing-5 border-black rounded-3xl'>
    {/* game header starts */}
    <div className='max-auto text-center pt-4'>
      <h1 className='text-3xl font-semibold text-blue-600'>Snake Game</h1>
      <p className='mt-2 text-lg font-normal leading-relaxed'>Lets recape your childhood memories</p>
    </div>
    {/* game header ends */}
    {/* btns start */}
    <div className=' text-center space-x-2 text-base font-normal mt-3'>
      <Button className='rounded-xl bg-white text-green-700 font-semibold'
      onClick={startGame}
      >play</Button>
      {/* <Button className='rounded-xl bg-white text-green-700 font-semibold'
      onClick={pauseGame}
      >Pause</Button> */}
      <Button className='rounded-xl bg-white text-green-700 font-semibold'
      onClick={resetGame}
      >Reset</Button>
     
    </div>
    {/* btns ends */}

    {/* game container starts  */}
   
    <div className='grid grid-cols-10 gap-1 bg-[#0F0F0F]/50 p-2 pl-4 mt-4 m-3 rounded-xl'>
        {Array.from({length:100}).map((_ , i)=>{
          const x=i%10;
          const y=Math.floor(i/10);
          const isSnakePart=snake.some((part)=> part.x===x && part.y===y);
          const isFoodPart=  food.x === x && food.y === y;
          return <div
          key={i}
          className={`w-6 h-6   px-0 py-0 rounded-xl ${
            isSnakePart
              ? "bg-[#FF00FF]"
              : isFoodPart
              ? "bg-[#00FFFF]"
              : "bg-[#1E1E1E]"
          }`}
          >
          </div>
        })}
    </div>
    {/* score section starts */}
    <div className='text-center text-lg font-normal space-x-4 pt-4'>
    <span>Score:{score}</span>
    <span>High Score:{highScore}</span>
    </div>
  </div>
</div>
  )
}

export default SnakeGame