class Player {
  constructor(tileSize) {
    this.ts = tileSize;

    // Current grid position (row/col)
    this.r = 0;
    this.c = 0;

    // Movement throttle
    this.movedAt = 0;
    this.moveDelay = 90; // ms

    // Direction the fish is facing: "right", "left", "up", "down"
    this.direction = "right";
  }

  setCell(r, c) {
    this.r = r;
    this.c = c;
  }

  pixelX() {
    return this.c * this.ts + this.ts / 2;
  }

  pixelY() {
    return this.r * this.ts + this.ts / 2;
  }

  draw() {
    const px = this.pixelX();
    const py = this.pixelY();
    const size = this.ts * 0.6;

    push();
    translate(px, py);

    // Determine rotation angle based on direction
    let angle = 0;
    switch (this.direction) {
      case "right":
        angle = 0;
        break;
      case "left":
        angle = PI;
        break;
      case "up":
        angle = -PI / 2;
        break;
      case "down":
        angle = PI / 2;
        break;
    }
    rotate(angle);

    // --- Fish body ---
    fill(255, 135, 0);
    noStroke();
    ellipse(0, 0, size, size * 0.6);

    // --- Fish tail ---
    fill(255, 110, 0);
    triangle(
      -size / 2,
      0, // back point
      -size / 2 - size / 4,
      -size / 4, // top
      -size / 2 - size / 4,
      size / 4, // bottom
    );

    // --- Fish eye (adjusted relative to body center) ---
    // Always in front along x-axis
    const eyeX = size * 0.25; // distance ahead of center
    const eyeY = -size * 0.1; // slightly up
    fill(255);
    ellipse(eyeX, eyeY, size * 0.15); // white
    fill(0);
    ellipse(eyeX, eyeY, size * 0.08); // pupil

    pop();
  }

  tryMove(level, dr, dc) {
    const now = millis();
    if (now - this.movedAt < this.moveDelay) return false;

    const nr = this.r + dr;
    const nc = this.c + dc;

    if (!level.inBounds(nr, nc)) return false;
    if (level.isWall(nr, nc)) return false;

    // Update direction based on movement
    if (dr === -1) this.direction = "up";
    else if (dr === 1) this.direction = "down";
    else if (dc === -1) this.direction = "left";
    else if (dc === 1) this.direction = "right";

    // Commit movement
    this.r = nr;
    this.c = nc;
    this.movedAt = now;

    return true;
  }
}
