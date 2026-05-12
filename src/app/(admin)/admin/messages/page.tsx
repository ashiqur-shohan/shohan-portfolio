import { getAdminMessages } from "@/lib/queries/admin";
import { MarkReadButton } from "@/components/admin/mark-read-button";
import { Badge } from "@/components/ui/badge";

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      {messages.length === 0 ? (
        <p className="text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg border bg-card p-5 ${msg.read ? "border-border opacity-70" : "border-brand/30"}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{msg.name}</p>
                    {!msg.read && <Badge variant="default" className="text-xs">New</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{msg.email}</p>
                  {msg.subject && <p className="text-xs text-muted-foreground mt-0.5">Subject: {msg.subject}</p>}
                </div>
                <p className="text-xs text-muted-foreground font-mono shrink-0">
                  {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
              {!msg.read && (
                <div className="mt-3">
                  <MarkReadButton id={msg.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
