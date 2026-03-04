import { render } from 'solid-js/web';

import { createSignal, Show } from 'solid-js';

import { buttonSwitcherStyles as buttonSwitcherStyle, forceHideStyles as forceHideStyle, pipButtonStyles as pipButtonStyle } from './styles';

import { createPlugin } from '@/utils';
import { moveVolumeHud as preciseVolumeMoveVolumeHud } from '@/plugins/precise-volume/renderer';
import { type ThumbnailElement } from '@/types/get-player-response';
import { t } from '@/i18n';
import { type MenuTemplate } from '@/menu';

import { VideoSwitchButton } from './templates/video-switch-button';

export type VideoTogglePluginConfig = {
  enabled: boolean;
  hideVideo: boolean;
  mode: 'custom' | 'native' | 'disabled';
  forceHide: boolean;
  align: 'left' | 'middle' | 'right';
};

export default createPlugin({
  name: () => t('plugins.video-toggle.name'),
  description: () => t('plugins.video-toggle.description'),
  restartNeeded: true,
  config: {
    enabled: true,
    hideVideo: false,
    mode: 'custom',
    forceHide: false,
    align: 'middle',
  } as VideoTogglePluginConfig,
  stylesheets: [buttonSwitcherStyle, forceHideStyle, pipButtonStyle],
  menu: async ({ getConfig, setConfig }): Promise<MenuTemplate> => {
    const config = await getConfig();

    return [
      {
        label: t('plugins.video-toggle.menu.mode.label'),
        submenu: [
          {
            label: t('plugins.video-toggle.menu.mode.submenu.custom'),
            type: 'radio',
            checked: config.mode === 'custom',
            click() {
              setConfig({ mode: 'custom' });
            },
          },
          {
            label: t('plugins.video-toggle.menu.mode.submenu.native'),
            type: 'radio',
            checked: config.mode === 'native',
            click() {
              setConfig({ mode: 'native' });
            },
          },
          {
            label: t('plugins.video-toggle.menu.mode.submenu.disabled'),
            type: 'radio',
            checked: config.mode === 'disabled',
            click() {
              setConfig({ mode: 'disabled' });
            },
          },
        ],
      },
      {
        label: t('plugins.video-toggle.menu.align.label'),
        submenu: [
          {
            label: t('plugins.video-toggle.menu.align.submenu.left'),
            type: 'radio',
            checked: config.align === 'left',
            click() {
              setConfig({ align: 'left' });
            },
          },
          {
            label: t('plugins.video-toggle.menu.align.submenu.middle'),
            type: 'radio',
            checked: config.align === 'middle',
            click() {
              setConfig({ align: 'middle' });
            },
          },
          {
            label: t('plugins.video-toggle.menu.align.submenu.right'),
            type: 'radio',
            checked: config.align === 'right',
            click() {
              setConfig({ align: 'right' });
            },
          },
        ],
      },
      {
        label: t('plugins.video-toggle.menu.force-hide'),
        type: 'checkbox',
        checked: config.forceHide,
        click(item) {
          setConfig({ forceHide: item.checked });
        },
      },
    ];
  },

  renderer: {
    config: null as VideoTogglePluginConfig | null,
    applyStyleClass: (config: VideoTogglePluginConfig) => {
      if (config.forceHide) {
        document.body.classList.add('video-toggle-force-hide');
        document.body.classList.remove('video-toggle-custom-mode');
      } else if (!config.mode || config.mode === 'custom') {
        document.body.classList.add('video-toggle-custom-mode');
        document.body.classList.remove('video-toggle-force-hide');
      }
    },
    async start({ getConfig }) {
      const config = await getConfig();
      this.applyStyleClass(config);

      if (config.forceHide) {
        return;
      }

      switch (config.mode) {
        case 'native': {
          document
            .querySelector('ytmusic-player-page')
            ?.setAttribute('has-av-switcher', '');
          document
            .querySelector('ytmusic-player')
            ?.setAttribute('has-av-switcher', '');
          document
            .querySelector('ytmusic-av-toggle')
            ?.removeAttribute('toggle-disabled');
          return;
        }

        case 'disabled': {
          document
            .querySelector('ytmusic-player-page')
            ?.removeAttribute('has-av-switcher');
          document
            .querySelector('ytmusic-player')
            ?.removeAttribute('has-av-switcher');
          document
            .querySelector('ytmusic-av-toggle')
            ?.setAttribute('toggle-disabled', '');
          return;
        }
      }
    },
    async onPlayerApiReady(api, { getConfig }) {
      const [showButton, setShowButton] = createSignal(true);

      const config = await getConfig();
      this.config = config;

      const moveVolumeHud = (await window.mainConfig.plugins.isEnabled(
        'precise-volume',
      ))
        ? (preciseVolumeMoveVolumeHud as (_: boolean) => void)
        : () => {};

      const player = document.querySelector<
        HTMLElement & { videoMode_: boolean }
      >('ytmusic-player');
      const video = document.querySelector<HTMLVideoElement>('video');

      const switchButtonContainer = document.createElement('div');
      switchButtonContainer.id = 'ytmd-video-toggle-switch-button-container';
      switchButtonContainer.style.display = 'flex';
      render(
        () => (
          <Show when={showButton()}>
            <VideoSwitchButton
              onChange={(e) => {
                const target = e.target as HTMLInputElement;

                setVideoState(target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              songButtonText={t('plugins.video-toggle.templates.button-song')}
              videoButtonText={t('plugins.video-toggle.templates.button-video')}
            />
          </Show>
        ),
        switchButtonContainer,
      );

      // PiP button in the player bar right-controls
      const setupPipButton = () => {
        if (document.getElementById('ytmd-pip-button')) return;

        const pipBtn = document.createElement('button');
        pipBtn.id = 'ytmd-pip-button';
        pipBtn.title = 'Picture-in-Picture';
        pipBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>`;

        pipBtn.addEventListener('click', async () => {
          if (!video) return;

          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
            pipBtn.classList.remove('active');
          } else {
            try {
              await video.requestPictureInPicture();
              pipBtn.classList.add('active');
            } catch (err) {
              console.error('PiP failed:', err);
            }
          }
        });

        // Track PiP state changes
        video?.addEventListener('enterpictureinpicture', () => {
          pipBtn.classList.add('active');
        });
        video?.addEventListener('leavepictureinpicture', () => {
          pipBtn.classList.remove('active');
        });

        // Insert into player bar right-controls
        const rightControls = document.querySelector(
          'ytmusic-player-bar .right-controls-buttons',
        );
        if (rightControls) {
          rightControls.prepend(pipBtn);
        }
      };

      setupPipButton();

      // Auto-PiP: when user clicks the "lecteur réduit" (miniplayer) button,
      // pop the video out into a native Picture-in-Picture floating window
      const setupAutoPip = () => {
        if (!video) return;

        const tryPip = (el: Element) => {
          const state = el.getAttribute('player-ui-state');
          if (state === 'MINIPLAYER' && !document.pictureInPictureElement) {
            video.requestPictureInPicture().catch(() => {});
          }
        };

        // Watch both elements — YTM sometimes sets the attribute on one or the other
        const playerEl = document.querySelector('ytmusic-player');
        if (playerEl) {
          new MutationObserver(() => tryPip(playerEl))
            .observe(playerEl, { attributeFilter: ['player-ui-state'] });
        }
        const pageEl = document.querySelector('ytmusic-player-page');
        if (pageEl) {
          new MutationObserver(() => tryPip(pageEl))
            .observe(pageEl, { attributeFilter: ['player-ui-state'] });
        }

        // Keep video alive during PiP: re-request PiP when a new song starts
        video.addEventListener('ytmd:src-changed', () => {
          if (document.pictureInPictureElement) {
            // Small delay to let the new source load
            setTimeout(() => {
              video.requestPictureInPicture().catch(() => {});
            }, 500);
          }
        });
      };

      setupAutoPip();

      const forceThumbnail = (img: HTMLImageElement) => {
        const thumbnails: ThumbnailElement[] =
          api?.getPlayerResponse()?.videoDetails?.thumbnail?.thumbnails ?? [];
        if (thumbnails && thumbnails.length > 0) {
          const thumbnail = thumbnails.at(-1)?.url.split('?')[0];
          if (thumbnail) img.src = thumbnail;
        }
      };

      const setVideoState = (showVideo: boolean) => {
        // Don't hide the video while it's playing in PiP — that would cause a black screen
        if (!showVideo && document.pictureInPictureElement) {
          return;
        }

        if (this.config) {
          this.config.hideVideo = !showVideo;
        }
        window.mainConfig.plugins.setOptions('video-toggle', this.config);

        const checkbox = document.querySelector<HTMLInputElement>(
          '.video-switch-button-checkbox',
        ); // custom mode
        if (checkbox) checkbox.checked = !this.config?.hideVideo;

        if (player) {
          player.style.margin = showVideo ? '' : 'auto 0px';
          player.setAttribute(
            'playback-mode',
            showVideo ? 'OMV_PREFERRED' : 'ATV_PREFERRED',
          );

          document.querySelector<HTMLElement>(
            '#song-video.ytmusic-player',
          )!.style.display = showVideo ? 'block' : 'none';
          document.querySelector<HTMLElement>('#song-image')!.style.display =
            showVideo ? 'none' : 'block';

          // Force thumbnail when switching to song mode to avoid grey background
          if (!showVideo) {
            const restoreImage = () => {
              const songImage = document.querySelector<HTMLImageElement>(
                '#song-image #img.style-scope.yt-img-shadow',
              );
              if (songImage) {
                forceThumbnail(songImage);
                // Ensure the image is actually visible
                songImage.style.display = '';
                songImage.style.visibility = 'visible';
                songImage.style.opacity = '1';
              }
              // Also ensure the yt-img-shadow container is visible
              const ytImgShadow = document.querySelector<HTMLElement>(
                '#song-image yt-img-shadow',
              );
              if (ytImgShadow) {
                ytImgShadow.style.display = '';
                ytImgShadow.style.visibility = 'visible';
              }
            };
            // Run immediately and retry after YouTube Music's async updates
            restoreImage();
            setTimeout(restoreImage, 200);
            setTimeout(restoreImage, 600);
          }

          if (showVideo && video && !video.style.top) {
            video.style.top = `${
              (player.clientHeight - video.clientHeight) / 2
            }px`;
          }

          moveVolumeHud(showVideo);
        }
      };

      const videoStarted = () => {
        if (
          api.getPlayerResponse().videoDetails.musicVideoType ===
          'MUSIC_VIDEO_TYPE_ATV'
        ) {
          // Video doesn't exist -> switch to song mode
          setVideoState(false);
          // Hide toggle button
          setShowButton(false);
        } else {
          const songImage = document.querySelector<HTMLImageElement>(
            '#song-image #img.style-scope.yt-img-shadow',
          );
          if (!songImage) {
            return;
          }
          // Switch to high-res thumbnail
          forceThumbnail(songImage);
          // Show toggle button
          setShowButton(true);
          // Change display to video mode if video exist & video is hidden & option.hideVideo = false
          if (
            !this.config?.hideVideo &&
            document.querySelector<HTMLElement>('#song-video.ytmusic-player')
              ?.style.display === 'none'
          ) {
            setVideoState(true);
          } else {
            moveVolumeHud(!this.config?.hideVideo);
          }
        }
      };

      /**
       * On load, after a delay, the page overrides the playback-mode to 'OMV_PREFERRED' which causes weird aspect ratio in the image container
       * this function fix the problem by overriding that override :)
       */
      const forcePlaybackMode = () => {
        if (player) {
          const playbackModeObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              if (mutation.target instanceof HTMLElement) {
                const target = mutation.target;
                if (target.getAttribute('playback-mode') !== 'ATV_PREFERRED') {
                  playbackModeObserver.disconnect();
                  target.setAttribute('playback-mode', 'ATV_PREFERRED');
                }
              }
            }
          });
          playbackModeObserver.observe(player, {
            attributeFilter: ['playback-mode'],
          });
        }
      };

      const observeThumbnail = () => {
        const playbackModeObserver = new MutationObserver((mutations) => {
          if (!player?.videoMode_) {
            return;
          }

          for (const mutation of mutations) {
            if (mutation.target instanceof HTMLImageElement) {
              const target = mutation.target;
              if (!target.src.startsWith('data:')) {
                continue;
              }

              forceThumbnail(target);
            }
          }
        });
        playbackModeObserver.observe(
          document.querySelector('#song-image #img.style-scope.yt-img-shadow')!,
          { attributeFilter: ['src'] },
        );
      };

      if (config.mode !== 'native' && config.mode != 'disabled') {
        document
          .querySelector<HTMLVideoElement>('#player')
          ?.prepend(switchButtonContainer);

        setVideoState(!config.hideVideo);
        forcePlaybackMode();
        // Fix black video
        if (video) {
          video.style.height = 'auto';
        }

        video?.addEventListener('ytmd:src-changed', videoStarted);

        observeThumbnail();
        videoStarted();

        switch (config.align) {
          case 'right': {
            switchButtonContainer.style.justifyContent = 'flex-end';
            return;
          }

          case 'middle': {
            switchButtonContainer.style.justifyContent = 'center';
            return;
          }

          default:
          case 'left': {
            switchButtonContainer.style.justifyContent = 'flex-start';
          }
        }
      }
    },
    onConfigChange(newConfig) {
      this.config = newConfig;
      this.applyStyleClass(newConfig);
    },
  },
});
