
const { setupRerender, act } = require('preact/test-utils');
const { createElement, render } = require('preact');
// import { setupScratch, teardown } from '../../../test/_util/helpers';
const { useState } = require('preact/hooks');


describe('test cases', () => {

  it('serves the same state across render calls', () => {
    const stateHistory = [];

    function Comp() {
      const [state] = useState({ a: 1 });
      stateHistory.push(state);
      return null;
    }

    render(<Comp />, document.body);
    // render(<Comp />, scratch);

    // expect(stateHistory).to.deep.equal([{ a: 1 }, { a: 1 }]);
    // expect(stateHistory[0]).to.equal(stateHistory[1]);
  });
});

export { };
