import { useCallback, useMemo } from 'react';
import { Track } from 'livekit-client';
import {
  type TrackReferenceOrPlaceholder,
  useLocalParticipant,
  usePersistentUserChoices,
  useTrackToggle,
} from '@livekit/components-react';

export interface UseInputControlsProps {
  saveUserChoices?: boolean;
  onDisconnect?: () => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

export interface UseInputControlsReturn {
  micTrackRef: TrackReferenceOrPlaceholder;
  microphoneToggle: ReturnType<typeof useTrackToggle<Track.Source.Microphone>>;
  cameraToggle: ReturnType<typeof useTrackToggle<Track.Source.Camera>>;
  screenShareToggle: ReturnType<typeof useTrackToggle<Track.Source.ScreenShare>>;
  handleAudioDeviceChange: (deviceId: string) => void;
  handleVideoDeviceChange: (deviceId: string) => void;
  handleMicrophoneDeviceSelectError: (error: Error) => void;
  handleCameraDeviceSelectError: (error: Error) => void;
}

export function useInputControls({
  saveUserChoices = true,
  onDeviceError,
}: UseInputControlsProps = {}): UseInputControlsReturn {
  const { microphoneTrack, localParticipant } = useLocalParticipant();

  const microphoneToggle = useTrackToggle({
    source: Track.Source.Microphone,
    onDeviceError: (error) => onDeviceError?.({ source: Track.Source.Microphone, error }),
  });

  const cameraToggle = useTrackToggle({
    source: Track.Source.Camera,
    onDeviceError: (error) => onDeviceError?.({ source: Track.Source.Camera, error }),
  });

  const screenShareToggle = useTrackToggle({
    source: Track.Source.ScreenShare,
    onDeviceError: (error) => onDeviceError?.({ source: Track.Source.ScreenShare, error }),
  });

  const micTrackRef = useMemo(() => {
    return {
      participant: localParticipant,
      source: Track.Source.Microphone,
      publication: microphoneTrack,
    };
  }, [localParticipant, microphoneTrack]);

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !saveUserChoices });

  const handleAudioDeviceChange = useCallback(
    (deviceId: string) => {
      saveAudioInputDeviceId(deviceId ?? 'default');
    },
    [saveAudioInputDeviceId]
  );

  const handleVideoDeviceChange = useCallback(
    (deviceId: string) => {
      saveVideoInputDeviceId(deviceId ?? 'default');
    },
    [saveVideoInputDeviceId]
  );

  const handleToggleCamera = useCallback(
    async (enabled?: boolean) => {
      if (screenShareToggle.enabled) {
        screenShareToggle.toggle(false);
      }
      await cameraToggle.toggle(enabled);
      // persist video input enabled preference
      saveVideoInputEnabled(!cameraToggle.enabled);
    },
    [cameraToggle, screenShareToggle, saveVideoInputEnabled]
  );

  const handleToggleMicrophone = useCallback(
    async (enabled?: boolean) => {
      await microphoneToggle.toggle(enabled);
      // persist audio input enabled preference
      saveAudioInputEnabled(!microphoneToggle.enabled);
    },
    [microphoneToggle, saveAudioInputEnabled]
  );

  const handleToggleScreenShare = useCallback(
    async (enabled?: boolean) => {
      if (cameraToggle.enabled) {
        cameraToggle.toggle(false);
      }
      await screenShareToggle.toggle(enabled);
    },
    [cameraToggle, screenShareToggle]
  );
  const handleMicrophoneDeviceSelectError = useCallback(
    (error: Error) => onDeviceError?.({ source: Track.Source.Microphone, error }),
    [onDeviceError]
  );

  const handleCameraDeviceSelectError = useCallback(
    (error: Error) => onDeviceError?.({ source: Track.Source.Camera, error }),
    [onDeviceError]
  );

  return {
    micTrackRef,
    cameraToggle: {
      ...cameraToggle,
      toggle: handleToggleCamera,
    },
    microphoneToggle: {
      ...microphoneToggle,
      toggle: handleToggleMicrophone,
    },
    screenShareToggle: {
      ...screenShareToggle,
      toggle: handleToggleScreenShare,
    },
    handleAudioDeviceChange,
    handleVideoDeviceChange,
    handleMicrophoneDeviceSelectError,
    handleCameraDeviceSelectError,
  };
}
