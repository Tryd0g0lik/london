import React, { JSX, useEffect } from 'react';
import { useNavigate, } from 'react-router-dom';
import { doActiveReferences } from '@Services/menuServise'

export function NavFC(): JSX.Element {
  useEffect(() => {
    doActiveReferences();
  });
  const navigate = useNavigate();

  const handleGoHome = () => {
    // Перенаправление на /index
    navigate('/index'); 
  };

  return (
    <>
      <span className="loading loading-bars loading-xs"></span>
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
                <a href="/profile" className="nav-link
              dropdown-toggle" tada-togle="dropdown" role="button"
                aria-haspopup="true" aria-expanded="false">
                Профиль
              </a>

              <div className="dropdown-memu">
                  <ul>
                    <li className="nav-item">
                      <a className="dropdown-item" href="/profile/ads">
                        Мои объявления
                      </a>
                    </li>
                    {/* <li onClick={handleGoProfileChange} className="nav-item">
                      <Link to={Pages.ProfileChanges}>Изменить профиль</Link> */}
                    {/* <a className="dropdown-item" href="/profile/profile_change">
                        Изменить личные данные
                      </a> */}
                    {/* </li> */}
                    <li className="nav-item">
                      <a href="/profile/password_change" className="dropdown-item">
                        Изменить пароль
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/profile/profile_dalete" className="dropdown-item">
                        Удалить
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="dropdown-item" href="/profile/logout/">
                        Выход
                      </a>
                    </li>
                  </ul>
              </div>
            </li>
            </ul>
          </li>
          {/* {% else %} */}
          <li className="nav-item">
            <a href="/inlogin">Вход</a>
          </li>
          {/* {% endif %} */}

          <li className="nav-item">
            <a href="/about" className="nav-link root" tada-togle="dropdown-item">
              О сайте
            </a>
          </li>
        </ul>

      </div>
    </>
  )
}
