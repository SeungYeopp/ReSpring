package org.ssafy.respring.domain.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class VideoChatController {
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * ✅ 멘토가 Offer를 보내면 모든 멘티들에게 전송
     */
    @MessageMapping("/video.offer/{roomId}")
    public void handleOffer(@DestinationVariable String roomId, String offer) {
        System.out.println("📡 멘토의 WebRTC Offer 수신 -> 멘티들에게 전송: " + roomId);
        messagingTemplate.convertAndSend("/topic/video.offer/" + roomId, offer);
    }

    /**
     * ✅ 멘티가 Answer를 보내면 멘토에게 전송
     */
    @MessageMapping("/video.answer/{roomId}")
    public void handleAnswer(@DestinationVariable String roomId, String answer) {
        System.out.println("📡 멘티의 WebRTC Answer 수신 -> 멘토에게 전송: " + roomId);
        messagingTemplate.convertAndSend("/topic/video.answer/" + roomId, answer);
    }

    /**
     * ✅ ICE Candidate는 모든 참가자에게 전송
     */
    @MessageMapping("/video.ice/{roomId}")
    public void handleIceCandidate(@DestinationVariable String roomId, String candidate) {
        System.out.println("❄ ICE Candidate 수신 -> 모든 참가자에게 전송: " + roomId);
        messagingTemplate.convertAndSend("/topic/video.ice/" + roomId, candidate);
    }

    @MessageMapping("/video.broadcast/{roomId}")
    public void handleVideoBroadcast(@DestinationVariable String roomId) {
        System.out.println("📡 멘토가 모든 멘티에게 Offer 전송 요청: " + roomId);
        messagingTemplate.convertAndSend("/topic/video.broadcast/" + roomId, "{}");
    }

    /**
     * ✅ 멘토가 영상 통화를 중지하면 모든 멘티에게 알림
     */
    @MessageMapping("/video.stop/{roomId}")
    public void handleVideoStop(@DestinationVariable String roomId) {
        System.out.println("📴 멘토가 영상 통화를 종료 -> 모든 멘티에게 알림: " + roomId);
        messagingTemplate.convertAndSend("/topic/video.stop/" + roomId, "{}");
    }

    /**
     * ✅ 새로운 멘티가 방에 입장하면, 멘토에게 Offer 요청을 전달
     */
    @MessageMapping("/video.requestOffer/{roomId}")
    public void handleOfferRequest(@DestinationVariable String roomId) {
        System.out.println("📡 새로운 멘티가 입장 -> 멘토에게 Offer 요청: " + roomId);
        messagingTemplate.convertAndSend("/topic/video.requestOffer/" + roomId, "{}");
    }




}
