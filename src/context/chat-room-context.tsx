import { useRef } from "react";

import {
  RoomDetailsType,
  getInitMessages,
  getNextMessages,
  getPrevMessages,
} from "@/store/slices/room-slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { ChatItemType } from "@/types/chat";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { dispatch as busDispatch } from "use-bus";
import {
  MessagePayloadType,
  useChatSocket,
} from "@/hooks/chat/use-chat-socket";
import { VARZ } from "@/const/varz";
import useAuth from "@/hooks/auth";
import { __BUS } from "@/const/bus";

export type FlagType = "edit" | "reply" | "pin";

export enum FetchMessageType {
  "Prev" = 1,
  "Next" = 2,
}

type InitCtxType = {
  env: RoomEnvironmentType;
  messages: ChatItemType[] | undefined;
  targetMessage: ChatItemType | undefined;
  originMessage: ChatItemType | undefined;
  roomId: number;
  flag: FlagType | undefined;
  loading: boolean;
  navigateLoading: boolean;
  upperLimit: number;
  downLimit: number;
  loadMoreMessages: (
    type: FetchMessageType,
    upLimit?: number,
    downLimit?: number
  ) => Promise<{ items: ChatItemType[] }>;
  onAddMessage: (payload: MessagePayloadType) => void;
  onReplyMessage: (payload: MessagePayloadType) => void;
  onEditMessage: (message: ChatItemType) => void;
  ref: any;
  changeKey: (value: { key: string; value: any }) => void;
  changeBulk: (values: { [key: string]: any }) => void;
};

export enum RoomEnvironmentType {
  "room" = "roomMessages",
  "direct" = "directMessages",
}
const initCtx: InitCtxType = {
  env: RoomEnvironmentType.room,
  messages: [],
  targetMessage: undefined,
  originMessage: undefined,
  loading: false,
  navigateLoading: false,
  ref: undefined,
  flag: undefined,
  roomId: 1,
  onAddMessage: () => {},
  upperLimit: VARZ.pagesLimitDiff,
  downLimit: 1,
  onEditMessage: () => {},
  onReplyMessage: () => {},
  changeKey: (value) => {},
  changeBulk: (values) => {},
  loadMoreMessages: () =>
    new Promise<{ items: ChatItemType[] }>((resolve, reject) => []),
};

const ChatRoomCtx = createContext(initCtx);

type InitStateType = {
  targetMessage: ChatItemType | undefined;
  originMessage: ChatItemType | undefined;
  flag: FlagType | undefined;
  navigateLoading: boolean;
};

const initialState: InitStateType = {
  navigateLoading: false,
  targetMessage: undefined,
  originMessage: undefined,
  flag: undefined,
};

type ActionTypes =
  | {
      type: "CHANGE_KEY";
      payload: { key: string; value: any };
    }
  | {
      type: "CHANGE_BULK";
      payload: { [key: string]: any };
    };

const reducer = (state: InitStateType, action: ActionTypes) => {
  switch (action.type) {
    case "CHANGE_KEY":
      const targetKey = action.payload.key;
      const targetVal = action.payload.value;
      return { ...state, [targetKey]: targetVal };
    case "CHANGE_BULK":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const UPPER_LIMIT_PAGE = VARZ.pagesLimitDiff;
export const DOWN_LIMIT_PAGE = 1;

const ChatRoomCtxProvider = ({
  children,
  environment,
  room_id,
}: {
  children: ReactNode;
  environment: RoomEnvironmentType;
  room_id: number;
}) => {
  const { user } = useAuth();

  const chat = useChatSocket(room_id, user, environment);

  const [state, dispatch] = useReducer(reducer, initialState);

  const ref = useRef<any>();

  const ctxType = environment;
  const appDispatch = useAppDispatch();

  const roomSlice = useAppSelector((state) => state.room);

  const chatRoom = roomSlice?.chatRoom ?? {};
  const loading = roomSlice?.loading ?? false;

  let selectedRoom: RoomDetailsType | undefined = undefined;

  //collect all chat room ids
  const roomIds = chatRoom ? Object.keys(chatRoom).map((x) => +x) : [];
  //check is room exist or not
  if (roomIds.includes(room_id)) {
    selectedRoom = chatRoom?.[room_id];
  }
  const upper_limit = selectedRoom?.upper_limit ?? UPPER_LIMIT_PAGE;
  const down_limit = selectedRoom?.down_limit ?? DOWN_LIMIT_PAGE;

  let isFirstFetch = selectedRoom === undefined;
  if (environment === RoomEnvironmentType.direct) {
    isFirstFetch = true;
  }

  let messages = selectedRoom?.messages ?? [];

  useEffect(() => {
    const firstFetchMessages = async () => {
      if (!room_id || !isFirstFetch) return;
      appDispatch(
        getInitMessages({
          has_loading: true,
          room_id: room_id,
          upper_limit: UPPER_LIMIT_PAGE,
        })
      );
    };

    firstFetchMessages();
  }, [isFirstFetch, room_id]);

  const loadMoreMessages = useCallback(
    async (
      type: FetchMessageType,
      ul?: number,
      dl?: number
    ): Promise<{ items: ChatItemType[] }> => {
      let objToSend = { room_id, upper_limit, down_limit };
      if (!!ul) objToSend["upper_limit"] = ul;
      if (!!dl) objToSend["down_limit"] = dl;
      let res: any;
      switch (type) {
        case FetchMessageType.Next:
          res = await appDispatch(getNextMessages(objToSend));
          return { items: res.payload.messages ?? [] };
        case FetchMessageType.Prev:
          res = await appDispatch(getPrevMessages(objToSend));
          return { items: res.payload.messages ?? [] };
      }
    },
    [upper_limit, down_limit, messages, ctxType, room_id]
  );

  const addMessageHandler = useCallback(
    async (payload: MessagePayloadType) => {
      if (!room_id) return;
      if (down_limit > 1) {
        await appDispatch(
          getInitMessages({
            has_loading: false,
            room_id: room_id,
            upper_limit: UPPER_LIMIT_PAGE,
          })
        );
        busDispatch(__BUS.scrollEndChatBox);
      } else {
        chat.send({ payload });
        busDispatch(__BUS.scrollEndChatBox);
      }
    },
    [room_id, down_limit, environment]
  );

  const editMessageHandler = useCallback(
    async (message: ChatItemType) => {
      if (state.targetMessage === undefined || state.flag !== "edit") return;
      dispatch({
        type: "CHANGE_BULK",
        payload: { targetMessage: undefined, flag: undefined },
      });
      chat.edit({ message });
    },
    [state.targetMessage]
  );

  const replyMessageHandler = useCallback(
    async (payload: MessagePayloadType) => {
      dispatch({
        type: "CHANGE_BULK",
        payload: { targetMessage: undefined, flag: undefined },
      });
      if (!state.targetMessage || !room_id) return;
      if (down_limit > 1) {
        await appDispatch(
          getInitMessages({
            has_loading: false,
            room_id: room_id,
            upper_limit: UPPER_LIMIT_PAGE,
          })
        );
        busDispatch(__BUS.scrollEndChatBox);
      } else {
        chat.send({ payload: { ...payload, replyTo: state.targetMessage } });
        busDispatch(__BUS.scrollEndChatBox);
      }
    },
    [busDispatch, room_id, down_limit, state?.targetMessage]
  );

  const changeStateHandler = (value: { key: string; value: any }) => {
    dispatch({ type: "CHANGE_KEY", payload: value });
  };

  const changeBultHandler = (values: { [key: string]: any }) => {
    dispatch({ type: "CHANGE_BULK", payload: values });
  };

  if (!room_id) return null;

  return (
    <ChatRoomCtx.Provider
      value={{
        env: environment,
        loading: loading || chatRoom === undefined,
        flag: state.flag,
        ref,
        roomId: room_id,
        upperLimit: upper_limit,
        downLimit: down_limit,
        originMessage: state.originMessage,
        changeKey: changeStateHandler,
        navigateLoading: state.navigateLoading,
        changeBulk: changeBultHandler,
        messages,
        targetMessage: state.targetMessage,
        loadMoreMessages: loadMoreMessages,
        onAddMessage: addMessageHandler,
        onEditMessage: editMessageHandler,
        onReplyMessage: replyMessageHandler,
      }}
    >
      {children}
    </ChatRoomCtx.Provider>
  );
};

export const useChatRoomCtx = () => useContext(ChatRoomCtx);

export default ChatRoomCtxProvider;
