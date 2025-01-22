import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect, useState } from 'react';

type Props = {
  room_id: number;
};

export default function RoomChats({ room_id }: Props) {
  const dispatch = useAppDispatch();

  const chats = useAppSelector((state) => state.chat.chats);
  const messages = chats[room_id]?.messages ?? [];
  const currentPage = chats[room_id]?.page ?? 1;

  return null;

  // return (
  //   <Chat2
  //     items={messages}
  //     addMessage={(text) => console.log("text", text)}
  //     onFetchNewMessages={() =>
  //       new Promise((res) => {
  //         setTimeout(async () => {
  //           await handleFetchNewMessages(); // Call your fetch handler
  //           res(); // Resolve the promise after fetching new messages
  //         }, 1000);
  //       })
  //     }
  //     getUser={() =}
  //   />
  // );
}
