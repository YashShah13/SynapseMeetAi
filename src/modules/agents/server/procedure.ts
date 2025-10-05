import {z} from "zod";
import {db} from "@/db";
import {agents} from "@/db/schema";
import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { eq } from "drizzle-orm";


export const agentsRouter = createTRPCRouter({
  //TODO: Change 'getOne' to use 'protectedProcedure'
     getOne: protectedProcedure.input(z.object({id: z.string() })).query(async ({input}) => {
     const [existingAgent]= await db
      .select()
      .from(agents)
      .where(eq(agents.id, input.id))

      return existingAgent;
 }),
  //TODO: Change 'getMany' to use 'protectedProcedure'
 getMany: protectedProcedure.query(async ()=> {
    const data= await db 
      .select()
      .from(agents);
      return data;
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
