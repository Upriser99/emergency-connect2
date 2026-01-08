// Witness Call Recording Module
// Records emergency calls and stores them in IndexedDB

const CallRecording = {
    mediaRecorder: null,
    audioChunks: [],
    stream: null,
    isRecording: false,
    recordingStartTime: null,
    recordingTimer: null,
    db: null,

    // Initialize IndexedDB
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('EmergencyCallRecordings', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('recordings')) {
                    const objectStore = db.createObjectStore('recordings', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                    objectStore.createIndex('date', 'date', { unique: false });
                }
            };
        });
    },

    // Start recording
    async startRecording() {
        try {
            // Request microphone permission
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create media recorder
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = async () => {
                await this.saveRecording();
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // Update UI
            this.updateRecordingUI();

            // Start timer
            this.startTimer();

            return true;
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not access microphone. Please grant permission.');
            return false;
        }
    },

    // Stop recording
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;

            // Stop all tracks
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            // Stop timer
            this.stopTimer();

            // Update UI
            this.updateRecordingUI();
        }
    },

    // Save recording to IndexedDB
    async saveRecording() {
        try {
            // Ensure DB is initialized
            if (!this.db) {
                await this.initDB();
            }

            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            const duration = Date.now() - this.recordingStartTime;

            const recording = {
                blob: audioBlob,
                timestamp: Date.now(),
                date: new Date().toISOString(),
                duration: duration,
                size: audioBlob.size,
                filename: `recording_${Date.now()}.webm`
            };

            const transaction = this.db.transaction(['recordings'], 'readwrite');
            const objectStore = transaction.objectStore('recordings');
            const request = objectStore.add(recording);

            request.onsuccess = () => {
                console.log('Recording saved successfully');
                this.showRecordingsList();
                alert('✅ Recording saved successfully!');
            };

            request.onerror = () => {
                console.error('Error saving recording:', request.error);
                alert('❌ Failed to save recording');
            };

            // Clean up old recordings
            this.cleanupOldRecordings();
        } catch (error) {
            console.error('Error in saveRecording:', error);
        }
    },

    // Get all recordings
    async getAllRecordings() {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recordings'], 'readonly');
            const objectStore = transaction.objectStore('recordings');
            const request = objectStore.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Delete recording
    async deleteRecording(id) {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recordings'], 'readwrite');
            const objectStore = transaction.objectStore('recordings');
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                console.log('Recording deleted');
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    },

    // Clean up recordings older than 7 days
    async cleanupOldRecordings() {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const recordings = await this.getAllRecordings();

        for (const recording of recordings) {
            if (recording.timestamp < sevenDaysAgo) {
                await this.deleteRecording(recording.id);
                console.log(`Deleted old recording: ${recording.id}`);
            }
        }
    },

    // Show recordings list modal
    async showRecordingsList() {
        const recordings = await this.getAllRecordings();
        const modal = document.getElementById('recordingsModal');
        const list = document.getElementById('recordingsList');

        list.innerHTML = '';

        if (recordings.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎙️</div>
                    <p>No recordings yet</p>
                    <small>Start recording to save emergency call evidence</small>
                </div>
            `;
        } else {
            // Sort by date (newest first)
            recordings.sort((a, b) => b.timestamp - a.timestamp);

            recordings.forEach(recording => {
                const recordingDiv = this.createRecordingItem(recording);
                list.appendChild(recordingDiv);
            });
        }

        modal.classList.add('active');
    },

    // Create recording list item
    createRecordingItem(recording) {
        const div = document.createElement('div');
        div.className = 'recording-item';

        const date = new Date(recording.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        const durationStr = this.formatDuration(recording.duration);
        const sizeStr = this.formatSize(recording.size);

        div.innerHTML = `
            <div class="recording-info">
                <div class="recording-icon">🎙️</div>
                <div class="recording-details">
                    <div class="recording-title">${recording.filename}</div>
                    <div class="recording-meta">${dateStr} • ${durationStr} • ${sizeStr}</div>
                </div>
            </div>
            <div class="recording-actions">
                <button class="rec-btn play-btn" onclick="CallRecording.playRecording(${recording.id})">
                    ▶️ Play
                </button>
                <button class="rec-btn share-btn" onclick="CallRecording.shareRecording(${recording.id})">
                    📤 Share
                </button>
                <button class="rec-btn delete-btn" onclick="CallRecording.confirmDelete(${recording.id})">
                    🗑️ Delete
                </button>
            </div>
        `;

        return div;
    },

    // Play recording
    async playRecording(id) {
        const recordings = await this.getAllRecordings();
        const recording = recordings.find(r => r.id === id);

        if (recording) {
            const audioURL = URL.createObjectURL(recording.blob);
            const audio = new Audio(audioURL);

            // Show playback controls
            this.showPlaybackModal(audioURL, recording);

            audio.play();
        }
    },

    // Show playback modal
    showPlaybackModal(audioURL, recording) {
        const modal = document.getElementById('playbackModal');
        const audioPlayer = document.getElementById('audioPlayer');

        audioPlayer.src = audioURL;
        modal.classList.add('active');
    },

    // Share recording
    async shareRecording(id) {
        const recordings = await this.getAllRecordings();
        const recording = recordings.find(r => r.id === id);

        if (recording) {
            // Create file from blob
            const file = new File([recording.blob], recording.filename, { type: 'audio/webm' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'Emergency Call Recording',
                        text: `Recorded on ${new Date(recording.timestamp).toLocaleString()}`,
                        files: [file]
                    });
                } catch (error) {
                    console.log('Share cancelled or failed:', error);
                }
            } else {
                // Fallback: download file
                this.downloadRecording(recording);
            }
        }
    },

    // Download recording
    downloadRecording(recording) {
        const url = URL.createObjectURL(recording.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = recording.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Confirm delete
    confirmDelete(id) {
        if (confirm('Delete this recording? This cannot be undone.')) {
            this.deleteRecording(id).then(() => {
                this.showRecordingsList();
            });
        }
    },

    // Format duration
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Format file size
    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    // Update recording UI
    updateRecordingUI() {
        const btn = document.getElementById('recordingBtn');
        const statusEl = document.getElementById('recordingStatus');

        if (this.isRecording) {
            btn.textContent = '⏹️ Stop Recording';
            btn.classList.add('recording');
            statusEl.textContent = 'Recording...';
            statusEl.style.display = 'block';
        } else {
            btn.textContent = '🎙️ Start Recording';
            btn.classList.remove('recording');
            statusEl.style.display = 'none';
        }
    },

    // Start timer
    startTimer() {
        const timerEl = document.getElementById('recordingTimer');
        let seconds = 0;

        this.recordingTimer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerEl.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    },

    // Stop timer
    stopTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    },

    // Toggle recording
    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }
};

// Global functions
function showCallRecording() {
    document.getElementById('callRecordingModal').classList.add('active');
}

function closeCallRecordingModal() {
    document.getElementById('callRecordingModal').classList.remove('active');
    if (CallRecording.isRecording) {
        if (confirm('Stop recording?')) {
            CallRecording.stopRecording();
        }
    }
}

function closeRecordingsModal() {
    document.getElementById('recordingsModal').classList.remove('active');
}

function closePlaybackModal() {
    const modal = document.getElementById('playbackModal');
    const audio = document.getElementById('audioPlayer');
    audio.pause();
    audio.src = '';
    modal.classList.remove('active');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    CallRecording.initDB().then(() => {
        console.log('Call Recording DB initialized');
        // Clean up old recordings on startup
        CallRecording.cleanupOldRecordings();
    });
});
