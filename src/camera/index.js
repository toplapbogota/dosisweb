const video = document.getElementById('webcam');
console.log('%c  video:', 'color: #0e93e0;background: #aaefe5;', video);

export async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("Could not access webcam. Make sure to allow permission.");
  }
}


const webcams = [];
function webcam(configuracion) {
  let x = configuracion.x;
  let y = configuracion.y;
  let width = configuracion.ancho;
  let height = configuracion.alto;
  video.style.position = 'absolute';
  video.style.left = x + 'px';
  video.style.top = y + 'px';
  video.style.width = width + 'px';
  video.style.height = height + 'px';

  startWebcam();
}

global.webcam = webcam


