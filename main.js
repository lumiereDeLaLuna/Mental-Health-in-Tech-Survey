let stageHeight, stageWidth;
let data;
let stage;

$(function () {
  stage = $('#stage');
  stageHeight = stage.innerHeight();
  stageWidth = stage.innerWidth();
  createDots();
  //drawMap();
  //drawFamilyBackground();
  //drawAnnualRing(0);
  //talkAboutView();
  interfereView();
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
        gender: person.gender,
        mentalHealthConsequence: person.mentalHealthConsequence,
        coworkers: person.coworkers,
        supervisor: person.supervisor
      });

      stage.append(dot);

    });
  }
}

//function, damit die Filter funktionieren
function visibilityByData(prop, val) {
  $('.person-interfere-talkAbout').each(function () {
    if ($(this).data(prop) === val) {
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
      'height': rMap * 5,
      'width': rMap * 5,
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

  $('.person-interfere-talkAbout').each(function () {
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
  $('.person-interfere-talkAbout').each(function () {
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

//welcher Screen aus gerade gezeigt wird
function whereView() {

  drawMap();

  $('.where-opacity').addClass('where').removeClass('where-opacity');
  $('.interfere').addClass('interfere-opacity').removeClass('interfere');
  $('.talkAbout').addClass('talkAbout-opacity').removeClass('talkAbout');

  mapButton();

}
function interfereView() {

  drawFamilyBackground();

  $('.where').addClass('where-opacity').removeClass('where');
  $('.interfere-opacity').addClass('interfere').removeClass('interfere-opacity');
  $('.talkAbout').addClass('talkAbout-opacity').removeClass('talkAbout');

  interfereButton();

}
function talkAboutView() {
  drawAnnualRing();

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
  visibilityByData("mentalHealthConsequence", ["female", "male"]);

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
  visibilityByData("mentalHealthConsequence", "Yes");

  $('.yesCon').css({
    'opacity': '0.9'
  });
  $('.maybeCon').css({
    'opacity': '0.38'
  });
  $('.noCon').css({
    'opacity': '0.38'
  });
}
function maybeTalkAboutView() {
  visibilityByData("mentalHealthConsequence", "Maybe");

  $('.yesCon').css({
    'opacity': '0.38'
  });
  $('.maybeCon').css({
    'opacity': '0.9'
  });
  $('.noCon').css({
    'opacity': '0.38'
  });
}
function noTalkAboutView() {
  visibilityByData("mentalHealthConsequence", "No");

  $('.yesCon').css({
    'opacity': '0.38'
  });
  $('.maybeCon').css({
    'opacity': '0.38'
  });
  $('.noCon').css({
    'opacity': '0.9'
  });
}

//filter nach dem gender
function genderTalkAboutView() {
  visibilityByData("gender", ["female", "male"]);

  $('.femaleCon').css({
    'opacity': '0.9'
  });
  $('.maleCon').css({
    'opacity': '0.9'
  });
}
function femaleTalkAboutView() {
  visibilityByData("gender", "female");

  $('.femaleCon').css({
    'opacity': '0.9'
  });
  $('.maleCon').css({
    'opacity': '0.38'
  });
}
function maleTalkAboutView() {
  visibilityByData("gender", "male");

  $('.femaleCon').css({
    'opacity': '0.38'
  });
  $('.maleCon').css({
    'opacity': '0.9'
  });
}

//filter ob sie mit den coworkern oder den supervisorn reden
function yesYes() {
  visibilityByData("coworkers", "Yes");
  visibilityByData("supervisor", "Yes");

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
}
function someYes() {
  visibilityByData("coworkers", "Some of them");
  visibilityByData("supervisor", "Yes");

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
}
function noYes() {
  visibilityByData("coworkers", "No");
  visibilityByData("supervisor", "Yes");

  $('.yes-yes').css({
    'opacity': '0.38'
  });
  $('.some-yes').css({
    'opacity': '0.38'
  });
  $('.no-yes').css({
    'opacity': '0.9'
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
}
function yesSome() {
  visibilityByData("coworkers", "Yes");
  visibilityByData("supervisor", "Some of them");

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
}
function someSome() {
  visibilityByData("coworkers", "Some of them");
  visibilityByData("supervisor", "Some of them");

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
}
function noSome() {
  visibilityByData("coworkers", "No");
  visibilityByData("supervisor", "Some of them");

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
}
function yesNo() {
  visibilityByData("coworkers", "Yes");
  visibilityByData("supervisor", "No");

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
}
function someNo() {
  visibilityByData("coworkers", "Some of them");
  visibilityByData("supervisor", "No");

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
}
function noNo() {
  visibilityByData("coworkers", "No");
  visibilityByData("supervisor", "No");

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
}