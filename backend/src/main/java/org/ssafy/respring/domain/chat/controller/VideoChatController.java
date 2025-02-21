package org.ssafy.respring.domain.chat.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Tag(name = "Video API", description = "화상채팅 관련 API")
public class VideoChatController {
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 멘토가 Offer를 보내면 모든 멘티들에게 전송
     */
    @MessageMapping("/video.offer/{roomId}")
    public void handleOffer(@DestinationVariable String roomId, String offer) {
        messagingTemplate.convertAndSend("/topic/video.offer/" + roomId, offer);
    }

    /**
     * 멘티가 Answer를 보내면 멘토에게 전송
     */
    @MessageMapping("/video.answer/{roomId}")
    public void handleAnswer(@DestinationVariable String roomId, String answer) {
        messagingTemplate.convertAndSend("/topic/video.answer/" + roomId, answer);
    }

    /**
     * ICE Candidate는 모든 참가자에게 전송
     */
    @MessageMapping("/video.ice/{roomId}")
    public void handleIceCandidate(@DestinationVariable String roomId, String candidate) {
        messagingTemplate.convertAndSend("/topic/video.ice/" + roomId, candidate);
    }

    @MessageMapping("/video.broadcast/{roomId}")
    public void handleVideoBroadcast(@DestinationVariable String roomId) {
        messagingTemplate.convertAndSend("/topic/video.broadcast/" + roomId, "{}");
    }

    /**
     * 멘토가 영상 통화를 중지하면 모든 멘티에게 알림
     */
    @MessageMapping("/video.stop/{roomId}")
    public void handleVideoStop(@DestinationVariable String roomId) {
        messagingTemplate.convertAndSend("/topic/video.stop/" + roomId, "{}");
    }

    /**
     * 새로운 멘티가 방에 입장하면, 멘토에게 Offer 요청을 전달
     */
    @MessageMapping("/video.requestOffer/{roomId}")
    public void handleOfferRequest(@DestinationVariable String roomId) {
        messagingTemplate.convertAndSend("/topic/video.requestOffer/" + roomId, "{}");
    }


}
