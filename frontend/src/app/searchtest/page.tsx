'use client'

import {useState, useEffect} from "react"
import { useSearchParams } from "next/navigation" // URL에서 검색 관련 단어를 받아오기 위한 도구.
import {SearchProfileCard} from "@/app/searchtest/components/SearchProfileCard"
import {SearchBar} from "@/components/custom/SearchBar"
import {profileData as mockProfileData, iProfile} from "@/mocks/searchbar-mockdata"

const SearchPage = () => {
    const [profileData, setProfileData] = useState<iProfile[]>(mockProfileData)
    const searchParams = useSearchParams()

    const searchQuery = searchParams && searchParams.get("q");
    
    // 아래는 searchQuery가 바뀔때마다 실행.
    useEffect(() => {
        const handleSearch = () => {
            // foundUsers는 mock 데이터 중 searchQuery를 포함한 데이터를 필터링한 결과.
            const foundUsers = mockProfileData.filter((user) => {
                if(searchQuery){
                    return (
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }else{
                    return true; // 따로 검색을 하지 않은 경우 모든 mockProfileData를 가져오도록 한다.
                }
            });
            setProfileData(foundUsers) // 현재 발견한 프로필을 가져온다.
        }

        handleSearch(); // 위에서 정의한 함수 실행.
    }, [searchQuery]) // searchQuery 내용이 바뀔 때마다 useEffect 내용이 실행된다.

    const allUsers = profileData.length;

    return (
        <section className="h-[100vh] w-screen px-[2rem] md:px-[6rem] mt-[100px]">
            <p className="mb-10 ">Showing {allUsers} {allUsers > 1 ? "Users" : "User"}</p>
            <SearchBar defaultValue={""} placeholder={"testing"}></SearchBar>

            {/* rendering cards conditionally*/}

            <div className="mt-8">
                {allUsers === 0 ? 
                <p>검색 결과가 없습니다.</p>
                : (
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
                        {
                            // profileData 내의 모든 데이터를 SearchProfileCard 형식으로 출력.
                            profileData.map(({username, role, name, photo, email} : iProfile) => {
                                return (
                                    <div key={username}>
                                        <SearchProfileCard name={name} role={role} photo={photo} email={email} username={username} />
                                    </div>
                                )
                            })
                        }
                    </div>
                )}
            </div>
        </section>
    )
}

export default SearchPage;