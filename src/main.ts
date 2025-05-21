import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

  enableProdMode();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/ngsw-worker.js').then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('Nueva versión disponible. Mostrando notificación...');
                  showUpdateNotification();
                }
              }
            };
          }
        };
      });
    });
  }


function showUpdateNotification() {
  const updateNotification = document.createElement('div');
  updateNotification.style.position = 'fixed';
  updateNotification.style.bottom = '20px';
  updateNotification.style.right = '20px';
  updateNotification.style.padding = '15px 20px';
  updateNotification.style.backgroundColor = '#1976d2';
  updateNotification.style.color = '#ffffff';
  updateNotification.style.fontSize = '16px';
  updateNotification.style.borderRadius = '5px';
  updateNotification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  updateNotification.style.cursor = 'pointer';
  updateNotification.textContent = 'Nueva versión disponible. Haga clic para actualizar.';

  updateNotification.onclick = () => {
    window.location.reload();
  };

  document.body.appendChild(updateNotification);

  setTimeout(() => {
    updateNotification.style.opacity = '0';
    setTimeout(() => updateNotification.remove(), 500);
  }, 10000);
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
