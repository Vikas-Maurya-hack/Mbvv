// AuthGuard.tsx
import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { IonPage, IonContent, IonLoading } from '@ionic/react';

interface AuthGuardProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
  
    // Add memoization to prevent unnecessary re-renders
    const renderContent = React.useMemo(() => {
      if (loading) {
        return (
          <IonPage>
            <IonContent>
              {/* <IonLoading isOpen={true} message={'Checking authentication...'} /> */}
            </IonContent>
          </IonPage>
        );
      }
  
      return isAuthenticated ? (
        <Component {...rest} />
      ) : (
        <Redirect to={{ pathname: '/', state: { from: location } }} />
      );
    }, [loading, isAuthenticated, location]);
  
    return <Route {...rest} render={() => renderContent} />;
  };

export default AuthGuard;