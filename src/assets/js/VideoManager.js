import { reactive } from 'vue';

const state = reactive({
    introVideoReady: false,
    outroVideoReady: false,
    introVideoLoading: false,
    outroVideoLoading: false,
    introVideoElement: null,
    outroVideoElement: null,
});

export const useVideoManager = () => {
    const preloadIntroVideo = () => {
        if (state.introVideoLoading || state.introVideoReady) return;

        const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
        const videoName = import.meta.env.VITE_APP_VIDEO_NAME;

        state.introVideoLoading = true;
        const video = document.createElement('video');
        video.src = `https://res.cloudinary.com/${cloudName}/video/upload/v1714375827/${videoName}`;

        video.addEventListener('canplaythrough', () => {
            state.introVideoReady = true;
            state.introVideoLoading = false;
        });
        video.load();
        state.introVideoElement = video;
    };

    const preloadOutroVideo = () => {
        if (state.outroVideoLoading || state.outroVideoReady) return;

        const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
        const videoName = import.meta.env.VITE_APP_VIDEOOUTRO_NAME;

        state.outroVideoLoading = true;
        const video = document.createElement('video');
        video.src = `https://res.cloudinary.com/${cloudName}/video/upload/v1714375827/${videoName}`;

        video.addEventListener('canplaythrough', () => {
            state.outroVideoReady = true;
            state.outroVideoLoading = false;
        });
        video.load();
        state.outroVideoElement = video;
    };

    return {
        state,
        preloadIntroVideo,
        preloadOutroVideo,
    };
};
