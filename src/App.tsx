import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import store, { persistor } from './store';
import { Suspense } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import FullLoading from '@/components/shared/full-loading';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<FullLoading />} persistor={persistor}>
        <Suspense fallback={<FullLoading />}>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
      <Toaster position={'bottom-left'} />
    </Provider>
  );
}

export default App;
