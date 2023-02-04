const canvas = document.getElementById('canvas');
const back = document.getElementById('background');
const start = document.getElementById('intromessage');
const ground = document.getElementById('ground');
const pipe1 = document.getElementById('pipe1');
const pipe2 = document.getElementById('pipe2');
const gameover = document.getElementById('gameover');

const birds = [
    document.getElementById('bird'),
    document.getElementById('bird2'),
]

const numbers = [
    document.getElementById('0'),
    document.getElementById('1'),
    document.getElementById('2'),
    document.getElementById('3'),
    document.getElementById('4'),
    document.getElementById('5'),
    document.getElementById('6'),
    document.getElementById('7'),
    document.getElementById('8'),
    document.getElementById('9'),
]

const scoreSound = document.getElementById('score-sound');
const dieSound = document.getElementById('die-sound');
const swooshSound = document.getElementById('swoosh-sound');
const flapSound = document.getElementById('flap-sound');
const hitSound = document.getElementById('hit-sound');

const board = canvas.getContext('2d');
let playing = false, gOver = false
let gravity = 0.5, velocity = 0, score = 0, highscore = 0
let bird, pipe, pipes, b =0, looping, flapWings

function init() {
    board.drawImage(intromessage, 50, 100, 280, 480)
    displayHighScore()
    gravity = .5
    velocity = 0
    pipes = [ {x:400, y: 250} ]
    bird = {y: 280, img: birds[0]} 
    score = 0
}

document.onkeydown = function() {
    swooshSound.play()
    flapSound.play()
     
    if( playing ) velocity =- 9
    else if( gOver){
        gOver = false
        clear()
        init()
    }
    else {
        
        playing = true
        looping = setInterval(loop, 20)
        flapWings = setInterval(changeBird, 100)
    }
}

function loop() {
    clear()

    pipe = pipes[pipes.length-1]
    if( pipe.x <= 150) generatePipe() 
    velocity +=gravity
    bird.y +=velocity
    drawBird()
    drawPipes()
    if(bird.y >= 510 && !gOver) gameOver()

    drawScore()

}

function drawBird() {
    board.drawImage(bird.img, 70, bird.y, 55, 40)
}

function changeBird() {
    b = b == 0? 1: 0
    bird.img = birds[b]
}

function gameOver() {
    dieSound.play()
    clearInterval(looping)
    clearInterval(flapWings)
    board.drawImage(gameover, 50, 100, 300, 100)
    gOver = true
    playing = false
    dieSound.play()
}

function drawPipes() {
    for ( var i=0; i<pipes.length; i++ ) {
        pipe = pipes[i]
        pipe.x += -2 
        board.drawImage(pipe1, pipe.x, pipe.y, 50, 400)
        board.drawImage(pipe2, pipe.x, pipe.y-550, 50, 400)

        if(pipe.x < 125 && (pipe.x+50) > 70 ){
            if(bird.y < pipe.y-150 || bird.y+40 > pipe.y){
                hitSound.play()
                gOver = true
            }
           
        }

        //checking of score
        else if( (pipe.x+50) <= 80 && !pipe.score) {
            scoreSound.play()
            pipe.score = true
            score++
            drawScore()
        }
    }
    if( gOver) gameOver()
    board.drawImage(ground, -40, 550, 480, 130)

}

function generatePipe() {
    var y = 250 + Math.floor(Math.random()*200)
    pipes.push( {
        x:300,
        y: y,
        score: false
    } )    
}

function clear() {
    board.drawImage(bg, 0, 0, 400, 680)
}



function drawScore() {
    var x = 190, y = 20
    var s = (score+"").split("")
    s.map( m =>{
        var i = parseInt(m)
        board.drawImage(numbers[i], x, y, 20, 30)
        x +=22
    })    
}

function displayHighScore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
      }
      
      //To retrieve the highscore
      highscore = localStorage.getItem("highscore") || 0;

    var x = 190, y = 50
    var hs = (highscore+"").split("")
    hs.map( m =>{
        var i = parseInt(m)
        board.drawImage(numbers[i], x, y, 20, 30)
        x +=22
    })    
}

window.onload = function(){
    clear()
    init()
}