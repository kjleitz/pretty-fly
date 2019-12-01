/* eslint-disable max-classes-per-file */

import { ctx } from './canvas';
import gameLoop from './gameLoop';
import Mass from './Mass';
import Player from './Player';
import { range, rand } from './utilities';
import Star from './Star';

window.addEventListener('DOMContentLoaded', () => {
  const EPHEMERAL_DISAPPEARANCE_TIME = 200;
  const MAX_X = window.innerWidth;
  const MAX_Y = window.innerHeight;

  const player = new Player();

  const solidMasses = range(10).map(() => {
    return new Mass({
      x: rand(0, MAX_X),
      y: rand(0, MAX_Y),
      width: rand(50, 150),
      height: rand(50, 150),
      stationary: true,
    });
  });

  const collectibles = range(10).map(() => {
    return new Mass({
      mass: rand(0.5, 5),
      x: rand(0, MAX_X),
      y: rand(0, MAX_Y),
      width: 25,
      height: 25,
      solid: false,
      stationary: false,
      collectOnTouch: true,
    });
  });

  const masses = [...solidMasses, ...collectibles];
  const freeMasses = [player, ...masses.filter(mass => !mass.stationary)];
  let points = 0;
  const maxPoints = collectibles.length;

  const stars = range(100, () => new Star(rand(0, MAX_X), rand(0, MAX_Y)));

  const shootingStars = [] as Star[];
  setInterval(() => {
    const [x, y] = Math.random() > 0.5 ? [rand(250, MAX_X), 0] : [MAX_X, rand(0, MAX_Y - 250)];
    const vector = [-10, 10] as const;
    shootingStars.push(new Star(x, y, { brightness: 1, vector }));
  }, 2000);

  gameLoop(ctx, (loopCount) => {
    // const edgeDistanceX = Math.min(player.left / window.innerWidth, (window.innerWidth - player.right) / window.innerWidth);
    // const edgeDistanceY = Math.min(player.top / window.innerHeight, (window.innerHeight - player.bottom) / window.innerHeight);
    // if (edgeDistanceX < 0.25 || edgeDistanceY < 0.25) {
    //   console.log(`x: ${edgeDistanceX}, y: ${edgeDistanceY}... shift!`);
    // }

    stars.forEach((star, index) => {
      const { x, y, size, brightness, vector } = star;
      const twinkle = brightness - Math.random();
      ctx.fillStyle = `rgba(255, 255, 255, ${(loopCount + index) % 20 === 0 ? twinkle : brightness})`;
      ctx.fillRect(x, y, size, size);
      star.x += vector[0]; // eslint-disable-line no-param-reassign
      star.y += vector[1]; // eslint-disable-line no-param-reassign
      if (star.x < 0 || star.x > MAX_X || star.y < 0 || star.y > MAX_Y) {
        const [newX, newY] = Math.random() > 0.5 ? [rand(0, MAX_X), 0] : [MAX_X, rand(0, MAX_Y)];
        star.x = newX; // eslint-disable-line no-param-reassign
        star.y = newY; // eslint-disable-line no-param-reassign
      }
    });

    shootingStars.forEach((star, index) => {
      const { x, y, size, brightness, vector } = star;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fillRect(x, y, size, size);
      star.x += vector[0]; // eslint-disable-line no-param-reassign
      star.y += vector[1]; // eslint-disable-line no-param-reassign
      if (star.x < 0 || star.x > MAX_X || star.y < 0 || star.y > MAX_Y) {
        shootingStars.splice(index, 1);
      }
    });

    masses.forEach((mass, index) => {
      const hittingMass = player.isHitting(mass);
      let stillPresent = true;

      if (mass.solid) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
      } else if (hittingMass && !mass.touchedAt) {
        ctx.fillStyle = 'rgba(0, 0, 255, 0.8)';
        mass.touchedAt = new Date().getTime(); // eslint-disable-line no-param-reassign
        player.fuel += 0.25 * player.MAX_FUEL;
      } else if (mass.collectOnTouch && mass.touchedAt) {
        const msSinceTouch = new Date().getTime() - mass.touchedAt;
        if (msSinceTouch > EPHEMERAL_DISAPPEARANCE_TIME) {
          masses.splice(index, 1);
          stillPresent = false;
          points += 1;
        } else {
          const rgValue = Math.ceil((msSinceTouch / EPHEMERAL_DISAPPEARANCE_TIME) * 255);
          ctx.fillStyle = `rgba(${rgValue}, ${rgValue}, 255, 0.8)`;
        }
      } else {
        ctx.fillStyle = 'rgba(0, 100, 255, 0.8)';
      }

      if (stillPresent) ctx.fillRect(mass.x, mass.y, mass.width, mass.height);
    });

    ctx.fillStyle = 'rgba(0, 150, 0, 1)';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    const facemaskColor = 'rgba(220, 220, 255, 1)';
    const facemaskWidth = player.width / 2;
    const facemaskHeight = player.height / 5;
    const facemaskOffsetY = 3;
    ctx.fillStyle = facemaskColor;
    switch (player.burnerXSide) {
      case 'left': ctx.fillRect(player.x + (player.width - facemaskWidth), player.y + facemaskOffsetY, facemaskWidth, facemaskHeight); break;
      case 'right': ctx.fillRect(player.x, player.y + facemaskOffsetY, facemaskWidth, facemaskHeight); break;
      default: ctx.fillRect(player.x + ((player.width - facemaskWidth) / 2), player.y + facemaskOffsetY, facemaskWidth, facemaskHeight); break;
    }

    const burnerColor = `rgba(255, 100, 0, ${rand(0.5, 0.75)})`;
    const burnerLengthX = rand(0.25, 0.4) * player.width;
    const burnerLengthY = rand(0.4, 0.6) * player.height;
    const burnerAcross = (width: number): number => 0.6 * width;
    const burnerAcrossOffset = (width: number): number => (width - burnerAcross(width)) / 2;

    ctx.fillStyle = burnerColor;
    switch (player.burnerXSide) {
      case 'left': ctx.fillRect(
        player.x - burnerLengthX, // positioned on the left side of the player
        player.y + burnerAcrossOffset(player.height), // centered on the Y axis
        burnerLengthX, // long tail oriented along the X axis
        burnerAcross(player.height), // cross-section oriented along the Y axis
      ); break;
      case 'right': ctx.fillRect(
        player.x + player.width, // positioned on the right side of the player
        player.y + burnerAcrossOffset(player.height), // centered on the Y axis
        burnerLengthX, // long tail oriented along the X axis
        burnerAcross(player.height), // cross-section oriented along the Y axis
      ); break;
      default: break;
    }
    switch (player.burnerYSide) {
      case 'bottom': ctx.fillRect(
        player.x + burnerAcrossOffset(player.width), // centered on the X axis
        player.y + player.height, // positioned on the bottom of the player
        burnerAcross(player.width), // cross-section oriented along the X axis
        burnerLengthY, // long tail oriented along the Y axis
      ); break;
      case 'top': ctx.fillRect(
        player.x + burnerAcrossOffset(player.width), // centered on the X axis
        player.y - burnerLengthY, // positioned on the top of the player
        burnerAcross(player.width), // cross-section oriented along the X axis
        burnerLengthY, // long tail oriented along the Y axis
      ); break;
      default: break;
    }

    ctx.font = "30px Courier";
    ctx.fillStyle = '#FFF';
    const scoreText = `${points}/${maxPoints}${points === maxPoints ? ' aww yee' : ''}`;
    ctx.fillText(scoreText, 50, 50);

    const fuelBarWidth = 300;
    const fuelRemaining = player.fuel / player.MAX_FUEL;
    const fuelRemainingPoint = fuelBarWidth * fuelRemaining;
    const flashing = fuelRemaining < 0.25 && loopCount % 20 > 10;
    ctx.fillStyle = flashing ? 'rgba(255, 0, 0, 0.6)' : 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(50 + fuelRemainingPoint, 60, fuelBarWidth - fuelRemainingPoint, 30);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.fillRect(50, 60, fuelRemainingPoint, 30);

    freeMasses.forEach(mass => mass.update());
  });
});
