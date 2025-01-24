// "use client";

// import Image from "next/image";
// import { Heart, MessageCircle } from "lucide-react";
// import type { Post } from "../types/posts";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// interface FollowedPostsProps {
//   posts: Post[];
// }

// export default function FollowedPosts({ posts }: FollowedPostsProps) {
//   return (
//     <div className="space-y-3">
//       {posts.map((post) => (
//         <Card key={post.id} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
//           <CardContent className="p-3">
//             <div className="flex items-center space-x-3 mb-2">
//               <Avatar>
//                 <AvatarImage src={post.author.profileImage} alt={post.author.name} />
//                 <AvatarFallback>{post.author.name[0]}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="text-sm font-medium">{post.author.name}</p>
//                 <p className="text-xs text-muted-foreground">{post.author.generation}</p>
//               </div>
//             </div>
//             <h3 className="font-bold text-sm mb-1">{post.title}</h3>
//             <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
//             <div className="flex items-center gap-4 text-xs text-muted-foreground">
//               <span className="flex items-center gap-1">
//                 <Heart className="w-3 h-3" /> {post.likes}
//               </span>
//               <span className="flex items-center gap-1">
//                 <MessageCircle className="w-3 h-3" /> {post.comments}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }
