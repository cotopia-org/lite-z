import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<>Loading ...</>} persistor={persistor}>
        <Suspense fallback={<>Loading ...</>}>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
      <Toaster dir='rtl' className='font-[IRANYekan]' />
    </Provider>
  );
}

export default App;
