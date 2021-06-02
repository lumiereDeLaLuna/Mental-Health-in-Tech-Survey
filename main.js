let stageHeight, stageWidth;
let data, cumulateState, cumulateFamiliybackground, groupeFamilyBackground, groupedByWork;
let stage;

$(function () {
    stage = $('#stage');
    stageHeight = stage.innerHeight();
    stageWidth = stage.innerWidth();
    prepareData();
    //drawMap();
    //drawFamilyBackground();
    drawAnnualRing();
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
    //console.log(groupedByWork);

    //für AnnualRings
    groupedByAge = gmynd.groupData(data, "age");
    console.log(groupedByAge);

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
            let yOffset = i % 2 * 200;
            let yFam = 150 + Math.sin(theta) * spiralRadius + yOffset;


            let dot = $('<div></div>');
            dot.addClass("familybackground");
            let border;
            let color = 'rgba(214, 235, 255, 0.8)';

            if (person.treatment === "No") { // Ohne Behandlung andere Farbe
                color = 'rgba(106, 170, 229, 0.8)';
            }

            if (person.familyHistory === "No") { // Ohne Familienhintergrund = Stroke
                border = '3px solid ' + color;
                color = '#121212';
            }

            dot.css({
                'background-color': color,
                'height': rFam * 2,
                'width': rFam * 2,
                'left': xFam,
                'top': yFam,
                'border': border
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

    const dotSizeAge = 5;
    const rRing = 1;
    let i = 0;

    for (let key in groupedByAge) {
        //geht jede Altersgruppe einmal durch....

        let ageGroup = groupedByAge[key];
        //console.log(ageGroup);

        const ringNumber = i;

        const angle = 360 / ageGroup.length;    //rechnet 360° / alle Personen Innerhalb einer Altersgruppe
        const rad = gmynd.radians(angle);       //umrechnung von Winkel in Bogenmaß (von deg in rad) 
        const radiusRing = (ringNumber + ageGroup.length)*4;
        //console.log(radiusRing)
         
        const radius = key;
        

        ageGroup.forEach((person, j) => {
            // geht jeden eintrag innerhalb einer Altersgruppe einmal durch...
    
            const xAge = 200 + (Math.cos(rad) * radius *j);
            const yAge = 200 + (Math.sin(rad) * radius*j);

            let dot = $('<div></div>');
            dot.addClass("ageGroup");

            let color = 'rgba(115, 199, 240, 0.8)';

            if (person.coworkers === "Some of them" && person.supervisor === "Yes") { 
                color = 'rgba(92, 226, 182, 0.8)';
            }
            if (person.coworkers === "No" && person.supervisor === "Yes") { 
                color = 'rgba(230, 235, 89, 0.8)';
            }
            if (person.coworkers === "Yes" && person.supervisor === "Some of them") { 
                color = 'rgba(82, 165, 255, 0.8)';
            }
            if (person.coworkers === "Some of them" && person.supervisor === "Some of them") { 
                color = 'rgba(196, 196, 192, 0.8)';
            }
            if (person.coworkers === "Yes" && person.supervisor === "No") { 
                color = 'rgba(153, 110, 244, 0.8)';
            }
            if (person.coworkers === "Some of them" && person.supervisor === "No") { 
                color = 'rgba(247, 100, 166, 0.8)';
            }
            if (person.coworkers === "No" && person.supervisor === "No") { 
                color = 'rgba(245, 110, 76, 0.8)';
            }


            
            dot.css({
                'background-color': color,
                'height': dotSizeAge * 2,
                'width': dotSizeAge * 2,
                'left': xAge,
                'top': yAge,
            });
            stage.append(dot);

            dot.mouseover(() => {
                dot.addClass("hover");
                $('#hoverLabel').text('Age : ' + person.age+ ' , ' + 'Coworkers : ' + person.coworkers + ' , ' + 'Supervisor : ' + person.supervisor );

            });

            dot.mouseout(() => {
                dot.removeClass("hover");
                $('#hoverLabel').text("");

            });


        });
        i++;
    }
}