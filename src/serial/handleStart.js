import initFirmata from "../io/firmata"

function handleStart(onIOReady, port) {
  console.log('handleStart')
  try{

    initFirmata(onIOReady, port)
  }catch(err){
    console.log(err)
  }
}

export default handleStart