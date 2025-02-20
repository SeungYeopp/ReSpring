import Image from "next/image"
import type { Book } from "../../../../lib/api/book"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, Eye } from "lucide-react"
import Link from "next/link"

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/yesterday/book/${book.id}`} className="block transition-transform hover:-translate-y-1">
      <Card className="overflow-hidden h-full flex flex-col  border-[#638d3e] border-2 shadow-lg hover:shadow-xl cursor-pointer">
        <div className="relative aspect-[3/4] w-full border-b-2 border-b-black">
          <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} layout="fill" objectFit="cover" />
          <div className="absolute inset-0 from-[#665048] to-transparent opacity-60"></div>
        </div>
        <CardContent className="p-2 sm:p-4 flex-grow ">
          <h3 className="font-laundrygothicbold text-sm sm:text-base mb-1 line-clamp-2 text-[#638d3e]">{book.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">{book.authorNickname}</p>
          <div className="flex flex-wrap gap-1">
            {book.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-xs bg-[#638d3e] text-white px-1 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-2 sm:p-4 pt-0 flex justify-between text-xs sm:text-sm text-gray-600 ">
          <span className="flex items-center">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-black fill-red-600" />
            {book.likeCount}
          </span>
          <span className="flex items-center">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[#96b23c]" />
            {book.viewCount}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

