import { useAuth } from '../contexts/AuthContext';

export const Application = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="app-container">
      <h1 className="welcome-message">Welcome to the application.</h1>
      {user && (
        <div style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          <p>Logged in as: {user.email}</p>
          <p>Name: {user.name}</p>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="logout-button"
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  );
};

