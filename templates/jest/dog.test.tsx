import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
global.IS_REACT_ACT_ENVIRONMENT = true;

describe('test cases', () => {
  it('test tsx ', () => {
    const Dog = () => {
      return <div id="dog">dog</div>;
    };
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      createRoot(container).render(<Dog />);
    });

    expect(document.querySelector('#dog')?.textContent).toBe('dog');
  });
});
