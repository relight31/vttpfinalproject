package com.vttp.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Service;

import com.vttp.backend.models.Listing;
import com.vttp.backend.models.MessageEntity;
import com.vttp.backend.repositories.ChatRepository;
import com.vttp.backend.repositories.UserInfoRepository;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepo;

    @Autowired
    private UserInfoRepository userInfoRepo;

    public void saveToHistory(MessageEntity msg) {
        chatRepo.saveToHistory(msg);
    }

    public List<MessageEntity> getMessages(String chatId) {
        return chatRepo.getMessages(chatId);
    }

    public JsonArray getChats(String username) {
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        SqlRowSet rowSet = chatRepo.getChats(username);
        while (rowSet.next()) {
            Listing listing = Listing.fromRowset(rowSet);
            String chatId = rowSet.getString("chat_id");
            String recipient = rowSet.getString("user_1");
            if (recipient.equals(username)) {
                recipient = rowSet.getString("user_2");
            }
            arrayBuilder.add(
                    Json.createObjectBuilder()
                            .add("chatId", chatId)
                            .add("recipient", recipient)
                            .add("listing", listing.toJsonObject())
                            .build());
        }
        return arrayBuilder.build();
    }

    public JsonArray messagesToJsonArray(List<MessageEntity> messages) {
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        for (MessageEntity message : messages) {
            arrayBuilder.add(message.toJsonObject());
        }
        return arrayBuilder.build();
    }

    public String createOrGetChatId(
            String senderUsername,
            String recipientUsername,
            int listingId) {
        int senderId = userInfoRepo.userIdFromUsername(senderUsername);
        int recipientId = userInfoRepo.userIdFromUsername(recipientUsername);
        String chatId = Math.min(senderId, recipientId) + "and" + Math.max(senderId, recipientId) + "for" + listingId;
        if (!chatRepo.chatExists(chatId)
                && !chatRepo.createNewChatRecord(chatId, listingId, senderUsername, recipientUsername)) {
            throw new IllegalArgumentException("Unable to create new chat record");
        }
        return chatId;
    }
}
