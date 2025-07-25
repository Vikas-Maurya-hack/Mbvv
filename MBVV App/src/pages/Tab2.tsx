import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonPopover,
  IonList,
  IonAvatar,
} from '@ionic/react';
import logo from '../assets/image.png';
import {
  arrowBackOutline,
  briefcaseOutline,
  calendarOutline,
  locateOutline,
  locationOutline,
  personCircleOutline,
  timeOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useOfficer } from '../OfficerContext';
import './Tab2.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import React from 'react';

const Tab2: React.FC = () => {
  const history = useHistory();
  const [showPopover, setShowPopover] = useState<{ open: boolean; event: Event | undefined }>({
    open: false,
    event: undefined,
  });
  const { officer, loading } = useOfficer();

  const [isFlashing, setIsFlashing] = useState(false);
  
  // Check if officer is retiring this year
  const isRetiringThisYear = () => {
    if (!serviceDetails.date_of_retirement || serviceDetails.date_of_retirement === 'N/A') {
      return false;
    }
    
    try {
      // Extract year from date (assuming format is YYYY-MM-DD)
      const retirementYear = new Date(serviceDetails.date_of_retirement).getFullYear();
      const currentYear = new Date().getFullYear();
      
      return retirementYear === currentYear;
    } catch (e) {
      console.error('Error parsing retirement date:', e);
      return false;
    }
  };

  // Set up flashing effect interval

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
  
  const personalDetails = officer || {};
  const imageUrl = personalDetails.image_path 
    ? `https://mbvvworkforce.in/${personalDetails.image_path}`
    : logo;

  const serviceDetails = {
    designation: officer?.designation || 'N/A',
    post: officer?.post || 'N/A',
    date_of_joining: officer?.date_of_joining || 'N/A',
    zone: officer?.zone || 'N/A',
    current_posting: officer?.current_posting || 'N/A',
    current_posting_tenure: officer?.current_posting_tenure || 'N/A',
    previous_postings: officer?.previous_postings 
      ? typeof officer.previous_postings === 'string' 
        ? JSON.parse(officer.previous_postings) 
        : officer.previous_postings 
      : [],
    date_of_retirement: officer?.date_of_retirement || 'N/A',
  };
  useEffect(() => {
    if (isRetiringThisYear()) {
      const interval = setInterval(() => {
        setIsFlashing(prev => !prev);
      }, 1000); // Flash every second
      
      return () => clearInterval(interval);
    }
  }, [serviceDetails.date_of_retirement]);
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
            <IonIcon
              icon={arrowBackOutline}
              style={{ marginRight: '8px', cursor: 'pointer', fontSize: '22px' }}
              onClick={handleBackClick}
            />

            <IonTitle
              className="ion-text-center"
              style={{ textAlign: 'center', fontWeight: '600', color: '#edcc29' }}
            >
              Service Details
            </IonTitle>

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
                <b style={{ color: "blue" }}> {typeof user.username === 'string' && user.username.length > 0
                  ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                  : 'User'}</b>
              </span>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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

        {/* Profile Section - Stays at the top */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <IonAvatar style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
            <img 
              src={imageUrl} 
              alt="Profile" 
              onError={(e) => {
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
              <p className='blink-text'>
                Officer to retire this year!
              </p>
            )}
          </div>
        </div>

        {/* Service Details Card - Split into two columns for desktop */}
        <IonCard style={{ margin: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <IonCardContent className="ion-no-padding">
            <IonGrid>
              <IonRow>
                {/* First Column */}
                <IonCol size="12" sizeMd="6">
                  {/* Designation */}
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon icon={briefcaseOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
                    <IonLabel>
                      <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Designation</h2>
                      <p style={{ fontSize: '16px', color: '#333' }}>{serviceDetails.designation}</p>
                    </IonLabel>
                  </IonItem>

                  {/* Post */}
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon icon={locationOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
                    <IonLabel>
                      <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Post</h2>
                      <p style={{ fontSize: '16px', color: '#333' }}>{serviceDetails.post}</p>
                    </IonLabel>
                  </IonItem>

                  {/* Date of Joining */}
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon icon={calendarOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
                    <IonLabel>
                      <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Date of Joining</h2>
                      <p style={{ fontSize: '16px', color: '#333' }}>{serviceDetails.date_of_joining}</p>
                    </IonLabel>
                  </IonItem>

                  {/* Date of Retirement */}
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon icon={calendarOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
                    <IonLabel>
                      <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Date of Retirement</h2>
                      <p style={{ fontSize: '16px', color: '#333' }}>{serviceDetails.date_of_retirement}</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>

                {/* Second Column */}
                <IonCol size="12" sizeMd="6">
                  {/* Zone */}
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon icon={locateOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
                    <IonLabel>
                      <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Zone</h2>
                      <p style={{ fontSize: '16px', color: '#333' }}>{serviceDetails.zone}</p>
                    </IonLabel>
                  </IonItem>

                  {/* Current Posting */}
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon icon={locationOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
                    <IonLabel>
                      <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Current Posting</h2>
                      <p style={{ fontSize: '16px', color: '#333' }}>
                        <strong>Posting:</strong> {serviceDetails.current_posting}
                      </p>
                      <p style={{ fontSize: '16px', color: '#333' }}>
                        <strong>Tenure:</strong> {serviceDetails.current_posting_tenure}
                      </p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>

              {/* Previous Postings - Full width */}
              <IonRow>
                <IonCol size="12">
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon
                      icon={timeOutline}
                      slot="start"
                      style={{ color: '#3880ff', fontSize: '24px', marginRight: '10px' }}
                    />
                    <IonLabel>
                      <h2 style={{ color: '#3880ff', fontWeight: 'bold', fontSize: '18px' }}>Previous Postings</h2>
                    </IonLabel>
                  </IonItem>

                  <div style={{ position: 'relative', marginLeft: '25px', marginTop: '15px' }}>
                    {/* Vertical Timeline Line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '0',
                        bottom: '0',
                        width: '3px',
                        background: 'linear-gradient(180deg, #3880ff, #4dc4ff)',
                        borderRadius: '5px',
                      }}
                    ></div>

                    {/* Timeline Items */}
                    {serviceDetails.previous_postings.map((posting: { posting: string; tenure: string }, index: number) => (
                      <div
                        key={index}
                        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', position: 'relative' }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: '-16px',
                            width: '15px',
                            height: '15px',
                            borderRadius: '50%',
                            background: 'rgb(56, 128, 255)',
                            border: '3px solid white',
                            boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
                          }}
                        ></div>

                        <div
                          style={{
                            marginLeft: '25px',
                            background: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                          }}
                        >
                          <h3 style={{ fontSize: '16px', color: '#333', fontWeight: 'bold', margin: '0' }}>
                            {posting.posting}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0' }}>
                            <IonIcon icon={calendarOutline} style={{ color: '#3880ff', marginRight: '5px' }} />
                            <strong>Tenure:</strong> {posting.tenure}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;