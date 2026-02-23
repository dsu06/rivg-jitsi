// Простой recorder.js для IFrame API
console.log('Simple recorder initialized');

let mediaRecorder = null;
let recordedChunks = [];

// Сообщаем о готовности
window.parent.postMessage({ type: 'recorder_ready' }, '*');

window.addEventListener('message', async (event) => {
    console.log('Recorder received:', event.data);

    if (event.data.type === 'recorder_start') {
        try {
            // Запрашиваем доступ к экрану
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            recordedChunks = [];
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Создаем и скачиваем файл
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `recording-${Date.now()}.webm`;
                a.click();

                // Останавливаем все треки
                stream.getTracks().forEach(track => track.stop());

                window.parent.postMessage({ type: 'recorder_stop' }, '*');
            };

            mediaRecorder.start(1000);
            window.parent.postMessage({ type: 'recorder_start' }, '*');

        } catch (err) {
            console.error('Recording error:', err);
            window.parent.postMessage({
                type: 'recorder_error',
                data: err.message
            }, '*');
        }
    }

    if (event.data.type === 'recorder_stop') {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    }
});
