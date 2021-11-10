

let drawing = image ;
let x = [] ;
let fourierX ;
let time = 0 ;
let path = [] ;



function setup() {
    createCanvas(800,600);
    const skip = 5 ;

    for (let i = 0 ; i < drawing.length ; i += skip){
        const c = new Complex(drawing[i].x, drawing[i].y);
        x.push(c) ;
    }

    fourierX = dft(x) ;
    console.log(fourierX);

    fourierX.sort((a,b) => b.amp - a.amp );
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

    let v = epiCycles(width / 2, height / 2, 0 ,fourierX) ;
    path.unshift(v);

    beginShape();
    noFill();
    stroke(255);
    for (let i = 0; i < path.length ; i ++){
        vertex(path[i].x,path[i].y);
    }
    endShape();

    dt = TWO_PI/fourierX.length ;
    time += dt ;

    if (time > TWO_PI){
        dt = 0 ;
        // path = [] ;
    }
}