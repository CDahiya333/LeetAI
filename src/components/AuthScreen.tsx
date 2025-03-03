import React, { useState } from 'react';
import { SupabaseClient, User } from '@supabase/supabase-js';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  supabase: SupabaseClient;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, supabase }) => {
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
  };

  return (
    <div className="h-full">
      {showLogin ? (
        <LoginScreen 
          onLogin={onLogin} 
          onSignupClick={handleSignupClick} 
          supabase={supabase} 
        />
      ) : (
        <SignupScreen 
          onSignup={onLogin} 
          onLoginClick={handleLoginClick} 
          supabase={supabase} 
        />
      )}
    </div>
  );
};

export default AuthScreen;