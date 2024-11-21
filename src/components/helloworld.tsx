import React from 'react';

// Props turlarini aniqlaymiz
type HelloWorldProps = {
  name: string;
  age?: number; // age ixtiyoriy bo'lishi mumkin
};

const HelloWorld: React.FC<HelloWorldProps> = ({ name, age }) => {
  return (
    <div>
      <p>Hi, {name}!</p>
      {age && <p>you age: {age}</p>}
    </div>
  );
};

export default HelloWorld;
