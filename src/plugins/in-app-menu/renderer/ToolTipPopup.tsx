import { type Accessor, createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { css } from 'solid-styled-components';
import { Transition } from 'solid-transition-group';
import { useFloating } from 'solid-floating-ui';
import { autoUpdate, offset, size } from '@floating-ui/dom';

import { cacheNoArgs } from '@/providers/decorators';

const toolTipStyle = cacheNoArgs(
  () => css`
    min-width: 32px;
    width: 100%;
    height: 100%;

    padding: 4px;

    max-width: calc(var(--max-width, 100%) - 8px);
    max-height: calc(var(--max-height, 100%) - 8px);

    border-radius: 4px;
    background-color: rgba(25, 25, 25, 0.8);
    color: #f1f1f1;
    font-size: 10px;
  `,
);

const popupStyle = cacheNoArgs(
  () => css`
    position: fixed;
    top: var(--offset-y, 0);
    left: var(--offset-x, 0);

    max-width: var(--max-width, 100%);
    max-height: var(--max-height, 100%);

    z-index: 100000000;
    pointer-events: none;
  `,
);

const animationStyle = cacheNoArgs(() => ({
  enter: css`
    opacity: 0;
    transform: scale(0.9);
  `,
  enterActive: css`
    transition:
      opacity 0.225s cubic-bezier(0.33, 1, 0.68, 1),
      transform 0.225s cubic-bezier(0.33, 1, 0.68, 1);
  `,
  exitTo: css`
    opacity: 0;
    transform: scale(0.9);
  `,
  exitActive: css`
    transition:
      opacity 0.225s cubic-bezier(0.32, 0, 0.67, 0),
      transform 0.225s cubic-bezier(0.32, 0, 0.67, 0);
  `,
}));

export type ToolTipPopupProps = {
  anchor: Accessor<HTMLElement | null>;
  text: string;
  open: boolean;
};

export const ToolTipPopup = (props: ToolTipPopupProps) => {
  const [toolTipRef, setToolTipRef] = createSignal<HTMLElement | null>(null);

  const position = useFloating(props.anchor, toolTipRef, {
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
    strategy: 'fixed',
    middleware: [
      offset({ mainAxis: 8 }),
      size({
        apply({ rects, elements }) {
          elements.floating.style.setProperty(
            '--max-width',
            `${rects.reference.width}px`,
          );
        },
      }),
    ],
  });

  return (
    <Portal>
      <div
        class={popupStyle()}
        ref={setToolTipRef}
        style={{
          '--offset-x': `${position.x}px`,
          '--offset-y': `${position.y}px`,
        }}
      >
        <Transition
          appear
          enterActiveClass={animationStyle().enterActive}
          enterClass={animationStyle().enter}
          exitActiveClass={animationStyle().exitActive}
          exitToClass={animationStyle().exitTo}
        >
          <Show when={props.open}>
            <div class={toolTipStyle()}>{props.text}</div>
          </Show>
        </Transition>
      </div>
    </Portal>
  );
};
