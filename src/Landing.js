// Landing.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; // Separate CSS file for styling
import feature1 from './fuature_1.png';
import feature2 from './fuature_2.png';
import feature3 from './fuature_3.png';

const Landing = () => {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="container">
          <Link className="navbar-brand" to="/">Cash<span>Flowed</span></Link>
          <div className="nav-buttons">
            <Link to="/login" className="btn btn-outline-light">Войти</Link>
            <Link to="/register" className="btn btn-primary">Зарегистрироваться</Link>
          </div>
        </div>
      </nav>
      <header className="landing-header">
        <div className="header-content">
          <h1>Добро пожаловать в CashFlowed</h1>
          <p>Ваш персональный финансовый инструмент</p>
          <div className="header-buttons">
            <Link to="/register" className="btn btn-primary">Попробывать</Link>
            <Link to="/login" className="btn btn-secondary">Войти</Link>
          </div>
          <div class="social-icons">
                <a href="#"><i class="ri-telegram-line"></i></a>
                <a href="#"><i class="ri-github-fill"></i></a>
                <a href="#"><i class="ri-discord-fill"></i></a>
            </div>
        </div>
      </header>
      <section className="features-section">
        <div className="container">
          <h2>Дальнейшие преимущества</h2>
          <div className="features-grid">
            <div className="feature">
              <img src={feature1} alt="Feature 1" />
              <h3>Внедрение ИИ</h3>
              <p>Поможет вам детальней проанализировать ваши финансы и даст подробный отчёт</p>
            </div>
            <div className="feature">
              <img src={feature2} alt="Feature 2" />
              <h3>Мобильное приложение</h3>
              <p>Сделает использование приложения более удобным</p>
            </div>
            <div className="feature">
              <img src={feature3} alt="Feature 3" />
              <h3>Расширенная аналитика</h3>
              <p>Еще больше возможностей просмотра статистики вашых финансов</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2024 CashFlowed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
