import Mass from "./Mass";

export const GRAVITY_X = 0; // px/fr^2
export const GRAVITY_Y = 1; // px/fr^2
export const AIR_RESISTANCE = 0.25; // TODO
export const FRICTION = 0.25; // TODO: this should be dependent on mass
export const NORMAL_DRAG = 100; // surface area in pixels, per kilogram

class Universe {
  public masses = [] as Mass[];

  overlappingMasses(subject: Mass): Mass[] {
    return this.masses.filter((mass) => {
      if (subject === mass) return false;
      return subject.isHitting(mass);
    });
  }

  overlap(subject: Mass): Record<'top'|'right'|'bottom'|'left', number> {
    const masses = this.overlappingMasses(subject);
    /**
     * ,----,
     * |    | <= subject
     * '----'
     * ......
     * :    : <= mass
     * ``````
     */
    return masses.reduce((memo, mass) => {
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
    }, { top: 0, right: 0, bottom: 0, left: 0 });
  }
}

const universe = new Universe();
export default universe;
