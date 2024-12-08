import { uniqueById, urlWithQueryParams } from "@/lib/utils";
import axiosInstance from "@/services/axios";
import { Chat2ItemType, ChatType } from "@/types/chat2";
import { UserMinimalType } from "@/types/user";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

type ChatState = {
  chats: {
    [chat_id: string]: {
      object: ChatType;
      messages: Chat2ItemType[];
      loading: boolean;
      fetchPageLoading: boolean;
      page: number;
      lastPage?: boolean;
      firstPage?: boolean;
      replyMessage?: Chat2ItemType;
      pin?: {
        items: Chat2ItemType[];
        currentIndex: number;
      };
    };
  };
  error: string | null;
  loading: boolean;
  participants: UserMinimalType[];
  currentChat?: ChatType;
};

const initialState: ChatState = {
  chats: {},
  error: null,
  loading: false,
  participants: [],
  currentChat: undefined,
};

// Async thunk to fetch chat by page
export const getChats = createAsyncThunk(
  "chat/getChats",
  async ({ workspace_id }: { workspace_id: number }) => {
    const res = await axiosInstance.get(`/users/chats`, {
      params: { workspace_id },
    });

    const chats = res.data.data || [];

    return chats;
  }
);

// Async thunk to fetch chat messages by page
export const getChatMessages = createAsyncThunk(
  "chat/getChatMessages",
  async ({ chat_id, page }: { chat_id: number; page?: number }) => {
    let res;
    let page_number = page;

    if (page) {
      res = await axiosInstance.get(
        urlWithQueryParams(`/chats/${chat_id}/messages`, { page })
      );
    } else {
      const lastPageRes = await axiosInstance.get(
        `/chats/${chat_id}/getLastUnSeenMessagePage`
      );
      const pageNumber = lastPageRes.data.data?.page_number;
      page_number = pageNumber;
      res = await axiosInstance.get(
        urlWithQueryParams(`/chats/${chat_id}/messages`, { page: pageNumber })
      );
    }

    const chats = res.data.data || [];

    return { items: chats, page_number: page_number ?? 1 };
  }
);

export const getPrevMessages = createAsyncThunk(
  "chat/getPrevMessages",
  async ({ chat_id, page }: { chat_id: number; page?: number }) => {
    let res;
    let page_number = page;
    res = await axiosInstance.get(
      urlWithQueryParams(`/chats/${chat_id}/messages`, { page })
    );

    const chats = res.data.data || [];

    return { items: chats, page_number: page_number ?? 1 };
  }
);

export const getNextMessages = createAsyncThunk(
  "chat/getNextMessages",
  async ({ chat_id, page }: { chat_id: number; page?: number }) => {
    let res;
    let page_number = page;
    res = await axiosInstance.get(
      urlWithQueryParams(`/chats/${chat_id}/messages`, { page })
    );

    const chats = res.data.data || [];

    return { items: [...[...chats]?.reverse()], page_number: page_number ?? 1 };
  }
);

// Async thunk to fetch chat messages by page
export const getBeforeAndAfterMessages = createAsyncThunk(
  "chat/getBeforeAndAfterMessages",
  async ({ message_id }: { message_id: number }) => {
    const res = await axiosInstance.get(`/messages/${message_id}`);

    const chats = res.data.data || [];

    return chats;
  }
);

// Async thunk to fetch chat messages by page
export const getPinMessags = createAsyncThunk(
  "chat/getPinMessags",
  async ({ chat_id }: { chat_id: number }) => {
    const res = await axiosInstance.get(`/chats/${chat_id}/pinnedMessages`);

    const messages = res.data.data || [];

    return messages;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addNewChat: (state, action: PayloadAction<ChatType>) => {
      const chat = action.payload;

      //There is nothing to do when chat has already existed
      if (state.chats[chat.id]) return;

      state.chats[chat.id] = {
        loading: false,
        messages: [],
        object: chat,
        page: 1,
        fetchPageLoading: false,
      };
    },
    setCurrentChat: (state, action: PayloadAction<ChatType>) => {
      const chatType = action.payload;

      state.currentChat = chatType;
      state.chats[chatType.id].object.unseens = 0;
    },
    clearCurrentChat: (state) => {
      state.currentChat = undefined;
    },
    bulkPinMessages: (state, action: PayloadAction<Chat2ItemType[]>) => {
      const firstMessage = action.payload[0];

      state.chats[firstMessage.chat_id].pin = {
        items: action.payload,
        currentIndex: 0,
      };
    },
    setReplyMessage: (state, action: PayloadAction<Chat2ItemType>) => {
      const item = action.payload;

      state.chats[item.chat_id].replyMessage = item;
    },
    clearReplyMessage: (state, action: PayloadAction<number>) => {
      const chat_id = action.payload;
      state.chats[chat_id].replyMessage = undefined;
    },
    addMessage: (state, action: PayloadAction<Chat2ItemType>) => {
      const chat_id = action.payload.chat_id;

      state.chats[chat_id].messages = [
        action.payload,
        ...state.chats[chat_id].messages,
      ];

      state.chats[chat_id].object.last_message = action.payload;

      // state.chats[chat_id].object.unseens =
      //   state.chats[chat_id].object.unseens + 1;
    },
    setChatMessages: (state, action: PayloadAction<Chat2ItemType[]>) => {
      const messages = action.payload;
      const chat_id = messages?.[0]?.chat_id;
      state.chats[chat_id].messages = [...messages.reverse()];
      state.chats[chat_id].object.last_message = messages[0];
    },
    upcommingMessage: (
      state,
      action: PayloadAction<{
        messages: Chat2ItemType[];
        message: Chat2ItemType;
      }>
    ) => {
      const { messages, message } = action.payload;

      const chat_id = messages?.[0]?.chat_id;
      state.chats[chat_id].messages = messages;
      state.chats[chat_id].object.last_message = message;
      state.chats[chat_id].object.unseens =
        state.chats[chat_id].object.unseens + 1;
    },
    updateMessage: (state, action: PayloadAction<Chat2ItemType>) => {
      const incoming_chat_message = action.payload;
      const chat_id = incoming_chat_message.chat_id;

      state.chats[chat_id].messages = state.chats[chat_id].messages.map((x) => {
        if (x.nonce_id === incoming_chat_message.nonce_id) {
          return incoming_chat_message;
        }

        return x;
      });
    },
    seenMessage: (
      state,
      action: PayloadAction<{
        chat_id: number;
        nonce_id: number;
        user_id: number;
      }>
    ) => {
      const chat_id = action.payload.chat_id;
      const nonce_id = action.payload.nonce_id;
      const user_id = action.payload.user_id;

      state.chats[chat_id].messages = state.chats[chat_id].messages.map((x) => {
        if (x.nonce_id === nonce_id) {
          return { ...x, seen: true };
        }

        return x;
      });
    },
    surfPinMessages: (state) => {
      if (!state.currentChat) return;

      const chat = state.chats[state.currentChat?.id];

      if (!chat.pin) return;

      const currentIndex = chat?.pin?.currentIndex ?? 0;
      const pinItems = chat?.pin?.items ?? [];

      if (currentIndex < pinItems?.length - 1) {
        chat.pin.currentIndex = currentIndex + 1;
      } else {
        chat.pin.currentIndex = 0;
      }
    },
    pinMessage: (state, action: PayloadAction<Chat2ItemType>) => {
      const chat_id = action.payload.chat_id;

      const chatPin = state.chats[chat_id].pin;

      if (chat_id)
        state.chats[chat_id].pin = {
          currentIndex: 0,
          items: [...(chatPin?.items ?? []), action.payload],
        };
    },
    deleteMessage: (state, action: PayloadAction<Chat2ItemType>) => {
      const chat_id = action.payload.chat_id;

      if (chat_id)
        state.chats[chat_id].messages = state.chats[chat_id].messages.map(
          (m) => {
            if (m.nonce_id === action.payload.nonce_id) {
              m.text = "This message has been deleted";
            }

            return m;
          }
        );
    },
    unpinMessage: (state, action: PayloadAction<Chat2ItemType>) => {
      const chat_id = action.payload.chat_id;

      const chatPin = state.chats[chat_id].pin;

      if (chat_id)
        state.chats[chat_id].pin = {
          currentIndex: 0,
          items:
            chatPin?.items?.filter(
              (x) => x.nonce_id !== action.payload.nonce_id
            ) ?? [],
        };
    },
    seenAllMessages: (state, action: PayloadAction<{ chat_id: number }>) => {
      const chat_id = action.payload.chat_id;
      state.chats[chat_id].object.unseens = 0;
      state.chats[chat_id].object.mentioned_messages = 0;
      state.chats[chat_id].messages.map((x) => {
        x.seen = true;
        return x;
      });
    },
    addMentionedMessages: (
      state,
      action: PayloadAction<{ chat_id: number }>
    ) => {
      const chat_id = action.payload.chat_id;
      state.chats[chat_id].object.mentioned_messages =
        state.chats[chat_id].object.mentioned_messages + 1;
    },
    subtractMentionedMessages: (
      state,
      action: PayloadAction<{ chat_id: number }>
    ) => {
      const chat_id = action.payload.chat_id;
      state.chats[chat_id].object.mentioned_messages =
        state.chats[chat_id].object.mentioned_messages - 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChats.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(
        getChats.fulfilled,
        (state, action: PayloadAction<ChatType[]>) => {
          let allParticipants: UserMinimalType[] = [];

          const chatObjects = action.payload;

          for (let chat of chatObjects) {
            if (state.chats[chat?.id]) {
              state.chats[chat?.id] = {
                ...state.chats[chat?.id],
                object: chat,
              };
            } else {
              state.chats[chat?.id] = {
                loading: false,
                messages: [],
                object: chat,
                page: 1,
                fetchPageLoading: false,
              };
            }
            allParticipants = [...allParticipants, ...chat.participants];
          }

          //Update all participants in redux
          state.participants = uniqueById(allParticipants) as UserMinimalType[];

          state.loading = false;
        }
      )
      .addCase(getChats.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch messages";
        state.loading = false;
      })
      .addCase(getChatMessages.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(
        getChatMessages.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: Chat2ItemType[];
            page_number: number;
          }> & {
            meta: { [key: string]: any };
          }
        ) => {
          const { chat_id } = action.meta.arg;
          const chatItems = action.payload.items;

          state.chats[chat_id].messages = chatItems;
          state.chats[chat_id].page = action.payload.page_number;
          state.chats[chat_id].lastPage = false;
          state.chats[chat_id].firstPage = action.payload.page_number === 1;

          state.loading = false;
        }
      )
      .addCase(getChatMessages.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch messages";
        state.loading = false;
      })
      .addCase(getPrevMessages.pending, (state, action) => {
        const { chat_id } = action.meta.arg;
        state.chats[chat_id].fetchPageLoading = true;
      })
      .addCase(
        getPrevMessages.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: Chat2ItemType[];
            page_number: number;
          }> & {
            meta: { [key: string]: any };
          }
        ) => {
          const { chat_id, page } = action.meta.arg;
          const chatItems = action.payload.items;

          state.chats[chat_id].messages = [
            ...state.chats[chat_id].messages,
            ...chatItems,
          ];

          if (chatItems.length === 0) {
            state.chats[chat_id].lastPage = true;
            state.chats[chat_id].page = page;
          } else {
            state.chats[chat_id].page = action.payload.page_number;
          }
          state.chats[chat_id].fetchPageLoading = false;
        }
      )
      .addCase(getPrevMessages.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch messages";
        const { chat_id } = action.meta.arg;
        state.chats[chat_id].fetchPageLoading = false;
      })
      .addCase(getNextMessages.pending, (state, action) => {
        const { chat_id } = action.meta.arg;
        state.chats[chat_id].fetchPageLoading = true;
      })
      .addCase(
        getNextMessages.fulfilled,
        (
          state,
          action: PayloadAction<{
            items: Chat2ItemType[];
            page_number: number;
          }> & {
            meta: { [key: string]: any };
          }
        ) => {
          const { chat_id } = action.meta.arg;
          const chatItems = action.payload.items;

          state.chats[chat_id].messages = [
            ...state.chats[chat_id].messages,
            ...chatItems,
          ];
          state.chats[chat_id].page = action.payload.page_number;

          if (chatItems.length === 0) state.chats[chat_id].lastPage = true;

          state.chats[chat_id].fetchPageLoading = false;
        }
      )
      .addCase(getNextMessages.rejected, (state, action) => {
        const { chat_id } = action.meta.arg;
        state.error = action.error.message || "Failed to fetch messages";
        state.chats[chat_id].fetchPageLoading = true;
      })
      .addCase(getPinMessags.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(
        getPinMessags.fulfilled,
        (state, action: PayloadAction<Chat2ItemType[]>) => {
          const pinMessages = action.payload ?? [];

          if (pinMessages.length > 0)
            state.chats[pinMessages[0].chat_id].pin = {
              currentIndex: 0,
              items: pinMessages,
            };
          state.loading = false;
        }
      )

      .addCase(getPinMessags.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getBeforeAndAfterMessages.pending, (state, action) => {})
      .addCase(
        getBeforeAndAfterMessages.fulfilled,
        (state, action: PayloadAction<Chat2ItemType[]>) => {
          if (!state.currentChat?.id) return;

          const chat_messages = action.payload;
          state.chats[state.currentChat.id].messages = chat_messages;

          const chat = state.chats[state.currentChat?.id];

          if (!chat.pin) return;

          const currentIndex = chat?.pin?.currentIndex ?? 0;
          const pinItems = chat?.pin?.items ?? [];

          if (currentIndex < pinItems?.length - 1) {
            chat.pin.currentIndex = currentIndex + 1;
          } else {
            chat.pin.currentIndex = 0;
          }
        }
      )
      .addCase(getBeforeAndAfterMessages.rejected, (state, action) => {});
  },
});

export const {
  addMessage,
  updateMessage,
  seenMessage,
  seenAllMessages,
  setCurrentChat,
  clearCurrentChat,
  addNewChat,
  setChatMessages,
  upcommingMessage,
  setReplyMessage,
  clearReplyMessage,
  bulkPinMessages,
  pinMessage,
  deleteMessage,
  unpinMessage,
  surfPinMessages,
  addMentionedMessages,
  subtractMentionedMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
