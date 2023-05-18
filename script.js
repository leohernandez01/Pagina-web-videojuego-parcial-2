let canvas = document.getElementById('myCanvas');
  /** @type {CanvasRenderingContext2D}  */
let ctx = canvas.getContext("2d");
let nextCanvas = document.getElementById('nextCanvas'); 
/** @type {CanvasRenderingContext2D}  */ 
let nextCtx = nextCanvas.getContext("2d");
let result_container = document.getElementsByClassName('result-container');

//################################################################################# Globals

var keys = [];
var animationId;
var playButton = document.querySelector('#controls__play');
var score = document.querySelector('#score__text')
var levelElement = document.querySelector('#level__text')
var mobile__contorls_element = document.querySelector('#mobile__contorls')
var next__block_element = document.querySelector('#next-block')
//################################################################################# Globals
//################################################################################# audio files
const audio_oneline = document.querySelector('#oneline')
const audio_fourlines = document.querySelector('#fourlines')
const audio_gameover = document.querySelector('#gameover')
//################################################################################# audio files

ctx.canvas.width = singleBlockSize * wellColumns;
ctx.canvas.height = singleBlockSize * wellRows;


result_container[0].style.width =  '145px';
result_container[0].style.height = singleBlockSize * wellRows +'px';






//################################################################################# main
moves = {
    down: bp => ({...bp, y: bp.y + 1}),
    left: bp => ({...bp, x: bp.x - 1}),
    right: bp => ({...bp, x: bp.x + 1}),
    up: bp => board.rotate(bp)
}


function moveDown(){
    if(frameCount- downFC>gameSpeed && !isGameOver && !isGameWon){
        downFC=frameCount;
        bp = board.piece;    
        p = moves.down(bp)                        
        if(board.piece.reachedBottom(p)){
            board.piece.freeze(p);
            board.getNewPiece();            
            
        }else {
            board.piece.move(p)        
        }
        board.draw();
    }
    
}

function getScore(level)  {
    if (level==1)
    {
        return levelTargets.level1.score
    }
    else if (level==2)
    {
        return levelTargets.level2.score
    }
    else if (level==3)
    {
        return levelTargets.level3.score
    }
    else if (level==4)
    {
        return levelTargets.level4.score
    }

}


var VarkeyDownHandler = function keyDownHandler(event){  
      
    bp = board.piece;    
    if(event.key == 'ArrowDown'){
        p = moves.down(bp)        
                
        if(board.piece.reachedBottom(p)){
            board.piece.freeze(p);
            board.getNewPiece();            
            
        }else {
            board.piece.move(p)        
        }
        board.draw();
        
    }else if(event.key == 'ArrowLeft'){
        p = moves.left(bp)
        if(board.piece.move(p)){
            if(board.piece.reachedBottom(p) ){
                board.piece.freeze(p);
                board.getNewPiece();
                
            }
        }
        board.draw();
    }else if(event.key == 'ArrowRight'){
        p = moves.right(bp)
        if(board.piece.move(p)){
            if(board.piece.reachedBottom(p) ){
                board.piece.freeze(p);
                board.getNewPiece();
                
            }
        }
        board.draw();
    }else if(event.key == 'ArrowUp'){
        
        bp = moves.up(bp)
        if(board.piece.reachedBottom(bp) == 0){
            board.piece.move(bp)      
            board.draw();
        }        
    }
    

    
}


async function gameOver(text){
    cancelAnimationFrame(animationId);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0, 0.5)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
    ctx.font = "30px Chelsea Market";    
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width/2,canvas.height/2);   
    playButton.textContent='Jugar' ;
    document.removeEventListener('keydown',  VarkeyDownHandler);
    mobile__contorls.removeEventListener('click',mediaEventHandler);
    
}

//################################################################################# main
let board;
function playButtonHandler(){
    if(playButton.textContent=='Jugar'){
        resetGame();
        playButton.textContent='Pausa';        
        board= new Board(ctx);
        well = board.getEmptyBoard();
        document.addEventListener('keydown',   VarkeyDownHandler);
        mobile__contorls.addEventListener('click',mediaEventHandler);
        animate()
    }else
    if(playButton.textContent=='Pausa'){                
        pauseGame();
    }else
    if(playButton.textContent=='Continuar'){
        resumeGame();
    }
}

async function animate(){    
    frameCount++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    moveDown();
    board.draw();       
    if(isGameOver ){
        //audio_gameover.play()
        gameOver("Perdiste");
    }
    if(isGameWon ){
        gameOver("Ganaste!");
    }    
    if(levelIncreased){
        levelIncreased=false;
        await drawLevels(currentLevel);
    }
    if(!isGameOver){
        animationId = requestAnimationFrame(animate);            
    }
}

function resetGame(){
    frameCount=0;
    isGameWon=false;
    downFC=0;
    frameCount=0;
    isGameOver=false;
    score.textContent=0;
    levelElement.textContent=1;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    well=null;
    board=null;    
    totalLinesCleared=0;
    gameSpeed=55;
    currentPiece = null;
    nextPiece = null;
    cancelAnimationFrame(animationId);
    tetrisCount = 0;
    currentLevel=1;
    levelIncreased = true;
    generatedBlocksCount = 0;
}

function pauseGame(){
        playButton.textContent='Continuar';
        cancelAnimationFrame(animationId);
        document.removeEventListener('keydown',  VarkeyDownHandler);
        mobile__contorls.removeEventListener('click',mediaEventHandler);
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0, 0.5)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.restore();
        ctx.font = "30px Chelsea Market";    
        ctx.textAlign = "center";
        ctx.fillText("Pausado", canvas.width/2,canvas.height/2);  
}

function resumeGame(){
        playButton.textContent='Pausa';
        animate();
        document.addEventListener('keydown',   VarkeyDownHandler);
        mobile__contorls.addEventListener('click',mediaEventHandler);
}

playButton.addEventListener('click',playButtonHandler)


//########################################################################### media queries
function mediaFunction(media) {
    if (media.matches) { // If media query matches
        mobile__contorls_element.style.display = 'Flex';
        //next__block_element.style.display='none';
        next__block_element.style.height="25%"
        var mobile__contorls = document.querySelector('#mobile__contorls')
    } 
  }

  function mediaEventHandler(){
      event.preventDefault();
      let tId = event.target.parentElement.id;
      let Id = event.target.id;
      bp = board.piece;    

      if(tId=='rotate' || Id=='rotate'){
            bp = moves.up(bp)
            if(board.piece.reachedBottom(bp) == 0){
                board.piece.move(bp)      
                board.draw();
            }   
      }
      if(tId=='left__div' || Id=='left__div'){
        p = moves.left(bp)
        if(board.piece.move(p)){
            if(board.piece.reachedBottom(p) ){
                board.piece.freeze(p);
                board.getNewPiece();
                
            }
        }
        board.draw();
      }
      if(tId=='right__div' || Id=='right__div'){
            p = moves.right(bp)
            if(board.piece.move(p)){
                if(board.piece.reachedBottom(p) ){
                    board.piece.freeze(p);
                    board.getNewPiece();
                    
                }
            }
            board.draw();
      }
      if(tId=='down' || Id =='down'){
        p = moves.down(bp)        
                
        if(board.piece.reachedBottom(p)){
            board.piece.freeze(p);
            board.getNewPiece();            
            
        }else {
            board.piece.move(p)        
        }
        board.draw();
      }
  }
  
  var media = window.matchMedia("(max-width: 600px)")
  mediaFunction(media) // Call listener function at run time
  media.addListener(mediaFunction)




//########################################################## next canvas
nextCtx.canvas.height=singleBlockSize*4;
nextCtx.canvas.width='150';



function drawRules(){           
    ctx.fillStyle="white";
    ctx.textAlign = "center";
    ctx.font = "30px Chelsea Market";    
    ctx.fillText("Reglas", canvas.width/2,40);     
    ctx.font = "normal normal 20px Caveat";    
    ctx.fillText("--------------", canvas.width/2,60);      
    ctx.fillText("Puntuación:", canvas.width/4,84);  
    ctx.font = "13px Raleway";    
    ctx.textAlign = "left";
    ctx.fillText("1 linea:   40 puntos", 30,110);      
    ctx.fillText("2 lineas:   80 puntos", 30,126);      
    ctx.fillText("3 lineas:   160 puntos", 30,141);      
    ctx.fillText("4 lineas:   320 puntos", 30,156); 
    ctx.font = "15px Chelsea Market";    
    ctx.fillText("Tetris:  4 lineas", 30,175); 
    ctx.font = "20px Caveat";           
    ctx.fillText("Niveles:", 30,230); 
    ctx.font = "13px Raleway";          
    ctx.fillText("N1: 200 puntos", 30, 256);      
    ctx.fillText("N2: 600 puntos", 30,271);      
    ctx.fillText("N3: 900 puntos", 30,286);      
    ctx.fillText("N4: 1200 puntos", 30,301); 
    ctx.font = "20px Caveat";           
    ctx.fillText("Como ganar:", 30,350); 
    ctx.font = "13px Raleway";          
    ctx.fillText("Alcanza una puntuación de:", 30, 376);      
    ctx.fillText("Score 1200 puntos", 88, 396);  
    nextCtx.fillStyle="white";    
    nextCtx.font = "15px Chelsea Market";    
    nextCtx.fillText("Siguiente pieza", 20,50); 
    

}

async function drawLevels(level){        
    document.removeEventListener('keydown',  VarkeyDownHandler);
    mobile__contorls.removeEventListener('click',mediaEventHandler);
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle="white";
    ctx.textAlign = "center";
    ctx.font = "30px Chelsea Market";    
    ctx.fillText(`Nivel ${level}`, canvas.width/2,canvas.height/2);   
    ctx.font = "normal normal 20px Caveat";              
    ctx.fillText(`Objetivo: ${getscore(level)} puntos`, canvas.width/2,canvas.height/2 + 40); 
    ctx.font = "normal normal 12px Verdana";                   
    ctx.fillText("(Tetris: 4 Lineas)", canvas.width/2,canvas.height/2 + 70);   
    await sleep(4000);
        
    document.addEventListener('keydown',   VarkeyDownHandler);
    mobile__contorls.addEventListener('click',mediaEventHandler);
}

window.addEventListener('DOMContentLoaded',()=>{
    window.addEventListener('load',drawRules);
     document.getElementsByClassName('hidethis')[0].style.display="none";
     document.getElementsByClassName('hidethis')[1].style.display="none";
    
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  