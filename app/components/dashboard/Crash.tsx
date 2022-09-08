import * as React from 'react';
import Title from './Title';

export default function Crash() {
  React.useEffect(() => {
    throw new Error('oups useEffect')
  }, [])
  return (
    <React.Fragment>
      <Title>Crash ?</Title>
      <button onClick={() => { throw new Error('oups')}}>
        make me crash!
      </button>
      
    </React.Fragment>
  );
}