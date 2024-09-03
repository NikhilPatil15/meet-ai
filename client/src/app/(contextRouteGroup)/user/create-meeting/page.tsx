"use client";

import useAuth from "@/hooks/useAuth";
import {
  Call,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function CreateMeetingPage() {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [participantsInput, setParticipantsInput] = useState("");
  const [call, setCall] = useState<Call>();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<{ email: string, userName: string }[]>([]);

  const [join, setJoin] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const client = useStreamVideoClient();
  const router = useRouter();
  const {user} = useAuth()
  const dispatch = useDispatch();


  async function createMeeting() {
    if (!client || !user) {
      return;
    }

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      const response = await call.getOrCreate({
        data: {
          custom: { description: descriptionInput && descriptionInput },
        },
      });

      setCall(call);
      router.push(`meeting/${call?.id}`);
    } catch (error) {
      console.log("error: ", error);
      alert("Something went wrong. Please try again later.");
    }
  }

  const joincall = async () => {};

  const joinMeeting = async () => {
    router.push(`/meeting/${input}`);
  };
  if (!client || !user) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <div className="flex flex-col items-center space-y-6 text-white">
      <h1 className="text-center text-2xl font-bold">
        Welcome {user.userName}!
      </h1>
      <div className="mx-auto w-80 space-y-6 rounded-md  p-5">
        <h2 className="text-xl font-bold">Create a new meeting</h2>
        <TitleInput value={titleInput} onChange={setTitleInput} />
        <DescriptionInput
          value={descriptionInput}
          onChange={setDescriptionInput}
        />
        <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
        {/* <ParticipantsInput
          value={participantsInput}
          onChange={setParticipantsInput}
        /> */}
         <ParticipantsInput
          users={allUsers}
          selectedParticipants={selectedParticipants}
          setSelectedParticipants={setSelectedParticipants}
        />

        <button onClick={createMeeting} className="w-full">
          Create meeting
        </button>
        <button className="w-full" onClick={() => setJoin(true)}>
          join a meeting
        </button>
        {join && (
          <div>
            {" "}
            <input
              onChange={(e) => setInput(e.target.value)}
              className="w-full"
            />{" "}
            <br /> <button onClick={joinMeeting}>Join</button>
          </div>
        )}
      </div>
      {call && <MeetingLink call={call} />}
    </div>
  );
}

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <label className="block space-y-1">
      <span className="font-medium">Title</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-600 p-2"
      />
    </label>
  );
}

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting info:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => {
            setActive(e.target.checked);
            onChange("");
          }}
        />
        Add description
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Description</span>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={500}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </label>
      )}
    </div>
  );
}

interface StartTimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

function StartTimeInput({ value, onChange }: StartTimeInputProps) {
  const [active, setActive] = useState(false);

  const dateTimeLocalNow = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60_000
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="space-y-2">
      <div className="font-medium">Meeting start:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange("");
          }}
        />
        Start meeting immediately
      </label>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
            onChange(dateTimeLocalNow);
          }}
        />
        Start meeting at date/time
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Start time</span>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={dateTimeLocalNow}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </label>
      )}
    </div>
  );
}
interface ParticipantsInputProps {
  users: { email: string; userName: string }[];
  selectedParticipants: string[];
  setSelectedParticipants: (emails: string[]) => void;
}

function ParticipantsInput({
  users,
  selectedParticipants,
  setSelectedParticipants,
}: ParticipantsInputProps) {
  const [active, setActive] = useState(false);

  const toggleSelection = (email: string) => {
    if (selectedParticipants.includes(email)) {
      setSelectedParticipants(selectedParticipants.filter((e) => e !== email));
    } else {
      setSelectedParticipants([...selectedParticipants, email]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-medium">Participants:</div>
      <label className="flex items-center gap-1.5">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            setSelectedParticipants([]);
          }}
        />
        Everyone with link can join
      </label>
      <label className="flex items-center gap-1.5">
        <input type="radio" checked={active} onChange={() => setActive(true)} />
        Private meeting
      </label>
      {active && (
        <div className="space-y-1">
          <span className="font-medium">Select participants</span>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.email} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(user.email)}
                  onChange={() => toggleSelection(user.email)}
                />
                <span>
                  {user.userName} ({user.email})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MeetingLinkProps {
  call: Call;
}

function MeetingLink({ call }: MeetingLinkProps) {
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URI}/meeting/${call.id}`;

  return <div className="text-center">{meetingLink}</div>;
}
