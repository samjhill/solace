import { asc } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(req: Request) {
  const { searchTerm = '', limit = 10, page = 1 } = req.url
    .split('?')[1]
    ?.split('&')
    .reduce((params: Record<string, string>, param) => {
      const [key, value] = param.split('=');
      params[key] = value;
      return params;
    }, {});

  const skip = (Number(page) - 1) * Number(limit);

  try {
    const data = await db
      .select()
      .from(advocates)
      .orderBy(asc(advocates.id))
      .limit(limit) // the number of rows to return
      // .offset(4); // the number of rows to skip

    return Response.json({
      data,
      totalAdvocates: data.length,
      totalPages: Math.ceil(Number(data.length) / Number(limit)),
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Failed to fetch advocates' }, { status: 500 });
  }
}
