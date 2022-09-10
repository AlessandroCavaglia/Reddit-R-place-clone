const config={
    width:100,
    height:100,
    refresh_time:10,
    insert_delay:3,
    colours:["blue","green","yellow"]
}
let map_div=null
let map=[]
let lastUpdate=null;

function changeColour(){
    if(lastUpdate==null) return;
    console.log("Clicked cell: "+this.getAttribute("data-identifier"));
    comunicateChangeColour(this.getAttribute("data-identifier"),0);
}

document.addEventListener("DOMContentLoaded", function() {
    map_div=document.getElementById("map");
    drawFirstMap()
    getMapState();
    setInterval(getMapState, 2000);



    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', changeColour, false);
    }

});

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

function updateMapCells(data){
    let dataToUpdate=null;
    if(lastUpdate!=null){
        dataToUpdate = data.filter(value => !lastUpdate.includes(value));
    }else{
        dataToUpdate=data;
    }
    console.log("Must update "+dataToUpdate.length+" cells");
    for(let i=0;i<dataToUpdate.length;i++){
        let cell=dataToUpdate[i];
        let span_cell=document.getElementById("cell-"+cell.id);
        span_cell.style.backgroundColor="blue";
    }
    lastUpdate=data;
}


function comunicateChangeColour(id,colour){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/set", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        id: id,
        colour:colour,
    }));

    //TODO USE A COLOUR TABLE
    this.style.backgroundColor="blue"
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