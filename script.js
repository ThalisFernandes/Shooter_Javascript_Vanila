const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const shootSound = new Audio('../sounds/shoot.mp3');
const zombieSound = new Audio('../sounds/Zombie.mp3');
const hit = new Audio('../sounds/hit.mp3');
const endgame = new Audio('../sounds/endGame.mp3')
const ambiente = new Audio('../sounds/ambient.mp3');
const playerCondition = {
    deathCounter: 0,
    lifeCounter: 0,
    gamebegin: true
}
const playerImage = new Image();
const enemyImg = new Image();
const playerDetails = {
    width: 20,
    height: 20,
    psY: 10,
    psX: 10,
    vel: 10,
    blckR: false,
    blckL: false,
    blckT: false,
    blckD: false
}
const bulletProps = {
    width:  2,
    height: 2,
    pX: (playerDetails.psX +20),
    pY: 0,
    vel:    10,
    shoot: false
}
var blocked_position = '';
const enemy = {
    width: 20,
    height: 20,
    psY: 50,
    psX: 300,
    vel: 10
}
ambiente.play();
ambiente.loop = true;
function draw(){
    drawMap();
    if(playerCondition.lifeCounter > 0 && playerCondition.deathCounter < 15){
        player();
        dispararEnemy()
        if(bulletProps.shoot){
            shoot(playerDetails.psX,playerDetails.psY)
        }
        fragCounter(playerCondition.deathCounter)
        mostrarvida(playerCondition.lifeCounter)
        enemyHit()
        enemyHitPlayer(playerDetails.psX,playerDetails.psY, enemy.psX, enemy.psY)
        blockplayerMovement(playerDetails.psX,playerDetails.psY, enemy.psX, enemy.psY);
        releasePlayerMovement(playerDetails.psX,playerDetails.psY, enemy.psX, enemy.psY);
        enemyReaction(playerDetails.psX,playerDetails.psY, enemy.psX, enemy.psY);
        requestAnimationFrame(draw);
    } else if (playerCondition.lifeCounter == 0 && playerCondition.gamebegin != true){
        endgame.play();
        ctx.fillStyle = "#ff0000";
        ctx.font = "25px Arial"
        ctx.fillText('Você morreu',50,100);
        ctx.font = '10px Arial'
        ctx.fillText(`Você matou ${playerCondition.deathCounter} Zumbis`,85, 115)
        ctx.fillText('aperte <Enter>', 85, 125);
    } else if (playerCondition.deathCounter >= 15){

        ctx.fillStyle = "#00ff00";
        ctx.font = "10px Arial"
        ctx.fillText('Parabéns, você acabou com a infestação de zumbis.',25,100);
        ctx.font = '10px Arial'
        ctx.fillText('Aperte <Enter> para Jogar de Novo', 85, 115);
    } else {
        ctx.fillStyle = "#00ff00";
        ctx.font = "10px Arial"
        ctx.fillText('Sua missão é defender seu abrigo dos zumbis, boa sorte.',25,100);
        ctx.font = '10px Arial'
        ctx.fillText('Aperte <Enter> para Começar', 85, 115);
    }

}
function drawMap(){
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0, canvas.width, canvas.height);
}

function player(){
    playerImage.src="./imgs/player.png";
    ctx.drawImage(playerImage, playerDetails.psX, playerDetails.psY, playerDetails.width, playerDetails.height)
}
function enemyFunc(px, py){
    enemyImg.src = './imgs/enemyL.png';
    ctx.drawImage(enemyImg, px, py, enemy.width, enemy.height)
}

function blockplayerMovement(plrX, plrY, enX, enY){
    if((plrX + 20) === enX){
        playerDetails.blckR = true

    }else if((plrX - 20)=== enX && plrY === enY){

    }
}
function releasePlayerMovement(plrX, plrY, enX, enY){
    if((plrX+20) < enX){
        playerDetails.blckR = false
    }
}
function enemyReaction(plrX, plrY, enX, enY){
    if((plrX+ 10) === Math.floor(enX)){
        hit.play();
        enemy.psX = 300
        enemy.psY =  Math.floor(Math.random()* 130)
        playerCondition.lifeCounter--
    }
}
function bullet(psX,plY){
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(psX, plY+13, 2, 2);
    
}

function shoot(plX, plY){
    if(bulletProps.pY === 0) bulletProps.pY = plY;
    if (bulletProps.pX > 250){
        bulletProps.shoot = false;
        bulletProps.pX = playerDetails.psX + 20;
        ctx.clearRect(bulletProps.pX,bulletProps.pY, 2, 2);
    }
    bullet(bulletProps.pX,bulletProps.pY);
    bulletProps.pX += 2;
    
}
function enemyHit(){
    if(bulletProps.pX ==  parseInt(enemy.psX) && (enemy.psY - bulletProps.pY) < 10 && bulletProps.shoot){
        playerCondition.deathCounter++
        bulletProps.pX = playerDetails.psX + 20
        bulletProps.shoot = false
        enemy.psX = 300
        enemy.psY = Math.floor(Math.random()* 130)
    }
}
function enemyHitPlayer(plPx, plPy, enPx, enPy){
    if(enPx === (plPx + 20)){
        alert('Hitado')
        enemy.psX = 300
        enemy.psY =  Math.floor(Math.random()* 130)
    }
}
function dispararEnemy(){
    zombieSound.play();
    let oldEnemyPx = enemy.psX;
    enemyFunc(oldEnemyPx, enemy.psY);
    enemy.psX -= 0.3
    if (enemy.psX < -10){
        enemy.psX = 300
        enemy.psY = Math.floor(Math.random()* 130)
    }
}
function mostrarvida(hlt){
   ctx.fillStyle =  hlt >=6 ? '#00ff00' :  hlt < 6 && hlt > 3 ? '#ffa500': hlt < 3 && hlt >=1 ? '#ff0000' : ''
   ctx.fillRect(0,0, hlt * 10, 10);
}

function fragCounter(kills){
    ctx.fillStyle =  kills > 10 ? '#00ff00' :  kills > 6 ? '#ffa500': kills <= 6 ? '#ff0000' : '';
    ctx.fillText(`Kills: ${kills}`, 0, 150)
}

draw()
window.addEventListener('keydown', (e)=>{
    if(e.keyCode === 37 && !(playerDetails.blckL)){
        playerDetails.psX--
    } else if(e.keyCode === 38 && !(playerDetails.blckT)){
        playerDetails.psY--
    }else if(e.keyCode === 39 && !(playerDetails.blckR)){
        playerDetails.psX++
    }else if(e.keyCode === 40 && !(playerDetails.blckD)){
        playerDetails.psY++
    } else if(e.keyCode === 32){
        if(bulletProps.shoot == false) shootSound.play()
        bulletProps.pY = playerDetails.psY
        bulletProps.shoot = true;

    } else if(e.keyCode === 13){
        if(playerCondition.lifeCounter == 0 && playerCondition.gamebegin){
            playerCondition.lifeCounter = 10
            playerCondition.gamebegin = false
            draw()
        } else if (playerCondition.lifeCounter  > 0 && playerCondition.deathCounter > 15){
            playerCondition.lifeCounter = 10
            playerCondition.deathCounter = 0
            draw()
        }else if(playerCondition.lifeCounter == 0){
            playerCondition.lifeCounter = 10
            playerCondition.deathCounter = 0
        }
       

    } 
})

