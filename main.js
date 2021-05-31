let stageHeight, stageWidth;
let data, cumulateState, cumulateFamiliybackground, groupeFamilyBackground, groupedByWork;
let stage;

$(function () {
    stage = $('#stage');
    stageHeight = stage.innerHeight();
    stageWidth = stage.innerWidth();
    prepareData();
    //drawMap();
    drawFamilyBackground();
    //drawAnnualRing();
});

function prepareData() {
    data = gmynd.mergeData(infoData, positionData, "state");

    //für Map
    cumulateState = gmynd.cumulateData(data, "state");
    cumulateState = gmynd.mergeData(cumulateState, positionData, "state");
    //cumulateState = gmynd.deleteProps(cumulateState, "city");
    //console.log(cumulateState)

    //für FamilyBackground
    groupedByWork = gmynd.groupData(data, "workInterfere");
    console.log(groupedByWork);

    //für AnnualRings


}

function createDots() {

}

function drawMap() {

    const extremStates = gmynd.dataExtremes(cumulateState, "count")
    //console.log(extremStates)

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

        dot.mouseover(() => {
            dot.addClass("hover");
            $('#hoverLabel').text('State : ' + state.city + ' , ' + 'Attendees : ' + state.count);

        });

        dot.mouseout(() => {
            dot.removeClass("hover");
            $('#hoverLabel').text("");
        
        });

    });
}

function drawFamilyBackground() {
    /*  const keys = Object.keys(groupeFamilyBackground);
      const keyCount = keys.length;
      console.log(keys)*/

    let i = 0;

    for (let key in groupedByWork) {
        //geht jedes workinterfere einmal durch....

        let workInterfere = groupedByWork[key];
        //console.log(workInterfere);



        workInterfere.forEach((person, j) => {
            // geht jeden eintrag innerhalb eines workinterferes einmal durch...

            const rFam = 7;
            //const xFam = 100 * i;
            //const yFam = 200;

            let theta = 2.4 * j;
            let spiralRadius = 7.75 * Math.sqrt(theta) * 0.75;
            let xFam = 100 + Math.cos(theta) * spiralRadius + (i * 220);
            let yFam = 150 + Math.sin(theta) * spiralRadius;


            let dot = $('<div></div>');
            dot.addClass("familybackground"); // schlechter name, änder das mal hier und in deiner CSS :)
            let color = 'rgba(214, 235, 255, 0.8)';
            let border, borderColor;

            if (person.treatment === "No") { // Ohne Behandlung andere Farbe
                color = 'rgba(106, 170, 229,0.8)';
            }

            if (person.familyHistory === "No") { // Ohne Familienhintergrund = Stroke
                border = '3px solid'
                //borderColor = color
            }

            dot.css({
                'background-color': color,
                'height': rFam * 2,
                'width': rFam * 2,
                'left': xFam,
                'top': yFam,
                'border': border,
                //'border-color': borderColor
            });
            stage.append(dot);

            dot.mouseover(() => {
                dot.addClass("hover");
                $('#hoverLabel').text('Gender : ' + person.gender + ' , ' + 'Familybackground : ' + person.familyHistory + ' , ' + 'Treatment : ' + person.treatment + ' , ' + 'Work interfere : ' + person.workInterfere);
    
            });
    
            dot.mouseout(() => {
                dot.removeClass("hover");
                $('#hoverLabel').text("");
            
            });
    

        });
        i++;

    }
}

function drawAnnualRing() {

}