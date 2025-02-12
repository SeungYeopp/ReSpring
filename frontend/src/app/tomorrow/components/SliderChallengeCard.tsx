import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface SliderChallengeCardProps {
  id: number
  title: string
  description: string | ReactNode
  tags: string[]
  image: string
}

export function SliderChallengeCard({
  id,
  title,
  description,
  tags = [],
  image = "/placeholder.webp",
}: SliderChallengeCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/tomorrow/${id}`)
  }

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden w-full shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex p-3 sm:p-4 min-h-[120px] sm:min-h-[140px]">
        {/* 이미지 섹션 */}
        <div className="w-[80px] sm:w-[100px] mr-3 sm:mr-4 flex-shrink-0">
          <div className="relative w-full aspect-square">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="rounded-xl object-cover" />
          </div>
        </div>
        {/* 컨텐츠 섹션 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 제목과 설명 */}
          <div className="mb-2 sm:mb-3 flex-grow">
            <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2 line-clamp-1">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">{description}</p>
          </div>
          {/* 태그와 버튼 */}
          <div className="flex items-center justify-between mt-auto">
            {/* 태그 섹션 */}
            <div className="hidden sm:flex gap-2 overflow-hidden flex-wrap">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100/60 text-gray-600/90 rounded-full text-xs whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* 버튼 섹션 */}
            <div className="ml-auto">
              <Button
                variant="default"
                className="bg-[#96b23c] hover:bg-[#638d3e] text-white px-3 py-1 h-auto rounded-full text-xs font-medium shadow-sm flex-shrink-0 font-laundrygothicregular"
              >
                자세히 보기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

