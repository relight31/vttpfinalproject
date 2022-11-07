package com.vttp.backend.controllers;

import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.vttp.backend.models.MessageEntity;
import com.vttp.backend.services.ChatService;

import jakarta.json.Json;
import jakarta.json.JsonObject;

@Controller
public class ChatController {
    private Logger logger = Logger.getLogger(ChatController.class.getName());

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private ChatService chatSvc;

    @MessageMapping("/chat/{chatId}")
    public void chat(
            @DestinationVariable String chatId,
            @Payload MessageEntity msg) {
        // set timestamp
        Timestamp timestamp = Timestamp.from(Instant.now());
        msg.setTimestamp(timestamp.toString());
        // save message to chat history
        chatSvc.saveToHistory(msg);
        // put message in websocket
        template.convertAndSend("/api/topic/messages/" + chatId, msg);
        // TODO fix security config
    }

    @GetMapping(path = "/api/getmessages")
    public ResponseEntity<String> getMessages(@RequestParam String chatId) {
        // get messages from DB
        List<MessageEntity> messages = chatSvc.getMessages(chatId);
        // return as list of messages
        return ResponseEntity.ok(
                chatSvc.messagesToJsonArray(messages).toString());
    }

    @GetMapping(path = "/api/getchatid", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createOrGetChatId(
            @RequestParam String recipient,
            @RequestParam int listingId,
            Principal principal) {
        String sender = principal.getName();
        try {
            String chatId = chatSvc.createOrGetChatId(sender, recipient, listingId);
            JsonObject result = Json.createObjectBuilder()
                    .add("chatId", chatId)
                    .build();
            logger.info(result.toString());
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
