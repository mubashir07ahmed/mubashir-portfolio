import { Linkedin } from 'lucide-react';
import { profileData } from '../../shared/profileData.js';

type ProfilePlatform = 'github' | 'linkedin' | 'leetcode';
type ProfileLink = { label: string; href: string; platform: ProfilePlatform };

function safeProfileUrl(value: string) {
  if (!value || /your-username|your-profile|example\.com/i.test(value)) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function ProfileMark({ platform }: { platform: ProfilePlatform }) {
  if (platform === 'linkedin') {
    return <Linkedin size={17} strokeWidth={2} aria-hidden="true" />;
  }

  return <span className={`profile-icon-mask profile-icon-mask--${platform}`} aria-hidden="true" />;
}

export default function TopProfileLinks() {
  const configuredProfiles: ProfileLink[] = [
    { label: 'GitHub', href: profileData.contact.github, platform: 'github' },
    { label: 'LinkedIn', href: profileData.contact.linkedin, platform: 'linkedin' },
    { label: 'LeetCode', href: profileData.codingProfiles.leetcode, platform: 'leetcode' },
  ];
  const profiles = configuredProfiles.flatMap((profile): ProfileLink[] => {
    const href = safeProfileUrl(profile.href);
    return href ? [{ ...profile, href }] : [];
  });

  if (!profiles.length) return null;

  return (
    <nav className="profile-icon-bar" aria-label="Mubashir's profiles">
      {profiles.map(({ label, href, platform }) => (
        <a
          key={platform}
          className={`profile-icon-link profile-icon-link--${platform}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${label} profile in a new tab`}
          title={label}
        >
          <ProfileMark platform={platform} />
        </a>
      ))}
    </nav>
  );
}
