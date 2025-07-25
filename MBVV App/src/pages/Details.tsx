import { Redirect, Route, useLocation, useRouteMatch } from 'react-router-dom';
import {
  IonApp,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { alertCircleOutline, bookOutline, briefcaseOutline, closeOutline, ellipse, gift, giftOutline, medalOutline, personCircleOutline, square, triangle } from 'ionicons/icons';
import Tab1 from '../pages/Tab1';
import Tab2 from '../pages/Tab2';
import Tab3 from '../pages/Tab3';
import Tab4 from './Tab4';
import person from '../assets/person-protection-security-svgrepo-com.svg';
import profile from '../assets/profile-user-svgrepo-com.svg';
import reward from '../assets/badge-reward-svgrepo-com.svg';
import warn from '../assets/warning-alert-svgrepo-com.svg';
import note from '../assets/note-notepad-svgrepo-com.svg';
import './Details.css';
import Tab5 from './Tab5';
const Details = () => {
  const location = useLocation();
  const { path } = useRouteMatch();
  return (
    // <IonReactRouter>
       
    <IonTabs>
      <IonRouterOutlet>
      <Route path={`${path}/tab1`} render={() => <Tab1 />} />
      <Route path={`${path}/tab2`} render={() => <Tab2 />} />
        <Route path={`${path}/tab3`} render={() => <Tab3 />} />
        <Route path={`${path}/tab4`} render={() => <Tab4 />} />
        <Route path={`${path}/tab5`} render={() => <Tab5 />} />
        <Route exact path={path}>
          <Redirect to={`${path}/tab1`} />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom" style={{ '--background': '#003071',
          '--color': 'white',
          '--color-selected': 'rgb(237, 204, 41)',
          padding: '10px',
          borderTop: 'none' }}>
        <IonTabButton tab="tab1" href="/details/tab1" style={{height:'auto'}}>
          {/* <IonIcon aria-hidden="true" icon={personCircleOutline} /> */}
          <img src={profile} alt="person" style={{width:'30px',height:'30px',marginTop:'-5px'}}/>
          <IonLabel style={{marginBottom:'0',fontWeight:'600',fontSize:'14px'}}>Personal <br/>Details</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/details/tab2" style={{height:'auto'}}>
          {/* <IonIcon aria-hidden="true" icon={briefcaseOutline} /> */}
          <img src={person} alt="person" style={{width:'30px',height:'30px'}}/>
          <IonLabel style={{marginBottom:'0',fontWeight:'600',fontSize:'14px'}}>Service<br/>Details</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/details/tab3" style={{height:'100px'}}>
          {/* <IonIcon aria-hidden="true" icon={medalOutline} /> */}
          <img src={reward} alt="person" style={{width:'30px',height:'30px',marginTop:'-5px'}}/>
          <IonLabel style={{fontWeight:'600',fontSize:'14px'}}>Rewards</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/details/tab4" style={{height:'100px'}}>
          {/* <IonIcon aria-hidden="true" icon={alertCircleOutline} /> */}
          <img src={warn} alt="person" style={{width:'30px',height:'30px',marginTop:'-5px'}}/>
          <IonLabel style={{fontWeight:'600',fontSize:'14px'}}>Reprisal</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab5" href="/details/tab5" style={{height:'auto'}}>
          {/* <IonIcon aria-hidden="true" icon={bookOutline} /> */}
          <img src={note} alt="person" style={{width:'30px',height:'30px',marginTop:'-5px'}}/>
          <IonLabel style={{marginBottom:'0',fontWeight:'600',fontSize:'14px'}}>Special<br/>Note</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  // </IonReactRouter>
  )
}

export default Details