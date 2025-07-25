import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonText,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../assets/lo.png'; // Ensure you import the logo
import './style.css'; // Ensure your CSS file is imported
import blink from '../assets/BLINK_TECHNOLOGIES_LOGO_1__page-0001-removebg-preview.png';
import { useAuth } from '../AuthContext';
import bg from '../assets/3409297.jpg';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const { login } = useAuth();
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      const badgeContainer = document.getElementById("wcb");
      if (badgeContainer) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/website-carbon-badges@1.1.3/b.min.js";
        script.defer = true;
        document.body.appendChild(script);
        clearInterval(interval); // Stop checking once script is added
      }
    }, 500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // Clear form fields when component mounts
    setUsername('');
    setPassword('');
    setError('');
  }, [location.key]);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://mbvvworkforce.in/api.php?action=login', {
        method: 'POST',
        // credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save user data to localStorage or context
        // localStorage.setItem('user', JSON.stringify(data.data.user));
        login(data.data.user);
        history.push('/home');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <IonPage style={{
      'background': `url(${bg}) no-repeat center center/cover`
    }}>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: 'center' }}>Login</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent className="ion-padding login-content">
        <div style={{ color: "white" }} className='ion-text-center'><h1 className='text-mira'><b>मिरा भाईंदर वसई विरार पोलीस आयुक्तालय </b></h1>
          <h1 style={{margin:'0'}} className='text-mira'><b>Mira Bhayandar Vasai Virar Police Commissionerate</b></h1>
        </div>
        {/* Logo at the top center */}
        <div className="logo-container">
          <img src={logo} alt="Profile" className="logo" />
        </div>

        {/* Login Form */}
        <IonCard className="login-card">
          <IonCardContent>
            <div className='ion-text-center'>
              <p className='loginText'>Login</p>
            </div>

            <IonItem style={{ borderRadius: '20px' }}>
              <IonInput
                label="Username"
                labelPlacement="floating"
                value={username}
                onIonInput={(e) => setUsername(e.detail.value!)}
              />
            </IonItem>
            <IonItem style={{ borderRadius: '20px', marginTop: '20px' }}>
              <IonInput
                type="password"
                label="Password"
                labelPlacement="floating"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
              />
            </IonItem>
            {error && <IonText color="danger" className="error-message">{error}</IonText>}
            <div className="center-button">
              <IonButton expand="block" onClick={handleLogin} className="login-button">
                Login
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>


        <div style={{
          position: 'relative',
          margin: '20px auto',
          marginTop: '35px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}>

          <img
            src="https://app.greenweb.org/api/v3/greencheckimage/mbvvworkforce.in?nocache=true"
            alt="This website runs on green hosting - verified by thegreenwebfoundation.org"
            style={{
              width: '200px',
              height: '95px',
              display: 'block',
              padding: '0 4px'
            }}
          />
        </div>
       
        <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: '30px',
}}>
  {/* Carbon Badge on the left */}
  <div
    id="wcb"
    className="carbonbadge"
    style={{
      zIndex: 1000,
      textAlign: 'center',
      flex: 1, // Takes available space
      
    }}
  ></div>

  {/* Blink Logo with circular background on the right */}
  
</div>
<div style={{
    position: 'relative',
  justifyContent: 'center',
  display: 'flex',
  }}>
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      marginRight: '15px', 
    }}>
      <img 
        src={blink} 
        style={{
          width: '80px', // Slightly reduced to fit inside circle
          height: 'auto',
          padding: '0 4px',
          marginTop:'5px'
        }} 
        alt="Blink Technologies Logo"
      />
    </div>
  </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;