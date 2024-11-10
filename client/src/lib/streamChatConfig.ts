import { StreamChat } from 'stream-chat';

console.log(process.env.NEXT_PUBLIC_CHAT_API_KEY as string);


const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_CHAT_API_KEY! as string);

export default client;