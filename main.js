/* canvas 셋팅하기 */
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext('2d')
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameoverImage;
let gameOver = false; //true면 게임이 끝남!
let score = 0;

/* 우주선 좌표 */
let spaceshipX = canvas.width/2-30
let spaceshipY = canvas.height - 61

let bulletList = [] //총알저장하는 리스트
function Bullet(){
  this.x=0;
  this.y=0;
  this.init=function(){ //초기화
    this.x=spaceshipX+20;
    this.y=spaceshipY-60;
    this.alive = true

    bulletList.push(this)
  };
  this.update = function(){
    this.y -=7
  };
  this.checkHit=function(){
    for(let i =0; i < enemyList.length; i++){
      if(this.y <= enemyList[i].y && this.x >=enemyList[i].x && this.x <=enemyList[i].x+40){
        score++;
        this.alive = false;
        enemyList.splice(i,1);
      }//if
    }
  }
}

function generateRandomValue(min,max){
  let randomNun = Math.floor(Math.random()*(max-min+1))+min
  return randomNun
}

let enemyList = []
function Enemy(){
  this.x=0;
  this.y=0;
  this.init=function(){ //초기화
    this.y=0;
    this.x=generateRandomValue(0, canvas.width-70)
    enemyList.push(this)
  };
  this.update = function(){
    this.y +=4 //적군의 속도조절
  if(this.y >= canvas.height - 70){
    gameOver = true;
    
  }
  };
}

/* 이미지 불러오기 */
function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src ="img/space.png";

  spaceshipImage = new Image();
  spaceshipImage.src = "img/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "img/bullets.png";

  enemyImage = new Image();
  enemyImage.src = "img/enemy.png";

  gameoverImage = new Image();
  gameoverImage.src = "img/gameover.png";
}

/* 게임 조작 키 관련 */
let keysDown = {}
function setupKeyboardListener(){
  document.addEventListener("keydown",function(event){
    keysDown[event.keyCode] = true;
   
  });
  document.addEventListener('keyup',function(event){
    delete keysDown[event.keyCode];//버튼을 떼는 순간 해당 값이 사라짐!!

    if(event.keyCode == 32){
      createBullet()//총알생성
    }
  })
}

function createBullet(){
  console.log('총알생성')
  let b = new Bullet()
  b.init()
}

function createEnemy(){
  const interval = setInterval(function(){
    let e = new Enemy()
    e.init()
  },1000)
}

function update(){
  if(39 in keysDown){
    spaceshipX +=5; //우주선속도
  }//right
  if(37 in keysDown){
    spaceshipX -=5;
  }
  if(spaceshipX <=0){
    spaceshipX=0
  }
  if(spaceshipX >= canvas.width-60) {
    spaceshipX = canvas.width - 60
  }

  //총알 y좌표 업데이트
  for (let i = 0; i<bulletList.length; i++){
    if(bulletList[i].alive){
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }


   //전구 y좌표 업데이트
   for (let i = 0; i<enemyList.length; i++){
    enemyList[i].update()
  }
  // if(38 in keysDown){
  //   spaceshipY -=5;
  // }
  // if(40 in keysDown){
  //   spaceshipY +=5;
  // }
  // if(spaceshipY <=0){
  //   spaceshipY=0
  // }
  // if(spaceshipY >= canvas.height-60) {
  //   spaceshipY = canvas.height - 60
  // }
}

/* 화면에 표시 */
function render(){
  ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
  ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY)
  ctx.fillText(`score:${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  for(let i =0; i<bulletList.length; i++){
    if(bulletList[i].alive){
      ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y)
    }
  }
  for(let i=0; i<enemyList.length; i++){
    ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
  }
}

function main(){
    if(!gameOver){
      update() //좌표값을 업데이트하고
      render(); // 그려주고
      requestAnimationFrame(main)
    }else{
      ctx.drawImage(gameoverImage, 10,100,380,380);
    }
  
}

loadImage()
setupKeyboardListener()
createEnemy()
main()


//총알만들기
//1. 스페이스를 누르면 총알발사
//2. 총알발사 = 총알의 y값 --, 총알의 x 값은 스페이스를 누른 수간의 우주선의 x 좌표
//3. 발사된 총알들을 총알배열에 저장함
//4. 모든 총알들은 x,y좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render 그려준다