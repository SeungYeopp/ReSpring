"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { useTheme } from "../../contexts/ChatThemeContext";
import { themeColors } from "../../types/chatTheme";

interface VideoChatProps {
  partnerName: string; // 상대방 이름을 props로 받습니다
}

export default function VideoChat({ partnerName }: VideoChatProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const { theme } = useTheme();

  /**   랜덤 프로필 이미지 생성 함수 */
  const getRandomImage = () => {
    const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
    return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
  };

  useEffect(() => {
    // WebRTC 연결 로직 (실제 구현 시 이 부분을 채워야 합니다)
    const startVideoChat = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("미디어 장치 접근 오류:", error);
      }
    };

    startVideoChat();

    // 컴포넌트 언마운트 시 스트림 정리
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream).getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream).getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${themeColors[theme].secondary} rounded-lg mb-4`}>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4 w-full">
        {/* 로컬 비디오 (자신의 화면) */}
        <div className={`relative w-full md:w-1/2 aspect-video ${themeColors[theme].background} rounded-lg overflow-hidden`}>
          {isCameraOn ? (
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Image
                src={getRandomImage()} //   함수 호출 시 중괄호로 감싸기
                alt="카메라 꺼짐"
                width={200}
                height={200}
                className="rounded-full"
              />
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">나 (Me)</div>
        </div>
        {/* 원격 비디오 (상대방 화면) */}
        <div className={`relative w-full md:w-1/2 aspect-video ${themeColors[theme].background} rounded-lg overflow-hidden`}>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">{partnerName}</div>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button onClick={toggleMic} variant={isMicOn ? "default" : "destructive"} className="w-12 h-12 rounded-full">
          {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </Button>
        <Button onClick={toggleCamera} variant={isCameraOn ? "default" : "destructive"} className="w-12 h-12 rounded-full">
          {isCameraOn ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  );
}
