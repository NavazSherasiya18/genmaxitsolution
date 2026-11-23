import logo from '../../assets/images/genmax-logo.webp';
import logoOnDark from '../../assets/images/genmax-logo-on-dark.webp';
import { useTheme } from '../../context/ThemeContext';

export function GenmaxLogo({ size = 'header' }: { size?: 'header' | 'footer' }) {
  const { theme } = useTheme();
  const onDark = size === 'footer' || theme === 'dark';

  return (
    <img
      className={`genmax-logo block h-auto ${size === 'footer' ? 'w-56 max-w-full' : 'w-[9.25rem] min-[70rem]:w-40 xl:w-[11rem]'}`}
      src={onDark ? logoOnDark : logo}
      width={640}
      height={159}
      alt="Genmax IT Solution"
      draggable={false}
    />
  );
}
