export const theme = {
  colors: {
    background: "#F8EFE3",
    messageBubble: {
      self: "#E6DCD3",
      other: "#E0E4DC",
    },
    button: {
      primary: "#D4AFAF",
      hover: "#CBA586",
    },
    text: {
      primary: "#7A7363",
      secondary: "#9CA3AF",
    },
  },
  styles: {
    button: {
      common: "rounded-full bg-[#D4AFAF] text-white shadow-lg hover:bg-[#CBA586] transition-all duration-300",
      hover: "hover:scale-105",
      tap: "active:scale-95",
    },
    input: {
      common: "rounded-xl bg-white/50 px-4 py-2 text-[#7A7363] shadow-sm border border-[#E6DCD3] focus:outline-none focus:ring-2 focus:ring-[#D4AFAF]",
    },
    messageBubble: {
      common: "rounded-xl p-3 shadow-sm max-w-[70%]",
      self: "bg-[#E6DCD3] text-[#7A7363]",
      other: "bg-[#E0E4DC] text-[#7A7363]",
    },
    timeText: {
      self: "text-[#7A7363]/70",
      other: "text-[#9CA3AF]",
    },
  },
} 