let config={
    width:100,
    height:100,
    refresh_time:10,
    insert_delay:3,
    colours:["blue","green","yellow"]
}

let map_div=null
let color_picker_div=null;
let map=[]
let lastUpdate=null;
let requestedCellId={}
let requestedCell=null;

function startChangeColour(){
    if(lastUpdate==null) return;
    console.log("Clicked cell: "+this.getAttribute("data-identifier"));
    requestedCellId=this.getAttribute("data-identifier");
    requestedCell=this;
    color_picker_div.style.display="block";
}

function endChangeColour(){
    if(lastUpdate==null) return;
    console.log("Clicked color: "+config.colours[this.getAttribute("data-color")]);
    comunicateChangeColour(requestedCellId,this.getAttribute("data-color"),requestedCell);
}

document.addEventListener("DOMContentLoaded", function() {
    map_div=document.getElementById("map");
    getConfigs()
});

function startGame(){
    drawColorPicker();
    drawFirstMap()
    getMapState();
    setInterval(getMapState, config.refresh_time*1000);

    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', startChangeColour, false);
    }
}

function drawFirstMap(){
    let div=null;
    for(let i=0;i<config.width*config.height;i++){
        if(i%config.width===0){
            if(div!=null){
                map_div.appendChild(div)
            }
            div=document.createElement('div');
            div.className="containerDiv";
        }
        let cell=document.createElement('span');
        cell.id="cell-"+i;
        cell.className="cell";
        cell.dataset.identifier=""+i;
        div.appendChild(cell)
        map.push({id:i,color:1})
    }
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
        let span_cell=document.getElementById("cell-"+cell.id);
        span_cell.style.backgroundColor=config.colours[cell.colour];
    }
    lastUpdate=data;
}


function comunicateChangeColour(id,colour,elem){
    console.log("--- COMUNICATING COLOUR CHANGE TO SERVER")
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;

        if (this.status === 200) {
            elem.style.backgroundColor=config.colours[colour];
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