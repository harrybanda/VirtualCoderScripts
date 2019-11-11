"use strict";

var SystemBus = sumerian.SystemBus;

var lvlNum = 1;

function setup(args, ctx) {
  // First element of path is always the goal
  // Second element of path is always the start
  ctx.worldData.levels = [
    // Level 1
    {
      path: [[-0.25, 0.75], [-0.25, -0.25], [-0.25, 0.25]],
      angle: 270,
      toolbox: "toolbox_1",
      blocks: 2
    },
    // Level 2
    {
      path: [[0.75, -0.25], [-0.75, -0.25], [-0.25, -0.25], [0.25, -0.25]],
      angle: 0,
      toolbox: "toolbox_1",
      blocks: 3
    },
    // Level 3
    {
      path: [[0.25, -0.25], [-0.75, 0.25], [-0.25, 0.25], [0.25, 0.25]],
      angle: 0,
      toolbox: "toolbox_1",
      blocks: 4
    },
    // Level 4
    {
      path: [[0.25, 0.25], [-0.75, -0.25], [-0.25, -0.25], [-0.25, 0.25]],
      angle: 0,
      toolbox: "toolbox_1",
      blocks: 5
    },
    // Level 5
    {
      path: [
        [0.75, 0.25],
        [-0.75, 0.25],
        [-0.75, -0.25],
        [-0.25, -0.25],
        [0.25, -0.25],
        [0.75, -0.25]
      ],
      angle: 90,
      toolbox: "toolbox_1",
      blocks: 7
    },
    // Level 6
    {
      path: [
        [1.25, 0.25],
        [-1.25, 0.25],
        [-0.75, 0.25],
        [-0.25, 0.25],
        [0.25, 0.25],
        [0.75, 0.25]
      ],
      angle: 0,
      toolbox: "toolbox_2",
      blocks: 2
    },
    // Level 7
    {
      path: [
        [-0.25, -1.25],
        [-0.25, 1.25],
        [-0.25, 0.75],
        [-0.25, 0.25],
        [-0.25, -0.25],
        [-0.25, -0.75]
      ],
      angle: 0,
      toolbox: "toolbox_2",
      blocks: 3
    },
    // Level 8
    {
      path: [
        [-0.75, -1.25],
        [1.25, 1.25],
        [0.75, 1.25],
        [0.25, 1.25],
        [-0.25, 1.25],
        [-0.75, 1.25],
        [-0.75, 0.75],
        [-0.75, 0.25],
        [-0.75, -0.25],
        [-0.75, -0.75]
      ],
      angle: 180,
      toolbox: "toolbox_2",
      blocks: 5
    },
    // Level 9
    {
      path: [
        [-0.75, -1.25],
        [-0.75, 1.25],
        [-0.75, 0.75],
        [-0.75, 0.25],
        [-0.75, -0.25],
        [-0.75, -0.75]
      ],
      angle: 90,
      toolbox: "toolbox_3",
      blocks: 2
    },
    // Level 10
    {
      path: [
        [-0.75, 0.25],
        [-0.75, -0.75],
        [-0.25, -0.75],
        [0.25, -0.75],
        [0.25, -0.25],
        [0.25, 0.25],
        [-0.25, 0.25]
      ],
      angle: 0,
      toolbox: "toolbox_3",
      blocks: 4
    },
    // Level 11
    {
      path: [
        [1.25, 1.25],
        [-1.25, -1.25],
        [-1.25, -0.75],
        [-0.75, -0.75],
        [-0.75, -0.25],
        [-0.25, -0.25],
        [-0.25, 0.25],
        [0.25, 0.25],
        [0.25, 0.75],
        [0.75, 0.75],
        [0.75, 1.25]
      ],
      angle: 270,
      toolbox: "toolbox_3",
      blocks: 5
    }
  ];

  ctx.resetFunct = function(evt) {
    setPlayer(ctx);
  };
  SystemBus.addListener("resetPlayer", ctx.resetFunct);

  ctx.worldData.currentLevel = 0;

  setLevel(ctx, args);

  ctx.nextLevel = function(evt) {
    nextLevel(ctx, args);
  };
  document.getElementById("btnNext").addEventListener("click", ctx.nextLevel);
  document.getElementById("level-h").innerText =
    "Level: " + lvlNum + "/" + ctx.worldData.levels.length;
}

function isBetween(n, a, b) {
  return (n - a) * (n - b) <= 0;
}

function generateCoords() {
  var coords = [];
  for (var i = 0; i < 8; i++) {
    coords.push([]);
    for (var j = -1.75; j < 2; j += 0.5) {
      let c = Math.round(j * 100) / 100;
      coords[i].push(c);
    }
  }
  return coords;
}

function setPlayer(ctx) {
  ctx.playerX = ctx.worldData.levels[ctx.worldData.currentLevel].path[1][0];
  ctx.playerZ = ctx.worldData.levels[ctx.worldData.currentLevel].path[1][1];
  ctx.playerY = 0.21;

  ctx.worldData.playerRot = Math.radians(
    ctx.worldData.levels[ctx.worldData.currentLevel].angle
  );
  ctx.entity.setTranslation(ctx.playerX, ctx.playerY, ctx.playerZ);
  ctx.entity.setRotation(0, ctx.worldData.playerRot, 0);
}

Math.radians = function(degrees) {
  return (degrees * Math.PI) / 180;
};

function setLevel(ctx, args) {
  ctx.dangerZones = [];

  setPlayer(ctx);

  var quadY = 0.205;
  var lvlStr = JSON.stringify(
    ctx.worldData.levels[ctx.worldData.currentLevel].path
  );
  var coords = generateCoords();

  // Add path
  for (
    var i = 1;
    i < ctx.worldData.levels[ctx.worldData.currentLevel].path.length;
    i++
  ) {
    var path = ctx.worldData.levels[ctx.worldData.currentLevel].path[i];
    var x = path[0];
    var z = path[1];

    var pathQuad = sumerian.EntityUtils.clone(ctx.world, args.pathQuad);
    pathQuad.setTranslation(x, quadY, z);
    pathQuad.addToWorld();
  }

  // Add danger zones
  for (var i = 0; i < coords.length; i++) {
    var c = coords[i];
    for (var j = 0; j < c.length; j++) {
      var x = c[i];
      var z = c[j];
      if (!lvlStr.includes("[" + x + "," + z + "]")) {
        ctx.dangerZones.push([x, z]);
        var dangerQuad = sumerian.EntityUtils.clone(ctx.world, args.dangerQuad);
        dangerQuad.setTranslation(x, quadY, z);
        dangerQuad.addToWorld();
      }
    }
  }

  // Add goal
  ctx.goalx = ctx.worldData.levels[ctx.worldData.currentLevel].path[0][0];
  ctx.goalz = ctx.worldData.levels[ctx.worldData.currentLevel].path[0][1];

  var goalQuad = sumerian.EntityUtils.clone(ctx.world, args.goalQuad);
  goalQuad.setTranslation(ctx.goalx, quadY, ctx.goalz);
  goalQuad.addToWorld();
}

function nth(n) {
  return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
}

function nextLevel(ctx, args) {
  var LoopSpeech =
    "<speak>" +
    'In this level we have a new block called "Repeat".' +
    '<break time="500ms"/> This block allows the robot to perform an action multiple times.' +
    '<break time="500ms"/> You can insert other blocks inside the repeat block.' +
    '<break time="250ms"/> You can also change the number of repetitions to be made.' +
    "</speak>";

  var LoopUntillSpeech =
    "<speak>" +
    'In this level we have another block called "Repeat Until Goal".' +
    '<break time="500ms"/> This block allows the robot to continue performing an action until it reaches the goal.' +
    '<break time="500ms"/> You can also insert other blocks inside this block.' +
    "</speak>";

  SystemBus.emit("buttonPressed");

  if (ctx.worldData.currentLevel < ctx.worldData.levels.length - 1) {
    lvlNum++;
    ctx.worldData.currentLevel++;
    setLevel(ctx, args);
    ctx.worldData.isReset = true;
    document.getElementById("btnRun").style.backgroundColor = "#4CAF50";
    document.getElementById("btnRun").innerHTML = '<i class="fas fa-play"></i>';
    document.getElementById("level-h").innerText =
      "Level: " + lvlNum + "/" + ctx.worldData.levels.length;
    document.getElementById("btnNext").style.display = "none";
    SystemBus.emit("levelChanged");

    if (lvlNum === 6) {
      document.getElementById("title").innerText = "Repeat Block";
      document.getElementById("words").innerHTML =
        "<ul>" +
        "<li><span>The repeat block allows the robot to perform an action multiple times.</span></li>" +
        "<br/>" +
        "<li><span>You can insert other blocks inside the repeat block.</span></li>" +
        "<br/>" +
        "<li><span>You can also change the number of repetitions to be made.</span></li>" +
        "</ul>";
      ctx.worldData.speech.updateConfig({ body: LoopSpeech });
      ctx.worldData.speech.play().then(() => {});
    } else if (lvlNum === 9) {
      document.getElementById("title").innerText = "Repeat Until Goal Block";
      document.getElementById("words").innerHTML =
        "<ul>" +
        "<li><span>The repeat block allows the robot to continue performing" +
        "an action until it reaches the goal.</span></li>" +
        "<br/>" +
        "<li><span>You can also insert other blocks inside this block.</span></li>" +
        "</ul>";
      ctx.worldData.speech.updateConfig({ body: LoopUntillSpeech });
      ctx.worldData.speech.play().then(() => {});
    } else {
      document.getElementById("words").innerHTML = "";
      document.getElementById("title").innerHTML = "";
    }
  } else {
    lvlNum = 1;
    ctx.worldData.currentLevel = 0;
    setLevel(ctx, args);
    ctx.worldData.isReset = true;
    document.getElementById("btnRun").style.backgroundColor = "#4CAF50";
    document.getElementById("btnRun").innerHTML = '<i class="fas fa-play"></i>';
    document.getElementById("level-h").innerText =
      "Level: " + lvlNum + "/" + ctx.worldData.levels.length;
    document.getElementById("btnNext").style.display = "none";
    SystemBus.emit("levelChanged");
  }
}

function lvlCompleteSpeech(ctx) {
  var speech = "";
  var introArray = ["Congratulations!", "Good job!", "Congrats!", "Awesome!"];

  var randomIntro = Math.floor(Math.random() * introArray.length);

  if (lvlNum === 1) {
    var functionsExp =
      '<break time="500ms"/>From the code on your right, "move Forward" is known as a "function call".' +
      '<break time="250ms"/>A function is a block of code designed to perform a particular task.' +
      '<break time="250ms"/>In this case the function "move Forward" moves the robot one step forward.';

    document.getElementById("title").innerText = "Function Calls";
    document.getElementById("words").innerHTML =
      "<ul>" +
      '<li><span>From the code on your right, "moveForward()" is known as a "function call".</span></li>' +
      "<br/>" +
      "<li><span>A function is a block of code designed to perform a particular task.</span></li>" +
      "<br/>" +
      '<li><span>In this case the function "moveForward()" moves the robot one step forward.</span></li>' +
      "</ul>";

    if (
      ctx.worldData.numOfBlocks >
      ctx.worldData.levels[ctx.worldData.currentLevel].blocks
    ) {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        '<break time="500ms"/>It is also possible to complete this level with ' +
        ctx.worldData.levels[ctx.worldData.currentLevel].blocks +
        " blocks." +
        functionsExp +
        "</speak>";
    } else {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        functionsExp +
        '<break time="500ms"/>Click next to continue.' +
        "</speak>";
    }
  } else if (lvlNum === 3) {
    var argsExp =
      '<break time="500ms"/>From the code on your right, the function call "turn" has an argument.' +
      '<break time="250ms"/>Function arguments are the values passed to (and received by) the function.' +
      '<break time="250ms"/>In this case the function "turn" has an argument of "left" passed to it.';

    document.getElementById("title").innerText = "Function Arguments";
    document.getElementById("words").innerHTML =
      "<ul>" +
      '<li><span>From the code on your right, the function call "turn("left")" has an argument.</span></li>' +
      "<br/>" +
      "<li><span>Function arguments are the values passed to (and received by) the function.</span></li>" +
      "<br/>" +
      '<li><span>In this case the function "turn("left")" has an argument of "left" passed to it.</span></li>' +
      "</ul>";

    if (
      ctx.worldData.numOfBlocks >
      ctx.worldData.levels[ctx.worldData.currentLevel].blocks
    ) {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        '<break time="500ms"/>It is also possible to complete this level with ' +
        ctx.worldData.levels[ctx.worldData.currentLevel].blocks +
        " blocks." +
        argsExp +
        "</speak>";
    } else {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        argsExp +
        '<break time="500ms"/>Click next to continue.' +
        "</speak>";
    }
  } else if (lvlNum === 6) {
    var forloopExp =
      '<break time="500ms"/>The code on your right shows a "For Loop".' +
      '<break time="250ms"/>A "For Loop" loops through a block of code a number of times.';

    document.getElementById("title").innerText = "For Loops";
    document.getElementById("words").innerHTML =
      "<ul>" +
      "<li><span>The code on your right shows a for loop.</span></li>" +
      "<br/>" +
      "<li><span>A for loop loops through a block of code a number of times.</span></li>" +
      "</ul>";

    if (
      ctx.worldData.numOfBlocks >
      ctx.worldData.levels[ctx.worldData.currentLevel].blocks
    ) {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        '<break time="500ms"/>It is also possible to complete this level with ' +
        ctx.worldData.levels[ctx.worldData.currentLevel].blocks +
        " blocks." +
        forloopExp +
        "</speak>";
    } else {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        forloopExp +
        '<break time="500ms"/>Click next to continue.' +
        "</speak>";
    }
  } else if (lvlNum === 9) {
    var whileloopExp =
      '<break time="500ms"/>The code on your right shows a "While Loop".' +
      '<break time="250ms"/>A "While Loop" loops through a block of code while a specified condition is true.';
    document.getElementById("title").innerText = "While Loops";
    document.getElementById("words").innerHTML =
      "<ul>" +
      '<li><span>The code on your right shows a "While Loop".</span></li>' +
      "<br/>" +
      '<li><span>A "While Loop" loops through a block of code while a specified condition is true.</span></li>' +
      "</ul>";

    if (
      ctx.worldData.numOfBlocks >
      ctx.worldData.levels[ctx.worldData.currentLevel].blocks
    ) {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        '<break time="500ms"/>It is also possible to complete this level with ' +
        ctx.worldData.levels[ctx.worldData.currentLevel].blocks +
        " blocks." +
        whileloopExp +
        "</speak>";
    } else {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        whileloopExp +
        '<break time="500ms"/>Click next to continue.' +
        "</speak>";
    }
  } else if (lvlNum === 11) {
    if (
      ctx.worldData.numOfBlocks >
      ctx.worldData.levels[ctx.worldData.currentLevel].blocks
    ) {
      speech =
        "<speak>" +
        "Congratulations!" +
        '<mark name="gesture:you"/> You have completed all the levels! ' +
        "and you have completed this level with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        '<break time="500ms"/>It is also possible to complete this level with ' +
        ctx.worldData.levels[ctx.worldData.currentLevel].blocks +
        " blocks." +
        "</speak>";
    } else {
      speech =
        "<speak>" +
        "Congratulations!" +
        '<mark name="gesture:you"/> You have completed all the levels! ' +
        "and you have completed this level with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        "</speak>";
    }
  } else {
    if (
      ctx.worldData.numOfBlocks >
      ctx.worldData.levels[ctx.worldData.currentLevel].blocks
    ) {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        '<break time="500ms"/>It is also possible to complete this level with ' +
        ctx.worldData.levels[ctx.worldData.currentLevel].blocks +
        " blocks." +
        "</speak>";
    } else {
      speech =
        "<speak>" +
        introArray[randomIntro] +
        '<mark name="gesture:you"/> You have completed the ' +
        lvlNum +
        nth(lvlNum) +
        " level " +
        "with " +
        ctx.worldData.numOfBlocks +
        " lines of code." +
        '<break time="500ms"/>Click next to continue.' +
        "</speak>";
    }
  }

  return speech;
}

function wrongMoveSpeech() {
  var speech = "";
  var sayArray = [
    "Something is not right, try again.",
    "Wrong move, try again.",
    "Keep coding, try again.",
    "Something is not quite right yet."
  ];

  var randomSay = Math.floor(Math.random() * sayArray.length);

  speech = "<speak>" + sayArray[randomSay] + "</speak>";

  return speech;
}

function update(args, ctx) {
  var area = 0.05;
  var yOffset = 0.22;
  var py = 0.21;

  // Check if on goal
  if (
    isBetween(
      ctx.entity.getTranslation().x,
      ctx.goalx + area,
      ctx.goalx - area
    ) &&
    isBetween(
      ctx.entity.getTranslation().z,
      ctx.goalz + area,
      ctx.goalz - area
    ) &&
    ctx.entity.getTranslation().y === py
  ) {
    ctx.entity.setTranslation(ctx.goalx, yOffset, ctx.goalz);
    clearInterval(ctx.worldData.intervalId);
    SystemBus.emit("levelComplete");

    ctx.worldData.speech.updateConfig({ body: lvlCompleteSpeech(ctx) });
    setTimeout(() => {
      ctx.worldData.speech.play().then(() => {
        if (lvlNum === 11) {
          document.getElementById("btnNext").innerText = "First";
        } else {
          document.getElementById("btnNext").innerText = "Next";
        }
        document.getElementById("btnNext").style.display = "block";
      });
    }, 1000);
  }

  // Check if on danger zone
  for (var i = 0; i < ctx.dangerZones.length; i++) {
    if (
      isBetween(
        ctx.entity.getTranslation().x,
        ctx.dangerZones[i][0] + area,
        ctx.dangerZones[i][0] - area
      ) &&
      isBetween(
        ctx.entity.getTranslation().z,
        ctx.dangerZones[i][1] + area,
        ctx.dangerZones[i][1] - area
      ) &&
      ctx.entity.getTranslation().y === py
    ) {
      ctx.entity.setTranslation(
        ctx.dangerZones[i][0],
        yOffset,
        ctx.dangerZones[i][1]
      );
      clearInterval(ctx.worldData.intervalId);
      SystemBus.emit("wrongWay");

      ctx.worldData.speech.updateConfig({ body: wrongMoveSpeech() });
      setTimeout(() => {
        ctx.worldData.speech.play();
      }, 1000);
    }
  }
}

var cleanup = function(args, ctx) {
  SystemBus.removeListener("resetPlayer", ctx.resetFunct);
};

var parameters = [
  {
    name: "Path quad",
    type: "entity",
    key: "pathQuad"
  },
  {
    name: "Goal quad",
    type: "entity",
    key: "goalQuad"
  },
  {
    name: "Danger quad",
    type: "entity",
    key: "dangerQuad"
  }
];
