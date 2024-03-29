import React from 'react';
import jwt_decode from 'jwt-decode';

const GoogleSignIn = ({ setUser }) => {

 
function sendTokenToServer(idToken) {
  fetch('http://localhost:5002/verifyToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: idToken }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Token verified:', data);
    setUser(data.user);
    document.getElementById("signInDiv").hidden = true;
    localStorage.setItem('jwtToken', idToken); 
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function handleCallbackResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);
  sendTokenToServer(response.credential);
}

  React.useEffect(() => {
    const initGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: "845464112864-v3o86f5qj5mpbt4jf7qf8ji2p6qjj6lt.apps.googleusercontent.com",
          callback: handleCallbackResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          { theme: "outline", size: "large" }
        );

        window.google.accounts.id.prompt();
      } else {
        setTimeout(initGoogleSignIn, 100);
      }
    };

    initGoogleSignIn();
  }, []);

  return (
    <div id="signInDiv"></div>
  );
};

export default GoogleSignIn;
