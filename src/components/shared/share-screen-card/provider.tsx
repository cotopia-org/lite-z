import { TrackReference, useTracks } from "@livekit/components-react"
import React, { ReactNode, createContext, useContext, useMemo } from "react"

type Props = {
  lkOptions: {
    identity: string
    source: string
  }
  children: ReactNode
}

const ShareScreenContext = createContext<{
  identity: string
  targetTrack?: TrackReference
}>({ identity: "", targetTrack: undefined })

const ShareScreenProvider = ({ lkOptions, children }: Props) => {
  const alltracks = useTracks()

  const { identity, source } = lkOptions

  const targetTrack = useMemo(() => {
    return alltracks.find((track) => {
      return (
        track.source?.toLowerCase() === source.toLowerCase() &&
        identity === track.participant.identity
      )
    })
  }, [alltracks, identity, source])

  return (
    <ShareScreenContext.Provider value={{ identity, targetTrack }}>
      {children}
    </ShareScreenContext.Provider>
  )
}

export const useShareScreenCtx = () => useContext(ShareScreenContext)

export default ShareScreenProvider
