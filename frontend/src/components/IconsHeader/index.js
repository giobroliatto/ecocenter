import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFileCirclePlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import s from './style.module.css';

const initialIcons = [
    { icon: faFileCirclePlus, tooltipId: "ecopoint-tooltip", tooltipContent: "Cadastre seu Ecoponto", path: '/register-ecopoint' },
    { icon: faUser, tooltipId: "profile-tooltip", tooltipContent: "Perfil", path: '/user-profile' },
    { icon: faSignOutAlt, tooltipId: "logout-tooltip", tooltipContent: "Sair", path: '#' }
];

function IconsHeader() {
    const [icons] = useState(initialIcons);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/user-profile', { state: { logout: true } });
    };

    return (
        <>
            {icons.map((item, index) => (
                <Tooltip key={index} id={item.tooltipId} />
            ))}
            <ul className={s.icons}>
                {icons.map((item, index) => (
                    <li key={index} className={s.icon}>
                        {item.path === '#' ? (
                            <span
                                className={s.logout}
                                data-tooltip-id={item.tooltipId}
                                data-tooltip-content={item.tooltipContent}
                                onClick={handleLogout}
                            >
                                <FontAwesomeIcon icon={item.icon} />
                            </span>
                        ) : (
                            <Link to={item.path}>
                                <FontAwesomeIcon 
                                    icon={item.icon} 
                                    data-tooltip-id={item.tooltipId} 
                                    data-tooltip-content={item.tooltipContent} 
                                />
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default IconsHeader;
