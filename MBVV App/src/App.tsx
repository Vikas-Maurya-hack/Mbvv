import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
import '@ionic/react/css/palettes/dark.class.css'; 
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Home from './pages/Home';
import Details from './pages/Details';
// import Tab4 from './pages/Tab4';
import { OfficerProvider } from './OfficerContext';
import Login from './pages/Login';
import AddOfficerPage from './pages/AddOfficerPage';
import { AuthProvider } from './AuthContext';
import AuthGuard from './AuthGuard';
import ErrorBoundary from './ErrorBoundary';
setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <ErrorBoundary>
     <AuthProvider>
    <OfficerProvider>
    <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Login} />
          <AuthGuard exact path="/home" component={Home} />
          <AuthGuard exact path="/add" component={AddOfficerPage} />
          <AuthGuard path="/details" component={Details} />
          <Route render={() => <Redirect to="/" />} />
        </IonRouterOutlet>
      </IonReactRouter>
      </OfficerProvider>
      </AuthProvider>
      </ErrorBoundary>
  </IonApp>
);

export default App;
