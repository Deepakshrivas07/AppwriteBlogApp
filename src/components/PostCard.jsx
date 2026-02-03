import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage }) { //appwrite uses id  as  $id..  
  const imageUrl = featuredImage ? appwriteService.getFileView(featuredImage) : "/path/to/default-image.png";

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-white rounded-xl p-4 ">
        <div className="w-full justify-center mb-4">
          <img src={imageUrl} alt={title} className="rounded-xl" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
