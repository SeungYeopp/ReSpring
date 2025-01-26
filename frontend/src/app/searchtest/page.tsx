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
    console.log("검색한 단어 : " + searchQuery);
    
    useEffect(() => {
        const handleSearch = () => {
            const foundUsers = mockProfileData.filter((user) => {
                if(searchQuery){
                    return (
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }else{
                    return true;
                }
            });
            setProfileData(foundUsers)
        }

        handleSearch();
    }, [searchQuery])

    const allUsers = profileData.length;

    return (
        <section className="h-[100vh] w-screen px-[2rem] md:px-[6rem] mt-[100px]">
            <p className="mb-10 ">Showing {allUsers} {allUsers > 1 ? "Users" : "User"}</p>
            <SearchBar defaultValue={""}></SearchBar>

            {/* rendering cards conditionally*/}

            <div className="mt-8">
                {allUsers === 0 ? 
                <p>No result was returned</p>
                : (
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
                        {
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