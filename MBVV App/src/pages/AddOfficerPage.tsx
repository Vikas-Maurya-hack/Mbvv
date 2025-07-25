import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  useIonToast,
  IonPopover,
  IonList
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { arrowBackOutline, personCircleOutline } from 'ionicons/icons';
import { useAuth } from '../AuthContext';

interface Officer {
  id?: string;
  buckle_number?: string;
  employee_id?: string;
  name?: string;
  email?: string;
  mobile_number?: string;
  blood_group?: string;
  gender?: string;
  marital_status?: string;
  current_address?: string;
  permanent_address?: string;
  education_details?: string;
  spouse_government_employee?: string;
  designation?: string;
  post?: string;
  date_of_joining?: string;
  date_of_retirement?: string;
  zone?: string;
  current_posting?: string;
  current_posting_tenure?: string;
  skills?: string;
  driving_skills?: string;
  rewards?: string;
  punishments?: string;
  specialNote?: string;
  image_path?: string;
  previous_postings?: string;

}

interface LocationState {
  officer?: Officer;
}

const AddOfficerPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [present] = useIonToast();
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [officerId, setOfficerId] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState<{ open: boolean; event: Event | undefined }>({
    open: false,
    event: undefined,
  });
  // State for form fields
  const [personalDetails, setPersonalDetails] = useState({
    buckleNumber: '',
    employee_id: '',
    name: '',
    email: '',
    mobileNumber: '',
    bloodGroup: '',
    gender: '',
    maritalStatus: '',
    currentAddress: '',
    permanentAddress: '',
    educationDetails: '',
    spouseGovernmentEmployee: '',
  });

  const [serviceDetails, setServiceDetails] = useState({
    designation: '',
    post: '',
    dateOfJoining: '',
    dateOfRetirement: '',
    zone: '',
    currentPosting: '',
    currentPostingTenure: '',
    skills: [] as string[],
    drivingSkills: [] as string[],
  });

  const [specialNote, setSpecialNote] = useState<string>('');
  const [rewards, setReward] = useState<string>('');
  const [punishments, setPunishments] = useState([
    { punishmentType: '', reason: '', dateOfPunishment: '' },
  ]);
  const [previousPostings, setPreviousPostings] = useState<{ posting: string; tenure: string }[]>(() => {
    if (!location.state?.officer?.previous_postings) return [];

    // If it's already an array, use it directly
    if (Array.isArray(location.state.officer.previous_postings)) {
      return location.state.officer.previous_postings;
    }

    // If it's a string, try to parse it
    if (typeof location.state.officer.previous_postings === 'string') {
      try {
        return JSON.parse(location.state.officer.previous_postings) || [];
      } catch {
        return [];
      }
    }

    // Default case
    return [];
  });
  const addPosting = () => {
    setPreviousPostings([...previousPostings, { posting: '', tenure: '' }]);
  };
  const removePosting = (index: number) => {
    const newPostings = [...previousPostings];
    newPostings.splice(index, 1);
    setPreviousPostings(newPostings);
  };

  // Check if we're in edit mode and load officer data
  useEffect(() => {
    if (location.state?.officer) {
      const officer = location.state.officer;
      setIsEditMode(true);
      setOfficerId(officer.id || null);

      // Set personal details
      setPersonalDetails({
        buckleNumber: officer.buckle_number || '',
        employee_id: officer.employee_id || '',
        name: officer.name || '',
        email: officer.email || '',
        mobileNumber: officer.mobile_number || '',
        bloodGroup: officer.blood_group || '',
        gender: officer.gender || '',
        maritalStatus: officer.marital_status || '',
        currentAddress: officer.current_address || '',
        permanentAddress: officer.permanent_address || '',
        educationDetails: officer.education_details || '',
        spouseGovernmentEmployee: officer.spouse_government_employee || '',
      });

      // Set service details
      setServiceDetails({
        designation: officer.designation || '',
        post: officer.post || '',
        dateOfJoining: officer.date_of_joining || '',
        dateOfRetirement: officer.date_of_retirement || '',
        zone: officer.zone || '',
        currentPosting: officer.current_posting || '',
        currentPostingTenure: officer.current_posting_tenure || '',
        skills: officer.skills ? JSON.parse(officer.skills) : [],
        drivingSkills: officer.driving_skills ? JSON.parse(officer.driving_skills) : [],
      });

      // Set other fields
      setSpecialNote(officer.specialNote || '');
      setReward(officer.rewards || '');

      // Set punishments if they exist
      if (officer.punishments) {
        try {
          const parsedPunishments = JSON.parse(officer.punishments);
          setPunishments(parsedPunishments.length > 0 ? parsedPunishments :
            [{ punishmentType: '', reason: '', dateOfPunishment: '' }]);
        } catch (e) {
          setPunishments([{ punishmentType: '', reason: '', dateOfPunishment: '' }]);
        }
      }
      if (officer.previous_postings) {
        try {
          const parsedPostings = typeof officer.previous_postings === 'string'
            ? JSON.parse(officer.previous_postings)
            : officer.previous_postings;
          setPreviousPostings(Array.isArray(parsedPostings) ? parsedPostings : []);
        } catch (e) {
          setPreviousPostings([]);
        }
      } else {
        setPreviousPostings([]);
      }

      // Set image if it exists
      if (officer.image_path) {
        setImagePath(officer.image_path);
        setPreviewImage(`https://mbvvworkforce.in/${officer.image_path}`);
      }
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalImagePath = imagePath;

      // Upload new image if one was selected but not yet uploaded
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await fetch('https://mbvvworkforce.in/api.php?action=uploadImage', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
          throw new Error(uploadResult.message || 'Image upload failed');
        }

        finalImagePath = uploadResult.path;
      }

      // Prepare officer data with image path
      const officerData = {
        ...personalDetails,
        ...serviceDetails,
        rewards,
        punishments,
        specialNote,
        imagePath: finalImagePath,
        previous_postings: previousPostings,
        // Include the officer ID in edit mode
        ...(isEditMode && { current_employee_id: location.state?.officer?.employee_id })
      };

      // Determine if we're adding or updating
      const apiUrl = isEditMode
        ? 'https://mbvvworkforce.in/api.php?action=updateOfficer'
        : 'https://mbvvworkforce.in/api.php?action=addOfficer';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(officerData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || (isEditMode ? 'Failed to update officer' : 'Failed to add officer'));
      }

      present({
        message: isEditMode ? 'Officer updated successfully!' : 'Officer added successfully!',
        duration: 2000,
        position: 'top'
      });

      history.push('/home');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = (error as Error).message ||
        (isEditMode ? 'An error occurred while updating the officer.' : 'An error occurred while adding the officer.');

      present({
        message: errorMessage,
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
    }
  };

  const addPunishment = () => {
    setPunishments([...punishments, { punishmentType: '', reason: '', dateOfPunishment: '' }]);
  };

  const removePunishment = (index: number) => {
    const newPunishments = [...punishments];
    newPunishments.splice(index, 1);
    setPunishments(newPunishments.length > 0 ? newPunishments :
      [{ punishmentType: '', reason: '', dateOfPunishment: '' }]);
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

  const handleBackClick = () => {
    history.push('/home');
  };
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IonIcon icon={arrowBackOutline} style={{ marginRight: '8px', cursor: 'pointer' }} onClick={handleBackClick} />
              <span style={{ textAlign: 'center', fontWeight: '600', color: '#edcc29' }}>
                {isEditMode ? 'Edit Officer' : 'Add Officer'}
              </span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader> */}
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
              style={{ marginRight: '8px', cursor: 'pointer', fontSize: '22px' }}
              onClick={handleBackClick}
            />

            {/* Title */}
            <IonTitle
              className="ion-text-center"
              style={{ textAlign: 'center', fontWeight: '600', color: '#edcc29' }}
            >
              <span style={{ textAlign: 'center', fontWeight: '600', color: '#edcc29' }}>
                {isEditMode ? 'Edit Officer' : 'Add Officer'}
              </span>
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
      <IonContent>
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
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Image Upload Section */}
          <IonCard>
            <IonCardContent>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {previewImage ? (
                  <img
                    src={previewImage}
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    alt="Preview"
                  />
                ) : imagePath ? (
                  <img
                    src={`https://mbvvworkforce.in/${imagePath}`}
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    alt="Current Officer"
                  />
                ) : (
                  <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    backgroundColor: '#f4f4f4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span>No Image</span>
                  </div>
                )}
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const selectedFile = e.target.files[0];
                      setImage(selectedFile);

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setPreviewImage(event.target.result as string);
                        }
                      };
                      reader.readAsDataURL(selectedFile);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <IonButton
                  fill="clear"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                  style={{ marginTop: '10px' }}
                >
                  {previewImage || imagePath ? 'Change Photo' : 'Upload Photo'}
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Personal Details Section */}
          <IonCard>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Buckle Number*</IonLabel>
                      <IonInput
                        type="text"
                        required
                        value={personalDetails.buckleNumber}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, buckleNumber: e.detail.value! })
                        }
                        // readonly={isEditMode}
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Employee ID*</IonLabel>
                      <IonInput
                        required
                        value={personalDetails.employee_id}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, employee_id: e.detail.value! })
                        }
                        
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="stacked">Full Name*</IonLabel>
                      <IonInput
                        required
                        value={personalDetails.name}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, name: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Email*</IonLabel>
                      <IonInput
                        type="email"
                        required
                        value={personalDetails.email}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, email: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Mobile Number*</IonLabel>
                      <IonInput
                        type="tel"
                        required
                        value={personalDetails.mobileNumber}
                        onIonInput={(e) => {
                          const sanitizedValue = e.detail.value!.replace(/[^\d,]/g, '');
                          setPersonalDetails({ ...personalDetails, mobileNumber: sanitizedValue });
                        }}
                        // Optional: Add input pattern for browsers that support it
                        inputmode="numeric"
                        pattern="[0-9,]*"
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12" sizeMd="4">
                    <IonItem>
                      <IonLabel position="stacked">Blood Group</IonLabel>
                      <IonSelect
                        interface="popover"
                        value={personalDetails.bloodGroup}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, bloodGroup: e.detail.value })
                        }
                      >
                        <IonSelectOption value="A+">A+</IonSelectOption>
                        <IonSelectOption value="A-">A-</IonSelectOption>
                        <IonSelectOption value="B+">B+</IonSelectOption>
                        <IonSelectOption value="B-">B-</IonSelectOption>
                        <IonSelectOption value="AB+">AB+</IonSelectOption>
                        <IonSelectOption value="AB-">AB-</IonSelectOption>
                        <IonSelectOption value="O+">O+</IonSelectOption>
                        <IonSelectOption value="O-">O-</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                  <IonCol size="12" sizeMd="4">
                    <IonItem>
                      <IonLabel position="stacked">Gender</IonLabel>
                      <IonSelect
                        interface="popover"
                        value={personalDetails.gender}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, gender: e.detail.value })
                        }
                      >
                        <IonSelectOption value="Male">Male</IonSelectOption>
                        <IonSelectOption value="Female">Female</IonSelectOption>
                        <IonSelectOption value="Other">Other</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                  <IonCol size="12" sizeMd="4">
                    <IonItem>
                      <IonLabel position="stacked">Marital Status</IonLabel>
                      <IonSelect
                        interface="popover"
                        value={personalDetails.maritalStatus}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, maritalStatus: e.detail.value })
                        }
                      >
                        <IonSelectOption value="N/A">N/A</IonSelectOption>
                        <IonSelectOption value="Single">Single</IonSelectOption>
                        <IonSelectOption value="Married">Married</IonSelectOption>
                        <IonSelectOption value="Divorced">Divorced</IonSelectOption>
                        <IonSelectOption value="Widowed">Widowed</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="stacked">Current Address</IonLabel>
                      <IonTextarea
                        rows={3}
                        value={personalDetails.currentAddress}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, currentAddress: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="stacked">Permanent Address</IonLabel>
                      <IonTextarea
                        rows={3}
                        value={personalDetails.permanentAddress}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, permanentAddress: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="stacked">Education Details</IonLabel>
                      <IonTextarea
                        rows={2}
                        value={personalDetails.educationDetails}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, educationDetails: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="stacked">Spouse Government Employee</IonLabel>
                      <IonSelect
                        interface="popover"
                        value={personalDetails.spouseGovernmentEmployee}
                        onIonChange={(e) =>
                          setPersonalDetails({ ...personalDetails, spouseGovernmentEmployee: e.detail.value })
                        }
                      >
                        <IonSelectOption value="Yes">Yes</IonSelectOption>
                        <IonSelectOption value="No">No</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Service Details Section */}
          <IonCard>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Designation*</IonLabel>
                      <IonInput
                        required
                        value={serviceDetails.designation}
                        onIonChange={(e) =>
                          setServiceDetails({ ...serviceDetails, designation: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Post*</IonLabel>
                      <IonInput
                        required
                        value={serviceDetails.post}
                        onIonChange={(e) =>
                          setServiceDetails({ ...serviceDetails, post: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Date of Joining*</IonLabel>
                      <IonInput
                        type="date"
                        required
                        value={serviceDetails.dateOfJoining}
                        onIonChange={(e) =>
                          setServiceDetails({ ...serviceDetails, dateOfJoining: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Date of Retirement</IonLabel>
                      <IonInput
                        type="date"
                        value={serviceDetails.dateOfRetirement}
                        onIonChange={(e) =>
                          setServiceDetails({ ...serviceDetails, dateOfRetirement: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    {/* <IonItem>
                      <IonLabel position="stacked">Zone</IonLabel>
                      <IonInput
                        value={serviceDetails.zone}
                        onIonChange={(e) =>
                          setServiceDetails({ ...serviceDetails, zone: e.detail.value! })
                        }
                      />
                    </IonItem> */}

                    <IonItem>
                      <IonLabel position="stacked">Zone</IonLabel>
                      <IonSelect
                        interface="popover"
                        value={serviceDetails.zone}
                        onIonChange={(e) =>
                          setServiceDetails({ ...serviceDetails, zone: e.detail.value! })
                        }
                      >
                        <IonSelectOption value="Zone 1">Zone 1</IonSelectOption>
                        <IonSelectOption value="Zone 2">Zone 2</IonSelectOption>
                        <IonSelectOption value="Zone 3">Zone 3</IonSelectOption>
                        <IonSelectOption value="Crime Branch">Crime Branch</IonSelectOption>
                        <IonSelectOption value="Traffic Branch">Traffic Branch</IonSelectOption>
                        <IonSelectOption value="Head Quarter">Head Quarter</IonSelectOption>
                        <IonSelectOption value="Others">Others</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">Current Posting</IonLabel>
                      <IonInput
                        value={serviceDetails.currentPosting}
                        onIonChange={(e) =>
                          setServiceDetails({ ...serviceDetails, currentPosting: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="stacked">Current Posting Tenure</IonLabel>
                      <IonInput
                        value={serviceDetails.currentPostingTenure}
                        onIonChange={(e) =>
                          setServiceDetails({ ...serviceDetails, currentPostingTenure: e.detail.value! })
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="stacked">Skills (comma separated)</IonLabel>
                      <IonInput
                        value={serviceDetails.skills.join(', ')}
                        onIonChange={(e) =>
                          setServiceDetails({ ...serviceDetails, skills: e.detail.value!.split(',').map(s => s.trim()) })
                        }
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="stacked">Driving Skills</IonLabel>
                      <IonSelect
                        multiple={true}
                        interface="popover"
                        value={serviceDetails.drivingSkills}
                        onIonChange={(e) => {
                          setServiceDetails({
                            ...serviceDetails,
                            drivingSkills: e.detail.value as string[]
                          });
                        }}
                      >
                        <IonSelectOption value="2 Wheeler">2 Wheeler</IonSelectOption>
                        <IonSelectOption value="4 Wheeler">4 Wheeler</IonSelectOption>
                        <IonSelectOption value="Heavy Vehicle">Heavy Vehicle</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardContent>
              <h2 style={{ marginBottom: '15px', color: '#3880ff' }}>Previous Postings</h2>
              {previousPostings.map((posting, index) => (
                <IonGrid key={index}>
                  <IonRow>
                    <IonCol size="10">
                      <IonRow>
                        <IonCol size="12" sizeMd="6">
                          <IonItem>
                            <IonLabel position="stacked">Posting</IonLabel>
                            <IonInput
                              value={posting.posting}
                              onIonInput={(e) => {
                                const newPostings = [...previousPostings];
                                newPostings[index].posting = e.detail.value!;
                                setPreviousPostings(newPostings);
                              }}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <IonItem>
                            <IonLabel position="stacked">Tenure</IonLabel>
                            <IonInput
                              value={posting.tenure}
                              onIonInput={(e) => {
                                const newPostings = [...previousPostings];
                                newPostings[index].tenure = e.detail.value!;
                                setPreviousPostings(newPostings);
                              }}
                            />
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonCol>
                    <IonCol size="2" className="ion-align-self-center">
                      <IonButton
                        color="danger"
                        fill="clear"
                        onClick={() => removePosting(index)}
                      >
                        Remove
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              ))}
              <div className="center-button">
                <IonButton expand="block" onClick={addPosting} className="sub-button">
                  + Add Previous Posting
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
          {/* Rewards Section */}
          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Rewards</IonLabel>
                <IonInput
                  type="number"

                  value={rewards}
                  onIonChange={(e) => setReward(e.detail.value!)}
                  placeholder="Enter any rewards received by the officer"
                />
              </IonItem>
            </IonCardContent>
          </IonCard>

          {/* Punishments Section */}
          <IonCard>
            <IonCardContent>
              {punishments.map((punishment, index) => (
                <IonGrid key={index}>
                  <IonRow>
                    <IonCol size="10">
                      <IonRow>
                        <IonCol size="12" sizeMd="4">
                          <IonItem>
                            <IonLabel position="stacked">Punishment Type</IonLabel>
                            <IonInput
                              value={punishment.punishmentType}
                              onIonChange={(e) => {
                                const newPunishments = [...punishments];
                                newPunishments[index].punishmentType = e.detail.value!;
                                setPunishments(newPunishments);
                              }}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <IonItem>
                            <IonLabel position="stacked">Reason</IonLabel>
                            <IonInput
                              value={punishment.reason}
                              onIonChange={(e) => {
                                const newPunishments = [...punishments];
                                newPunishments[index].reason = e.detail.value!;
                                setPunishments(newPunishments);
                              }}
                            />
                          </IonItem>
                        </IonCol>
                        <IonCol size="12" sizeMd="4">
                          <IonItem>
                            <IonLabel position="stacked">Date of Punishment</IonLabel>
                            <IonInput
                              type="date"
                              value={punishment.dateOfPunishment}
                              onIonChange={(e) => {
                                const newPunishments = [...punishments];
                                newPunishments[index].dateOfPunishment = e.detail.value!;
                                setPunishments(newPunishments);
                              }}
                            />
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonCol>
                    <IonCol size="2" className="ion-align-self-center">
                      <IonButton
                        color="danger"
                        fill="clear"
                        onClick={() => removePunishment(index)}
                      >
                        Remove
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              ))}
              <div className="center-button">
                <IonButton expand="block" onClick={addPunishment} className="sub-button">
                  + Add Punishment Record
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Special Note Section */}
          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Special Note</IonLabel>
                <IonTextarea
                  rows={3}
                  value={specialNote}
                  onIonChange={(e) => setSpecialNote(e.detail.value!)}
                  placeholder="Enter any special notes about the officer"
                />
              </IonItem>
            </IonCardContent>
          </IonCard>

          {/* Submit Buttons */}
          <div className="center-button" style={{ marginTop: '20px' }}>
            <IonButton expand="block" onClick={handleBackClick} className="sub-button">
              Cancel
            </IonButton>
            <IonButton expand="block" type="submit" className="sub-button">
              {isEditMode ? 'Update Officer' : 'Add Officer'}
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddOfficerPage;