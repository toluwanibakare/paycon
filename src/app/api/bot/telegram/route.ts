import { requireAuth } from "@/lib/api-auth";

export async function POST(request: Request) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { message, callbackQuery } = body;

    if (message?.text) {
      const text = message.text;
      const chatId = message.chat.id;
      const userId = message.from?.id;

      if (text.startsWith("/start")) {
        return handleStart(chatId, userId, text);
      }
      if (text.startsWith("/create")) {
        return handleCreate(chatId, userId);
      }
      if (text.startsWith("/join")) {
        const code = text.split(" ")[1];
        return handleJoin(chatId, userId, code);
      }
      if (text.startsWith("/explore")) {
        return handleExplore(chatId);
      }
      if (text.startsWith("/status")) {
        const code = text.split(" ")[1];
        return handleStatus(chatId, userId, code);
      }
      if (text.startsWith("/mygroups")) {
        return handleMyGroups(chatId, userId);
      }
    }

    if (callbackQuery?.data) {
      return handleCallback(callbackQuery);
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}

function sendMessage(chatId: number, text: string, replyMarkup?: object) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(console.error);
}

async function handleStart(chatId: number, _userId: number, text: string) {
  const joinCode = text.split(" ")[1]?.replace("join_", "");
  if (joinCode) {
    // TODO: handle deep link join
  }

  sendMessage(
    chatId,
    "💰 *Paycon — Group Savings Agent*\n\n"
      + "I help you run Ajo/Esusu, goal pools, and emergency funds on Celo.\n\n"
      + "🏠 /create — Start a savings group\n"
      + "🔍 /join CODE — Join a group\n"
      + "📋 /explore — Browse open groups\n"
      + "📁 /mygroups — Your groups\n"
      + "ℹ️ /help — How it works",
    {
      inline_keyboard: [
        [{ text: "🏠 Create Group", callback_data: "create" }],
        [{ text: "🔍 Join Group", callback_data: "join" }],
        [{ text: "📋 Explore Groups", callback_data: "explore" }],
        [{ text: "📁 My Groups", callback_data: "mygroups" }],
      ],
    },
  );
  return Response.json({ ok: true });
}

async function handleCreate(chatId: number, _userId: number) {
  sendMessage(
    chatId,
    "Let's set up your group! First, what type of savings?",
    {
      inline_keyboard: [
        [{ text: "🔄 Ajo (Rotating)", callback_data: "type_ajo" }],
        [{ text: "🎯 Goal Pool", callback_data: "type_goal" }],
        [{ text: "🚨 Emergency Fund", callback_data: "type_emergency" }],
        [{ text: "💪 Flex Savings", callback_data: "type_flex" }],
      ],
    },
  );
  return Response.json({ ok: true });
}

async function handleJoin(chatId: number, _userId: number, code: string) {
  if (!code) {
    sendMessage(chatId, "Usage: `/join CODE`\n\nExample: `/join SAVE-ABC123`");
    return Response.json({ ok: true });
  }
  // TODO: validate invite code, add member
  sendMessage(chatId, `🔍 Looking up group *${code}*...`);
  return Response.json({ ok: true });
}

async function handleExplore(chatId: number) {
  // TODO: fetch public groups from API
  sendMessage(chatId, "📋 *Open Savings Groups*\n\nNo groups available yet. Be the first — /create");
  return Response.json({ ok: true });
}

async function handleStatus(chatId: number, _userId: number, code: string) {
  if (!code) {
    sendMessage(chatId, "Usage: `/status CODE`\n\nExample: `/status SAVE-ABC123`");
    return Response.json({ ok: true });
  }
  // TODO: fetch group status
  sendMessage(chatId, `📊 Fetching status for *${code}*...`);
  return Response.json({ ok: true });
}

async function handleMyGroups(chatId: number, _userId: number) {
  // TODO: fetch user's groups
  sendMessage(chatId, "📁 *Your Groups*\n\nYou haven't joined any groups yet.\n/explore to find one or /create to start one.");
  return Response.json({ ok: true });
}

async function handleCallback(callbackQuery: { _id: string; data: string; message?: { chat: { id: number } } }) {
  const chatId = callbackQuery.message?.chat.id;
  if (!chatId) return Response.json({ ok: true });

  const data = callbackQuery.data;
  if (data === "create") await handleCreate(chatId, 0);
  if (data === "explore") await handleExplore(chatId);
  if (data === "mygroups") await handleMyGroups(chatId, 0);
  if (data === "join") sendMessage(chatId, "Send `/join CODE` with the invite code.");

  return Response.json({ ok: true });
}
