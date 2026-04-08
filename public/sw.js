// Power OS — Service Worker
// Handles push events, notification clicks, and client-scheduled alerts

const APP_NAME = 'Power OS';

// ── Push event: server sends a notification ───────────────────────────────────
self.addEventListener('push', function (event) {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: APP_NAME, body: event.data.text() };
  }

  const options = {
    body: data.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    tag: data.tag || 'power-os-default',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/dashboard',
      timestamp: Date.now(),
    },
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || APP_NAME, options)
  );
});

// ── Notification click: focus or open the app ─────────────────────────────────
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/dashboard';
  const origin = self.location.origin;

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        // If a window is already open, navigate it
        for (const client of clientList) {
          if (client.url.startsWith(origin) && 'focus' in client) {
            client.focus();
            client.navigate(targetUrl);
            return;
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// ── Message from client: schedule a local notification ───────────────────────
// Used for Pomodoro completion, habit reminders, etc.
const scheduledTimers = new Map();

self.addEventListener('message', function (event) {
  const msg = event.data;
  if (!msg || !msg.type) return;

  if (msg.type === 'SCHEDULE_NOTIFICATION') {
    const { id, delay, title, body, url, tag, requireInteraction } = msg;

    // Cancel existing timer with same id
    if (scheduledTimers.has(id)) {
      clearTimeout(scheduledTimers.get(id));
    }

    const timer = setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        tag: tag || id,
        renotify: true,
        requireInteraction: requireInteraction || false,
        data: { url: url || '/dashboard' },
      });
      scheduledTimers.delete(id);
    }, delay);

    scheduledTimers.set(id, timer);
  }

  if (msg.type === 'CANCEL_NOTIFICATION') {
    if (scheduledTimers.has(msg.id)) {
      clearTimeout(scheduledTimers.get(msg.id));
      scheduledTimers.delete(msg.id);
    }
  }

  if (msg.type === 'CANCEL_ALL') {
    scheduledTimers.forEach((t) => clearTimeout(t));
    scheduledTimers.clear();
  }
});

// ── Activate: claim clients immediately ──────────────────────────────────────
self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});
