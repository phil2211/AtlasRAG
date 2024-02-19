import { RealmAppProvider, useRealmApp } from "./RealmApp";
import Login from "./Pages/Login";
import RagApp from "./Pages/RagApp";

const APP_ID = import.meta.env.VITE_REALM_APP_ID;

const RequireLoggedInUser = ({ children }) => {
  const app = useRealmApp();
  return app.currentUser ? children : <Login />;
};

const App = () => {
  return (
    <RealmAppProvider appId={APP_ID}>
      <RequireLoggedInUser>
        <RagApp />
      </RequireLoggedInUser>
    </RealmAppProvider>
    
  );
}

export default App;