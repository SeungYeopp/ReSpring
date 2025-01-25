export interface iProfile{
    name: string;
    email: string;
    photo: string;
    username: string;
    role: "FE dev" | "BE dev";
}

export const profileData: iProfile[] = [];

const randomNames = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
    "Kate",
    "Liam",
    "Mia",
    "Noah",
    "Olivia",
    "Peter",
    "Quinn",
    "Rose",
    "Sam",
    "Tina",
    "Uma",
    "Victor",
    "Wendy",
    "Xander",
    "Yara",
    "Zane",
    "Abigail",
    "Benjamin",
    "Chloe",
    "Daniel",
    "Emily",
    "Fiona",
    "George",
    "Hannah",
    "Isaac",
    "Julia",
    "Kevin",
    "Lily",
    "Mason",
    "Nora",
    "Oscar",
    "Penelope",
    "Quentin",
    "Rachel",
    "Simon",
    "Tiffany",
    "Ulysses",
    "Violet",
    "William",
    "Xavier",
    "Yasmine",
    "Zoey",
    "Stephen",
    "Gerrard",
    "Adewale",
]

for(let i=0;i<randomNames.length;i++){
    if(randomNames[i]){
        const profile: iProfile = {
            name: randomNames[i],
            role:
                i % 2 === 0
                ? "FE dev" : "BE dev",
            email: `${randomNames[i].toLowerCase()}@gmail.com`,
            username: `user_${randomNames[i].toLowerCase()}`,
            photo: `https://source.unsplash.com/random/200x200?sig=${i}`,
        };
        profileData.push(profile);
    }else{
        console.error("no name found!");
    }
}