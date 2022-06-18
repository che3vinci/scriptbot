import React, { Profiler, useEffect, useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div data-testid="count">{count}</div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        click
      </button>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Counter />;
    </div>
  );
};
export default App;
