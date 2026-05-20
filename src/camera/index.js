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
  const x = configuracion.x ?? 0;
  const y = configuracion.y ?? 0;
  const width = configuracion.ancho ?? 320;
  const height = configuracion.alto ?? 240;
  const indiceCamara = configuracion.camara ?? 0;
  const duplicado = configuracion.duplicado ?? 0;

  const existente = webcams.find(w => w.indiceCamara === indiceCamara && w.duplicado === duplicado);

  if (existente) {
    existente.video.style.left = x + 'px';
    existente.video.style.top = y + 'px';
    existente.video.style.width = width + 'px';
    existente.video.style.height = height + 'px';
    return;
  }

  const video = document.createElement('video');
  video.id = `webcam-${indiceCamara}-${duplicado}`;
  video.autoplay = true;
  video.playsInline = true;
  video.style.position = 'absolute';
  video.style.left = x + 'px';
  video.style.top = y + 'px';
  video.style.width = width + 'px';
  video.style.height = height + 'px';
  document.body.appendChild(video);

  if (duplicado > 0) {
    const original = webcams.find(w => w.indiceCamara === indiceCamara && w.duplicado === 0);
    if (!original) {
      console.warn(`No existe la cámara original ${indiceCamara}. Llama primero sin duplicado.`);
      video.remove();
      return;
    }
    video.srcObject = original.stream;
    webcams.push({ indiceCamara, duplicado, video, stream: original.stream });
    return;
  }

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

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: deviceId ? { deviceId: { exact: deviceId } } : true
    });
    video.srcObject = stream;
    webcams.push({ indiceCamara, duplicado, video, stream });
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("Could not access webcam. Make sure to allow permission.");
    video.remove();
  }
}

function borrarWebcam(configuracion) {
  const indiceCamara = configuracion.camara ?? 0;
  const duplicado = configuracion.duplicado ?? 0;

  const indice = webcams.findIndex(w => w.indiceCamara === indiceCamara && w.duplicado === duplicado);
  if (indice === -1) {
    console.warn(`No existe webcam con camara: ${indiceCamara}, duplicado: ${duplicado}`);
    return;
  }

  const { video, stream } = webcams[indice];
  stream.getTracks().forEach(track => track.stop());
  video.remove();
  webcams.splice(indice, 1);
}

global.webcam = webcam
global.borrarWebcam = borrarWebcam
global.listarCamaras = listarCamaras
