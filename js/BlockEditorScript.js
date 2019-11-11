"use strict";

var SystemBus = sumerian.SystemBus;
var workspace;

// Called when play mode starts.
//
function setup(args, ctx) {
  ctx.worldData.isReset = true;
  setTimeout(() => {
    var toolbox = ctx.worldData.levels[ctx.worldData.currentLevel].toolbox;

    workspace = Blockly.inject("blocklyDiv", {
      toolbox: document.getElementById(toolbox)
    });

    workspace.addChangeListener(Blockly.Events.disableOrphans);
    Blockly.Xml.domToWorkspace(
      document.getElementById("startBlocks"),
      workspace
    );
    Blockly.JavaScript.STATEMENT_PREFIX = "highlightBlock(%1);\n";
    Blockly.JavaScript.addReservedWords("highlightBlock");

    ctx.runCode = function(evt) {
      runCode(ctx);
    };
    ctx.levelChanged = function(evt) {
      levelChanged(ctx);
    };
    ctx.startGame = function(evt) {
      startGame();
    };
    ctx.onChange = function(evt) {
      onChange(ctx);
    };
    ctx.showInstructions = function(evt) {
      showInstructions();
    };

    SystemBus.addListener("levelChanged", ctx.levelChanged);
    SystemBus.addListener("showInstructions", ctx.showInstructions);

    workspace.addChangeListener(ctx.onChange);

    document.addEventListener("contextmenu", event => event.preventDefault());
    document.getElementById("btnRun").addEventListener("click", ctx.runCode);
    document
      .getElementById("btnStart")
      .addEventListener("click", ctx.startGame);

    ctx.worldData.numOfBlocks = workspace.getAllBlocks().length - 1;
    document.getElementById("numOfBlocks").innerText =
      ctx.worldData.numOfBlocks;
    document.getElementById("maxBlocks").innerText =
      ctx.worldData.levels[ctx.worldData.currentLevel].blocks;

    showCode();
  });
}

Math.degrees = function(radians) {
  return (radians * 180) / Math.PI;
};

function levelChanged(ctx) {
  workspace.clear();
  var toolbox = ctx.worldData.levels[ctx.worldData.currentLevel].toolbox;
  Blockly.Xml.domToWorkspace(document.getElementById("startBlocks"), workspace);
  workspace.updateToolbox(document.getElementById(toolbox));
}

function onChange(ctx) {
  ctx.worldData.numOfBlocks = workspace.getAllBlocks().length - 1;

  document.getElementById("numOfBlocks").innerText = ctx.worldData.numOfBlocks;
  document.getElementById("maxBlocks").innerText =
    ctx.worldData.levels[ctx.worldData.currentLevel].blocks;

  if (
    ctx.worldData.numOfBlocks >
    ctx.worldData.levels[ctx.worldData.currentLevel].blocks
  ) {
    document.getElementById("numOfBlocks").style.color = "#FFA200";
  } else {
    document.getElementById("numOfBlocks").style.color = "WHITE";
  }

  showCode();
}

function showInstructions() {
  document.getElementById("title").innerText = "Instructions";
  document.getElementById("words").innerHTML =
    "<ul>" +
    "<li><span>You must build a program that will help the robot move through a path to get to the goal.</span></li>" +
    "<br/>" +
    "<li><span>Each block in the tool box is a command that the robot can understand.</span></li>" +
    "<br/>" +
    "<li><span>Place the blocks on the work space to build the program, and hit the play button.</span></li>" +
    "<br/>" +
    "<li><span>To delete a block, drag it from the workspace to the toolbox," +
    " or use the delete key on your keyboard.</span></li>" +
    "</ul>";
}

function showCode() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

  var code = Blockly.JavaScript.workspaceToCode(workspace);
  var code_array = code.split("\n");
  var code_output = "";

  for (var i = 0; i < code_array.length; i++) {
    if (code_array[i].indexOf("highlightBlock") == -1) {
      if (code_array[i].indexOf("start") == -1) {
        code_output += code_array[i] + "\n\n";
      }
    }
  }

  document.getElementById("JSCode").innerText = code_output;
  colorCode();
}

function colorCode() {
  var pre = document.getElementById("JSCode");
  pre.innerHTML = pre.innerHTML.replace(
    /count[0-9]+/g,
    "<span style='color: #8be9fd'>$&</span>"
  );
  pre.innerHTML = pre.innerHTML.replace(
    /\b\d\b/g,
    "<span style='color: #50fa7b'>$&</span>"
  );
  pre.innerHTML = pre.innerHTML.replace(
    /start/g,
    '<span style="color: #f1fa8c">$&</span>'
  );
  pre.innerHTML = pre.innerHTML.replace(
    /moveForward/g,
    '<span style="color: #f1fa8c">$&</span>'
  );
  pre.innerHTML = pre.innerHTML.replace(
    /turn/g,
    '<span style="color: #f1fa8c">$&</span>'
  );
  pre.innerHTML = pre.innerHTML.replace(
    /for/g,
    '<span style="color: #ff79c6">$&</span>'
  );
  pre.innerHTML = pre.innerHTML.replace(
    /while/g,
    '<span style="color: #ff79c6">$&</span>'
  );
  pre.innerHTML = pre.innerHTML.replace(
    /count/g,
    '<span style="color: #8be9fd">$&</span>'
  );
  pre.innerHTML = pre.innerHTML.replace(
    /isGoal/g,
    '<span style="color: #8be9fd">$&</span>'
  );
  pre.innerHTML = pre.innerHTML.replace(
    /'left'/g,
    "<span style='color: #ffb86c'>$&</span>"
  );
  pre.innerHTML = pre.innerHTML.replace(
    /'right'/g,
    "<span style='color: #ffb86c'>$&</span>"
  );
  pre.innerHTML = pre.innerHTML.replace(
    /var/g,
    "<span style='color: #bd93f9'>$&</span>"
  );
  pre.innerHTML = pre.innerHTML.replace(
    /false/g,
    "<span style='color: #bd93f9'>$&</span>"
  );
}

/*** Block Definitions ***/

Blockly.Blocks["start"] = {
  init: function() {
    this.appendDummyInput().appendField("on start");
    this.setNextStatement(true, null);
    this.setColour("#fda500");
    this.setTooltip("");
    this.setHelpUrl("");
    this.moveBy(15, 0);
  }
};

Blockly.Blocks["move_forward"] = {
  init: function() {
    this.appendDummyInput().appendField("move forward");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#00afbd");
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["turn"] = {
  init: function() {
    this.appendDummyInput()
      .appendField("turn")
      .appendField(
        new Blockly.FieldDropdown([["left", "left"], ["right", "right"]]),
        "Turn"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#00afbd");
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["repeat"] = {
  init: function() {
    this.appendDummyInput()
      .appendField("repeat")
      .appendField(new Blockly.FieldNumber(5, 2, 8), "TIMES")
      .appendField("times");
    this.appendStatementInput("DO")
      .setCheck(null)
      .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#f318a3");
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks["repeat_goal"] = {
  init: function() {
    this.appendDummyInput().appendField("repeat until goal");
    this.appendStatementInput("DO").setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#f318a3");
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

/*** Generator Stubs ***/

Blockly.JavaScript["start"] = function(block) {
  var code = "start();\n";
  return code;
};

Blockly.JavaScript["move_forward"] = function(block) {
  var code = "moveForward();\n";
  return code;
};

Blockly.JavaScript["turn"] = function(block) {
  var dropdown_turn = block.getFieldValue("Turn");
  var code = "turn('" + dropdown_turn + "');\n";
  return code;
};

Blockly.JavaScript["repeat"] = function(block) {
  var repeats = String(Number(block.getFieldValue("TIMES")));
  var branch = Blockly.JavaScript.statementToCode(block, "DO");
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);

  var code = "";
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
    "count",
    Blockly.Variables.NAME_TYPE
  );
  var endVar = repeats;

  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
      "repeat_end",
      Blockly.Variables.NAME_TYPE
    );
    code += "var " + endVar + " = " + repeats + ";\n";
  }

  code +=
    "for (var " +
    loopVar +
    " = 0; " +
    loopVar +
    " < " +
    endVar +
    "; " +
    loopVar +
    "++) {\n" +
    branch +
    "}\n";
  return code;
};

Blockly.JavaScript["repeat_goal"] = function(block) {
  var branch = Blockly.JavaScript.statementToCode(block, "DO");

  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code = "var isGoal = false;\n while (!isGoal) {\n" + branch + "}\n";
  return code;
};

function startGame() {
  SystemBus.emit("buttonPressed");
  SystemBus.emit("playIntro");
  document.getElementById("btnStart").style.display = "none";
  document.getElementById("hider").style.display = "none";
}

function runCode(ctx) {
  SystemBus.emit("buttonPressed");
  ctx.worldData.isReset = !ctx.worldData.isReset;

  if (!ctx.worldData.isReset) {
    var rotation = Math.degrees(ctx.worldData.playerRot);
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var running = false;

    workspace.highlightBlock(null);

    var lastBlockToHighlight = null;
    var myInterpreter = new Interpreter(code, (interpreter, scope) => {
      interpreter.setProperty(
        scope,
        "highlightBlock",
        interpreter.createNativeFunction(id => {
          id = id ? id.toString() : "";
          running = false;
          workspace.highlightBlock(lastBlockToHighlight);
          lastBlockToHighlight = id;
        })
      );

      interpreter.setProperty(
        scope,
        "start",
        interpreter.createNativeFunction(val => {
          val = val ? val.toString() : "";
        })
      );

      interpreter.setProperty(
        scope,
        "moveForward",
        interpreter.createNativeFunction(val => {
          val = val ? val.toString() : "";
          if (rotation === 0) {
            SystemBus.emit("movePosX");
          } else if (rotation === 90) {
            SystemBus.emit("moveNegZ");
          } else if (rotation === 180) {
            SystemBus.emit("moveNegX");
          } else if (rotation === 270) {
            SystemBus.emit("movePosZ");
          }
        })
      );

      interpreter.setProperty(
        scope,
        "turn",
        interpreter.createNativeFunction(val => {
          val = val ? val.toString() : "";
          if (val === "left") {
            rotation = (rotation + 90) % 360;
            SystemBus.emit("turnLeft");
          } else if (val === "right") {
            rotation = (rotation + 270) % 360;
            SystemBus.emit("turnRight");
          }
        })
      );
    });

    ctx.worldData.intervalId = setInterval(() => {
      running = true;
      while (running) {
        if (!myInterpreter.step()) {
          workspace.highlightBlock(lastBlockToHighlight);
          clearInterval(ctx.worldData.intervalId);
          return;
        }
      }
    }, 600);

    document.getElementById("btnRun").style.backgroundColor = "#F44336";
    document.getElementById("btnRun").innerHTML = '<i class="fas fa-stop"></i>';
  } else {
    clearInterval(ctx.worldData.intervalId);
    SystemBus.emit("resetPlayer");
    document.getElementById("btnRun").style.backgroundColor = "#4CAF50";
    document.getElementById("btnRun").innerHTML = '<i class="fas fa-play"></i>';
  }
}

var cleanup = function(args, ctx) {
  clearInterval(ctx.worldData.intervalId);
};
