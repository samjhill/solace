import { asc, ilike, or } from "drizzle-orm";
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
      .where(searchTerm ?
        or(
          ilike(advocates.firstName, `%${searchTerm}%`),
          ilike(advocates.lastName, `%${searchTerm}%`),
          ilike(advocates.city, `%${searchTerm}%`),
          ilike(advocates.degree, `%${searchTerm}%`),
          // TODO ilike(advocates.phoneNumber, `%${searchTerm}%`)
        )
      : undefined)
      .orderBy(asc(advocates.id))
      .limit(limit)
      .offset(skip); 

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
