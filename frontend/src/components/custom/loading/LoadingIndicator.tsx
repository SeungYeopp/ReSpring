import { useMediaQuery } from 'react-responsive';
import { MobileLoading } from './MobileLoading';
import { TabletLoading } from './TabletLoading';
import { DesktopLoading } from './DesktopLoading';

const LoadingIndicator = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  if (isMobile) return <MobileLoading />;
  if (isTablet) return <TabletLoading />;
  if (isDesktop) return <DesktopLoading />;

  return null;
};

export default LoadingIndicator;
