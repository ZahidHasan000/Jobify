// import React from 'react'
// import logo from '../assets/images/logo.svg';
import { Link } from 'react-router-dom';
import main from '../assets/images/main.svg';
// import main from '../assets/images/main-alternative.svg';
// import Wrapper from '../assets/wrappers/Testing';
import Wrapper from '../assets/wrappers/LandingPage';
// import Logo from '../components/Logo';
import { Logo } from '../components';

const Landing = () => {
    return (
        // <main>
        <Wrapper>
            <nav>
                {/* <img src={logo} alt='jobify' className='logo' /> */}
                <Logo />
            </nav>
            <div className='container page'>
                {/* info */}
                <div className='info'>
                    <h1>
                        job <span>tracking</span> app
                    </h1>
                    <p>
                        I'm baby wayfarers hoodie next level taiyaki brooklyn cliche blue
                        bottle single-origin coffee chia. Aesthetic post-ironic venmo,
                        quinoa lo-fi tote bag adaptogen everyday carry meggings +1 brunch
                        narwhal.
                    </p>
                    {/* <button className='btn btn-hero'>
                        Login/Register
                    </button> */}

                    <Link to='/register' className='btn btn-hero'>
                        Login/Register
                    </Link>
                </div>
                <img src={main} alt='job hunt' className='img main-img' />
            </div>
            {/* </main> */}
        </Wrapper>
    )
}
export default Landing



