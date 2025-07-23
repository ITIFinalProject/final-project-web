import React from 'react';
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        `}
      </style>
      {/* <img
        src="https://illustrations.popsy.co/white/resistance-monochrome.svg"
        alt="Page not found"
        style={styles.image}
      /> */}
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/" style={styles.button}>Back to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: `'Inter', sans-serif`,
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9f3ef', // --primary-light
    color: '#1b3c53',           // --primary-dark
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxWidth: '350px',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '15px',
    color: '#1b3c53', // --primary-dark
  },
  message: {
    fontSize: '1.5rem',
    fontWeight: '900',
    marginBottom: '25px',
    color: '#456882', // --primary-blue
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#456882', // --primary-blue
    color: '#ffffff', // --white
    textDecoration: 'none',
    borderRadius: '8px',
  }
};

export default NotFound;
