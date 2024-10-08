"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import {
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { base_url } from "@/config/config.js";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupFormDemo() {
  const USER_REGEX = useMemo(() => /^[A-z][A-z0-9-_]{3,23}$/, []);
  const PWD_REGEX = useMemo(
    () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
    []
  );
  const EMAIL_REGEX = useMemo(
    () => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    []
  );

  const [userName, setUserName] = useState<string>("");
  const [validUserName, setValidUserName] = useState<Boolean>(false);
  const [userNameFocus, setUserNameFocus] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false); // Modal visibility state
  const [modalContent, setModalContent] = useState<string>(""); // Modal content state
  const [verificationCode, setVerificationCode] = useState<string>(""); // Verification code state
  const [codeError, setCodeError] = useState<string>(""); // Error message for invalid code

  const router = useRouter();

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [PWD_REGEX, password]);

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [USER_REGEX, userName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [EMAIL_REGEX, email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      userName,
      fullName: firstName + " " + lastName,
      password,
      email,
    };

    await axios
      .post(`${base_url}/user/register`, data)
      .then((res) => {
        console.log(res.data);
        setModalContent("Enter the verification code sent to your email.");
        setShowModal(true); // Show modal for code entry after registration
      })
      .catch((err) => {
        console.log("Error while requesting register route: ", err);
      });
    console.log("Form submitted");
  };

  const verifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Assuming you have an endpoint to verify the code
    await axios
      .post(`${base_url}/user/verify`, { code: verificationCode, userName })
      .then((res) => {
        console.log(res.data);
        // Navigate to login on successful verification
        router.push("/auth/login");
      })
      .catch((err) => {
        setCodeError("Invalid verification code. Please try again.");
        console.log("Error while verifying code: ", err);
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname" className="text-sky-200">First name</Label>
            <Input
              id="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              type="text"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname" className="text-sky-200">Last name</Label>
            <Input
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              type="text"
              autoComplete="off"
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username" className="text-sky-200">Username {"    "}
            <FontAwesomeIcon
              icon={faCheck}
              className={validUserName ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validUserName || !userName ? "hide" : "invalid"}
            />
          </Label>
          <Input
            id="username"
            placeholder="Username"
            required
            autoComplete="off"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            type="text"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address
          <FontAwesomeIcon
              icon={faCheck}
              className={validEmail ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validEmail || !email ? "hide" : "invalid"}
            />
          </Label>
          <Input
            id="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="projectmayhem@fc.com"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password
          <FontAwesomeIcon
              icon={faCheck}
              className={validPassword ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validPassword || !password ? "hide" : "invalid"}
            />
          </Label>
          <Input
            id="password"
            required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-blue-900 dark:from-blue-700 dark:to-blue-300 to-blue-700 block dark:bg-blue-900 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
      </form>

      {/* Modal for Verification Code Input */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-black p-6 rounded-md shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
            <p>{modalContent}</p>
            <form onSubmit={verifyCode}>
              <Input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                type="text"
                className="mb-2"
              />
              {codeError && <p className="text-red-500 text-sm">{codeError}</p>}
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md w-full"
                type="submit"
              >
                Verify
              </button>
            </form>
            <button
              className="mt-2 text-blue-500"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <span>Already have an account?</span>
        <a
          href="/auth/login"
          className="font-medium text-sky-500 hover:text-sky-400 dark:hover:text-sky-400"
        >
          Log in
        </a>
      </div>

      <div className="mt-6 flex flex-col space-y-2">
        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900"
          type="button"
        >
          <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            GitHub
          </span>
          <BottomGradient />
        </button>
        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900"
          type="button"
        >
          <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Google
          </span>
          <BottomGradient />
        </button>
        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900"
          type="button"
        >
          <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            OnlyFans
          </span>
          <BottomGradient />
        </button>
      </div>
    </div>
  );
}

const LabelInputContainer = ({ children, className }: any) => (
  <div className={cn("w-full", className)}>{children}</div>
);

const BottomGradient = () => (
  <span
    aria-hidden="true"
    className="bg-gradient-to-tl pointer-events-none absolute top-0 left-0 w-full h-full opacity-0 group-hover/btn:opacity-100 from-white/20 dark:from-black/20 to-transparent rounded-md"
  />
);
