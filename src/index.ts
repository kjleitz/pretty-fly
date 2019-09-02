/* eslint-disable max-classes-per-file */

import { ctx } from './canvas';
import onNewFrame from './onNewFrame';
import Player from './Player';

const player = new Player();

onNewFrame(ctx, () => {
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.fillRect(200, 200, 50, 50);
  ctx.fillRect(275, 125, 50, 50);
  ctx.fillRect(100, 250, 50, 50);
  ctx.fillRect(300, 300, 50, 50);
  ctx.fillRect(150, 300, 50, 50);
  ctx.fillRect(250, 100, 50, 50);

  // const color = (new Date().getTime() % 4096).toString(16);
  // ctx.fillStyle = `#${color.padStart(6 - color.length, '0')}${color}`;
  // ctx.globalAlpha = 0.9;
  // ctx.fillRect(mouse.latest.x - 25, mouse.latest.y - 25, 50, 50);
  ctx.fillStyle = 'rgba(0, 100, 0, 1)';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
  switch (player.burnerXDirection) {
    case 'left': ctx.fillRect(player.x - (player.width / 2), player.y, player.width / 2, player.height); break;
    case 'right': ctx.fillRect(player.x + player.width, player.y, player.width / 2, player.height); break;
    default: break;
  }
  switch (player.burnerYDirection) {
    case 'down': ctx.fillRect(player.x, player.y - (player.height / 2), player.width, player.height / 2); break;
    case 'up': ctx.fillRect(player.x, player.y + player.height, player.width, player.height / 2); break;
    default: break;
  }

  player.update();
});
