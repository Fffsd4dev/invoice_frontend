import { Link } from 'react-router-dom';
import logoDark from '@/assets/images/maypasestatenew.png';
import logoLight from '@/assets/images/maypasestatenew.png';
import logoSm from '@/assets/images/maypasestate.png';
const LogoBox = ({
  containerClassName,
  squareLogo,
  textLogo
}) => {
  return <div className={containerClassName ?? ''}>
      <Link to="" className="logo-dark">
        {/* <img src={logoSm} className={squareLogo?.className} height={squareLogo?.height ?? 30} width={squareLogo?.width ?? 19} alt="logo sm" /> */}
        <img src={logoDark} className={textLogo?.className} alt="logo dark" />
      </Link>
      <Link to="" className="logo-light">
        {/* <img src={logoSm} className={squareLogo?.className} height={squareLogo?.height ?? 30} width={squareLogo?.width ?? 19} alt="logo sm" /> */}
        <img src={logoLight} className={textLogo?.className} height={textLogo?.height ?? 20} width={textLogo?.width ?? 60} alt="logo light" />
      </Link>
    </div>;
};
export default LogoBox;