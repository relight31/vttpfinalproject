package com.vttp.backend.repositories;

import static com.vttp.backend.models.MessageEntity.rowSetToMessageEntity;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import com.vttp.backend.models.MessageEntity;

@Repository
public class ChatRepository {
    @Autowired
    private JdbcTemplate template;

    private final String SQL_GET_MESSAGES_BY_CHATID = "select * from messages where chat_id = ?";
    private final String SQL_SAVE_MESSAGE = "insert into messages (chat_id, sender, content, msg_timestamp) values (?,?,?,?)";
    private final String SQL_DOES_CHAT_EXIST = "select * from chatsview where chat_id = ?";
    private final String SQL_INSERT_NEW_CHAT = "insert into chats (chat_id, listing_id, username_1, username_2) values (?,?,?,?)";

    public void saveToHistory(MessageEntity message) {
        template.update(SQL_SAVE_MESSAGE,
                message.getChatId(),
                message.getSender(),
                message.getContent(),
                message.getTimestamp());
    }

    public List<MessageEntity> getMessages(String chatId) {
        List<MessageEntity> messages = new LinkedList<>();
        SqlRowSet rowSet = template.queryForRowSet(SQL_GET_MESSAGES_BY_CHATID, chatId);
        while (rowSet.next()) {
            messages.add(rowSetToMessageEntity(rowSet));
        }
        return messages;
    }

    public boolean chatExists(String chatId) {
        return template.queryForRowSet(SQL_DOES_CHAT_EXIST, chatId).next();
    }

    public boolean createNewChatRecord(
            String chatId,
            int listingId,
            String sender,
            String recipient) {
        return template.update(SQL_INSERT_NEW_CHAT,
                chatId,
                listingId,
                sender,
                recipient) == 1;
    }
}
