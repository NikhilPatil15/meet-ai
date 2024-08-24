
import add from '@/assets/icons/add-meeting.svg'
import join from '@/assets/icons/join-meeting.svg'
import schedule from '@/assets/icons/schedule.svg'
import recording from '@/assets/icons/share.svg'
export interface StateCardItem {
  title: string;
  description: string;
  iconColor: string;
  iconbg: string;
  img: any;
  isState: 'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting';
}

export const StateCardData: StateCardItem[] = [
  {
    title: "New Meeting",
    description: "Start an instant meeting",
    iconColor: "#ffffff",
    iconbg: "#FFAF00",
    img: add,
    isState: 'isInstantMeeting',
  },
  {
    title: "Join Meeting",
    description: "Join an existing meeting",
    iconColor:"#4cceac",
    iconbg: "#0F67B1",
    img: join,
    isState: 'isInstantMeeting',
  },
  {
    title: "Schedule Meeting",
    description: "Plan your meeting",
    iconColor: "#ffffff",
    iconbg: "#921A40",
    img: schedule,
    isState: 'isInstantMeeting',
  },
  // {
  //   title: "Share screen",
  //   description: "Share your screen in a meeting",
  //   iconColor: "#ffffff",
  //   iconbg: "#337357",
  //   img: recording,
  //   isState: 'isInstantMeeting',
  // },
];