import smallHeaderImg from '../assets/Team4MationSmallHeader.svg';
import smallerMediumHeaderImg from '../assets/Team4MationSmallerMediumHeader.svg';
import mediumHeaderImg from '../assets/Team4MationMediumHeader.svg';
import largeHeaderImg from '../assets/Team4MationLargeHeader.svg';
import biggestHeaderImg from '../assets/Team4MationBiggestHeader.svg';

export default function Header() {
  return (
    <header className="app-header">
      <picture>
        <source media="(min-width: 1600px)" srcSet={biggestHeaderImg} />
        <source media="(min-width: 1200px)" srcSet={largeHeaderImg} />
        <source media="(min-width: 981px)" srcSet={mediumHeaderImg} />
        <source media="(min-width: 781px)" srcSet={smallerMediumHeaderImg} />
        <img src={smallHeaderImg} alt="Header" />
      </picture>
    </header>
  );
}
