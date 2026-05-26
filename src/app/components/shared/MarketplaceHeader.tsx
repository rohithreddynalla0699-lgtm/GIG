import Navigation from '../Navigation';

type MarketplaceHeaderProps = {
  navTheme?: 'adaptive' | 'light' | 'dark';
};

export default function MarketplaceHeader({ navTheme = 'light' }: MarketplaceHeaderProps) {
  return <Navigation navTheme={navTheme} variant="public" />;
}
