const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(app.getAppPath(), 'dist/assets/bee_happy.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.maximize();
  win.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
}

app.whenReady().then(() => {
  //   const backendPath = false
  //     ? path.join(__dirname, 'dist/assets/backend/challenge-viewer-backend.jar')
  //     : path.join(process.resourcesPath, 'backend/challenge-viewer-backend.jar');
  const backendPath = path.join(process.resourcesPath, 'backend/challenge-viewer-backend.jar');
  backendProcess = spawn('java', ['-jar', backendPath], {
    stdio: 'pipe',
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Spring Boot Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Spring Boot Backend Fehler: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Spring Boot Backend beendet mit Code ${code}`);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  killBackendProcess();
});

app.on('before-quit', () => {
  killBackendProcess();
});

function killBackendProcess() {
  if (backendProcess) {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t']);
    } else {
      backendProcess.kill('SIGINT');
    }
  }
}
