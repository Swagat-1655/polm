import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { utils } from '../api';

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #0f2c4c 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 2px solid #10b981;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  gap: 10px;

  .logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(45deg, #10b981, #34d399);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

const NavLink = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent'};
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 0;
  position: relative;
  height: 70px;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(16, 185, 129, 0.1)'};
  }

  &:first-child {
    border-radius: 0;
  }

  &:last-child {
    border-radius: 0;
  }

  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #10b981;
    }
  `}
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const OnlineStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.online ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  border: 1px solid ${props => props.online ? '#10b981' : '#ef4444'};
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.online ? '#10b981' : '#ef4444'};
    animation: ${props => props.online ? 'pulse 2s infinite' : 'none'};
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const ExportButton = styled.button`
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #4f46e5, #4338ca);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
`;

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isOnline, setIsOnline] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    'Dashboard',
    'Live Monitoring',
    'Analytics',
    'Alerts',
    'Settings'
  ];

  // Check server status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const status = await utils.checkServerStatus();
      setIsOnline(status);
    };

    checkStatus(); // Check immediately
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      setActiveTab('Dashboard');
    } else if (path.includes('live-monitoring')) {
      setActiveTab('Live Monitoring');
    } else if (path.includes('analytics')) {
      setActiveTab('Analytics');
    } else if (path.includes('alerts')) {
      setActiveTab('Alerts');
    } else if (path.includes('settings')) {
      setActiveTab('Settings');
    }
  }, [location]);

  const handleNavClick = (item) => {
    setActiveTab(item);
    
    // Navigate to appropriate route
    switch (item) {
      case 'Dashboard':
        navigate('/dashboard');
        break;
      case 'Live Monitoring':
        navigate('/live-monitoring');
        break;
      case 'Analytics':
        navigate('/analytics');
        break;
      case 'Alerts':
        navigate('/alerts');
        break;
      case 'Settings':
        navigate('/settings');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleExportData = () => {
    // Implement data export functionality
    console.log('Exporting data...');
    // You can integrate with your backend API to export data
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo>
          <div className="logo-icon">⚡</div>
          PowerLine Monitor
        </Logo>

        <NavLinks>
          {navItems.map((item) => (
            <NavLink
              key={item}
              active={activeTab === item}
              onClick={() => handleNavClick(item)}
            >
              {item}
            </NavLink>
          ))}
        </NavLinks>

        <StatusSection>
          <OnlineStatus online={isOnline}>
            <div className="status-dot"></div>
            {isOnline ? 'Online' : 'Offline'}
          </OnlineStatus>
          
          <ExportButton onClick={handleExportData}>
            Export Data
          </ExportButton>
        </StatusSection>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
