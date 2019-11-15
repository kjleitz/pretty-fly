/* eslint-disable max-classes-per-file */

import { ctx } from './canvas';
import gameLoop from './gameLoop';
import Mass from './Mass';
import Player from './Player';
import { range, rand } from './utilities';

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
    stationary: Math.random() > 0.5,
    collectOnTouch: true,
  });
});

const masses = [...solidMasses, ...collectibles];
const freeMasses = [player, ...masses.filter(mass => !mass.stationary)];
let points = 0;
const maxPoints = collectibles.length;

const stars = range(100).map(() => {
  const size = rand(1, 5);
  return [
    rand(0, MAX_X),
    rand(0, MAX_Y),
    size,
    size,
  ] as const;
});

gameLoop(ctx, () => {
  stars.forEach((rectOptions, index) => {
    const opacity = ((index % 10) + 1) / 10;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fillRect(...rectOptions);
  });

  masses.forEach((mass, index) => {
    const hittingMass = player.isHitting(mass);
    let stillPresent = true;

    if (mass.solid) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
    } else if (hittingMass && !mass.touchedAt) {
      ctx.fillStyle = 'rgba(0, 0, 255, 0.8)';
      mass.touchedAt = new Date().getTime(); // eslint-disable-line no-param-reassign
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

  freeMasses.forEach(mass => mass.update());
});
