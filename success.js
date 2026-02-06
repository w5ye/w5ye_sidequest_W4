// success.js
// Handles showing a “You Win” screen with restart button

class SuccessScreen {
  constructor() {
    this.active = false; // whether the screen is showing
    this.buttonX = 0;
    this.buttonY = 0;
    this.buttonW = 200;
    this.buttonH = 50;
  }

  show() {
    this.active = true;
  }

  hide() {
    this.active = false;
  }

  draw() {
    if (!this.active) return;

    push();
    // Dark overlay
    fill(0, 44, 97);
    rect(0, 0, width, height);
    pop();

    push();
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(255, 220, 0);
    text("You win! O<|", width / 2, height / 2 - 60);

    textSize(14);
    fill(255);
    text(
      "Your fish is finally full. \n" + "Click the button to play again",
      width / 2,
      height / 2 - 20,
    );

    // Draw restart button
    this.buttonX = width / 2 - this.buttonW / 2;
    this.buttonY = height / 2 + 20;
    // Change color on hover
    if (this.isMouseOverButton()) {
      fill(0, 200, 255); // lighter blue when hovered
    } else {
      fill(0, 150, 255); // normal blue
    }
    rect(this.buttonX, this.buttonY, this.buttonW, this.buttonH, 10);

    fill(255);
    textSize(20);
    text("Restart Game", width / 2, this.buttonY + this.buttonH / 2);
    pop();
  }

  // Check if the mouse is over the button
  isMouseOverButton() {
    return (
      mouseX >= this.buttonX &&
      mouseX <= this.buttonX + this.buttonW &&
      mouseY >= this.buttonY &&
      mouseY <= this.buttonY + this.buttonH
    );
  }
}
