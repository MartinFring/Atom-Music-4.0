import { css } from 'solid-styled-components';
import { cacheNoArgs } from '@/providers/decorators';

const errorStyle = cacheNoArgs(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    font-size: 13px;
  `,
);

const errorIconStyle = cacheNoArgs(
  () => css`
    color: #ff4444;
    font-size: 24px;
  `,
);

const retryButtonStyle = cacheNoArgs(
  () => css`
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: #f1f1f1;
    cursor: pointer;
    font-size: 12px;
    padding: 4px 12px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `,
);

type ErrorDisplayProps = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorDisplay = (props: ErrorDisplayProps) => {
  return (
    <div class={errorStyle()}>
      <span class={errorIconStyle()}>!</span>
      <span>{props.message ?? 'Something went wrong'}</span>
      {props.onRetry && (
        <button class={retryButtonStyle()} onClick={props.onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};
