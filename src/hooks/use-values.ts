import { useEffect, useReducer } from "react"

type ActionType =
  | { type: "CHANGE_KEY"; payload: { key: string; value: any } }
  | { type: "CHANGE_BULK"; payload: { [key: string]: any } }

const reducer = (state: { [key: string]: any }, action: ActionType) => {
  switch (action.type) {
    case "CHANGE_KEY":
      const key = action.payload.key
      const value = action.payload.value
      return { ...state, [key]: value }
    case "CHANGE_BULK":
      return { ...state, ...action.payload }
  }
}

const useValues = <T extends { [key: string]: any }>(
  initValues: T,
  deps: any[] = []
) => {
  const [state, dispatch] = useReducer(reducer, {})

  const changeKey = (key: string, value: any) => {
    dispatch({ type: "CHANGE_KEY", payload: { key, value } })
  }
  const changeBulk = (values: any) => {
    dispatch({ type: "CHANGE_BULK", payload: values })
  }

  useEffect(() => {
    changeBulk(initValues ?? {})
  }, [...deps])

  return {
    values: state as T,
    changeBulk,
    changeKey,
  }
}

export default useValues
