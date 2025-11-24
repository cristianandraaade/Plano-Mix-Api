import type { Token } from "../Types/Token.ts";
import { ResetPassword } from "../Lib/Database/Prisma.ts";

class TokenRepository {

    public save = async (tokenData: Token): Promise<void> => {
        await ResetPassword.create({
            data: tokenData
        });
    }

    public exists = async (token_hash: string): Promise<number> => {
        return await ResetPassword.count({
            where: {token_hash: token_hash}
        });
    }

    public getByHash = async (hash: string): Promise<Token | null> => {
        return await ResetPassword.findFirst({
            where: {token_hash: hash}
        });
    }

    public setAsUsed = async (hash: string) => {
        const tokenToUpdate = await this.getByHash(hash);
        await ResetPassword.update({
            data: { used: true },
            where: { id: tokenToUpdate?.id!},
        })
    }
}

export default TokenRepository;