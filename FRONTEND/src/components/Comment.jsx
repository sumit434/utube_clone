import React from "react";

export default function Comment({ comment, user, comments, setComments, api }) {
  const isAuthor = user && comment.author?._id === user._id; 

  const handleDeleteComment = async () => {
    try {
      await api.delete(`/comments/${comment._id}`);
      setComments(comments.filter((c) => c._id !== comment._id)); 
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
        {comment.author?.username?.charAt(0).toUpperCase() || "U"}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">
            @{comment.author?.username || "Anonymous"}
          </span>
          {isAuthor && ( 
            <button
              onClick={handleDeleteComment}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Delete
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
      </div>
    </div>
  );
}
