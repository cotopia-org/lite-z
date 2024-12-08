import "./App.css";
import {RouterProvider} from "react-router-dom";
import router from "./routes";
import {Toaster} from "sonner";
import {Provider} from "react-redux";
import store, {persistor} from "./store";
import {Suspense} from "react";
import {PersistGate} from "redux-persist/integration/react";
import useAuth from "@/hooks/auth";

function App() {



    // const auth = useAuth()

    return (
        <Provider store={store}>
            <PersistGate loading={<>Loading ...</>} persistor={persistor}>
                <Suspense fallback={<>Loading ...</>}>
                    {/*<div className={*/}
                    {/*    'w-[200px] border border-black bg-white absolute z-20 bottom-5 left-5 p-2 h-[200px] rounded'*/}
                    {/*}>*/}
                    {/*    Connected*/}
                    {/*</div>*/}
                    <RouterProvider router={router}/>
                </Suspense>
            </PersistGate>
            <Toaster/>
        </Provider>
    );
}

export default App;
