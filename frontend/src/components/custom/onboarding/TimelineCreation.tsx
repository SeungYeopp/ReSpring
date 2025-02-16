"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Calendar } from "lucide-react"

interface TimelineCreationProps {
  onNext: () => void
  onPrevious: () => void
}

const TimelineCreation: React.FC<TimelineCreationProps> = ({ onNext, onPrevious }) => {
  const [events, setEvents] = useState<Array<{ title: string; date: string }>>([])
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && date) {
      setEvents([...events, { title, date }])
      setTitle("")
      setDate("")
    }
  }

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index))
  }

  const mockEvents = [
    { title: "생일", date: "1964-03-15" },
    { title: "대학 입학", date: "1984-03-15" },
    { title: "첫 직장 입사", date: "1990-03-15" },
    { title: "은퇴", date: "2025-02-11" },
  ]

  const displayEvents = events.length > 0 ? events : mockEvents

  return (
    <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto px-4 md:px-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#000000] text-center">
          당신의 인생을 발자취로 남겨보세요!
        </h2>
        <p className="text-sm md:text-base text-[#7b7878] text-center mt-2">
          중요한 사건들을 추가해 내 발자취를 한 번에 확인해보세요.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
        <div className="w-full md:w-1/2">
          <div className="relative px-4">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#dfeaa5]" />
            <AnimatePresence>
              {displayEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 ml-8 relative"
                >
                  <div className="absolute -left-10 top-0 w-6 h-6 bg-[#96b23c] rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#f0f0f0] p-3 md:p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-[#000000] text-sm md:text-base">{event.title}</h3>
                      {events.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEvent(index)}
                          className="text-[#638d3e] hover:text-[#96b23c] hover:bg-[#dfeaa5] p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-[#7b7878]">{event.date}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 px-4">
              <Label htmlFor="event-title" className="text-sm text-[#000000]">
                사건 제목
              </Label>
              <Input
                id="event-title"
                type="text"
                placeholder="예: 첫 직장 입사, 1986년 대학 졸업"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#f0f0f0] text-[#000000]"
                required
              />
            </div>
            <div className="space-y-2 px-4">
              <Label htmlFor="event-date" className="text-sm text-[#000000]">
                날짜
              </Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[#f0f0f0] text-[#000000]"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e] flex items-center justify-center py-2 md:py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              발자취 남기기
            </Button>
          </form>
        </div> */}
      </div>

      <div className="space-y-4 md:flex md:flex-row-reverse md:space-y-0 md:space-x-4 md:space-x-reverse">
        <Button
          onClick={onNext}
          className="w-full md:w-1/2 bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e] py-2 md:py-3"
        >
          다음 단계로
        </Button>
        <Button
          onClick={onPrevious}
          variant="outline"
          className="w-full md:w-1/2 text-[#638d3e] hover:text-[#96b23c] border-[#dfeaa5] py-2 md:py-3"
        >
          이전 단계로
        </Button>
      </div>
    </div>
  )
}

export default TimelineCreation

