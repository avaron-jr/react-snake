import React from 'react';
import {render} from 'react-dom';

var checkSafe=(arr,newVal)=>{
    for(var i=0;i<arr.length;i++)
    {
      if(arr[i][0]==newVal[0] && arr[i][1]==newVal[1])
      return true;
    }
    return false;
  }
var updateName = () => {
    var name = window.prompt("Enter your name");
    localStorage.setItem('userName',name);
    return name;
  }
function Score(props){
  return (
    <div>
      {//<label>Welcome , <input value={props.userName}></input></label>  <button disabled={props.gameStatus==null} onClick={()=>{props.updateName()}}>change</button>
      }
      <label className="high-score-card">HighScore : {props.highScore}</label>
      <label className="score-card">Score : {props.score}</label>
    </div>
  )
}
function Snek(props){
  var snake = [];
  props.snekPosition.map((pos,i) => { 
        snake.push(<div key={i} className="snek" style={{top:pos[0]+'px',left:pos[1]+'px'}}></div>)}
  );
  return (
    <div className="snakeBody">
      {snake}
    </div>
  )
}
function Food(props){
return (
  <div className="food"  style={{top:props.foodPos[0]+'px',left:props.foodPos[1]+'px'}}></div>
)
}
function Result(props){
  return (
    <div className="box">
      <div className="result">
        <h2>{props.gameStatus}</h2>
        <h5>Your score : {props.score}</h5>
        <button id="play"onClick={()=>props.resetGame()}>Play Again</button>
      </div>
      </div>
  )
}
function random() {
  return Math.floor(Math.random()*30) * 10;
}
Snek.max = 300;
class Game extends React.Component {
  static initialize()  {
    return {
      snekPosition : [[20,10]],
      foodPos : [random(),random()],
      direction : 'r',
      score : 0,
      highScore : 0,
      userName : null,//localStorage.getItem('userName') ? localStorage.getItem('userName') : this.updateName(),
      gameStatus : null,
      snekSpeed : 1000,
    }
    };
  constructor(props) {
    super(props);
    this.random2A = this.random2A.bind(this);
    this.state = Game.initialize();
    this.checkSnekEat = this.checkSnekEat.bind(this);
    this.snekMove = this.snekMove.bind(this);
    this.snekMotion = this.snekMotion.bind(this);
    
  }
  random2A(){
    var arr = [random(),random()];
    return checkSafe(this.state.snekPosition,arr) ? this.random2A() : arr;
  }
  
  snekMotion(direction){
    if(!this.state.gameStatus){
      switch(direction) {
        case 'u' : {
          if(this.state.direction == 'd') break;
          this.snekMove([this.state.snekPosition[0][0]-10,this.state.snekPosition[0][1]]); break;
        }
        case 'd' : {
          if(this.state.direction == 'u') break;
          this.snekMove([this.state.snekPosition[0][0]+10,this.state.snekPosition[0][1]]); break;
        }
        case 'l' : {
          if(this.state.direction == 'r') break;
          this.snekMove([this.state.snekPosition[0][0],this.state.snekPosition[0][1]-10]); break;
        }
        case 'r' : {
          if(this.state.direction == 'l') break;
          this.snekMove([this.state.snekPosition[0][0],this.state.snekPosition[0][1]+10]); break;
        }
      }
      this.checkSnekEat();
    }
    switch(this.state.snekPosition.length) {
      case 15 : {this.setState({snekSpeed:850});break; }
      case 30 : {this.setState({snekSpeed:700});break; }
      case 50 : {this.setState({snekSpeed:600});break; }
      case 75 : {this.setState({snekSpeed:500});break; }
      case 90 : {this.setState({snekSpeed:400});break; }
      case 130 : {this.setState({snekSpeed:300});break; }
    }
    setTimeout(() => {this.snekMotion(this.state.direction)},this.state.snekSpeed);
  }
  snekPos(e) {
    var k = e.keyCode;
    if(k == 37)
    {
      if(this.state.direction == 'r') return;
      this.setState({direction : 'l'});
      this.snekMove([this.state.snekPosition[0][0],this.state.snekPosition[0][1]-10]);
    }
    if(k == 38)
    {
      if(this.state.direction == 'd') return;
      this.setState({direction : 'u'});
      this.snekMove([this.state.snekPosition[0][0]-10,this.state.snekPosition[0][1]]);
    }
    if(k == 39)
    {
      if(this.state.direction == 'l') return;
      this.setState({direction : 'r'});
      this.snekMove([this.state.snekPosition[0][0],this.state.snekPosition[0][1]+10]);
    }
    if(k == 40)
    {
      if(this.state.direction == 'u') return;
      this.setState({direction : 'd'});
      this.snekMove([this.state.snekPosition[0][0]+10,this.state.snekPosition[0][1]]);
    }
    if(k == 32 && this.state.gameStatus)
    {
      this.resetGame();
    }
    this.checkSnekEat(); 
  }
  
  snekMove(newVal) {
    if(newVal[0] == -10 || newVal[0] == Snek.max || newVal[1] == -10 || newVal[1] == Snek.max || checkSafe(this.state.snekPosition,newVal))
    {
      this.setState(prevState => ({
        gameStatus : 'Game Over!',
        highScore : prevState.score > prevState.highScore ? prevState.score : prevState.highScore,}));
    }
    var tempSnake = this.state.snekPosition;
    tempSnake.pop();
    tempSnake.unshift(newVal);
    this.setState(prevState => ({
      snekPosition : tempSnake
    }))
  }
  checkSnekEat() {
    if(this.state.snekPosition[0][0] == this.state.foodPos[0] && this.state.snekPosition[0][1] == this.state.foodPos[1])
    {
      this.setState((prevState)=> ({
        foodPos : this.random2A(),
        score : prevState.score + 1,
      }));
      var tempSnake = this.state.snekPosition;
      tempSnake.push([tempSnake[tempSnake.length-1][0],tempSnake[tempSnake.length-1][1]]);
      this.setState(prevState => ({
        snekPosition : tempSnake
      }))
    }
  }
  resetGame(){
    this.setState(prevState => ({
      snekPosition : [[20,10]],
      foodPos : [random(),random()],
      direction : 'r',
      score : 0,
      userName : null,
      gameStatus : null,
      snekSpeed : 1000,
    }));
    //this.snekMotion(this.state.direction);
    console.log("Game reset");
  }
  componentDidMount() {
    console.log("Component did mount");
    window.addEventListener('keydown',this.snekPos.bind(this));
    this.snekMotion(this.state.direction);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown');
    console.log("Component will unmount");
  }
  render() {
    const {snekPosition,foodPos,score,userName,gameStatus,highScore} = this.state;
    return (
      <div className="game-area">
        <Score gameStatus={gameStatus} score={score} highScore={highScore} userName={userName} updateName={updateName}/>
        {
          gameStatus ?  <Result gameStatus={gameStatus} score={score} resetGame={this.resetGame.bind(this)}/> :  
            <div className="box" ref="myRef">
              <Food foodPos={foodPos}/>
              <Snek snekPosition={snekPosition}/>
            </div>
        }
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return ( 
      <div>
        <Game />
      </div>
    )
  }
}

render(<App />,document.getElementById('app'));
