import React, { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

export function NavFC(): JSX.Element {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/index'); // Перенаправление на /index
  };
  return (
    <>
      <div className="nav-item">
        <ul className="col menu menu-horizontal bg-base-200 rounded-box">
          <li onClick={handleGoHome} className="nav-item">
            <a href="./index" className="nav-link" >
              Главная
            </a>
          </li>
          <li className="nav-item">
            <a href="/registration" className="nav-link" >Регистрация</a>
          </li>
          {/* {% if user.is_authenticated %} */}
          <li className="nav-item dropdown">
            <ul>
            <li className="nav-item">
              <a href="/account/" className="nav-link
              dropdown-toggle" tada-togle="dropdown" role="button"
                aria-haspopup="true" aria-expanded="false">
                Профиль
              </a>
              <div className="dropdown-memu">
                <a className="dropdown-item" href="/account/">
                  Мои объявления
                </a>
                <a className="dropdown-item" href="/account/profile_change/">
                  Изменить личные данные
                </a>
                <a href="/account/password_change/" className="dropdown-item">
                  Изменить пароль
                </a>
                <a href="/account/profile_dalete/" className="dropdown-item">
                  Удалить
                </a>
                <a className="dropdown-item" href="/account/logout/">
                  Выход
                </a>
              </div>
            </li>
            </ul>
          </li>
          {/* {% else %} */}
          <li className="nav-item">
            <a href="/account/login/">Вход</a>
          </li>
          {/* {% endif %} */}

          <li className="nav-item">
            <a href="/about/" className="nav-link root" tada-togle="dropdown-item">
              О сайте
            </a>
          </li>
        </ul>

      </div>
    </>
  )
}
