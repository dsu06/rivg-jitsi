<template>
    <div class="container">
        <div class="controls">
            <input v-model="roomName" placeholder="Room name" v-if="!isInConference" />
            <button @click="toggleAudio">Toggle Audio</button>
            <button @click="toggleVideo">Toggle Video</button>
        </div>

        <div class="jitsi-wrapper" v-if="!isConferenceEnded">
            <JitsiMeet
                ref="jitsiRef"
                :conferenceProxyRoute="conferenceProxyRoute"
                :options="jitsiOptions"
                @ready="onJitsiReady"
                @error="onJitsiError"
                @waitAndGetURIOrGenerateRoomName="waitAndGetURIOrGenerateRoomName"
            />
        </div>
        <div v-else>
            <p>Вы покинули конференцию с тегом "{{ roomName }}"!</p>
            <p>Спасибо за участие</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getRandomCustomWord } from '@/utils/constant-words-utils';

import JitsiMeet from '@/components/JitsiMeet/JitsiMeet.vue';
import type { JitsiAPI } from '@/types/jitsi.declare';

import rivgLogo from '/rivg-big-rounded-icon.png';

const roomName = ref('');
const jitsiRef = ref();
const isInConference = ref(false);
const isConferenceEnded = ref(false);

const conferenceProxyRoute = import.meta.env.RIVG_DOMAIN;

const jitsiOptions = computed(() => ({
    roomName: roomName.value,
    defaultLanguage: 'ru',
    width: '100%',
    height: '100%',
    enableClosePage: false,
    configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        enableClosePage: false,
        disableProfile: false,
        recordingEnabled: true
    },
    interfaceConfigOverwrite: {
        DEFAULT_LOGO_URL: rivgLogo,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY: false,
        SHOW_BRAND_HORIZONTALLY: false,
        MOBILE_APP_PROMO: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        SHOW_DEEP_LINKING_IMAGE: false,
        APP_NAME: 'RIVG',
        PROVIDER_NAME: 'RIVG Conference',
        INVITATION_POWERED_BY: false,
        HIDE_INVITE_MORE_HEADER: true,
        MOBILE_DOWNLOAD_LINK_ANDROID: '',
        MOBILE_DOWNLOAD_LINK_IOS: '',
        MOBILE_DOWNLOAD_LINK_F_DROID: '',
        MAIN_LOGO_URL: rivgLogo,
        TOOLBAR_LOGO_URL: rivgLogo,
        MAIN_LOGO_CLICK_URL: '/',
        MAIN_LOGO_TOOLTIP: 'RIVG Video Conference',

        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        // SHOW_JITSI_WATERMARK: false,
        // Минимальная тулбар
        TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'hangup', 'desktop', 'fullscreen',
            'fodeviceselection', 'chat', 'settings', 'raisehand'
        ],
    },
}));

const onJitsiReady = (api: JitsiAPI) => {
    console.log('Jitsi API ready:', api);

    if (!api) return;

    // Подписываемся на события
    api.addListener('videoConferenceJoined', () => {
        console.log('Joined the conference');
        isInConference.value = true;
    });

    api.addListener('readyToClose', () => {
        isInConference.value = false;
        console.log('Left the conference');


        const jitsiWrapper = document.querySelector('.jitsi-wrapper');
        if (jitsiWrapper) {
            isConferenceEnded.value = true;
        }
    });
};

const onJitsiError = (error: Error) => {
    console.error('Jitsi error:', error);
};

const toggleAudio = () => {
    jitsiRef.value?.executeCommand('toggleAudio');
};

const toggleVideo = () => {
    jitsiRef.value?.executeCommand('toggleVideo');
};

const waitAndGetURIOrGenerateRoomName = async () => {
    return new Promise((resolve) => {
        if (!window.location.pathname.replace('/', '').length) {
            roomName.value = getRandomCustomWord() + getRandomCustomWord() + getRandomCustomWord() + getRandomCustomWord();
            window.history.replaceState({}, '', '/' + roomName.value);
        }
        roomName.value = decodeURI(window.location.pathname.split('/').join(''));
        resolve(roomName.value);
    });
};

onMounted(waitAndGetURIOrGenerateRoomName);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.controls {
  padding: 1rem;
  background: #f5f5f5;
  display: flex;
  gap: 0.5rem;
}

.jitsi-wrapper {
  flex: 1;
  min-height: 0;
}
</style>
