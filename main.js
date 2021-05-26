let stageHeight, stageWidth;
let data, cumulateState, cumulateFamiliybackground, groupeFamilybackground;
let stage;

$(function () {
    stage = $('#stage');
    stageHeight = $('#stage').innerHeight();
    stageWidth = $('#stage').innerWidth();
    prepareData();
    //drawFamilybackground();
    drawMap();
});

function prepareData() {
    data = gmynd.mergeData(infoData, positionData, "state");

    cumulateState = gmynd.cumulateData(data, "state");
    cumulateState = gmynd.mergeData(cumulateState, positionData, "state");
    cumulateState = gmynd.deleteProps(cumulateState, "city")
    //console.log(cumulateState)

    groupeFamilybackground = gmynd.groupData(data, "workInterfere");
    console.log(groupeFamilybackground)

    //cumulateFamiliybackground = gmynd.cumulateData(data, "workInterfere");
    //console.log(cumulateFamiliybackground);
};

function createDots() {

};

function drawMap() {

    const extremStates = gmynd.dataExtremes(cumulateState, "count")
    console.log(extremStates)

    cumulateState.forEach(state => {

        const area = gmynd.map(state.count, extremStates.min, extremStates.max, 25, 500);
        const rMap = gmynd.circleRadius(area);
        const xMap = gmynd.map(state.longitude, -125, -68, 0, stageWidth) - rMap;
        const yMap = gmynd.map(state.latitude, 24, 49, stageHeight, 0) - rMap;
    

        let dot = $('<div></div>');
        dot.addClass("country");

        dot.css({
        
            'height': rMap * 2,
            'width': rMap * 2,
            'left': xMap,
            'top': yMap,
        });


        dot.data(state);

        stage.append(dot);

    });
};

function drawFamilybackground() {

    const keys = Object.keys(groupeFamilybackground);
    //const keyCount = keys.length;
    console.log(keys)

    let i = 0;

    for (let key in groupeFamilybackground) {



    };

    
    // cumulateFamiliybackground.forEach((person, j) => {

    //     const rFam = 10
    //     const xFam = i;
    //     const yFam = stageHeight/i-(rFam*2);
    //     ;
    //     //workInterfere-> Often, Sometimes, Rarely, Never, NoData, NA

        
    //     let dot = $('<div></div>');
    //     dot.addClass("country");

    //     dot.css({
        
    //         'height': rFam * 2,
    //         'width': rFam * 2,
    //         'left': xFam,
    //         'top': yFam,
    //     });


    //     dot.data(person);

    //     stage.append(dot);

    // });

    // i++;

};