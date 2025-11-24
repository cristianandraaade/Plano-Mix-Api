import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const User = prisma.user;
export const Shopping = prisma.shopping;
export const ShoppingStore = prisma.shopping_store;
export const Store = prisma.store;
export const Classification = prisma.classification;
export const Segment = prisma.segment;
export const Activity = prisma.activity;
export const Mix = prisma.mix;
export const Visit = prisma.visit;
export const ResetPassword = prisma.reset_password;
export const History = prisma.history;
export default prisma;
