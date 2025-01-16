import React from 'react';
import Talks from './talks';

export default function Notifications() {
  return (
    <div className="flex flex-col gap-y-4 absolute top-[64px] right-0 w-auto">
      <Talks />
    </div>
  );
}
