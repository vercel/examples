import { Track } from 'livekit-client';
import { useLocalParticipantPermissions } from '@livekit/components-react';

const trackSourceToProtocol = (source: Track.Source) => {
  // NOTE: this mapping avoids importing the protocol package as that leads to a significant bundle size increase
  switch (source) {
    case Track.Source.Camera:
      return 1;
    case Track.Source.Microphone:
      return 2;
    case Track.Source.ScreenShare:
      return 3;
    default:
      return 0;
  }
};

export interface PublishPermissions {
  camera: boolean;
  microphone: boolean;
  screenShare: boolean;
  data: boolean;
}

export function usePublishPermissions(): PublishPermissions {
  const localPermissions = useLocalParticipantPermissions();

  const canPublishSource = (source: Track.Source) => {
    return (
      !!localPermissions?.canPublish &&
      (localPermissions.canPublishSources.length === 0 ||
        localPermissions.canPublishSources.includes(trackSourceToProtocol(source)))
    );
  };

  return {
    camera: canPublishSource(Track.Source.Camera),
    microphone: canPublishSource(Track.Source.Microphone),
    screenShare: canPublishSource(Track.Source.ScreenShare),
    data: localPermissions?.canPublishData ?? false,
  };
}
