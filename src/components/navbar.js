import { Link } from 'react-router-dom';
import '../styling/navbar.scss';
import Photo from '../photos/me.jpeg';
import SVG from './svg';


export default function Navbar(){
    return (<div className="navbar-container" id='navbar-content-container'>
          
            <div className='profile-logo-container'>
                <div id='photo'><img src={Photo} /></div>
                <div id='name'><span>Мохаммед</span></div>
            </div>
            <div className='logo-container'>
                <Link to='/' >
                  
                        <div id='ilink'>ilink</div>
                        <div id='academy'>ACADEMY</div>
                </Link>
            </div>
            <div className='panel-control-container'>
                <Link to='/panel' id='panel-button'>
                        <span id='text'>Панель управления</span>
                        <div id='icon'><SVG name='user' color='white' /></div>
                    </Link>
            </div>  
    </div>)
}