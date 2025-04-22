import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadFile } from '@/services/api';

interface VoiceMemoryRecorderProps {
  onRecordingComplete: (url: string) => void;
  maxDuration?: number; // in seconds
}

export function VoiceMemoryRecorder({
  onRecordingComplete,
  maxDuration = 300, // 5 minutes default
}: VoiceMemoryRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number>();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' });
        
        try {
          // Upload the recording
          const fileName = `voice-memory-${Date.now()}.mp3`;
          const response = await uploadFile('voice-memories', fileName, audioBlob);

          if (response.error) {
            throw new Error(response.error);
          }

          if (response.data) {
            onRecordingComplete(response.data);
          }
        } catch (error: any) {
          toast.error('Failed to upload recording: ' + error.message);
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      // Start duration timer
      timerRef.current = window.setInterval(() => {
        setDuration(d => {
          if (d >= maxDuration) {
            stopRecording();
            return d;
          }
          return d + 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error('Failed to start recording: ' + error.message);
    }
  }, [maxDuration, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      // Resume duration timer
      timerRef.current = window.setInterval(() => {
        setDuration(d => {
          if (d >= maxDuration) {
            stopRecording();
            return d;
          }
          return d + 1;
        });
      }, 1000);
    }
  }, [isRecording, isPaused, maxDuration, stopRecording]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {isRecording ? (
            <span className="text-red-500 flex items-center">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              Recording: {formatDuration(duration)}
            </span>
          ) : (
            <span>Ready to record</span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Max duration: {formatDuration(maxDuration)}
        </div>
      </div>

      <div className="flex space-x-2">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="w-full"
            variant="default"
          >
            Start Recording
          </Button>
        ) : (
          <>
            {isPaused ? (
              <Button
                onClick={resumeRecording}
                className="flex-1"
                variant="outline"
              >
                Resume
              </Button>
            ) : (
              <Button
                onClick={pauseRecording}
                className="flex-1"
                variant="outline"
              >
                Pause
              </Button>
            )}
            <Button
              onClick={stopRecording}
              className="flex-1"
              variant="destructive"
            >
              Stop
            </Button>
          </>
        )}
      </div>

      {duration >= maxDuration && (
        <p className="text-sm text-yellow-500">
          Maximum recording duration reached
        </p>
      )}
    </div>
  );
} 