import {createContext,useReducer,useMemo,useContext,useState,useRef} from 'react';
import { Dimensions,StatusBar } from 'react-native';
const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    userId:null,
    mpeop:[],
    peop:[]
  };
export const AuthContext = createContext();
import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV({
  id: `storage`,
  encryptionKey: 'v1'
})
export const useAuthorization = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('Error');
      }
      return context;
  };
export function Auth({children,socketi}){
    const [songdetails,setsongdetails]= useState(null)
    const server = "https://smartifier.onrender.com"
    const socket = useRef(null)
    const socketbackup = useRef(null)
    const rtcm =useRef()
    const fl =useRef()
    const [nkvt,setnkvt]=useState([])
    const [csong,setcsong]=useState(undefined)
    const [state, dispatch] = useReducer(
        (prevState, action) => {
          switch (action.type) {
            case 'RESTORE_TOKEN':
              return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
              };
            case 'SIGN_IN':
              return {
                ...prevState,
                isSignout: false,
                userId:action.id,
                userToken: action.token,
                userName:action.name,
                isLoading: false,
              };
              case 'mpeop':
              return {
                ...prevState,
                isSignout: false,
                mpeop:action.data,
                isLoading: false,
              };
              case 'peop':
                return {
                  ...prevState,
                  isSignout: false,
                  peop:action.data,
                  isLoading: false,
                };
            case 'SIGN_OUT':
              return {
                ...prevState,
                userId:null,
                isSignout: true,
                userToken: null,
                isLoading: false,
              };
          }
        },initialLoginState
      );
    
      const authContext = useMemo(
        () => ({
          signIn: async (data) => {
            
            // In a production app, we need to send some data (usually username, password) to server and get a token
            // We will also need to handle errors if sign in failed
            // After getting token, we need to persist the token using `SecureStore`
            // In the example, we'll use a dummy token
    
            dispatch({ type: 'SIGN_IN', token: data.userToken,id:data.userId,name:data.userName});
          },
          signOut: () => dispatch({ type: 'SIGN_OUT' }),
          setmpeop: (data) =>{
           
            
            dispatch({ type:'mpeop',data})},
          setpeop: (data) => dispatch({ type:'peop',data}),
          signUp: async (data) => {
            // In a production app, we need to send user data to server and get a token
            // We will also need to handle errors if sign up failed
            // After getting token, we need to persist the token using `SecureStore`
            // In the example, we'll use a dummy token
    
            dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
          },
        }),
        []
      );
return(
<AuthContext.Provider value={{fl,csong,setcsong,nkvt,setnkvt,songdetails,setsongdetails}}>
{children}
</AuthContext.Provider>
)
}