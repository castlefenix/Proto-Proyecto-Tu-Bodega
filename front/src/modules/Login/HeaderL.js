import "../../css/Plantilla.css"
import logoImage from '../../picture/Logo.png';

function HeaderL() {
    return(
        <header>
        <div className="logo">
            <img src={logoImage} alt="Logo-software-tu-bodega" height="40PX" />
        </div>
        <a href="http://192.168.2.4:3000/"><h1 className="caja">📦</h1></a>
    </header>
    )
}
export default HeaderL;
