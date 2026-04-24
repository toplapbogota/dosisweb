const webcams = [];

async function listarCamaras() {
  await navigator.mediaDevices.getUserMedia({ video: true });
  const devices = await navigator.mediaDevices.enumerateDevices();
  const camaras = devices
    .filter(d => d.kind === 'videoinput')
    .map((d, i) => ({ indice: i, label: d.label, deviceId: d.deviceId }));
  console.table(camaras);
  return camaras;
}

async function webcam(configuracion) {
  const idCamera = configuracion.id ?? `webcam-${webcams.length + 1}`;
  const x = configuracion.x ?? 0;
  const y = configuracion.y ?? 0;
  const width = configuracion.ancho ?? 320;
  const height = configuracion.alto ?? 240;
  const indiceCamara = configuracion.camara ?? 0;

  let deviceId;
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const camaras = devices.filter(d => d.kind === 'videoinput');
    if (camaras[indiceCamara]) {
      deviceId = camaras[indiceCamara].deviceId;
    } else {
      console.warn(`No existe cámara con índice ${indiceCamara}, usando la primera.`);
      deviceId = camaras[0]?.deviceId;
    }
  } catch (err) {
    console.error("Error enumerando cámaras:", err);
  }

  const video = document.createElement('video');
  video.id = idCamera;
  video.autoplay = true;
  video.playsInline = true;
  video.style.position = 'absolute';
  video.style.left = x + 'px';
  video.style.top = y + 'px';
  video.style.width = width + 'px';
  video.style.height = height + 'px';
  document.body.appendChild(video);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: deviceId ? { deviceId: { exact: deviceId } } : true
    });
    video.srcObject = stream;
    webcams.push({ id: idCamera, video, stream });
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("Could not access webcam. Make sure to allow permission.");
    video.remove();
  }
}

global.webcam = webcam
global.listarCamaras = listarCamaras
