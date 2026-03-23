'use client';

import * as React from 'react';
import { Track } from 'livekit-client';
import { useTrackToggle } from '@livekit/components-react';
import {
  MicrophoneIcon,
  MicrophoneSlashIcon,
  MonitorArrowUpIcon,
  SpinnerIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Toggle } from '@/components/livekit/toggle';
import { cn } from '@/lib/utils';

function getSourceIcon(source: Track.Source, enabled: boolean, pending = false) {
  if (pending) {
    return SpinnerIcon;
  }

  switch (source) {
    case Track.Source.Microphone:
      return enabled ? MicrophoneIcon : MicrophoneSlashIcon;
    case Track.Source.Camera:
      return enabled ? VideoCameraIcon : VideoCameraSlashIcon;
    case Track.Source.ScreenShare:
      return MonitorArrowUpIcon;
    default:
      return React.Fragment;
  }
}

export type TrackToggleProps = React.ComponentProps<typeof Toggle> & {
  source: Parameters<typeof useTrackToggle>[0]['source'];
  pending?: boolean;
};

export function TrackToggle({ source, pressed, pending, className, ...props }: TrackToggleProps) {
  const IconComponent = getSourceIcon(source, pressed ?? false, pending);

  return (
    <Toggle pressed={pressed} aria-label={`Toggle ${source}`} className={cn(className)} {...props}>
      <IconComponent weight="bold" className={cn(pending && 'animate-spin')} />
      {props.children}
    </Toggle>
  );
}
