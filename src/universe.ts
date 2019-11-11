import Mass from "./Mass";
import { between, difference } from "./utilities";

export const GRAVITY_X = 0; // px/fr^2
export const GRAVITY_Y = 1; // px/fr^2
export const AIR_RESISTANCE = 0.25; // TODO
export const FRICTION = 0.25; // TODO: this should be dependent on mass
export const NORMAL_DRAG = 100; // surface area in pixels, per kilogram

interface Overlap {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface Point {
  x: number;
  y: number;
}

class Universe {
  public masses = [] as Mass[];

  overlapForMove(subject: Mass, toPosition: Point): Overlap {
    const movedSubject = new Mass({
      ...subject,
      ...toPosition,
      darkMatter: true,
    });

    const dx = movedSubject.x - subject.x;
    const dy = movedSubject.y - subject.y;
    const moving = {
      up: dy < 0,
      down: dy > 0,
      left: dx < 0,
      right: dx > 0,
    };

    /* eslint-disable no-param-reassign */
    return this.masses.reduce((overlap, obstacle) => {
      if (obstacle === subject) return overlap;

      const hittingObstacle = movedSubject.isHitting(obstacle);
      if (!hittingObstacle) return overlap;

      if (moving.up && between(obstacle.bottom, subject.top, movedSubject.top)) {
        const distance = difference(obstacle.bottom, movedSubject.top);
        if (overlap.top < distance) overlap.top = distance;
      }

      if (moving.down && between(obstacle.top, subject.bottom, movedSubject.bottom)) {
        const distance = difference(obstacle.top, movedSubject.bottom);
        if (overlap.bottom < distance) overlap.bottom = distance;
      }

      if (moving.left && between(obstacle.right, subject.left, movedSubject.left)) {
        const distance = difference(obstacle.right, movedSubject.left);
        if (overlap.left < distance) overlap.left = distance;
      }

      if (moving.right && between(obstacle.left, subject.right, movedSubject.right)) {
        const distance = difference(obstacle.left, movedSubject.right);
        if (overlap.right < distance) overlap.right = distance;
      }

      return overlap;
    }, {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
    /* eslint-enable no-param-reassign */
  }

  overlappingMasses(subject: Mass, { ignore = [] }: { ignore?: Mass[] } = {}): Mass[] {
    return this.masses.filter((mass) => {
      if (subject === mass || ignore.includes(mass)) return false;
      return subject.isHitting(mass);
    });
  }

  overlap(subject: Mass, { ignore = [] }: { ignore?: Mass[] } = {}): Overlap {
    const masses = this.overlappingMasses(subject, { ignore });
    /**
     * ,----,
     * |    | <= subject
     * '----'
     * ......
     * :    : <= mass
     * ``````
     */
    return masses.reduce((memo: Overlap, mass) => {
      const overlap = memo;

      /**
       * ,----,    ,----,    ,-.--,..    ,----,    ,----,  ..,--.-,    ,----,      ,----,    ..,----,..
       * |    |    | ...|..  | :  | :    |    |  ..|... |  : |  : |    |    |    ..|....|..  : |    | :
       * '-.--'..  '-:--' :  '----'``  ..'--.-'  : '--:-'  ``'----'  ..'----'..  : '----' :  ``'----'``
       *   :    :    ``````            :    :    ``````              :        :  ``````````
       *   ``````                      ``````                        ``````````
       */
      const massTopOverlap = mass.top >= subject.top && mass.top <= subject.bottom;
      if (massTopOverlap) {
        const distance = subject.bottom - mass.top;
        if (overlap.bottom < distance) overlap.bottom = distance;
      }

      /**
       * ......                          ......                     ..........
       * :    :    ......                :    :   ......            :        :  ..........
       * ``,----,  : ,--:-,  ..,----,  ,-`--,`` ,-:--, :  ,----,..  ``,----,``  : ,----, :  ..,----,..
       *   |    |  ``|``` |  : |  : |  |    |   | ```|``  | :  | :    |    |    ``|````|``  : |    | :
       *   '----'    '----'  ``'--`-'  '----'   '----'    '-`--'``    '----'      '----'    ``'----'``
       */
      const massBottomOverlap = mass.bottom <= subject.bottom && mass.bottom >= subject.top;
      if (massBottomOverlap) {
        const distance = mass.bottom - subject.top;
        if (overlap.top < distance) overlap.top = distance;
      }

      /**
       *      ......
       * ,----:    :
       * |    |`````
       * '----'
       *   ......
       * .-:--. :
       * | ```|``
       * '----'
       * ......
       * :----:
       * |````|
       * '----'
       * ,----,
       * |    |.....
       * '----:    :
       *      ``````
       * ,----,
       * | ...|..
       * '-:--' :
       *   ``````
       * ,----,
       * |....|
       * :----:
       * ``````
       *      ......
       * ,----:    :
       * |    |    :
       * '----:    :
       *      ``````
       *   ......
       * ,-:--, :
       * | :  | :
       * '-:--' :
       *   ``````
       * ......
       * :----:
       * |    |
       * :----:
       * ``````
       */
      const massLeftOverlap = mass.left >= subject.left && mass.left <= subject.right;
      if (massLeftOverlap) {
        const distance = subject.right - mass.left;
        if (overlap.right < distance) overlap.right = distance;
      }

      /**
       * ......
       * :    :----,
       * `````|    |
       *      '----'
       *    ......
       *    : ,--:-,
       *    ``|``` |
       *      '----'
       *      ......
       *      :----:
       *      |````|
       *      '----'
       *      ,----,
       * .....|    |
       * :    :----'
       * ``````
       *      ,----,
       *    ..|... |
       *    : '--:-'
       *    ``````
       *      ,----,
       *      |....|
       *      :----:
       *      ``````
       *  ......
       *  :    ,----,
       *  :    |    |
       *  :    '----'
       *  ``````
       *    ......
       *    : ,--:-,
       *    : |  : |
       *    : '--:-'
       *    ``````
       *      ......
       *      :----:
       *      |    |
       *      :----:
       *      ``````
       */
      const massRightOverlap = mass.right >= subject.left && mass.right <= subject.right;
      if (massRightOverlap) {
        const distance = mass.right - subject.left;
        if (overlap.left < distance) overlap.left = distance;
      }

      // I'm missing total overlaps and total eclipses but I don't give a shit
      return overlap;
    }, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
  }
}

const universe = new Universe();
export default universe;
