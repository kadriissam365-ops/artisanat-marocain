import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { errorResponse } from "@/lib/api-utils"

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: errorResponse("Unauthorized", 401), session: null }
  }
  if (session.user.role !== "ADMIN") {
    return { error: errorResponse("Forbidden", 403), session: null }
  }
  return { error: null, session }
}
