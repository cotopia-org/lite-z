import { ReactNode, createContext } from 'react';

type Props = { children: ReactNode };

const MediaContext = createContext<{}>({});

const MediaContextProvider = ({ children }: Props) => {
  return <MediaContext.Provider value={{}}>{children}</MediaContext.Provider>;
};

export default MediaContextProvider;
