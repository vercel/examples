import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _type, slug } = body;

    // Verify webhook secret for security
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // Navigation changes revalidate navigation cache tag
    if (_type === "navigation") {
      revalidateTag("navigation");
      return NextResponse.json({
        revalidated: true,
        scope: "navigation",
        type: _type,
      });
    }

    // Footer changes revalidate footer cache tag
    if (_type === "footer") {
      revalidateTag("footer");
      return NextResponse.json({
        revalidated: true,
        scope: "footer",
        type: _type,
      });
    }

    // Post changes revalidate specific routes
    if (_type === "post" && slug?.current) {
      revalidatePath(`/posts/${slug.current}`);
      revalidatePath("/"); // Home page shows posts list
      return NextResponse.json({
        revalidated: true,
        paths: [`/posts/${slug.current}`, "/"],
        type: _type,
      });
    }

    // Page changes revalidate specific routes
    if (_type === "page" && slug?.current) {
      revalidatePath(`/${slug.current}`);
      return NextResponse.json({
        revalidated: true,
        paths: [`/${slug.current}`],
        type: _type,
      });
    }

    return NextResponse.json({
      message: "No revalidation needed",
      type: _type,
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
