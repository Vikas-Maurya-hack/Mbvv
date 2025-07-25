import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonText, IonIcon, IonList, IonAvatar, IonPopover } from '@ionic/react';
import { add, notificationsOutline, search, personCircleOutline, pencil } from 'ionicons/icons';
import logo from '../assets/lo.png';
import pol from '../assets/image.png';
import blink from '../assets/BLINK_TECHNOLOGIES_LOGO_1__page-0001-removebg-preview.png';
import './style.css';
import { useHistory, useLocation } from 'react-router-dom';
import { useOfficer } from '../OfficerContext';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useAuth } from '../AuthContext';

const Home: React.FC = () => {
  const [buckleNo, setBuckleNo] = useState<string>('');
  const [officerName, setOfficerName] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isShowAllClicked, setIsShowAllClicked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const history = useHistory();
  const location = useLocation();
  const [showPopover, setShowPopover] = useState<{ open: boolean; event: Event | undefined }>({
    open: false,
    event: undefined,
  });
  const { setOfficer } = useOfficer();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // useEffect(() => {
  //   setStatusBarStyleLight();
  // }, []);

  // const setStatusBarStyleLight = async () => {
  //   await StatusBar.setStyle({ style: Style.Dark });
  //   await StatusBar.setBackgroundColor({ color: '#bc6029' });
  // };
  const { logout } = useAuth();

  useEffect(() => {
    setBuckleNo('');
    setOfficerName('');
    setSearchResults([]);
    setHasSearched(false);
    setIsShowAllClicked(false);
  }, [location.pathname]);

  const handleLogout = React.useCallback(() => {
    // Close popover first
    setShowPopover({ open: false, event: undefined });

    // Perform logout
    logout();

    // Use setTimeout to break the synchronous chain
    setTimeout(() => {
      history.replace('/');
    }, 100);
  }, [logout, history]);
  const handleShowAll = async () => {
    try {
      const response = await fetch('https://mbvvworkforce.in/api.php?action=getOfficers');
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.officers); // Set all officers as search results
        setHasSearched(true); // Indicate that a search has been performed
        setIsShowAllClicked(true);
      } else {
        setErrorMessage('Failed to fetch officers.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleBuckleNoChange = (value: string) => {
    setBuckleNo(value);
    setOfficerName(''); // Clear officerName
  };

  const handleOfficerNameChange = (value: string) => {
    setOfficerName(value);
    setBuckleNo(''); // Clear buckleNo
  };

  const handleAddOfficer = () => {
    // history.replace('/add'); // Navigate to the Add Officer page
    window.location.href = '/add';
  };

  const handleSearch = async () => {
    if (!buckleNo && !officerName) {
      setErrorMessage('Please enter a Buckle number or Name.');
      return;
    }
    setErrorMessage('');

    try {
      const response = await fetch('https://mbvvworkforce.in/api.php?action=getOfficers');
      const data = await response.json();

      if (data.success) {
        const officers = data.officers;
        const results = officers.filter((officer: any) => {
          if (buckleNo) {
            return officer.buckle_number?.toLowerCase().includes(buckleNo.toLowerCase()) ||
              officer.employee_id?.toLowerCase().includes(buckleNo.toLowerCase());
          } else if (officerName) {
            // Split search term into parts and check if all parts exist in the name
            const searchTerms = officerName.toLowerCase().split(/\s+/).filter(term => term);
            const officerNameLower = officer.name?.toLowerCase() || '';
            return searchTerms.every(term => officerNameLower.includes(term));
          }
          return false;
        });

        setSearchResults(results);
        setHasSearched(true);
        setIsShowAllClicked(false);
      } else {
        setErrorMessage('Failed to fetch officers.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleOfficerClick = (officer: any, isEdit: boolean = false) => {
    setOfficer(officer);
    if (isEdit) {
      history.push('/add', { officer });
    } else {
      history.push(`/details/tab1`, { officer });
    }
  };
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;
  return (
    <IonPage>

      <IonHeader style={{ overflow: 'visible' }}> {/* Add this to prevent cutting */}
        <div style={{
          position: 'relative',
          minHeight: '60px', /* Ensure enough space */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 60px' /* Left padding matches logo width */
        }}>
          {/* Logo positioned at left center */}
          <img
            src={logo}
            alt="Logo"
            style={{
              height: '55px',
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2
            }}
          />

          <div className='ion-text-center'>
            <h4 style={{ fontSize: '16px', margin: '0', position: 'relative', zIndex: 1 }}>
              <b>मिरा भाईंदर वसई विरार पोलीस आयुक्तालय</b>
            </h4>
            <h4 style={{ fontSize: '16px', margin: '0', position: 'relative', zIndex: 1 }}>
              <b>Mira Bhayandar Vasai Virar Police Commissionerate</b>
            </h4>
          </div>
        </div>

        <IonToolbar style={{ position: 'relative', zIndex: 3 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0 16px'
          }}>
            <div style={{ width: '50px' }}></div> {/* Spacer */}

            <IonTitle style={{
              textAlign: 'center',
              fontWeight: '700',
              color: '#edcc29',
              position: 'relative'
            }}>
              Search
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
                <b style={{color:"blue"}}> {typeof user.username === 'string' && user.username.length > 0 
          ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
          : 'User' }</b>
              </span>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
        <IonItem className="ion-margin-top">
          <IonInput
            value={buckleNo}
            onIonInput={(e) => setBuckleNo(e.detail.value!)}
            placeholder="Enter Buckle No or Employee ID"
            label="Buckle No / Employee ID"
            labelPlacement="floating"
          />
        </IonItem>
        <IonText color="primary" className="ion-text-center">
          <h3>OR</h3>
        </IonText>
        <IonItem>
          <IonInput
            value={officerName}
            onIonInput={(e) => handleOfficerNameChange(e.detail.value!)}
            label="Name"
            labelPlacement="floating"
            placeholder="Enter Name"
          />
        </IonItem>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <IonButton expand="block" onClick={handleSearch} className="ion-margin-top searchBtn">
            <IonIcon icon={search} slot="start" />
            Search
          </IonButton>
          {role === 'admin' && (
            <IonButton expand="block" onClick={handleAddOfficer} className="ion-margin-top searchBtn">
              <IonIcon icon={add} slot="start" />
              Add Details
            </IonButton>
          )}
        </div>


        {hasSearched && searchResults.length > 0 && (
          <IonText color="primary" className="ion-text-start">
            <h5>{isShowAllClicked ? 'All Results:' : 'Search Results:'}</h5>
          </IonText>
        )}
        {searchResults.map((officer, index) => (
          <IonItem key={index} onClick={() => handleOfficerClick(officer)} style={{ cursor: 'pointer' }}>
            <IonAvatar slot="start">
              <img src={officer.image_path ? `https://mbvvworkforce.in/${officer.image_path}` : pol} onError={(e) => {
                // Fallback to default image if the API image fails to load
                (e.target as HTMLImageElement).src = pol;
              }} alt="Profile" style={{ width: '150px' }} />
            </IonAvatar>
            <IonLabel>
              <h2 style={{ fontWeight: '500' }}>{officer.buckle_number}</h2>
              <p>{officer.name}</p>
            </IonLabel>
            {role === 'admin' && (
              <IonButton
                slot="end"
                fill="clear"
                style={{ fontSize: '20px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOfficerClick(officer, true);
                }}
              >
                <IonIcon icon={pencil} slot="icon-only" />
              </IonButton>
            )}
          </IonItem>
        ))}
        {errorMessage && (
          <p className="ion-text-center" style={{ textAlign: 'center', fontWeight: '600', color: 'red' }}>
            {errorMessage}
          </p>
        )}
        {hasSearched && searchResults.length === 0 && (
          <p className="ion-text-center" style={{ textAlign: 'center', fontWeight: '600', color: 'red' }}>
            No details found.
          </p>
        )}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
          {/* <img src={blink} style={{ width: '80px' }} /> */}
          <p>Version: 1.0.0</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;