let config={
    width:100,
    height:100,
    refresh_time:10,
    insert_delay:3,
    colours:["blue","green","yellow"]
}

let map_div=null
let hoverCell=null
let map_container=null
let ctx=null;
let zoom=100;
let color_picker_div=null;
let map=[]
let lastUpdate=null;
let requestedCellId={}
let scale_factor=8;
let offX=0;

function startChangeColour(event){
    if(lastUpdate==null) return;
    let pos=storeGuess(event);
    console.log("Clicked cell: "+pos[0]+" - "+pos[1]);
    requestedCellId=pos;
    color_picker_div.style.display="block";
}



function endChangeColour(){
    console.log("Clicked color: "+config.colours[this.getAttribute("data-color")]);
    comunicateChangeColour(getIndex(requestedCellId[0],requestedCellId[1]),this.getAttribute("data-color"),requestedCellId);
}

document.addEventListener("DOMContentLoaded", function() {
    map_div=document.getElementById("map");
    map_container=document.getElementById("map-container");
    hoverCell=document.getElementById("border");
    ctx = map_div.getContext("2d");
    offX=map_div.offsetTop;
    getConfigs()
});

function startGame(){
    drawColorPicker();
    drawFirstMap()
    getMapState();
    setInterval(getMapState, config.refresh_time*1000);
    setInterval(drawCellBorder, 10);
}

function drawFirstMap(){
    map_div.width=config.width*scale_factor;
    map_div.height=config.height*scale_factor;
    map_container.style.height=config.height*scale_factor+"px";
    map_container.style.width=config.width*scale_factor+"px";
    ctx.beginPath();
    ctx.rect(0, 0, config.width*scale_factor, config.height*scale_factor);
    ctx.fillStyle = "white";
    ctx.fill();
    hoverCell.style.width=(scale_factor-1)+"px";
    hoverCell.style.height=(scale_factor-1)+"px";
}

function drawColorPicker(){
    color_picker_div=document.getElementById("color_picker");
    let pickerDiv=document.getElementById("colours");
    for(let i=0;i<config.colours.length;i++){
        let span=document.createElement('button');
        span.className="color_picker_color cyberpunk2077";
        span.dataset.color=i;
        span.style.backgroundColor=config.colours[i];
        span.addEventListener('click', endChangeColour, false);
        pickerDiv.appendChild(span);
    }
}

function updateMapCells(data){
    let dataToUpdate=null;
    if(lastUpdate!=null){
        dataToUpdate = data.filter(value => !lastUpdate.some(value2=> value.id===value2.id && value.colour===value2.colour));
    }else{
        dataToUpdate=data;
    }
    console.log("Must update "+dataToUpdate.length+" cells");
    for(let i=0;i<dataToUpdate.length;i++){
        let cell=dataToUpdate[i];
        let coords=getCoords(cell.id);
        ctx.fillStyle = config.colours[cell.colour];
        ctx.fillRect(coords[0]*scale_factor, coords[1]*scale_factor, scale_factor, scale_factor);
    }
    lastUpdate=data;
}


function comunicateChangeColour(id,colour,coords){
    console.log("--- COMUNICATING COLOUR CHANGE TO SERVER")
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;

        if (this.status === 200) {
            ctx.fillStyle = config.colours[colour];
            ctx.fillRect(coords[0]*scale_factor, coords[1]*scale_factor, scale_factor, scale_factor);
        }
        color_picker_div.style.display="none";
    };
    xhr.open("POST", "http://localhost:8080/set", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        id: id,
        colour:colour,
    }));


}

function getMapState(){
    console.log("--- UPDATING MAP FROM SERVER")
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;

        if (this.status === 200) {
            var data = JSON.parse(this.responseText);
            updateMapCells(data);
        }
        // end of state change: it can be after some time (async)
    };
    xhr.open("GET", "http://localhost:8080/get", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}

function getConfigs(){
    console.log("--- LOADING CONFIG FROM SERVER")
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;

        if (this.status === 200) {
            var data = JSON.parse(this.responseText);
            config=data;
            startGame();
        }


        // end of state change: it can be after some time (async)
    };
    xhr.open("GET", "http://localhost:8080/config", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}

function increaseZoom(){
    if((zoom+10)<500){
        zoom=zoom+20;
        map_container.style.zoom=zoom+"%"
    }
}

function decreaseZoom(){
    if((zoom-10) > 30){
        zoom = zoom-20;
        map_container.style.zoom=zoom+"%"
    }
}

function closeColorPicker(){
    color_picker_div.style.display="none";
}

function getCoords(index){
    let x=0,y=0;
    x=Math.floor(index/config.width);
    y=index-(x*config.width);
    return[y,x]
}

function getIndex(x,y){
    return Math.floor(y*config.width+x);
}


function storeGuess(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    return [Math.floor((x/(zoom/100))/scale_factor),Math.floor((y/(zoom/100))/scale_factor)];
}

/* Pixel Bordering section */
let cellPos=[-1,-1]
let lastDrawn=[-1,-1]
function mouseMove(event){
    cellPos=storeGuess(event);
}

function mouseLeave(event){
    cellPos=[-1,-1]
}

function drawCellBorder(){
    if(cellPos[0]===-1 || cellPos[1]===-1){
        hoverCell.style.display="none";
        return;
    }
    if(lastDrawn===cellPos)
        return;


    let offY=map_div.offsetLeft;
    hoverCell.style.display="inline-block";
    hoverCell.style.top=offX +(cellPos[1]*scale_factor)+"px";
    hoverCell.style.left=offY +(cellPos[0]*scale_factor)+"px";
    lastDrawn=cellPos
    //TODO CAPIRE PERCHé ZOMMANDO SI SMINCHIA
}
