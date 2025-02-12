import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import type { Theme } from "../../types/theme"
import { themeColors } from "../../types/theme"

interface Participant {
  userId: string
  nickname: string
  profileImage: string
}

interface ParticipantListModalProps {
  isOpen: boolean
  onClose: () => void
  participants: Participant[]
  participantCount: number
  theme: Theme
}

export function ParticipantListModal({
  isOpen,
  onClose,
  participants,
  participantCount,
  theme,
}: ParticipantListModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${themeColors[theme].background} ${themeColors[theme].text}`}>
        <DialogHeader>
          <DialogTitle className={`${themeColors[theme].text}`}>참여자 목록 ({participantCount}명)</DialogTitle>
        </DialogHeader>
        <ScrollArea className={`h-[300px] w-full rounded-md border p-4 ${themeColors[theme].background}`}>
          {participants.map((participant) => (
            <Link
              key={participant.userId}
              href={`/profile/${participant.userId}`}
              className={`flex items-center space-x-4 mb-4 hover:${themeColors[theme].background} p-2 rounded-md transition-colors ${themeColors[theme].text}`}
            >
              <Avatar>
                <AvatarImage src={participant.profileImage} alt={participant.nickname} />
                <AvatarFallback>{participant.nickname[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className={`text-sm font-medium leading-none ${themeColors[theme].text}`}>{participant.nickname}</p>
              </div>
            </Link>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

