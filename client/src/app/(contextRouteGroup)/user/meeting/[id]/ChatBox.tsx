import React from "react";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import chatClient from "@/lib/streamChatConfig";
import { Card, IconButton } from "@mui/material";
import "stream-chat-react/dist/css/v2/index.css";
import { CrossCircledIcon } from "@radix-ui/react-icons";
interface ChatBoxProps {
  channel: any;
  close: any;
}

const ChatBox: React.FC<ChatBoxProps> = ({ channel, close }) => {
  if (!channel) return <div>Loading...</div>;
  return (
    <div className="z-30 h-full w-full p-4 m:">
      <Card className="w-full h-full max-w-lg bg-[#1a1a1a] text-white shadow-lg rounded-lg overflow-hidden">
        <IconButton onClick={() => close(false)} className="bg-[#1a1a1a]">
          <CrossCircledIcon
            className="relative"
            width="2rem"
            height="2rem"
            color="#888383"
            cursor="pointer"
          />
        </IconButton>
        <Chat client={chatClient} theme="str-chat__theme-dark">
          <Channel channel={channel}>
            <Window>
              <div className="str-chat__header-livestream">
                <ChannelHeader />
              </div>
              <div className="flex-1">
                <MessageList />
              </div>
             
                <MessageInput />
           
            </Window>
          </Channel>
        </Chat>
      </Card>
    </div>
  );
};

export default ChatBox;
