import { getBoard } from '../boards';

class PinsManager {
  constructor(board, isDebugging = false) {
    this.board = board;
    this.pins = new Set();
    this.j5Pins = new Array();
    this.isDebugging = isDebugging;
  }
  /**
   * 
   * @param  {...any} pins a list of pins
   * @returns a list of objects
   */
  check(...pins) {
    let output = [];
    console.log(pins);
    for (let index = 0; index < pins[0].length; index++) {
      const pin = pins[0][index];
      console.log('pin :', pin);
      if (!this.pins.has(pin)) {
        this.pins.add(pin);
        let pinObj;
        if (this.isDebugging) {

          pinObj = {
            id: pin,
            high: function () {
              console.log(this.id, " high")
            },
            low: function () {
              console.log(this.id, " low")
            }
          };
        } else {
          pinObj = new five.Pin({ pin, mode: 1, board: this.board });
        }
        pinObj.low();
        this.j5Pins.push(pinObj);
        output.push(pinObj)

      } else {
        console.warn(`pin no. ${pin} has already been used`);
        // output =false;
        this.getPinById(pin);
        // break;
      }
    };
    console.log("pinsmanager pins set", this.pins);
    return output;
  }
  getPinById(id) {
    let object;
    for (let index = 0; index < this.j5Pins.length; index++) {
      const pinObj = this.j5Pins[index];
      if (pinObj.pin === id) {
        object = pinObj;
        break;
      }
    }
    if (!object) {
      // throw new Error("didn't find a pin")
      console.log("didn't find a pin")
    }
    return object;
  }
  stopAll() {
    this.j5Pins.forEach(pin => {
      console.log("pin : ", pin);
      pin.low();
    })
  }
}
const pinsManagers = new WeakMap();

function getPinsManager(board) {
  const arduino = getBoard(board);
  let pinsManager = pinsManagers.get(arduino);
  if (!pinsManager) {
    pinsManager = new PinsManager(arduino);
    pinsManagers.set(arduino, pinsManager);
  }
  return pinsManager;
}

function checkPins(pinesIds, sender, board) {
  const pinsManager = getPinsManager(board);
  console.log("[checkPins] pinesIds :", pinesIds)
  const output = pinsManager.check(pinesIds);
  if (!output) {
    console.log("[checkPins] emit a message to the user");
    return;
  }
  return output;
}

export { getPinsManager, checkPins };