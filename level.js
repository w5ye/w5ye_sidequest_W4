/*
Level.js

A Level represents ONE maze grid loaded from levels.json. 

Tile legend (from your original example): 
0 = floor
1 = wall
2 = start
3 = goal
4 = obstacle

Responsibilities:
- Store the grid
- Find the start tile
- Provide collision/meaning queries (isWall, isGoal, inBounds)
- Draw the tiles (including a goal highlight)
*/

class Level {
  constructor(grid, tileSize) {
    // Store the tile grid and tile size (pixels per tile).
    this.grid = grid;
    this.ts = tileSize;

    // Start position in grid coordinates (row/col).
    // We compute this by scanning for tile value 2.
    this.start = this.findStart();

    // Optional: if you don't want the start tile to remain "special"
    // after you’ve used it to spawn the player, you can normalize it
    // to floor so it draws like floor and behaves like floor.
    if (this.start) {
      this.grid[this.start.r][this.start.c] = 0;
    }
  }

  // ----- Size helpers -----

  rows() {
    return this.grid.length;
  }

  cols() {
    return this.grid[0].length;
  }

  pixelWidth() {
    return this.cols() * this.ts;
  }

  pixelHeight() {
    return this.rows() * this.ts;
  }

  // ----- Semantic helpers -----

  inBounds(r, c) {
    return r >= 0 && c >= 0 && r < this.rows() && c < this.cols();
  }

  tileAt(r, c) {
    // Caller should check inBounds first.
    return this.grid[r][c];
  }

  isWall(r, c) {
    return this.tileAt(r, c) === 1;
  }

  isGoal(r, c) {
    return this.tileAt(r, c) === 3;
  }

  // ----- Start-finding -----

  findStart() {
    // Scan entire grid to locate the tile value 2 (start).
    for (let r = 0; r < this.rows(); r++) {
      for (let c = 0; c < this.cols(); c++) {
        if (this.grid[r][c] === 2) {
          return { r, c };
        }
      }
    }

    // If a level forgets to include a start tile, return null.
    // (Then the game can choose a default spawn.)
    return null;
  }

  // ----- Drawing -----

  draw() {
    for (let r = 0; r < this.rows(); r++) {
      for (let c = 0; c < this.cols(); c++) {
        const v = this.grid[r][c];

        const x = c * this.ts;
        const y = r * this.ts;

        noStroke();

        // ---- WALLS ----
        if (v === 1) {
          fill(194, 160, 122);
          rect(x, y, this.ts, this.ts);
          continue;
        }

        // ---- OBSTACLE (4) ----
        if (v === 4) {
          fill(103, 128, 28);
          rect(x, y, this.ts, this.ts);
          continue;
        }

        // ---- WATER TILE (floor / start / goal) ----
        fill(30, 120, 180);
        rect(x, y, this.ts, this.ts);

        // Draw animated wave lines
        stroke(200, 230, 255, 150);
        noFill();

        for (let i = 0; i < 3; i++) {
          stroke(200, 230, 255, 150);
          noFill();

          let points = 10; // number of points along the line
          beginShape();
          for (let j = 0; j <= points; j++) {
            const px = x + 4 + (j / points) * (this.ts - 8);
            const py =
              y +
              this.ts / 2 +
              sin(frameCount * 0.05 + r + c + i + j * 0.5) * 4 +
              i * 4;
            vertex(px, py);
          }
          endShape();
        }

        noStroke();

        // ---- GOAL HIGHLIGHT ----
        if (v === 3) {
          push();
          fill(255, 200, 50); // bright yellow pellet
          noStroke();

          const x = c * this.ts + this.ts / 2;
          const y = r * this.ts + this.ts / 2;
          const rSize = this.ts * 0.3;

          ellipse(x, y, rSize); // main circle
          ellipse(x + rSize * 0.3, y - rSize * 0.1, rSize * 0.2); // highlight
          pop();
        }
      }
    }
  }
}
