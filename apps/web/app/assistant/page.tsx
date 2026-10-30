import { ChatContainer } from "@/components/chat/ChatContainer";

export const metadata = {
  title: "AI Banking Assistant — BankAssist AI",
  description: "Live banking information chat with grounded regulatory citations and zero-credential protection.",
};

export default function AssistantPage() {
  return (
    <div className="flex-1 flex flex-col">
      <ChatContainer />
    </div>
  );
}
