import { format } from "date-fns"

type MessageProps = {
  text: string
  sender: "me" | "other"
  timestamp: Date
}

export default function Message({ text, sender, timestamp }: MessageProps) {
  const isMe = sender === "me"

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isMe ? "bg-gray-200 text-gray-800" : "bg-white border border-gray-200 text-gray-800"
        }`}
      >
        <p className="text-sm sm:text-base">{text}</p>
        <p className={`text-xs mt-1 ${isMe ? "text-gray-500" : "text-gray-400"}`}>{format(timestamp, "HH:mm")}</p>
      </div>
    </div>
  )
}
