export const styles = `
.navigation-item {
  font-family:
    Satoshi, Avenir, -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
  font-size: 20px;
  line-height: var(--ytmusic-title-1_-_line-height);
  font-weight: 500;
  --yt-endpoint-color: #fff;
  --yt-endpoint-hover-color: #fff;
  --yt-endpoint-visited-color: #fff;
  display: inline-flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  margin: 0 var(--ytd-margin-2x, 8px);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  padding: 6px;
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  transition: color 200ms cubic-bezier(0.16, 1, 0.3, 1),
              background 200ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 200ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.navigation-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.12);
}

.navigation-item:active {
  transform: scale(0.90);
}

.navigation-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  vertical-align: middle;
  fill: var(--iron-icon-fill-color, currentcolor);
  stroke: none;
  width: var(--iron-icon-width, 24px);
  height: var(--iron-icon-height, 24px);
  animation: var(--iron-icon_-_animation);
  padding: var(--ytd-margin-base, 4px) var(--ytd-margin-2x, 8px);
}
`;

export default styles;
