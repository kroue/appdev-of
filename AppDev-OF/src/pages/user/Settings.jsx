import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoInformationCircleOutline, IoDocumentTextOutline, IoLockClosedOutline, IoHelpCircleOutline, IoChatbubbleEllipsesOutline, IoBugOutline } from 'react-icons/io5';
import '../../styles/Settings.css';

const settingsIcons = [
  { label: 'About the App', icon: <IoInformationCircleOutline size={30} />, route: '/about' },
  { label: 'Terms of Service', icon: <IoDocumentTextOutline size={30} />, route: '/terms' },
  { label: 'Privacy Policy', icon: <IoLockClosedOutline size={30} />, route: '/settings' }, // Update route if needed
  { label: 'App Version', icon: <IoInformationCircleOutline size={30} /> },
];

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="settings">
      <h2 className="settings-title">Settings</h2>

      {/* Icon Buttons */}
      <div className="settings-section">
        <div className="settings-icon-row">
          {settingsIcons.map((item, index) => (
            <div
              key={index}
              className="settings-icon-button"
              onClick={() => item.route && navigate(item.route)}
              style={{ cursor: item.route ? 'pointer' : 'default' }}
            >
              {item.icon}
              <p className="settings-icon-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Buttons */}
      <div className="button-container">
        <button className="btn-primary" onClick={() => navigate('/contact')}>Contact Support</button>
        <button className="btn-primary" onClick={() => navigate('/report-bug')}>Report a Bug / Send Feedback</button>
        <button className="btn-primary" onClick={() => navigate('/faq')}>FAQ / Help Center</button>
      </div>

      {/* Support Section */}
      <div className="support-section">
        <h4 className="support-title">Support</h4>
        <div className="support-item">
          <IoHelpCircleOutline size={20} />
          <p>FAQ / Help Center</p>
        </div>
        <div className="support-item">
          <IoChatbubbleEllipsesOutline size={20} />
          <p>Contact Support</p>
        </div>
        <div className="support-item">
          <IoBugOutline size={20} />
          <p>Report a Bug / Send Feedback</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
