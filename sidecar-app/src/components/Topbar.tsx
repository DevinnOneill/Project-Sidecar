import { Link, useLocation } from 'react-router-dom';
import './Topbar.css';

interface TopbarProps {
  showDataMode?: boolean;
}

export default function Topbar({ showDataMode = false }: TopbarProps) {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === '/') return path === '/' || path === '/landing';
    return path.startsWith(route);
  };

  const links = [
    { to: '/workspace', label: 'Workspace' },
    { to: '/command', label: 'Command' },
    { to: '/analytics', label: 'Analytics' },
  ];

  return (
    <header className="topbar">
      <Link to="/" className="topbar__brand">
        SIDE<span className="topbar__bracket">[</span><span className="topbar__car">CAR</span><span className="topbar__bracket">]</span>
      </Link>
      <nav className="topbar__nav">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`topbar__link ${isActive(link.to) ? 'topbar__link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {showDataMode && (
        <div className="topbar__meta">
          <span className="topbar__data-mode">SYNTH</span>
          <span className="topbar__user">PERS-401</span>
        </div>
      )}
    </header>
  );
}
