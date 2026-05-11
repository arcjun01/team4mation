import smallHeaderImg from '../assets/Team4MationSmallHeader.svg';
import mediumHeaderImg from '../assets/Team4MationMediumHeader.svg';
import largeHeaderImg from '../assets/Team4MationLargeHeader.svg';
import biggestHeaderImg from '../assets/Team4MationBiggestHeader.svg';

export default function Header({ variant = 'large' }) {
  const isLarge = variant === 'large';

  return (
    <header className={isLarge ? 'large-page-header' : 'page-header'}>
      <picture>
        <source media="(min-width: 1600px)" srcSet={biggestHeaderImg} />
        <source media="(min-width: 1200px)" srcSet={largeHeaderImg} />
        <source media="(min-width: 681px)" srcSet={mediumHeaderImg} />
        <img src={smallHeaderImg} alt="Header" />
      </picture>
    </header>
  );
}
