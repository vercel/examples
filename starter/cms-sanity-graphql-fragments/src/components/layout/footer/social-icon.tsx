import Image from "next/image";

export const SocialIcon = ({ platform }: { platform: string }) => {
  const iconSrc = `/icons/social/${platform}.svg`;

  return (
    <Image
      src={iconSrc}
      alt={`${platform} icon`}
      width={20}
      height={20}
      unoptimized={true}
    />
  );
};
