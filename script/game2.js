var cvs = document.getElementById("canvas1");
var ctx = cvs.getContext("2d");

var cat1 = new Image();
var cat2 = new Image();
var cat3 = new Image();
var bg = new Image();
var ellipse = new Image();
var cloud = new Image();

var score_audio = new Audio();
var cat_audio = new Audio();

cat1.src = "img/cat/cat1.png";
cat2.src = "img/cat/cat2.png";
cat3.src = "img/cat/cat3.png";
bg.src = "img/bg.png";
ellipse.src = "img/ellipse.png";
cloud.src = "img/cloud.png";

score_audio.src = "audio/score_audio.mp3"
cat_audio.src = "audio/cat_audio.mp3"

var score = 0;
//creating ellipse//
var circle = [];

circle[0] = {
    x: cvs.width,
    y: 200,
    idC: 0
}
//creating ellipse//

//move up cat//
document.addEventListener("keydown", moveUp);

function moveUp() {
    yPos -= 60;
};
//move up cat

// cat position//

var xPos = 0;
var yPos = 150;
var grav = 2;

// cat position//

function draw(){
    cat_audio.play();    // audio cat
    ctx.drawImage(bg, 0, 0);  // draw bg
    ctx.drawImage(cloud, 0, 0); // upper cloud
    ctx.drawImage(cloud, 0, cvs.height - cloud.height + 10);  // bottom cloud
    for(var i = 0; i < circle.length; i++){
        idC = i;
        if( i % 30 == 0){
            ctx.drawImage(cat2, xPos, yPos)
        }
        


        ctx.drawImage(ellipse, circle[i].x, circle[i].y);  // draw star
        circle[i].x--;   // xPos-- of star
        // draw star in random yPos     
        if(circle[i].x == 125){
            circle.push({
                x: cvs.width,
                y: Math.floor(Math.random() * cvs.height - ellipse.height) 
            });
        }
        //if cat in the bottom of the screen
        if(yPos + cat1.height >= cvs.height){
            yPos = cvs.height- cat1.height; // set location for cat
        }
        
        if(yPos < 0){
            yPos = 0;
        }

        // cat touch 
        if(circle[i].x <= 120 && yPos >= circle[i].y && yPos <= (circle[i].y + ellipse.height)){
            score++;
            score_audio.play();
            circle[i] = [];
        }

    }
    //ctx.drawImage(cat, xPos, yPos);
    
    ctx.fillStyle = "#000";
    ctx.font = "24px Verdana";
    ctx.fillText("Score: " + score, 10, cvs.height - 20);


    yPos += grav;
    
}
var interval2;
$("#gameStart").click(()=>{
    interval2 = setInterval(draw, 45);
    xPos = 0;
    yPos = 150;
    
})

$("#chart-tab").click(()=>{
    stopAll();
})
$("#home-tab").click(()=>{
    stopAll();
})
$("#gameStop").click(()=>{
    stopAll();
})

function stopAll(){
    
    clearInterval(interval2);
    cat_audio.pause();
}

