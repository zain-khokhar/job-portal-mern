import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import { getCurrentUser } from "../services/authService";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const {user} = useUser()
    const {getToken} = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    });

    const [isSearched, setIsSearched] = useState(false); // Changed setter to camelCase

    const [jobs , setJobs] = useState([]);

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userData,setUserData] = useState(null)
    const [userApplications,setUserApplications] = useState(null)
    const [applications, setApplications] = useState([]);

    // Initialize currentUser from localStorage
    useEffect(() => {
        try {
            const storedUserData = getCurrentUser();
            console.log("AppContext - Stored user data:", storedUserData); // Debug log
            
            if (storedUserData && storedUserData.user) {
                // Our normalized response has { success: true, token: "...", user: {...} }
                const userToSet = {
                    ...storedUserData.user,
                    role: storedUserData.user.role || 'user' // Ensure role exists
                };
                console.log("AppContext - Setting currentUser to:", userToSet); // Debug log
                setCurrentUser(userToSet);
            }
        } catch (error) {
            console.error("Error initializing user from localStorage:", error);
            // Clear potentially corrupted data
            localStorage.removeItem('user');
        }
    }, []);

    // Function to Fetch Jobs data
    const fetchJobs = async () => {
      try {
        
        const {data} = await axios.get(backendUrl + '/api/jobs')

        if(data.success){
          setJobs(data.jobs)
          console.log(data.jobs);
        }
        else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }  
      
    }



// Function to fetch User Data
const fetchUserData = async () => {
  try {
    
    const token = await getToken();

    const {data} = await axios.get(backendUrl+"/api/users/user",
      {headers: {Authorization: `Bearer ${token}`}})
    
      if(data.success){
        setUserData(data.user);
      }else{
        toast.error(data.message)
      }
  } catch (error) {
    toast.error(error.message)
  }
}

// Function to fetch User's  Applied data
  const fetchUserApplications = async () =>{
    try {
      
      const token = await getToken()

      const {data} = await axios.get(backendUrl+"/api/users/applications",
        {headers: {Authorization: `Bearer ${token}`}}
      )

      if(data.success){
        setUserApplications(data.applications)
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to fetch user-specific applications
  const fetchApplications = async () => {
    try {
      if (!currentUser?.email) {
        return;
      }
      
      const {data} = await axios.get(backendUrl + `/api/applications/user/${currentUser.email}`)
      
      if(data.success){
        setApplications(data.applications)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log('No applications found for user')
      setApplications([])
    }
  }

useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (currentUser?.email) {
      fetchApplications();
    }
  }, [currentUser]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);
  

    
    const value = {
        searchFilter, setSearchFilter,
        setIsSearched, isSearched,
        jobs, setJobs,
        showAuthModal, setShowAuthModal,
        currentUser, setCurrentUser,
        backendUrl, 
        userData, setUserData,
        userApplications, setUserApplications,
        applications, setApplications,
        fetchUserData,
        fetchUserApplications,
        fetchApplications
    }

    

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}