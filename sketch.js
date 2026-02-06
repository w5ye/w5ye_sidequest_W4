/*
Week 4 — Example 4: Playable Maze (JSON + Level class + Player class)
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

This is the "orchestrator" file:
- Loads JSON levels (preload)
- Builds Level objects
- Creates/positions the Player
- Handles input + level switching

It is intentionally light on "details" because those are moved into:
- Level.js (grid + drawing + tile meaning)
- Player.js (position + movement rules)

Based on the playable maze structure from Example 3
*/

const TS = 32;

// Raw JSON data (from levels.json).
let levelsData;

// Array of Level instances.
let levels = [];

// Current level index.
let li = 0;

// Player instance (tile-based).
let player;

// ----- Feedback state -----
let feedbackMessage = "";
let feedbackAt = 0;
let feedbackDuration = 1000; // ms
let flashAt = -1;
let flashDuration = 200; // ms

let successScreen; // new

function preload() {
  // Ensure level data is ready before setup runs.
  levelsData = loadJSON("levels.json");
}

function setup() {
  /*
  Convert raw JSON grids into Level objects.
  levelsData.levels is an array of 2D arrays. 
  */
  levels = levelsData.levels.map((grid) => new Level(copyGrid(grid), TS));

  // Create a player.
  player = new Player(TS);

  // Load the first level (sets player start + canvas size).
  loadLevel(0);

  noStroke();
  textFont("sans-serif");
  textSize(14);

  successScreen = new SuccessScreen(); // initialize
}

function draw() {
  if (successScreen.active) {
    successScreen.draw(); // show end screen instead of level
    return;
  }

  background(240);
  levels[li].draw();
  player.draw();
  drawFlash();
  drawHUD();
}

function drawHUD() {
  fill(0);
  text(`Level ${li + 1}/${levels.length} — WASD/Arrows to move`, 10, 16);

  const elapsed = millis() - feedbackAt;

  if (elapsed < feedbackDuration && feedbackMessage !== "") {
    push();

    // --- Rectangle background ---
    const padding = 8;
    textSize(14);
    const w = textWidth(feedbackMessage) + padding * 2;
    const h = 24; // height of popup
    fill(180, 0, 0, 220); // semi-transparent red
    noStroke();
    rect(50, 30, w, h, 6); // 6px rounded corners

    // --- Text on top ---
    fill(255);
    text(feedbackMessage, 50 + padding, 30 + h / 2 + 5); // slightly vertically centered

    pop();
  }
}

function keyPressed() {
  let dr = 0;
  let dc = 0;

  if (keyCode === LEFT_ARROW || key === "a" || key === "A") dc = -1;
  else if (keyCode === RIGHT_ARROW || key === "d" || key === "D") dc = 1;
  else if (keyCode === UP_ARROW || key === "w" || key === "W") dr = -1;
  else if (keyCode === DOWN_ARROW || key === "s" || key === "S") dr = 1;
  else return; // not a movement key

  //  ACTUALLY MOVE THE PLAYER
  const moved = player.tryMove(levels[li], dr, dc);

  if (!moved) return;

  // Obstacle tile (4)
  if (levels[li].tileAt(player.r, player.c) === 4) {
    feedbackMessage = "Uh oh! Avoid the polluted water.";
    feedbackAt = millis();
    flashAt = millis();

    loadLevel(li);
    return;
  }

  // Goal tile
  if (levels[li].isGoal(player.r, player.c)) {
    nextLevel();
  }
}

// ----- Level switching -----

function loadLevel(idx) {
  li = idx;
  const level = levels[li];

  if (level.start) {
    player.setCell(level.start.r, level.start.c);
  } else {
    player.setCell(1, 1);
  }

  player.movedAt = 0; // allow immediate movement after reset
  resizeCanvas(level.pixelWidth(), level.pixelHeight());
}

function nextLevel() {
  const next = li + 1;

  if (next >= levels.length) {
    // All levels completed → show success screen
    successScreen.show();
    return;
  }

  loadLevel(next);
}

// ----- Utility -----

function copyGrid(grid) {
  /*
  Make a deep-ish copy of a 2D array:
  - new outer array
  - each row becomes a new array

  Why copy?
  - Because Level constructor may normalize tiles (e.g., replace 2 with 0)
  - And we don’t want to accidentally mutate the raw JSON data object. 
  */
  return grid.map((row) => row.slice());
}
function drawFlash() {
  if (flashAt < 0) return; // no flash triggered yet

  const elapsed = millis() - flashAt;

  if (elapsed < flashDuration) {
    push();
    fill(255, 0, 0, 80);
    rect(0, 0, width, height);
    pop();
  }
}
function mousePressed() {
  // Only check if success screen is active
  if (successScreen.active && successScreen.isMouseOverButton()) {
    // Restart game: go back to level 0
    successScreen.hide();
    loadLevel(0);
  }
}
