import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import logo from '../assets/image.png';
import { arrowBackOutline, calendarOutline, personCircleOutline, trophyOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useOfficer } from '../OfficerContext';
import './Tab3.css';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const Tab3: React.FC = () => {
  const history = useHistory();
  const { officer } = useOfficer();
  const [showPopover, setShowPopover] = useState<{ open: boolean; event: Event | undefined }>({
    open: false,
    event: undefined,
  });
  const [isFlashing, setIsFlashing] = useState(false);
  const personalDetails = officer || {};
  const imageUrl = personalDetails.image_path 
  ? `https://mbvvworkforce.in/${personalDetails.image_path}` // Adjust base URL as needed
  : logo;
  const handleBackClick = () => {
    history.push('/home');
  };
  
  const { logout } = useAuth();
  const handleLogout = React.useCallback(() => {
    setShowPopover({ open: false, event: undefined });
    logout();
    setTimeout(() => {
      history.push('/');
    }, 100);
  }, [logout, history]);

  // Handle rewards as a single text field
  const rewardText = React.useMemo(() => {
    if (!officer || !officer.rewards) return null;
    
    try {
      // If rewards is already a string, use it directly
      if (typeof officer.rewards === 'string') {
        return officer.rewards.trim() === '' ? null : officer.rewards;
      }
      // If it's an array (legacy format), join it
      // if (Array.isArray(officer.rewards)) {
      //   return officer.rewards.length > 0 ? officer.rewards.join(', ') : null;
      // }
      return null;
    } catch (error) {
      console.error('Error processing rewards:', error);
      return null;
    }
  }, [officer]);
  const isRetiringThisYear = () => {
      if (!personalDetails.date_of_retirement || personalDetails.date_of_retirement === 'N/A') {
        return false;
      }
      
      try {
        // Extract year from date (assuming format is YYYY-MM-DD)
        const retirementYear = new Date(personalDetails.date_of_retirement).getFullYear();
        const currentYear = new Date().getFullYear();
        
        return retirementYear === currentYear;
      } catch (e) {
        console.error('Error parsing retirement date:', e);
        return false;
      }
    };
  
    // Set up flashing effect interval
    useEffect(() => {
      if (isRetiringThisYear()) {
        const interval = setInterval(() => {
          setIsFlashing(prev => !prev);
        }, 1000); // Flash every second
        
        return () => clearInterval(interval);
      }
    }, [personalDetails.date_of_retirement]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <IonPage>
      <IonHeader>
         <IonToolbar>
           <div
             style={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               width: '100%',
               boxSizing: 'border-box',
               padding: '0 16px',
               opacity: '0.9',
             }}
           >
             {/* Back Button */}
             <IonIcon
               icon={arrowBackOutline}
               style={{ marginRight: '8px', cursor: 'pointer',fontSize:'22px' }}
               onClick={handleBackClick}
             />
     
             {/* Title */}
             <IonTitle
               className="ion-text-center"
               style={{ textAlign: 'center', fontWeight: '600', color: '#edcc29' }}
             >
               Rewards
             </IonTitle>
     
             {/* Profile Icon */}
             <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '2px'
                                      }}>
                                        <IonIcon
                                          icon={personCircleOutline}
                                          style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                                          onClick={(e) => setShowPopover({ open: true, event: e.nativeEvent })}
                                        />
                                        <span style={{
                                          fontSize: '12px',
                                          color: '#666',
                                          whiteSpace: 'nowrap',
                                          marginBottom: '5px',
                                        }}>
                                          <b style={{color:"blue"}}> {typeof user.username === 'string' && user.username.length > 0 
                              ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                              : 'User' }</b>
                                        </span>
                                      </div>
           </div>
         </IonToolbar>
       </IonHeader>
      <IonContent fullscreen>
        <IonPopover
          isOpen={showPopover.open}
          event={showPopover.event}
          onDidDismiss={() => setShowPopover({ open: false, event: undefined })}
          className="logout-popover"
        >
          <IonList>
            <IonItem button onClick={handleLogout} lines="none">
              Logout
            </IonItem>
          </IonList>
        </IonPopover>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <IonAvatar style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
          <img 
              src={imageUrl} 
              alt="Profile" 
              onError={(e) => {
                // Fallback to default logo if image fails to load
                (e.target as HTMLImageElement).src = logo;
              }}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                borderRadius: '50%'
              }}
            />
          </IonAvatar>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p style={{ fontWeight: 'bold', margin: 0, fontSize: '22px', color: '#3880ff' }}>{personalDetails.name || 'N/A'}</p>
            <p style={{ margin: 0, fontSize: '16px', color: '#666', fontWeight: '600' }}>{personalDetails.designation || 'N/A'}</p>
            {isRetiringThisYear() && (
              <p style={{ 
                margin: '10px 0 0',
                fontSize: '16px',
                fontWeight: 'bold',
                color: isFlashing ? '#ff0000' : '#ff6666',
                transition: 'color 0.5s ease',
                animation: 'blink 1s infinite'
              }}>
                Officer to retire this year!
              </p>
            )}
          </div>
        </div>

        {/* Rewards Card */}
        <IonCard style={{ margin: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <IonCardContent className="ion-no-padding">
            {rewardText ? (
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonItem lines="none" style={{ '--background': 'transparent' }}>
                      <IonIcon icon={trophyOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
                      <IonLabel>
                        <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Reward Details</h2>
                        <p style={{ fontSize: '16px', color: '#333', whiteSpace: 'pre-line' }}>
                          {rewardText} Good Entry <span style={{fontSize:'20px'}}>🏅</span>
                        </p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            ) : (
              <IonItem lines="none" style={{ '--background': 'transparent' }}>
                <IonLabel>
                  <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>No rewards found.</h2>
                </IonLabel>
              </IonItem>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;