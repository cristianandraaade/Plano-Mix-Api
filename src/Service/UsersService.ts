import z, { email } from "zod";
import { hash, compare } from 'bcrypt';
import Mailer from "../Lib/Mail/Mailer.ts";
import TokenService from "./TokenService.ts";
import UsersRepository from "../Repository/UsersRepository.ts";
import type { User, AuthData, UserRead, UserResetPass, Stats } from "../Types/User.ts";

class UsersService {

	private repository: UsersRepository;

	constructor() {
		this.repository = new UsersRepository();
	}


	public getAllUsers = async (): Promise<UserRead[]> => {
		return await this.repository.getAll();
	}

	public getStats = async (): Promise<Stats> => {
		return await this.repository.getStats();
	}

	public canValidateUser(reqBody: Partial<User>, mode: "create" | "update"): boolean {
		const createUserSchema = z.object({
			name: z.string().min(1),
			email: z.string().email(),
			password: z.string().min(8),
			type: z.enum(["default", "admin"]),
		});

		const updateUserSchema = z.object({
			name: z.string().min(1).optional(),
			email: z.string().email().optional(),
			type: z.enum(["default", "admin"]).optional(),
		});

		const schema = mode === "create" ? createUserSchema : updateUserSchema;
		return schema.safeParse(reqBody).success;
	}

	public canCheckAuth(reqBody?: Partial<AuthData>): boolean {
		const validations = z.object({
			email: z.email(),
			password: z.string()
		})
		return validations.safeParse(reqBody).success;
	}

	public canSendResetEmail(reqBody?: Partial<{ email?: string }>): boolean {
		const validtions = z.object({
			email: z.email(),
		});
		return validtions.safeParse(reqBody).success;
	}

	public userExists = async (email: string): Promise<boolean> => {
		return await this.repository.exists(email) > 0;
	}

	public create = async (userData: User): Promise<number> => {
		userData.password = await hash(userData.password, 12);
		return await this.repository.create(userData);
	}

	public updateUser = async (userData: User, id: number): Promise<boolean> => {
		return await this.repository.update(userData, id);
	}

	public auth = async (authData: AuthData): Promise<boolean> => {
		const userPass = await this.repository.getPassByEmail(authData.email);
		const passwordIsCorrect = await compare(authData.password, userPass);
		return passwordIsCorrect;
	}

	public getByEmail = async (email: string): Promise<UserRead> => {
		return await this.repository.getByEmail(email);
	}

	public sendResetEmail = async (email: string) => {
		const userExists = await this.userExists(email);
		if (userExists == false) {
			return;
		}

		const token = await new TokenService().generateToken(email);
		await this.sendResetPasswordLink(email, token);
	}

	private sendResetPasswordLink = async (emailTo: string, token: string) => {
		const urlType = process.env.ENVIRONMENT == "development" ? "http://localhost:5173" : "https://plano-mix.com/";
		const urlReset = `${urlType}/redefinir-senha?token=${token}`
		const emailBody = `
			<h1>Redefinir senha!</h1>
			<p>Se não foi você quem pediu esse e-mail, fique tranquilo e pode ignorar esse e-mail!</p>
			<p>Se você quer trocar sua senha, so clicar no link abaixo!</p>
			<a href="${urlReset}">Trocar Senha</a>
		`;
		new Mailer().send(emailTo, 'Redefinir Senha', emailBody)
	}

	public canResetPassword = async (idUser: number, body?: UserResetPass): Promise<boolean> => {
		const validtions = z.object({
			password_old: z.string().min(8),
			password_new: z.string().min(8),
		});

		if (validtions.safeParse(body).success == false) {
			return false;
		}

		const oldPass = await this.repository.getPasswordById(idUser);
		const passwordIsCorrect = await compare(body?.password_old!, oldPass);
		if (passwordIsCorrect == false) {
			return false;
		}

		return true;
	}

	public resetPassword = async (passToChange: string, userId: number) => {
		const hashNewPassword = await hash(passToChange, 12);
		await this.repository.updatePasswordById(userId, hashNewPassword);
	}

	public deleteUser = async (id: number): Promise<boolean> => {
		return await this.repository.delete(id);
	}
}

export default UsersService;