import headerImg from '../assets/Team4MationHeader.svg';
import largeHeaderImg from '../assets/largeHeader.svg';

export default function Header({ variant = 'large' }) {
  const isLarge = variant === 'large';
  
  return (
    <header className={isLarge ? 'large-page-header' : 'page-header'}>
      <img src={isLarge ? largeHeaderImg : headerImg} alt="Header" />
    </header>
  );
}