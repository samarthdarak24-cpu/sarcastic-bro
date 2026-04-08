/* ========================================================================
   Message Bubble Component - Individual Message Display
   Shows message content, sender, status (✓✓ blue checkmarks)
   ======================================================================== */

'use client';

import React, { useState } from 'react';
import { MessageCircle, Download, MoreVertical, Copy, Trash2, Laugh } from 'lucide-react';
import styles from './MessageBubble.module.css';

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface MessageReaction {
  id: string;
  emoji: string;
  user: User;
}

interface MessageBubbleProps {
  message: {
    id: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'file' | 'voice';
    fileUrl?: string;
    fileName?: string;
    status: 'SENT' | 'DELIVERED' | 'SEEN';
    reactions?: MessageReaction[];
    isEdited?: boolean;
    createdAt: string;
    sender: User;
  };
  isOwn: boolean;
  onReactionAdd: (emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  onReactionAdd,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const emojis = ['😂', '❤️', '😮', '😢', '🔥', '👍', '😍', '🎉'];

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    if (message.type === 'image') {
      return (
        <img
          src={message.fileUrl}
          alt="Shared image"
          className={styles.imageContent}
        />
      );
    }

    if (message.type === 'file') {
      return (
        <div className={styles.fileContent}>
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fileLink}
          >
            <Download size={16} />
            <span>{message.fileName || 'Download file'}</span>
          </a>
        </div>
      );
    }

    if (message.type === 'voice') {
      return (
        <audio
          controls
          className={styles.audioContent}
          src={message.fileUrl}
        />
      );
    }

    return <p className={styles.textContent}>{message.content}</p>;
  };

  return (
    <div className={`${styles.container} ${isOwn ? styles.ownMessage : styles.otherMessage}`}>
      {!isOwn && (
        <img
          src={message.sender.avatarUrl || '/avatar-default.png'}
          alt={message.sender.name}
          className={styles.avatar}
        />
      )}

      <div className={`${styles.bubble} ${isOwn ? styles.ownBubble : styles.otherBubble}`}>
        {!isOwn && <p className={styles.senderName}>{message.sender.name}</p>}

        {renderContent()}

        {message.isEdited && <span className={styles.editedLabel}>(edited)</span>}

        <div className={styles.footer}>
          <span className={styles.time}>{formatTime(message.createdAt)}</span>

          {isOwn && (
            <span
              className={`${styles.status} ${styles[message.status.toLowerCase()]}`}
              title={message.status}
            >
              {message.status === 'SEEN' && '✓✓'}
              {message.status === 'DELIVERED' && '✓✓'}
              {message.status === 'SENT' && '✓'}
            </span>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={styles.reactions}>
            {Object.entries(
              message.reactions.reduce((acc: any, r: MessageReaction) => {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                return acc;
              }, {})
            ).map(([emoji, count]) => (
              <div key={emoji} className={styles.reactionBadge}>
                {emoji} {count > 1 && count}
              </div>
            ))}
            {/* Add reaction button */}
            <button
              className={styles.addReactionButton}
              onClick={() => setShowReactions(!showReactions)}
              title="Add reaction"
            >
              <Laugh size={12} />
            </button>
          </div>
        )}

        {/* Reactions popup */}
        {showReactions && (
          <div className={styles.reactionPicker}>
            {emojis.map((emoji) => (
              <button
                key={emoji}
                className={styles.emojiButton}
                onClick={() => {
                  onReactionAdd(emoji);
                  setShowReactions(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Context menu */}
        <div className={styles.menuContainer}>
          <button
            className={styles.menuButton}
            onClick={() => setShowMenu(!showMenu)}
            title="Message options"
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <div className={styles.contextMenu}>
              {!isOwn && (
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    navigator.clipboard.writeText(message.content);
                    setShowMenu(false);
                  }}
                >
                  <Copy size={16} />
                  Copy
                </button>
              )}

              {isOwn && (
                <>
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      navigator.clipboard.writeText(message.content);
                      setShowMenu(false);
                    }}
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                  <button className={styles.menuItem} onClick={() => console.log('edit')}>
                    <MessageCircle size={16} />
                    Edit
                  </button>
                  <button
                    className={`${styles.menuItem} ${styles.danger}`}
                    onClick={() => console.log('delete')}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
