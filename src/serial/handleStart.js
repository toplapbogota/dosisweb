import initFirmata from "../io/firmata"

function handleStart(onIOReady) {
  console.log('handleStart')
  try{

    initFirmata(onIOReady)
  }catch(err){
    console.log(err)
  }
}

export default handleStart