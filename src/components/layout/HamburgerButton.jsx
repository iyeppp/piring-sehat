/**
 * HamburgerButton Component
 *
 * Tombol hamburger untuk membuka/menutup menu navigasi di tampilan mobile.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Status menu (true = terbuka, false = tertutup)
 * @param {function} props.onClick - Fungsi toggle menu ketika tombol ditekan
 * @returns {JSX.Element}
 */

import './HamburgerButton.css';

function HamburgerButton({ isOpen, onClick }) {
  return (
    <button 
      className={`hamburger-btn ${isOpen ? 'open' : ''}`} 
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  );
}

export default HamburgerButton;