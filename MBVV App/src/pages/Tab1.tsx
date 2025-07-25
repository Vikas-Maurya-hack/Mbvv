import { IonAvatar, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, IonLoading, IonPopover, IonList } from '@ionic/react';
import { arrowBackOutline, callOutline, carOutline, femaleOutline, hammerOutline, heartOutline, homeOutline, idCardOutline, mailOutline, maleOutline, peopleOutline, personCircleOutline, schoolOutline, waterOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useOfficer } from '../OfficerContext';
import logo from '../assets/image.png';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import React from 'react';

const Tab1: React.FC = () => {
  const history = useHistory();
  const [showPopover, setShowPopover] = useState<{ open: boolean; event: Event | undefined }>({
      open: false,
      event: undefined,
    });
    const [isFlashing, setIsFlashing] = useState(false);

    const [retirementInfo, setRetirementInfo] = useState<{month: string, year: number, isRetiring: boolean} | null>(null);

    
  
    // Flash effect
    useEffect(() => {
      if (retirementInfo?.isRetiring) {
        const interval = setInterval(() => {
          setIsFlashing(prev => !prev);
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [retirementInfo]);
  
    // Set up flashing effect interval
    

  const { officer, loading } = useOfficer();
  const handleBackClick = () => {
    history.push('/home');
  };
   const { logout } = useAuth();
  const handleLogout = React.useCallback(() => {
    // Close popover first
    setShowPopover({ open: false, event: undefined });
    
    // Perform logout
    logout();
    
    // Use setTimeout to break the synchronous chain
    setTimeout(() => {
      history.push('/');
    }, 100);
  }, [logout, history]);
  // Use optional chaining and default values
  const personalDetails = officer || {};
  const genderIcon = personalDetails.gender === 'Male' ? maleOutline : femaleOutline;

  // Parse skills and driving_skills from JSON strings (if necessary)
  const skills = typeof personalDetails.skills === 'string' ? JSON.parse(personalDetails.skills) : personalDetails.skills || [];
  const drivingSkills = typeof personalDetails.driving_skills === 'string' ? JSON.parse(personalDetails.driving_skills) : personalDetails.driving_skills || [];
  const imageUrl = personalDetails.image_path 
    ? `https://mbvvworkforce.in/${personalDetails.image_path}` // Adjust base URL as needed
    : logo;

  // if (loading) {
  //   return <IonLoading isOpen={loading} message="Loading..." />;
  // }


  // Set up flashing effect interval
  useEffect(() => {
    if (!personalDetails.date_of_retirement || personalDetails.date_of_retirement === 'N/A') {
      setRetirementInfo(null);
      return;
    }
    
    try {
      const retirementDate = new Date(personalDetails.date_of_retirement);
      const currentYear = new Date().getFullYear();
      const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
      
      setRetirementInfo({
        month: monthNames[retirementDate.getMonth()],
        year: retirementDate.getFullYear(),
        isRetiring: retirementDate.getFullYear() === currentYear
      });
    } catch (e) {
      console.error('Error parsing retirement date:', e);
      setRetirementInfo(null);
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
        Personal Details
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
          className="logout-popover"  // Add a custom class for styling
        >
          <IonList>
            <IonItem button onClick={handleLogout} lines="none">
              Logout
            </IonItem>
          </IonList>
        </IonPopover>
        {/* Profile Section */}
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
            { retirementInfo?.isRetiring &&(
              <p style={{ 
                margin: '10px 0 0',
                fontSize: '16px',
                fontWeight: 'bold',
                color: isFlashing ? '#ff0000' : '#ff6666',
                transition: 'color 0.5s ease',
                animation: 'blink 1s infinite'
              }}>
                Officer to retire on {retirementInfo?.month} {retirementInfo?.year}!
              </p>
            )}
          </div>
        </div>

        {/* Personal Details Card */}
        <IonCard style={{ margin: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <IonCardContent className='ion-no-padding'>
      <IonGrid>
        <IonRow>
          {/* First Column */}
          <IonCol size="12" sizeMd="6">
            {/* Buckle Number */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={idCardOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Buckle Number</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{(personalDetails.buckle_number == ' ' || personalDetails.buckle_number == '') ? 'N/A' : personalDetails.buckle_number}</p>
              </IonLabel>
            </IonItem>

            {/* Employee ID */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={idCardOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Employee ID (Sevaarth ID)</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{personalDetails.employee_id || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Current Address */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={homeOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Current Address</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{personalDetails.current_address || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Permanent Address */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={homeOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Permanent Address</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{personalDetails.permanent_address || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Education Details */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={schoolOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Education Details</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{personalDetails.education_details || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Email */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={mailOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Email</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{personalDetails.email || 'N/A'}</p>
              </IonLabel>
            </IonItem>
          </IonCol>

          {/* Second Column */}
          <IonCol size="12" sizeMd="6">
            {/* Mobile Number */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={callOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Mobile Number</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{personalDetails.mobile_number || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Gender */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={genderIcon} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Gender</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{personalDetails.gender || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Marital Status */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={heartOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Marital Status</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{personalDetails.marital_status || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Skills */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={hammerOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Skills</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{skills.join(', ') || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Driving Skills */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={carOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Driving Skills</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{drivingSkills.join(', ') || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Blood Group */}
            <IonItem lines="none" style={{ '--background': 'transparent' }}>
              <IonIcon icon={waterOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
              <IonLabel>
                <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Blood Group</h2>
                <p style={{ fontSize: '16px', color: '#333' }}>{personalDetails.blood_group || 'N/A'}</p>
              </IonLabel>
            </IonItem>

            {/* Spouse Details (conditionally rendered) */}
            {personalDetails.marital_status === 'Married' && (
              <IonItem lines="none" style={{ '--background': 'transparent' }}>
                <IonIcon icon={peopleOutline} slot="start" style={{ color: '#3880ff', marginRight: '10px' }} />
                <IonLabel>
                  <h2 style={{ color: '#3880ff', fontWeight: 'bold' }}>Spouse Details</h2>
                  <p style={{ fontSize: '16px', color: '#333' }}>
                    {personalDetails.spouse_government_employee === 'Yes'
                      ? 'Government Employee'
                      : 'Not a Government Employee'}
                  </p>
                </IonLabel>
              </IonItem>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCardContent>
  </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;