import React from "react";

export default function Comment({ comment }) {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
        {comment.author?.username?.charAt(0).toUpperCase() || "U"}
      </div>
      <div className="flex-1">
        <span className="font-semibold text-sm">
          @{comment.author?.username || "Anonymous"}
        </span>
        <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
      </div>
    </div>
  );
}
