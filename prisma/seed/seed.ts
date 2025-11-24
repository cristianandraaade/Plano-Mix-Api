import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

function extractArray(text: string, key: string) {
    // Regex para pegar o conteúdo do array
    const regex = new RegExp(`"${key}"\\s*:\\s*\\[(.*?)\\]`, "s");
    const match = text.match(regex);

    if (!match) {
        throw new Error(`Array "${key}" não encontrado no arquivo TXT`);
    }

    // Adiciona colchetes para converter
    return JSON.parse("[" + match[1].trim() + "]");
}

async function main() {
    const txt = fs.readFileSync("./prisma/seed/classification.txt", "utf8");

    console.log("Extraindo dados do TXT...");

    const classification = extractArray(txt, "classification");
    const segment = extractArray(txt, "segment");
    const activity = extractArray(txt, "activity");

    console.log("Limpando tabelas...");

    await prisma.store.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.segment.deleteMany();
    await prisma.classification.deleteMany();

    console.log("Inserindo classification...");
    await prisma.classification.createMany({ data: classification });

    console.log("Inserindo segment...");
    await prisma.segment.createMany({ data: segment });

    console.log("Inserindo activity...");
    await prisma.activity.createMany({ data: activity });

    console.log("SEED FINALIZADO COM SUCESSO!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
