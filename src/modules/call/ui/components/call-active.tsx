import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { CallControls } from "@stream-io/video-react-sdk";

const SpeakerLayout = dynamic(
  () =>
    import("@stream-io/video-react-sdk").then(
      (mod) => mod.SpeakerLayout
    ),
  { ssr: false }
);

interface Props {
    onLeave: ()=> void;
    meetingName: string;
}

export const CallActive = ({onLeave, meetingName}: Props) => {
    return(
        <div className="flex flex-col justify-between p-4 h-full text-white">
            <div className="bg-[#101213] round-full p-4 flex items-center gap-4">
                <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                  <Image src="/Logo.png" width={22} height={22} alt="Logo"/>
                </Link>
             <h4 className="text-base">
                {meetingName}
             </h4>
            </div>

           {/* FIXES INFINITE LOOP */}
           <SpeakerLayout />

           <div className="bg-[#101213] rounded-full px-4">
            <CallControls onLeave={onLeave} />
           </div>
        </div>
    );
};
