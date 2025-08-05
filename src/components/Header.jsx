import React from 'react';
import { serverOnline } from '../serverDatabase';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo"><span className="logo-wild">Wild</span>Plex</div>
        <nav className="navigation">
          <a href="https://vk.com/wildplex" className="nav-link">Группа VK</a>
          <a href="https://t.me/w1ldplex" className="nav-link">Телеграм</a>
          <a href="#" className="nav-link">Поддержка</a>
          <a href="#" className="nav-link">Топы</a>
        </nav>
        <div className="server-info">
          <div className="server-ip"><span role="img" aria-label="money">💰</span> PLAY.WILDPLEX.RU <span role="img" aria-label="fire">🔥</span></div>
          {/* <div className="server-online">Онлайн: {serverOnline}</div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
