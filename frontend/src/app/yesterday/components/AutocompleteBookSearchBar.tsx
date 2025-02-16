"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect, type ChangeEvent } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getAllBooksAutocomplete } from "@/lib/api"
import type { Book, BookAutoComplete } from "@/lib/api"

interface AutocompleteBookSearchBarProps {
  defaultValue: string | null
  placeholder: string
}

export const AutocompleteBookSearchBar = ({ defaultValue, placeholder }: AutocompleteBookSearchBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [inputValue, setInputValue] = useState(defaultValue || "")
  const [suggestions, setSuggestions] = useState<BookAutoComplete[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length >= 2) {
        setIsLoading(true)
        try {
          const results = await getAllBooksAutocomplete(inputValue)
          setSuggestions(results)
        } catch (error) {
          console.error("Error fetching suggestions:", error)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [inputValue])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSearch = (query: string) => {
    if (query) {
      router.push(`${pathname}?q=${encodeURIComponent(query)}`)
    } else {
      router.push(pathname)
    }
  }

  const handleSuggestionClick = (book: BookAutoComplete) => {
    setInputValue(book.title)
    setSuggestions([])
    handleSearch(book.title)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(inputValue)
    }
  }

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch(inputValue)
        }}
        className="relative w-full"
      >
        <Input
          type="text"
          id="inputId"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          className="pr-10 h-12 border-2 rounded-full bg-white placeholder:text-gray-500 border-[#96b23c] w-full"
        />
        <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Search className="h-5 w-5 text-[#96b23c]" />
        </button>
      </form>
      {isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 text-gray-500">검색 중...</div>
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((book) => (
            <li
              key={book.id}
              onClick={() => handleSuggestionClick(book)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{book.title}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

