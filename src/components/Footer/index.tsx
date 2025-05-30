import DiscordIcon from '@/assets/icons/discord.svg?react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="sz:w-full sz:h-full sz:flex sz:items-center sz:justify-center">
      <div
        onClick={() => window.open('https://discord.gg/ukfPmxsyEy', '_blank')}
        className="sz:text-sm sz:text-gray-500 sz:cursor-pointer sz:flex sz:items-center sz:justify-center sz:gap-1"
      >
        {t('footer.joinDiscord')}
        <DiscordIcon className="sz:w-4 sz:h-4" />
      </div>
    </div>
  );
};

export default Footer;

