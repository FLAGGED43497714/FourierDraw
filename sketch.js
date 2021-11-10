

const USER = 0 ;
const FOURIER = 1;

let y = [];
let x = [];

let fourierY ;
let fourierX ;

let time = 0 ;
let path = [] ;

let drawing = [] ;
let state = -1  ;

function mousePressed() {
    state = USER ;
    drawing = [] ;  
    x = [] ;
    y = [] ;
}

function mouseReleased(){
    state = FOURIER ;
    const skip = 2 ;

    for (let i = 0 ; i < drawing.length ; i += skip){
        x.push(drawing[i].x) ;
        y.push(drawing[i].y) ;
    }

    fourierY = dft(y) ;
    fourierX = dft(x) ;

    fourierX.sort((a,b) => b.amp - a.amp );
    fourierY.sort((a,b) => b.amp - a.amp );

}

function setup() {
    createCanvas(800,600);
    state = -1 ;
}

function epiCycles(x, y, rotation, fourier){

    for (let i = 0 ; i < fourier.length ; i++ ){
        let prevx = x ;
        let prevy = y ;

        let freq = fourier[i].freq ;
        let radius = fourier[i].amp ;
        let phase = fourier[i].phase ;

        x += radius * cos(freq * time + phase + rotation);
        y += radius * sin(freq * time + phase + rotation);
        
        stroke(255,100);
        noFill();
        ellipse(prevx,prevy,radius*2);


        fill(255)
        line(prevx,prevy,x,y)
        //ellipse(x,y,4);

    }
    return createVector(x,y)
}

function draw() {
    background(0);


    if (state == USER){
        let point = createVector(mouseX - width / 2,mouseY - height / 2);
        drawing.push(point);
        stroke(255);
        noFill();
        beginShape();
        for (let v of drawing){
            vertex(v.x + width / 2, v.y + height/ 2);
        }
        endShape();
    } else if (state == FOURIER){

    let vx = epiCycles(width / 2, 100, 0 ,fourierX) ;
    let vy = epiCycles( 100, height / 2, HALF_PI, fourierY) ;
    let v = createVector(vx.x, vy.y)

    path.unshift(v);
    
    line(vx.x,vx.y,v.x,v.y);
    line(vy.x,vy.y,v.x,v.y);

    beginShape();
    noFill();
    for (let i = 0; i < path.length ; i ++){
        vertex(path[i].x,path[i].y);
    }
    endShape();
    

    // if (wave.length > 250) {
    //     wave.pop();
    // }

    const dt = TWO_PI/fourierY.length ;
    time += dt ;

    if (time > TWO_PI){
        time = 0 ;
        path = [] ;
    }
    }
}