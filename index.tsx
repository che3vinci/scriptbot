import React from 'react';
import Variant from './xxx';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('app')
);
