import React from 'react';
import { IoInformationCircleOutline, IoDocumentTextOutline, IoLockClosedOutline, IoHelpCircleOutline, IoChatbubbleEllipsesOutline, IoBugOutline } from 'react-icons/io5';
import '../../styles/Settings.css'; // Assume you have this CSS file

const settingsIcons = [
  { label: 'About the App', icon: <IoInformationCircleOutline size={30} /> },
  { label: 'Terms of Service', icon: <IoDocumentTextOutline size={30} /> },
  { label: 'Privacy Policy', icon: <IoLockClosedOutline size={30} /> },
  { label: 'App Version', icon: <IoInformationCircleOutline size={30} /> },
];

const Settings = () => {

  return (
    <div className="settings">
        <h2 className="settings-title">Settings</h2>

      {/* Icon Buttons */}
      <div className="settings-section">
        <div className="settings-icon-row">
          {settingsIcons.map((item, index) => (
            <div key={index} className="settings-icon-button">
              {item.icon}
              <p className="settings-icon-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Buttons */}
      <div className="button-container">
        <button className="btn-primary">Contact Support</button>
        <button className="btn-primary">Report a Bug / Send Feedback</button>
        <button className="btn-primary">FAQ / Help Center</button>
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
