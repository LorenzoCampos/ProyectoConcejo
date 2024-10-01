export function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = "device_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("deviceId", deviceId);
  }

  // console.log(deviceId);

  return deviceId;
}
