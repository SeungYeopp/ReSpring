import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Participant } from "../../types/Participants";
import Link from "next/link";

interface ParticipantListModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  participantCount: number;
}

export function ParticipantListModal({ isOpen, onClose, participants, participantCount }: ParticipantListModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>참여자 목록 ({participantCount}명)</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {participants.map((participant) => (
            <Link key={participant.userId} href={`/profile/${participant.userId}`} className="flex items-center space-x-4 mb-4 hover:bg-gray-100 p-2 rounded-md transition-colors">
              <Avatar>
                <AvatarImage src={participant.profileImage} alt={participant.nickname} />
                <AvatarFallback>{participant.nickname[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{participant.nickname}</p>
              </div>
            </Link>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
