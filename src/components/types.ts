import p5 from 'p5'

export interface ParticleCanvasProps {
  width: number
  height: number
  formData: FormData
}

export interface NeighborInfo {
  needToTurnLeft: boolean
  neighborNumber: number
}

export class Particle {
  p: p5;
  position: p5.Vector;
  heading: number;
  color: p5.Color;

  constructor(p: p5) {
      this.p = p;
      this.position = p.createVector(p.random(p.width), p.random(p.height));
      this.heading = p.random(360);
      this.color = p.color("green");
  }

  update(alpha: number, beta: number, particles: Particle[], speed: number) {
      this.heading += 90;

      const r = particles.filter(
          (other) =>
              other !== this &&
              this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y) <= 5 &&
              this.angleBetween(other) <= 180
      ).length;

      const l = particles.filter(
          (other) =>
              other !== this &&
              this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y) <= 5 &&
              this.angleBetween(other) > 180
      ).length;

      this.heading -= 90;

      const n = r + l;

      if (r > l) {
          this.heading += alpha + n * beta;
      } else if (r < l) {
          this.heading -= alpha + n * beta;
      } else {
          this.heading += alpha;
      }

      this.updateColor(n, particles);

      this.position.x += this.p.cos(this.p.radians(this.heading)) * speed;
      this.position.y += this.p.sin(this.p.radians(this.heading)) * speed;
  }

  angleBetween(other: Particle) {
      const dx = other.position.x - this.position.x;
      const dy = other.position.y - this.position.y;
      const angle = this.p.degrees(this.p.atan2(dy, dx)) - this.heading;
      return this.p.abs(angle) % 360;
  }

  updateColor(n: number, particles: Particle[]) {
      this.color = this.p.color("green");

      if (n > 35) {
          this.color = this.p.color("yellow");
      } else if (n > 15 && n <= 35) {
          this.color = this.p.color("blue");
      } else if (n === 14 || n === 15 || n === 13) {
          this.color = this.p.color("brown");
      }

      if (
          particles.filter(
              (other) =>
                  other !== this &&
                  this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y) <= 1.3
          ).length > 15
      ) {
          this.color = this.p.color("magenta");
      }
  }

  display() {
      this.p.fill(this.color);
      this.p.ellipse(this.position.x, this.position.y, 5, 5);
  }
}

export interface Size {
  width: number
  height: number
}

export interface FormData {
  /**
   * The total number of particles in the screen
   */
  numberOfParticles: number
  /**
   * The radius used to considere particles neighbors
   */
  reactionRadius: number
  /**
   * Determines the particule speed
   */
  speed: number
  /**
   * Determines each particule size
   */
  particuleRadius: number
}

export const createDefaultFormData = (): FormData => {
    return {
        numberOfParticles: 1,
        reactionRadius: 5,
        speed: 0.67,
        particuleRadius: 8
    }
}
