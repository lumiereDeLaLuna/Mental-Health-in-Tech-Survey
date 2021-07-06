let stageHeight, stageWidth;
let data;
let stage;
let selectedProps = {
  coworkers: null,
  supervisor: null,
  gender: null,
  mentalHealthConsequence: null,

};
let screen = 0;

$(function () {
  stage = $('#stage');
  stageHeight = stage.innerHeight();
  stageWidth = stage.innerWidth();
  createDots();
  whereView();
});

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

      //damit sich die PunktPersonen sich hinter den jeweiligen Kreis ihres Staates anordnen 
      const rMap = 1;
      const xMap = gmynd.map(person.longitude, -125, -68, 319, 1368) - rMap;
      const yMap = gmynd.map(person.latitude, 24, 49, 912, 226) - rMap;
      const mapColor = 'rgba(115, 199, 240, 0)';

      //für die annualRings
      let angle = j * anglePerDot + angleOffset;
      const xAge = (centerPoint.x + 120) + (Math.cos(angle) * ringRadius);
      const yAge = centerPoint.y + (Math.sin(angle) * ringRadius);
      let ageBorder = '0px';
      let dot = $('<div></div>');
      dot.addClass("person-interfere-talkAbout");

      let yearColor;
      if (person.coworkers === "Yes" && person.supervisor === "Yes") {
        yearColor = 'rgba(115, 199, 240, 0.8)';
      } else if (person.coworkers === "Some of them" && person.supervisor === "Yes") {
        yearColor = 'rgba(92, 226, 182, 0.8)';
      } else if (person.coworkers === "No" && person.supervisor === "Yes") {
        yearColor = 'rgba(230, 235, 89, 0.8)';
      } else if (person.coworkers === "Yes" && person.supervisor === "Some of them") {
        yearColor = 'rgba(82, 165, 255, 0.8)';
      } else if (person.coworkers === "Some of them" && person.supervisor === "Some of them") {
        yearColor = 'rgba(196, 196, 192, 0.8)';
      } else if (person.coworkers === "No" && person.supervisor === "Some of them") {
        yearColor = 'rgba(252, 176, 85, 0.8)';
      } else if (person.coworkers === "Yes" && person.supervisor === "No") {
        yearColor = 'rgba(153, 110, 244, 0.8)';
      } else if (person.coworkers === "Some of them" && person.supervisor === "No") {
        yearColor = 'rgba(247, 100, 166, 0.8)';
      } else if (person.coworkers === "No" && person.supervisor === "No") {
        yearColor = 'rgba(245, 110, 76, 0.8)';
      }

      //für workInterfere
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

        mapColor: mapColor,
        mapHeight: rMap * 5,
        mapWidth: rMap * 5,
        mapLeft: xMap,
        mapTop: yMap,

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

        gender: person.gender,
        mentalHealthConsequence: person.mentalHealthConsequence,
        coworkers: person.coworkers,
        supervisor: person.supervisor,

        familyHistory: person.familyHistory,
        treatment: person.treatment,
        workInterfere: person.workInterfere,
        age: person.age,

      });

      stage.append(dot);

      dot.mouseover(onDotHover);
      dot.mouseout(offDotHover);
    });
  }
}

function onDotHover(event) {
  const dot = $(event.target);
  // console.log(dot.data());
  let person = dot.data();

  dot.addClass("hover");
  if (screen === 1) {
    $('#hoverLineFirst').text('Familybackground : ' + person.familyHistory);
    $('#hoverLineSecond').text('Treatment : ' + person.treatment);
    $('#hoverLineThird').text('Work interfere : ' + person.workInterfere);
  }
  if (screen === 2) {
    $('#hoverLineFirst').text("");
    $('#hoverLineSecond').text('Age : ' + person.age);
    $('#hoverLineThird').text("");
  }
}
function offDotHover(event) {
  const dot = $(event.target);
  // console.log(dot.data());
  let person = dot.data();

  dot.removeClass("hover");
  $('#hoverLineFirst').text("");
  $('#hoverLineSecond').text("");
  $('#hoverLineThird').text("");
}

//function, damit die Filter funktionieren
function visibilityByData() {
  $('.person-interfere-talkAbout').each(function () {
    if (
      ($(this).data("gender") === selectedProps.gender || selectedProps.gender == null) &&
      ($(this).data("coworkers") === selectedProps.coworkers || selectedProps.coworkers == null) &&
      ($(this).data("supervisor") === selectedProps.supervisor || selectedProps.supervisor == null) &&
      ($(this).data("mentalHealthConsequence") === selectedProps.mentalHealthConsequence || selectedProps.mentalHealthConsequence == null)
    ) {
      $(this).css({
        'opacity': '1'
      });
    }
    else {
      $(this).css({
        'opacity': '0.2'
      });
    }
  });
}
function showAllPersonInterferes() {
  $(".person-interfere-talkAbout").css({ opacity: 1 });
}
function selectedPropsNull() {
  selectedProps.mentalHealthConsequence = null;
  selectedProps.gender = null;
  selectedProps.coworkers = null;
  selectedProps.supervisor = null;

}

//änderung der Positionen
function drawMap() {
  const extremeStates = gmynd.dataExtremes(cumulateState, "count")
  //console.log(extremStates)

  cumulateState.forEach(state => {

    const area = gmynd.map(state.count, extremeStates.min, extremeStates.max, 25, 500);
    const rMap = gmynd.circleRadius(area);
    const xMap = gmynd.map(state.longitude, -125, -68, 319, 1368) - rMap;
    const yMap = gmynd.map(state.latitude, 24, 49, 912, 226) - rMap;

    let dot = $('<div></div>');
    dot.addClass("country");

    dot.css({
      'height': rMap * 5,
      'width': rMap * 5,
      'left': xMap,
      'top': yMap,
    });

    dot.data(state);
    stage.append(dot);

    dot.mouseover(() => {
      dot.addClass("hover");
      $('#hoverLineFirst').text('State : ' + state.city);
      $('#hoverLineSecond').text('Attendees : ' + state.count);
      $('#hoverLineThird').text("");
    });

    dot.mouseout(() => {
      dot.removeClass("hover");
      $('#hoverLineFirst').text("");
      $('#hoverLineSecond').text("");
      $('#hoverLineThird').text("");

    });

  });
}
function drawPersonMap() {

  $('.person-interfere-talkAbout').each(function () {
    let dotData = $(this).data();
    $(this).css({
      'background-color': dotData.mapColor,
      'border': dotData.mapBorder,
      'height': dotData.mapHeight,
      'width': dotData.mapWidth,
      'left': dotData.mapLeft,
      'top': dotData.mapTop,
    });

  });
}
function drawFamilyBackground() {
  /*  const keys = Object.keys(groupeFamilyBackground);
    const keyCount = keys.length;
    console.log(keys)*/

  $('.person-interfere-talkAbout').each(function () {
    let dotData = $(this).data();
    $(this).css({
      'background-color': dotData.interfereColor,
      'border': dotData.interfereBorder,
      'height': dotData.interfereHeight,
      'width': dotData.interfereWidth,
      'left': dotData.interfereLeft,
      'top': dotData.interfereTop,
    });
  });
}
function drawAnnualRing() {
  $('.person-interfere-talkAbout').each(function () {
    let dotData = $(this).data();
    $(this).css({
      'background-color': dotData.ageColor,
      'border': dotData.ageBorder,
      'height': dotData.ageHeight,
      'width': dotData.ageWidth,
      'left': dotData.ageLeft,
      'top': dotData.ageTop,
    });
  });
}

//welcher Screen gerade gezeigt wird
function whereView() {
  screen = 0;
  drawMap();
  drawPersonMap();

  $('.where-opacity').addClass('where').removeClass('where-opacity');
  $('.interfere').addClass('interfere-opacity').removeClass('interfere');
  $('.talkAbout').addClass('talkAbout-opacity').removeClass('talkAbout');

  mapButton();
}
function interfereView() {
  screen = 1;
  drawFamilyBackground();

  $('.country').addClass('invisible');

  $('.where').addClass('where-opacity').removeClass('where');
  $('.interfere-opacity').addClass('interfere').removeClass('interfere-opacity');
  $('.talkAbout').addClass('talkAbout-opacity').removeClass('talkAbout');

  interfereButton();

}
function talkAboutView() {
  screen = 2;
  drawAnnualRing();

  $('.country').addClass('invisible');

  $('.where').addClass('where-opacity').removeClass('where');
  $('.interfere').addClass('interfere-opacity').removeClass('interfere');
  $('.talkAbout-opacity').addClass('talkAbout').removeClass('talkAbout-opacity');

  talkAboutButton();
}

//welche Filtermöglichkeiten es gibt
function mapButton() {

  $('.interfere-hide').hide();
  $('.talk-about').hide();

}
function interfereButton() {

  $('.interfere-hide').show();
  $('.talk-about').hide();

}
function talkAboutButton() {

  $('.interfere-hide').show();
  $('.talk-about').show();

}

//filter nach den consequences
function consequencesTalkAboutView() {
  showAllPersonInterferes();
  selectedPropsNull();

  $('.yesCon').css({
    'opacity': '0.9'
  });
  $('.maybeCon').css({
    'opacity': '0.9'
  });
  $('.noCon').css({
    'opacity': '0.9'
  });
}
function yesTalkAboutView() {

  if (selectedProps.mentalHealthConsequence === null || selectedProps.mentalHealthConsequence === 'Maybe' || selectedProps.mentalHealthConsequence === 'No') {

    selectedProps.mentalHealthConsequence = "Yes";
    visibilityByData();
  
    $('.yesCon').css({
      'opacity': '0.9'
    });
    $('.maybeCon').css({
      'opacity': '0.38'
    });
    $('.noCon').css({
      'opacity': '0.38'
    });
    console.log('yes if')
    console.log(selectedProps)

  } else {

    selectedProps.mentalHealthConsequence = null;
    visibilityByData();

    $('.maybeCon').css({
      'opacity': '0.9'
    });
    $('.noCon').css({
      'opacity': '0.9'
    });
  }
  console.log('yes else')
  console.log(selectedProps)
}
function maybeTalkAboutView() {

  if (selectedProps.mentalHealthConsequence === null || selectedProps.mentalHealthConsequence === 'Yes' || selectedProps.mentalHealthConsequence === 'No') {

    selectedProps.mentalHealthConsequence = "Maybe";
    visibilityByData();
  
    $('.yesCon').css({
      'opacity': '0.38'
    });
    $('.maybeCon').css({
      'opacity': '0.9'
    });
    $('.noCon').css({
      'opacity': '0.38'
    });
    console.log('maybe if')
    console.log(selectedProps)
  } else {

    selectedProps.mentalHealthConsequence = null;
    visibilityByData();

    $('.yesCon').css({
      'opacity': '0.9'
    });
    $('.noCon').css({
      'opacity': '0.9'
    });
    console.log('maybe else')
    console.log(selectedProps)
  }
}
function noTalkAboutView() {

  if (selectedProps.mentalHealthConsequence === null || selectedProps.mentalHealthConsequence === 'Yes' || selectedProps.mentalHealthConsequence === 'Maybe') {

    selectedProps.mentalHealthConsequence = "No";
    visibilityByData();
  
    $('.yesCon').css({
      'opacity': '0.38'
    });
    $('.maybeCon').css({
      'opacity': '0.38'
    });
    $('.noCon').css({
      'opacity': '0.9'
    });
    console.log('no if')
    console.log(selectedProps)

  } else {

    selectedProps.mentalHealthConsequence = null;
    visibilityByData();

    $('.yesCon').css({
      'opacity': '0.9'
    });
    $('.maybeCon').css({
      'opacity': '0.9'
    });
    console.log('no else')
    console.log(selectedProps)
  }
}

//filter nach dem gender
function genderTalkAboutView() {
  showAllPersonInterferes();
  selectedPropsNull();

  $('.femaleCon').css({
    'opacity': '0.9'
  });
  $('.maleCon').css({
    'opacity': '0.9'
  });
}
function femaleTalkAboutView() {

  if (selectedProps.gender === null || selectedProps.gender === 'male') {
    selectedProps.gender = "female";
    visibilityByData();

    $('.femaleCon').css({
      'opacity': '0.9'
    });
  $('.maleCon').css({
    'opacity': '0.38'
  });

  } else {
    selectedProps.gender = null;
    visibilityByData();

    $('.maleCon').css({
      'opacity': '0.9'
    });
  }
}
function maleTalkAboutView() {

  if (selectedProps.gender === null || selectedProps.gender === 'female') {
    selectedProps.gender = "male";
    visibilityByData();
  
    $('.maleCon').css({
      'opacity': '0.9'
    });
  $('.femaleCon').css({
    'opacity': '0.38'
  });

  } else {
    selectedProps.gender = null;
    visibilityByData();

    $('.femaleCon').css({
      'opacity': '0.9'
    });
  }
}

//filter ob sie mit den coworkern oder den supervisorn reden
function yesYes() {

  if (selectedProps.coworkers === null && selectedProps.supervisor === null || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'No') {

    selectedProps.coworkers = "Yes";
    selectedProps.supervisor = "Yes";

    visibilityByData();
  
    $('.yes-yes').css({
      'opacity': '0.9'
    });
    $('.some-yes').css({
      'opacity': '0.38'
    });
    $('.no-yes').css({
      'opacity': '0.38'
    });
    $('.yes-some').css({
      'opacity': '0.38'
    });
    $('.some-some').css({
      'opacity': '0.38'
    });
    $('.no-some').css({
      'opacity': '0.38'
    });
    $('.yes-no').css({
      'opacity': '0.38'
    });
    $('.some-no').css({
      'opacity': '0.38'
    });
    $('.no-no').css({
      'opacity': '0.38'
    });

  } else {
    selectedProps.coworkers = null;
    selectedProps.supervisor = null;
    visibilityByData();

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
}
function someYes() {

  if (selectedProps.coworkers === null && selectedProps.supervisor === null || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'No') {

    selectedProps.coworkers = "Some of them";
    selectedProps.supervisor = "Yes";

    visibilityByData();
  
    $('.yes-yes').css({
      'opacity': '0.38'
    });
    $('.some-yes').css({
      'opacity': '0.9'
    });
    $('.no-yes').css({
      'opacity': '0.38'
    });
    $('.yes-some').css({
      'opacity': '0.38'
    });
    $('.some-some').css({
      'opacity': '0.38'
    });
    $('.no-some').css({
      'opacity': '0.38'
    });
    $('.yes-no').css({
      'opacity': '0.38'
    });
    $('.some-no').css({
      'opacity': '0.38'
    });
    $('.no-no').css({
      'opacity': '0.38'
    });

  } else {
    selectedProps.coworkers = null;
    selectedProps.supervisor = null;
    visibilityByData();

    $('.yes-yes').css({
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
}
function noYes() {

  if (selectedProps.coworkers === null && selectedProps.supervisor === null || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'No') {

    selectedProps.coworkers = "No";
    selectedProps.supervisor = "Yes";

    visibilityByData();

    $('.yes-yes').css({
    'opacity': '0.38'
    });
    $('.some-yes').css({
      'opacity': '0.38'
    });
    $('.no-yes').css({
      'opacity' : '0.9'
    })
    $('.yes-some').css({
      'opacity': '0.38'
    });
    $('.some-some').css({
      'opacity': '0.38'
    });
    $('.no-some').css({
      'opacity': '0.38'
    });
    $('.yes-no').css({
      'opacity': '0.38'
    });
    $('.some-no').css({
      'opacity': '0.38'
    });
    $('.no-no').css({
      'opacity': '0.38'
    });

  } else {
    selectedProps.coworkers = null;
    selectedProps.supervisor = null;
    visibilityByData();

    $('.yes-yes').css({
      'opacity': '0.9'
    });
    $('.some-yes').css({
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
}
function yesSome() {

  if (selectedProps.coworkers === null && selectedProps.supervisor === null || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'No' ) {

    selectedProps.coworkers = "Yes";
    selectedProps.supervisor = "Some of them";

    visibilityByData();
  
    $('.yes-yes').css({
      'opacity': '0.38'
    });
    $('.some-yes').css({
      'opacity': '0.38'
    });
    $('.no-yes').css({
      'opacity': '0.38'
    });
    $('.yes-some').css({
      'opacity': '0.9'
    });
    $('.some-some').css({
      'opacity': '0.38'
    });
    $('.no-some').css({
      'opacity': '0.38'
    });
    $('.yes-no').css({
      'opacity': '0.38'
    });
    $('.some-no').css({
      'opacity': '0.38'
    });
    $('.no-no').css({
      'opacity': '0.38'
    });

  } else {
    selectedProps.coworkers = null;
    selectedProps.supervisor = null;
    visibilityByData();

    $('.yes-yes').css({
      'opacity': '0.9'
    });
    $('.some-yes').css({
      'opacity': '0.9'
    });
    $('.no-yes').css({
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
}
function someSome() {

  if (selectedProps.coworkers === null && selectedProps.supervisor === null || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'No') {

    selectedProps.coworkers = "Some of them";
    selectedProps.supervisor = "Some of them";

    visibilityByData();
  
    $('.yes-yes').css({
      'opacity': '0.38'
    });
    $('.some-yes').css({
      'opacity': '0.38'
    });
    $('.no-yes').css({
      'opacity': '0.38'
    });
    $('.yes-some').css({
      'opacity': '0.38'
    });
    $('.some-some').css({
      'opacity': '0.9'
    });
    $('.no-some').css({
      'opacity': '0.38'
    });
    $('.yes-no').css({
      'opacity': '0.38'
    });
    $('.some-no').css({
      'opacity': '0.38'
    });
    $('.no-no').css({
      'opacity': '0.38'
    });

  } else {
    selectedProps.coworkers = null;
    selectedProps.supervisor = null;
    visibilityByData();

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
}
function noSome() {

  if (selectedProps.coworkers === null && selectedProps.supervisor === null || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'No') {

    selectedProps.coworkers = "No";
    selectedProps.supervisor = "Some of them";

    visibilityByData();
  
    $('.yes-yes').css({
      'opacity': '0.38'
    });
    $('.some-yes').css({
      'opacity': '0.38'
    });
    $('.no-yes').css({
      'opacity': '0.38'
    });
    $('.yes-some').css({
      'opacity': '0.38'
    });
    $('.some-some').css({
      'opacity': '0.38'
    });
    $('.no-some').css({
      'opacity': '0.9'
    });
    $('.yes-no').css({
      'opacity': '0.38'
    });
    $('.some-no').css({
      'opacity': '0.38'
    });
    $('.no-no').css({
      'opacity': '0.38'
    });

  } else {
    selectedProps.coworkers = null;
    selectedProps.supervisor = null;
    visibilityByData();

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
}
function yesNo() {

  if (selectedProps.coworkers === null && selectedProps.supervisor === null || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'No') {

    selectedProps.coworkers = "Yes";
    selectedProps.supervisor = "No";

    visibilityByData();
  
    $('.yes-yes').css({
      'opacity': '0.38'
    });
    $('.some-yes').css({
      'opacity': '0.38'
    });
    $('.no-yes').css({
      'opacity': '0.38'
    });
    $('.yes-some').css({
      'opacity': '0.38'
    });
    $('.some-some').css({
      'opacity': '0.38'
    });
    $('.no-some').css({
      'opacity': '0.38'
    });
    $('.yes-no').css({
      'opacity': '0.9'
    });
    $('.some-no').css({
      'opacity': '0.38'
    });
    $('.no-no').css({
      'opacity': '0.38'
    });

  } else {
    selectedProps.coworkers = null;
    selectedProps.supervisor = null;
    visibilityByData();

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
    $('.some-no').css({
      'opacity': '0.9'
    });
    $('.no-no').css({
      'opacity': '0.9'
    });
  }
}
function someNo() {

  if (selectedProps.coworkers === null && selectedProps.supervisor === null || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'No') {

    selectedProps.coworkers = "Some of them";
    selectedProps.supervisor = "No";

    visibilityByData();
  
    $('.yes-yes').css({
      'opacity': '0.38'
    });
    $('.some-yes').css({
      'opacity': '0.38'
    });
    $('.no-yes').css({
      'opacity': '0.38'
    });
    $('.yes-some').css({
      'opacity': '0.38'
    });
    $('.some-some').css({
      'opacity': '0.38'
    });
    $('.no-some').css({
      'opacity': '0.38'
    });
    $('.yes-no').css({
      'opacity': '0.38'
    });
    $('.some-no').css({
      'opacity': '0.9'
    });
    $('.no-no').css({
      'opacity': '0.38'
    });

  } else {
    selectedProps.coworkers = null;
    selectedProps.supervisor = null;
    visibilityByData();

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
    $('.no-no').css({
      'opacity': '0.9'
    });
  }
}
function noNo() {

  if (selectedProps.coworkers === null && selectedProps.supervisor === null || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Yes' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'No' && selectedProps.supervisor === 'Some of them' || selectedProps.coworkers === 'Yes' && selectedProps.supervisor === 'No' || selectedProps.coworkers === 'Some of them' && selectedProps.supervisor === 'No') {

    selectedProps.coworkers = "No";
    selectedProps.supervisor = "No";

    visibilityByData();
  
    $('.yes-yes').css({
      'opacity': '0.38'
    });
    $('.some-yes').css({
      'opacity': '0.38'
    });
    $('.no-yes').css({
      'opacity': '0.38'
    });
    $('.yes-some').css({
      'opacity': '0.38'
    });
    $('.some-some').css({
      'opacity': '0.38'
    });
    $('.no-some').css({
      'opacity': '0.38'
    });
    $('.yes-no').css({
      'opacity': '0.38'
    });
    $('.some-no').css({
      'opacity': '0.38'
    });
    $('.no-no').css({
      'opacity': '0.9'
    });

  } else {
    selectedProps.coworkers = null;
    selectedProps.supervisor = null;
    visibilityByData();

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
  }
}