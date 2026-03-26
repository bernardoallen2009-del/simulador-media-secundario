import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, simulacoes, InsertSimulacao, Simulacao } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Funcoes de simulacao
export async function salvarSimulacao(userId: number, cursoId: string, dadosJson: string, mediaFinal: string | null): Promise<Simulacao | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save simulation: database not available");
    return null;
  }

  try {
    const result = await db.insert(simulacoes).values({
      userId,
      cursoId,
      dadosJson,
      mediaFinal: mediaFinal ?? null,
    });
    
    const id = (result as any)[0]?.insertId;
    if (!id) return null;
    
    const saved = await db.select().from(simulacoes).where(eq(simulacoes.id, id as number)).limit(1);
    return saved.length > 0 ? saved[0] : null;
  } catch (error) {
    console.error("[Database] Failed to save simulation:", error);
    return null;
  }
}

export async function obterSimulacoes(userId: number): Promise<Simulacao[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get simulations: database not available");
    return [];
  }

  try {
    return await db.select().from(simulacoes).where(eq(simulacoes.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get simulations:", error);
    return [];
  }
}

export async function obterSimulacao(id: number, userId: number): Promise<Simulacao | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get simulation: database not available");
    return null;
  }

  try {
    const result = await db.select().from(simulacoes).where(
      eq(simulacoes.id, id)
    ).limit(1);
    
    if (result.length === 0) return null;
    if (result[0].userId !== userId) return null;
    
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get simulation:", error);
    return null;
  }
}
