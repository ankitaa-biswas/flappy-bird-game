//background
let board;
let boardwidth=450;
let boardheight=740;
let context;


//birds
let birdwidth=34;
let birdheight=24;
let birdX=boardwidth/8;
let birdY=boardheight/2;
// let birdimage;
let birdimages=[];
let birdimagesInd=0;



 let bird={
    x:birdX,
    y:birdY,
    width:birdwidth,
    height:birdheight
    
 }


//pipes
 let pipeArray=[];
 let pipeWidth=64;
 let pipeHeight=512;
 let pipeX = boardwidth;

 let pipeY=0;
 
 
 let topPipeImg;
 let bottomPipeImg;



let velocityx=-2;//pipes moving left speed
let velocityY=0;//birds jump speed
let gravity=0.4 ;
let gameOver=false;
let score=0;

//sound
let wingSound=new Audio("assets/sfx_wing.wav");
let hitSound=new Audio(".assets/sfx_hit.wav");
let bgm=new Audio("assets/bgm_mario.mp3");
bgm.loop=true;




window.onload=function(){
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context=board.getContext("2d");


    
    
//    birdimage=new Image();
//    birdimage.src="/flappybird.png";
//    birdimage.onload=function(){
//     context.drawImage(birdimage,bird.x,bird.y,bird.width,bird.height);
//    }


for(let i=0;i<4;i++){
    let birdimage=new Image();
    birdimage.src=`assets/flappybird${i}.png`;
    birdimages.push(birdimage);
}

   topPipeImg=new Image();
   topPipeImg.src="assets/toppipe.png";


   bottomPipeImg=new Image();
   bottomPipeImg.src="assets/bottompipe.png";



  requestAnimationFrame(update);
  setInterval(placepipes,1500);//setting the pipe for every 1500 miliseconds

  setInterval(animateBird,100);

  document.addEventListener("keydown",movebird);
 



}

function update(){
    if(gameOver){
        return ;
    }
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width,board.height);


    //bird  
    velocityY+=gravity;
    bird.y+=velocityY;
    bird.y=Math.max(bird.y+velocityY,0);//apply gravity to current bird.y,limit the bird to top of canvas
    // context.drawImage(birdimage,bird.x,bird.y,bird.width,bird.height);


    context.drawImage(birdimages[birdimagesInd],bird.x,bird.y,bird.width,bird.height);
    



    if(bird.y>board.height){
        gameOver=true;
    }
    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x +=velocityx;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
    

     //updating scores

        if(!pipe.passed && bird.x>pipe.x+pipe.width){
            score+=0.5;//0.5 because there are two pipes
            pipe.passed=true;
        }

        if(detectCollision(bird,pipe)){
            hitSound.play();
            gameOver=true;
        }
    }
//clearing pipes
while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
    pipeArray.shift();//removes first element from the array
}


   //score
   context.fillStyle="white";
   context.font="45px sans-serif";
   context.fillText(score,5,45);

   //game over
   if(gameOver){
    context.fillText("GAME OVER",5,90);
    bgm.pause();
    bgm.currentTime=0;  
   }

}

function animateBird(){
    birdimagesInd++;
    birdimagesInd %=birdimages.length;
}
function placepipes(){
    if(gameOver){
        return;
    }
    let randomPipeY=pipeY - pipeHeight/4 -Math.random()*(pipeHeight/2) ;
    let openspace=board.height/4;

    let toppipe={
        img:topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }
    pipeArray.push(toppipe);
    let bottompipe={
        img:bottomPipeImg,
        x:pipeX,
        y: randomPipeY + pipeHeight + openspace,
        width:pipeWidth,
        height:pipeHeight,
        passed:false,

    }
    pipeArray.push(bottompipe);
    

}

function movebird(e){

    if(e.code=="Space"|| e.code=="ArrowUp" || e.code=="keyX")
    {
        if(bgm.paused){
            bgm.play();
        }
        
    wingSound.play();

        if (gameOver) {
            resetGame(); // Reset the game instead of jumping
        } else {
            velocityY = -6; // Make the bird jump
        }
    }
    
}


function resetGame() {
    // Reset game variables
    bird.y = birdY;
    velocityY = 0;
    pipeArray = [];
    score = 0;
    gameOver = false;
    requestAnimationFrame(update);

}
function detectCollision(a,b){

    return a.x< b.x + b.width &&
           a.x + a.width >b.x &&
           a.y<b.y +b.height &&
           a.y + a.height>b.y;
}




