let stageHeight, stageWidth;
let data,cumulateState;
let stage;

$(function () {
    stage = $('#stage');
    stageHeight = $('#stage').innerHeight();
    stageWidth = $('#stage').innerWidth();
    prepareData();
    drawMap();
});

function prepareData() {
    data = gmynd.mergeData(infoData, positionData, "state");

    cumulateState = gmynd.cumulateData(data, "state");
    cumulateState = gmynd.mergeData(cumulateState, positionData, "state");
    //console.log(cumulateState)
};

function drawMap() {

    const extremStates = gmynd.dataExtremes(cumulateState, "count")
    console.log(extremStates)

    cumulateState.forEach(state => {

        const area = gmynd.map(state.count, extremStates.min, extremStates.max, 25, 200);
        //console.log(state.longitude)
        const r = gmynd.circleRadius(area);
        const x = gmynd.map(state.longitude, -125, -68, 0, stageWidth) - r;
        const y = gmynd.map(state.latitude, 24, 49, stageHeight, 0) - r;
    

        let dot = $('<div></div>');
        dot.addClass("country");

        dot.css({
        
            'height': r * 2,
            'width': r * 2,
            'left': x,
            'top': y,
        });


        dot.data(state);

        stage.append(dot);

    });
};