let stageHeight, stageWidth;
let data, cumulateState, cumulateFamiliybackground, groupeFamilyBackground, groupedByWork, groupedByAge;
let stage;

$(function () {
  stage = $('#stage');
  stageHeight = stage.innerHeight();
  stageWidth = stage.innerWidth();
  prepareData();
  createDots();
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
  groupedByWork = gmynd.sortData(data, "-treatment");
  groupedByWork = gmynd.groupData(groupedByWork, "workInterfere");
  console.log(groupedByWork);

  //für AnnualRings
  groupedByAge = gmynd.groupData(data, "age");
  //console.log(groupedByAge);

}

function drawMap() {
  const extremeStates = gmynd.dataExtremes(cumulateState, "count")
  //console.log(extremStates)

  cumulateState.forEach(state => {

    const area = gmynd.map(state.count, extremeStates.min, extremeStates.max, 25, 500);
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

    /*        dot.mouseover(() => {
                dot.addClass("hover");
                $('#hoverLabel').text('State : ' + state.city + ' , ' + 'Attendees : ' + state.count);

            });

            dot.mouseout(() => {
                dot.removeClass("hover");
                $('#hoverLabel').text("");

            });*/

  });
}

function drawFamilyBackground() {
  /*  const keys = Object.keys(groupeFamilyBackground);
    const keyCount = keys.length;
    console.log(keys)*/

  $('.circle-blub').each(function () {
    let dotData = $(this).data();
    dot.css({
      'background-color': dotData.ageColor,
      'height': dotData.ageHeight,
      'width': dotData.ageWidth,
      'left': dotData.ageLeft,
      'top': dotData.ageTop
    });
  });

}

function drawAnnualRing() {
  $('.circle-blub').each(function () {
    let dotData = $(this).data();
    $(this).css({
      'background-color': dotData.ageColor,
      'height': dotData.ageHeight,
      'width': dotData.ageWidth,
      'left': dotData.ageLeft,
      'top': dotData.ageTop
    });
  });
}

function createDots() {
  const dotRadius = 4;
  const radiusPerRing = 12;
  const centerPoint = {
    x: (stageWidth / 2),
    y: stageHeight / 2
  }
  for (let key in groupedByWork) {
    //dieses object verwenden wir nur noch zum zählen
    groupedByWork[key] = 0;
  }
  let workKeys = Object.keys(groupedByWork);

  for (let key in groupedByAge) {
    let dot = $('<div></div>');
    dot.addClass("circle-blub");
    const ringNumber = parseInt(key) - 18;
    const ageGroup = groupedByAge[key];
    const dotsInAgeGroup = ageGroup.length;
    const anglePerDot = gmynd.radians(360 / dotsInAgeGroup);
    const ringRadius = (ringNumber + 4) * radiusPerRing;
    const angleOffset = Math.random() * 100;
    ageGroup.forEach((person, j) => {
      let angle = j * anglePerDot + angleOffset;
      const xAge = centerPoint.x + (Math.cos(angle) * ringRadius);
      const yAge = centerPoint.y + (Math.sin(angle) * ringRadius);

      let color = 'rgba(115, 199, 240, 0.8)';
      if (person.coworkers === "Some of them" && person.supervisor === "Yes") {
        color = 'rgba(92, 226, 182, 0.8)';
      } else if (person.coworkers === "No" && person.supervisor === "Yes") {
        color = 'rgba(230, 235, 89, 0.8)';
      } else if (person.coworkers === "Yes" && person.supervisor === "Some of them") {
        color = 'rgba(82, 165, 255, 0.8)';
      } else if (person.coworkers === "Some of them" && person.supervisor === "Some of them") {
        color = 'rgba(196, 196, 192, 0.8)';
      } else if (person.coworkers === "Yes" && person.supervisor === "No") {
        color = 'rgba(153, 110, 244, 0.8)';
      } else if (person.coworkers === "Some of them" && person.supervisor === "No") {
        color = 'rgba(247, 100, 166, 0.8)';
      } else if (person.coworkers === "No" && person.supervisor === "No") {
        color = 'rgba(245, 110, 76, 0.8)';
      }

      let currentInterfere = person.workInterfere;
      let keyNumber = workKeys.indexOf(currentInterfere);
      const rFam = 7;
      let theta = 2.4 * groupedByWork[currentInterfere];
      let spiralRadius = 7.75 * Math.sqrt(theta) * 0.75;
      let xFam = 350 + Math.cos(theta) * spiralRadius + (keyNumber * 220);
      let yOffset = keyNumber % 2 * 400;
      let yFam = 320 + Math.sin(theta) * spiralRadius + yOffset;

      let border;
      let workColor = 'rgba(214, 235, 255, 0.8)';

      if (person.treatment === "No") { // Ohne Behandlung andere Farbe
        workColor = 'rgba(106, 170, 229, 0.8)';
      }
      if (person.familyHistory === "No") { // Ohne Familienhintergrund = Stroke
        border = '3px solid ' + workColor;
        workColor = '#121212';
      }
      groupedByWork[currentInterfere]++;

      dot.data({
        ageColor: color,
        ageHeight: dotRadius * 2,
        ageWidth: dotRadius * 2,
        ageLeft: xAge,
        ageTop: yAge,
        interfereColor: workColor,
        interfereHeight: rFam * 2,
        interfereWidth: rFam * 2,
        interfereBorder: border,
        interfereTop: yFam,
        interfereLeft: xFam,
      });
    });
  }
}