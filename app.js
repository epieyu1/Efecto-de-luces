function setPointerVars(x, y) {
    document.body.style.setProperty('--mx', x - (window.innerWidth / 2));
    document.body.style.setProperty('--my', y - (window.innerHeight / 2));
}

// Use pointer events when available (covers mouse + touch + stylus).
if (window.PointerEvent) {
    window.addEventListener('pointermove', (e) => {
        setPointerVars(e.clientX, e.clientY);
    }, { passive: true });
} else {
    // Fallback for older browsers: mouse and touch
    window.addEventListener('mousemove', (e) => setPointerVars(e.clientX, e.clientY));

    window.addEventListener('touchmove', (e) => {
        const t = e.touches && e.touches[0];
        if (t) setPointerVars(t.clientX, t.clientY);
    }, { passive: true });
}

// Optional: on some mobile devices users may prefer motion-based input.
// Device orientation handling: attach only after permission if required (iOS).
function enableDeviceOrientation() {
    function handler(ev) {
        const gx = ev.gamma || 0;
        const by = ev.beta || 0;
        const x = (gx / 90) * (window.innerWidth / 2) + (window.innerWidth / 2);
        const y = (by / 180) * (window.innerHeight / 2) + (window.innerHeight / 2);
        setPointerVars(x, y);
    }

    // Attach listener once
    window.addEventListener('deviceorientation', handler, { passive: true });
}

// Show a permission button for iOS Safari where DeviceOrientationEvent.requestPermission exists.
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('orientation-permission');
    const btn = document.getElementById('request-orientation');
    const dismiss = document.getElementById('dismiss-orientation');

    // If the new permission API is present, show the UI so user can grant permission.
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        if (wrapper && btn) {
            wrapper.style.display = 'flex';
            wrapper.setAttribute('aria-hidden', 'false');

            btn.addEventListener('click', async () => {
                try {
                    const result = await DeviceOrientationEvent.requestPermission();
                    if (result === 'granted') {
                        enableDeviceOrientation();
                    }
                } catch (err) {
                    // permission request failed or was dismissed
                    // (no-op)
                } finally {
                    if (wrapper) {
                        wrapper.style.display = 'none';
                        wrapper.setAttribute('aria-hidden', 'true');
                    }
                }
            });

            if (dismiss) {
                dismiss.addEventListener('click', () => {
                    if (wrapper) {
                        wrapper.style.display = 'none';
                        wrapper.setAttribute('aria-hidden', 'true');
                    }
                });
            }
        }
    } else if ('DeviceOrientationEvent' in window) {
        // No permission API required: enable directly
        enableDeviceOrientation();
    }
});