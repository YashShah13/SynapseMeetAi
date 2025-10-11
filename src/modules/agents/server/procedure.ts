import {number, z} from "zod";
import {db} from "@/db";
import {agents} from "@/db/schema";
import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { and,count,desc,eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { Search } from "lucide-react";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE} from "@/constants";
import { TRPCError } from "@trpc/server";



export const agentsRouter = createTRPCRouter({
  //TODO: Change 'getOne' to use 'protectedProcedure'
     getOne: protectedProcedure
     .input(z.object({id: z.string() }))
     .query(async ({input,ctx}) => {
     const [existingAgent]= await db
      .select({
        //TODO: Change to actual account
        meetingCount: sql<number>`5`,
        ...getTableColumns(agents),
      }

      )
      .from(agents)
      .where(
        and(
          eq(agents.id, input.id),
          eq(agents.userId, ctx.auth.user.id),
        )
      );

      if(!existingAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message:"Agent not found"});
      }

      return existingAgent;
 }),
  //TODO: Change 'getMany' to use 'protectedProcedure'
 getMany: protectedProcedure
 .input(z.object ({
  page: z.number().default(DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
  Search: z.string().nullish()

 })
)
 .query(async ( {ctx, input})=> {
    const {Search, page, pageSize} = input;
    const data= await db 
      .select({
        //TODO: Change to actual account
        meetingCount: sql<number>`5`,
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(
        and (
          eq(agents.userId, ctx.auth.user.id),
          Search ? ilike(agents.name,`%${Search}%`) : undefined,
        )
      )
      .orderBy(desc(agents.createdAt), desc(agents.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    const [total] = await db
       .select ({count: count ()})
       .from (agents)
       .where(
        and(
          eq(agents.userId, ctx.auth.user.id),
          Search ? ilike(agents.name,`%${Search}%`) : undefined,
        )
       );

      const totalPages = Math.ceil(total.count / pageSize);
      
      return {
        items: data,
        total: total.count,
        totalPages,
      };
 }),

  create: protectedProcedure
  .input(agentsInsertSchema)
  .mutation(async({ input, ctx }) => {
    const [createdAgent] = await db
       .insert(agents)
       .values({
        name: input.name,
        userId: ctx.auth.user.id,
        instruction: input.instructions,
       })
       .returning();

    return createdAgent;
  }),
});
