let stageHeight, stageWidth;
let data, cumulateState, cumulateFamiliybackground, groupeFamilyBackground, groupedByWork, groupedByAge;
let stage;
let showingChart;

$(function () {
  stage = $('#stage');
  stageHeight = stage.innerHeight();
  stageWidth = stage.innerWidth();
  prepareData();
  createDots();
  //drawMap();
  //drawFamilyBackground();
  //drawAnnualRing(0);
  //talkAboutView();
  interfereView();
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
  groupedByAge = gmynd.sortData(data, ["supervisor", "coworkers"])
  groupedByAge = gmynd.groupData(data, "age");
  //console.log(groupedByAge);

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
    
    const ringNumber = parseInt(key) - 18;
    const ageGroup = groupedByAge[key];
    const dotsInAgeGroup = ageGroup.length;
    const anglePerDot = gmynd.radians(360 / dotsInAgeGroup);
    const ringRadius = (ringNumber + 1) * radiusPerRing;
    const angleOffset = Math.random() * 100;

    ageGroup.forEach((person, j) => {
      let angle = j * anglePerDot + angleOffset;
      const xAge = (centerPoint.x + 120) + (Math.cos(angle) * ringRadius);
      const yAge = centerPoint.y + (Math.sin(angle) * ringRadius);
      let ageBorder = '0px' ;
      let dot = $('<div></div>');
      dot.addClass("circle-blub");

      let yearColor;
      if (person.coworkers === "Yes" && person.supervisor === "Yes") {
        yearColor = 'rgba(115, 199, 240, 0.8)';
        //dot.addClass("yes-yes");
      } else if (person.coworkers === "Some of them" && person.supervisor === "Yes") {
        yearColor = 'rgba(92, 226, 182, 0.8)';
        //dot.addClass("some-yes");
      } else if (person.coworkers === "No" && person.supervisor === "Yes") {
        yearColor = 'rgba(230, 235, 89, 0.8)';
        //dot.addClass("no-yes");
      } else if (person.coworkers === "Yes" && person.supervisor === "Some of them") {
        yearColor = 'rgba(82, 165, 255, 0.8)';
        //dot.addClass("yes-some");
      } else if (person.coworkers === "Some of them" && person.supervisor === "Some of them") {
        yearColor = 'rgba(196, 196, 192, 0.8)';
        //dot.addClass("some-some");
      } else if (person.coworkers === "No" && person.supervisor === "Some of them") {
        yearColor = 'rgba(252, 176, 85, 0.8)';
        //dot.addClass("no-some");
      }else if (person.coworkers === "Yes" && person.supervisor === "No") {
        yearColor = 'rgba(153, 110, 244, 0.8)';
        //dot.addClass("yes-no");
      } else if (person.coworkers === "Some of them" && person.supervisor === "No") {
        yearColor = 'rgba(247, 100, 166, 0.8)';
        //dot.addClass("some-no");
      } else if (person.coworkers === "No" && person.supervisor === "No") {
        yearColor = 'rgba(245, 110, 76, 0.8)';
        //dot.addClass("no-no");
      }

      let currentInterfere = person.workInterfere;
      let keyNumber = workKeys.indexOf(currentInterfere);
      const rFam = 7;
      let theta = 2.4 * groupedByWork[currentInterfere];
      let spiralRadius = 7.75 * Math.sqrt(theta) * 0.75;
      let xFam = 350 + Math.cos(theta) * spiralRadius + (keyNumber * 220);
      let yOffset = keyNumber % 2 * 400;
      let yFam = 250 + Math.sin(theta) * spiralRadius + yOffset;

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
        ageColor: yearColor,
        ageHeight: dotRadius * 2,
        ageWidth: dotRadius * 2,
        ageBorder: ageBorder,
        ageLeft: xAge,
        ageTop: yAge,
        interfereColor: workColor,
        interfereHeight: rFam * 2,
        interfereWidth: rFam * 2,
        interfereBorder: border,
        interfereTop: yFam,
        interfereLeft: xFam,
      });
      
      stage.append(dot);

    });
  }
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
      'height': rMap * 10,
      'width': rMap * 10,
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
  showingChart = false;
  /*  const keys = Object.keys(groupeFamilyBackground);
    const keyCount = keys.length;
    console.log(keys)*/

  $('.circle-blub').each(function () {
    let dotData = $(this).data();
    $(this).css({
      'background-color': dotData.interfereColor,
      'border': dotData.interfereBorder
  });
    $(this).animate({
      //'background-color': dotData.interfereColor,
      'height': dotData.interfereHeight,
      'width': dotData.interfereWidth,
      'left': dotData.interfereLeft,
      'top': dotData.interfereTop,
      //'border': dotData.interfereBorder,
    }, 3000);
  });
}
function drawAnnualRing() {
  showingChart = true;

  $('.circle-blub').each(function () {
    let dotData = $(this).data();
    $(this).css({
      'background-color': dotData.ageColor,
      'border': dotData.ageBorder
  });
    $(this).animate({
      //'background-color': dotData.ageColor,
      'height': dotData.ageHeight,
      'width': dotData.ageWidth,
      'left': dotData.ageLeft,
      'top': dotData.ageTop
    }, 3000);
  });
}


function whereView() {
  //console.log('Toggle Hat Geklappt')
  drawMap();
  //console.log('Toggle Hat ganz Geklappt')
  $('.where').css({
    'opacity': '0.9'
  });
  $('.interfere').css({
    'opacity': '0.4 '
  });
  $('.talkAbout').css({
    'opacity': '0.4'
  });
  mapButton();

}
function interfereView() {
  //console.log('Toggle Hat Geklappt')
  drawFamilyBackground();
  //console.log('Toggle Hat ganz Geklappt')
  $('.where').css({
    'opacity': '0.4'
  });
  $('.interfere').css({
    'opacity': '0.9'
  });
  $('.talkAbout').css({
    'opacity': '0.4'
  });

  interfereButton();

}
function talkAboutView() {
  drawAnnualRing();

  $('.where').css({
    'opacity': '0.4'
  });
  $('.interfere').css({
    'opacity': '0.4'
  });
  $('.talkAbout').css({
    'opacity': '0.9'
  });

  talkAboutButton();
}


function mapButton() {
  $('.consequences').css({
    'opacity': '0'
  });
  $('.yesCon').css({
    'opacity': '0'
  });
  $('.maybeCon').css({
    'opacity': '0'
  });
  $('.noCon').css({
    'opacity': '0'
  });


  $('.gender').css({
    'opacity': '0'
  });
  $('.femaleCon').css({
    'opacity': '0'
  });
  $('.maleCon').css({
    'opacity': '0'
  });
  

  $('.talk-to').css({
    'opacity': '0'
  });

  $('.coworkers-yes').css({
    'opacity': '0'
  });
  $('.coworkers-some').css({
    'opacity': '0'
  });
  $('.coworkers-no').css({
    'opacity': '0'
  });
  $('.supervisor-yes').css({
    'opacity': '0'
  });
  $('.supervisor-some').css({
    'opacity': '0'
  });
  $('.supervisor-no').css({
    'opacity': '0'
  });

  $('.yes-yes').css({
    'opacity': '0'
  });
  $('.some-yes').css({
    'opacity': '0'
  });
  $('.no-yes').css({
    'opacity': '0'
  });
  $('.yes-some').css({
    'opacity': '0'
  });
  $('.some-some').css({
    'opacity': '0'
  });
  $('.no-some').css({
    'opacity': '0'
  });
  $('.yes-no').css({
    'opacity': '0'
  });
  $('.some-no').css({
    'opacity': '0'
  });
  $('.no-no').css({
    'opacity': '0'
  });

}
function interfereButton() {
  $('.consequences').css({
    'opacity': '0'
  });
  $('.yesCon').css({
    'opacity': '0'
  });
  $('.maybeCon').css({
    'opacity': '0'
  });
  $('.noCon').css({
    'opacity': '0'
  });


  $('.gender').css({
    'opacity': '0.38'
  });
  $('.femaleCon').css({
    'opacity': '0.87'
  });
  $('.maleCon').css({
    'opacity': '0.87'
  });
  

  $('.talk-to').css({
    'opacity': '0'
  });

  $('.coworkers-yes').css({
    'opacity': '0'
  });
  $('.coworkers-some').css({
    'opacity': '0'
  });
  $('.coworkers-no').css({
    'opacity': '0'
  });
  $('.supervisor-yes').css({
    'opacity': '0'
  });
  $('.supervisor-some').css({
    'opacity': '0'
  });
  $('.supervisor-no').css({
    'opacity': '0'
  });

  $('.yes-yes').css({
    'opacity': '0'
  });
  $('.some-yes').css({
    'opacity': '0'
  });
  $('.no-yes').css({
    'opacity': '0'
  });
  $('.yes-some').css({
    'opacity': '0'
  });
  $('.some-some').css({
    'opacity': '0'
  });
  $('.no-some').css({
    'opacity': '0'
  });
  $('.yes-no').css({
    'opacity': '0'
  });
  $('.some-no').css({
    'opacity': '0'
  });
  $('.no-no').css({
    'opacity': '0'
  });

}
function talkAboutButton() {
  $('.consequences').css({
    'opacity': '0.38'
  });
  $('.yesCon').css({
    'opacity': '0.87'
  });
  $('.maybeCon').css({
    'opacity': '0.87'
  });
  $('.noCon').css({
    'opacity': '0.87'
  });


  $('.gender').css({
    'opacity': '0.38'
  });
  $('.femaleCon').css({
    'opacity': '0.87'
  });
  $('.maleCon').css({
    'opacity': '0.87'
  });
  

  $('.talk-to').css({
    'opacity': '0.38'
  });

  $('.coworkers-yes').css({
    'opacity': '0.38'
  });
  $('.coworkers-some').css({
    'opacity': '0.38'
  });
  $('.coworkers-no').css({
    'opacity': '0.38'
  });
  $('.supervisor-yes').css({
    'opacity': '0.38'
  });
  $('.supervisor-some').css({
    'opacity': '0.38'
  });
  $('.supervisor-no').css({
    'opacity': '0.38'
  });

  $('.yes-yes').css({
    'opacity': '0.9'
  });
  $('.some-yes').css({
    'opacity': '0.9'
  });
  $('.no-yes').css({
    'opacity': '0.9'
  });
  $('.yes-some').css({
    'opacity': '0.9'
  });
  $('.some-some').css({
    'opacity': '0.9'
  });
  $('.no-some').css({
    'opacity': '0.9'
  });
  $('.yes-no').css({
    'opacity': '0.9'
  });
  $('.some-no').css({
    'opacity': '0.9'
  });
  $('.no-no').css({
    'opacity': '0.9'
  });

}


