import s from './style.module.css';
import logo from '../../imgs/logo.png'

function Logo() {
    return (
        <div className={s.logo}>
            <img 
                src={logo} 
                alt='logo' 
                className={s.logo_img}
            />
            <span className={s.logo_text}>
                <span className={s.eco}>ECO</span>
                <span className={s.center}>CENTER</span>
            </span>
        </div>
    )
}

export default Logo;