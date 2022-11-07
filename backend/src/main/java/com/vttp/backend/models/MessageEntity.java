package com.vttp.backend.models;

import org.springframework.jdbc.support.rowset.SqlRowSet;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class MessageEntity {
    private String chatId;
    private String sender;
    private String content;
    private String timestamp;

    public String getChatId() {
        return this.chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getSender() {
        return this.sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public JsonObject toJsonObject() {
        return Json.createObjectBuilder()
                .add("sender", sender)
                .add("content", content)
                .add("timestamp", timestamp)
                .build();
    }

    public static MessageEntity rowSetToMessageEntity(SqlRowSet rowSet) {
        MessageEntity message = new MessageEntity();
        message.setChatId(rowSet.getString("chat_id"));
        message.setContent(rowSet.getString("content"));
        message.setSender(rowSet.getString("sender"));
        message.setTimestamp(rowSet.getTimestamp("msg_timestamp").toString());
        return message;
    }
}
