import React, { createContext, useContext, useState, useEffect } from 'react';

interface Officer {
  id?: number;
  buckle_number?: string;
  employee_id?: string;
  name?: string;
  email?: string;
  mobile_number?: string;
  blood_group?: string;
  gender?: string;
  marital_status?: string;
  skills?: string[];
  driving_skills?: string[];
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
  previous_postings?: { posting: string; tenure: string }[];
  rewards?: string;
  punishments?: { punishmentType: string; reason: string; dateOfPunishment: string }[];
  specialNote?: string;
  image_path?: string;
}

interface OfficerContextType {
  officer: Officer | null;
  setOfficer: (officer: Officer | null) => void;
  loading: boolean;
}

const OfficerContext = createContext<OfficerContextType>({
  officer: null,
  setOfficer: () => {},
  loading: true,
});

export const useOfficer = () => useContext(OfficerContext);

interface OfficerProviderProps {
  children: React.ReactNode;
  officerId?: number;
}

export const OfficerProvider: React.FC<OfficerProviderProps> = ({ children,officerId }) => {
  const [officer, setOfficer] = useState<Officer | null>(() => {
    // Initialize state with data from localStorage if available
    const savedOfficer = localStorage.getItem('officer');
    return savedOfficer ? JSON.parse(savedOfficer) : null;
  });
  const [loading, setLoading] = useState(true);

  // Fetch officer data from the API on component mount
  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        if (!officerId) {
          setLoading(false);
          return;
        }
        const response = await fetch('https://mbvvworkforce.in/api.php?action=getOfficers');
        const data = await response.json();
  
        if (data.success && data.officers.length > 0) {
          const officerData = data.officers[0];
  
          // Parse JSON fields
          if (officerData.previous_postings) {
            officerData.previous_postings = typeof officerData.previous_postings === 'string'
              ? JSON.parse(officerData.previous_postings)
              : officerData.previous_postings;
          } else {
            officerData.previous_postings = [];
          }
            
            officerData.punishments = officerData.punishments
            ? JSON.parse(officerData.punishments)
            : [];
  
          setOfficer(officerData);
        } else {
          console.error('No officer data found');
        }
      } catch (error) {
        console.error('Error fetching officer data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (!officer) {
      fetchOfficerData();
    } else {
      setLoading(false);
    }

  }, [officerId]);

  // Save officer data to local storage whenever it changes
  useEffect(() => {
    if (officer) {
      localStorage.setItem('officer', JSON.stringify(officer));
    } else {
      localStorage.removeItem('officer');
    }
  }, [officer]);

  return (
    <OfficerContext.Provider value={{ officer, setOfficer, loading }}>
      {children}
    </OfficerContext.Provider>
  );
};