import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import './App.css';
import PageSwitcher from './components/PageSwitcher';

function App() {

  const responseGoogle = async (response) => {
    if (response.error) {
      console.error("Google Login Error:", response.error);
      return;
    }
    // Send the received token to the Flask backend for validation
    try {
      const result = await axios.post("http://localhost:5002/auth/google", {
        token: response.tokenId,
      });
      console.log("Login success:", result.data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <GoogleLogin
          clientId={"845464112864-v3o86f5qj5mpbt4jf7qf8ji2p6qjj6lt.apps.googleusercontent.com"}
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
      </div>
      <PageSwitcher />
    </div>
  );
}

export default App;