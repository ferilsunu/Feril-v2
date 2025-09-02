interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const navItems = [
    { id: 'profile', icon: 'fas fa-user', label: 'Profile' },
    { id: 'experience', icon: 'fas fa-briefcase', label: 'Experience' },
    { id: 'education', icon: 'fas fa-graduation-cap', label: 'Education' },
    { id: 'skills', icon: 'fas fa-code', label: 'Skills' },
    { id: 'projects', icon: 'fas fa-project-diagram', label: 'Projects' },
    { id: 'certificates', icon: 'fas fa-certificate', label: 'Certificates' },
  ];

  return (
    <>
      {/* Mobile Sticky Menu */}
      <nav className="mobile-menu" id="mobileMenu">
        <div className="mobile-nav-items">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`mobile-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange(item.id);
              }}
            >
              <i className={item.icon}></i>
              <span className="mobile-nav-text">{item.label}</span>
            </a>
          ))}
          <a
            href="https://v1.ferilsunu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-item external-link"
          >
            <i className="fas fa-external-link-alt"></i>
            <span className="mobile-nav-text">V1</span>
          </a>
        </div>
      </nav>

      {/* Sidebar */}
      <nav className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <div className="logo">Feril Sunu</div>
          <div className="subtitle">Software Developer</div>
        </div>
        <div className="nav-menu">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange(item.id);
              }}
            >
              <i className={item.icon}></i>
              {item.label}
            </a>
          ))}
          <a
            href="https://v1.ferilsunu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-item external-link"
          >
            <i className="fas fa-external-link-alt"></i>
            V1
          </a>
        </div>
      </nav>
    </>
  );
}