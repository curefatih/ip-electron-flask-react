const { ipcRenderer } = require('electron')


// ****************************************************

ipcRenderer.on('openFile', (event, base64) => {
  state.imageSrc = 'data:image/jpg;base64,' + base64;
  updateImgView();
})

ipcRenderer.on('rotate', (event, base64) => {
  const src = `data:image/jpg;base64,${base64}`
  state.currentDisplay = "ROTATE"
  state.processedImgSrc = src;
  updateImgView();
})

// ****************************************************