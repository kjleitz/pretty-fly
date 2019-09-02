/* eslint-disable max-classes-per-file */

import { ctx } from './canvas';
import gameLoop from './gameLoop';
import Mass from './Mass';
import Player from './Player';
import { range, rand } from './utilities';

const player = new Player();

const masses = range(10).map(() => {
  return new Mass({
    mass: rand(0.5, 5),
    x: rand(0, window.innerWidth),
    y: rand(0, window.innerHeight),
    width: rand(50, 150),
    height: rand(50, 150),
  });
});

gameLoop(ctx, () => {
  masses.forEach((mass) => {
    if (player.isHitting(mass)) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
    } else {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    }

    ctx.fillRect(mass.x, mass.y, mass.width, mass.height);
  });

  ctx.fillStyle = 'rgba(0, 100, 0, 1)';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  const burnerColor = `rgba(255, 100, 0, ${rand(0.5, 0.75)})`;
  const burnerLengthX = rand(0.25, 0.4) * player.width;
  const burnerLengthY = rand(0.4, 0.6) * player.height;
  const burnerAcross = (width: number): number => 0.8 * width;
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

  player.update();
});
