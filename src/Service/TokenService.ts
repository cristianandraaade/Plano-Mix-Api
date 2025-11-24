import UsersService from "./UsersService.ts";
import type { Token } from "../Types/Token.ts";
import { randomBytes, createHash} from "crypto";
import TokenRepository from "../Repository/TokenRepository.ts";

class TokenService {

    private repository: TokenRepository;

    public constructor(){
        this.repository = new TokenRepository();
    }

    public generateToken = async (email: string): Promise<string> => {
        const token = randomBytes(32).toString("hex");
        await this.saveToken(email, token);
        return token;
    }

    private saveToken = async (email: string, token: string): Promise<void> => {
        const user = await new UsersService().getByEmail(email);
        const hash = createHash("sha256").update(token).digest("hex");
        const tokenToSave: Token = {
            user_id: user.id!,
            token_hash: hash,
            expires_at: new Date(Date.now() + 1000 * 60 * 10),
            used: false
        }

        await this.repository.save(tokenToSave);
    }

    public validate = async (request_token: string): Promise<boolean> => {
        if(!request_token == null){
            return false;
        }

        const hash = createHash("sha256").update(request_token).digest("hex");
        const exists = await this.repository.exists(hash) == 1;
        if(exists == false){
            return false;
        }
        
        const tokenDb = await this.repository.getByHash(hash);
        if(tokenDb!.used == true){
            return false;
        }

        if(new Date() > tokenDb!.expires_at){
            return false
        }

        return true;
    }

    public getUserFromToken = async  (token: string): Promise<number> => {
        const hash = createHash("sha256").update(token).digest("hex");   
        const tokenData = await this.repository.getByHash(hash);
        return tokenData!.user_id;
    }

    public setAsUsed = async (token: string) => {
        const hash = createHash("sha256").update(token).digest("hex");
        await this.repository.setAsUsed(hash);
    }
}

export default TokenService;
