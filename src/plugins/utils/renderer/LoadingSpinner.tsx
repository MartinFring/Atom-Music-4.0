import { css } from 'solid-styled-components';
import { cacheNoArgs } from '@/providers/decorators';

const spinnerStyle = cacheNoArgs(
  () => css`
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: #3ea6ff;
    border-radius: 50%;
    animation: ytmd-spin 0.6s linear infinite;

    @keyframes ytmd-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
);

type LoadingSpinnerProps = {
  size?: number;
};

export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return (
    <div
      class={spinnerStyle()}
      style={{
        width: props.size ? `${props.size}px` : undefined,
        height: props.size ? `${props.size}px` : undefined,
      }}
    />
  );
};
